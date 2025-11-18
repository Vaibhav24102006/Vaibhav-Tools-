import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import firebaseService from '../services/firebaseService';
import { isProductInStock, validateStockForCart } from '../utils/stockUtils';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, Math.min(99, action.payload.quantity)) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Always call useAuth at the top
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  // Load cart from Firestore or localStorage on mount or user change
  useEffect(() => {
    async function loadCart() {
      try {
        if (currentUser && currentUser.uid) {
          const cartItems = await firebaseService.getCart(currentUser.uid);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        } else {
          const savedCart = localStorage.getItem('vaibhavToolsCart');
          if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage if Firebase fails
        const savedCart = localStorage.getItem('vaibhavToolsCart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      }
    }
    loadCart();
  }, [currentUser]);

  // Save cart to Firestore or localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser && currentUser.uid) {
        // Filter out invalid items before saving
        const filteredItems = state.items.filter(
          (item) => item && item.id && (item.name || item.title) && item.price !== undefined
        );
        firebaseService.updateCart(currentUser.uid, filteredItems);
      } else {
        localStorage.setItem('vaibhavToolsCart', JSON.stringify(state.items));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      // Fallback to localStorage if Firebase fails
      localStorage.setItem('vaibhavToolsCart', JSON.stringify(state.items));
    }
  }, [state.items, currentUser]);

  const addToCart = (product) => {
    console.log('[CartContext] Attempting to add to cart:', product?.name);
    
    // Validate product data before adding to cart
    if (!product || !product.id) {
      console.warn('[CartContext] Invalid product data - missing id:', product);
      return;
    }
    
    // CRITICAL: Check stock before adding to cart
    const showToast = (message) => alert(`⚠️ ${message}`);
    if (!validateStockForCart(product, 1, showToast)) {
      console.warn('[CartContext] Stock validation failed for product:', product.name);
      return;
    }
    
    console.log('[CartContext] Stock validation passed, adding to cart');
    
    // Ensure all required fields are present and not undefined
    const validatedProduct = {
      id: product.id,
      name: product.name || product.title || 'Unknown Product',
      price: typeof product.price === 'number' ? product.price : 0,
      image: product.image || product.imageUrl || '/images/logo.jpg',
      description: product.description || '',
      category: product.category || 'Uncategorized',
      rating: product.rating || 0,
      stock: product.stock || product.stockCount || 0
    };
    
    dispatch({ type: 'ADD_ITEM', payload: validatedProduct });
    console.log('[CartContext] ✅ Product added to cart successfully');
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    const validQuantity = Math.max(1, Math.min(99, parseInt(quantity) || 1));
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: validQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};