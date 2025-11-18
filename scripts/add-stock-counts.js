/**
 * Migration Script: Add Stock Counts to Existing Products
 * 
 * This script adds stockCount field to all products in Firestore
 * that don't already have it.
 * 
 * Usage:
 *   node scripts/add-stock-counts.js
 * 
 * Default stock count: 20 (can be customized per product)
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Default stock count for products
const DEFAULT_STOCK_COUNT = 20;

// Custom stock counts for specific categories (optional)
const CATEGORY_STOCK_DEFAULTS = {
  'Power & Hand Tools': 15,
  'Painting & Air Tools': 25,
  'Safety & Measurement': 30,
  'Fastening & Cutting Tools': 20
};

async function addStockCounts() {
  console.log('🚀 Starting stock count migration...\n');

  try {
    // Get all products
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('❌ No products found in database');
      return;
    }

    console.log(`📦 Found ${productsSnapshot.size} products\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    const batch = db.batch();

    productsSnapshot.forEach((doc) => {
      const product = doc.data();
      
      // Skip if stockCount already exists
      if (product.stockCount !== undefined) {
        console.log(`⏭️  Skipped: ${product.name} (already has stockCount: ${product.stockCount})`);
        skippedCount++;
        return;
      }

      // Determine stock count based on category
      const stockCount = CATEGORY_STOCK_DEFAULTS[product.category] || DEFAULT_STOCK_COUNT;

      // Update product
      batch.update(doc.ref, {
        stockCount: stockCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Will update: ${product.name} → stockCount: ${stockCount}`);
      updatedCount++;
    });

    // Commit batch update
    if (updatedCount > 0) {
      console.log(`\n📝 Committing ${updatedCount} updates...`);
      await batch.commit();
      console.log('✅ Batch update completed successfully!\n');
    } else {
      console.log('\n✅ No updates needed - all products already have stock counts\n');
    }

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   Total products: ${productsSnapshot.size}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
addStockCounts()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
