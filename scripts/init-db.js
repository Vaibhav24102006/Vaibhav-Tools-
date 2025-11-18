const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vaibhav-tools-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Vaibhav Tools Database...');

    // Create default admin user
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = {
      email: 'admin@vaibhavtools.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Check if admin user already exists
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', adminUser.email).get();
    
    if (snapshot.empty) {
      await usersRef.add(adminUser);
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@vaibhavtools.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Initialize sample products
    const sampleProducts = [
      {
        name: "Professional Drill Machine",
        description: "High-performance electric drill with variable speed control",
        price: 299.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Machine",
        rating: 4.8,
        category: "Power & Hand Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: "Industrial Grinder",
        description: "Heavy-duty grinder for professional metalwork",
        price: 199.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Grinder",
        rating: 4.7,
        category: "Power & Hand Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: "Professional Paint Gun",
        description: "High-quality paint gun for automotive and industrial use",
        price: 129.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Paint+Gun",
        rating: 4.7,
        category: "Painting & Air Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: "Professional Screwdriver Set",
        description: "Complete screwdriver set with magnetic tips",
        price: 45.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Screwdriver+Set",
        rating: 4.8,
        category: "Fastening & Cutting Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: "Digital Measuring Well",
        description: "Precision digital measuring tool for accurate readings",
        price: 159.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Measuring+Well",
        rating: 4.8,
        category: "Safety & Measurement",
        badge: "Limited Stock",
        badgeColor: "bg-red-500",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    const productsRef = db.collection('products');
    const productsSnapshot = await productsRef.get();
    
    if (productsSnapshot.empty) {
      for (const product of sampleProducts) {
        await productsRef.add(product);
      }
      console.log('✅ Sample products created');
    } else {
      console.log('ℹ️  Products already exist');
    }

    // Create Firestore indexes (if needed)
    console.log('📊 Setting up database indexes...');
    
    // Note: Firestore indexes are created automatically when queries are first run
    // This is just a placeholder for manual index creation if needed
    
    console.log('✅ Database initialization completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start the backend server: node server.js');
    console.log('2. Start the frontend: npm start');
    console.log('3. Access admin panel: http://localhost:3000/admin/login');
    console.log('4. Login with: admin@vaibhavtools.com / admin123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase().then(() => {
  console.log('\n🎉 Setup complete!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
}); 