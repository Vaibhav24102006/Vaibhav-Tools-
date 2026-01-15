import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../components/TranslatableText';
import ContactForm from '../components/ContactForm';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaWhatsapp,
  FaLinkedin,
  FaInstagram,
  FaExternalLinkAlt
} from 'react-icons/fa';

const Contact = () => {
  const t = useT();
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Error handlers for graceful fallbacks
  const handleVideoError = () => {
    console.warn('Background video failed to load, showing fallback');
    setVideoError(true);
  };
  
  const handleVideoLoad = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    }
  };
  
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

  const contactInfo = [
    {
      icon: FaClock,
      title: t('Business Hours'),
      content: 'Monday - Friday, 8:00 AM - 9:00 PM',
      color: 'text-red-600'
    },
    {
      icon: FaPhone,
      title: t('Phone'),
      content: '9219636463',
      link: 'tel:+919219636463',
      color: 'text-green-600'
    },
    {
      icon: FaEnvelope,
      title: t('Email'),
      content: 'vaibhavtools.36463@gmail.com',
      link: 'mailto:vaibhavtools.36463@gmail.com',
      color: 'text-blue-600'
    },
    {
      icon: FaMapMarkerAlt,
      title: t('Address'),
      content: '32/91 Chippitola, in front of District Hospital, Agra',
      link: 'https://maps.app.goo.gl/ZTqkoGFCf9N1JVro7',
      color: 'text-purple-600'
    }
  ];

  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: 'https://wa.me/919219636463',
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      hoverGlow: 'hover:shadow-green-500/50'
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/vaibhav-jain-56b0b8328',
      label: 'LinkedIn',
      color: 'bg-blue-600 hover:bg-blue-700',
      hoverGlow: 'hover:shadow-blue-500/50'
    },
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/vaibhav_tools?igsh=MTRlZzQwenc4ZWQybA==',
      label: 'Instagram',
      color: 'bg-pink-500 hover:bg-pink-600',
      hoverGlow: 'hover:shadow-pink-500/50'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-black pt-20">
      {/* Hero Section with Video Background */}
      <section className="relative flex items-center justify-center py-20 w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          {!videoError ? (
            <>
              {/* Loading placeholder */}
              {!videoLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20
                              flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaMapMarkerAlt className="h-16 w-16 text-red-600" />
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
                          ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  filter: 'brightness(0.7) contrast(1.1) saturate(1.0)',
                  transform: 'scale(1.05)' // Slight scale to prevent edge artifacts
                }}
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                aria-label="Vaibhav Tools product showcase video background"
                preload="metadata"
              >
                <source src="/videos/Vaibhav_Tools_Product_Showcase_Video.mp4" type="video/mp4" />
                
                {/* Screen reader fallback */}
                <div className="sr-only">
                  <p>{t("Background video showing Vaibhav Tools product showcase and manufacturing excellence.")}</p>
                </div>
              </motion.video>
            </>
          ) : (
            // Enhanced fallback when video fails to load
            <motion.div 
              className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-red-900/30
                        flex items-center justify-center opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
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
                  <FaMapMarkerAlt className="h-24 w-24 text-red-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg font-light">
                  {t("Get in Touch")}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {t("Connect with Vaibhav Tools")}
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" style={{ backgroundColor: 'rgba(13, 13, 13, 0.5)' }} />
          
          {/* Subtle backdrop blur for modern browsers */}
          <div className="absolute inset-0 backdrop-blur-[0.3px] pointer-events-none" style={{
            background: 'rgba(0, 0, 0, 0.05)'
          }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
            style={{
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-red-600" style={{ color: '#a00000' }}>{t("Get in Touch")}</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light text-white drop-shadow-lg"
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.7)',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("Have questions about our products? Need technical support? We're here to help you find the perfect tools for your needs.")}
          </motion.p>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <motion.a
              href="#contact-info"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(160, 0, 0, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-bold
                       hover:bg-white hover:text-red-600 transition-all duration-300
                       shadow-2xl shadow-red-600/50 border-2 border-transparent
                       hover:border-red-600 focus:outline-none focus:ring-4 
                       focus:ring-red-600/50 active:transform active:scale-95"
              style={{ backgroundColor: '#a00000' }}
            >
              {t("Contact Us")}
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact-info" className="py-20 px-4 relative w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  <span style={{ color: '#a00000' }}>{t("Contact Information")}</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {t("Reach out to us through any of these channels. Our team is ready to assist you with product inquiries, technical support, and custom solutions.")}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 
                             hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300
                             hover:shadow-xl hover:shadow-red-600/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${info.color} p-3 rounded-lg bg-gray-800/50 
                                    border border-gray-700 group-hover:border-red-600/50 transition-colors`}>
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.includes('maps.app.goo.gl') ? '_blank' : undefined}
                            rel={info.link.includes('maps.app.goo.gl') ? 'noopener noreferrer' : undefined}
                            className="text-gray-300 hover:text-red-400 transition-colors duration-300 
                                     break-words flex items-center group"
                          >
                            {info.content}
                            {info.link.includes('maps.app.goo.gl') && (
                              <FaExternalLinkAlt className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </a>
                        ) : (
                          <p className="text-gray-300 whitespace-pre-line">{info.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">{t("Follow Us")}</h3>
                <p className="text-gray-300 mb-6">{t("Stay updated with our latest products and industry insights.")}</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${social.color} ${social.hoverGlow} text-white p-4 rounded-full 
                               shadow-lg transition-all duration-300 hover:shadow-2xl`}
                      title={social.label}
                    >
                      <social.icon className="h-6 w-6" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Google Maps Integration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">
                  <span style={{ color: '#a00000' }}>{t("Find Us")}</span>
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  {t("Visit our store in Agra for the best selection of professional tools and equipment.")}
                </p>
              </div>

              {/* Map Container */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden
                            hover:border-red-600/50 transition-all duration-300">
                <div className="h-96 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.1234567890123!2d77.9707!3d27.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzM2LjEiTiA3N8KwNTgnMTQuMiJF!5e0!3m2!1sen!2sin!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vaibhav Tools Location"
                    className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  {/* Map Overlay with Address */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="text-white">
                      <p className="font-semibold text-sm">32/91 Chippitola</p>
                      <p className="text-xs text-gray-300">in front of District Hospital, Agra</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Action Button */}
                <div className="p-4">
                  <motion.a
                    href="https://maps.app.goo.gl/ZTqkoGFCf9N1JVro7"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg
                             font-semibold hover:bg-white hover:text-red-600 transition-all duration-300
                             border-2 border-transparent hover:border-red-600 shadow-lg hover:shadow-xl
                             hover:shadow-red-600/25"
                    style={{ backgroundColor: '#a00000' }}
                  >
                    <FaExternalLinkAlt className="h-4 w-4" />
                    <span>{t("Open in Google Maps")}</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 relative w-full bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span style={{ color: '#a00000' }}>{t("Send us a Message")}</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t("Have a specific question or need a custom quote? Fill out the form below and we'll get back to you within 24 hours.")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8
                     hover:border-red-600/50 transition-all duration-300 shadow-2xl"
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative w-full">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span style={{ color: '#a00000' }}>{t("Frequently Asked Questions")}</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              {t("Find answers to common questions about our products, services, and policies.")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("What payment methods do you accept?")}</h3>
                <p className="text-gray-300">{t("We accept all major credit cards, UPI, net banking, and cash on delivery for eligible orders.")}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("Do you offer warranty on your products?")}</h3>
                <p className="text-gray-300">{t("Yes, all our products come with manufacturer warranty. Extended warranty options are also available.")}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("What is your return policy?")}</h3>
                <p className="text-gray-300">{t("We offer a 30-day return policy for unused items in original packaging. Damaged or defective items are covered under warranty.")}</p>
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("Do you ship nationwide?")}</h3>
                <p className="text-gray-300">{t("Yes, we ship to all major cities and towns across India. Free shipping is available on orders above ₹1000.")}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("Can I get technical support?")}</h3>
                <p className="text-gray-300">{t("Absolutely! Our technical support team is available during business hours to help with product selection and usage.")}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6
                         hover:border-red-600/50 hover:bg-gray-900/90 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{t("Do you offer bulk discounts?")}</h3>
                <p className="text-gray-300">{t("Yes, we offer special pricing for bulk orders and corporate clients. Contact us for a custom quote.")}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;