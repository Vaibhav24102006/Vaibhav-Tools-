import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Vaibhav Tools</title>
        <meta name="description" content="Terms of Service for Vaibhav Tools - Professional tools and equipment. Read our terms and conditions for using our services." />
      </Helmet>
      
      <div className="w-full min-h-screen bg-light-gray pt-20">
        {/* Hero Section */}
        <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-red mb-4"
            >
              Terms of Service
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-base sm:text-lg"
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using the Vaibhav Tools website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on Vaibhav Tools's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Provide accurate and complete information when creating an account or placing orders</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use our products and services in accordance with safety guidelines and manufacturer instructions</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use our services for any illegal or unauthorized purpose</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">4. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our website or services to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our website</li>
                <li>Use our products for any dangerous or illegal activities</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">5. Product Information and Safety</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate product information, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. Users are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Reading and following all safety instructions provided with products</li>
                <li>Using appropriate safety equipment when operating tools</li>
                <li>Ensuring proper training before using professional equipment</li>
                <li>Complying with local safety regulations and standards</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The content on this website, including but not limited to text, graphics, images, logos, and software, is the property of Vaibhav Tools and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                Vaibhav Tools shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services or products.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">9. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@vaibhavtools.com<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Address:</strong> 123 Tool Street, Industrial Area, India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService; 