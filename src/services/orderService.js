import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

/**
 * Order Service - Client Side
 * Handles order operations from the customer/client side
 */

class OrderService {
  constructor() {
    this.db = db;
  }

  /**
   * Create a new order (client-side)
   * @param {Object} orderData - Order information
   * @returns {Promise<string>} Order document ID
   */
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(this.db, 'orders'), {
        ...orderData,
        status: orderData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get orders for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of orders
   */
  async getUserOrders(userId) {
    try {
      const q = query(
        collection(this.db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
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
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Get all orders (for admin)
   * @returns {Promise<Array>} Array of all orders
   */
  async getAllOrders() {
    try {
      const q = query(
        collection(this.db, 'orders'),
        orderBy('createdAt', 'desc')
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
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }
}

export default new OrderService();
