// Fix missing brand data in existing Firestore products
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDGccnDx00tBfc4SjLUX0seN8LcVZvp4Lo",
  authDomain: "vaibhavtools-70e4f.firebaseapp.com",
  projectId: "vaibhavtools-70e4f",
  storageBucket: "vaibhavtools-70e4f.appspot.com",
  messagingSenderId: "842533829975",
  appId: "1:842533829975:web:8333eda265d53203c4d212",
  measurementId: "G-ZH9HEZ0G2L"
};

// Brand mapping based on product names and categories
const brandMappings = {
  'Painting & Air Tools': 'Ingco',
  'Power & Hand Tools': 'Bosch', 
  'Safety & Measurement': 'Stanley',
  'Fastening & Cutting Tools': 'Taparia'
};

// Specific brand mappings for certain product names
const specificBrandMappings = {
  'Professional Drill Machine': 'Bosch',
  'Industrial Grinder': 'Bosch', 
  'Professional Paint Gun': 'Pilot',
  'Professional Screwdriver Set': 'Taparia',
  'Digital Measuring Tool': 'Stanley',
  'Professional Locks': 'Yale'
};

async function fixMissingBrands() {
  try {
    console.log('🔄 Fixing missing brand data...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Get all products
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log('📦 Found', snapshot.size, 'products to check');
    
    let updatedCount = 0;
    const updates = [];
    
    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      
      // Check if brand is missing or undefined
      if (!product.brand || product.brand === 'undefined') {
        let newBrand = null;
        
        // Try specific name mapping first
        for (const [name, brand] of Object.entries(specificBrandMappings)) {
          if (product.name && product.name.includes(name)) {
            newBrand = brand;
            break;
          }
        }
        
        // Fallback to category mapping
        if (!newBrand && product.category) {
          newBrand = brandMappings[product.category] || 'Generic';
        }
        
        if (newBrand) {
          updates.push({
            docId: docSnap.id,
            name: product.name,
            category: product.category,
            oldBrand: product.brand,
            newBrand: newBrand
          });
        }
      }
    });
    
    console.log('🔄 Will update', updates.length, 'products:');
    updates.forEach(update => {
      console.log(`- ${update.name} (${update.category}): ${update.oldBrand} → ${update.newBrand}`);
    });
    
    // Confirm before updating
    console.log('\\n⚡ Starting updates...');
    
    for (const update of updates) {
      try {
        const docRef = doc(db, 'products', update.docId);
        await updateDoc(docRef, {
          brand: update.newBrand,
          updatedAt: new Date()
        });
        updatedCount++;
        console.log(`✅ Updated: ${update.name}`);
      } catch (error) {
        console.error(`❌ Failed to update ${update.name}:`, error.message);
      }
    }
    
    console.log('\\n🎉 Brand fix complete!');
    console.log(`📊 Updated ${updatedCount} out of ${updates.length} products`);
    console.log('\\nNow the Products page should show brands properly!');
    
  } catch (error) {
    console.error('❌ Brand fix failed:', error.message);
    console.error('Full error:', error);
  }
}

fixMissingBrands();