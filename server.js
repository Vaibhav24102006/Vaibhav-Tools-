const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const multer = require('multer');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });

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
let serviceAccount;
try {
  // prefer a local file for dev
  serviceAccount = require('./firebase-service-account.json');
} catch (err) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // fallback to existing serviceAccountKey.json
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (fallbackErr) {
      console.error('Firebase service account not found. Provide ./firebase-service-account.json, ./serviceAccountKey.json, or FIREBASE_SERVICE_ACCOUNT env var.');
      process.exit(1);
    }
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vaibhav-tools-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (!res.headersSent) {
      res.status(401).json({ error: "Missing or malformed token" });
    }
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (!res.headersSent) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
};

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    // First verify the JWT token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (!res.headersSent) {
        res.status(401).json({ error: "Missing or malformed token" });
      }
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      if (!res.headersSent) {
        res.status(401).json({ error: "Invalid token" });
      }
      return;
    }

    // Then check admin status
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      if (!res.headersSent) {
        res.status(403).json({ error: 'Admin access required' });
      }
      return;
    }

    next();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Admin authentication failed' });
    }
  }
};

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
    // Login error handled
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
    // Get products error handled
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
    // Add product error handled
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
    // Update product error handled
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Password reset endpoints for admin users (mirror behavior in VaibhavTools/server.js)
// Request password reset - generates a one-time token (dev: returns link in response and logs it)
app.post('/api/admin/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return res.status(404).json({ error: 'No user found with that email' });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    if (!userData.isAdmin) return res.status(403).json({ error: 'Admin account required' });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiry = Date.now() + (60 * 60 * 1000); // 1 hour

    await usersRef.doc(userDoc.id).update({ resetTokenHash: tokenHash, resetTokenExpiry: expiry });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontend}/admin/reset-password?token=${token}&id=${userDoc.id}`;

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

    const hashed = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashed, resetTokenHash: admin.firestore.FieldValue.delete(), resetTokenExpiry: admin.firestore.FieldValue.delete(), passwordChangedAt: Math.floor(Date.now() / 1000) });

    if (data.uid) {
      try { await admin.auth().revokeRefreshTokens(data.uid); } catch (err) { /* ignore */ }
    }

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
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
    // Delete product error handled
    res.status(500).json({ error: 'Failed to delete product' });
  }

});

// Admin: Bulk Import Products
app.post('/api/admin/products/import', authenticateAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  let products = [];

  try {
    if (ext === '.docx') {
      // Parse Word (.docx): convert to HTML then extract table rows
      const { value: html } = await mammoth.convertToHtml({ path: filePath });
      const $ = cheerio.load(html);
      const table = $('table').first();
      let headers = [];

      table.find('tr').each((i, row) => {
        if (i === 0) {
          // Header row: collect column names
          $(row).find('td, th').each((j, cell) => {
            headers[j] = $(cell).text().trim();
          });
        } else {
          // Data rows: build object mapping header->cell text
          const rowData = {};
          $(row).find('td').each((j, cell) => {
            const key = headers[j];
            if (key) {
              rowData[key] = $(cell).text().trim();
            }
          });
          if (Object.keys(rowData).length > 0) {
            products.push(rowData);
          }
        }
      });
    } else if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
      // Parse Excel (.xlsx) or CSV
      // SheetJS (XLSX) handles most complexity. defval: '' ensures we get empty strings for empty cells.
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      products = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    let insertedCount = 0;
    let skippedCount = 0;
    let errors = [];

    // Helper: Normalize header keys (trim, lowercase, remove special chars)
    const normalizeKey = (k) => {
      if (typeof k !== 'string') return '';
      // Remove BOM, trim, lowercase, keep only alphanumeric
      return k.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
    };

    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      const rowNumber = i + 1;

      // 1. Create Normalized Key Map for the Row
      // This allows us to find 'Price' even if the CSV has 'Price  ' or 'price ($)'
      const normMap = {};
      Object.keys(row).forEach((origKey) => {
        const cleanKey = normalizeKey(origKey);
        if (cleanKey) {
          normMap[cleanKey] = row[origKey];
        }
      });

      // Helper to fetch value from multiple possible header names
      const getValue = (...candidates) => {
        for (const c of candidates) {
          const k = normalizeKey(c);
          if (normMap[k] !== undefined) return normMap[k];
        }
        return undefined;
      };

      // 2. Extract & Normalize Fields
      // Name & Category (Required later)
      let name = getValue('name', 'product name', 'productname', 'item');
      name = name ? String(name).trim() : '';

      let category = getValue('category', 'cat', 'type', 'category name');
      category = category ? String(category).trim() : '';

      // Brand: Default to "VaibhavTools"
      let brand = getValue('brand', 'manufacturer', 'company', 'make');
      brand = brand ? String(brand).trim() : '';
      if (!brand) {
        brand = 'VaibhavTools';
      }

      // Price: Default to 1
      let priceRaw = getValue('price', 'mrp', 'cost', 'amount', 'rate');
      let price = 1;
      if (priceRaw !== undefined && priceRaw !== null && priceRaw !== '') {
        const cleanedPrice = String(priceRaw).replace(/[^0-9.]/g, ''); // Allow '1,200.00' -> '1200.00' if we strip commas? logic below strips everything not digit or dot
        // Better: replace(/[^0-9.]/g, '') removes commas. So '1,000' becomes '1000' (good).
        // Check for multiple dots? parseFloat handles '1.2.3' as '1.2' usually.
        const parsedPrice = parseFloat(cleanedPrice);
        if (!isNaN(parsedPrice) && parsedPrice >= 0) {
          price = parsedPrice;
        }
      }

      // Stock: Default to 0
      let stockRaw = getValue('stock', 'instock', 'quantity', 'qty', 'count');
      let inStock = 0;
      if (stockRaw !== undefined && stockRaw !== null && stockRaw !== '') {
        const cleanedStock = String(stockRaw).replace(/[^0-9]/g, '');
        const parsedStock = parseInt(cleanedStock, 10);
        if (!isNaN(parsedStock) && parsedStock >= 0) {
          inStock = parsedStock;
        }
      }

      // Description
      let description = getValue('description', 'desc', 'details', 'info');
      description = description ? String(description).trim() : '';

      // 3. Validation
      // Only reject if Name or Category is missing
      if (!name || !category) {
        skippedCount++;
        errors.push({
          row: rowNumber,
          reason: `Missing required fields: ${!name ? 'Name' : ''} ${!category ? 'Category' : ''}`.trim(),
          data: row // consistent with debugging needs
        });
        continue; // Skip this row
      }

      // 4. Insert (One by one to allow partial success)
      try {
        const productData = {
          name,
          category,
          brand,
          description,
          price,
          inStock,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('products').add(productData);
        insertedCount++;
      } catch (insertErr) {
        console.error(`Row ${rowNumber} insert error:`, insertErr);
        skippedCount++;
        errors.push({
          row: rowNumber,
          reason: 'Database Error',
          details: insertErr.message
        });
      }
    }

    // 5. Response
    // Do not fail the request if some rows failed. Only fail 500 on catastrophic script errors.
    res.json({
      totalRows: products.length,
      insertedCount,
      skippedCount,
      errors
    });

  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  } finally {
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
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
    // Get orders error handled
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
    // Update order status error handled
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
    // Create order error handled
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
    // Dashboard stats error handled
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

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 