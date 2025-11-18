import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-black to-charcoal flex items-center justify-center bg-fixed bg-cover bg-center min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}/>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-7xl md:text-8xl font-display uppercase text-primary-red mb-6 neon-text"
        >
          Vaibhav Tools
        </motion.h1>
        
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl text-white mb-12 font-sans"
        >
          Crafting Excellence Since 1950
        </motion.p>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-red to-red-600 text-white text-lg sm:text-xl min-w-[200px] py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-600 hover:to-primary-red neon-glow"
          >
            Shop Now
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-primary-red text-primary-red text-lg sm:text-xl min-w-[200px] py-4 px-8 rounded-xl font-semibold hover:bg-primary-red hover:text-white transition-all duration-300"
          >
            View Catalog
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1,
            delay: 0.6
          }}
          whileHover={{ scale: 1.1 }}
          onClick={scrollToNext}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDownIcon className="h-8 w-8 text-primary-red" />
          </motion.div>
        </motion.div>
      </div>

      {/* Side Decorative Elements */}
      <motion.div 
        className="absolute left-0 top-0 h-full w-1 bg-primary-red"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute right-0 top-0 h-full w-1 bg-primary-red"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default Hero;