/**
 * Firestore Stock Normalization Script
 * 
 * Purpose: Normalize stock field across all product documents
 * - Handles multiple field names (stock, stockCount, quantity)
 * - Converts strings to numbers
 * - Sets default to 0 if missing or negative
 * - Updates in batches to avoid hitting Firestore limits
 * 
 * Usage:
 *   node scripts/normalize-stock.js
 * 
 * Requirements:
 *   - firebase-admin SDK installed
 *   - Service account credentials configured
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
// Option 1: Using service account key file (recommended for production)
// const serviceAccount = require('./path-to-service-account-key.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// Option 2: Using application default credentials (for local dev)
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'vaibhavtools-70e4f'
});

const db = admin.firestore();

/**
 * Normalize stock value
 * Tries multiple field names and converts to safe integer >= 0
 */
function normalizeStockValue(docData) {
  // Try multiple possible field names
  const raw = docData.stock ?? docData.stockCount ?? docData.quantity ?? 0;
  
  // Convert to string, remove non-numeric chars (except minus), parse
  const parsed = parseInt(String(raw || 0).replace(/[^0-9-]/g, ''), 10);
  
  // Handle NaN or negative values
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  
  return parsed;
}

/**
 * Main migration function
 */
async function migrateStockFields() {
  console.log('🚀 Starting stock field normalization...\n');
  
  try {
    // Get all products
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️  No products found in database.');
      return;
    }
    
    console.log(`📦 Found ${snapshot.size} products to process\n`);
    
    // Process in batches (Firestore limit is 500 operations per batch)
    const BATCH_SIZE = 300;
    let batch = db.batch();
    let batchCount = 0;
    let totalUpdated = 0;
    let stats = {
      hadStock: 0,
      hadStockCount: 0,
      hadQuantity: 0,
      hadNone: 0,
      wasString: 0,
      wasNegative: 0
    };
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Collect statistics
      if (data.stock !== undefined && data.stock !== null) stats.hadStock++;
      if (data.stockCount !== undefined && data.stockCount !== null) stats.hadStockCount++;
      if (data.quantity !== undefined && data.quantity !== null) stats.hadQuantity++;
      if (!data.stock && !data.stockCount && !data.quantity) stats.hadNone++;
      
      const originalValue = data.stock ?? data.stockCount ?? data.quantity;
      if (typeof originalValue === 'string') stats.wasString++;
      if (originalValue < 0) stats.wasNegative++;
      
      // Normalize the stock value
      const normalizedStock = normalizeStockValue(data);
      
      // Log sample products
      if (totalUpdated < 5) {
        console.log(`📝 Sample ${totalUpdated + 1}:`);
        console.log(`   ID: ${doc.id}`);
        console.log(`   Name: ${data.name || 'Unknown'}`);
        console.log(`   Original: stock=${data.stock}, stockCount=${data.stockCount}, quantity=${data.quantity}`);
        console.log(`   Normalized: stock=${normalizedStock}\n`);
      }
      
      // Update document - set stock field and remove old field names
      const updateData = { 
        stock: normalizedStock,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Remove old field names if they exist
      if (data.stockCount !== undefined) {
        updateData.stockCount = admin.firestore.FieldValue.delete();
      }
      if (data.quantity !== undefined && data.category !== 'orderItem') {
        // Only delete 'quantity' if not an order item (where quantity means order quantity)
        updateData.quantity = admin.firestore.FieldValue.delete();
      }
      
      batch.update(doc.ref, updateData);
      batchCount++;
      totalUpdated++;
      
      // Commit batch when it reaches the size limit
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        console.log(`✅ Committed batch: ${totalUpdated} products updated so far`);
        batch = db.batch();
        batchCount = 0;
      }
    }
    
    // Commit remaining items
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch: ${batchCount} products`);
    }
    
    // Print summary
    console.log('\n📊 Migration Summary:');
    console.log(`   Total products processed: ${totalUpdated}`);
    console.log(`   Had 'stock' field: ${stats.hadStock}`);
    console.log(`   Had 'stockCount' field: ${stats.hadStockCount}`);
    console.log(`   Had 'quantity' field: ${stats.hadQuantity}`);
    console.log(`   Had no stock field: ${stats.hadNone}`);
    console.log(`   Were string values: ${stats.wasString}`);
    console.log(`   Were negative values: ${stats.wasNegative}`);
    console.log('\n✨ Migration completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback function (optional - use with caution)
 * Creates a backup collection before running migration
 */
async function createBackup() {
  console.log('💾 Creating backup...');
  
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const backupCollection = `products_backup_${Date.now()}`;
    const backupRef = db.collection(backupCollection);
    
    let batch = db.batch();
    let count = 0;
    
    for (const doc of snapshot.docs) {
      batch.set(backupRef.doc(doc.id), doc.data());
      count++;
      
      if (count % 300 === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }
    
    if (count % 300 !== 0) {
      await batch.commit();
    }
    
    console.log(`✅ Backup created: ${backupCollection} (${count} documents)\n`);
    return backupCollection;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Main execution
(async () => {
  try {
    console.log('═══════════════════════════════════════════════════');
    console.log('  Firestore Stock Normalization Migration');
    console.log('  Project: vaibhavtools-70e4f');
    console.log('═══════════════════════════════════════════════════\n');
    
    // Ask for confirmation
    console.log('⚠️  WARNING: This will modify all product documents!');
    console.log('⚠️  Make sure you have a backup before proceeding.\n');
    
    // For safety, require explicit confirmation via environment variable
    if (process.env.CONFIRM_MIGRATION !== 'yes') {
      console.log('❌ Migration not confirmed.');
      console.log('   Set CONFIRM_MIGRATION=yes to proceed.\n');
      console.log('   Example: CONFIRM_MIGRATION=yes node scripts/normalize-stock.js\n');
      process.exit(0);
    }
    
    // Optionally create backup first
    if (process.env.CREATE_BACKUP === 'yes') {
      await createBackup();
    }
    
    // Run migration
    await migrateStockFields();
    
    console.log('🎉 All done! You can now restart your application.\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
})();
