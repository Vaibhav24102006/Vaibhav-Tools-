import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * Admin Firestore Service
 * Handles all admin-related CRUD operations for products, categories, and brands
 */
class AdminFirestoreService {
  constructor() {
    this.db = db;
    this.storage = storage;
  }

  // ==================== PRODUCTS ====================
  
  /**
   * Get all products with optional filters
   */
  async getProducts(filters = {}) {
    try {
      const constraints = [];
      
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters.brand) {
        constraints.push(where('brand', '==', filters.brand));
      }
      
      if (filters.inStock !== undefined) {
        constraints.push(where('inStock', '==', filters.inStock));
      }
      
      const q = query(
        collection(this.db, 'products'),
        ...constraints,
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const products = [];
      
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(productId) {
    try {
      const docRef = doc(this.db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Add a new product
   */
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

  /**
   * Update an existing product
   */
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

  /**
   * Delete a product
   */
  async deleteProduct(productId) {
    try {
      const docRef = doc(this.db, 'products', productId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // ==================== CATEGORIES ====================
  
  /**
   * Get all unique categories from products
   */
  async getCategories() {
    try {
      const products = await this.getProducts();
      const categoriesSet = new Set();
      
      products.forEach(product => {
        if (product.category) {
          categoriesSet.add(product.category);
        }
      });
      
      return Array.from(categoriesSet).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Update category for multiple products
   */
  async updateCategory(oldCategory, newCategory) {
    try {
      const q = query(
        collection(this.db, 'products'),
        where('category', '==', oldCategory)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          category: newCategory,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete a category (removes it from all products)
   */
  async deleteCategory(category) {
    try {
      const q = query(
        collection(this.db, 'products'),
        where('category', '==', category)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          category: '',
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  // ==================== BRANDS ====================
  
  /**
   * Get all unique brands from products
   */
  async getBrands() {
    try {
      const products = await this.getProducts();
      const brandsSet = new Set();
      
      products.forEach(product => {
        if (product.brand) {
          brandsSet.add(product.brand);
        }
      });
      
      return Array.from(brandsSet).sort();
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  /**
   * Update brand for multiple products
   */
  async updateBrand(oldBrand, newBrand) {
    try {
      const q = query(
        collection(this.db, 'products'),
        where('brand', '==', oldBrand)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          brand: newBrand,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating brand:', error);
      throw new Error('Failed to update brand');
    }
  }

  /**
   * Delete a brand (removes it from all products)
   */
  async deleteBrand(brand) {
    try {
      const q = query(
        collection(this.db, 'products'),
        where('brand', '==', brand)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          brand: '',
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw new Error('Failed to delete brand');
    }
  }

  // ==================== STATISTICS ====================
  
  /**
   * Get dashboard statistics
   */
  async getStatistics() {
    try {
      const products = await this.getProducts();
      const categories = await this.getCategories();
      const brands = await this.getBrands();
      
      // Count products by category
      const categoryDistribution = {};
      products.forEach(product => {
        const cat = product.category || 'Uncategorized';
        categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      });
      
      // Count in-stock vs out-of-stock
      const inStock = products.filter(p => p.inStock).length;
      const outOfStock = products.length - inStock;
      
      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalBrands: brands.length,
        inStock,
        outOfStock,
        categoryDistribution
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch statistics');
    }
  }

  // ==================== IMAGE UPLOAD ====================
  
  /**
   * Upload image to Firebase Storage
   */
  async uploadImage(file, path = 'products') {
    try {
      const timestamp = Date.now();
      const fileName = `${path}/${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Delete image from Firebase Storage
   */
  async deleteImage(imageUrl) {
    try {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error if image doesn't exist
      if (error.code !== 'storage/object-not-found') {
        throw new Error('Failed to delete image');
      }
    }
  }

  // ==================== ORDERS ====================
  
  /**
   * Get all orders with optional filters
   */
  async getOrders(filters = {}) {
    try {
      const constraints = [];
      
      if (filters.customerEmail) {
        constraints.push(where('customerEmail', '==', filters.customerEmail));
      }
      
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      const q = query(
        collection(this.db, 'orders'),
        ...constraints,
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const orders = [];
      
      snapshot.forEach((doc) => {
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

  /**
   * Get a single order by ID
   */
  async getOrder(orderId) {
    try {
      const docRef = doc(this.db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      throw new Error('Order not found');
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(this.db, 'orders'), {
        ...orderData,
        status: orderData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  /**
   * Update order status
   */
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

  /**
   * Delete an order
   */
  async deleteOrder(orderId) {
    try {
      const docRef = doc(this.db, 'orders', orderId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStatistics() {
    try {
      const orders = await this.getOrders();
      
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      const statusCounts = {
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0
      };
      
      orders.forEach(order => {
        const status = order.status || 'pending';
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
      
      return {
        totalOrders,
        totalRevenue,
        ...statusCounts
      };
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw new Error('Failed to fetch order statistics');
    }
  }
}

export default new AdminFirestoreService();
