import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - Vaibhav Tools</title>
        <meta name="description" content="Refund Policy for Vaibhav Tools - Learn about our return and refund policies for professional tools and equipment." />
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
              Refund Policy
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
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <p className="text-blue-800 font-semibold">
                  💡 <strong>Customer Satisfaction Guarantee:</strong> We stand behind the quality of our products. If you're not completely satisfied with your purchase, we're here to help.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-black mb-4">1. Return Window</h2>
              <p className="text-gray-700 mb-4">
                We offer a <strong>30-day return window</strong> from the date of delivery for most products. To be eligible for a return:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>The item must be unused and in its original packaging</li>
                <li>All original accessories, manuals, and warranty cards must be included</li>
                <li>The item must not show any signs of wear or damage</li>
                <li>You must have proof of purchase (order confirmation or receipt)</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">2. Non-Returnable Items</h2>
              <p className="text-gray-700 mb-4">
                For safety and hygiene reasons, the following items cannot be returned:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Safety Equipment:</strong> Helmets, safety glasses, gloves, and other personal protective equipment</li>
                <li><strong>Custom or Special Orders:</strong> Items made to your specifications</li>
                <li><strong>Software and Digital Products:</strong> Once downloaded or activated</li>
                <li><strong>Used or Damaged Items:</strong> Items showing signs of use or damage</li>
                <li><strong>Clearance or Sale Items:</strong> Unless defective</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">3. Defective Products</h2>
              <p className="text-gray-700 mb-4">
                If you receive a defective product, we offer the following options:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Replacement:</strong> We'll send you a new item at no additional cost</li>
                <li><strong>Repair:</strong> We can arrange for the item to be repaired under warranty</li>
                <li><strong>Full Refund:</strong> Including shipping costs</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Note:</strong> Defective products are covered by our warranty policy, which may extend beyond the standard return window.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">4. Return Process</h2>
              <p className="text-gray-700 mb-4">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 mb-6">
                <li><strong>Contact Us:</strong> Email us at returns@vaibhavtools.com or call +1 (555) 123-4567</li>
                <li><strong>Provide Details:</strong> Include your order number, item description, and reason for return</li>
                <li><strong>Get Approval:</strong> We'll review your request and provide a return authorization number</li>
                <li><strong>Package Item:</strong> Securely package the item in its original packaging</li>
                <li><strong>Ship Back:</strong> Use the provided shipping label or ship to our return address</li>
                <li><strong>Receive Refund:</strong> Once we receive and inspect the item, we'll process your refund</li>
              </ol>

              <h2 className="text-2xl font-bold text-black mb-4">5. Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                Shipping costs for returns are handled as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Defective Items:</strong> We cover all shipping costs</li>
                <li><strong>Wrong Item Shipped:</strong> We cover all shipping costs</li>
                <li><strong>Customer Preference Returns:</strong> Customer pays return shipping</li>
                <li><strong>Free Return Shipping:</strong> Available for orders over $100</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">6. Refund Processing</h2>
              <p className="text-gray-700 mb-4">
                Once we receive your return:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Inspection:</strong> We inspect the item within 2-3 business days</li>
                <li><strong>Approval:</strong> If approved, we process the refund immediately</li>
                <li><strong>Timeline:</strong> Refunds typically appear in your account within 5-10 business days</li>
                <li><strong>Method:</strong> Refunds are issued to the original payment method</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">7. Partial Refunds</h2>
              <p className="text-gray-700 mb-6">
                In some cases, we may offer partial refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Item returned in less than perfect condition</li>
                <li>Missing accessories or packaging</li>
                <li>Items returned after the 30-day window (case-by-case basis)</li>
                <li>Restocking fees for certain items (clearly stated at purchase)</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">8. Warranty Claims</h2>
              <p className="text-gray-700 mb-4">
                For items under warranty:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Contact the manufacturer directly for warranty service</li>
                <li>We can assist with warranty claims for items purchased from us</li>
                <li>Warranty terms vary by manufacturer and product</li>
                <li>Extended warranty options available for select items</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">9. International Returns</h2>
              <p className="text-gray-700 mb-6">
                For international orders:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Customs duties and taxes are non-refundable</li>
                <li>Returns must comply with local import/export regulations</li>
                <li>Processing times may be longer for international returns</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">10. Exchanges</h2>
              <p className="text-gray-700 mb-4">
                We offer exchanges for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Different size or model of the same product</li>
                <li>Different color or variant (if available)</li>
                <li>Upgrades to higher-end models (price difference applies)</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Exchanges follow the same return process and timeline.
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                For returns, refunds, or exchanges, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Returns Email:</strong> returns@vaibhavtools.com<br />
                  <strong>Customer Service:</strong> +1 (555) 123-4567<br />
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST<br />
                  <strong>Address:</strong> Returns Department, 123 Tool Street, Industrial Area, India
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                <p className="text-yellow-800">
                  <strong>⚠️ Important:</strong> Please ensure all items are properly packaged for return shipping. We are not responsible for damage during return transit if items are not adequately protected.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy; 