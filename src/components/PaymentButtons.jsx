import React, { useState } from 'react';
import { motion } from 'framer-motion';
import paymentService from '../services/paymentService';

const PaymentButtons = ({ orderData, onPaymentSuccess, onPaymentError }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = async (method) => {
    setProcessing(true);
    setSelectedMethod(method);

    try {
      let result;
      
      switch (method) {
        case 'razorpay':
          result = await paymentService.processRazorpayPayment(orderData);
          break;
        case 'stripe':
          result = await paymentService.processStripePayment(orderData);
          break;
        case 'upi':
          result = await paymentService.processUPIPayment(orderData);
          break;
        case 'netbanking':
          result = await paymentService.processCanaraNetBanking(orderData);
          break;
        default:
          throw new Error('Unsupported payment method');
      }

      // Verify payment on backend
      const verification = await paymentService.verifyPayment(result);
      
      if (verification.success) {
        onPaymentSuccess(result);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      onPaymentError(error.message);
    } finally {
      setProcessing(false);
      setSelectedMethod(null);
    }
  };

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: '💳',
      description: 'Credit/Debit Cards, UPI, NetBanking',
      color: 'bg-blue-600 hover:bg-blue-700',
      comingSoon: false
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '🌐',
      description: 'International Cards',
      color: 'bg-purple-600 hover:bg-purple-700',
      comingSoon: false
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'PhonePe, Google Pay, Paytm',
      color: 'bg-green-600 hover:bg-green-700',
      comingSoon: true
    },
    {
      id: 'netbanking',
      name: 'Canara NetBanking',
      icon: '🏦',
      description: 'Canara Bank NetBanking',
      color: 'bg-orange-600 hover:bg-orange-700',
      comingSoon: true
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !method.comingSoon && handlePayment(method.id)}
            disabled={processing || method.comingSoon}
            className={`relative p-6 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              method.comingSoon ? 'bg-gray-400' : method.color
            }`}
          >
            {method.comingSoon && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{method.icon}</div>
              <div className="text-left">
                <div className="font-bold text-lg">{method.name}</div>
                <div className="text-sm opacity-90">{method.description}</div>
              </div>
            </div>
            
            {processing && selectedMethod === method.id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">🚧 Development Mode</h4>
        <p className="text-sm text-yellow-700">
          Payment integration is currently in development. UPI and NetBanking methods are placeholder implementations.
          For production, ensure you have valid API keys and proper backend integration.
        </p>
      </div>

      {/* Payment Security Info */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">🔒 Secure Payments</h4>
        <p className="text-sm text-green-700">
          All payments are processed through secure, encrypted channels. We never store your payment information.
        </p>
      </div>
    </div>
  );
};

export default PaymentButtons;
