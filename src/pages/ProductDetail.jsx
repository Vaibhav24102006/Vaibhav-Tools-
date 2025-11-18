import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CustomAddToCartButton from '../components/CustomAddToCartButton';

// This would typically come from an API or database
const products = [
  {
    id: 1,
    name: "Professional Drill Set",
    description: "Complete set of high-quality drills for professional use",
    longDescription: "This professional drill set includes everything you need for your drilling needs. Features include variable speed control, ergonomic design, and durable construction. Perfect for both professional contractors and DIY enthusiasts.",
    price: 299.99,
    category: "Power Tools",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Set",
    rating: 4.5,
    reviews: 128,
    features: [
      "Variable speed control",
      "Ergonomic design",
      "Durable construction",
      "Includes carrying case",
      "2-year warranty"
    ],
    specifications: {
      "Power": "20V Lithium-ion",
      "Chuck Size": "13mm",
      "Weight": "2.5kg",
      "Dimensions": "25 x 15 x 8 cm",
      "Battery Life": "Up to 4 hours"
    }
  },
  // Add more products as needed
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const product = products.find(p => p.id === parseInt(id));

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-light-gray pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Back to Products
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-light-gray pt-20">
      {/* Hero Section */}
      <div className="bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/products')}
            className="flex items-center text-white hover:text-primary-red transition-colors duration-300 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Products
          </motion.button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>
              
              {/* Rating and Category */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary-red">
                ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>

              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                  >
                    -
                  </motion.button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <CustomAddToCartButton
                onClick={handleAddToCart}
                disabled={addedToCart}
                className="w-full"
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </CustomAddToCartButton>

              {/* Features */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4 text-black">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <div className="w-2 h-2 bg-primary-red rounded-full mr-3"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4 text-black">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <motion.div 
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-200 pb-2"
                    >
                      <span className="font-semibold text-gray-700">{key}:</span>
                      <span className="ml-2 text-gray-600">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;