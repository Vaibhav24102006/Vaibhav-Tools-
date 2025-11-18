import React from 'react';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: "Professional Drill Set",
    price: "24,999",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Set"
  },
  {
    id: 2,
    name: "Heavy Duty Wrench Kit",
    price: "12,499",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Wrench+Kit"
  },
  {
    id: 3,
    name: "Precision Screwdriver Set",
    price: "6,699",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Screwdriver+Set"
  },
  {
    id: 4,
    name: "Digital Multimeter",
    price: "7,499",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Multimeter"
  },
  {
    id: 5,
    name: "Safety Goggles Set",
    price: "3,299",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Goggles"
  },
  {
    id: 6,
    name: "Tool Storage Cabinet",
    price: "16,699",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Cabinet"
  }
];

const FeaturedProducts = () => {
  return (
    <section className="bg-light-gray py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-black text-center mb-12"
        >
          Featured Products
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:border-2 hover:border-primary-red"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black mb-2">{product.name}</h3>
                <p className="text-primary-red font-bold">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 