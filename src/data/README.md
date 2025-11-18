# Data Directory - Migration Notice

## 🚨 Important Migration Information

### Deprecated Files
- `productData.deprecated.js` - **DEPRECATED**: This file contains the old static product data and should no longer be used.

### New Data Structure
All product data is now stored in **Firebase Firestore** with the following collections:

#### Collections:
- **`products`** - All product information with enhanced fields
- **`categories`** - Product categories with sorting and metadata
- **`brands`** - Brand information linked to categories

#### Migration Benefits:
- ✅ Real-time data updates
- ✅ Better search and filtering capabilities
- ✅ Admin panel for easy data management
- ✅ Scalable and cloud-hosted
- ✅ Enhanced product information with specifications
- ✅ Brand and category relationships

### How to Populate Data:
1. Visit `/populate-data` in your development environment
2. Click "Populate Firestore Database" button
3. The script will clear existing data and populate with comprehensive product catalog

### Data Schema:

#### Products Collection:
```javascript
{
  name: string,
  brand: string,
  category: string,
  description: string,
  shortDescription: string,
  price: number,
  originalPrice: number,
  imageUrl: string,
  rating: number,
  reviews: number,
  badge: string,
  badgeColor: string,
  features: array,
  specifications: object,
  inStock: boolean,
  stockCount: number,
  amazonUrl: string,
  warranty: string,
  deliveryTime: string,
  availability: string,
  tags: array,
  weight: string,
  dimensions: string,
  isActive: boolean,
  featured: boolean,
  views: number,
  salesCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Categories Collection:
```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  sortOrder: number,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Brands Collection:
```javascript
{
  id: string,
  name: string,
  description: string,
  country: string,
  established: string,
  specialties: array,
  categoryId: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### API Usage:
Use the `firestoreService.js` for direct Firestore access:
```javascript
import { 
  getProductsFromFirestore,
  getCategoriesFromFirestore,
  getBrandsByCategory 
} from '../services/firestoreService';
```