# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This is a quick reference guide to get your Admin Dashboard up and running immediately.

---

## Step 1: Enable Firebase Storage (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **vaibhavtools-70e4f**
3. Click **Storage** in left sidebar
4. Click **Get Started**
5. Choose **Production mode**
6. Click **Done**

---

## Step 2: Set Admin User (3 minutes)

### Option A: Using Cloud Function (Recommended)

Create `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    res.send(`Success! ${email} is now an admin.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

Deploy and call:
```bash
cd functions
npm install
firebase deploy --only functions
# Visit: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/makeFirstAdmin?email=YOUR_EMAIL
```

### Option B: Using Node.js Script

Create `scripts/set-admin.js`:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'your-email@example.com'; // CHANGE THIS

admin.auth().getUserByEmail(email)
  .then(user => admin.auth().setCustomUserClaims(user.uid, { admin: true }))
  .then(() => {
    console.log('Success! Admin role assigned.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
```

Run:
```bash
node scripts/set-admin.js
```

---

## Step 3: Update Firebase Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.token.admin == true;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
    }
    match /products/{fileName} {
      allow write: if request.auth != null 
                   && request.auth.token.admin == true;
    }
  }
}
```

Deploy:
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## Step 4: Start the App

```bash
npm start
```

---

## Step 5: Login to Admin Panel

1. Open browser: `http://localhost:3000/admin-login`
2. Enter your email and password
3. Click **Sign In**
4. You'll be redirected to `/admin` dashboard

---

## 📍 Admin URLs

| Page | URL | Description |
|------|-----|-------------|
| Login | `/admin-login` | Admin authentication |
| Dashboard | `/admin` | Statistics overview |
| Products | `/admin/products` | Manage products |
| Categories | `/admin/categories` | Manage categories |
| Brands | `/admin/brands` | Manage brands |

---

## 🎯 Common Tasks

### Add a Product
1. Go to `/admin/products`
2. Click **Add Product**
3. Fill form and upload image
4. Click **Add Product**

### Edit a Product
1. Go to `/admin/products`
2. Click **Edit** icon (pencil)
3. Update fields
4. Click **Update Product**

### Delete a Product
1. Go to `/admin/products`
2. Click **Delete** icon (trash)
3. Confirm deletion

### Change Category Name
1. Go to `/admin/categories`
2. Click **Edit** icon
3. Type new name
4. Click **Check** icon
5. All products updated automatically

---

## ⚠️ Troubleshooting

### "Access Denied" Error
**Solution**: Sign out and sign in again to refresh token.

### Images Not Uploading
**Solution**: Check Firebase Storage is enabled and rules are deployed.

### Products Not Loading
**Solution**: Check Firestore rules allow read access.

### Can't Login
**Solution**: Verify admin claim is set correctly:
```javascript
// In browser console
firebase.auth().currentUser.getIdTokenResult()
  .then(token => console.log('Admin:', token.claims.admin));
```

---

## 📚 Full Documentation

For detailed information, see:
- **ADMIN_DASHBOARD_SETUP_GUIDE.md** - Complete setup guide
- **ADMIN_DASHBOARD_IMPLEMENTATION.md** - Technical details

---

## ✅ Checklist

Before going live:
- [ ] Firebase Storage enabled
- [ ] Admin user created
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Can login to `/admin-login`
- [ ] Can add a product
- [ ] Can edit a product
- [ ] Can delete a product
- [ ] Images upload successfully
- [ ] Mobile view works

---

**Ready to go!** 🎉

Your admin dashboard is now fully functional. Start managing your products!
