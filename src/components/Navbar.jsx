import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useT } from '../components/TranslatableText';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { currentUser, logout } = useAuth();
  const t = useT();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      // Logout error handled silently
    }
  };

  const navLinks = [
    { path: '/', label: t('Home') },
    { path: '/about', label: t('About') },
    { path: '/products', label: t('Products') },
    { path: '/contact', label: t('Contact') }
  ];

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`header fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 backdrop-blur-md shadow-lg ${scrolled ? styles.scrolled : ''}`}
      style={{
        height: 'var(--navbar-height)',
        fontFamily: 'Bebas Neue, sans-serif',
        letterSpacing: '0.04em',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="block">
              <img
                src="/images/logo.jpg"
                alt="Vaibhav Tools Logo"
                className="h-12 w-auto object-contain rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative uppercase text-lg font-display tracking-wider px-3 py-2 transition-all duration-300 
                  ${isActive(link.path)
                    ? 'text-primary-red font-bold bg-white/10 rounded-lg neon-text'
                    : 'text-white hover:text-primary-red hover:neon-text'}
                `}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={`absolute inset-0 bg-white/10 rounded-lg transform transition-all duration-300 
                    ${isActive(link.path) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  `}
                />
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-red transition-all duration-300 
                    ${isActive(link.path) ? 'w-full' : 'w-0'}
                  `}
                  style={{ boxShadow: isActive(link.path) ? '0 0 8px #E10600' : 'none' }}
                />
              </Link>
            ))}
          </div>

          {/* Cart Icon & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-red"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="hidden md:inline">{currentUser.email?.split('@')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {t('Signed in as')}<br/>{currentUser.email}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('Profile')}
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('Wishlist')}
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('My Orders')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      {t('Sign Out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
              >
                {t('Sign In')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block text-lg font-display tracking-wider py-3 px-4 rounded-lg transition-all duration-300 ${
                      isActive(link.path)
                        ? 'text-primary-red bg-white/10'
                        : 'text-white hover:text-primary-red hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Cart Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                className="pt-4 border-t border-white/10"
              >
                <Link
                  to="/cart"
                  className="flex items-center justify-between text-lg font-display tracking-wider py-3 px-4 rounded-lg text-white hover:text-primary-red hover:bg-white/5 transition-all duration-300"
                >
                  <span>{t('Cart')}</span>
                  {getTotalItems() > 0 && (
                    <span className="bg-primary-red text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {getTotalItems() > 99 ? '99+' : getTotalItems()}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Mobile User Menu */}
              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.1 }}
                  className="pt-4 border-t border-white/10"
                >
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/profile"
                      className="block text-lg font-display tracking-wider py-3 px-4 rounded-lg text-white hover:text-primary-red hover:bg-white/5 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('Profile')}
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-lg font-display tracking-wider py-3 px-4 rounded-lg text-white hover:text-primary-red hover:bg-white/5 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-lg font-display tracking-wider py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;