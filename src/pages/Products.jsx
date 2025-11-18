import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../components/TranslatableText';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  HeartIcon as HeartIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  FaFire, FaNewspaper, FaExclamationTriangle, FaStar, FaCrown,
  FaTools, FaHammer, FaCompress, FaIndustry, FaCheck,
  FaMagic, FaBox, FaLock, FaFilter, FaArrowLeft
} from "react-icons/fa";
import CustomAddToCartButton from '../components/CustomAddToCartButton';
import LoadingAnimation from '../components/LoadingAnimation';
import StockBadge from '../components/StockBadge';
import firebaseService from '../services/firebaseService';
import { normalizeStock, isProductOutOfStock } from '../utils/productHelpers';
import '../styles/Products.css';

const Products = () => {
  const navigate = useNavigate();
  const t = useT();
  const { addToCart, getTotalItems } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Navigation state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Data from Firestore
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [{ id: 'grinders', name: 'grinders' }]
  const [brandsByCategory, setBrandsByCategory] = useState({}); // { grinders: [{ id: 'bosch', name: 'bosch' }] }

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setFetching(true);
        const data = await firebaseService.getProducts();
        // Debug: surface Firestore data shape in dev only
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('[Products] fetched products', data);
        }
        if (!isMounted) return;
        
        // TEMPORARY FIX: Add fallback brand for products with undefined brands
        const productsWithBrands = data.map(product => {
          if (!product.brand) {
            // Assign brand based on category
            const brandMap = {
              'Painting & Air Tools': 'Ingco',
              'Power & Hand Tools': 'Bosch',
              'Safety & Measurement': 'Stanley', 
              'Fastening & Cutting Tools': 'Taparia'
            };
            return {
              ...product,
              brand: brandMap[product.category] || 'Generic'
            };
          }
          return product;
        });
        
        setProducts(productsWithBrands);

        const categorySet = new Set();
        const map = {};
        data.forEach((p) => {
          if (p?.category) {
            categorySet.add(p.category);
            if (!map[p.category]) map[p.category] = new Set();
            // Handle missing brand data by creating a generic brand
            const brand = p?.brand || 'Other';
            map[p.category].add(brand);
          }
        });
        const catList = Array.from(categorySet).map((c) => ({ id: c, name: c }));
        const brandMap = {};
        Object.keys(map).forEach((c) => {
          brandMap[c] = Array.from(map[c]).map((b) => ({ id: b, name: b }));
        });
        setCategories(catList);
        setBrandsByCategory(brandMap);
      } catch (e) {
        if (!isMounted) return;
        setFetchError('Failed to load products. Please try again later.');
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[Products] fetch error', e);
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Products.jsx - products state length:', products.length);
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Products.jsx - selectedCategory, selectedBrand:', selectedCategory, selectedBrand);
    }
  }, [products, selectedCategory, selectedBrand]);
  
  // UI state
  const [imageError, setImageError] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  // Get current products based on navigation state
  const currentProducts = useMemo(() => {
    try {
      if (selectedBrand && selectedCategory) {
        const list = products.filter(p => {
          const productBrand = p?.brand || 'Other';
          return p?.category === selectedCategory && productBrand === selectedBrand;
        });
        return list.length ? list : products; // fallback to all if empty to confirm data flow
      } else if (selectedCategory) {
        const list = products.filter(p => p?.category === selectedCategory);
        return list.length ? list : products;
      }
      return products;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[Products] filter error', err);
      }
      return products;
    }
  }, [products, selectedCategory, selectedBrand]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...currentProducts];

    // Show fallback message if filters result in empty but we have products
    const hasProducts = currentProducts.length > 0;
    const hasUndefinedBrands = currentProducts.some(p => !p.brand || p.brand === 'undefined');
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product?.name?.toLowerCase().includes(searchLower) ||
        product?.description?.toLowerCase().includes(searchLower) ||
        product?.shortDescription?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const nameA = (a?.name || "").toLowerCase();
      const nameB = (b?.name || "").toLowerCase();
      const priceA = Number(a?.price) || 0;
      const priceB = Number(b?.price) || 0;
      const ratingA = Number(a?.rating) || 0;
      const ratingB = Number(b?.rating) || 0;

      switch (sortBy) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating-desc":
          return ratingB - ratingA;
        default:
          return 0;
      }
    });
  }, [currentProducts, searchTerm, sortBy]);

  // Navigation handlers
  const handleCategorySelect = useCallback((category) => {
    setLoading(true);
    setSelectedCategory(category);
    setSelectedBrand(null);
    setNavigationHistory(prev => [...prev, { type: 'category', id: category }]);
    
    // Simulate loading delay for better UX
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handleBrandSelect = useCallback((brand) => {
    setLoading(true);
    setSelectedBrand(brand);
    setNavigationHistory(prev => [...prev, { type: 'brand', id: brand }]);
    
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setNavigationHistory([]);
  }, []);

  const handleBackToBrands = useCallback(() => {
    setSelectedBrand(null);
    setNavigationHistory(prev => prev.slice(0, -1));
  }, []);

  // Product handlers
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating,
        badge: product.badge,
        badgeColor: product.badgeColor
      });
    }
  };

  // Image handlers
  const handleImageError = useCallback((productId) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleImageLoad = useCallback((productId) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  }, []);

  // Badge icon helper
  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "Best Seller":
        return <FaFire className="h-3 w-3" />;
      case "New Arrival":
        return <FaNewspaper className="h-3 w-3" />;
      case "Limited Stock":
        return <FaExclamationTriangle className="h-3 w-3" />;
      case "Popular":
        return <FaStar className="h-3 w-3" />;
      case "Professional":
        return <FaCrown className="h-3 w-3" />;
      case "Specialty Tool":
        return <FaTools className="h-3 w-3" />;
      case "Craftsman":
        return <FaHammer className="h-3 w-3" />;
      case "Compact":
        return <FaCompress className="h-3 w-3" />;
      case "Industrial":
        return <FaIndustry className="h-3 w-3" />;
      case "Essential":
        return <FaCheck className="h-3 w-3" />;
      case "Versatile":
        return <FaMagic className="h-3 w-3" />;
      case "Complete Kit":
        return <FaBox className="h-3 w-3" />;
      case "Security":
        return <FaLock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  if (fetching || loading) {
    return (
      <div className="w-full min-h-screen bg-black pt-20 flex items-center justify-center">
        <LoadingAnimation text={t("Loading...")} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-red-400 bg-red-900/30 border border-red-700 px-6 py-4 rounded-lg">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-black to-charcoal text-white min-h-screen">
      {/* Header Section */}
      <div className="pt-20 pb-8 px-4">
        <div className="container-width mx-auto">
          {/* Breadcrumb Navigation */}
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-400 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleBackToCategories}
              className="hover:text-primary-red transition-colors"
            >
              {t("Products")}
            </button>
            
            {selectedCategory && (
              <>
                <ChevronRightIcon className="h-4 w-4" />
                <button
                  onClick={handleBackToCategories}
                  className="hover:text-primary-red transition-colors"
                >
                  {selectedCategory}
                </button>
              </>
            )}
            
            {selectedBrand && (
              <>
                <ChevronRightIcon className="h-4 w-4" />
                <span className="text-white">
                  {selectedBrand}
                </span>
              </>
            )}
          </motion.div>

          {/* Page Title */}
          <motion.h1 
            className="text-4xl md:text-5xl font-display mb-4 text-center text-primary-red"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {selectedBrand 
              ? `${selectedBrand} ${t("Products")}`
              : selectedCategory 
                ? `${selectedCategory} ${t("Brands")}`
                : t("Our Products")
            }
          </motion.h1>

          {/* Back Button */}
          {(selectedCategory || selectedBrand) && (
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={selectedBrand ? handleBackToBrands : handleBackToCategories}
                className="flex items-center space-x-2 bg-dark-gray/60 backdrop-blur-sm px-4 py-2 rounded-lg 
                         border border-gray-700 hover:border-primary-red/50 transition-all duration-300
                         hover:bg-dark-gray/80 group"
              >
                <FaArrowLeft className="h-4 w-4 group-hover:text-primary-red transition-colors" />
                <span className="group-hover:text-primary-red transition-colors">
                  {selectedBrand ? t("Back to Brands") : t("Back to Categories")}
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="container-width mx-auto">
          <AnimatePresence mode="wait">
            {/* Categories View */}
            {!selectedCategory && (
              <motion.div
                key="categories"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="bg-dark-gray/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 
                                    hover:border-primary-red/50 transition-all duration-300
                                    hover:bg-dark-gray/80 hover:shadow-xl hover:shadow-primary-red/10">
                        {category.icon && (
                          <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                            {category.icon}
                          </div>
                        )}
                        <h3 className="text-xl font-display text-center mb-2 group-hover:text-primary-red transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-400 text-center group-hover:text-gray-300 transition-colors">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Brands View */}
            {selectedCategory && !selectedBrand && (
              <motion.div
                key="brands"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                {/* Search and Filters */}
                <motion.div 
                  className="mb-8 bg-dark-gray/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("Search brands...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent
                                 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 bg-gray-800/50 px-4 py-3 rounded-lg 
                                 border border-gray-700 hover:border-primary-red/50 transition-all duration-300"
                      >
                        <FunnelIcon className="h-5 w-5" />
                        <span>{t("Filters")}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Brands Grid */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {(brandsByCategory[selectedCategory] || [])
                    .filter(brand => 
                      !searchTerm || 
                      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((brand) => (
                    <motion.div
                      key={brand.id}
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => handleBrandSelect(brand.id)}
                    >
                      <div className="bg-dark-gray/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 
                                    hover:border-primary-red/50 transition-all duration-300
                                    hover:bg-dark-gray/80 hover:shadow-xl hover:shadow-primary-red/10">
                        <div className="flex items-center justify-center mb-4 h-16">
                          <div className="text-2xl font-bold text-gray-400 group-hover:text-primary-red transition-colors">
                            {brand.name}
                          </div>
                        </div>
                        <h3 className="text-xl font-display text-center mb-2 group-hover:text-primary-red transition-colors">
                          {brand.name}
                        </h3>
                        
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Products View */}
            {selectedCategory && selectedBrand && (
              <motion.div
                key="products"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                {/* Search and Filters */}
                <motion.div 
                  className="mb-8 bg-dark-gray/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("Search products...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent
                                 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent
                                 text-white"
                      >
                        <option value="name-asc">{t("Name A-Z")}</option>
                        <option value="name-desc">{t("Name Z-A")}</option>
                        <option value="price-asc">{t("Price: Low to High")}</option>
                        <option value="price-desc">{t("Price: High to Low")}</option>
                        <option value="rating-desc">{t("Highest Rated")}</option>
                      </select>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 bg-gray-800/50 px-4 py-3 rounded-lg 
                                 border border-gray-700 hover:border-primary-red/50 transition-all duration-300"
                      >
                        <FunnelIcon className="h-5 w-5" />
                        <span>{t("Filters")}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Results Count */}
                  <div className="mt-4 text-sm text-gray-400">
                    {t("Showing")} {filteredProducts.length} {t("of")} {currentProducts.length} {t("products")}
                  </div>
                  
                  {/* Debug Banner for Development */}
                  {(process.env.NODE_ENV !== 'production' && currentProducts.some(p => !p.brand)) && (
                    <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg">
                      <div className="text-yellow-300 text-sm">
                        ⚠️ DEBUG: Some products have missing brand data. Using fallback brands.
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-lg mb-4">
                      {searchTerm ? t("No products found matching your search.") : t("No products available.")}
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-primary-red hover:text-primary-red-hover transition-colors"
                      >
                        {t("Clear search")}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group"
                      >
                        <div className="bg-dark-gray/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 
                                      hover:border-primary-red/50 transition-all duration-300
                                      hover:bg-dark-gray/80 hover:shadow-xl hover:shadow-primary-red/10
                                      relative overflow-hidden">
                          {/* Badge */}
                          {product.badge && (
                            <div className="absolute top-2 right-2 z-10">
                              <div className={`${product.badgeColor} text-white text-xs px-2 py-1 rounded-full 
                                            flex items-center space-x-1 shadow-lg`}>
                                {getBadgeIcon(product.badge)}
                                <span>{product.badge}</span>
                              </div>
                            </div>
                          )}

                          {/* Product Image */}
                          <div className="relative mb-4">
                            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                              {!imageError[product.id] ? (
                                <>
                                  {/* Loading skeleton */}
                                  {!imageLoaded[product.id] && (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 
                                                  flex items-center justify-center animate-pulse">
                                      <FaTools className="h-12 w-12 text-gray-500" />
                                    </div>
                                  )}
                                  
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-opacity duration-300
                                             ${imageLoaded[product.id] ? 'opacity-100' : 'opacity-0'}`}
                                    onError={() => handleImageError(product.id)}
                                    onLoad={() => handleImageLoad(product.id)}
                                    loading="lazy"
                                  />
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 
                                              flex items-center justify-center">
                                  <FaTools className="h-12 w-12 text-gray-500" />
                                </div>
                              )}
                            </div>

                            {/* Wishlist Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleWishlistToggle(product)}
                              className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full 
                                       shadow-md hover:bg-white transition-colors z-10"
                            >
                              {isInWishlist(product.id) ? (
                                <HeartIconSolid className="h-5 w-5 text-red-500" />
                              ) : (
                                <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
                              )}
                            </motion.button>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-display text-primary-red group-hover:text-primary-red-hover transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {product.shortDescription || product.description}
                            </p>
                            
                            {/* Stock Badge */}
                            <StockBadge 
                              stockCount={normalizeStock(product)} 
                              saleEndsAt={product.saleEndsAt}
                            />
                            
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-yellow-400">
                                <FaStar className="h-4 w-4" />
                                <span className="text-sm ml-1">{product.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({product.reviews} {t("reviews")})
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-xl font-bold text-primary-red">
                                ₹{product.price}
                              </div>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ₹{product.originalPrice}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 pt-2">
                              <CustomAddToCartButton
                                onClick={() => handleAddToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  category: product.category,
                                  description: product.description,
                                  rating: product.rating,
                                  stock: normalizeStock(product)
                                })}
                                className="flex-1"
                                disabled={isProductOutOfStock(product)}
                              >
                                {isProductOutOfStock(product) ? t("Out of Stock") : t("Add to Cart")}
                              </CustomAddToCartButton>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleWishlistToggle(product)}
                                className={`p-2 rounded-lg transition-colors duration-300 ${
                                  isInWishlist(product.id) 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                }`}
                              >
                                {isInWishlist(product.id) ? (
                                  <HeartIconSolid className="h-5 w-5" />
                                ) : (
                                  <HeartIcon className="h-5 w-5" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-5 right-5 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Link
            to="/cart"
            className="bg-primary-red text-white p-4 rounded-full shadow-lg hover:shadow-xl 
                     transition-all duration-300 flex items-center justify-center neon-glow"
            style={{
              boxShadow: '0 0 20px rgba(225, 6, 0, 0.4), 0 0 40px rgba(225, 6, 0, 0.2)'
            }}
            title={t("View Cart")}
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary-red text-xs rounded-full 
                             h-6 w-6 flex items-center justify-center font-bold border-2 border-primary-red">
                {getTotalItems() > 99 ? '99+' : getTotalItems()}
              </span>
            )}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Products;