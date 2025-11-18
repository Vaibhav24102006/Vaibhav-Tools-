/**
 * Firebase Cloud Functions for Vaibhav Tools
 * 
 * Auto-classification of products when created or updated
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Classification Rules (same as migration script)
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
  
  for (const [categoryName, config] of Object.entries(CATEGORY_RULES)) {
    const { keywords, subcategories } = config;
    
    const matchesCategory = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    
    if (matchesCategory) {
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
  
  return {
    category: 'uncategorized',
    categoryName: 'Uncategorized',
    subCategory: 'General'
  };
}

/**
 * Auto-classify products on create or update
 * Triggers when a product document is written
 */
exports.autoClassifyProduct = functions.firestore
  .document('products/{productId}')
  .onWrite(async (change, context) => {
    const productId = context.params.productId;
    
    // Get the new data
    const newData = change.after.exists ? change.after.data() : null;
    
    // If document was deleted, do nothing
    if (!newData) {
      console.log(`Product ${productId} was deleted`);
      return null;
    }
    
    // Check if classification is needed
    const needsClassification = !newData.category || 
                                !newData.categoryName || 
                                !newData.subCategory ||
                                newData.category === 'uncategorized';
    
    if (!needsClassification) {
      console.log(`Product ${productId} already classified: ${newData.categoryName}`);
      return null;
    }
    
    // Classify the product
    const classification = classifyProduct(newData.name, newData.description);
    
    console.log(`Auto-classifying product ${productId}:`);
    console.log(`  Name: ${newData.name}`);
    console.log(`  Category: ${classification.categoryName}`);
    console.log(`  SubCategory: ${classification.subCategory}`);
    
    // Prepare update data
    const updateData = {
      ...classification,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Add default values if missing
    if (!newData.imageUrl && !newData.image) {
      updateData.imageUrl = 'https://via.placeholder.com/800x600?text=Vaibhav+Tools';
    }
    
    if (typeof newData.stock === 'undefined') {
      updateData.stock = 0;
    }
    
    if (!newData.rating) {
      updateData.rating = 4.5;
    }
    
    // Normalize price
    if (typeof newData.price === 'string') {
      updateData.price = parseFloat(newData.price.replace(/[^0-9.]/g, '')) || 999;
    } else if (!newData.price || newData.price <= 0) {
      updateData.price = 999;
    }
    
    // Update the document
    try {
      await change.after.ref.update(updateData);
      console.log(`✅ Product ${productId} auto-classified successfully`);
      return null;
    } catch (error) {
      console.error(`❌ Error auto-classifying product ${productId}:`, error);
      return null;
    }
  });

/**
 * HTTP function to manually trigger classification for a product
 * Usage: POST to function URL with { productId: "xxx" }
 */
exports.classifyProductManual = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
  const { productId } = req.body;
  
  if (!productId) {
    res.status(400).send('productId is required');
    return;
  }
  
  try {
    const productRef = admin.firestore().collection('products').doc(productId);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      res.status(404).send('Product not found');
      return;
    }
    
    const product = productDoc.data();
    const classification = classifyProduct(product.name, product.description);
    
    await productRef.update({
      ...classification,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({
      success: true,
      productId,
      classification
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

/**
 * HTTP function to set admin custom claim
 * Usage: POST to function URL with { uid: "xxx" }
 */
exports.setAdminClaim = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  const { uid } = req.body;
  
  if (!uid) {
    res.status(400).send('UID is required');
    return;
  }
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.send(`Success! User ${uid} is now an admin.`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});
