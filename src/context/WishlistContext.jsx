import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_WISHLIST_ITEM':
      if (state.items.find(item => item.id === action.payload.id)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_WISHLIST_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    async function loadWishlist() {
      if (currentUser && currentUser.uid) {
        const wishlistRef = doc(db, 'wishlists', currentUser.uid);
        const wishlistSnap = await getDoc(wishlistRef);
        if (wishlistSnap.exists()) {
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistSnap.data().items || [] });
        } else {
          dispatch({ type: 'LOAD_WISHLIST', payload: [] });
        }
      } else {
        const savedWishlist = localStorage.getItem('vaibhavToolsWishlist');
        if (savedWishlist) {
          dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
        }
      }
    }
    loadWishlist();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setDoc(doc(db, 'wishlists', currentUser.uid), { items: state.items });
    } else {
      localStorage.setItem('vaibhavToolsWishlist', JSON.stringify(state.items));
    }
  }, [state.items, currentUser]);

  const addToWishlist = (product) => {
    console.log('[WishlistContext] Adding to wishlist:', product);
    
    // Validate product has required fields
    if (!product || !product.id) {
      console.error('[WishlistContext] Invalid product - missing id:', product);
      return;
    }
    
    // Ensure all required fields exist
    const validatedProduct = {
      id: product.id,
      name: product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.image || product.imageUrl || '/images/logo.jpg',
      category: product.category || 'Uncategorized',
      description: product.description || '',
      rating: product.rating || 0,
      stock: product.stock || product.stockCount || 0
    };
    
    console.log('[WishlistContext] Validated product:', validatedProduct);
    dispatch({ type: 'ADD_WISHLIST_ITEM', payload: validatedProduct });
  };
  
  const removeFromWishlist = (productId) => {
    console.log('[WishlistContext] Removing from wishlist:', productId);
    dispatch({ type: 'REMOVE_WISHLIST_ITEM', payload: productId });
  };

  return (
    <WishlistContext.Provider value={{ items: state.items, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
