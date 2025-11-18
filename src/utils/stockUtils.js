/**
 * Stock Utilities - Vaibhav Tools
 * Centralized stock management and validation functions
 */

import { normalizeStock as getNormalizedStock, isProductInStock as checkInStock } from './productHelpers';

/**
 * Check if a product is in stock
 * @param {Object} product - Product object
 * @returns {boolean} True if product is in stock
 */
export const isProductInStock = (product) => {
  return checkInStock(product);
};

/**
 * Get stock label information for UI display
 * @param {Object} product - Product object
 * @returns {Object} Stock label with text, status, and color
 */
export const stockLabel = (product) => {
  const stock = getNormalizedStock(product);
  if (stock <= 0) return { text: "Out of Stock", status: "out", color: "red" };
  if (stock < 5) return { text: "Limited Stock", status: "limited", color: "orange" };
  return { text: "In Stock", status: "in", color: "green" };
};

/**
 * Get stock quantity as number
 * @param {Object} product - Product object
 * @returns {number} Stock quantity
 */
export const getStockQuantity = (product) => {
  return getNormalizedStock(product);
};

/**
 * Check if requested quantity is available
 * @param {Object} product - Product object
 * @param {number} requestedQuantity - Quantity requested
 * @returns {boolean} True if quantity is available
 */
export const isQuantityAvailable = (product, requestedQuantity = 1) => {
  const availableStock = getStockQuantity(product);
  return availableStock >= requestedQuantity;
};

/**
 * Get stock status message for user feedback
 * @param {Object} product - Product object
 * @param {number} requestedQuantity - Quantity requested
 * @returns {string} User-friendly stock message
 */
export const getStockMessage = (product, requestedQuantity = 1) => {
  const stock = getStockQuantity(product);
  const available = isQuantityAvailable(product, requestedQuantity);
  
  if (!available) {
    if (stock === 0) {
      return `${product.name} is out of stock and cannot be added to cart.`;
    } else {
      return `${product.name} has only ${stock} items in stock. Cannot add ${requestedQuantity} items.`;
    }
  }
  
  if (stock < 5 && stock > 0) {
    return `${product.name} has limited stock (${stock} items remaining).`;
  }
  
  return `${product.name} is available in stock.`;
};

/**
 * Validate stock before adding to cart
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity to add
 * @param {Function} showToast - Toast notification function
 * @returns {boolean} True if validation passes
 */
export const validateStockForCart = (product, quantity = 1, showToast) => {
  if (!isProductInStock(product)) {
    console.warn(`[CART] Attempt to add out-of-stock product id=${product.id}`);
    if (showToast) {
      showToast(getStockMessage(product, quantity));
    }
    return false;
  }
  
  if (!isQuantityAvailable(product, quantity)) {
    console.warn(`[CART] Insufficient stock for product id=${product.id}, requested=${quantity}, available=${getStockQuantity(product)}`);
    if (showToast) {
      showToast(getStockMessage(product, quantity));
    }
    return false;
  }
  
  return true;
};

/**
 * Validate stock before moving from wishlist to cart
 * @param {Object} product - Product object
 * @param {Function} showToast - Toast notification function
 * @returns {boolean} True if validation passes
 */
export const validateStockForWishlistToCart = (product, showToast) => {
  if (!isProductInStock(product)) {
    console.warn(`[WISHLIST->CART] Product out of stock id=${product.id}`);
    if (showToast) {
      showToast(`${product.name} is out of stock and cannot be moved to cart.`);
    }
    return false;
  }
  
  return true;
};