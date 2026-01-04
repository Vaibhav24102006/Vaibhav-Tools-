import React from 'react';
import { motion } from 'framer-motion';

// Minimal, accessible, animated timeline component
// Props: data = [{ title: '2023', content: <p>...</p> }, ...]
export default function Timeline({ data = [] }) {
  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        {/* Center line */}
        <div className="absolute inset-x-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-primary-red via-primary-red to-transparent opacity-90" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {data.map((item, idx) => (
              <motion.div
                key={item.title + idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className={`mb-16 flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="md:w-1/2 px-6">
                  <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="text-primary-red text-xl font-display mb-2">{item.title}</div>
                    <div className="prose prose-invert text-gray-300 mt-2">{item.content}</div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <div className="w-6 h-6 rounded-full bg-primary-red shadow-lg -mx-3" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
