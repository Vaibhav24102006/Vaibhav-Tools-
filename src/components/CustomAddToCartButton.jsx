import React from 'react';
import { motion } from 'framer-motion';

const CustomAddToCartButton = ({ 
  onClick, 
  children = "Add to Cart", 
  disabled = false, 
  loading = false,
  className = "",
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        font-display text-2xl text-white uppercase
        px-5 py-2.5 rounded-[10px]
        border-2 border-white
        bg-[#252525]
        shadow-[3px_3px_0px_#fafafa]
        cursor-pointer
        my-9
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-[4px_4px_0px_#fafafa] hover:translate-x-[-1px] hover:translate-y-[-1px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
        ${className}
      `}
      style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        color: '#fafafa',
        padding: '10px 20px',
        borderRadius: '10px',
        border: '2px solid #fafafa',
        background: '#252525',
        boxShadow: '3px 3px #fafafa',
        cursor: 'pointer',
        margin: '35px 0',
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
};

export default CustomAddToCartButton; 