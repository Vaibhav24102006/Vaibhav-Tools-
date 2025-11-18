import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useT } from './TranslatableText';
import { 
  FaLinkedin, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const t = useT();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Newsletter signup processed
      setEmailSubmitted(true);
      setEmail('');
      setTimeout(() => setEmailSubmitted(false), 3000);
    }
  };

  const socialLinks = [
    { icon: FaLinkedin, href: 'https://linkedin.com/company/vaibhavtools', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/vaibhavtools', label: 'Instagram' },
    { icon: FaWhatsapp, href: 'https://wa.me/919876543210', label: 'WhatsApp' },
    { icon: FaEnvelope, href: 'mailto:info@vaibhavtools.com', label: 'Email' }
  ];

  return (
    <footer className="bg-black text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <img 
              src="/images/logo.jpg" 
              alt="Vaibhav Tools" 
              className="h-16 w-auto mx-auto md:mx-0 mb-4 rounded-lg shadow-md"
            />
            <p className="text-primary-red font-semibold text-lg mb-2">Made in India 🇮🇳</p>
            <p className="text-gray-300 text-sm mb-4">
              {t("Professional tools for professionals. Quality craftsmanship since 1950.")}
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-primary-red transition-colors duration-300"
                  title={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-primary-red">{t("Quick Links")}</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Home")}</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">{t("About")}</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Products")}</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Contact")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-primary-red">{t("Legal")}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Privacy Policy")}</a></li>
              <li><a href="/refund-policy" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Refund Policy")}</a></li>
              <li><a href="/shipping-info" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Shipping Info")}</a></li>
              <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-300">{t("Terms of Service")}</a></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-primary-red">{t("Stay Updated")}</h3>
            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Enter your email")}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red text-white placeholder-gray-400"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-600 transition-colors duration-300 font-semibold"
                >
                  {t("Subscribe")}
                </motion.button>
              </div>
            </form>
            {emailSubmitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-sm"
              >
                {t("Thank you for subscribing!")}
              </motion.p>
            )}
            
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-center md:justify-start">
                <FaPhone className="h-4 w-4 mr-2 text-primary-red" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="h-4 w-4 mr-2 text-primary-red" />
                <span>info@vaibhavtools.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="h-4 w-4 mr-2 text-primary-red" />
                <span>123 Tool Street, Industrial Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Vaibhav Tools. {t("All rights reserved.")}
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right max-w-md">
              All product names, logos, and brands are property of their respective owners. Fair use intended.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;