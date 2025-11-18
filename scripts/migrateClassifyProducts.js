/**
 * Product Classification Migration Script
 * 
 * This script:
 * 1. Reads all products from Firestore
 * 2. Auto-classifies them based on name/description keywords
 * 3. Updates category, categoryName, and subCategory fields
 * 4. Normalizes prices and other fields
 * 5. Batch updates all products
 * 
 * Usage: node scripts/migrateClassifyProducts.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Classification Rules
const CATEGORY_RULES = {
  'Power & Hand Tools': {
    keywords: ['drill', 'drilling', 'hammer', 'impact driver', 'rotary', 'cordless drill', 'power drill'],
    subcategories: {
      'Drills': ['drill', 'drilling'],
      'Hammers': ['hammer', 'impact'],
      'Drivers': ['driver', 'screwdriver']
    }
  },
  'Cutting & Grinding': {
    keywords: ['grinder', 'grinding', 'cutting wheel', 'angle grinder', 'cut-off', 'disc', 'cutter', 'saw', 'blade'],
    subcategories: {
      'Grinders': ['grinder', 'grinding', 'angle'],
      'Cutting Tools': ['cutter', 'cutting', 'saw'],
      'Accessories': ['wheel', 'disc', 'blade']
    }
  },
  'Measuring & Safety': {
    keywords: ['measuring tape', 'vernier', 'caliper', 'ruler', 'level', 'gauge', 'safety', 'goggles', 'gloves', 'helmet', 'mask'],
    subcategories: {
      'Measuring Tools': ['measuring', 'tape', 'vernier', 'caliper', 'ruler', 'level', 'gauge'],
      'Safety Equipment': ['safety', 'goggles', 'gloves', 'helmet', 'mask', 'protection']
    }
  },
  'Painting & Air Tools': {
    keywords: ['paint gun', 'spray gun', 'airbrush', 'compressor', 'air tool', 'sprayer', 'paint', 'spray'],
    subcategories: {
      'Paint Guns': ['paint gun', 'spray gun', 'airbrush'],
      'Air Tools': ['compressor', 'air tool', 'pneumatic'],
      'Accessories': ['nozzle', 'hose', 'regulator']
    }
  },
  'Fastening & Accessories': {
    keywords: ['wrench', 'spanner', 'screwdriver', 'pliers', 'socket', 'ratchet', 'hex key', 'allen key', 'clamp'],
    subcategories: {
      'Wrenches': ['wrench', 'spanner'],
      'Screwdrivers': ['screwdriver', 'driver'],
      'Pliers & Grips': ['pliers', 'grip', 'clamp'],
      'Socket Sets': ['socket', 'ratchet']
    }
  },
  'Electrical & Maintenance': {
    keywords: ['electric', 'electrical', 'solder', 'soldering', 'heat gun', 'multimeter', 'tester', 'wire', 'cable'],
    subcategories: {
      'Soldering': ['solder', 'soldering', 'iron'],
      'Testing': ['multimeter', 'tester', 'meter'],
      'Heat Tools': ['heat gun', 'hot air']
    }
  },
  'Garden & Outdoor': {
    keywords: ['garden', 'gardening', 'trimmer', 'lawn', 'mower', 'hedge', 'pruning', 'outdoor'],
    subcategories: {
      'Trimmers': ['trimmer', 'hedge'],
      'Lawn Care': ['lawn', 'mower', 'grass'],
      'Pruning': ['pruning', 'shears', 'loppers']
    }
  }
};

/**
 * Classify product based on name and description
 */
function classifyProduct(name, description) {
  const text = `${name} ${description || ''}`.toLowerCase();
  
  // Check each category
  for (const [categoryName, config] of Object.entries(CATEGORY_RULES)) {
    const { keywords, subcategories } = config;
    
    // Check if any keyword matches
    const matchesCategory = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    
    if (matchesCategory) {
      // Find subcategory
      let subCategory = 'General';
      for (const [subCat, subKeywords] of Object.entries(subcategories)) {
        const matchesSubCategory = subKeywords.some(keyword => text.includes(keyword.toLowerCase()));
        if (matchesSubCategory) {
          subCategory = subCat;
          break;
        }
      }
      
      return {
        category: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
        categoryName: categoryName,
        subCategory: subCategory
      };
    }
  }
  
  // Fallback
  return {
    category: 'uncategorized',
    categoryName: 'Uncategorized',
    subCategory: 'General'
  };
}

/**
 * Normalize product data
 */
function normalizeProduct(product) {
  const normalized = { ...product };
  
  // Normalize price
  if (typeof normalized.price === 'string') {
    normalized.price = parseFloat(normalized.price.replace(/[^0-9.]/g, '')) || 0;
  }
  if (!normalized.price || normalized.price <= 0) {
    normalized.price = 999; // Default price
  }
  
  // Ensure image URL
  if (!normalized.imageUrl && !normalized.image) {
    normalized.imageUrl = 'https://via.placeholder.com/800x600?text=Vaibhav+Tools';
  } else if (normalized.image && !normalized.imageUrl) {
    normalized.imageUrl = normalized.image;
  }
  
  // Normalize stock
  if (typeof normalized.stock === 'undefined' || normalized.stock === null) {
    normalized.stock = 0;
  }
  
  // Ensure required fields
  if (!normalized.name) {
    normalized.name = 'Unnamed Product';
  }
  
  if (!normalized.description) {
    normalized.description = '';
  }
  
  // Add default rating if missing
  if (!normalized.rating) {
    normalized.rating = 4.5;
  }
  
  // Add timestamps
  if (!normalized.createdAt) {
    normalized.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }
  normalized.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  return normalized;
}

/**
 * Main migration function
 */
async function migrateProducts() {
  console.log('🚀 Starting Product Classification Migration...\n');
  
  try {
    // Get all products
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No products found in Firestore');
      process.exit(1);
    }
    
    console.log(`📦 Found ${snapshot.size} products to classify\n`);
    
    // Prepare batch updates
    const batch = db.batch();
    let updateCount = 0;
    let classifiedCount = 0;
    
    const stats = {
      byCategory: {},
      bySubCategory: {},
      pricesFixed: 0,
      imagesFixed: 0,
      stockFixed: 0
    };
    
    // Process each product
    snapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;
      
      // Classify product
      const classification = classifyProduct(product.name, product.description);
      
      // Normalize product data
      const normalized = normalizeProduct(product);
      
      // Merge classification with normalized data
      const updated = {
        ...normalized,
        ...classification
      };
      
      // Track changes
      if (product.category !== classification.category) {
        classifiedCount++;
        console.log(`[CLASSIFY] ${product.name}`);
        console.log(`  → Category: ${classification.categoryName}`);
        console.log(`  → SubCategory: ${classification.subCategory}\n`);
      }
      
      if (product.price !== normalized.price) {
        stats.pricesFixed++;
      }
      
      if (!product.imageUrl && !product.image) {
        stats.imagesFixed++;
      }
      
      if (typeof product.stock === 'undefined') {
        stats.stockFixed++;
      }
      
      // Update stats
      stats.byCategory[classification.categoryName] = (stats.byCategory[classification.categoryName] || 0) + 1;
      stats.bySubCategory[classification.subCategory] = (stats.bySubCategory[classification.subCategory] || 0) + 1;
      
      // Add to batch
      batch.update(doc.ref, updated);
      updateCount++;
      
      // Firestore batch limit is 500
      if (updateCount % 400 === 0) {
        console.log(`⏳ Processing... (${updateCount}/${snapshot.size})`);
      }
    });
    
    // Commit batch
    console.log('\n💾 Saving changes to Firestore...');
    await batch.commit();
    
    // Print results
    console.log('\n✅ Migration Complete!\n');
    console.log('📊 Statistics:');
    console.log(`  Total Products: ${updateCount}`);
    console.log(`  Classified: ${classifiedCount}`);
    console.log(`  Prices Fixed: ${stats.pricesFixed}`);
    console.log(`  Images Fixed: ${stats.imagesFixed}`);
    console.log(`  Stock Fixed: ${stats.stockFixed}\n`);
    
    console.log('📁 Products by Category:');
    Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
      });
    
    console.log('\n📂 Products by SubCategory:');
    Object.entries(stats.bySubCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([subCat, count]) => {
        console.log(`  ${subCat}: ${count}`);
      });
    
    console.log('\n🎉 All products have been classified and updated!');
    console.log('👉 Check /debug-db or /products to see the results\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
