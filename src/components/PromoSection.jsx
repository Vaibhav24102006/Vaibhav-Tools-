import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useT } from './TranslatableText';

const PromoSection = ({ 
  videoSrc = null, 
  placeholderImage = "https://placehold.co/1920x1080/1A1A1A/FFFFFF?text=Background+Video+Placeholder",
  title = "Power Your Work with Precision Tools",
  ctaText = "Shop Now",
  ctaLink = "/products"
}) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const t = useT();

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        console.log('Video loaded successfully:', videoSrc);
        setVideoLoaded(true);
        setVideoError(false);
      };

      const handleError = (e) => {
        console.error('Video loading error:', e, videoSrc);
        setVideoLoaded(false);
        setVideoError(true);
      };

      const handleCanPlay = () => {
        console.log('Video can play:', videoSrc);
        setVideoLoaded(true);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Force video to load
      video.load();

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          <>
            {/* Background Video */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-0"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={placeholderImage}
              aria-label="Background video showcasing precision tools and industrial work environment"
              webkit-playsinline="true"
              x5-video-player-type="h5"
              x5-video-orientation="portrait"
              crossOrigin="anonymous"
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc} type="video/webm" />
              {/* Fallback for browsers that don't support video */}
              <div className="absolute inset-0 bg-black" />
            </video>
            
            {/* Fallback image for when video fails or is loading */}
            <div
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 ${
                videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-1000`}
              style={{ backgroundImage: `url(${placeholderImage})` }}
              aria-hidden="true"
            />
          </>
        ) : (
          /* Fallback background image when no video provided */
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url(${placeholderImage})` }}
            aria-hidden="true"
          />
        )}

        {/* Dark Semi-Transparent Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-60 z-10" 
          aria-hidden="true"
        />

        {/* Subtle Metallic Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-20" 
          style={{
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/brushed-alum.png)',
            backgroundSize: '400px 400px'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Title */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display text-white font-bold uppercase tracking-wider leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block"
            >
              {t(title)}
            </motion.span>
          </h2>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-32 h-1 bg-primary-red mx-auto rounded-full"
            aria-hidden="true"
          />

          {/* Call-to-Action Button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to={ctaLink}
              className="inline-block group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-red to-red-600 opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-primary-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="relative z-10 block px-12 py-4 text-white font-sans font-bold text-xl uppercase tracking-wider transition-transform duration-300 group-hover:scale-105">
                {t(ctaText)}
              </span>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white" />
            </Link>
          </motion.div>

          {/* Additional Subtle Animation Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center space-x-8 mt-12"
            aria-hidden="true"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="w-2 h-2 bg-primary-red rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Performance Optimization: Reduce motion for users who prefer it */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          video {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default PromoSection;
