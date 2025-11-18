import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailService from '../../services/emailService';
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

/**
 * EmailTest Component - Admin Email Testing Page
 * Allows testing of EmailJS integration with real-time feedback
 */

const EmailTest = () => {
  const [testData, setTestData] = useState({
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerAddress: '123 Test Street, Test City, 12345',
    orderId: `TEST-${Date.now()}`,
    totalAmount: 1500.00,
    items: [
      { name: 'Test Product 1', price: 500, quantity: 2 },
      { name: 'Test Product 2', price: 500, quantity: 1 }
    ]
  });

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const handleSendTest = async () => {
    setSending(true);
    setResult(null);
    setLogs([]);
    
    addLog('🚀 Starting email test...', 'info');
    addLog(`Order ID: ${testData.orderId}`, 'info');
    addLog(`Customer: ${testData.customerName}`, 'info');
    addLog(`Customer Email: ${testData.customerEmail}`, 'info');
    addLog(`Total: ₹${testData.totalAmount}`, 'info');
    
    // Validate customer email
    if (!testData.customerEmail || testData.customerEmail.trim() === '') {
      addLog('❌ Validation failed: Customer email is required', 'error');
      setResult({ success: false, error: 'Customer email is required' });
      setSending(false);
      return;
    }
    
    try {
      const orderData = {
        ...testData,
        date: new Date().toISOString()
      };

      addLog('📧 Calling EmailJS service...', 'info');
      addLog(`Admin email will be: ${process.env.REACT_APP_ADMIN_EMAIL || 'vaibhavtools@gmail.com'}`, 'info');
      
      const response = await emailService.sendOrderNotificationToAdmin(orderData);
      
      if (response.success) {
        addLog('✅ Email sent successfully!', 'success');
        addLog(`Response status: ${response.response?.status}`, 'success');
        addLog(`Response text: ${response.response?.text}`, 'success');
        addLog(`Duration: ${response.duration}ms`, 'info');
        setResult({ success: true, data: response });
      } else {
        addLog('❌ Email sending failed', 'error');
        addLog(`Error: ${response.message}`, 'error');
        if (response.error) {
          addLog(`Error details: ${JSON.stringify(response.error)}`, 'error');
        }
        setResult({ success: false, error: response.message });
      }
    } catch (error) {
      addLog('❌ Exception occurred', 'error');
      addLog(`Error: ${error.message}`, 'error');
      addLog(`Stack: ${error.stack}`, 'error');
      setResult({ success: false, error: error.message });
    } finally {
      setSending(false);
    }
  };

  const handleConfigCheck = () => {
    setLogs([]);
    addLog('🔍 Checking EmailJS configuration...', 'info');
    
    const config = emailService.getConfig();
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'vaibhavtools@gmail.com';
    
    addLog(`Service ID: ${config.serviceID}`, 'info');
    addLog(`Template ID: ${config.templateID}`, 'info');
    addLog(`Public Key: ${config.publicKey}`, 'info');
    addLog(`Admin Email (recipient): ${adminEmail}`, 'info');
    addLog(`Configuration valid: ${config.isValid ? '✅ Yes' : '❌ No'}`, config.isValid ? 'success' : 'error');
    
    if (!adminEmail || adminEmail === 'vaibhavtools@gmail.com') {
      addLog('⚠️ Warning: Using default admin email. Set REACT_APP_ADMIN_EMAIL in .env', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary-red mb-2 flex items-center gap-3">
            <EnvelopeIcon className="h-10 w-10" />
            Email Test Console
          </h1>
          <p className="text-gray-400">Test EmailJS integration and view detailed logs</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Data Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-gray/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4">Test Order Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={testData.customerName}
                  onChange={(e) => setTestData({ ...testData, customerName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Email</label>
                <input
                  type="email"
                  value={testData.customerEmail}
                  onChange={(e) => setTestData({ ...testData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                <textarea
                  value={testData.customerAddress}
                  onChange={(e) => setTestData({ ...testData, customerAddress: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Amount (₹)</label>
                <input
                  type="number"
                  value={testData.totalAmount}
                  onChange={(e) => setTestData({ ...testData, totalAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red text-white"
                />
              </div>

              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendTest}
                  disabled={sending}
                  className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '📧 Sending...' : '📧 Send Test Email'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfigCheck}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  🔍 Check Configuration
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Logs Console */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-gray/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4">Console Logs</h2>
            
            <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No logs yet. Send a test email to see logs here.
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                        'text-gray-300'
                      }`}
                    >
                      <span className="text-gray-500">[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Result Summary */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold mb-2">
                  {result.success ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Email Sent Successfully!</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5" />
                      <span>Email Failed</span>
                    </>
                  )}
                </div>
                {result.success && (
                  <div className="text-sm space-y-1">
                    <p>✅ Check the configured email inbox for the test email</p>
                    <p>✅ Email event logged to Firestore (emailEvents collection)</p>
                  </div>
                )}
                {!result.success && (
                  <div className="text-sm">
                    <p>Error: {result.error}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-500/10 border border-blue-500/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-3">📋 Instructions</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Click "Send Test Email" to send a test order notification</li>
            <li>• Check the configured admin email inbox for the received email</li>
            <li>• View detailed logs in the console on the right</li>
            <li>• Email events are automatically logged to Firestore (emailEvents collection)</li>
            <li>• Use "Check Configuration" to verify EmailJS credentials</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailTest;
