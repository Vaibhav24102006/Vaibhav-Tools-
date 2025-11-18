import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'red' }) => {
  const colorClasses = {
    red: 'from-red-900/30 to-red-800/20 border-red-700',
    blue: 'from-blue-900/30 to-blue-800/20 border-blue-700',
    green: 'from-green-900/30 to-green-800/20 border-green-700',
    yellow: 'from-yellow-900/30 to-yellow-800/20 border-yellow-700',
    purple: 'from-purple-900/30 to-purple-800/20 border-purple-700'
  };

  const iconColorClasses = {
    red: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:scale-105 transition-transform`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 bg-black/30 rounded-lg ${iconColorClasses[color]}`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
