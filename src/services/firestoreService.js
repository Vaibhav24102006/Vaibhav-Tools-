import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Get all products from Firestore
export const getProductsFromFirestore = async () => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection,
      where('category', '==', categoryId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get products by brand
export const getProductsByBrand = async (brandId) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection,
      where('brand', '==', brandId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    throw error;
  }
};

// Get products by category and brand
export const getProductsByCategoryAndBrand = async (categoryId, brandId) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection,
      where('category', '==', categoryId),
      where('brand', '==', brandId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category and brand:', error);
    throw error;
  }
};

// Get all categories
export const getCategoriesFromFirestore = async () => {
  try {
    const categoriesCollection = collection(db, 'categories');
    const categoriesQuery = query(
      categoriesCollection,
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );
    
    const snapshot = await getDocs(categoriesQuery);
    
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
    throw error;
  }
};

// Get brands by category
export const getBrandsByCategory = async (categoryId) => {
  try {
    const brandsCollection = collection(db, 'brands');
    const brandsQuery = query(
      brandsCollection,
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    
    const snapshot = await getDocs(brandsQuery);
    
    const brands = [];
    snapshot.forEach((doc) => {
      brands.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return brands;
  } catch (error) {
    console.error('Error fetching brands by category:', error);
    throw error;
  }
};

// Get all brands
export const getAllBrands = async () => {
  try {
    const brandsCollection = collection(db, 'brands');
    const brandsQuery = query(
      brandsCollection,
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    
    const snapshot = await getDocs(brandsQuery);
    
    const brands = [];
    snapshot.forEach((doc) => {
      brands.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return brands;
  } catch (error) {
    console.error('Error fetching all brands:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limitCount = 8) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection,
      where('featured', '==', true),
      where('isActive', '==', true),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsQuery = query(
      productsCollection,
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(productsQuery);
    
    const products = [];
    snapshot.forEach((doc) => {
      const productData = { id: doc.id, ...doc.data() };
      
      // Client-side filtering for search (Firebase doesn't support full-text search natively)
      const searchLower = searchTerm.toLowerCase();
      if (
        productData.name?.toLowerCase().includes(searchLower) ||
        productData.description?.toLowerCase().includes(searchLower) ||
        productData.shortDescription?.toLowerCase().includes(searchLower) ||
        productData.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        products.push(productData);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const productDoc = doc(db, 'products', productId);
    const docSnap = await getDoc(productDoc);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const categoryDoc = doc(db, 'categories', categoryId);
    const docSnap = await getDoc(categoryDoc);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};