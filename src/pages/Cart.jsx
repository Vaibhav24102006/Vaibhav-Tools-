import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { TrashIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import emailService from '../services/emailService';
import firebaseService from '../services/firebaseService';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    const validQuantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
    updateQuantity(productId, validQuantity);
  };

  const handlePromoCode = () => {
    if (promoCode.trim().toLowerCase() === 'welcome10') {
      setPromoApplied(true);
      setPromoDiscount(getTotalPrice() * 0.1); // 10% discount
    } else {
      alert('Invalid promo code. Try "WELCOME10" for 10% off!');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!currentUser) {
      alert('Please sign in to place your order.');
      return;
    }

    // Show address modal before processing order
    setShowAddressModal(true);
  };

  const processOrder = async () => {
    if (!customerAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    setCheckoutLoading(true);
    setShowAddressModal(false);
    
    try {
      // Prepare order details
      const customerName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer';
      const customerEmail = currentUser.email;
      
      // Create product list for email
      const productList = items.map(item => 
        `${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const subtotal = getTotalPrice();
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = (subtotal - promoDiscount) * 0.08;
      const orderTotal = subtotal + shipping + tax - promoDiscount;
      const orderId = `ORD-${Date.now()}`;

      // Save order to Firestore with address
      const orderData = {
        orderId,
        customerName,
        customerEmail,
        customerAddress: customerAddress.trim(),
        userId: currentUser.uid,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        subtotal,
        shipping,
        tax,
        discount: promoDiscount,
        totalAmount: orderTotal,
        date: new Date().toISOString(),
        status: 'pending'
      };

      // Save order to Firestore with stock check
      let orderDocId;
      try {
        // Use Firebase service with stock checking
        orderDocId = await firebaseService.createOrderWithStockCheck(orderData);
        console.log('✅ Order saved to Firestore with stock check, ID:', orderDocId);
      } catch (firestoreError) {
        console.error('❌ Failed to save order to Firestore:', firestoreError);
        console.error('Error details:', firestoreError.message);
        alert(`Failed to save order: ${firestoreError.message}\nPlease try again.`);
        setCheckoutLoading(false);
        return;
      }

      // Send order notification to admin (father's email)
      try {
        const emailResult = await emailService.sendOrderNotificationToAdmin(orderData);
        if (emailResult.success) {
          console.log('✅ Order notification sent to admin email');
        } else {
          console.warn('⚠️ Failed to send email notification:', emailResult.message);
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError);
        // Continue with checkout even if email fails
      }

      // Clear cart and address after successful order
      clearCart();
      setCustomerAddress('');
      
      // Show success message and redirect
      alert(`✅ Order placed successfully!\n\nOrder ID: ${orderId}\nTotal: ₹${orderTotal.toFixed(2)}\n\nYou will receive a confirmation email shortly.\nThank you for your purchase!`);
      navigate('/products');

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal + shipping + tax - promoDiscount;

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-light-gray pt-20">
        {/* Hero Section */}
        <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-red mb-4"
            >
              Shopping Cart
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-base sm:text-lg"
            >
              Your cart is empty
            </motion.p>
          </div>
        </div>

        {/* Empty Cart Message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <ShoppingBagIcon className="h-20 w-20 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="bg-primary-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-light-gray pt-20">
      {/* Hero Section */}
      <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-red mb-4"
          >
            Shopping Cart
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-base sm:text-lg"
          >
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </motion.p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-black">Cart Items</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
                >
                  Clear All
                </motion.button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-black truncate">{item.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{item.description}</p>
                      <p className="text-primary-red font-bold text-base sm:text-lg">₹{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-700">
                        Qty:
                      </label>
                      <div className="flex items-center border-2 border-gray-400 rounded-md bg-gray-50">
                        <motion.button
                          whileHover={{ scale: item.quantity > 1 ? 1.05 : 1 }}
                          whileTap={{ scale: item.quantity > 1 ? 0.95 : 1 }}
                          onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                          className={`px-2 py-1 transition-colors duration-200 ${
                            item.quantity <= 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-primary-red'
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </motion.button>
                        <input
                          type="number"
                          id={`quantity-${item.id}`}
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(item.id, Math.max(1, Math.min(99, newQuantity)));
                          }}
                          className="w-12 text-center border-none focus:outline-none text-sm font-medium bg-white text-black"
                        />
                        <motion.button
                          whileHover={{ scale: item.quantity < 99 ? 1.05 : 1 }}
                          whileTap={{ scale: item.quantity < 99 ? 0.95 : 1 }}
                          onClick={() => handleQuantityChange(item.id, Math.min(99, item.quantity + 1))}
                          className={`px-2 py-1 transition-colors duration-200 ${
                            item.quantity >= 99 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-primary-red'
                          }`}
                          disabled={item.quantity >= 99}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-bold text-black">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                      title="Remove item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 sticky top-24"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <TagIcon className="h-5 w-5 text-primary-red mr-2" />
                  <label className="text-sm font-medium text-gray-700">Promo Code</label>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red text-sm"
                    disabled={promoApplied}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePromoCode}
                    disabled={promoApplied || !promoCode.trim()}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-300 ${
                      promoApplied || !promoCode.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-red text-white hover:bg-red-600'
                    }`}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </motion.button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">10% discount applied!</p>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-xl font-bold text-black">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 mb-4"
              >
                Proceed to Checkout
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.history.back()}
                className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
              >
                Continue Shopping
              </motion.button>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Shipping Information</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $100. Standard delivery takes 3-5 business days.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Delivery Address</h2>
            <p className="text-gray-600 mb-4">
              Please enter your complete delivery address for this order.
            </p>
            
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Enter your complete address including:\n- House/Flat number\n- Street name\n- Area/Locality\n- City\n- State\n- PIN code"
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={processOrder}
                disabled={!customerAddress.trim() || checkoutLoading}
                className="flex-1 px-4 py-3 bg-primary-red text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;