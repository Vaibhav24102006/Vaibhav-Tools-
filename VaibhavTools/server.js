const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vaibhav-tools-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticateToken(req, res, () => {});
    
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Reject token if issued before password change
    const passwordChangedAt = userDoc.data().passwordChangedAt; // seconds
    if (passwordChangedAt) {
      const tokenIat = req.user.iat; // seconds
      if (tokenIat && tokenIat < passwordChangedAt) {
        return res.status(401).json({ error: 'Credentials have changed. Please sign in again.' });
      }
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin authentication failed' });
  }
};

// Password reset endpoints for admin users
const crypto = require('crypto');

// Request password reset - generates a one-time token (dev: returns link in response and logs it)
app.post('/api/admin/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return res.status(404).json({ error: 'No user found with that email' });

    // For security, we only allow admin resets via this route
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    if (!userData.isAdmin) return res.status(403).json({ error: 'Admin account required' });

    // Create secure token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiry = Date.now() + (60 * 60 * 1000); // 1 hour

    await usersRef.doc(userDoc.id).update({ resetTokenHash: tokenHash, resetTokenExpiry: expiry });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontend}/admin/reset-password?token=${token}&id=${userDoc.id}`;

    // In production: send resetLink via email. For now, return it in response and log.
    console.log('Password reset link for', email, resetLink);

    res.json({ message: 'Password reset link generated', resetLink });
  } catch (err) {
    console.error('request-password-reset error:', err);
    res.status(500).json({ error: 'Failed to generate reset link' });
  }
});

// Reset password - validate token and set new bcrypt-hashed password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    if (!id || !token || !newPassword) return res.status(400).json({ error: 'id, token and newPassword are required' });

    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const data = userDoc.data();
    if (!data.resetTokenHash || !data.resetTokenExpiry) return res.status(400).json({ error: 'No reset requested' });
    if (Date.now() > data.resetTokenExpiry) return res.status(400).json({ error: 'Reset token expired' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (tokenHash !== data.resetTokenHash) return res.status(400).json({ error: 'Invalid reset token' });

    // Set new password
    const hashed = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashed, resetTokenHash: admin.firestore.FieldValue.delete(), resetTokenExpiry: admin.firestore.FieldValue.delete(), passwordChangedAt: Math.floor(Date.now() / 1000) });

    // Optionally revoke sessions for any linked Auth uid
    if (data.uid) {
      try {
        await admin.auth().revokeRefreshTokens(data.uid);
      } catch (err) {
        // ignore
      }
    }

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Routes

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    if (!userData.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { uid: userDoc.id, email: userData.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        uid: userDoc.id,
        email: userData.email,
        name: userData.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Products
app.get('/api/products', async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Admin: Add Product
app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Validation
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const docRef = await db.collection('products').add({
      ...productData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const newProduct = {
      id: docRef.id,
      ...productData
    };
    
    // Emit real-time update
    io.emit('productAdded', newProduct);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Admin: Update Product
app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    await db.collection('products').doc(id).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const updatedProduct = {
      id,
      ...updateData
    };
    
    // Emit real-time update
    io.emit('productUpdated', updatedProduct);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Change Password (authenticated)
app.post('/api/admin/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });

    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const data = userDoc.data();
    const valid = await bcrypt.compare(currentPassword, data.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashed, passwordChangedAt: Math.floor(Date.now() / 1000), updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    // Revoke linked Auth sessions if any
    if (data.uid) {
      try { await admin.auth().revokeRefreshTokens(data.uid); } catch (err) { /* ignore */ }
    }

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('change-password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Admin: Delete Product
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('products').doc(id).delete();
    
    // Emit real-time update
    io.emit('productDeleted', { id });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get Orders
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update Order Status
app.put('/api/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await db.collection('orders').doc(id).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Emit real-time update
    io.emit('orderStatusUpdated', { id, status });
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Customer: Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validation
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }
    
    const orderRef = await db.collection('orders').add({
      ...orderData,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const newOrder = {
      id: orderRef.id,
      ...orderData,
      status: 'pending'
    };
    
    // Emit real-time update to admin
    io.emit('newOrder', newOrder);
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get Dashboard Stats
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const ordersSnapshot = await db.collection('orders').get();
    
    const totalProducts = productsSnapshot.size;
    const totalOrders = ordersSnapshot.size;
    
    let totalRevenue = 0;
    let pendingOrders = 0;
    
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      totalRevenue += order.total || 0;
      if (order.status === 'pending') {
        pendingOrders++;
      }
    });
    
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Vaibhav Tools API is running'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 