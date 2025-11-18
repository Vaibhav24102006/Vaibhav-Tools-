import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import CustomAddToCartButton from '../components/CustomAddToCartButton';
import StockBadge from '../components/StockBadge';
import { isProductInStock, validateStockForWishlistToCart } from '../utils/stockUtils';
import { normalizeStock } from '../utils/productHelpers';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowConfirmDialog(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove.id);
      setItemToRemove(null);
      setShowConfirmDialog(false);
    }
  };

  const handleAddToCart = (item) => {
    console.log('[Wishlist] Attempting to add to cart:', item.name);
    
    // Validate stock before adding
    const showToast = (message) => alert(`⚠️ ${message}`);
    if (!validateStockForWishlistToCart(item, showToast)) {
      console.warn('[Wishlist] Stock validation failed for product:', item.name);
      return;
    }
    
    console.log('[Wishlist] Stock validation passed, adding to cart');
    addToCart(item);
    alert(`✅ ${item.name} added to cart!`);
  };
  
  const handleAddAllToCart = () => {
    console.log('[Wishlist] Adding all items to cart');
    
    let successCount = 0;
    let failedItems = [];
    
    items.forEach(item => {
      const showToast = () => {}; // Silent validation for bulk operation
      if (validateStockForWishlistToCart(item, showToast)) {
        addToCart(item);
        successCount++;
      } else {
        failedItems.push(item.name);
        console.warn('[Wishlist] Cannot add to cart:', item.name, 'out of stock');
      }
    });
    
    if (successCount > 0) {
      alert(`✅ ${successCount} item(s) added to cart!`);
    }
    
    if (failedItems.length > 0) {
      alert(`⚠️ Could not add ${failedItems.length} item(s) (out of stock):\n${failedItems.join(', ')}`);
    }
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating || 0)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <HeartIconSolid className="h-8 w-8 text-primary-red" />
            <h1 className="text-4xl font-bold text-gray-900">Your Wishlist</h1>
          </div>
          {items.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">{items.length} items</p>
              <p className="text-lg font-semibold text-gray-900">Total: ₹{getTotalValue()}</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to purchase?</h3>
                <p className="text-gray-600">Add all items to your cart and checkout</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAllToCart}
                className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add All to Cart</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img 
                    src={item.image || '/images/logo.jpg'} 
                    alt={item.name} 
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveClick(item)}
                      className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                  {item.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${item.badgeColor || 'bg-red-500'}`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.rating && (
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(item.rating)}
                      <span className="text-sm text-gray-600 ml-2">{item.rating}</span>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="mb-3">
                    <StockBadge 
                      stockCount={normalizeStock(item)} 
                      saleEndsAt={item.saleEndsAt}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-red">
                      ₹{item.price?.toFixed(2) || '0.00'}
                    </span>
                    {item.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <CustomAddToCartButton
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center space-x-2"
                      disabled={!isProductInStock(item)}
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                      <span>{isProductInStock(item) ? 'Add to Cart' : 'Out of Stock'}</span>
                    </CustomAddToCartButton>
                    
                    <Link
                      to={`/products/${item.id}`}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items to your wishlist to keep track of products you love!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Remove from Wishlist</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{itemToRemove?.name}" from your wishlist?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
