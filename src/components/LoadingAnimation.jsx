import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ 
  text = "Generating", 
  showLoader = true,
  className = "" 
}) => {
  const letters = text.split('');

  return (
    <div className={`loader-wrapper flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center justify-center mb-4">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="loader-letter text-2xl font-display text-primary-red mx-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              repeat: Infinity,
              repeatDelay: 2
            }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.5rem',
              color: '#E10600',
              margin: '0 2px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      
      {showLoader && (
        <motion.div
          className="loader w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: '64px',
            height: '64px',
            border: '4px solid #E10600',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
    </div>
  );
};

export default LoadingAnimation; 