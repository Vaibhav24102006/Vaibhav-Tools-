import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * EmailJS Service - Vaibhav Tools
 * Centralized email sending functionality using EmailJS
 * 
 * Configuration for Vaibhav Tools order notifications
 * Service sends order notifications to father's email (linked Gmail account)
 * 
 * Features:
 * - Order notifications to admin
 * - Customer confirmations
 * - Error logging to Firestore
 * - Retry mechanism
 */

// EmailJS Configuration - Vaibhav Tools
const EMAIL_CONFIG = {
  serviceID: process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_l74orya",
  templateID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_amj7dsr",
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "9OIsKA0azrLjTtNZy"
};

class EmailService {
  constructor() {
    this.config = EMAIL_CONFIG;
  }

  /**
   * Send a test email
   * @param {Object} params - Email parameters
   * @param {string} params.user_name - Recipient name
   * @param {string} params.user_email - Recipient email
   * @param {string} params.message - Email message
   * @returns {Promise} EmailJS response
   */
  async sendTestEmail({ user_name, user_email, message }) {
    try {
      const templateParams = {
        user_name,
        user_email,
        message,
        from_name: 'Vaibhav Tools Admin',
        reply_to: user_email,
        to_email: user_email,
        subject: 'Test Email from Vaibhav Tools',
        timestamp: new Date().toLocaleString()
      };

      const response = await emailjs.send(
        this.config.serviceID,
        this.config.templateID,
        templateParams,
        this.config.publicKey
      );

      return {
        success: true,
        message: 'Email sent successfully',
        response
      };
    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        message: error.text || 'Failed to send email',
        error
      };
    }
  }

  /**
   * Log email event to Firestore for tracking
   * @param {Object} eventData - Email event data
   */
  async logEmailEvent(eventData) {
    try {
      await addDoc(collection(db, 'emailEvents'), {
        ...eventData,
        createdAt: serverTimestamp()
      });
      console.log('[EmailJS] Event logged to Firestore');
    } catch (error) {
      console.error('[EmailJS] Failed to log event:', error);
    }
  }

  /**
   * Send order notification to admin (father's email)
   * This is the main notification when a new order is placed
   * Subject: "New Order Received – Vaibhav Tools"
   * @param {Object} orderData - Order information
   * @returns {Promise} EmailJS response
   */
  async sendOrderNotificationToAdmin(orderData) {
    const startTime = Date.now();
    console.log('[EmailJS] 📧 Sending order notification to admin...');
    console.log('[EmailJS] Order ID:', orderData.orderId);
    
    try {
      const {
        orderId = "UNKNOWN",
        customerName = "",
        customerEmail = "",
        customerAddress = "",
        items = [],
        totalAmount = 0,
        date = new Date()
      } = orderData;

      // Format items list with details - simple and clear for father
      const itemsList = items.map((item, idx) => 
        `${idx + 1}. ${item.name}\n   Quantity: ${item.quantity}\n   Price: ₹${item.price.toFixed(2)}\n   Total: ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n\n');

      // Format date nicely
      const formattedDate = new Date(date).toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short'
      });

      // CRITICAL: to_email must be set to admin's email for order notifications
      // This is the email that will receive the order notification
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'rahul.jain36463@gmail.com';
      
      const templateParams = {
        // CRITICAL: EmailJS template parameters - ALL REQUIRED
        to_email: adminEmail,
        admin_email: adminEmail,
        to_name: 'Vaibhav Tools Admin',
        user_email: adminEmail,  // Alternative parameter name
        recipient_email: adminEmail,  // Another alternative
        
        // Order details
        order_id: orderId,
        order_date: formattedDate,
        order_total: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount.toFixed(2),
        
        // Customer details
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: customerAddress || 'Not provided',
        shipping_address: customerAddress || 'Not provided',
        
        // Product details
        product_list: itemsList,
        product_name: items.map(i => i.name).join(', '),
        product_price: `₹${totalAmount.toFixed(2)}`,
        items: items.map(i => `${i.name} x${i.quantity || 1}`).join('\n'),
        
        // Email metadata
        subject: '🔔 New Order Received – Vaibhav Tools',
        from_name: 'Vaibhav Tools Website',
        reply_to: customerEmail,
        message: `A new order has been placed!\n\nOrder ID: ${orderId}\nCustomer: ${customerName}\nEmail: ${customerEmail}\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nPlease check the details and prepare for delivery.`,
        
        // Additional parameters for compatibility
        user_name: 'Vaibhav Tools Admin',
        user_message: `New order from ${customerName}`,
        template_id: this.config.templateID,
        service_id: this.config.serviceID
      };

      console.log('[EmailJS] Template params prepared:', {
        to_email: adminEmail,
        admin_email: adminEmail,
        orderId,
        customerName,
        itemCount: items.length,
        total: totalAmount
      });
      console.log('[EmailJS] Sending to admin email:', adminEmail);
      console.log('[EmailJS] Full template params:', JSON.stringify(templateParams, null, 2));

      // Validate required parameters before sending
      if (!adminEmail || adminEmail.trim() === '') {
        throw new Error('Admin email is empty or not configured');
      }

      if (!templateParams.to_email && !templateParams.admin_email) {
        throw new Error('Email recipient empty. Provide REACT_APP_ADMIN_EMAIL in .env or supply recipient.');
      }

      if (!this.config.serviceID || !this.config.templateID || !this.config.publicKey) {
        throw new Error('EmailJS configuration is incomplete');
      }

      const response = await emailjs.send(
        this.config.serviceID,
        this.config.templateID,
        templateParams,
        this.config.publicKey
      );

      const duration = Date.now() - startTime;
      console.log(`✅ [EmailJS] Order notification sent successfully in ${duration}ms`);
      console.log('[EmailJS] Response:', response);
      
      // Log success to Firestore
      await this.logEmailEvent({
        type: 'order_notification',
        orderId,
        status: 'success',
        response: {
          status: response.status,
          text: response.text
        },
        duration,
        customerEmail,
        totalAmount
      });

      return {
        success: true,
        message: 'Order notification sent to admin successfully',
        response,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ [EmailJS] Order notification error:', error);
      console.error('[EmailJS] Error details:', {
        message: error.message,
        text: error.text,
        status: error.status
      });
      
      // Log failure to Firestore
      await this.logEmailEvent({
        type: 'order_notification',
        orderId: orderData.orderId,
        status: 'failed',
        error: {
          message: error.message,
          text: error.text,
          status: error.status
        },
        duration
      });

      return {
        success: false,
        message: error.text || 'Failed to send order notification',
        error
      };
    }
  }

  /**
   * Send order confirmation email to customer
   * @param {Object} orderData - Order information
   * @returns {Promise} EmailJS response
   */
  async sendOrderConfirmationToCustomer(orderData) {
    try {
      const {
        orderId,
        customerName,
        customerEmail,
        items,
        totalAmount,
        date
      } = orderData;

      // Format items list
      const itemsList = items.map(item => 
        `${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const templateParams = {
        order_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        to_email: customerEmail,
        product_list: itemsList,
        order_total: `₹${totalAmount.toFixed(2)}`,
        order_date: date,
        from_name: 'Vaibhav Tools',
        reply_to: 'support@vaibhavtools.com',
        message: `Thank you for your order! Your order ID is ${orderId}.`
      };

      const response = await emailjs.send(
        this.config.serviceID,
        this.config.templateID,
        templateParams,
        this.config.publicKey
      );

      return {
        success: true,
        message: 'Order confirmation sent to customer successfully',
        response
      };
    } catch (error) {
      console.error('Customer confirmation email error:', error);
      return {
        success: false,
        message: error.text || 'Failed to send customer confirmation',
        error
      };
    }
  }

  /**
   * Send custom email to customer
   * @param {Object} params - Email parameters
   * @param {string} params.customerName - Customer name
   * @param {string} params.customerEmail - Customer email
   * @param {string} params.subject - Email subject
   * @param {string} params.message - Email message
   * @param {string} params.orderId - Optional order ID
   * @returns {Promise} EmailJS response
   */
  async sendCustomerEmail({ customerName, customerEmail, subject, message, orderId = '' }) {
    try {
      const templateParams = {
        customer_name: customerName,
        to_email: customerEmail,
        user_email: customerEmail,
        subject: subject,
        message: message,
        order_id: orderId,
        from_name: 'Vaibhav Tools Admin',
        reply_to: 'admin@vaibhavtools.com',
        timestamp: new Date().toLocaleString()
      };

      const response = await emailjs.send(
        this.config.serviceID,
        this.config.templateID,
        templateParams,
        this.config.publicKey
      );

      return {
        success: true,
        message: 'Email sent to customer successfully',
        response
      };
    } catch (error) {
      console.error('Customer email error:', error);
      return {
        success: false,
        message: error.text || 'Failed to send email to customer',
        error
      };
    }
  }

  /**
   * Validate email configuration
   * @returns {boolean} True if configuration is valid
   */
  validateConfig() {
    const { serviceID, templateID, publicKey } = this.config;
    return !!(serviceID && templateID && publicKey);
  }

  /**
   * Get current configuration (for debugging)
   * @returns {Object} Current email configuration (keys masked)
   */
  getConfig() {
    return {
      serviceID: this.config.serviceID ? `${this.config.serviceID.substring(0, 8)}...` : 'Not set',
      templateID: this.config.templateID ? `${this.config.templateID.substring(0, 9)}...` : 'Not set',
      publicKey: this.config.publicKey ? `${this.config.publicKey.substring(0, 8)}...` : 'Not set',
      isValid: this.validateConfig()
    };
  }
}

export default new EmailService();
