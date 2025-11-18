import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, XCircle, Info, Loader } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import emailService from '../../services/emailService';

const AdminEmailTest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const response = await emailService.sendTestEmail(formData);
      setResult(response);

      if (response.success) {
        // Clear form on success
        setFormData({
          user_name: '',
          user_email: '',
          message: ''
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    } finally {
      setSending(false);
    }
  };

  const config = emailService.getConfig();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-primary-red" size={32} />
                <h1 className="text-4xl font-bold text-white">Email Test Panel</h1>
              </div>
              <p className="text-gray-400">
                Test EmailJS integration without triggering payment gateways
              </p>
            </div>

            {/* Configuration Status */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-blue-400" size={20} />
                <h2 className="text-lg font-semibold text-white">EmailJS Configuration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Service ID</p>
                  <p className="text-white font-mono text-sm">{config.serviceID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Template ID</p>
                  <p className="text-white font-mono text-sm">{config.templateID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Public Key</p>
                  <p className="text-white font-mono text-sm">{config.publicKey}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="flex items-center gap-2">
                    {config.isValid ? (
                      <>
                        <CheckCircle className="text-green-500" size={16} />
                        <span className="text-green-500 font-medium">Configured</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500" size={16} />
                        <span className="text-red-500 font-medium">Not Configured</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {!config.isValid && (
                <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ EmailJS is not properly configured. Please set your credentials in the environment variables or emailService.js
                  </p>
                </div>
              )}
            </div>

            {/* Test Email Form */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Send Test Email</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    placeholder="Enter recipient name"
                  />
                </div>

                {/* User Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    placeholder="recipient@example.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent resize-none"
                    placeholder="Enter your test message here..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending || !config.isValid}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-red hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Test Email</span>
                    </>
                  )}
                </button>
              </form>

              {/* Result Message */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-900/30 border-green-700'
                      : 'bg-red-900/30 border-red-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" size={24} />
                    )}
                    <div>
                      <p className={`font-medium ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                        {result.success ? 'Success!' : 'Error'}
                      </p>
                      <p className={`text-sm mt-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">📝 Instructions</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>• This panel allows you to test EmailJS integration safely</li>
                <li>• No payment gateway will be triggered when sending test emails</li>
                <li>• Make sure your EmailJS credentials are configured correctly</li>
                <li>• Check your spam folder if you don't receive the email</li>
                <li>• EmailJS free tier has a limit of 200 emails per month</li>
              </ul>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminEmailTest;
