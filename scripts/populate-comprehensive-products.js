const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Firebase Admin
try {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('💡 Make sure firebase-service-account.json exists in the root directory');
  process.exit(1);
}

const db = admin.firestore();

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
    },
    {
      id: 'makita',
      name: 'Makita',
      description: 'Japanese quality tools',
      country: 'Japan',
      established: '1915',
      specialties: ['Cordless Tools', 'Professional Grade'],
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
    },
    {
      id: 'metabo',
      name: 'Metabo',
      description: 'German grinding specialists',
      country: 'Germany',
      established: '1924',
      specialties: ['Angle Grinders', 'Industrial Tools'],
      isActive: true
    },
    {
      id: 'dewalt',
      name: 'DeWalt',
      description: 'American construction tools',
      country: 'USA',
      established: '1924',
      specialties: ['Construction', 'Heavy Duty'],
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

  // Spanners - Taparia
  {
    name: "Taparia L Spanner – 19mm",
    brand: 'taparia',
    category: 'spanners',
    description: "Suitable for Cars and Other Bolting Applications",
    shortDescription: "19mm L-shaped spanner for automotive use",
    price: 59.99,
    originalPrice: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 98,
    badge: "Automotive",
    badgeColor: "bg-blue-500",
    features: ["19mm Size", "L-Shaped", "Automotive Grade", "Professional Use"],
    inStock: true,
    stockCount: 42,
    amazonUrl: "https://amzn.in/d/e27GIzY",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["spanner", "automotive", "taparia", "19mm"],
    weight: "0.2kg",
    dimensions: "15 x 3 x 1 cm"
  },

  // Marble Cutters - IBELL
  {
    name: "IBELL Marble Cutter MC10-30",
    brand: 'ibell',
    category: 'marble-cutters',
    description: "1050W, Copper Armature, 13800 RPM, Wheel dia 110 mm, Cutting Depth 34mm (Red)",
    shortDescription: "Professional marble cutter with 1050W power",
    price: 189.99,
    originalPrice: 229.99,
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 87,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["1050W Motor", "13800 RPM", "110mm Wheel", "34mm Cutting Depth"],
    specifications: {
      power: "1050W",
      noLoadSpeed: "13800 RPM",
      wheelDiameter: "110mm",
      cuttingDepth: "34mm"
    },
    inStock: true,
    stockCount: 22,
    amazonUrl: "https://amzn.in/d/hOw7iCm",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["marble cutter", "cutting tool", "ibell", "professional"],
    weight: "2.2kg",
    dimensions: "35 x 15 x 12 cm"
  },

  // Jigsaws - Bosch
  {
    name: "Bosch GST 650 Electric Jigsaw",
    brand: 'bosch',
    category: 'jigsaws',
    description: "450W, Adjustable Stroke Rate, Lightweight 1.9 kg + Blade & Key",
    shortDescription: "Professional electric jigsaw with adjustable stroke rate",
    price: 299.99,
    originalPrice: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 134,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["450W Motor", "Adjustable Stroke Rate", "1.9kg Weight", "Includes Blade & Key"],
    specifications: {
      power: "450W",
      weight: "1.9kg",
      strokeRate: "Adjustable"
    },
    inStock: true,
    stockCount: 19,
    amazonUrl: "https://amzn.in/d/dlTm4X7",
    warranty: "2 years",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["jigsaw", "cutting tool", "bosch", "electric"],
    weight: "1.9kg",
    dimensions: "25 x 8 x 20 cm"
  },

  // Spanners - Taparia (Double Ended Set)
  {
    name: "Taparia DEP-08 Double Ended Spanner Set",
    brand: 'taparia',
    category: 'spanners',
    description: "Professional double-ended spanner set for various applications",
    shortDescription: "Complete double-ended spanner set",
    price: 129.99,
    originalPrice: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 76,
    badge: "Complete Set",
    badgeColor: "bg-green-500",
    features: ["Double Ended", "Professional Grade", "Complete Set", "Various Sizes"],
    inStock: true,
    stockCount: 35,
    amazonUrl: "https://amzn.in/d/eXBTjni",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["spanner", "set", "taparia", "double ended"],
    weight: "1.2kg",
    dimensions: "30 x 20 x 4 cm"
  },

  // Wrenches - Taparia (Adjustable)
  {
    name: "TAPARIA 1172-10 Adjustable Spanner, Wrench",
    brand: 'taparia',
    category: 'wrenches',
    description: "Professional adjustable spanner with phosphate finish",
    shortDescription: "Adjustable spanner with phosphate finish",
    price: 89.99,
    originalPrice: 109.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 112,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["Adjustable", "Phosphate Finish", "Professional Grade", "10-inch Size"],
    inStock: true,
    stockCount: 41,
    amazonUrl: "https://amzn.in/d/cRuxkQd",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["wrench", "adjustable", "taparia", "phosphate"],
    weight: "0.6kg",
    dimensions: "25 x 5 x 2 cm"
  },

  // Spanners - Taparia (Ring Set)
  {
    name: "Taparia 1806 6-Pieces Ring Spanner Set",
    brand: 'taparia',
    category: 'spanners',
    description: "Complete ring spanner set for professional mechanical work",
    shortDescription: "6-piece ring spanner set",
    price: 159.99,
    originalPrice: 189.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 93,
    badge: "Complete Set",
    badgeColor: "bg-green-500",
    features: ["6 Pieces", "Ring Type", "Professional Grade", "Complete Set"],
    inStock: true,
    stockCount: 28,
    amazonUrl: "https://amzn.in/d/d6tuUC9",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["spanner", "ring", "taparia", "set"],
    weight: "0.8kg",
    dimensions: "25 x 15 x 3 cm"
  },

  // Socket Sets - Taparia
  {
    name: "Taparia Socket Set - BMS-15 MXL",
    brand: 'taparia',
    category: 'socket-sets',
    description: "Complete socket set with 1/2\" Square Drive",
    shortDescription: "Professional socket set with 1/2\" drive",
    price: 199.99,
    originalPrice: 239.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 145,
    badge: "Complete Kit",
    badgeColor: "bg-green-500",
    features: ["1/2\" Square Drive", "Complete Set", "Professional Grade", "MXL Series"],
    inStock: true,
    stockCount: 24,
    amazonUrl: "https://amzn.in/d/fe3ZrDv",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["socket", "set", "taparia", "1/2 drive"],
    weight: "1.5kg",
    dimensions: "35 x 25 x 8 cm"
  },

  // Pliers - Taparia
  {
    name: "TAPARIA Insulated Lineman Combination Cutting Piler 210 MM / 8\"",
    brand: 'taparia',
    category: 'pliers',
    description: "Professional insulated pliers for electrical work (Silver / Orange)",
    shortDescription: "Insulated lineman pliers for electrical work",
    price: 119.99,
    originalPrice: 139.99,
    imageUrl: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 167,
    badge: "Insulated",
    badgeColor: "bg-orange-500",
    features: ["Insulated", "210mm Length", "Combination Cutting", "Electrical Grade"],
    specifications: {
      length: "210mm",
      type: "Insulated",
      color: "Silver/Orange"
    },
    inStock: true,
    stockCount: 31,
    amazonUrl: "https://amzn.in/d/5U2TlY3",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["pliers", "insulated", "taparia", "electrical"],
    weight: "0.4kg",
    dimensions: "21 x 6 x 2 cm"
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
  },

  // Blowers - Ingco
  {
    name: "Ingco Electric Blower EBL10018",
    brand: 'ingco',
    category: 'blowers',
    description: "1000W electric blower for workshop and construction site cleaning",
    shortDescription: "Electric blower for cleaning and drying applications",
    price: 89.99,
    originalPrice: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 156,
    badge: "Essential",
    badgeColor: "bg-green-500",
    features: ["1000W Motor", "Variable Speed", "Dust Collection", "Lightweight"],
    specifications: {
      power: "1000W",
      airSpeed: "16000 rpm",
      weight: "2.1kg"
    },
    inStock: true,
    stockCount: 42,
    amazonUrl: "https://amazon.com/dp/B08X6GBT2Y",
    warranty: "1 year",
    deliveryTime: "2-3 days",
    availability: "In Stock",
    tags: ["blower", "electric", "ingco", "cleaning"],
    weight: "2.1kg",
    dimensions: "35 x 12 x 25 cm"
  },

  // Chain Saws - Husqvarna
  {
    name: "Husqvarna 120 Mark II Chain Saw",
    brand: 'husqvarna',
    category: 'chainsaws',
    description: "Lightweight chain saw with X-Torq engine for reduced emissions",
    shortDescription: "Lightweight chain saw with X-Torq engine",
    price: 199.99,
    originalPrice: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 145,
    badge: "Eco-Friendly",
    badgeColor: "bg-green-700",
    features: ["X-Torq Engine", "14-inch Bar", "Easy Start", "Low Vibration"],
    specifications: {
      engineType: "X-Torq",
      barLength: "14 inch",
      displacement: "38.2cc"
    },
    inStock: true,
    stockCount: 12,
    amazonUrl: "https://amazon.com/dp/B08X6GBS0X",
    warranty: "2 years",
    deliveryTime: "4-5 days",
    availability: "In Stock",
    tags: ["chainsaw", "husqvarna", "x-torq", "professional"],
    weight: "4.8kg",
    dimensions: "45 x 25 x 30 cm"
  }
];

async function populateComprehensiveProducts() {
  console.log('🔄 Populating comprehensive product catalog...\n');

  try {
    const batch = db.batch();

    // Clear existing data
    console.log('🗑️ Clearing existing product data...');
    
    // Delete existing products
    const existingProducts = await db.collection('products').get();
    existingProducts.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete existing categories
    const existingCategories = await db.collection('categories').get();
    existingCategories.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete existing brands
    const existingBrands = await db.collection('brands').get();
    existingBrands.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('✅ Existing data cleared');

    // Create new batch for insertions
    const insertBatch = db.batch();

    // Add categories
    console.log('📂 Adding product categories...');
    for (const category of CATEGORIES) {
      const categoryRef = db.collection('categories').doc(category.id);
      insertBatch.set(categoryRef, {
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Add brands
    console.log('🏷️ Adding brands...');
    for (const [categoryId, brands] of Object.entries(BRANDS)) {
      for (const brand of brands) {
        const brandRef = db.collection('brands').doc();
        insertBatch.set(brandRef, {
          ...brand,
          categoryId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    // Add products
    console.log('📦 Adding products...');
    for (const product of PRODUCTS) {
      const productRef = db.collection('products').doc();
      insertBatch.set(productRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true,
        featured: Math.random() < 0.3, // Randomly mark some as featured
        views: Math.floor(Math.random() * 1000) + 50,
        salesCount: Math.floor(Math.random() * 100) + 10
      });
    }

    await insertBatch.commit();

    console.log(`✅ Successfully added:`);
    console.log(`   - ${CATEGORIES.length} categories`);
    console.log(`   - ${Object.values(BRANDS).flat().length} brands`);
    console.log(`   - ${PRODUCTS.length} products`);

    // Create search indexes (informational - Firebase creates these automatically)
    console.log('\n📊 Firebase will automatically create search indexes for:');
    console.log('   - products.category');
    console.log('   - products.brand');
    console.log('   - products.inStock');
    console.log('   - products.featured');
    console.log('   - categories.isActive');
    console.log('   - brands.isActive');

    console.log('\n🎉 Comprehensive product catalog populated successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update your React app to use Firestore data');
    console.log('2. Test the product filtering and search functionality');
    console.log('3. Verify all products display correctly');

  } catch (error) {
    console.error('❌ Failed to populate product catalog:', error);
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

populateComprehensiveProducts().then(() => {
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});