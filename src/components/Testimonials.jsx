import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "Vaibhav Tools has been our trusted supplier for over 10 years. Their quality and service are unmatched.",
    name: "John Smith",
    role: "Construction Manager",
    avatar: "https://placehold.co/100x100/1A1A1A/FFFFFF?text=JS"
  },
  {
    id: 2,
    quote: "The professional tools I purchased have significantly improved my work efficiency. Highly recommended!",
    name: "Sarah Johnson",
    role: "Professional Contractor",
    avatar: "https://placehold.co/100x100/1A1A1A/FFFFFF?text=SJ"
  },
  {
    id: 3,
    quote: "Best wholesale prices in the industry with exceptional customer service. A true partner in our business.",
    name: "Michael Chen",
    role: "Hardware Store Owner",
    avatar: "https://placehold.co/100x100/1A1A1A/FFFFFF?text=MC"
  }
];

const cardVariants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.2,
      duration: 0.8,
      delay: i * 0.2
    }
  })
};

const Testimonials = () => {
  return (
    <section className="bg-dark-gray py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-display text-primary-red text-center mb-12 uppercase tracking-wide">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              className="bg-black p-8 rounded-xl shadow-xl border border-charcoal font-sans text-white flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary-red group"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              custom={i}
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4 border-2 border-primary-red group-hover:shadow-lg"
              />
              <h3 className="text-xl font-display text-primary-red mb-1 uppercase tracking-wide">{testimonial.name}</h3>
              <p className="text-sm text-gray-300 mb-4 font-sans">{testimonial.role}</p>
              <p className="text-lg italic font-sans text-white">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;