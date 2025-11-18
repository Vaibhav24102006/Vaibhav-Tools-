import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const ShippingInfo = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Information - Vaibhav Tools</title>
        <meta name="description" content="Shipping Information for Vaibhav Tools - Learn about our shipping options, delivery timeframes, and tracking for professional tools and equipment." />
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
              Shipping Information
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-base sm:text-lg"
            >
              Fast, reliable delivery for professional tools
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
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
                <p className="text-green-800 font-semibold">
                  🚚 <strong>Free Shipping:</strong> Orders over $100 qualify for free standard shipping within India.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-black mb-4">1. Shipping Options</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary-red mb-3">Standard Shipping</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• 3-5 business days</li>
                    <li>• $9.99 flat rate</li>
                    <li>• Free on orders over $100</li>
                    <li>• Tracking included</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary-red mb-3">Express Shipping</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• 1-2 business days</li>
                    <li>• $19.99 flat rate</li>
                    <li>• Priority handling</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-black mb-4">2. Delivery Timeframes</h2>
              <p className="text-gray-700 mb-4">
                Our delivery timeframes are estimates and may vary based on:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Location:</strong> Remote areas may take longer</li>
                <li><strong>Weather:</strong> Adverse weather conditions may cause delays</li>
                <li><strong>Customs:</strong> International shipments may be delayed in customs</li>
                <li><strong>Product Availability:</strong> Backordered items will ship when available</li>
                <li><strong>Holidays:</strong> Delivery times may be extended during holidays</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">3. Delivery Zones</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Zone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Standard Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Express Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Local (Same City)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">1-2 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Same day</td>
                      <td className="px-4 py-3 text-sm text-gray-700">$5.99 / $15.99</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Domestic (India)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">3-5 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">1-2 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">$9.99 / $19.99</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">International</td>
                      <td className="px-4 py-3 text-sm text-gray-700">7-14 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">3-5 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">$29.99 / $49.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-black mb-4">4. Order Processing</h2>
              <p className="text-gray-700 mb-4">
                Once you place an order:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 mb-6">
                <li><strong>Order Confirmation:</strong> You'll receive an email confirmation immediately</li>
                <li><strong>Processing:</strong> Orders are processed within 24 hours (business days)</li>
                <li><strong>Shipping:</strong> You'll receive a shipping confirmation with tracking number</li>
                <li><strong>Delivery:</strong> Package is delivered to your specified address</li>
              </ol>

              <h2 className="text-2xl font-bold text-black mb-4">5. Tracking Your Order</h2>
              <p className="text-gray-700 mb-4">
                Track your order through multiple channels:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Email Updates:</strong> Automatic notifications at each stage</li>
                <li><strong>Order History:</strong> Track through your account dashboard</li>
                <li><strong>Tracking Number:</strong> Use the provided tracking number with the carrier</li>
                <li><strong>Customer Service:</strong> Contact us for assistance with tracking</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">6. Delivery Conditions</h2>
              <p className="text-gray-700 mb-4">
                To ensure successful delivery:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Address Accuracy:</strong> Ensure your shipping address is complete and accurate</li>
                <li><strong>Contact Information:</strong> Provide a valid phone number for delivery coordination</li>
                <li><strong>Access:</strong> Ensure the delivery location is accessible during business hours</li>
                <li><strong>Signature Required:</strong> Some items may require signature upon delivery</li>
                <li><strong>Weather Conditions:</strong> Delivery may be delayed due to adverse weather</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">7. Failed Deliveries</h2>
              <p className="text-gray-700 mb-4">
                If delivery fails, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Attempt delivery again the next business day</li>
                <li>Contact you to arrange an alternative delivery time</li>
                <li>Hold the package at a local facility for pickup</li>
                <li>Return the package to us if delivery cannot be completed</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">8. International Shipping</h2>
              <p className="text-gray-700 mb-4">
                For international orders:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Customs Duties:</strong> Import duties and taxes are the responsibility of the recipient</li>
                <li><strong>Documentation:</strong> We provide all necessary customs documentation</li>
                <li><strong>Restricted Items:</strong> Some tools may be restricted in certain countries</li>
                <li><strong>Delivery Times:</strong> May vary based on customs processing</li>
                <li><strong>Tracking:</strong> International tracking available for most destinations</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">9. Special Handling</h2>
              <p className="text-gray-700 mb-4">
                Some items require special handling:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Heavy Items:</strong> Additional fees may apply for items over 50kg</li>
                <li><strong>Fragile Items:</strong> Extra packaging and careful handling</li>
                <li><strong>Hazardous Materials:</strong> Special shipping requirements and restrictions</li>
                <li><strong>Oversized Items:</strong> May require freight shipping</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">10. Shipping Partners</h2>
              <p className="text-gray-700 mb-4">
                We work with trusted shipping partners:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Domestic:</strong> Blue Dart, DTDC, Professional Couriers</li>
                <li><strong>International:</strong> DHL, FedEx, UPS</li>
                <li><strong>Local Delivery:</strong> Our own delivery network in major cities</li>
              </ul>

              <h2 className="text-2xl font-bold text-black mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                For shipping inquiries or assistance:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Shipping Email:</strong> shipping@vaibhavtools.com<br />
                  <strong>Customer Service:</strong> +1 (555) 123-4567<br />
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST<br />
                  <strong>Address:</strong> Shipping Department, 123 Tool Street, Industrial Area, India
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="text-blue-800">
                  <strong>💡 Pro Tip:</strong> Sign up for our newsletter to receive shipping updates and exclusive offers. You can also save your preferred shipping address in your account for faster checkout.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ShippingInfo; 