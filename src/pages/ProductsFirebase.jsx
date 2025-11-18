import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../components/TranslatableText';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  HeartIcon as HeartIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  FaFire, FaNewspaper, FaExclamationTriangle, FaStar, FaCrown,
  FaTools, FaHammer, FaCompress, FaIndustry, FaCheck,
  FaMagic, FaBox, FaLock, FaFilter, FaArrowLeft
} from "react-icons/fa";
import CustomAddToCartButton from '../components/CustomAddToCartButton';
import LoadingAnimation from '../components/LoadingAnimation';
import firebaseService from '../services/firebaseService';
import '../styles/Products.css';

const ProductsFirebase = () => {
  const navigate = useNavigate();
  const t = useT();
  const { addToCart, getTotalItems } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { currentUser } = useAuth();
  
  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navigation state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  
  // UI state
  const [imageError, setImageError] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get products from Firebase
        const productsData = await firebaseService.getProducts();
        setProducts(productsData);
        
        // Extract unique categories and brands
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
        const uniqueBrands = [...new Set(productsData.map(p => p.brand).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get current products based on navigation state
  const currentProducts = useMemo(() => {
    if (selectedBrand && selectedCategory) {
      return products.filter(p => p.category === selectedCategory && p.brand === selectedBrand);
    } else if (selectedCategory) {
      return products.filter(p => p.category === selectedCategory);
    }
    return products;
  }, [products, selectedCategory, selectedBrand]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...currentProducts];

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
        case "rating-asc":
          return ratingA - ratingB;
        default:
          return nameA.localeCompare(nameB);
      }
    });
  }, [currentProducts, searchTerm, sortBy]);

  // Navigation handlers
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedBrand(null);
    setNavigationHistory(prev => [...prev, { type: 'category', value: category }]);
  }, []);

  const handleBrandSelect = useCallback((brand) => {
    setSelectedBrand(brand);
    setNavigationHistory(prev => [...prev, { type: 'brand', value: brand }]);
  }, []);

  const handleBackNavigation = useCallback(() => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const lastAction = newHistory.pop();
      
      if (lastAction.type === 'brand') {
        setSelectedBrand(null);
      } else if (lastAction.type === 'category') {
        setSelectedCategory(null);
        setSelectedBrand(null);
      }
      
      setNavigationHistory(newHistory);
    }
  }, [navigationHistory]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchTerm("");
    setSortBy("name-asc");
    setNavigationHistory([]);
  }, []);

  // Image handlers
  const handleImageError = useCallback((productId) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleImageLoad = useCallback((productId) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  }, []);

  // Cart and wishlist handlers
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  const handleWishlistToggle = useCallback((product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Products</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-charcoal text-white">
      {/* Header */}
      <div className="bg-dark-gray/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container-width mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-display text-primary-red">
                {selectedCategory ? selectedCategory : t("All Products")}
                {selectedBrand && ` - ${selectedBrand}`}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("Search products...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FunnelIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-dark-gray/60 backdrop-blur-sm border-b border-gray-800 overflow-hidden"
          >
            <div className="container-width mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("Sort By")}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                  >
                    <option value="name-asc">{t("Name A-Z")}</option>
                    <option value="name-desc">{t("Name Z-A")}</option>
                    <option value="price-asc">{t("Price Low to High")}</option>
                    <option value="price-desc">{t("Price High to Low")}</option>
                    <option value="rating-desc">{t("Highest Rated")}</option>
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("Category")}
                  </label>
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                  >
                    <option value="">{t("All Categories")}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("Brand")}
                  </label>
                  <select
                    value={selectedBrand || ""}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                  >
                    <option value="">{t("All Brands")}</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-400">
                  {filteredProducts.length} {t("products found")}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-primary-red hover:text-red-400 transition-colors"
                >
                  {t("Clear Filters")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="container-width mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <FaExclamationTriangle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {t("No Products Found")}
            </h3>
            <p className="text-gray-500 mb-4">
              {t("Try adjusting your search or filter criteria")}
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("Clear Filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-dark-gray/40 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-primary-red/50 transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  {!imageError[product.id] ? (
                    <>
                      {!imageLoaded[product.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <FaTools className="h-8 w-8 text-gray-500 animate-pulse" />
                        </div>
                      )}
                      <img
                        src={product.image || "https://placehold.co/400x400/1A1A1A/FFFFFF?text=Product"}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          imageLoaded[product.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onError={() => handleImageError(product.id)}
                        onLoad={() => handleImageLoad(product.id)}
                        loading="lazy"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <FaTools className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${product.badgeColor || 'bg-primary-red'}`}>
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {wishlistItems.some(item => item.id === product.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-red transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description || product.shortDescription}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">
                      ({product.rating || 0})
                    </span>
                  </div>
                  
                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-red">
                      ₹{product.price?.toFixed(2) || '0.00'}
                    </span>
                    
                    <CustomAddToCartButton
                      product={product}
                      onAddToCart={handleAddToCart}
                      className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                      <span>{t("Add")}</span>
                    </CustomAddToCartButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsFirebase; 