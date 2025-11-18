# API Integration Guide for VaibhavTools

## 🚀 Overview

This guide provides comprehensive tips and best practices for integrating APIs within the VaibhavTools e-commerce platform. The project already has a solid foundation with a well-structured API service layer.

## 🏗️ Current API Architecture

### API Service Layer (`src/services/api.js`)

The project uses a centralized API service class that handles:
- Token management
- Request/response handling
- Error handling
- Fallback data for offline scenarios
- Backend health checks

### Key Features:
- **Environment-aware URLs**: Switches between development and production APIs
- **Token-based authentication**: JWT tokens for admin routes
- **Graceful degradation**: Fallback to static data when backend is unavailable
- **Error handling**: Comprehensive error catching and user feedback

## 🛠️ API Integration Best Practices

### 1. **Environment Configuration**

```javascript
// Current implementation in api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : '/api'; // Uses proxy in development
```

**Recommendations:**
- Use environment variables for all API endpoints
- Implement different base URLs for different environments
- Consider API versioning in URLs

```javascript
// Enhanced environment setup
const API_CONFIG = {
  development: {
    baseURL: '/api',
    timeout: 10000,
    retries: 3
  },
  production: {
    baseURL: 'https://api.vaibhavtools.com/v1',
    timeout: 5000,
    retries: 2
  },
  staging: {
    baseURL: 'https://staging-api.vaibhavtools.com/v1',
    timeout: 8000,
    retries: 3
  }
};
```

### 2. **Enhanced Error Handling**

```javascript
// Current error handling can be improved
async request(endpoint, options = {}) {
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Enhanced error handling
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 429:
          this.handleRateLimit();
          break;
        case 500:
          this.handleServerError();
          break;
      }
      
      throw new APIError(errorData.message || 'Request failed', response.status);
    }
    
    return await response.json();
  } catch (error) {
    // Enhanced error logging and handling
    this.logError(error, endpoint, options);
    throw error;
  }
}
```

### 3. **Request Interceptors and Middleware**

```javascript
// Add request interceptors for common functionality
class APIService {
  constructor() {
    this.interceptors = {
      request: [],
      response: []
    };
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async request(endpoint, options = {}) {
    // Apply request interceptors
    let config = { ...options };
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // Make request
    let response = await fetch(url, config);

    // Apply response interceptors
    for (const interceptor of this.interceptors.response) {
      response = await interceptor(response);
    }

    return response;
  }
}
```

### 4. **Caching Strategy**

```javascript
// Implement caching for frequently accessed data
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time to live
  }

  set(key, value, ttlMs = 300000) { // 5 minutes default
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  get(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  isExpired(key) {
    const expiry = this.ttl.get(key);
    return expiry && Date.now() > expiry;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }
}

// Usage in API service
async getProducts() {
  const cacheKey = 'products';
  const cached = this.cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const products = await this.request('/products');
    this.cache.set(cacheKey, products, 300000); // Cache for 5 minutes
    return products;
  } catch (error) {
    return this.getFallbackProducts();
  }
}
```

### 5. **Rate Limiting and Throttling**

```javascript
// Implement client-side rate limiting
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
  }
}
```

### 6. **Retry Logic with Exponential Backoff**

```javascript
// Enhanced retry mechanism
async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await this.request(endpoint, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
}
```

### 7. **Request/Response Transformation**

```javascript
// Add data transformation layers
class DataTransformer {
  static transformProduct(apiProduct) {
    return {
      id: apiProduct.id,
      name: apiProduct.name || apiProduct.title,
      price: parseFloat(apiProduct.price),
      image: apiProduct.image_url || apiProduct.image,
      description: apiProduct.description || '',
      category: apiProduct.category_name || apiProduct.category,
      rating: parseFloat(apiProduct.rating) || 0,
      inStock: apiProduct.stock_quantity > 0,
      badges: this.generateBadges(apiProduct)
    };
  }

  static transformOrder(apiOrder) {
    return {
      id: apiOrder.id,
      items: apiOrder.items.map(item => this.transformOrderItem(item)),
      total: parseFloat(apiOrder.total_amount),
      status: apiOrder.order_status,
      createdAt: new Date(apiOrder.created_at),
      customer: {
        email: apiOrder.customer_email,
        name: apiOrder.customer_name,
        phone: apiOrder.customer_phone
      }
    };
  }
}
```

### 8. **Real-time Updates with WebSockets**

```javascript
// Enhanced WebSocket integration
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    try {
      this.socket = new WebSocket(WS_URL);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.socket.onclose = () => {
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'PRODUCT_UPDATED':
        this.notifyProductUpdate(data.payload);
        break;
      case 'ORDER_STATUS_CHANGED':
        this.notifyOrderUpdate(data.payload);
        break;
      case 'INVENTORY_UPDATE':
        this.notifyInventoryUpdate(data.payload);
        break;
    }
  }
}
```

### 9. **API Documentation and Testing**

```javascript
// Create API documentation objects
const API_DOCS = {
  products: {
    get: {
      endpoint: '/products',
      method: 'GET',
      description: 'Retrieve all products',
      parameters: {
        category: 'string (optional)',
        search: 'string (optional)',
        page: 'number (optional)',
        limit: 'number (optional)'
      },
      response: {
        success: 'Array of product objects',
        error: 'Error object with message'
      }
    },
    create: {
      endpoint: '/admin/products',
      method: 'POST',
      description: 'Create new product',
      requiresAuth: true,
      body: {
        name: 'string (required)',
        price: 'number (required)',
        description: 'string (optional)',
        category: 'string (required)',
        image: 'string (optional)'
      }
    }
  }
};

// API testing utilities
class APITester {
  static async testEndpoint(endpoint, options = {}) {
    const startTime = Date.now();
    
    try {
      const response = await apiService.request(endpoint, options);
      const endTime = Date.now();
      
      return {
        success: true,
        data: response,
        responseTime: endTime - startTime,
        endpoint,
        options
      };
    } catch (error) {
      const endTime = Date.now();
      
      return {
        success: false,
        error: error.message,
        responseTime: endTime - startTime,
        endpoint,
        options
      };
    }
  }

  static async runHealthCheck() {
    const endpoints = [
      '/health',
      '/products',
      '/admin/dashboard'
    ];

    const results = await Promise.all(
      endpoints.map(endpoint => this.testEndpoint(endpoint))
    );

    return {
      timestamp: new Date().toISOString(),
      results,
      overallHealth: results.every(r => r.success) ? 'healthy' : 'unhealthy'
    };
  }
}
```

### 10. **Security Best Practices**

```javascript
// Security enhancements
class SecurityManager {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential XSS attacks
    return input
      .replace(/[<>\"']/g, '')
      .trim();
  }

  static validateToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  static generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
  }

  static hashSensitiveData(data) {
    // Implement proper hashing for sensitive data
    return btoa(JSON.stringify(data));
  }
}
```

## 📊 Performance Optimization

### 1. **Batch Requests**

```javascript
// Batch multiple requests
class BatchRequestManager {
  constructor() {
    this.batchQueue = [];
    this.batchTimeout = null;
    this.batchDelay = 100; // ms
  }

  async addToBatch(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({
        endpoint,
        options,
        resolve,
        reject
      });

      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(() => {
        this.processBatch();
      }, this.batchDelay);
    });
  }

  async processBatch() {
    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      const results = await Promise.all(
        batch.map(({ endpoint, options }) => 
          apiService.request(endpoint, options)
        )
      );

      batch.forEach(({ resolve }, index) => {
        resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(({ reject }) => {
        reject(error);
      });
    }
  }
}
```

### 2. **Lazy Loading and Pagination**

```javascript
// Implement pagination for large datasets
class PaginatedAPI {
  constructor(endpoint, pageSize = 20) {
    this.endpoint = endpoint;
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.totalPages = 1;
    this.hasMore = true;
  }

  async loadPage(page = 1) {
    const response = await apiService.request(
      `${this.endpoint}?page=${page}&limit=${this.pageSize}`
    );

    this.currentPage = page;
    this.totalPages = response.totalPages;
    this.hasMore = page < this.totalPages;

    return response.data;
  }

  async loadNext() {
    if (this.hasMore) {
      return await this.loadPage(this.currentPage + 1);
    }
    return [];
  }
}
```

## 🔄 Integration Examples

### 1. **Product Management**

```javascript
// Enhanced product management
class ProductManager {
  constructor() {
    this.products = new Map();
    this.categories = new Map();
  }

  async loadProducts(filters = {}) {
    const cacheKey = `products:${JSON.stringify(filters)}`;
    
    try {
      const products = await apiService.getProducts(filters);
      products.forEach(product => {
        this.products.set(product.id, product);
      });
      
      return products;
    } catch (error) {
      console.error('Failed to load products:', error);
      return Array.from(this.products.values());
    }
  }

  async createProduct(productData) {
    const validatedData = this.validateProductData(productData);
    
    try {
      const newProduct = await apiService.addProduct(validatedData);
      this.products.set(newProduct.id, newProduct);
      
      // Notify components of new product
      this.notifyProductCreated(newProduct);
      
      return newProduct;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  validateProductData(data) {
    const required = ['name', 'price', 'category'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return {
      ...data,
      price: parseFloat(data.price),
      name: SecurityManager.sanitizeInput(data.name),
      description: SecurityManager.sanitizeInput(data.description)
    };
  }
}
```

### 2. **Order Management**

```javascript
// Enhanced order management with real-time updates
class OrderManager {
  constructor() {
    this.orders = new Map();
    this.statusHistory = new Map();
    this.websocket = new WebSocketService();
  }

  async createOrder(orderData) {
    const validatedOrder = this.validateOrder(orderData);
    
    try {
      const newOrder = await apiService.createOrder(validatedOrder);
      this.orders.set(newOrder.id, newOrder);
      
      // Subscribe to order updates
      this.subscribeToOrderUpdates(newOrder.id);
      
      return newOrder;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      
      const order = this.orders.get(orderId);
      if (order) {
        order.status = newStatus;
        order.updatedAt = new Date();
        
        // Track status history
        this.addStatusHistory(orderId, newStatus);
        
        // Notify components
        this.notifyOrderStatusChanged(order);
      }
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  subscribeToOrderUpdates(orderId) {
    this.websocket.subscribe(`order:${orderId}`, (data) => {
      this.handleOrderUpdate(data);
    });
  }
}
```

## 🧪 Testing API Integration

### 1. **Unit Tests**

```javascript
// Example unit tests for API service
describe('API Service', () => {
  let apiService;
  
  beforeEach(() => {
    apiService = new APIService();
  });

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts)
      });

      const result = await apiService.getProducts();
      expect(result).toEqual(mockProducts);
    });

    it('should fall back to static data on error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await apiService.getProducts();
      expect(result).toEqual(apiService.getFallbackProducts());
    });
  });

  describe('token management', () => {
    it('should set and retrieve tokens correctly', () => {
      const token = 'test-token';
      apiService.setToken(token);
      
      expect(apiService.token).toBe(token);
      expect(localStorage.getItem('adminToken')).toBe(token);
    });
  });
});
```

### 2. **Integration Tests**

```javascript
// Integration test examples
describe('Product Integration', () => {
  it('should create and retrieve products', async () => {
    const productData = {
      name: 'Test Product',
      price: 99.99,
      category: 'Test Category',
      description: 'Test Description'
    };

    // Create product
    const createdProduct = await apiService.addProduct(productData);
    expect(createdProduct.id).toBeDefined();

    // Retrieve products
    const products = await apiService.getProducts();
    expect(products.find(p => p.id === createdProduct.id)).toBeDefined();
  });
});
```

## 🔮 Future Enhancements

### 1. **GraphQL Integration**
- Consider migrating to GraphQL for more flexible queries
- Implement subscription-based real-time updates
- Add query optimization and caching

### 2. **Microservices Architecture**
- Split API into domain-specific services
- Implement service discovery
- Add inter-service communication

### 3. **Advanced Analytics**
- Implement API usage analytics
- Add performance monitoring
- Create usage dashboards

### 4. **Mobile API Support**
- Optimize for mobile networks
- Implement offline-first strategies
- Add push notification integration

## 📝 Best Practices Summary

1. **Always handle errors gracefully** - Provide fallback data and user-friendly error messages
2. **Implement proper caching** - Reduce API calls and improve performance
3. **Use environment-specific configurations** - Different settings for dev/staging/prod
4. **Validate and sanitize all inputs** - Security first approach
5. **Implement proper authentication** - JWT tokens with refresh mechanisms
6. **Add comprehensive logging** - Debug and monitor API usage
7. **Use TypeScript** - Better type safety and development experience
8. **Implement rate limiting** - Prevent API abuse
9. **Add comprehensive testing** - Unit, integration, and E2E tests
10. **Document everything** - API documentation and inline comments

This guide provides a solid foundation for API integration. The VaibhavTools project already has many of these patterns implemented, and this guide shows how to extend and enhance them further.
