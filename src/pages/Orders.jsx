import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import LoadingAnimation from '../components/LoadingAnimation';
import { 
  ShoppingBagIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ClockIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';

/**
 * Orders Page - Customer Order History
 * Shows all orders with ability to cancel pending orders
 */

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, [currentUser]);

  const loadOrders = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userOrders = await firebaseService.getOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }

    try {
      setCancelling(orderId);
      await firebaseService.cancelOrder(orderId);
      
      // Refresh orders
      await loadOrders();
      
      alert('✅ Order cancelled successfully! Stock has been restored.');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(`❌ Failed to cancel order: ${err.message}`);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-blue-400" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to view your orders.</p>
          <a href="/signin" className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white pt-20 flex items-center justify-center">
        <LoadingAnimation text="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white pt-20 flex items-center justify-center">
        <div className="text-red-400 bg-red-900/30 border border-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary-red mb-2">My Orders</h1>
          <p className="text-gray-400">View and manage your order history</p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <ShoppingBagIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <a
              href="/products"
              className="inline-block bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-gray/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="text-xl font-bold text-primary-red mb-1">
                        Order #{order.orderId || order.id}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {order.createdAt?.toDate?.()?.toLocaleDateString() || 
                         new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-800"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-700">
                    <div className="mb-3 md:mb-0">
                      <p className="text-2xl font-bold text-primary-red">
                        Total: ₹{order.totalAmount?.toFixed(2)}
                      </p>
                      {order.customerAddress && (
                        <p className="text-sm text-gray-400 mt-1">
                          📍 {order.customerAddress}
                        </p>
                      )}
                    </div>

                    {canCancelOrder(order) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelling === order.id}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
