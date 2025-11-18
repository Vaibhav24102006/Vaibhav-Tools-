# Vaibhav Tools - Professional Tools E-commerce Platform

A modern, responsive e-commerce platform for professional tools with admin dashboard, real-time updates, and comprehensive product management.

## 🚀 Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
npm run dev
```

### Option 2: Start Servers Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm start
```

## 🔧 Setup Requirements

### 1. Install Dependencies
```bash
npm install
```

### 2. Backend Dependencies
```bash
npm install express cors dotenv jsonwebtoken bcryptjs socket.io firebase-admin
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

### 4. Firebase Setup
1. Create a Firebase project
2. Download service account key as `firebase-service-account.json`
3. Place it in the root directory

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔑 Default Admin Credentials

- **Email**: admin@vaibhavtools.com
- **Password**: admin123

## 🛠️ Troubleshooting

### "Failed to fetch" Network Errors

#### Problem
```
Failed to fetch
```

#### Solutions

1. **Check if backend is running**
   ```bash
   # Check if port 5000 is in use
   netstat -ano | findstr :5000
   
   # Start backend if not running
   npm run server
   ```

2. **Verify proxy configuration**
   - Ensure `"proxy": "http://localhost:5000"` is in `package.json`
   - Restart frontend after adding proxy

3. **Check CORS configuration**
   - Backend should have CORS enabled
   - Frontend should use relative URLs (`/api`) in development

4. **Test API directly**
   ```bash
   curl http://localhost:5000/api/health
   ```

5. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R`
   - Clear browser data

### Color Contrast Issues

#### Problem
Input fields and dropdowns are not readable due to poor contrast.

#### Solutions

1. **Input Fields**: All inputs now have:
   ```jsx
   className="bg-white text-black placeholder-gray-500"
   ```

2. **Select Dropdowns**: All selects now have:
   ```jsx
   className="bg-white text-black"
   ```

3. **Dark Mode Support**: For dark backgrounds:
   ```jsx
   className="bg-black text-red-500 border border-gray-700"
   ```

### Backend Connection Issues

#### Problem
Backend server won't start or shows errors.

#### Solutions

1. **Check dependencies**
   ```bash
   npm install express cors dotenv jsonwebtoken bcryptjs socket.io firebase-admin
   ```

2. **Verify Firebase credentials**
   - Ensure `firebase-service-account.json` exists
   - Check file permissions

3. **Check environment variables**
   - Verify `.env` file exists
   - Ensure `JWT_SECRET` is set

4. **Port conflicts**
   ```bash
   # Kill process on port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Frontend Build Issues

#### Problem
React app won't start or shows build errors.

#### Solutions

1. **Clear node_modules**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check React Scripts**
   ```bash
   npm install react-scripts
   ```

3. **Clear cache**
   ```bash
   npm start -- --reset-cache
   ```

## 📱 Features

### Customer Features
- ✅ Product browsing with categories
- ✅ Search and filtering
- ✅ Shopping cart functionality
- ✅ Order placement
- ✅ Responsive design

### Admin Features
- ✅ Secure login system
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Dashboard with statistics
- ✅ Real-time updates

### Technical Features
- ✅ JWT authentication
- ✅ Firebase Firestore database
- ✅ Socket.IO real-time updates
- ✅ Responsive UI with Tailwind CSS
- ✅ Framer Motion animations
- ✅ Error handling and fallbacks

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on all devices
- **Accessibility**: Proper contrast and keyboard navigation
- **Animations**: Smooth transitions and hover effects
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for async operations

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Error sanitization

## 📊 Database Schema

### Products
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  category: string,
  rating: number,
  badge: string,
  badgeColor: string
}
```

### Orders
```javascript
{
  id: string,
  items: Array,
  total: number,
  customerEmail: string,
  status: string,
  createdAt: timestamp
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
JWT_SECRET=your-production-secret
NODE_ENV=production
```

## 📞 Support

For issues not covered in this troubleshooting guide:

1. Check browser console for errors
2. Check terminal output for backend errors
3. Verify all setup steps are completed
4. Ensure all dependencies are installed

## 🔄 Updates

- **v1.0**: Initial release with basic e-commerce functionality
- **v1.1**: Added admin dashboard and real-time updates
- **v1.2**: Fixed network connectivity and contrast issues
- **v1.3**: Enhanced error handling and user feedback 