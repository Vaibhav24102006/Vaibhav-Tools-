import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * StockBadge Component
 * Displays stock availability status with appropriate styling
 * 
 * Stock levels:
 * - In Stock (>= 5): Green badge
 * - Limited Stock (1-4): Orange badge with exact count
 * - Out of Stock (0): Red badge, disabled state
 * - Limited Time: Special badge if saleEndsAt exists
 */

const StockBadge = ({ stockCount = 0, saleEndsAt = null, className = '' }) => {
  console.log('[StockBadge] Rendering with stockCount:', stockCount);
  
  // Determine stock status
  const getStockStatus = () => {
    // Convert to number to handle string values
    const stock = Number(stockCount) || 0;
    
    if (stock >= 5) {
      return {
        label: '✅ In Stock',
        color: 'bg-green-500/20 text-green-400 border-green-500/50',
        icon: <CheckCircleIcon className="h-4 w-4" />,
        pulse: false
      };
    } else if (stock > 0 && stock < 5) {
      return {
        label: `⚠️ Limited Stock (${stock} left)`,
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
        icon: <ExclamationTriangleIcon className="h-4 w-4" />,
        pulse: true
      };
    } else {
      return {
        label: '❌ Out of Stock',
        color: 'bg-red-500/20 text-red-400 border-red-500/50',
        icon: <XCircleIcon className="h-4 w-4" />,
        pulse: false
      };
    }
  };

  const status = getStockStatus();
  
  // Check if limited time offer
  const isLimitedTime = saleEndsAt && new Date(saleEndsAt) > new Date();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Stock Status Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
      >
        {status.icon}
        <span>{status.label}</span>
      </motion.div>

      {/* Limited Time Badge */}
      {isLimitedTime && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-red-500/20 text-red-400 border-red-500/50 text-xs font-semibold"
        >
          <ClockIcon className="h-4 w-4" />
          <span>Limited Time Offer</span>
        </motion.div>
      )}
    </div>
  );
};

export default StockBadge;
