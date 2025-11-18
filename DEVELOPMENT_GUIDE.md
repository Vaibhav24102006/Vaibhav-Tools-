# VaibhavTools Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Initial Setup
1. **Clone/Navigate to project**
   ```bash
   cd VaibhavTools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` (already done)
   - Update `JWT_SECRET` with a secure random string

4. **Set up Firebase**
   - Place your `firebase-service-account.json` in the root directory
   - Ensure Firestore is enabled in your Firebase project

5. **Initialize database**
   ```bash
   npm run setup
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Overview

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO
- **Security**: bcryptjs, CORS, rate limiting

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Context API
- **Icons**: Lucide React, React Icons

## 📁 Project Structure

```
VaibhavTools/
├── public/                 # Static files
├── src/
│   ├── admin/             # Admin panel components
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── App.jsx            # Main app component
├── middleware/            # Express middleware
├── scripts/               # Utility scripts
├── server.js              # Backend server
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 🛠️ Development Workflow

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm start` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run setup` | Initialize database with sample data |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run health` | Check backend health |

### Development Tips

1. **Hot Reload**: Frontend automatically reloads on changes
2. **API Testing**: Use `npm run health` to test backend
3. **Database Reset**: Run `npm run setup` to reset with sample data
4. **Debug Mode**: Check browser console and terminal for errors

## 🔧 Key Features Implementation

### 1. Authentication System
- JWT-based authentication
- Admin-only routes with middleware
- Secure password hashing with bcrypt

### 2. Product Management
- CRUD operations for products
- Image handling with placeholder images
- Category-based organization
- Stock management

### 3. Order Management
- Order creation and tracking
- Status updates with real-time notifications
- Admin dashboard for order management

### 4. Real-time Updates
- Socket.IO for real-time product updates
- Live order notifications
- Admin dashboard real-time stats

## 📊 Database Schema

### Collections

#### Users
```javascript
{
  id: string,
  email: string,
  password: string (hashed),
  name: string,
  isAdmin: boolean,
  createdAt: timestamp
}
```

#### Products
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
  badgeColor: string,
  inStock: boolean,
  stockQuantity: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Orders
```javascript
{
  id: string,
  items: Array<{
    id: string,
    name: string,
    price: number,
    quantity: number
  }>,
  total: number,
  customerEmail: string,
  customerName: string,
  customerPhone: string,
  shippingAddress: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Categories
```javascript
{
  id: string,
  name: string,
  description: string,
  createdAt: timestamp
}
```

## 🔐 Security Features

### Backend Security
- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting middleware
- Input validation
- Error sanitization

### Frontend Security
- Protected routes
- Token expiration handling
- Input sanitization
- XSS protection

## 🎨 UI/UX Features

### Design System
- **Colors**: Red accent (#dc2626), dark backgrounds
- **Typography**: Oswald font family
- **Spacing**: Tailwind CSS utility classes
- **Animations**: Framer Motion for smooth transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interface
- Adaptive layouts

## 🚀 Deployment Guide

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in hosting platform

### Backend Deployment (Heroku/Railway)
1. Set environment variables:
   ```
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   PORT=5000
   ```
2. Upload `firebase-service-account.json` securely
3. Deploy with your preferred platform

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-super-secure-production-secret
PORT=5000
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check Firebase credentials
   - Verify .env file exists
   - Ensure port 5000 is available

2. **Frontend build errors**
   - Clear node_modules: `npm run clean`
   - Reinstall dependencies: `npm install`

3. **Database connection issues**
   - Verify Firebase project settings
   - Check service account permissions
   - Ensure Firestore is enabled

4. **API errors**
   - Check network connectivity
   - Verify proxy configuration
   - Test with `npm run health`

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy
- Image optimization
- Bundle analysis with `npm run analyze`
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Response compression
- Rate limiting

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test products endpoint
curl http://localhost:5000/api/products
```

## 🔄 Future Enhancements

### Planned Features
1. **Payment Integration**
   - Stripe/PayPal integration
   - Order payment tracking
   - Invoice generation

2. **Advanced Search**
   - Elasticsearch integration
   - Filters and sorting
   - Search analytics

3. **User Management**
   - Customer accounts
   - Order history
   - Wishlist functionality

4. **Analytics Dashboard**
   - Sales metrics
   - User behavior tracking
   - Performance monitoring

5. **Mobile App**
   - React Native implementation
   - Push notifications
   - Offline capabilities

## 📞 Support

For development support:
1. Check this documentation
2. Review error logs in terminal
3. Test API endpoints
4. Verify database connections

## 🏆 Best Practices

### Code Quality
- Use ESLint for code linting
- Follow React best practices
- Write meaningful commit messages
- Use TypeScript for type safety (future)

### Security
- Never commit sensitive data
- Use environment variables
- Implement proper authentication
- Regular security audits

### Performance
- Optimize images
- Minimize bundle size
- Use efficient queries
- Implement caching
