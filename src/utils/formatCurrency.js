/**
 * Currency formatting utilities
 * Formats numbers as Indian Rupees (₹)
 */

/**
 * Format number as Indian Rupee currency
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} Formatted currency string
 */
export function formatINR(amount, showDecimals = false) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });

  return formatter.format(amount);
}

/**
 * Format number as compact Indian Rupee (e.g., ₹1.2K, ₹1.5L)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted compact currency string
 */
export function formatINRCompact(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    compactDisplay: 'short'
  });

  return formatter.format(amount);
}

/**
 * Parse price string to number
 * Handles various formats: "₹1,234", "$1234", "1234", etc.
 * @param {string|number} price - The price to parse
 * @returns {number} Parsed price as number
 */
export function parsePrice(price) {
  if (typeof price === 'number') {
    return price;
  }

  if (typeof price === 'string') {
    // Remove currency symbols and commas
    const cleaned = price.replace(/[₹$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export default formatINR;
