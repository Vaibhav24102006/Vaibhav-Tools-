import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { 
  UserCircleIcon, 
  HeartIcon, 
  ShoppingCartIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  PencilIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { currentUser, deleteAccount, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load user orders on mount and when switching to orders tab
  useEffect(() => {
    if (currentUser) {
      loadUserOrders();
    }
  }, [currentUser]);

  const loadUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const orders = await orderService.getUserOrders(currentUser.uid);
      setUserOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cpLoading, setCpLoading] = useState(false);
    const [cpMessage, setCpMessage] = useState('');

    const handleChangePassword = async (e) => {
      e.preventDefault();
      setCpMessage('');
      if (newPassword.length < 8) return setCpMessage('New password must be at least 8 characters');
      if (newPassword !== confirmPassword) return setCpMessage('Passwords do not match');
      setCpLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to change password');
        setCpMessage('Password changed successfully. Please sign in again.');
        // Clear admin JWT and redirect to admin login
        localStorage.removeItem('token');
        setTimeout(() => { window.location.href = '/admin-login'; }, 1500);
      } catch (err) {
        setCpMessage(err.message);
      } finally {
        setCpLoading(false);
      }
    };

    return (
      <form onSubmit={handleChangePassword} className="space-y-3">
        <input type="password" placeholder="Current password" className="w-full px-3 py-2 border rounded" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        <input type="password" placeholder="New password" className="w-full px-3 py-2 border rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 border rounded" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button className="bg-primary-red text-white px-4 py-2 rounded" disabled={cpLoading}>{cpLoading ? 'Updating...' : 'Change Password'}</button>
        {cpMessage && <p className="text-sm text-red-600">{cpMessage}</p>}
      </form>
    );
  };

  const handleLogout = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await logout();
      setSuccess('Logged out successfully.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await deleteAccount();
      setSuccess('Account deleted.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You must be signed in to view your profile.</p>
          <Link 
            to="/signin" 
            className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  const stats = [
    {
      name: 'Wishlist Items',
      value: wishlistItems.length,
      icon: HeartIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Cart Items',
      value: getTotalItems(),
      icon: ShoppingCartIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Orders',
      value: userOrders.length,
      icon: ClipboardDocumentListIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-red to-red-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-primary-red" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
              <p className="text-red-100">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview', icon: UserCircleIcon },
              { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon },
              { id: 'wishlist', name: 'Wishlist', icon: HeartIcon },
              { id: 'profile', name: 'Profile', icon: PencilIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-red text-primary-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${stat.bgColor} rounded-lg p-6`}
                  >
                    <div className="flex items-center">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  to="/wishlist"
                  className="group block p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <HeartIcon className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors">View Wishlist</h3>
                      <p className="text-sm text-gray-600">{wishlistItems.length} items saved</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/cart"
                  className="group block p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <ShoppingCartIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">View Cart</h3>
                      <p className="text-sm text-gray-600">{getTotalItems()} items in cart</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link 
                      to="/products" 
                      className="inline-flex items-center px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-mono text-sm text-gray-600">Order #{order.orderId}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3 mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  ₹{(item.price * item.quantity)?.toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {order.customerAddress && (
                          <div className="border-t border-gray-200 pt-3 mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">Delivery Address:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{order.customerAddress}</p>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-600">Total Amount:</p>
                          <p className="text-lg font-bold text-primary-red">₹{order.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Your Wishlist</h3>
                  <Link 
                    to="/wishlist" 
                    className="text-primary-red hover:text-red-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2" />
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-primary-red font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                    <Link 
                      to="/products" 
                      className="inline-flex items-center px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-primary-red rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Profile picture coming soon</p>
                      <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm cursor-not-allowed" disabled>
                        Upload Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          value={currentUser.displayName || 'Not set'} 
                          readOnly 
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                        />
                        <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg cursor-not-allowed" disabled>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={currentUser.email} 
                        readOnly 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="tel" 
                          placeholder="Not set" 
                          readOnly 
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                        />
                        <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg cursor-not-allowed" disabled>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stored Payment Methods */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                  <div className="text-center py-8">
                    <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No saved payment methods</p>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                      <p className="text-sm text-gray-500 bg-white p-2 rounded border font-mono">{currentUser.uid}</p>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-600">Update your password for better security</p>
                      </div>
                      <div className="mt-3">
                        <ChangePasswordForm />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                        Enable
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <p className="text-green-700">{success}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-red text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span>{loading ? 'Logging out...' : 'Logout'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete Account</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
