import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WrenchIcon, TruckIcon, HandshakeIcon, ShieldCheck, MapPin, BookOpen } from 'lucide-react';
import { useT } from '../components/TranslatableText';
import PromoSection from '../components/PromoSection';

const Home = () => {
  const t = useT();
  
  const features = [
    {
      icon: <WrenchIcon className="h-10 w-10 text-primary-red" />,
      title: t("Durable Tools"),
      description: t("Engineered for industrial performance and longevity.")
    },
    {
      icon: <TruckIcon className="h-10 w-10 text-primary-red" />,
      title: t("Fast Delivery"),
      description: t("Rapid nationwide shipping with real-time tracking.")
    },
    {
      icon: <HandshakeIcon className="h-10 w-10 text-primary-red" />,
      title: t("Trust Since 1950"),
      description: t("98% repeat buyers. Trusted by thousands of professionals.")
    }
  ];

  const categories = [
    {
      title: t("Power Tools"),
      image: "https://placehold.co/600x400/1A1A1A/FFFFFF?text=Power+Tools",
      link: "/products?category=Power+Tools"
    },
    {
      title: t("Hand Tools"),
      image: "https://placehold.co/600x400/1A1A1A/FFFFFF?text=Hand+Tools",
      link: "/products?category=Hand+Tools"
    },
    {
      title: t("Safety Equipment"),
      image: "https://placehold.co/600x400/1A1A1A/FFFFFF?text=Safety+Equipment",
      link: "/products?category=Accessories"
    }
  ];

  return (
    <div className="w-full bg-light-gray">
      {/* Hero Section */}
      <div className="relative bg-black py-20 w-full min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Premium marketing video showcasing professional tools and craftsmanship"
        >
          <source src="/images/Premium_Marketing_Video_Generation.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-black" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        
        {/* Additional gradient overlay for enhanced readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 z-20"></div>
        
        <div className="relative z-30 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              <span className="block">Hackiware</span>
              <span className="text-primary-red block mt-2 text-2xl sm:text-3xl">Where Cybersecurity Is Experienced — Not Memorized</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              We design immersive, hands-on cybersecurity environments that bridge theory and real-world defense — empowering the next generation of cyber defenders.
            </motion.p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-primary-red to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                {t("Explore Products")}
              </Link>
            </motion.div>
          </div>
        </div>

          {/* What We Do Section (3 columns) */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl font-display mb-8">What We Do</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-dark-gray/40 p-8 rounded-xl border border-gray-800">
                  <ShieldCheck className="h-10 w-10 text-primary-red mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Hands-On Cybersecurity</h3>
                  <p className="text-gray-300">We create realistic attack–defense simulations that help learners think like attackers and defend like professionals.</p>
                </div>
                <div className="bg-dark-gray/40 p-8 rounded-xl border border-gray-800">
                  <MapPin className="h-10 w-10 text-primary-red mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">National-Level Events</h3>
                  <p className="text-gray-300">Hackiware organizes cybersecurity workshops, simulations, and competitive events across institutions to promote applied security learning.</p>
                </div>
                <div className="bg-dark-gray/40 p-8 rounded-xl border border-gray-800">
                  <BookOpen className="h-10 w-10 text-primary-red mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Education-First Platform</h3>
                  <p className="text-gray-300">Our focus is not certificates — it’s capability, depth, and real-world readiness.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Hackiware Exists Narrative */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-charcoal to-dark-gray text-gray-200">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-display mb-6">Why Hackiware Exists</h3>
              <p className="mb-4">Traditional cybersecurity education struggles to keep pace with rapidly evolving threats.</p>
              <p>Hackiware exists to close this gap by replacing passive learning with experiential, scenario-driven security training.</p>
            </div>
          </section>
      </div>

      {/* Why Choose Us Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-charcoal to-dark-gray overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Futuristic tool craftsmanship video showing precision manufacturing and industrial excellence"
        >
          <source src="/images/Futuristic_Tool_Craftsmanship_Video_Generation.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-dark-gray" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        
        {/* Metallic/Industrial Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-20" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/brushed-alum.png)'}} />
        <div className="max-w-7xl mx-auto relative z-30">
          {/* Headline with animated underline */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-display text-white uppercase tracking-widest inline-block relative">
              Why Thousands Trust Hackiware
              <span className="block h-2 w-2/3 mx-auto mt-2 rounded bg-primary-red" />
            </h2>
          </motion.div>
          {/* Features Grid */}
          <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-0">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="flex-1 bg-black bg-opacity-80 rounded-xl p-10 m-0 flex flex-col items-center text-center border-2 border-charcoal mx-0 md:mx-4 shadow-xl transition-all duration-300 hover:border-primary-red hover:shadow-primary-red/40 group relative z-10"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-display text-white mb-2 uppercase tracking-wide">{feature.title}</h3>
                <p className="text-gray-300 font-sans text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          {/* Stat Ticker */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <span className="inline-block bg-black bg-opacity-80 px-8 py-4 rounded-full text-2xl font-display text-white tracking-widest shadow-lg border-2 border-primary-red">
              {t("98% Repeat Buyers • 70+ Years of Trust • 1000+ Clients")}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="relative py-20 bg-light-gray overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Industrial tools showcase video demonstrating various tool categories and applications"
        >
          <source src="/images/Video_Generation_Industrial_Tools_Showcase.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-light-gray" />
        </video>
        
        {/* Light overlay for text readability on light background */}
        <div className="absolute inset-0 bg-white bg-opacity-75 z-10"></div>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 z-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">{t("Shop by Category")}</h2>
            <p className="text-xl text-gray-600">
              {t("Find the right tools for your needs")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <Link to={category.link}>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">{category.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Section */}
      <PromoSection 
        videoSrc="/images/Vaibhav_Tools_Video_Generation_Requests.mp4"
        placeholderImage="https://placehold.co/1920x1080/1A1A1A/E10600?text=Power+Your+Work+with+Precision+Tools"
        title="Power Your Work with Precision Tools"
        ctaText="Shop Now"
        ctaLink="/products"
      />
    </div>
  );
};

export default Home;

/* CSS-in-JS for performance optimizations and accessibility */
const videoStyles = `
  @media (prefers-reduced-motion: reduce) {
    video {
      animation: none !important;
      transform: none !important;
    }
  }
  
  /* Optimize video performance */
  video {
    will-change: auto;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  /* Ensure videos don't cause layout shifts */
  video::-webkit-media-controls {
    display: none !important;
  }
  
  video::-moz-media-controls {
    display: none !important;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    video {
      object-position: center;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = videoStyles;
  document.head.appendChild(styleElement);
}
