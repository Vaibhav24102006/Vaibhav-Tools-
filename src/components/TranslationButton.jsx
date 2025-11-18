import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';

const TranslationButton = () => {
  const { currentLanguage, toggleLanguage, isTranslating, isHindi } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <motion.button
        onClick={toggleLanguage}
        disabled={isTranslating}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          group relative overflow-hidden
          bg-gradient-to-r from-primary-red to-red-600
          hover:from-red-600 hover:to-primary-red
          text-white font-semibold
          px-6 py-3 rounded-xl
          shadow-lg hover:shadow-xl
          transition-all duration-300
          border-2 border-transparent
          hover:border-white/20
          backdrop-blur-sm
          flex items-center gap-3
          min-w-[200px]
          ${isTranslating ? 'cursor-wait opacity-70' : 'cursor-pointer'}
        `}
      >
        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
        
        {/* Loading spinner when translating */}
        {isTranslating && (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        )}
        
        {/* Language toggle icon */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🌐</span>
          <div className="text-left">
            <div className="text-sm font-bold leading-tight">
              {isHindi ? 'Translate to English' : 'हिंदी में अनुवाद'}
            </div>
            <div className="text-xs opacity-80 leading-tight">
              {isHindi ? 'अंग्रेजी में अनुवाद' : 'Translate to Hindi'}
            </div>
          </div>
        </div>

        {/* Neon glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-primary-red/20 rounded-xl blur-lg animate-pulse" />
        </div>

        {/* Sci-fi border animation */}
        <div className="absolute inset-0 rounded-xl border border-primary-red/30 group-hover:border-primary-red/60 transition-all duration-300">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/60 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/60 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/60 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/60 rounded-br-xl" />
        </div>

        {/* Current language indicator */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-black border-2 border-primary-red rounded-full flex items-center justify-center text-xs font-bold">
          {currentLanguage.toUpperCase()}
        </div>
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg backdrop-blur-sm border border-white/20 whitespace-nowrap pointer-events-none"
      >
        {isHindi ? 'अंग्रेजी में बदलने के लिए क्लिक करें' : 'Click to switch to Hindi / हिंदी में बदलें'}
      </motion.div>
    </motion.div>
  );
};

export default TranslationButton;
