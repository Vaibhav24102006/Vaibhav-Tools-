import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';

// Standardized categories
const STANDARD_CATEGORIES = {
  'Power & Hand Tools': [
    'drill', 'drilling', 'hammer', 'screwdriver', 'wrench', 'spanner', 'socket',
    'pliers', 'cutter', 'saw', 'jigsaw', 'chainsaw', 'impact', 'driver'
  ],
  'Painting & Air Tools': [
    'paint', 'spray', 'gun', 'blower', 'air', 'compressor', 'airbrush'
  ],
  'Safety & Measurement': [
    'safety', 'goggles', 'gloves', 'helmet', 'mask', 'measure', 'tape',
    'ruler', 'level', 'gauge', 'meter', 'multimeter', 'caliper'
  ],
  'Garden & Outdoor': [
    'garden', 'lawn', 'mower', 'trimmer', 'hedge', 'outdoor', 'chainsaw',
    'leaf', 'blower', 'pruning'
  ],
  'Cutting & Grinding': [
    'grinder', 'grinding', 'cutter', 'cutting', 'marble', 'tile', 'angle',
    'disc', 'blade', 'circular', 'saw'
  ],
  'Fastening & Accessories': [
    'fastener', 'bolt', 'nut', 'screw', 'nail', 'rivet', 'clamp',
    'accessory', 'bit', 'attachment', 'extension'
  ],
  'Electrical Tools': [
    'electric', 'electrical', 'wire', 'cable', 'tester', 'soldering',
    'multimeter', 'voltage', 'current', 'circuit'
  ]
};

// Standardized brands
const STANDARD_BRANDS = [
  'Taparia',
  'Metro',
  'Indian Tools',
  'Bosch',
  'Vaibhav Tools'
];

/**
 * Categorize product based on name and description
 */
function categorizeProduct(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  // Score each category
  const scores = {};
  for (const [category, keywords] of Object.entries(STANDARD_CATEGORIES)) {
    scores[category] = keywords.filter(keyword => text.includes(keyword)).length;
  }
  
  // Find category with highest score
  const bestCategory = Object.entries(scores).reduce((best, [cat, score]) => {
    return score > best.score ? { category: cat, score } : best;
  }, { category: 'Power & Hand Tools', score: 0 });
  
  return bestCategory.category;
}

/**
 * Standardize brand name
 */
function standardizeBrand(brand) {
  if (!brand) return 'Vaibhav Tools';
  
  const brandLower = brand.toLowerCase().trim();
  
  // Check for exact or partial matches
  for (const standardBrand of STANDARD_BRANDS) {
    if (brandLower.includes(standardBrand.toLowerCase())) {
      return standardBrand;
    }
  }
  
  // Check common variations
  if (brandLower.includes('taparia') || brandLower.includes('tapria')) return 'Taparia';
  if (brandLower.includes('metro')) return 'Metro';
  if (brandLower.includes('indian')) return 'Indian Tools';
  if (brandLower.includes('bosch')) return 'Bosch';
  
  // Default to Vaibhav Tools
  return 'Vaibhav Tools';
}

/**
 * Normalize a single product document
 */
function normalizeProduct(product) {
  const normalized = {
    name: product.name || 'Unnamed Product',
    description: product.description || product.shortDescription || '',
    category: product.category || '',
    brand: product.brand || '',
    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
    imageUrl: product.imageUrl || product.image || '',
    stock: typeof product.stock === 'number' ? product.stock : 100,
    rating: product.rating || 4.5,
    reviews: product.reviews || 0,
    badge: product.badge || null,
    badgeColor: product.badgeColor || null,
    createdAt: product.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  // Auto-categorize if category is missing or invalid
  if (!normalized.category || !Object.keys(STANDARD_CATEGORIES).includes(normalized.category)) {
    normalized.category = categorizeProduct(normalized.name, normalized.description);
    console.log(`[AUTO-CATEGORIZE] "${normalized.name}" → ${normalized.category}`);
  }
  
  // Standardize brand
  const originalBrand = normalized.brand;
  normalized.brand = standardizeBrand(normalized.brand);
  if (originalBrand !== normalized.brand) {
    console.log(`[BRAND-FIX] "${normalized.name}": "${originalBrand}" → "${normalized.brand}"`);
  }
  
  // Ensure price is valid
  if (normalized.price <= 0) {
    normalized.price = 999; // Default price
    console.warn(`[PRICE-FIX] "${normalized.name}": Set default price ₹999`);
  }
  
  // Ensure image URL
  if (!normalized.imageUrl) {
    normalized.imageUrl = 'https://placehold.co/400x400/1A1A1A/FFFFFF?text=Product';
    console.warn(`[IMAGE-FIX] "${normalized.name}": Set placeholder image`);
  }
  
  return normalized;
}

/**
 * Main normalization function
 */
export async function normalizeAllProducts(progressCallback) {
  try {
    progressCallback?.('📊 Starting product normalization...');
    
    // Get all products
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      return {
        success: false,
        message: 'No products found in Firestore'
      };
    }
    
    progressCallback?.(`📦 Found ${snapshot.size} products to normalize`);
    
    // Prepare batch updates
    const batch = writeBatch(db);
    let updateCount = 0;
    let categorized = 0;
    let brandFixed = 0;
    let priceFixed = 0;
    
    const stats = {
      byCategory: {},
      byBrand: {},
      issues: []
    };
    
    snapshot.forEach((docSnapshot) => {
      const product = docSnapshot.data();
      const normalized = normalizeProduct(product);
      
      // Track changes
      if (product.category !== normalized.category) categorized++;
      if (product.brand !== normalized.brand) brandFixed++;
      if (product.price !== normalized.price) priceFixed++;
      
      // Update stats
      stats.byCategory[normalized.category] = (stats.byCategory[normalized.category] || 0) + 1;
      stats.byBrand[normalized.brand] = (stats.byBrand[normalized.brand] || 0) + 1;
      
      // Add to batch
      const docRef = doc(db, 'products', docSnapshot.id);
      batch.update(docRef, normalized);
      updateCount++;
      
      // Firestore batch limit is 500
      if (updateCount % 400 === 0) {
        progressCallback?.(`⏳ Processing... (${updateCount}/${snapshot.size})`);
      }
    });
    
    // Commit batch
    progressCallback?.('💾 Saving changes to Firestore...');
    await batch.commit();
    
    progressCallback?.('✅ Normalization complete!');
    
    return {
      success: true,
      message: `Successfully normalized ${updateCount} products`,
      stats: {
        total: updateCount,
        categorized,
        brandFixed,
        priceFixed,
        byCategory: stats.byCategory,
        byBrand: stats.byBrand
      }
    };
    
  } catch (error) {
    console.error('[ERROR] Product normalization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify normalized data
 */
export async function verifyNormalizedProducts() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const issues = [];
    const stats = {
      total: snapshot.size,
      missingFields: 0,
      invalidPrices: 0,
      invalidCategories: 0,
      invalidBrands: 0
    };
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      
      // Check required fields
      const requiredFields = ['name', 'description', 'category', 'brand', 'price'];
      const missing = requiredFields.filter(field => !product[field]);
      
      if (missing.length > 0) {
        stats.missingFields++;
        issues.push({
          id: doc.id,
          name: product.name,
          issue: `Missing fields: ${missing.join(', ')}`
        });
      }
      
      // Check price
      if (typeof product.price !== 'number' || product.price <= 0) {
        stats.invalidPrices++;
        issues.push({
          id: doc.id,
          name: product.name,
          issue: `Invalid price: ${product.price}`
        });
      }
      
      // Check category
      if (!Object.keys(STANDARD_CATEGORIES).includes(product.category)) {
        stats.invalidCategories++;
        issues.push({
          id: doc.id,
          name: product.name,
          issue: `Invalid category: ${product.category}`
        });
      }
      
      // Check brand
      if (!STANDARD_BRANDS.includes(product.brand)) {
        stats.invalidBrands++;
        issues.push({
          id: doc.id,
          name: product.name,
          issue: `Invalid brand: ${product.brand}`
        });
      }
    });
    
    return {
      success: issues.length === 0,
      stats,
      issues: issues.slice(0, 20) // Limit to first 20 issues
    };
    
  } catch (error) {
    console.error('[ERROR] Verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get normalization preview without saving
 */
export async function previewNormalization() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const preview = [];
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      const normalized = normalizeProduct(product);
      
      const changes = [];
      if (product.category !== normalized.category) {
        changes.push(`Category: "${product.category}" → "${normalized.category}"`);
      }
      if (product.brand !== normalized.brand) {
        changes.push(`Brand: "${product.brand}" → "${normalized.brand}"`);
      }
      if (product.price !== normalized.price) {
        changes.push(`Price: ${product.price} → ${normalized.price}`);
      }
      
      if (changes.length > 0) {
        preview.push({
          id: doc.id,
          name: product.name,
          changes
        });
      }
    });
    
    return {
      success: true,
      preview: preview.slice(0, 50), // Show first 50 changes
      totalChanges: preview.length
    };
    
  } catch (error) {
    console.error('[ERROR] Preview failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export { STANDARD_CATEGORIES, STANDARD_BRANDS };
