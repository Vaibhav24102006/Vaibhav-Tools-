import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../components/TranslatableText';
import { 
  WrenchScrewdriverIcon, 
  TruckIcon, 
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Timeline from '../components/Timeline';
import '../styles/About.css';

const About = () => {
  const t = useT();
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Error handlers for graceful fallbacks
  const handleImageError = useCallback(() => {
    console.warn('Workshop image failed to load, showing fallback');
    setImageError(true);
  }, []);
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);
  
  const handleVideoError = useCallback(() => {
    console.warn('Background video failed to load, showing fallback');
    setVideoError(true);
  }, []);
  
  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    }
  }, []);
  
  // Intersection Observer for video optimization
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(err => {
              console.warn('Video play failed:', err);
            });
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    
    observer.observe(videoElement);
    
    return () => {
      observer.disconnect();
    };
  }, [videoLoaded]);
  
  const coreValues = [
    {
      icon: ShieldCheckIcon,
      title: "Integrity over shortcuts",
      description: "We prioritize ethical, transparent approaches in every exercise and engagement."
    },
    {
      icon: SparklesIcon,
      title: "Real-world realism over theory-only learning",
      description: "Our scenarios emphasize practical skills and applied thinking."
    },
    {
      icon: UserGroupIcon,
      title: "Community-driven growth",
      description: "We grow with our community — educators, students, and practitioners together."
    },
    {
      icon: HeartIcon,
      title: "Ethical and responsible security practices",
      description: "Ethics and responsible disclosure guide every simulation and partnership."
    }
  ];

  // Timeline data for Hackiware (exact provided data)
  const journeyData = [
    {
      title: "2023",
      content: (
        <p>
          Hackiware was founded with a single objective: to bridge the gap between
          theoretical cybersecurity education and real-world attack–defense
          thinking.
        </p>
      ),
    },
    {
      title: "2024",
      content: (
        <p>
          Conducted national-level cybersecurity events, simulations, and hands-on
          workshops across institutions, promoting applied security learning.
        </p>
      ),
    },
    {
      title: "2025",
      content: (
        <p>
          Expanding into an education-first cybersecurity ecosystem focused on
          realism, depth, and immersive cyber defense experiences.
        </p>
      ),
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
  };
  return (
    <div className="w-full bg-gradient-to-b from-black to-charcoal text-white">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex items-center justify-center py-40 w-full"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60" />
        
        {/* Content with improved typography */}
        <div className="container-width relative z-10 text-center px-4">
          <motion.h1 
            className="text-6xl md:text-8xl font-display mb-6 text-primary-red drop-shadow-lg"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            >
              About Hackiware
            </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto font-light tracking-wide"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            >
              Building immersive cybersecurity experiences that bridge theory and real-world defense — empowering the next generation of defenders.
            </motion.p>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-20 px-4 relative w-full">
        <div className="container-width mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="relative z-10">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-display mb-6 text-primary-red drop-shadow-lg">Our Story</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Hackiware was founded to address a critical gap in cybersecurity education. While threats evolve rapidly, learning models often remain static.
                </p>
                <p className="text-lg leading-relaxed">
                  We believe cybersecurity cannot be mastered through theory alone. It must be experienced — simulated, tested, broken, and rebuilt.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-dark-gray/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800
                             hover:border-primary-red/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-4xl font-display text-primary-red">75+</p>
                    <p className="text-sm text-gray-400">{t("Years Experience")}</p>
                  </motion.div>
                  <motion.div 
                    className="bg-dark-gray/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800
                             hover:border-primary-red/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-4xl font-display text-primary-red">1000+</p>
                    <p className="text-sm text-gray-400">{t("Products")}</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl shadow-primary-red/10
                            relative bg-gray-800 min-h-[300px] flex items-center justify-center">
                {!imageError ? (
                  <>
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl
                                    flex items-center justify-center animate-pulse">
                        <WrenchScrewdriverIcon className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                    
                    <img 
                      src="/images/Gemini_Generated_Image_lwt038lwt038lwt0.png"
                      alt="Hackiware Workshop - immersive cybersecurity lab showcasing hands-on training environments and realistic attack–defense scenarios" 
                      className={`object-cover w-full h-full transform hover:scale-105 transition-transform duration-700
                               will-change-transform backface-visibility-hidden transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1)'
                      }}
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      width="800"
                      height="600"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none rounded-2xl" />
                  </>
                ) : (
                  // Enhanced fallback for image load failure
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl 
                              flex items-center justify-center text-center p-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <WrenchScrewdriverIcon className="h-16 w-16 text-primary-red mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">{t("Our Workshop")}</h3>
                      <p className="text-gray-300 text-sm">
                        {t("Experience our state-of-the-art manufacturing facility where quality meets innovation.")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1416453072034-c8dbfa2856b5?ixlib=rb-4.0.3')] bg-fixed bg-cover bg-center opacity-5 mix-blend-overlay" />
        </div>
        <div className="container-width mx-auto relative z-10">
          <motion.h2 
            className="text-5xl font-display text-center mb-16 text-primary-red drop-shadow-lg"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Core Principles
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                className="group bg-dark-gray/40 backdrop-blur-sm p-8 rounded-2xl text-center 
                         border border-gray-800 hover:border-primary-red transition-all duration-300
                         hover:bg-dark-gray/60 hover:shadow-xl hover:shadow-primary-red/5"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="bg-primary-red/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 
                            group-hover:bg-primary-red/20 transition-all duration-300
                            ring-2 ring 2 ring-primary-red/20 group-hover:ring-primary-red/40">
                  <value.icon className="h-12 w-12 text-primary-red" />
                </div>
                <h3 className="text-2xl font-display mb-4 group-hover:text-primary-red transition-colors">{value.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - full width animated component (Hackiware journey data) */}
      <section className="w-full py-20 bg-black">
        <div className="relative w-full">
          <motion.h2 
            className="text-5xl font-display text-center mb-12 text-primary-red"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
          {/* Timeline component is full-bleed and handles its own container */}
          <Timeline data={journeyData} />
        </div>
      </section>

      {/* CTA Section with Video */}
      <section className="py-20 px-4 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-dark-gray opacity-90" />
        <div className="container-width mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl min-h-[600px] flex items-center"
          >
            {/* Video Background */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {!videoError ? (
                <>
                  {/* Loading placeholder */}
                  {!videoLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-primary-red/10
                                  flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <SparklesIcon className="h-16 w-16 text-primary-red" />
                      </motion.div>
                    </div>
                  )}
                  
                  <motion.video 
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    className={`w-full h-full object-cover will-change-transform transition-opacity duration-1000
                              ${videoLoaded ? 'opacity-70' : 'opacity-0'}`}
                    style={{
                      filter: 'brightness(0.9) contrast(1.1) saturate(1.0)',
                      transform: 'scale(1.05)' // Slight scale to prevent edge artifacts
                    }}
                    onError={handleVideoError}
                    onLoadedData={handleVideoLoad}
                    aria-label="Hackiware promotional video showcasing immersive cybersecurity simulations and training environments"
                    preload="metadata"
                    poster="/images/Gemini_Generated_Image_lwt038lwt038lwt0.png" // Use workshop image as poster
                  >
                    {/* Primary MP4 format */}
                    <source src="/videos/video.mp4" type="video/mp4" />
                    
                    {/* Screen reader fallback */}
                    <div className="sr-only">
                        <p>{t("Background video showing Hackiware immersive cybersecurity simulations and learning environments.")}</p>
                    </div>
                    
                    {/* Fallback for browsers without video support */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-primary-red/10
                                  flex items-center justify-center">
                      <div className="text-center">
                        <WrenchScrewdriverIcon className="h-20 w-20 text-primary-red mx-auto mb-4" />
                        <p className="text-gray-300 text-lg">{t("Professional Tools & Manufacturing")}</p>
                      </div>
                    </div>
                  </motion.video>
                </>
              ) : (
                // Enhanced fallback when video fails to load
                <motion.div 
                  className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-primary-red/20
                            flex items-center justify-center opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 1 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <SparklesIcon className="h-24 w-24 text-primary-red mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-400 text-lg font-light">
                      {t("Innovation in Motion")}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {t("Experience the future of professional tools")}
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Optimized overlay for better video visibility while maintaining text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
              
              {/* Subtle backdrop blur for modern browsers */}
              <div className="absolute inset-0 backdrop-blur-[0.3px] pointer-events-none" style={{
                background: 'rgba(0, 0, 0, 0.05)'
              }} />
            </div>
            
            {/* Content with improved readability */}
            <div className="relative z-10 w-full p-8 md:p-12 lg:p-20 text-center">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-display mb-6 text-primary-red 
                         drop-shadow-2xl text-shadow-lg leading-tight font-bold"
                style={{
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))'
                }}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t("Join Our Legacy")}
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto font-semibold 
                         text-white drop-shadow-lg leading-relaxed"
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.7)',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))'
                }}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Experience immersive, hands-on cybersecurity training with Hackiware — realistic scenarios, expert-led simulations, and a community-focused approach.
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-bold
                         hover:bg-white hover:text-primary-red transition-all duration-300
                         shadow-2xl shadow-primary-red/50 border-2 border-transparent
                         hover:border-primary-red focus:outline-none focus:ring-4 
                         focus:ring-primary-red/50 active:transform active:scale-95"
                style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
                }}
                aria-label={t("Explore Our Programs - Learn about Hackiware offerings")}
              >
                Explore Our Programs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
