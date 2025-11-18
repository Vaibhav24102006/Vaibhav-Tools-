const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Firebase Admin
try {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vaibhav-tools-default-rtdb.firebaseio.com"
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('💡 Make sure firebase-service-account.json exists in the root directory');
  process.exit(1);
}

const db = admin.firestore();

async function initializeDatabase() {
  console.log('🔄 Initializing VaibhavTools database...\n');

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.collection('users').doc('admin').set({
      email: 'admin@vaibhavtools.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Admin user created successfully');

    // Create sample products
    console.log('📦 Creating sample products...');
    const sampleProducts = [
      {
        name: "Professional Drill Machine",
        description: "High-performance electric drill with variable speed control and ergonomic design",
        price: 299.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Machine",
        rating: 4.8,
        category: "Power & Hand Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500",
        inStock: true,
        stockQuantity: 50
      },
      {
        name: "Industrial Grinder",
        description: "Heavy-duty grinder for professional metalwork and construction",
        price: 199.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Grinder",
        rating: 4.7,
        category: "Power & Hand Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500",
        inStock: true,
        stockQuantity: 30
      },
      {
        name: "Professional Paint Gun",
        description: "High-quality paint gun for automotive and industrial use",
        price: 129.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Paint+Gun",
        rating: 4.7,
        category: "Painting & Air Tools",
        badge: "Popular",
        badgeColor: "bg-blue-500",
        inStock: true,
        stockQuantity: 25
      },
      {
        name: "Professional Screwdriver Set",
        description: "Complete screwdriver set with magnetic tips and ergonomic handles",
        price: 45.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Screwdriver+Set",
        rating: 4.8,
        category: "Fastening & Cutting Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500",
        inStock: true,
        stockQuantity: 100
      },
      {
        name: "Digital Measuring Tool",
        description: "Precision digital measuring tool for accurate readings and calibration",
        price: 159.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Measuring+Tool",
        rating: 4.8,
        category: "Safety & Measurement",
        badge: "Limited Stock",
        badgeColor: "bg-red-500",
        inStock: true,
        stockQuantity: 10
      }
    ];

    const productsCollection = db.collection('products');
    for (const product of sampleProducts) {
      await productsCollection.add({
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ ${sampleProducts.length} sample products created`);

    // Create sample categories
    console.log('📂 Creating product categories...');
    const categories = [
      { name: "Power & Hand Tools", description: "Electric and manual tools for construction and DIY" },
      { name: "Painting & Air Tools", description: "Paint guns, spray tools, and air compressors" },
      { name: "Fastening & Cutting Tools", description: "Screwdrivers, wrenches, and cutting equipment" },
      { name: "Safety & Measurement", description: "Safety equipment and precision measuring tools" }
    ];

    const categoriesCollection = db.collection('categories');
    for (const category of categories) {
      await categoriesCollection.add({
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ ${categories.length} categories created`);

    // Create database indexes (for better performance)
    console.log('📊 Database indexes will be created automatically by Firebase');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start the backend server: npm run server');
    console.log('2. Start the frontend: npm start');
    console.log('3. Or start both: npm run dev');
    console.log('\n🌐 Access URLs:');
    console.log('- Frontend: http://localhost:3000');
    console.log('- Admin Panel: http://localhost:3000/admin/login');
    console.log('- Backend API: http://localhost:5000/api');
    console.log('\n🔑 Default Admin Credentials:');
    console.log('📧 Email: admin@vaibhavtools.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check Firebase credentials in firebase-service-account.json');
    console.log('2. Verify Firebase project settings');
    console.log('3. Ensure you have the correct permissions');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down gracefully...');
  admin.app().delete().then(() => {
    process.exit(0);
  });
});

initializeDatabase().then(() => {
  // Exit after completion
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
