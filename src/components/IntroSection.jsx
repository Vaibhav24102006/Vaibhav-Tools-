import React from 'react';
import { motion } from 'framer-motion';
import { WrenchScrewdriverIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: WrenchScrewdriverIcon,
    title: "Premium Quality Tools",
    description: "Curated selection of professional-grade equipment"
  },
  {
    icon: TruckIcon,
    title: "Nationwide Delivery",
    description: "Fast and reliable shipping across the country"
  },
  {
    icon: UserGroupIcon,
    title: "Expert Support",
    description: "Professional guidance from industry experts"
  }
];

const IntroSection = () => {
  return (
    <section className="bg-gradient-to-b from-charcoal to-black py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display text-primary-red mb-6">
            Trusted Since 1950
          </h2>
          <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            At Vaibhav Tools, we've been serving professionals and craftsmen with premium 
            quality tools for over seven decades. Our commitment to excellence and customer 
            satisfaction has made us the preferred choice in the industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-dark-gray rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <feature.icon className="h-12 w-12 text-primary-red mx-auto mb-6" />
              <h3 className="text-2xl font-display text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 font-sans">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="btn-primary text-lg">
            Learn More About Us
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;