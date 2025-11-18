const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : '/api'; // Use relative URL for proxy in development

class ApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
    this.isBackendAvailable = true;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // API request failed
      
      // Check if it's a network error (backend not running)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.isBackendAvailable = false;
        throw new Error('Backend server is not running. Please start the server with: node server.js');
      }
      
      throw error;
    }
  }

  // Check if backend is available
  async checkBackendHealth() {
    try {
      await this.request('/health');
      this.isBackendAvailable = true;
      return true;
    } catch (error) {
      this.isBackendAvailable = false;
      return false;
    }
  }

  // Authentication
  async adminLogin(email, password) {
    const data = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(data.token);
    return data;
  }

  // Products - Now using Firestore directly
  async getProducts() {
    try {
      // Try backend first
      return await this.request('/products');
    } catch (error) {
      console.warn('Backend not available, using Firestore directly:', error.message);
      // Fallback to direct Firestore access
      const { getProductsFromFirestore } = await import('./firestoreService');
      return await getProductsFromFirestore();
    }
  }

  async addProduct(productData) {
    return await this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return await this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return await this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    try {
      return await this.request('/admin/orders');
    } catch (error) {
      // Using fallback order data
      return [];
    }
  }

  async updateOrderStatus(id, status) {
    return await this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async createOrder(orderData) {
    try {
      return await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      // For demo purposes, simulate successful order creation
      // Simulating order creation
      return {
        id: `demo-${Date.now()}`,
        ...orderData,
        status: 'pending',
        createdAt: new Date()
      };
    }
  }

  // Dashboard
  async getDashboardStats() {
    try {
      return await this.request('/admin/dashboard');
    } catch (error) {
      // Using fallback dashboard stats
      return {
        totalProducts: 21,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
      };
    }
  }

  // Fallback data for when backend is not available
  getFallbackProducts() {
    return [
      // Power & Hand Tools
      {
        id: 1,
        name: "Professional Drill Machine",
        description: "High-performance electric drill with variable speed control and ergonomic design",
        price: 299.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Machine",
        rating: 4.8,
        category: "Power & Hand Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500"
      },
      {
        id: 2,
        name: "Industrial Grinder",
        description: "Heavy-duty grinder for professional metalwork and construction",
        price: 199.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Grinder",
        rating: 4.7,
        category: "Power & Hand Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500"
      },
      {
        id: 3,
        name: "Mini Bench Drill",
        description: "Compact bench drill for precision drilling in small workshops",
        price: 149.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Mini+Bench+Drill",
        rating: 4.6,
        category: "Power & Hand Tools",
        badge: "Limited Stock",
        badgeColor: "bg-red-500"
      },
      {
        id: 4,
        name: "Professional Drill Set",
        description: "Complete drill set with multiple bits and accessories",
        price: 89.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Drill+Set",
        rating: 4.8,
        category: "Power & Hand Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500"
      },
      {
        id: 5,
        name: "Circular Saw",
        description: "High-powered circular saw for cutting wood and other materials",
        price: 179.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Circular+Saw",
        rating: 4.7,
        category: "Power & Hand Tools",
        badge: "Popular",
        badgeColor: "bg-blue-500"
      },
      {
        id: 6,
        name: "Marble Cutter",
        description: "Professional marble cutter for precise stone cutting",
        price: 249.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Marble+Cutter",
        rating: 4.6,
        category: "Power & Hand Tools",
        badge: "Specialty Tool",
        badgeColor: "bg-purple-500"
      },
      {
        id: 7,
        name: "Jigsaw",
        description: "Versatile jigsaw for curved and intricate cuts",
        price: 129.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Jigsaw",
        rating: 4.5,
        category: "Power & Hand Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500"
      },
      {
        id: 8,
        name: "Chain Saw",
        description: "Heavy-duty chain saw for professional logging and cutting",
        price: 399.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Chain+Saw",
        rating: 4.8,
        category: "Power & Hand Tools",
        badge: "Professional",
        badgeColor: "bg-orange-500"
      },
      {
        id: 9,
        name: "Router",
        description: "Precision router for woodworking and edge finishing",
        price: 159.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Router",
        rating: 4.6,
        category: "Power & Hand Tools",
        badge: "Craftsman",
        badgeColor: "bg-indigo-500"
      },
      {
        id: 10,
        name: "Mini Bench Grinder",
        description: "Compact bench grinder for small workshop grinding tasks",
        price: 119.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Mini+Bench+Grinder",
        rating: 4.5,
        category: "Power & Hand Tools",
        badge: "Compact",
        badgeColor: "bg-teal-500"
      },
      {
        id: 11,
        name: "Electric Planner",
        description: "Professional electric planner for wood surface preparation",
        price: 189.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Electric+Planner",
        rating: 4.7,
        category: "Power & Hand Tools",
        badge: "Professional",
        badgeColor: "bg-orange-500"
      },

      // Painting & Air Tools
      {
        id: 12,
        name: "Professional Paint Gun",
        description: "High-quality paint gun for automotive and industrial use",
        price: 129.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Paint+Gun",
        rating: 4.7,
        category: "Painting & Air Tools",
        badge: "New Arrival",
        badgeColor: "bg-green-500"
      },
      {
        id: 13,
        name: "Electric Spray Gun",
        description: "Electric spray gun for efficient paint application",
        price: 89.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Spray+Gun",
        rating: 4.6,
        category: "Painting & Air Tools",
        badge: "Popular",
        badgeColor: "bg-blue-500"
      },
      {
        id: 14,
        name: "Industrial Blower",
        description: "High-powered blower for cleaning and drying applications",
        price: 79.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Blower",
        rating: 4.5,
        category: "Painting & Air Tools",
        badge: "Industrial",
        badgeColor: "bg-gray-500"
      },
      {
        id: 15,
        name: "Electric Blower",
        description: "Electric blower for workshop and construction site cleaning",
        price: 69.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Electric+Blower",
        rating: 4.4,
        category: "Painting & Air Tools",
        badge: "Essential",
        badgeColor: "bg-green-500"
      },
      {
        id: 16,
        name: "Heat Gun",
        description: "Professional heat gun for paint stripping and heat applications",
        price: 99.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Heat+Gun",
        rating: 4.6,
        category: "Painting & Air Tools",
        badge: "Versatile",
        badgeColor: "bg-purple-500"
      },

      // Fastening & Cutting Tools
      {
        id: 17,
        name: "Professional Screwdriver Set",
        description: "Complete screwdriver set with magnetic tips and ergonomic handles",
        price: 45.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Screwdriver+Set",
        rating: 4.8,
        category: "Fastening & Cutting Tools",
        badge: "Best Seller",
        badgeColor: "bg-yellow-500"
      },
      {
        id: 18,
        name: "Heavy Duty Wrench Kit",
        description: "Comprehensive wrench kit for professional mechanical work",
        price: 129.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Wrench+Kit",
        rating: 4.7,
        category: "Fastening & Cutting Tools",
        badge: "Professional",
        badgeColor: "bg-orange-500"
      },
      {
        id: 19,
        name: "Cutting Equipment Set",
        description: "Complete cutting equipment set for various materials",
        price: 199.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Cutting+Set",
        rating: 4.6,
        category: "Fastening & Cutting Tools",
        badge: "Complete Kit",
        badgeColor: "bg-blue-500"
      },

      // Safety & Measurement
      {
        id: 20,
        name: "Professional Locks",
        description: "High-security locks for industrial and commercial applications",
        price: 89.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Professional+Locks",
        rating: 4.7,
        category: "Safety & Measurement",
        badge: "Security",
        badgeColor: "bg-red-500"
      },
      {
        id: 21,
        name: "Digital Measuring Well",
        description: "Precision digital measuring tool for accurate readings and calibration",
        price: 159.99,
        image: "https://placehold.co/400x300/1A1A1A/FFFFFF?text=Measuring+Well",
        rating: 4.8,
        category: "Safety & Measurement",
        badge: "Limited Stock",
        badgeColor: "bg-red-500"
      }
    ];
  }
}

export default new ApiService(); 