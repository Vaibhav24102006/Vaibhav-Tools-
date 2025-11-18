import { db } from '../firebase';
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

// Enhanced product categories
const CATEGORIES = [
  {
    id: 'drill-machines',
    name: 'Drill Machines',
    description: 'Professional drilling equipment for all applications',
    icon: '🔧',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'grinders',
    name: 'Grinders',
    description: 'Heavy-duty grinding tools for metalwork',
    icon: '⚙️',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'paint-guns',
    name: 'Paint Guns',
    description: 'Professional painting and spray equipment',
    icon: '🎨',
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'wrenches',
    name: 'Wrenches',
    description: 'Complete wrench sets for mechanical work',
    icon: '🔧',
    sortOrder: 4,
    isActive: true
  },
  {
    id: 'screwdriver-sets',
    name: 'Screwdriver Sets',
    description: 'Professional screwdriver collections',
    icon: '🪛',
    sortOrder: 5,
    isActive: true
  },
  {
    id: 'spanners',
    name: 'Spanners',
    description: 'Precision spanner tools for mechanical work',
    icon: '🔧',
    sortOrder: 6,
    isActive: true
  },
  {
    id: 'marble-cutters',
    name: 'Marble Cutters',
    description: 'Specialized cutting tools for stone and marble',
    icon: '✂️',
    sortOrder: 7,
    isActive: true
  },
  {
    id: 'jigsaws',
    name: 'Jigsaws',
    description: 'Precision cutting tools for curved and intricate cuts',
    icon: '🪚',
    sortOrder: 8,
    isActive: true
  },
  {
    id: 'socket-sets',
    name: 'Socket Sets',
    description: 'Complete socket collections for mechanical work',
    icon: '🔧',
    sortOrder: 9,
    isActive: true
  },
  {
    id: 'pliers',
    name: 'Pliers',
    description: 'Versatile gripping and cutting tools',
    icon: '🔧',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'blowers',
    name: 'Blowers',
    description: 'Electric and air blowers for cleaning and drying',
    icon: '💨',
    sortOrder: 11,
    isActive: true
  },
  {
    id: 'chainsaws',
    name: 'Chain Saws',
    description: 'Heavy-duty chain saws for professional cutting',
    icon: '🪚',
    sortOrder: 12,
    isActive: true
  }
];

// Brand information by category
const BRANDS = {
  'drill-machines': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      country: 'Germany',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment'],
      isActive: true
    },
    {
      id: 'dong-cheng',
      name: 'Dong Cheng',
      description: 'Reliable Chinese manufacturing',
      country: 'China',
      established: '1995',
      specialties: ['Affordable Tools', 'Home Use'],
      isActive: true
    }
  ],
  'grinders': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      country: 'Germany',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment'],
      isActive: true
    }
  ],
  'paint-guns': [
    {
      id: 'pilot',
      name: 'Pilot',
      description: 'Precision spray systems',
      country: 'India',
      established: '1975',
      specialties: ['Automotive', 'Industrial Coating'],
      isActive: true
    },
    {
      id: 'painter',
      name: 'Painter',
      description: 'Professional painting solutions',
      country: 'India',
      established: '1980',
      specialties: ['Interior Design', 'Commercial Painting'],
      isActive: true
    },
    {
      id: 'ingco',
      name: 'Ingco',
      description: 'Affordable painting tools',
      country: 'China',
      established: '2007',
      specialties: ['Budget Tools', 'DIY Projects'],
      isActive: true
    }
  ],
  'wrenches': [
    {
      id: 'tata-agrico',
      name: 'TATA AGRICO',
      description: 'Professional agricultural tools',
      country: 'India',
      established: '1960',
      specialties: ['Agricultural Tools', 'Professional Grade'],
      isActive: true
    },
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      country: 'India',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality'],
      isActive: true
    }
  ],
  'screwdriver-sets': [
    {
      id: 'spartan',
      name: 'SPARTAN',
      description: 'Professional tool solutions',
      country: 'India',
      established: '1985',
      specialties: ['Professional Tools', 'Complete Sets'],
      isActive: true
    },
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      country: 'India',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality'],
      isActive: true
    }
  ],
  'spanners': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      country: 'India',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality'],
      isActive: true
    }
  ],
  'marble-cutters': [
    {
      id: 'ibell',
      name: 'IBELL',
      description: 'Professional cutting tools',
      country: 'India',
      established: '1990',
      specialties: ['Cutting Tools', 'Professional Grade'],
      isActive: true
    }
  ],
  'jigsaws': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      country: 'Germany',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment'],
      isActive: true
    }
  ],
  'socket-sets': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      country: 'India',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality'],
      isActive: true
    }
  ],
  'pliers': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      country: 'India',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality'],
      isActive: true
    }
  ],
  'blowers': [
    {
      id: 'ingco',
      name: 'Ingco',
      description: 'Affordable power tools',
      country: 'China',
      established: '2007',
      specialties: ['Budget Tools', 'DIY Projects'],
      isActive: true
    }
  ],
  'chainsaws': [
    {
      id: 'husqvarna',
      name: 'Husqvarna',
      description: 'Swedish cutting technology',
      country: 'Sweden',
      established: '1689',
      specialties: ['Chain Saws', 'Outdoor Equipment'],
      isActive: true
    }
  ]
};

// Comprehensive product catalog
const PRODUCTS = [
  // Grinders - Bosch
  {
    name: "BOSCH Professional GWS 600 Angle Grinder",
    brand: 'bosch',
    category: 'grinders',
    description: "670W Power | No-load Speed of 11000 RPM | Versatile Cutting and Grinding Tool | M10 Grinding Spindle Thread | 100 mm Disc | 1 Year Warranty",
    shortDescription: "Professional angle grinder with 670W power and 11000 RPM",
    price: 249.99,
    originalPrice: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1631631480669-53ab372c5577?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 156,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["670W Motor", "11000 RPM", "100mm Disc", "M10 Spindle Thread"],
    specifications: {
      power: "670W",
      noLoadSpeed: "11000 RPM",
      discSize: "100mm",
      spindleThread: "M10"
    },
    inStock: true,
    stockCount: 25,
    amazonUrl: "https://amzn.in/d/dKNtkCB",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["grinder", "angle grinder", "bosch", "professional"],
    weight: "1.8kg",
    dimensions: "32 x 12 x 11 cm"
  },

  // Wrenches - TATA AGRICO
  {
    name: "TATA AGRICO 10\" Adjustable Wrench",
    brand: 'tata-agrico',
    category: 'wrenches',
    description: "Adjustable Spanner With Lasered Scale | Professional & Home Use Plumbing Tools | Black, Pack of 1",
    shortDescription: "Professional adjustable wrench with lasered scale",
    price: 89.99,
    originalPrice: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 89,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["10\" Size", "Lasered Scale", "Professional Grade", "Black Finish"],
    inStock: true,
    stockCount: 45,
    amazonUrl: "https://amzn.in/d/dcvyP0t",
    warranty: "1 year",
    deliveryTime: "3-4 days",
    availability: "In Stock",
    tags: ["wrench", "adjustable", "tata agrico", "plumbing"],
    weight: "0.5kg",
    dimensions: "25 x 5 x 2 cm"
  },

  // Wrenches - Taparia
  {
    name: "Taparia Stillson Type Pipe Wrench 10-Inch",
    brand: 'taparia',
    category: 'wrenches',
    description: "Professional pipe wrench for plumbing applications",
    shortDescription: "Professional pipe wrench for plumbing work",
    price: 69.99,
    originalPrice: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 234,
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    features: ["10-Inch Size", "Stillson Type", "Professional Grade", "Pipe Grip"],
    inStock: true,
    stockCount: 32,
    amazonUrl: "https://amzn.in/d/2FvONXj",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["wrench", "pipe wrench", "taparia", "plumbing"],
    weight: "0.6kg",
    dimensions: "26 x 6 x 3 cm"
  },

  // Screwdriver Sets - SPARTAN
  {
    name: "SPARTAN BS-02 8-in-1 Pc Screw Driver Kit",
    brand: 'spartan',
    category: 'screwdriver-sets',
    description: "3 Flat Blades, 3 Phillips Head, 1 Round Poker Bar, Extension Rod | Multicolor",
    shortDescription: "Complete 8-piece screwdriver kit with extension rod",
    price: 149.99,
    originalPrice: 179.99,
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 127,
    badge: "Complete Kit",
    badgeColor: "bg-green-500",
    features: ["8 Pieces", "3 Flat Blades", "3 Phillips Head", "Extension Rod"],
    inStock: true,
    stockCount: 28,
    amazonUrl: "https://amzn.in/d/97Pud5Q",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["screwdriver", "kit", "spartan", "complete set"],
    weight: "0.8kg",
    dimensions: "20 x 15 x 5 cm"
  },

  // Screwdriver Sets - Taparia
  {
    name: "TAPARIA Screw Driver Set with Bulb - 840",
    brand: 'taparia',
    category: 'screwdriver-sets',
    description: "Professional screwdriver set with neon bulb testing feature",
    shortDescription: "Screwdriver set with built-in bulb tester",
    price: 79.99,
    originalPrice: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 156,
    badge: "With Bulb",
    badgeColor: "bg-orange-500",
    features: ["Neon Bulb", "Silver and Green", "Professional Grade", "Electrical Testing"],
    inStock: true,
    stockCount: 38,
    amazonUrl: "https://amzn.in/d/6zt8SHx",
    warranty: "1 year",
    deliveryTime: "3-4 days",
    availability: "In Stock",
    tags: ["screwdriver", "electrical", "taparia", "bulb tester"],
    weight: "0.3kg",
    dimensions: "18 x 8 x 3 cm"
  },

  // Drill Machines - Bosch
  {
    name: "Bosch Professional GSB 550 Impact Drill",
    brand: 'bosch',
    category: 'drill-machines',
    description: "550W impact drill with 13mm keyless chuck, variable speed control",
    shortDescription: "Professional impact drill with 13mm chuck",
    price: 299.99,
    originalPrice: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 189,
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    features: ["550W Motor", "13mm Keyless Chuck", "Variable Speed", "Impact Function"],
    specifications: {
      power: "550W",
      chuckSize: "13mm",
      noLoadSpeed: "0-3000 rpm",
      impactRate: "0-48000 bpm"
    },
    inStock: true,
    stockCount: 35,
    amazonUrl: "https://amazon.com/dp/B08X6G3K2P",
    warranty: "2 years",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["drill", "impact drill", "bosch", "professional"],
    weight: "1.8kg",
    dimensions: "28 x 8 x 22 cm"
  },

  // Drill Machines - Dong Cheng
  {
    name: "Dong Cheng DJZ02-13 Impact Drill",
    brand: 'dong-cheng',
    category: 'drill-machines',
    description: "Affordable impact drill suitable for home DIY projects",
    shortDescription: "Budget-friendly impact drill for DIY",
    price: 89.99,
    originalPrice: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 234,
    badge: "Value Pick",
    badgeColor: "bg-green-500",
    features: ["450W Motor", "13mm Chuck", "Adjustable Speed", "Lightweight Design"],
    specifications: {
      power: "450W",
      chuckSize: "13mm",
      noLoadSpeed: "0-2800 rpm"
    },
    inStock: true,
    stockCount: 45,
    amazonUrl: "https://amazon.com/dp/B08X6G5M4R",
    warranty: "1 year",
    deliveryTime: "3-4 days",
    availability: "In Stock",
    tags: ["drill", "budget", "dong cheng", "diy"],
    weight: "1.5kg",
    dimensions: "26 x 7 x 20 cm"
  },

  // Paint Guns - Pilot
  {
    name: "Pilot HVLP Spray Gun Pro",
    brand: 'pilot',
    category: 'paint-guns',
    description: "Professional HVLP spray gun for automotive and furniture finishing",
    shortDescription: "Professional HVLP spray gun for precision work",
    price: 249.99,
    originalPrice: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 78,
    badge: "Pro Series",
    badgeColor: "bg-purple-600",
    features: ["HVLP Technology", "1.4mm Nozzle", "Adjustable Pattern", "Easy Cleanup"],
    specifications: {
      type: "HVLP",
      nozzleSize: "1.4mm",
      airPressure: "2-3 bar"
    },
    inStock: true,
    stockCount: 15,
    amazonUrl: "https://amazon.com/dp/B08X6G8P7U",
    warranty: "2 years",
    deliveryTime: "3-4 days",
    availability: "In Stock",
    tags: ["paint gun", "spray gun", "pilot", "hvlp"],
    weight: "0.8kg",
    dimensions: "25 x 15 x 10 cm"
  },

  // Paint Guns - Ingco
  {
    name: "Ingco Electric Spray Gun ESG3518",
    brand: 'ingco',
    category: 'paint-guns',
    description: "Electric spray gun perfect for DIY painting projects",
    shortDescription: "Electric spray gun for DIY painting projects",
    price: 79.99,
    originalPrice: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop&crop=center",
    rating: 4.2,
    reviews: 189,
    badge: "DIY Favorite",
    badgeColor: "bg-green-600",
    features: ["350W Motor", "Electric Operation", "Adjustable Flow", "Easy Assembly"],
    specifications: {
      power: "350W",
      type: "Electric",
      tankCapacity: "800ml"
    },
    inStock: true,
    stockCount: 38,
    amazonUrl: "https://amazon.com/dp/B08X6G9Q8V",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["paint gun", "electric", "ingco", "diy"],
    weight: "1.2kg",
    dimensions: "30 x 20 x 15 cm"
  }

  // Add more products as needed...
];

export const populateFirestoreData = async (onProgress) => {
  try {
    console.log('🔄 Starting Firestore population...');
    onProgress?.('Starting data population...');

    // Clear existing data first (optional - comment out if you want to keep existing data)
    console.log('🗑️ Clearing existing data...');
    onProgress?.('Clearing existing data...');

    // Clear products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const productsBatch = writeBatch(db);
    productsSnapshot.forEach((doc) => {
      productsBatch.delete(doc.ref);
    });
    await productsBatch.commit();

    // Clear categories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categoriesBatch = writeBatch(db);
    categoriesSnapshot.forEach((doc) => {
      categoriesBatch.delete(doc.ref);
    });
    await categoriesBatch.commit();

    // Clear brands
    const brandsSnapshot = await getDocs(collection(db, 'brands'));
    const brandsBatch = writeBatch(db);
    brandsSnapshot.forEach((doc) => {
      brandsBatch.delete(doc.ref);
    });
    await brandsBatch.commit();

    console.log('✅ Existing data cleared');
    onProgress?.('Existing data cleared');

    // Add categories
    console.log('📂 Adding categories...');
    onProgress?.('Adding categories...');
    
    const categoriesBatchAdd = writeBatch(db);
    for (const category of CATEGORIES) {
      const categoryRef = doc(db, 'categories', category.id);
      categoriesBatchAdd.set(categoryRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await categoriesBatchAdd.commit();

    // Add brands
    console.log('🏷️ Adding brands...');
    onProgress?.('Adding brands...');

    const brandsBatchAdd = writeBatch(db);
    for (const [categoryId, brands] of Object.entries(BRANDS)) {
      for (const brand of brands) {
        const brandRef = doc(collection(db, 'brands'));
        brandsBatchAdd.set(brandRef, {
          ...brand,
          categoryId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await brandsBatchAdd.commit();

    // Add products
    console.log('📦 Adding products...');
    onProgress?.('Adding products...');

    const productsBatchAdd = writeBatch(db);
    for (const product of PRODUCTS) {
      const productRef = doc(collection(db, 'products'));
      productsBatchAdd.set(productRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        featured: Math.random() < 0.3,
        views: Math.floor(Math.random() * 1000) + 50,
        salesCount: Math.floor(Math.random() * 100) + 10
      });
    }
    await productsBatchAdd.commit();

    console.log('✅ Successfully populated Firestore!');
    console.log(`Added ${CATEGORIES.length} categories`);
    console.log(`Added ${Object.values(BRANDS).flat().length} brands`);
    console.log(`Added ${PRODUCTS.length} products`);

    onProgress?.('✅ Data population completed successfully!');
    
    return {
      success: true,
      message: `Successfully added ${CATEGORIES.length} categories, ${Object.values(BRANDS).flat().length} brands, and ${PRODUCTS.length} products`
    };

  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
    onProgress?.(`❌ Error: ${error.message}`);
    
    return {
      success: false,
      error: error.message
    };
  }
};

export { CATEGORIES, BRANDS, PRODUCTS };