// Test products collection with detailed analysis
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDGccnDx00tBfc4SjLUX0seN8LcVZvp4Lo",
  authDomain: "vaibhavtools-70e4f.firebaseapp.com",
  projectId: "vaibhavtools-70e4f",
  storageBucket: "vaibhavtools-70e4f.appspot.com",
  messagingSenderId: "842533829975",
  appId: "1:842533829975:web:8333eda265d53203c4d212",
  measurementId: "G-ZH9HEZ0G2L"
};

async function testProductsDetailed() {
  try {
    console.log('🔄 Testing products collection in detail...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Test basic products query
    console.log('🔍 Fetching products without orderBy...');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log('📦 Total products found:', snapshot.size);
    
    if (snapshot.size > 0) {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📄 Sample product fields:');
      const first = products[0];
      console.log('- ID:', first.id);
      console.log('- Name:', first.name);
      console.log('- Category:', first.category);
      console.log('- Brand:', first.brand);
      console.log('- Price:', first.price);
      console.log('- Has createdAt:', !!first.createdAt);
      
      // Analyze categories
      const categories = [...new Set(products.map(p => p.category))];
      console.log('📂 Unique categories found:', categories);
      
      // Analyze brands
      const brands = [...new Set(products.map(p => p.brand))];
      console.log('🏷️  Unique brands found:', brands);
      
      // Test orderBy query
      console.log('🔍 Testing orderBy query...');
      try {
        const orderedQuery = query(productsRef, orderBy('createdAt', 'desc'));
        const orderedSnapshot = await getDocs(orderedQuery);
        console.log('✅ OrderBy query successful, got', orderedSnapshot.size, 'products');
      } catch (orderError) {
        console.log('❌ OrderBy failed:', orderError.message);
        console.log('This explains why the app might have issues!');
      }
      
      console.log('\\n🎯 ANALYSIS:');
      console.log('- Products exist and are readable ✅');
      console.log('- Total count:', snapshot.size);
      console.log('- Categories:', categories.length);
      console.log('- Brands:', brands.length);
      
    } else {
      console.log('❌ No products found in Firestore!');
    }
    
  } catch (error) {
    console.error('❌ Products test failed:', error.message);
    console.error('Full error:', error);
  }
}

testProductsDetailed();