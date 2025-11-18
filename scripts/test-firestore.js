// Test Firestore connectivity directly
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDGccnDx00tBfc4SjLUX0seN8LcVZvp4Lo",
  authDomain: "vaibhavtools-70e4f.firebaseapp.com",
  projectId: "vaibhavtools-70e4f",
  storageBucket: "vaibhavtools-70e4f.appspot.com",
  messagingSenderId: "842533829975",
  appId: "1:842533829975:web:8333eda265d53203c4d212",
  measurementId: "G-ZH9HEZ0G2L"
};

async function testFirestore() {
  try {
    console.log('🔄 Testing Firestore connection...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase app initialized');
    console.log('📊 Project ID:', firebaseConfig.projectId);
    
    // Test products collection
    console.log('🔍 Fetching products collection...');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log('📦 Products found:', snapshot.size);
    
    if (snapshot.size > 0) {
      const firstDoc = snapshot.docs[0];
      console.log('📄 First document ID:', firstDoc.id);
      console.log('📋 First document data:', JSON.stringify(firstDoc.data(), null, 2));
    }
    
    // Test categories collection
    console.log('🔍 Fetching categories collection...');
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    console.log('📁 Categories found:', categoriesSnapshot.size);
    
    // Test brands collection
    console.log('🔍 Fetching brands collection...');
    const brandsRef = collection(db, 'brands');
    const brandsSnapshot = await getDocs(brandsRef);
    
    console.log('🏷️  Brands found:', brandsSnapshot.size);
    
    if (snapshot.size === 0) {
      console.log('⚠️  No products found! You need to run the data population script.');
      console.log('Visit: http://localhost:3001/populate-data');
    } else {
      console.log('🎉 Firestore connection successful with data!');
    }
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error.message);
    console.error('Full error:', error);
  }
}

testFirestore();