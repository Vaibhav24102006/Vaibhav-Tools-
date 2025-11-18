# Vaibhav Tools Admin Panel Setup Guide

## 🚀 Quick Start

### 1. Installation & Setup

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

#### Step 1: Clone and Install Dependencies
```bash
# Navigate to your project directory
cd VaibhavTools

# Install frontend dependencies
npm install

# Install backend dependencies
npm install firebase express cors dotenv bcryptjs jsonwebtoken socket.io
```

#### Step 2: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate new private key (download JSON file)
6. Rename the downloaded file to `firebase-service-account.json`
7. Place it in your project root directory

#### Step 3: Environment Configuration
Create a `.env` file in your project root:
```env
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

#### Step 4: Initialize Database
Run the database initialization script:
```bash
node scripts/init-db.js
```

### 2. Starting the Application

#### Development Mode
```bash
# Terminal 1: Start Backend Server
node server.js

# Terminal 2: Start Frontend Development Server
npm start
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start production server
NODE_ENV=production node server.js
```

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: admin@vaibhavtools.com
- **Password**: admin123

### Access URLs
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Product Management**: `http://localhost:3000/admin/products`
- **Order Management**: `http://localhost:3000/admin/orders`

### Creating New Admin Users
1. Access Firebase Console
2. Go to Firestore Database
3. Create a new document in the `users` collection
4. Add the following fields:
   ```json
   {
     "email": "newadmin@example.com",
     "password": "hashed-password",
     "name": "Admin Name",
     "isAdmin": true,
     "createdAt": "timestamp"
   }
   ```

## 📊 Admin Panel Features

### Dashboard Overview
- **Total Products**: View count of all products
- **Total Orders**: View count of all orders
- **Total Revenue**: Sum of all order totals
- **Pending Orders**: Count of orders awaiting processing
- **Quick Actions**: Direct links to common tasks

### Product Management
- **View All Products**: Complete product catalog
- **Add New Product**: Create new products with validation
- **Edit Products**: Update product details
- **Delete Products**: Remove products with confirmation
- **Search & Filter**: Find products by name, category, or description
- **Real-time Updates**: Changes reflect immediately across all devices

### Order Management
- **View All Orders**: Complete order history
- **Order Details**: Customer info, items, totals, timestamps
- **Status Updates**: Change order status (Pending → Processing → Shipped → Delivered)
- **Search Orders**: Find by order ID or customer email
- **Filter by Status**: View orders by current status
- **Real-time Notifications**: New orders appear instantly

## 🔧 Technical Features

### Real-time Synchronization
- **WebSocket Integration**: Live updates across all connected devices
- **Auto-refresh**: Data updates automatically without page refresh
- **Multi-device Sync**: Changes visible on all admin devices simultaneously

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Admin-only Routes**: Protected admin panel access
- **Input Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in cross-site request forgery protection
- **Rate Limiting**: API request rate limiting

### Data Validation
- **Product Validation**:
  - Name (required, min 3 characters)
  - Price (required, positive number)
  - Category (required, from predefined list)
  - Description (required, min 10 characters)
  - Image URL (required, valid URL format)

- **Order Validation**:
  - Items array (required, non-empty)
  - Customer email (optional, valid email format)
  - Total amount (required, positive number)

## 🛠️ API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics

### Products
- `GET /api/products` - Get all products
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `GET /api/admin/orders` - Get all orders
- `POST /api/orders` - Create new order (customer)
- `PUT /api/admin/orders/:id/status` - Update order status

## 📱 Mobile Responsiveness

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔄 Real-time Features

### Live Updates
- New orders appear instantly
- Product changes reflect immediately
- Status updates propagate in real-time
- Dashboard stats update automatically

### WebSocket Events
- `productAdded` - New product created
- `productUpdated` - Product modified
- `productDeleted` - Product removed
- `newOrder` - New order received
- `orderStatusUpdated` - Order status changed

## 🚨 Troubleshooting

### Common Issues

#### 1. Firebase Connection Error
```
Error: Failed to initialize Firebase
```
**Solution**: 
- Verify `firebase-service-account.json` exists
- Check Firebase project settings
- Ensure Firestore is enabled

#### 2. JWT Token Expired
```
Error: Invalid token
```
**Solution**: 
- Log out and log back in
- Check JWT_SECRET in .env file
- Verify token expiration settings

#### 3. Real-time Updates Not Working
```
WebSocket connection failed
```
**Solution**:
- Check if backend server is running
- Verify CORS settings
- Check network connectivity

#### 4. Admin Access Denied
```
Error: Admin access required
```
**Solution**:
- Verify user has `isAdmin: true` in Firestore
- Check user document structure
- Ensure proper authentication

### Performance Optimization

#### Database Indexing
Create Firestore indexes for:
- `users.email` (for login queries)
- `products.category` (for filtering)
- `orders.createdAt` (for sorting)
- `orders.status` (for filtering)

#### Caching Strategy
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

## 📞 Support

For technical support or questions:
- **Email**: support@vaibhavtools.com
- **Documentation**: Check this guide first
- **Issues**: Create GitHub issue with detailed description

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks
1. **Database Backup**: Weekly Firestore exports
2. **Security Updates**: Monthly dependency updates
3. **Performance Monitoring**: Monitor API response times
4. **Error Logging**: Review error logs regularly

### Update Process
1. Pull latest changes from repository
2. Update dependencies: `npm update`
3. Test in development environment
4. Deploy to production
5. Monitor for issues

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Compatibility**: React 18+, Node.js 16+, Firebase 9+ 