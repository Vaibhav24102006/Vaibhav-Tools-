# Admin Dashboard Setup Guide

## Overview

This guide explains how to set up, access, and use the complete Admin Dashboard system for Vaibhav Tools. The dashboard provides real-time product management, category/brand editing, and comprehensive analytics.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Initial Setup](#initial-setup)
3. [Assigning Admin Role](#assigning-admin-role)
4. [Accessing the Admin Panel](#accessing-the-admin-panel)
5. [Dashboard Features](#dashboard-features)
6. [Product Management](#product-management)
7. [Category Management](#category-management)
8. [Brand Management](#brand-management)
9. [Firebase Storage Setup](#firebase-storage-setup)
10. [Security Rules](#security-rules)
11. [Troubleshooting](#troubleshooting)

---

## System Architecture

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM v6
- **UI Library**: TailwindCSS + Lucide Icons
- **Animations**: Framer Motion

### Backend
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

### File Structure
```
src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx    # Main dashboard with statistics
│   │   ├── AdminProducts.jsx     # Product management page
│   │   ├── AdminCategories.jsx   # Category management page
│   │   └── AdminBrands.jsx       # Brand management page
│   ├── AdminLogin.jsx            # Admin authentication page
│   └── Admin.jsx                 # Legacy admin page
├── components/
│   └── admin/
│       ├── AdminSidebar.jsx      # Navigation sidebar
│       ├── ProductForm.jsx       # Add/Edit product modal
│       ├── ProductTable.jsx      # Products data table
│       ├── StatCard.jsx          # Statistics card component
│       └── CategoryBrandManager.jsx  # Category/Brand editor
├── utils/
│   └── adminFirestore.js         # Admin Firestore service
└── firebase.js                   # Firebase configuration
```

---

## Initial Setup

### 1. Install Dependencies

All required dependencies are already included in `package.json`:
- `firebase`: ^11.10.0
- `react-router-dom`: ^6.22.3
- `framer-motion`: ^12.15.0
- `lucide-react`: ^0.511.0

If needed, run:
```bash
npm install
```

### 2. Firebase Configuration

Ensure your `.env` file contains the Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **vaibhavtools-70e4f**
3. Navigate to **Storage** in the left sidebar
4. Click **Get Started**
5. Choose **Start in production mode** or **Test mode** (see Security Rules section)
6. Select a Cloud Storage location (preferably closest to your users)
7. Click **Done**

---

## Assigning Admin Role

### Method 1: Using Firebase Console (Recommended)

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project: **vaibhavtools-70e4f**

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Go to the **Users** tab
   - Find the user you want to make admin

3. **Set Custom Claims via Cloud Functions**

   Create a Cloud Function to set admin claims:

   ```javascript
   // functions/index.js
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   admin.initializeApp();

   exports.setAdminClaim = functions.https.onCall(async (data, context) => {
     // Check if request is made by an existing admin
     if (context.auth.token.admin !== true) {
       throw new functions.https.HttpsError(
         'permission-denied',
         'Only admins can create new admins'
       );
     }

     // Get user and set custom claim
     try {
       await admin.auth().setCustomUserClaims(data.uid, { admin: true });
       return { message: `Success! ${data.uid} is now an admin.` };
     } catch (error) {
       throw new functions.https.HttpsError('internal', error.message);
     }
   });

   // First-time admin setup (run once, then remove)
   exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
     const email = req.query.email;
     if (!email) {
       res.status(400).send('Email required');
       return;
     }

     try {
       const user = await admin.auth().getUserByEmail(email);
       await admin.auth().setCustomUserClaims(user.uid, { admin: true });
       res.send(`Success! ${email} is now an admin.`);
     } catch (error) {
       res.status(500).send(error.message);
     }
   });
   ```

4. **Deploy Cloud Function**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

5. **Make First Admin**
   - Visit: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/makeFirstAdmin?email=admin@example.com`
   - Replace with your actual function URL and admin email

### Method 2: Using Firebase Admin SDK (Node.js Script)

Create a script `scripts/set-admin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@example.com'; // Replace with your email

admin.auth().getUserByEmail(email)
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`Success! ${email} is now an admin.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
```

Run the script:
```bash
node scripts/set-admin.js
```

---

## Accessing the Admin Panel

### Admin Login URL
```
http://localhost:3000/admin-login
```

Or in production:
```
https://your-domain.com/admin-login
```

### Login Process

1. **Navigate to Admin Login**
   - Go to `/admin-login`
   - You'll see the admin authentication page

2. **Enter Credentials**
   - Email: Your Firebase Auth email with admin claim
   - Password: Your Firebase Auth password

3. **Authentication Flow**
   - System checks Firebase Auth credentials
   - Verifies admin custom claim
   - Redirects to `/admin` dashboard if successful
   - Shows error if not admin or invalid credentials

### Protected Routes

All admin routes require authentication and admin claim:
- `/admin` - Dashboard (overview and statistics)
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/brands` - Brand management
- `/admin/legacy` - Legacy admin interface

---

## Dashboard Features

### Main Dashboard (`/admin`)

**Statistics Cards:**
- **Total Products**: Count of all products in database
- **Categories**: Number of unique categories
- **Brands**: Number of unique brands
- **In Stock**: Products currently available

**Stock Status:**
- Visual progress bar showing in-stock vs out-of-stock ratio
- Real-time updates from Firestore

---

## Admin Password Reset Flow

We provide a built-in password-reset flow for admin accounts.

1. Request a reset: POST /api/admin/request-password-reset with JSON { email }
  - The endpoint will verify the email is for an admin user, create a one-time token (1 hour expiry), store a hashed token in Firestore, and (in development) return and log a reset link.
2. Reset password: POST /api/admin/reset-password with JSON { id, token, newPassword }
  - The endpoint validates the one-time token, sets a bcrypt-hashed password in Firestore, deletes the token, and sets `passwordChangedAt` to invalidate older JWTs.

Notes:
- In production, the reset link should be emailed to the admin address (implement email sending via your preferred provider).
- After a password change, existing sessions are revoked for linked Firebase Auth accounts and tokens issued before `passwordChangedAt` are rejected.

**Category Distribution:**
- Horizontal bar chart showing product distribution by category
- Top 6 categories displayed
- Percentage calculations

**Quick Actions:**
- Direct links to Products, Categories, and Brands management

---

## Product Management

### Accessing Product Management
Navigate to `/admin/products` or click **Products** in the sidebar.

### Features

#### 1. Add New Product
Click the **Add Product** button to open the product form modal.

**Required Fields:**
- **Product Name**: Unique product identifier
- **Price**: Product price in ₹ (Indian Rupees)

**Optional Fields:**
- **Stock Quantity**: Number of units available
- **Category**: Select existing or type new category
- **Brand**: Select existing or type new brand
- **Description**: Product description
- **Product Image**: Upload image (stored in Firebase Storage)
- **In Stock**: Toggle availability status

**Image Upload:**
- Supported formats: JPG, PNG, GIF, WebP
- Automatically uploaded to Firebase Storage
- Returns public download URL
- Preview shown before saving

#### 2. Edit Product
Click the **Edit** icon (pencil) on any product row.
- All fields pre-populated with current values
- Update any field
- Upload new image (replaces old one)
- Click **Update Product** to save

#### 3. Delete Product
Click the **Delete** icon (trash) on any product row.
- Confirmation dialog appears
- Permanently removes product from Firestore
- Cannot be undone

#### 4. Search & Filter

**Search:**
- Search by product name or description
- Real-time filtering as you type

**Category Filter:**
- Dropdown with all available categories
- Shows only products in selected category

**Brand Filter:**
- Dropdown with all available brands
- Shows only products with selected brand

**Clear Filters:**
- Click "Clear all filters" to reset

#### 5. Product Table

**Columns:**
- **Image**: Product thumbnail (64x64px)
- **Name**: Product name
- **Price**: Formatted price in ₹
- **Category**: Product category
- **Brand**: Product brand
- **Stock**: Stock quantity
- **Status**: In Stock / Out of Stock badge
- **Actions**: Edit and Delete buttons

---

## Category Management

### Accessing Category Management
Navigate to `/admin/categories` or click **Categories** in the sidebar.

### How Categories Work
Categories are **automatically derived** from products. When you create a product with a category, it's added to the category list.

### Features

#### 1. View All Categories
- Alphabetically sorted list
- Shows all unique categories from products

#### 2. Edit Category
Click the **Edit** icon on any category.
- Inline editing enabled
- Type new category name
- Click **Check** to save
- **Updates all products** with old category to new category

#### 3. Delete Category
Click the **Delete** icon on any category.
- Confirmation dialog appears
- Removes category from all products (sets to empty string)
- Cannot be undone

#### 4. Add New Category
Click **Add New** button.
- Note: Categories are derived from products
- To add a category, create a product with that category name
- Or use the inline add form (creates placeholder)

#### 5. Category Statistics
- **Total Categories**: Count of unique categories
- **Most Used**: Most common category
- **Status**: Active/Inactive

---

## Brand Management

### Accessing Brand Management
Navigate to `/admin/brands` or click **Brands** in the sidebar.

### How Brands Work
Brands are **automatically derived** from products. When you create a product with a brand, it's added to the brand list.

### Features

#### 1. View All Brands
- Alphabetically sorted list
- Shows all unique brands from products

#### 2. Edit Brand
Click the **Edit** icon on any brand.
- Inline editing enabled
- Type new brand name
- Click **Check** to save
- **Updates all products** with old brand to new brand

#### 3. Delete Brand
Click the **Delete** icon on any brand.
- Confirmation dialog appears
- Removes brand from all products (sets to empty string)
- Cannot be undone

#### 4. Add New Brand
Click **Add New** button.
- Note: Brands are derived from products
- To add a brand, create a product with that brand name
- Or use the inline add form (creates placeholder)

#### 5. Brand Statistics
- **Total Brands**: Count of unique brands
- **Most Popular**: Most common brand
- **Status**: Active/Inactive

---

## Firebase Storage Setup

### Storage Rules

Update your Firebase Storage rules for admin access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated admins
    match /products/{fileName} {
      allow write: if request.auth != null 
                   && request.auth.token.admin == true;
    }
    
    // Restrict file size to 5MB
    match /{allPaths=**} {
      allow write: if request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

### Storage Structure
```
storage/
└── products/
    ├── 1234567890_product1.jpg
    ├── 1234567891_product2.png
    └── 1234567892_product3.webp
```

Files are named with timestamp prefix to ensure uniqueness.

---

## Security Rules

### Firestore Security Rules

Update your Firestore rules to allow admin write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products collection
    match /products/{productId} {
      // Anyone can read products
      allow read: if true;
      
      // Only admins can write
      allow write: if request.auth != null 
                   && request.auth.token.admin == true;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                            && (request.auth.uid == resource.data.userId 
                                || request.auth.token.admin == true);
    }
    
    // Contact messages
    match /contactMessages/{messageId} {
      allow read: if request.auth != null 
                  && request.auth.token.admin == true;
      allow create: if true;
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null 
                  && request.auth.uid == userId;
      allow write: if request.auth != null 
                   && request.auth.uid == userId;
    }
    
    // Carts
    match /carts/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null 
                  && (request.auth.uid == resource.data.userId 
                      || request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update: if request.auth != null 
                    && request.auth.token.admin == true;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## Troubleshooting

### Issue: "Access Denied" after login

**Solution:**
1. Verify admin claim is set:
   ```javascript
   // In browser console after login
   firebase.auth().currentUser.getIdTokenResult()
     .then(token => console.log(token.claims.admin));
   ```
2. If `undefined`, re-run admin claim script
3. Sign out and sign in again to refresh token

### Issue: Image upload fails

**Solutions:**
1. Check Firebase Storage is enabled
2. Verify storage rules allow admin write
3. Check file size (must be < 5MB)
4. Verify internet connection
5. Check browser console for errors

### Issue: Products not loading

**Solutions:**
1. Check Firestore rules allow read access
2. Verify Firebase configuration in `.env`
3. Check browser console for errors
4. Verify products collection exists in Firestore

### Issue: Category/Brand updates not working

**Solutions:**
1. Verify admin claim is active
2. Check Firestore rules allow admin write
3. Ensure products have the old category/brand value
4. Check browser console for batch write errors

### Issue: Sidebar not showing on mobile

**Solution:**
- Click the hamburger menu icon (☰) in top-left corner
- Sidebar will slide in from left
- Click overlay to close

### Issue: Real-time updates not working

**Solutions:**
1. Refresh the page to reload data
2. Check Firestore connection in Network tab
3. Verify Firestore rules allow read access
4. Check for JavaScript errors in console

---

## Best Practices

### Product Management
1. **Use consistent naming**: Keep product names clear and descriptive
2. **Optimize images**: Compress images before upload (recommended < 500KB)
3. **Set accurate stock**: Update stock quantities regularly
4. **Use categories wisely**: Don't create too many categories (aim for 5-15)
5. **Brand consistency**: Use exact brand names (e.g., "Bosch" not "BOSCH" or "bosch")

### Category Management
1. **Keep it simple**: Use broad categories (e.g., "Power Tools" not "Cordless Drills")
2. **Avoid duplicates**: Check existing categories before creating new ones
3. **Use title case**: "Power Tools" not "power tools" or "POWER TOOLS"

### Brand Management
1. **Official names**: Use official brand names
2. **Consistency**: Always use the same spelling and capitalization
3. **No abbreviations**: Use "Makita" not "Mak" or "MKT"

### Security
1. **Limit admin access**: Only assign admin role to trusted users
2. **Regular audits**: Review admin activity logs periodically
3. **Strong passwords**: Enforce strong passwords for admin accounts
4. **Two-factor auth**: Enable 2FA for admin accounts in Firebase Console

---

## Access URLs

### Development
- **Admin Login**: http://localhost:3000/admin-login
- **Dashboard**: http://localhost:3000/admin
- **Products**: http://localhost:3000/admin/products
- **Categories**: http://localhost:3000/admin/categories
- **Brands**: http://localhost:3000/admin/brands

### Production
Replace `localhost:3000` with your production domain:
- **Admin Login**: https://your-domain.com/admin-login
- **Dashboard**: https://your-domain.com/admin
- **Products**: https://your-domain.com/admin/products
- **Categories**: https://your-domain.com/admin/categories
- **Brands**: https://your-domain.com/admin/brands

---

## Support

For issues or questions:
1. Check this guide first
2. Review Firebase Console logs
3. Check browser console for errors
4. Verify Firestore and Storage rules
5. Ensure admin claim is properly set

---

## Changelog

### Version 1.0.0 (2025-10-19)
- Initial release
- Complete admin dashboard with real-time sync
- Product management (CRUD operations)
- Category management (edit, delete, bulk update)
- Brand management (edit, delete, bulk update)
- Firebase Storage integration for image uploads
- Responsive design with mobile support
- Dark mode with red-black theme
- Protected routes with admin authentication
- Statistics and analytics dashboard

---

**Last Updated**: October 19, 2025  
**Author**: Vaibhav Tools Development Team  
**Version**: 1.0.0
