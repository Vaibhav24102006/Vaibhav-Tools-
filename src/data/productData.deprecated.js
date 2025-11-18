// Enhanced product data structure with categories and brands
export const CATEGORIES = [
  {
    id: 'drill-machines',
    name: 'Drill Machines',
    description: 'Professional drilling equipment for all applications',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'grinders',
    name: 'Grinders',
    description: 'Heavy-duty grinding tools for metalwork',
    icon: '⚙️',
    image: 'https://images.unsplash.com/photo-1631631480669-53ab372c5577?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'paint-guns',
    name: 'Paint Guns',
    description: 'Professional painting and spray equipment',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'wrenches',
    name: 'Wrenches',
    description: 'Complete wrench sets for mechanical work',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'screwdriver-sets',
    name: 'Screwdriver Sets',
    description: 'Professional screwdriver collections',
    icon: '🪛',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'spanners',
    name: 'Spanners',
    description: 'Precision spanner tools for mechanical work',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'marble-cutters',
    name: 'Marble Cutters',
    description: 'Specialized cutting tools for stone and marble',
    icon: '✂️',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'jigsaws',
    name: 'Jigsaws',
    description: 'Precision cutting tools for curved and intricate cuts',
    icon: '🪚',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'socket-sets',
    name: 'Socket Sets',
    description: 'Complete socket collections for mechanical work',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'pliers',
    name: 'Pliers',
    description: 'Versatile gripping and cutting tools',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=300&fit=crop&crop=center'
  }
];

export const BRANDS = {
  'drill-machines': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      logo: 'https://cdn.worldvectorlogo.com/logos/bosch.svg',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment']
    },
    {
      id: 'dong-cheng',
      name: 'Dong Cheng',
      description: 'Reliable Chinese manufacturing',
      logo: 'https://via.placeholder.com/100x50/1a1a1a/ffffff?text=DC',
      established: '1995',
      specialties: ['Affordable Tools', 'Home Use']
    }
  ],
  'grinders': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      logo: 'https://cdn.worldvectorlogo.com/logos/bosch.svg',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment']
    }
  ],
  'paint-guns': [
    {
      id: 'pilot',
      name: 'Pilot',
      description: 'Precision spray systems',
      logo: 'https://via.placeholder.com/100x50/0066cc/ffffff?text=PILOT',
      established: '1975',
      specialties: ['Automotive', 'Industrial Coating']
    },
    {
      id: 'painter',
      name: 'Painter',
      description: 'Professional painting solutions',
      logo: 'https://via.placeholder.com/100x50/cc0066/ffffff?text=PAINTER',
      established: '1980',
      specialties: ['Interior Design', 'Commercial Painting']
    },
    {
      id: 'ingco',
      name: 'Ingco',
      description: 'Affordable painting tools',
      logo: 'https://via.placeholder.com/100x50/ff3300/ffffff?text=INGCO',
      established: '2007',
      specialties: ['Budget Tools', 'DIY Projects']
    }
  ],
  'wrenches': [
    {
      id: 'tata-agrico',
      name: 'TATA AGRICO',
      description: 'Professional agricultural tools',
      logo: 'https://via.placeholder.com/100x50/cc0000/ffffff?text=TATA',
      established: '1960',
      specialties: ['Agricultural Tools', 'Professional Grade']
    },
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      logo: 'https://via.placeholder.com/100x50/ffcc00/000000?text=TAPARIA',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality']
    }
  ],
  'screwdriver-sets': [
    {
      id: 'spartan',
      name: 'SPARTAN',
      description: 'Professional tool solutions',
      logo: 'https://via.placeholder.com/100x50/0066cc/ffffff?text=SPARTAN',
      established: '1985',
      specialties: ['Professional Tools', 'Complete Sets']
    },
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      logo: 'https://via.placeholder.com/100x50/ffcc00/000000?text=TAPARIA',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality']
    }
  ],
  'spanners': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      logo: 'https://via.placeholder.com/100x50/ffcc00/000000?text=TAPARIA',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality']
    }
  ],
  'marble-cutters': [
    {
      id: 'ibell',
      name: 'IBELL',
      description: 'Professional cutting tools',
      logo: 'https://via.placeholder.com/100x50/ff6600/ffffff?text=IBELL',
      established: '1990',
      specialties: ['Cutting Tools', 'Professional Grade']
    }
  ],
  'jigsaws': [
    {
      id: 'bosch',
      name: 'Bosch',
      description: 'German precision engineering',
      logo: 'https://cdn.worldvectorlogo.com/logos/bosch.svg',
      established: '1886',
      specialties: ['Power Tools', 'Professional Equipment']
    }
  ],
  'socket-sets': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      logo: 'https://via.placeholder.com/100x50/ffcc00/000000?text=TAPARIA',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality']
    }
  ],
  'pliers': [
    {
      id: 'taparia',
      name: 'Taparia',
      description: 'Trusted Indian tool manufacturer',
      logo: 'https://via.placeholder.com/100x50/ffcc00/000000?text=TAPARIA',
      established: '1975',
      specialties: ['Hand Tools', 'Professional Quality']
    }
  ]
};

// Enhanced product data with brand information and Amazon links
export const PRODUCTS = [
  // Grinders - Bosch
  {
    id: 1,
    name: "BOSCH Professional GWS 600 Angle Grinder",
    brand: 'bosch',
    category: 'grinders',
    description: "670W Power | No-load Speed of 11000 RPM | Versatile Cutting and Grinding Tool | M10 Grinding Spindle Thread | 100 mm Disc | 1 Year Warranty",
    shortDescription: "Professional angle grinder with 670W power and 11000 RPM",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1631631480669-53ab372c5577?w=400&h=400&fit=crop&crop=center",
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
    deliveryTime: "2-3 days"
  },

  // Wrenches - TATA AGRICO
  {
    id: 2,
    name: "TATA AGRICO 10\" Adjustable Wrench",
    brand: 'tata-agrico',
    category: 'wrenches',
    description: "Adjustable Spanner With Lasered Scale | Professional & Home Use Plumbing Tools | Black, Pack of 1",
    shortDescription: "Professional adjustable wrench with lasered scale",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 89,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["10\" Size", "Lasered Scale", "Professional Grade", "Black Finish"],
    inStock: true,
    stockCount: 45,
    amazonUrl: "https://amzn.in/d/dcvyP0t",
    warranty: "1 year",
    deliveryTime: "3-4 days"
  },

  // Wrenches - Taparia
  {
    id: 3,
    name: "Taparia Stillson Type Pipe Wrench 10-Inch",
    brand: 'taparia',
    category: 'wrenches',
    description: "Professional pipe wrench for plumbing applications",
    shortDescription: "Professional pipe wrench for plumbing work",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 234,
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    features: ["10-Inch Size", "Stillson Type", "Professional Grade", "Pipe Grip"],
    inStock: true,
    stockCount: 32,
    amazonUrl: "https://amzn.in/d/2FvONXj",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Screwdriver Sets - SPARTAN
  {
    id: 4,
    name: "SPARTAN BS-02 8-in-1 Pc Screw Driver Kit",
    brand: 'spartan',
    category: 'screwdriver-sets',
    description: "3 Flat Blades, 3 Phillips Head, 1 Round Poker Bar, Extension Rod | Multicolor",
    shortDescription: "Complete 8-piece screwdriver kit with extension rod",
    price: 149.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 127,
    badge: "Complete Kit",
    badgeColor: "bg-green-500",
    features: ["8 Pieces", "3 Flat Blades", "3 Phillips Head", "Extension Rod"],
    inStock: true,
    stockCount: 28,
    amazonUrl: "https://amzn.in/d/97Pud5Q",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Screwdriver Sets - Taparia
  {
    id: 5,
    name: "TAPARIA Screw Driver Set with Bulb - 840",
    brand: 'taparia',
    category: 'screwdriver-sets',
    description: "Professional screwdriver set with neon bulb testing feature",
    shortDescription: "Screwdriver set with built-in bulb tester",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 156,
    badge: "With Bulb",
    badgeColor: "bg-orange-500",
    features: ["Neon Bulb", "Silver and Green", "Professional Grade", "Electrical Testing"],
    inStock: true,
    stockCount: 38,
    amazonUrl: "https://amzn.in/d/6zt8SHx",
    warranty: "1 year",
    deliveryTime: "3-4 days"
  },

  // Spanners - Taparia
  {
    id: 6,
    name: "Taparia L Spanner – 19mm",
    brand: 'taparia',
    category: 'spanners',
    description: "Suitable for Cars and Other Bolting Applications",
    shortDescription: "19mm L-shaped spanner for automotive use",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 98,
    badge: "Automotive",
    badgeColor: "bg-blue-500",
    features: ["19mm Size", "L-Shaped", "Automotive Grade", "Professional Use"],
    inStock: true,
    stockCount: 42,
    amazonUrl: "https://amzn.in/d/e27GIzY",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Marble Cutters - IBELL
  {
    id: 7,
    name: "IBELL Marble Cutter MC10-30",
    brand: 'ibell',
    category: 'marble-cutters',
    description: "1050W, Copper Armature, 13800 RPM, Wheel dia 110 mm, Cutting Depth 34mm (Red)",
    shortDescription: "Professional marble cutter with 1050W power",
    price: 189.99,
    originalPrice: 229.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
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
    deliveryTime: "2-3 days"
  },

  // Jigsaws - Bosch
  {
    id: 8,
    name: "Bosch GST 650 Electric Jigsaw",
    brand: 'bosch',
    category: 'jigsaws',
    description: "450W, Adjustable Stroke Rate, Lightweight 1.9 kg + Blade & Key",
    shortDescription: "Professional electric jigsaw with adjustable stroke rate",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=center",
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
    deliveryTime: "2-3 days"
  },

  // Spanners - Taparia
  {
    id: 9,
    name: "Taparia DEP-08 Double Ended Spanner Set",
    brand: 'taparia',
    category: 'spanners',
    description: "Professional double-ended spanner set for various applications",
    shortDescription: "Complete double-ended spanner set",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 76,
    badge: "Complete Set",
    badgeColor: "bg-green-500",
    features: ["Double Ended", "Professional Grade", "Complete Set", "Various Sizes"],
    inStock: true,
    stockCount: 35,
    amazonUrl: "https://amzn.in/d/eXBTjni",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Wrenches - Taparia
  {
    id: 10,
    name: "TAPARIA 1172-10 Adjustable Spanner, Wrench",
    brand: 'taparia',
    category: 'wrenches',
    description: "Professional adjustable spanner with phosphate finish",
    shortDescription: "Adjustable spanner with phosphate finish",
    price: 89.99,
    originalPrice: 109.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 112,
    badge: "Professional",
    badgeColor: "bg-blue-500",
    features: ["Adjustable", "Phosphate Finish", "Professional Grade", "10-inch Size"],
    inStock: true,
    stockCount: 41,
    amazonUrl: "https://amzn.in/d/cRuxkQd",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Spanners - Taparia
  {
    id: 11,
    name: "Taparia 1806 6-Pieces Ring Spanner Set",
    brand: 'taparia',
    category: 'spanners',
    description: "Complete ring spanner set for professional mechanical work",
    shortDescription: "6-piece ring spanner set",
    price: 159.99,
    originalPrice: 189.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 93,
    badge: "Complete Set",
    badgeColor: "bg-green-500",
    features: ["6 Pieces", "Ring Type", "Professional Grade", "Complete Set"],
    inStock: true,
    stockCount: 28,
    amazonUrl: "https://amzn.in/d/d6tuUC9",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Socket Sets - Taparia
  {
    id: 12,
    name: "Taparia Socket Set - BMS-15 MXL",
    brand: 'taparia',
    category: 'socket-sets',
    description: "Complete socket set with 1/2\" Square Drive",
    shortDescription: "Professional socket set with 1/2\" drive",
    price: 199.99,
    originalPrice: 239.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 145,
    badge: "Complete Kit",
    badgeColor: "bg-green-500",
    features: ["1/2\" Square Drive", "Complete Set", "Professional Grade", "MXL Series"],
    inStock: true,
    stockCount: 24,
    amazonUrl: "https://amzn.in/d/fe3ZrDv",
    warranty: "1 year",
    deliveryTime: "2-3 days"
  },

  // Pliers - Taparia
  {
    id: 13,
    name: "TAPARIA Insulated Lineman Combination Cutting Piler 210 MM / 8\"",
    brand: 'taparia',
    category: 'pliers',
    description: "Professional insulated pliers for electrical work (Silver / Orange)",
    shortDescription: "Insulated lineman pliers for electrical work",
    price: 119.99,
    originalPrice: 139.99,
    image: "https://images.unsplash.com/photo-1586953209977-3aa5e86fdfb3?w=400&h=400&fit=crop&crop=center",
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
    deliveryTime: "2-3 days"
  }
];

// Helper functions
export const getCategories = () => CATEGORIES;

export const getBrandsByCategory = (categoryId) => {
  return BRANDS[categoryId] || [];
};

export const getProductsByCategory = (categoryId) => {
  return PRODUCTS.filter(product => product.category === categoryId);
};

export const getProductsByBrand = (categoryId, brandId) => {
  return PRODUCTS.filter(product => 
    product.category === categoryId && product.brand === brandId
  );
};

export const getProductById = (productId) => {
  return PRODUCTS.find(product => product.id === productId);
};

export const getBrandById = (categoryId, brandId) => {
  const brands = BRANDS[categoryId] || [];
  return brands.find(brand => brand.id === brandId);
};

export const getCategoryById = (categoryId) => {
  return CATEGORIES.find(category => category.id === categoryId);
};
