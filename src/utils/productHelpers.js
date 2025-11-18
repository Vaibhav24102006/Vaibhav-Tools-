/**
 * Product Helpers - VaibhavTools
 * Utility functions for product data normalization and validation
 */

/**
 * Normalize stock value from product object
 * Handles multiple field names (stock, stockCount, quantity)
 * Handles string vs number types
 * Returns safe integer >= 0
 * 
 * @param {Object} product - Product object from Firestore
 * @returns {number} Normalized stock count (integer >= 0)
 */
export function normalizeStock(product = {}) {
  // Try multiple possible field names
  const raw = product.stock ?? product.stockCount ?? product.quantity ?? 0;
  
  // Convert to string, remove non-numeric chars (except minus), parse
  const parsed = parseInt(String(raw || 0).replace(/[^0-9-]/g, ''), 10);
  
  // Handle NaN or negative values
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  
  return parsed;
}

/**
 * Check if product is in stock
 * @param {Object} product - Product object
 * @returns {boolean} True if stock > 0
 */
export function isProductInStock(product) {
  return normalizeStock(product) > 0;
}

/**
 * Check if product is out of stock
 * @param {Object} product - Product object
 * @returns {boolean} True if stock <= 0
 */
export function isProductOutOfStock(product) {
  return normalizeStock(product) <= 0;
}

/**
 * Get stock display label
 * @param {Object} product - Product object
 * @returns {Object} { text, badge class, color }
 */
export function getStockLabel(product) {
  const stock = normalizeStock(product);
  
  if (stock <= 0) {
    return {
      text: 'Out of stock',
      badgeClass: 'bg-gray-800 text-red-400',
      color: 'red',
      available: false
    };
  }
  
  if (stock < 5) {
    return {
      text: `Only ${stock} left`,
      badgeClass: 'bg-orange-100 text-orange-800',
      color: 'orange',
      available: true
    };
  }
  
  if (stock < 20) {
    return {
      text: `${stock} in stock`,
      badgeClass: 'bg-green-100 text-green-800',
      color: 'green',
      available: true
    };
  }
  
  return {
    text: 'In stock',
    badgeClass: 'bg-green-100 text-green-800',
    color: 'green',
    available: true
  };
}

/**
 * Validate if requested quantity is available
 * @param {Object} product - Product object
 * @param {number} requestedQty - Requested quantity
 * @returns {boolean} True if quantity available
 */
export function isQuantityAvailable(product, requestedQty = 1) {
  const stock = normalizeStock(product);
  return stock >= requestedQty;
}

/**
 * Get max quantity that can be added to cart
 * @param {Object} product - Product object
 * @param {number} currentCartQty - Current quantity in cart
 * @param {number} maxPerOrder - Maximum allowed per order (default 99)
 * @returns {number} Max quantity available
 */
export function getMaxAvailableQuantity(product, currentCartQty = 0, maxPerOrder = 99) {
  const stock = normalizeStock(product);
  const remaining = Math.max(0, stock - currentCartQty);
  return Math.min(remaining, maxPerOrder);
}

/**
 * Sanitize stock value for saving to Firestore
 * Ensures stock is always stored as Number >= 0
 * @param {any} stockValue - Raw stock value from form/input
 * @returns {number} Sanitized stock value
 */
export function sanitizeStockForSave(stockValue) {
  const parsed = parseInt(String(stockValue || 0).replace(/[^0-9-]/g, ''), 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}
