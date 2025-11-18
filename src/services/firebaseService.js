import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  runTransaction,
  increment
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { db, auth } from '../firebase';

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.db = db;
  }

  // Authentication Methods
  async signUp(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Products Methods
  async getProducts(category = null, brand = null, limitCount = null) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] firebaseService.getProducts() - START');
        // eslint-disable-next-line no-console
        console.log('[DEBUG] - projectId:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
        // eslint-disable-next-line no-console
        console.log('[DEBUG] - filters: category=', category, 'brand=', brand, 'limit=', limitCount);
      }
      
      // Verify database connection
      if (!this.db) {
        throw new Error('Firebase database not initialized');
      }
      
      // Build query constraints array
      const constraints = [];
      
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      if (brand && brand !== 'undefined' && brand !== null) {
        constraints.push(where('brand', '==', brand));
      }
      
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      
      // Try to add orderBy, but handle if it fails
      let q;
      try {
        q = query(collection(this.db, 'products'), ...constraints, orderBy('createdAt', 'desc'));
      } catch (orderError) {
        console.warn('[DEBUG] orderBy failed, using basic query:', orderError.message);
        q = query(collection(this.db, 'products'), ...constraints);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] - executing Firestore query...');
      }
      
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data
        });
      });
      
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] firebaseService.getProducts() - SUCCESS');
        // eslint-disable-next-line no-console
        console.log('[DEBUG] - fetched count:', products.length);
        // eslint-disable-next-line no-console
        console.log('[DEBUG] - sample products:', products.slice(0, 3));
        
        // Check for data quality issues
        const missingBrands = products.filter(p => !p.brand).length;
        const missingCategories = products.filter(p => !p.category).length;
        if (missingBrands > 0 || missingCategories > 0) {
          // eslint-disable-next-line no-console
          console.warn('[DEBUG] - Data quality issues: missing brands=', missingBrands, 'missing categories=', missingCategories);
        }
        
        // STOCK DEBUG: Show stock field analysis
        console.log('[STOCK-DEBUG] Stock field analysis:');
        products.slice(0, 10).forEach(p => {
          console.log(`  Product: ${p.id} | Name: ${p.name}`);
          console.log(`    stock: ${p.stock} (type: ${typeof p.stock})`);
          console.log(`    stockCount: ${p.stockCount} (type: ${typeof p.stockCount})`);
          console.log(`    quantity: ${p.quantity} (type: ${typeof p.quantity})`);
        });
        
        const withStock = products.filter(p => p.stock !== undefined && p.stock !== null).length;
        const withStockCount = products.filter(p => p.stockCount !== undefined && p.stockCount !== null).length;
        const withQuantity = products.filter(p => p.quantity !== undefined && p.quantity !== null).length;
        console.log(`[STOCK-DEBUG] Field usage: stock=${withStock}, stockCount=${withStockCount}, quantity=${withQuantity}`);
      }
      
      return products;
    } catch (error) {
      console.error('[ERROR] firebaseService.getProducts() - FAILED');
      console.error('[ERROR] - Error details:', error);
      console.error('[ERROR] - Error code:', error.code);
      console.error('[ERROR] - Error message:', error.message);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check Firestore security rules.');
      } else if (error.code === 'unavailable') {
        throw new Error('Firebase service unavailable. Please check your internet connection.');
      } else if (error.message.includes('not initialized')) {
        throw new Error('Firebase not properly configured. Please check your configuration.');
      }
      
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      const docRef = doc(this.db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(this.db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async updateProduct(productId, productData) {
    try {
      const docRef = doc(this.db, 'products', productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId) {
    try {
      const docRef = doc(this.db, 'products', productId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Cart Methods
  async getCart(userId) {
    try {
      const docRef = doc(this.db, 'carts', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  }

  async updateCart(userId, items) {
    try {
      const docRef = doc(this.db, 'carts', userId);
      await setDoc(docRef, {
        items,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      throw new Error('Failed to update cart');
    }
  }

  async clearCart(userId) {
    try {
      const docRef = doc(this.db, 'carts', userId);
      await setDoc(docRef, {
        items: [],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }

  // Orders Methods
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(this.db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrders(userId = null) {
    try {
      let q = collection(this.db, 'orders');
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(this.db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async cancelOrder(orderId) {
    try {
      console.log('[FirebaseService] Cancelling order:', orderId);
      
      // Get order details
      const orderRef = doc(this.db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderSnap.data();
      
      // Check if order can be cancelled
      if (orderData.status === 'cancelled') {
        throw new Error('Order is already cancelled');
      }
      
      if (orderData.status === 'delivered' || orderData.status === 'shipped') {
        throw new Error('Cannot cancel order that has been shipped or delivered');
      }
      
      // Use transaction to update order and restore stock
      await runTransaction(this.db, async (transaction) => {
        // Update order status
        transaction.update(orderRef, {
          status: 'cancelled',
          cancelledAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Restore stock for each item
        if (orderData.items && orderData.items.length > 0) {
          for (const item of orderData.items) {
            if (item.id) {
              const productRef = doc(this.db, 'products', item.id);
              const productSnap = await transaction.get(productRef);
              
              if (productSnap.exists()) {
                const currentStock = productSnap.data().stockCount || 0;
                transaction.update(productRef, {
                  stockCount: currentStock + item.quantity
                });
                console.log(`[FirebaseService] Restored ${item.quantity} units of ${item.name}`);
              }
            }
          }
        }
      });
      
      console.log('[FirebaseService] Order cancelled successfully');
      return { success: true, message: 'Order cancelled and stock restored' };
    } catch (error) {
      console.error('[FirebaseService] Error cancelling order:', error);
      throw error;
    }
  }

  async updateCartItem(userId, productId, quantity) {
    try {
      console.log('[FirebaseService] Updating cart item:', { userId, productId, quantity });
      
      const cartRef = doc(this.db, 'carts', userId);
      const cartSnap = await getDoc(cartRef);
      
      if (!cartSnap.exists()) {
        throw new Error('Cart not found');
      }
      
      const cartData = cartSnap.data();
      let items = cartData.items || [];
      
      if (quantity <= 0) {
        // Remove item
        items = items.filter(item => item.id !== productId);
      } else {
        // Update quantity
        const itemIndex = items.findIndex(item => item.id === productId);
        if (itemIndex >= 0) {
          items[itemIndex].quantity = Math.max(1, Math.min(99, quantity));
        }
      }
      
      await updateDoc(cartRef, {
        items,
        updatedAt: serverTimestamp()
      });
      
      console.log('[FirebaseService] Cart updated successfully');
      return { success: true, items };
    } catch (error) {
      console.error('[FirebaseService] Error updating cart item:', error);
      throw error;
    }
  }

  async createOrderWithStockCheck(orderData) {
    try {
      console.log('[FirebaseService] Creating order with stock check...');
      
      const orderId = `ORD-${Date.now()}`;
      const orderRef = doc(this.db, 'orders', orderId);
      
      // Use transaction to ensure atomic stock updates
      await runTransaction(this.db, async (transaction) => {
        // Check and update stock for each item
        for (const item of orderData.items) {
          if (item.id) {
            const productRef = doc(this.db, 'products', item.id);
            const productSnap = await transaction.get(productRef);
            
            if (!productSnap.exists()) {
              throw new Error(`Product ${item.name} not found`);
            }
            
            const productData = productSnap.data();
            const currentStock = productData.stockCount || 0;
            
            if (currentStock < item.quantity) {
              throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`);
            }
            
            // Decrease stock
            transaction.update(productRef, {
              stockCount: currentStock - item.quantity,
              updatedAt: serverTimestamp()
            });
            
            console.log(`[FirebaseService] Decreased stock for ${item.name}: ${currentStock} -> ${currentStock - item.quantity}`);
          }
        }
        
        // Create order
        transaction.set(orderRef, {
          ...orderData,
          orderId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      console.log('[FirebaseService] Order created with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('[FirebaseService] Error creating order with stock check:', error);
      throw error;
    }
  }

  // Wishlist Methods
  async addToWishlist(userId, product) {
    try {
      console.log('[FirebaseService] Adding to wishlist:', { userId, productId: product.id });
      
      const wishlistRef = doc(this.db, 'wishlists', userId);
      const wishlistSnap = await getDoc(wishlistRef);
      
      let items = [];
      if (wishlistSnap.exists()) {
        items = wishlistSnap.data().items || [];
      }
      
      // Check if already in wishlist
      const exists = items.some(item => item.id === product.id);
      if (exists) {
        console.log('[FirebaseService] Product already in wishlist');
        return { success: true, message: 'Already in wishlist' };
      }
      
      // Add to wishlist
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating,
        addedAt: new Date().toISOString()
      });
      
      await setDoc(wishlistRef, {
        items,
        updatedAt: serverTimestamp()
      });
      
      console.log('[FirebaseService] Added to wishlist successfully');
      return { success: true, message: 'Added to wishlist' };
    } catch (error) {
      console.error('[FirebaseService] Error adding to wishlist:', error);
      throw error;
    }
  }

  // User Profile Methods
  async getUserProfile(userId) {
    try {
      const docRef = doc(this.db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const docRef = doc(this.db, 'users', userId);
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async createUserProfile(userId, profileData) {
    try {
      const docRef = doc(this.db, 'users', userId);
      await setDoc(docRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  // Real-time listeners
  onProductsChange(callback) {
    const q = query(collection(this.db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(products);
    });
  }

  onCartChange(userId, callback) {
    const docRef = doc(this.db, 'carts', userId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    });
  }

  // Contact/Feedback Methods
  async submitContactMessage({ name, email, phone = '', message }) {
    try {
      if (!name || !email || !message) {
        throw new Error('Name, email and message are required');
      }

      const trimmedName = String(name).trim();
      const trimmedEmail = String(email).trim().toLowerCase();
      const trimmedPhone = String(phone || '').trim();
      const trimmedMessage = String(message).trim();

      const user = this.getCurrentUser();

      const docRef = await addDoc(collection(this.db, 'contactMessages'), {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
        userId: user ? user.uid : null,
        createdAt: serverTimestamp(),
        status: 'new'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw new Error('Failed to submit your message');
    }
  }

  // Utility Methods
  getAuthErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  // Batch operations
  async batchUpdate(operations) {
    try {
      const batch = writeBatch(this.db);
      
      operations.forEach(({ type, collection, id, data }) => {
        const docRef = doc(this.db, collection, id);
        
        switch (type) {
          case 'set':
            batch.set(docRef, data);
            break;
          case 'update':
            batch.update(docRef, data);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw new Error('Failed to perform batch operation');
    }
  }
}

export default new FirebaseService();