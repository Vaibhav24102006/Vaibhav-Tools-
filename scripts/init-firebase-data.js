const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGccnDx00tBfc4SjLUX0seN8LcVZvp4Lo",
  authDomain: "vaibhavtools-70e4f.firebaseapp.com",
  projectId: "vaibhavtools-70e4f",
  storageBucket: "vaibhavtools-70e4f.appspot.com",
  messagingSenderId: "842533829975",
  appId: "1:842533829975:web:8333eda265d53203c4d212",
  measurementId: "G-ZH9HEZ0G2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample product data
const sampleProducts = [
  // Power & Hand Tools
  {
    name: "Professional Drill Machine",
    description: "High-performance electric drill with variable speed control and ergonomic design. Perfect for professional use in construction and woodworking.",
    shortDescription: "Professional electric drill with variable speed control",
    price: 299.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Machine",
    rating: 4.8,
    category: "Power & Hand Tools",
    brand: "Bosch",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    stock: 50,
    specifications: {
      power: "800W",
      speed: "0-3000 RPM",
      weight: "2.5 kg",
      warranty: "2 years"
    },
    features: [
      "Variable speed control",
      "Ergonomic design",
      "Quick-change chuck",
      "LED work light"
    ]
  },
  {
    name: "Industrial Grinder",
    description: "Heavy-duty grinder for professional metalwork and construction. Features powerful motor and durable construction for extended use.",
    shortDescription: "Heavy-duty grinder for professional metalwork",
    price: 199.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Grinder",
    rating: 4.7,
    category: "Power & Hand Tools",
    brand: "Makita",
    badge: "New Arrival",
    badgeColor: "bg-green-500",
    stock: 30,
    specifications: {
      power: "1100W",
      speed: "11000 RPM",
      weight: "1.8 kg",
      warranty: "3 years"
    },
    features: [
      "Powerful motor",
      "Durable construction",
      "Safety guard",
      "Anti-vibration handle"
    ]
  },
  {
    name: "Mini Bench Drill",
    description: "Compact bench drill for precision drilling in small workshops. Ideal for hobbyists and small-scale projects.",
    shortDescription: "Compact bench drill for precision drilling",
    price: 149.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Mini+Bench+Drill",
    rating: 4.6,
    category: "Power & Hand Tools",
    brand: "DeWalt",
    stock: 25,
    specifications: {
      power: "350W",
      speed: "0-2500 RPM",
      weight: "15 kg",
      warranty: "1 year"
    },
    features: [
      "Compact design",
      "Variable speed",
      "Depth stop",
      "LED work light"
    ]
  },

  // Measuring & Precision Tools
  {
    name: "Digital Caliper",
    description: "High-precision digital caliper with LCD display. Perfect for accurate measurements in engineering and manufacturing.",
    shortDescription: "High-precision digital caliper with LCD display",
    price: 89.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Digital+Caliper",
    rating: 4.9,
    category: "Measuring & Precision Tools",
    brand: "Mitutoyo",
    badge: "Premium",
    badgeColor: "bg-purple-500",
    stock: 100,
    specifications: {
      range: "0-150mm",
      accuracy: "±0.02mm",
      resolution: "0.01mm",
      battery: "CR2032"
    },
    features: [
      "Digital LCD display",
      "High accuracy",
      "Data output",
      "Auto power off"
    ]
  },
  {
    name: "Laser Level",
    description: "Professional laser level for construction and alignment work. Features self-leveling and multiple beam options.",
    shortDescription: "Professional laser level for construction",
    price: 179.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Laser+Level",
    rating: 4.7,
    category: "Measuring & Precision Tools",
    brand: "Hilti",
    stock: 40,
    specifications: {
      range: "30m",
      accuracy: "±0.2mm/m",
      battery: "4xAA",
      runtime: "8 hours"
    },
    features: [
      "Self-leveling",
      "Multiple beams",
      "Durable construction",
      "Magnetic mount"
    ]
  },

  // Safety Equipment
  {
    name: "Safety Helmet",
    description: "Industrial safety helmet with adjustable headband and ventilation. Meets international safety standards.",
    shortDescription: "Industrial safety helmet with ventilation",
    price: 45.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Safety+Helmet",
    rating: 4.5,
    category: "Safety Equipment",
    brand: "3M",
    stock: 200,
    specifications: {
      material: "ABS",
      weight: "400g",
      standard: "EN 397",
      color: "Yellow"
    },
    features: [
      "Adjustable headband",
      "Ventilation holes",
      "UV resistant",
      "Lightweight"
    ]
  },
  {
    name: "Safety Gloves",
    description: "Cut-resistant safety gloves for industrial use. Provides protection while maintaining dexterity.",
    shortDescription: "Cut-resistant safety gloves for industrial use",
    price: 29.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Safety+Gloves",
    rating: 4.4,
    category: "Safety Equipment",
    brand: "Ansell",
    stock: 150,
    specifications: {
      material: "Kevlar",
      size: "L",
      protection: "Level 5",
      grip: "Enhanced"
    },
    features: [
      "Cut resistant",
      "Enhanced grip",
      "Breathable",
      "Machine washable"
    ]
  },

  // Welding Equipment
  {
    name: "MIG Welder",
    description: "Professional MIG welder with digital controls and multiple welding modes. Suitable for various materials.",
    shortDescription: "Professional MIG welder with digital controls",
    price: 899.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=MIG+Welder",
    rating: 4.8,
    category: "Welding Equipment",
    brand: "Lincoln Electric",
    badge: "Professional",
    badgeColor: "bg-blue-500",
    stock: 15,
    specifications: {
      power: "200A",
      voltage: "220V",
      duty: "60%",
      weight: "25 kg"
    },
    features: [
      "Digital controls",
      "Multiple modes",
      "Thermal protection",
      "Wire feed control"
    ]
  },
  {
    name: "Welding Helmet",
    description: "Auto-darkening welding helmet with adjustable sensitivity and delay settings. Provides optimal eye protection.",
    shortDescription: "Auto-darkening welding helmet",
    price: 129.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Welding+Helmet",
    rating: 4.6,
    category: "Welding Equipment",
    brand: "Miller",
    stock: 60,
    specifications: {
      shade: "4-13",
      sensitivity: "Adjustable",
      delay: "0.1-1.0s",
      battery: "Solar + Lithium"
    },
    features: [
      "Auto-darkening",
      "Adjustable sensitivity",
      "Lightweight",
      "Comfortable fit"
    ]
  },

  // Plumbing Tools
  {
    name: "Pipe Wrench",
    description: "Heavy-duty pipe wrench for plumbing and industrial applications. Features adjustable jaw and durable construction.",
    shortDescription: "Heavy-duty pipe wrench for plumbing",
    price: 79.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Pipe+Wrench",
    rating: 4.3,
    category: "Plumbing Tools",
    brand: "Ridgid",
    stock: 80,
    specifications: {
      size: "14 inch",
      material: "Cast iron",
      weight: "2.2 kg",
      jaw: "Adjustable"
    },
    features: [
      "Adjustable jaw",
      "Durable construction",
      "Non-slip grip",
      "Heavy duty"
    ]
  },
  {
    name: "Pipe Cutter",
    description: "Precision pipe cutter for clean cuts on various pipe materials. Includes replacement cutting wheels.",
    shortDescription: "Precision pipe cutter for clean cuts",
    price: 34.99,
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Pipe+Cutter",
    rating: 4.2,
    category: "Plumbing Tools",
    brand: "Rothenberger",
    stock: 120,
    specifications: {
      capacity: "3-35mm",
      material: "Steel",
      weight: "0.5 kg",
      wheels: "Included"
    },
    features: [
      "Clean cuts",
      "Adjustable",
      "Replacement wheels",
      "Compact design"
    ]
  }
];

// Categories data
const categories = [
  {
    id: "power-hand-tools",
    name: "Power & Hand Tools",
    description: "Professional power tools and hand tools for construction and woodworking",
    icon: "🔨",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Power+Tools"
  },
  {
    id: "measuring-precision",
    name: "Measuring & Precision Tools",
    description: "High-precision measuring instruments and calibration tools",
    icon: "📏",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Measuring+Tools"
  },
  {
    id: "safety-equipment",
    name: "Safety Equipment",
    description: "Personal protective equipment and safety gear",
    icon: "🛡️",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Safety+Equipment"
  },
  {
    id: "welding-equipment",
    name: "Welding Equipment",
    description: "Professional welding machines and accessories",
    icon: "🔥",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Welding+Equipment"
  },
  {
    id: "plumbing-tools",
    name: "Plumbing Tools",
    description: "Specialized tools for plumbing and pipe work",
    icon: "🔧",
    image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Plumbing+Tools"
  }
];

// Brands data
const brands = [
  {
    id: "bosch",
    name: "Bosch",
    description: "German engineering excellence in power tools",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Bosch"
  },
  {
    id: "makita",
    name: "Makita",
    description: "Japanese precision and reliability",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Makita"
  },
  {
    id: "dewalt",
    name: "DeWalt",
    description: "American toughness and durability",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=DeWalt"
  },
  {
    id: "mitutoyo",
    name: "Mitutoyo",
    description: "World leader in precision measurement",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Mitutoyo"
  },
  {
    id: "hilti",
    name: "Hilti",
    description: "Professional construction solutions",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Hilti"
  },
  {
    id: "3m",
    name: "3M",
    description: "Innovation in safety and protection",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=3M"
  },
  {
    id: "ansell",
    name: "Ansell",
    description: "Protection solutions for professionals",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Ansell"
  },
  {
    id: "lincoln-electric",
    name: "Lincoln Electric",
    description: "Welding technology and innovation",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Lincoln+Electric"
  },
  {
    id: "miller",
    name: "Miller",
    description: "Professional welding equipment",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Miller"
  },
  {
    id: "ridgid",
    name: "Ridgid",
    description: "Professional plumbing tools",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Ridgid"
  },
  {
    id: "rothenberger",
    name: "Rothenberger",
    description: "Precision pipe tools and equipment",
    logo: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Rothenberger"
  }
];

// Initialize Firebase data
async function initializeFirebaseData() {
  try {
    console.log('🚀 Starting Firebase data initialization...');

    // Add categories
    console.log('📁 Adding categories...');
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ Added ${categories.length} categories`);

    // Add brands
    console.log('🏷️ Adding brands...');
    for (const brand of brands) {
      await setDoc(doc(db, 'brands', brand.id), {
        ...brand,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ Added ${brands.length} brands`);

    // Add products
    console.log('🛠️ Adding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ Added ${sampleProducts.length} products`);

    // Create admin user profile
    console.log('👤 Creating admin profile...');
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      email: 'admin@vaibhavtools.com',
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created admin profile');

    console.log('🎉 Firebase data initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Products: ${sampleProducts.length}`);
    console.log(`   - Admin profile: Created`);

  } catch (error) {
    console.error('❌ Error initializing Firebase data:', error);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeFirebaseData()
    .then(() => {
      console.log('\n✨ All done! You can now start using the application.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeFirebaseData, sampleProducts, categories, brands }; 