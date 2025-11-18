import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Vaibhav Tools</title>
        <meta name="description" content="Privacy Policy for Vaibhav Tools - Learn how we collect, use, and protect your personal information when you use our services." />
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
              Privacy Policy
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
              <h2 className="text-2xl font-bold text-black mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                <li><strong>Account Information:</strong> Username, password, account preferences</li>
                <li><strong>Order Information:</strong> Products purchased, payment details, shipping information</li>
                <li><strong>Communication:</strong> Messages, feedback, and support requests</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">2. Automatically Collected Information</h2>
              <p className="text-gray-700 mb-4">
                When you visit our website, we automatically collect certain information about your device and usage:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Information:</strong> Pages visited, time spent on pages, links clicked</li>
                <li><strong>Cookies and Similar Technologies:</strong> To enhance your browsing experience</li>
                <li><strong>Analytics Data:</strong> Website performance and user behavior patterns</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send order confirmations, updates, and shipping notifications</li>
                <li>Improve our website, products, and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Service Providers:</strong> With trusted partners who help us operate our business (payment processors, shipping companies)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality and performance</li>
              </ul>
              <p className="text-gray-700 mb-6">
                You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">7. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
              <p className="text-gray-700 mb-6">
                Third-party services we use include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Email marketing platforms</li>
                <li>Customer support tools</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">9. Data Retention</h2>
              <p className="text-gray-700 mb-6">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Account information is typically retained for the duration of your account plus a reasonable period for business purposes.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable data protection laws.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@vaibhavtools.com<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Address:</strong> 123 Tool Street, Industrial Area, India<br />
                  <strong>Data Protection Officer:</strong> dpo@vaibhavtools.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 