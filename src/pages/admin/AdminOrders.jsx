import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Trash2, 
  X,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Loader
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminFirestore from '../../utils/adminFirestore';
import emailService from '../../services/emailService';

const AdminOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminFirestore.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleSendEmail = (order) => {
    setSelectedOrder(order);
    setEmailForm({
      subject: `Regarding your order ${order.orderId}`,
      message: `Dear ${order.customerName},\n\nThank you for your order!\n\n`
    });
    setShowEmailModal(true);
    setEmailResult(null);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setEmailResult(null);

    try {
      const result = await emailService.sendCustomerEmail({
        customerName: selectedOrder.customerName,
        customerEmail: selectedOrder.customerEmail,
        subject: emailForm.subject,
        message: emailForm.message,
        orderId: selectedOrder.orderId
      });

      setEmailResult(result);

      if (result.success) {
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailForm({ subject: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      setEmailResult({
        success: false,
        message: 'Failed to send email'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await adminFirestore.deleteOrder(orderId);
      await loadOrders();
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminFirestore.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'processing':
        return <Package className="text-blue-500" size={16} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'processing':
        return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'completed':
        return 'bg-green-900/30 text-green-300 border-green-700';
      case 'cancelled':
        return 'bg-red-900/30 text-red-300 border-red-700';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Customer Orders</h1>
                <p className="text-gray-400">
                  Manage customer purchases ({filteredOrders.length} of {orders.length})
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Filters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Name, or Email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                  }}
                  className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader className="animate-spin mx-auto mb-4 text-primary-red" size={40} />
                  <p className="text-gray-400">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCart className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="text-gray-400">No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white font-mono text-sm">{order.orderId}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white">{order.customerName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-400 text-sm">{order.customerEmail}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white font-semibold">
                              ₹{order.totalAmount?.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-400 text-sm">{formatDate(order.date)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} cursor-pointer`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="p-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleSendEmail(order)}
                                className="p-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-colors"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="text-gray-400" size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-white font-mono">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="text-white capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Customer Name</p>
                    <p className="text-white">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-white">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-white font-semibold">₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.customerAddress && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-300 mb-2">📍 Delivery Address</h3>
                    <p className="text-white whitespace-pre-line">{selectedOrder.customerAddress}</p>
                  </div>
                )}

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-white font-semibold">
                          ₹{(item.price * item.quantity)?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-800 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>₹{selectedOrder.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span>₹{selectedOrder.tax?.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-₹{selectedOrder.discount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                      <span>Total</span>
                      <span>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary-red" size={24} />
                  <h2 className="text-2xl font-bold text-white">Send Email to Customer</h2>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="text-gray-400" size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Sending to:</p>
                  <p className="text-white font-medium">{selectedOrder.customerName}</p>
                  <p className="text-gray-400 text-sm">{selectedOrder.customerEmail}</p>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    placeholder="Email subject"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    required
                    rows="8"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent resize-none"
                    placeholder="Your message to the customer..."
                  />
                </div>

                {/* Result Message */}
                {emailResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      emailResult.success
                        ? 'bg-green-900/30 border-green-700'
                        : 'bg-red-900/30 border-red-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {emailResult.success ? (
                        <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0" size={24} />
                      )}
                      <div>
                        <p className={`font-medium ${emailResult.success ? 'text-green-300' : 'text-red-300'}`}>
                          {emailResult.success ? 'Email sent successfully!' : 'Failed to send email'}
                        </p>
                        <p className={`text-sm mt-1 ${emailResult.success ? 'text-green-400' : 'text-red-400'}`}>
                          {emailResult.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={20} />
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
