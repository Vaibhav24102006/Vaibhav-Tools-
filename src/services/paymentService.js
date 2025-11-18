// Payment Service for VaibhavTools
// Supports Razorpay, Stripe, UPI, and Canara NetBanking

class PaymentService {
  constructor() {
    this.razorpay = null;
    this.stripe = null;
    this.supportedMethods = ['razorpay', 'stripe', 'upi', 'netbanking'];
  }

  // Initialize payment gateways
  async initializeGateways() {
    // Initialize Razorpay
    if (window.Razorpay) {
      this.razorpay = window.Razorpay;
      // Razorpay initialized
    }

    // Initialize Stripe
    if (window.Stripe) {
      this.stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      // Stripe initialized
    }
  }

  // Create order on backend
  async createOrder(orderData) {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      // Error creating order
      throw error;
    }
  }

  // Razorpay payment
  async processRazorpayPayment(orderData) {
    return new Promise((resolve, reject) => {
      if (!this.razorpay) {
        reject(new Error('Razorpay not initialized'));
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Vaibhav Tools',
        description: 'Professional Tools Purchase',
        order_id: orderData.orderId,
        handler: function (response) {
          resolve({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'razorpay'
          });
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        notes: {
          address: orderData.shippingAddress
        },
        theme: {
          color: '#dc2626'
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new this.razorpay(options);
      rzp.open();
    });
  }

  // Stripe payment
  async processStripePayment(orderData) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      // Create payment intent on backend
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderData.amount * 100, // Convert to cents
          currency: 'inr',
          orderId: orderData.orderId
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment with Stripe
      const result = await this.stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: orderData.cardElement,
          billing_details: {
            name: orderData.customerName,
            email: orderData.customerEmail,
          },
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        paymentId: result.paymentIntent.id,
        orderId: orderData.orderId,
        method: 'stripe'
      };
    } catch (error) {
      // Stripe payment error
      throw error;
    }
  }

  // UPI payment placeholder
  async processUPIPayment(orderData) {
    // Placeholder for UPI implementation
    return new Promise((resolve, reject) => {
      // In a real implementation, this would integrate with UPI APIs
      // Processing UPI payment
      
      // Simulate UPI payment flow
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
          resolve({
            paymentId: `upi_${Date.now()}`,
            orderId: orderData.orderId,
            method: 'upi',
            upiId: orderData.upiId
          });
        } else {
          reject(new Error('UPI payment failed'));
        }
      }, 2000);
    });
  }

  // Canara NetBanking payment placeholder
  async processCanaraNetBanking(orderData) {
    // Placeholder for Canara Bank NetBanking
    return new Promise((resolve, reject) => {
      // Processing Canara NetBanking payment
      
      // Simulate NetBanking flow
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate for demo
        
        if (success) {
          resolve({
            paymentId: `canara_${Date.now()}`,
            orderId: orderData.orderId,
            method: 'netbanking',
            bank: 'canara'
          });
        } else {
          reject(new Error('NetBanking payment failed'));
        }
      }, 3000);
    });
  }

  // Verify payment on backend
  async verifyPayment(paymentData) {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      // Error verifying payment
      throw error;
    }
  }

  // Get supported payment methods
  getSupportedMethods() {
    return this.supportedMethods;
  }

  // Check if payment method is available
  isMethodAvailable(method) {
    switch (method) {
      case 'razorpay':
        return !!this.razorpay;
      case 'stripe':
        return !!this.stripe;
      case 'upi':
        return true; // UPI is always available in India
      case 'netbanking':
        return true; // NetBanking is always available
      default:
        return false;
    }
  }
}

export default new PaymentService();
