import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { STANDARD_CATEGORIES, STANDARD_BRANDS } from './normalizeProducts';

/**
 * Quick data quality check for products
 * Can be used in console or as a utility function
 */
export async function checkDataQuality() {
  try {
    console.log('🔍 Checking product data quality...\n');
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log('❌ No products found in Firestore');
      return {
        success: false,
        message: 'No products found'
      };
    }
    
    const stats = {
      total: snapshot.size,
      missingFields: 0,
      invalidPrices: 0,
      invalidCategories: 0,
      invalidBrands: 0,
      missingImages: 0,
      categoryDistribution: {},
      brandDistribution: {},
      issues: []
    };
    
    const requiredFields = ['name', 'description', 'category', 'brand', 'price'];
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      const productIssues = [];
      
      // Check required fields
      const missing = requiredFields.filter(field => !product[field]);
      if (missing.length > 0) {
        stats.missingFields++;
        productIssues.push(`Missing: ${missing.join(', ')}`);
      }
      
      // Check price
      if (typeof product.price !== 'number' || product.price <= 0) {
        stats.invalidPrices++;
        productIssues.push(`Invalid price: ${product.price}`);
      }
      
      // Check category
      if (!Object.keys(STANDARD_CATEGORIES).includes(product.category)) {
        stats.invalidCategories++;
        productIssues.push(`Invalid category: ${product.category}`);
      } else {
        stats.categoryDistribution[product.category] = 
          (stats.categoryDistribution[product.category] || 0) + 1;
      }
      
      // Check brand
      if (!STANDARD_BRANDS.includes(product.brand)) {
        stats.invalidBrands++;
        productIssues.push(`Invalid brand: ${product.brand}`);
      } else {
        stats.brandDistribution[product.brand] = 
          (stats.brandDistribution[product.brand] || 0) + 1;
      }
      
      // Check image
      if (!product.imageUrl && !product.image) {
        stats.missingImages++;
        productIssues.push('Missing image');
      }
      
      if (productIssues.length > 0) {
        stats.issues.push({
          id: doc.id,
          name: product.name || 'Unnamed',
          issues: productIssues
        });
      }
    });
    
    // Calculate quality score
    const totalIssues = stats.missingFields + stats.invalidPrices + 
                       stats.invalidCategories + stats.invalidBrands + stats.missingImages;
    const qualityScore = Math.max(0, 100 - (totalIssues / stats.total * 100));
    
    // Print results
    console.log('📊 Data Quality Report');
    console.log('═══════════════════════════════════════\n');
    
    console.log(`Total Products: ${stats.total}`);
    console.log(`Quality Score: ${qualityScore.toFixed(1)}%\n`);
    
    console.log('Issues Found:');
    console.log(`  Missing Fields: ${stats.missingFields}`);
    console.log(`  Invalid Prices: ${stats.invalidPrices}`);
    console.log(`  Invalid Categories: ${stats.invalidCategories}`);
    console.log(`  Invalid Brands: ${stats.invalidBrands}`);
    console.log(`  Missing Images: ${stats.missingImages}\n`);
    
    if (Object.keys(stats.categoryDistribution).length > 0) {
      console.log('Products by Category:');
      Object.entries(stats.categoryDistribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`  ${cat}: ${count}`);
        });
      console.log('');
    }
    
    if (Object.keys(stats.brandDistribution).length > 0) {
      console.log('Products by Brand:');
      Object.entries(stats.brandDistribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([brand, count]) => {
          console.log(`  ${brand}: ${count}`);
        });
      console.log('');
    }
    
    if (stats.issues.length > 0) {
      console.log(`⚠️  Found ${stats.issues.length} products with issues (showing first 10):\n`);
      stats.issues.slice(0, 10).forEach((issue, idx) => {
        console.log(`${idx + 1}. ${issue.name}`);
        issue.issues.forEach(i => console.log(`   - ${i}`));
      });
    } else {
      console.log('✅ No issues found! All products are properly normalized.\n');
    }
    
    if (qualityScore < 100) {
      console.log('\n💡 Recommendation: Run normalization at /normalize-products');
    }
    
    return {
      success: qualityScore === 100,
      stats,
      qualityScore
    };
    
  } catch (error) {
    console.error('❌ Error checking data quality:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get quick stats without detailed logging
 */
export async function getQuickStats() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const stats = {
      total: snapshot.size,
      categories: new Set(),
      brands: new Set()
    };
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      if (product.category) stats.categories.add(product.category);
      if (product.brand) stats.brands.add(product.brand);
    });
    
    return {
      total: stats.total,
      categories: Array.from(stats.categories),
      brands: Array.from(stats.brands),
      categoriesCount: stats.categories.size,
      brandsCount: stats.brands.size
    };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

/**
 * Check if normalization is needed
 */
export async function needsNormalization() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    let needsNorm = false;
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      
      // Check if category is not standard
      if (!Object.keys(STANDARD_CATEGORIES).includes(product.category)) {
        needsNorm = true;
      }
      
      // Check if brand is not standard
      if (!STANDARD_BRANDS.includes(product.brand)) {
        needsNorm = true;
      }
      
      // Check for missing required fields
      if (!product.name || !product.description || !product.price) {
        needsNorm = true;
      }
    });
    
    return needsNorm;
    
  } catch (error) {
    console.error('Error checking normalization status:', error);
    return true; // Assume needs normalization if error
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.checkDataQuality = checkDataQuality;
  window.getQuickStats = getQuickStats;
  window.needsNormalization = needsNormalization;
}
