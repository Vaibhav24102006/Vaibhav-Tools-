# Troubleshooting Orders - Vaibhav Tools

## 🚨 Issue: Orders Not Saving to Firestore

### Symptoms
- Customer sees success message
- Order ID is generated
- But order doesn't appear in Admin Panel
- No email sent to father's Gmail
- Order not visible in customer's profile

### Root Cause
Firestore security rules may be blocking the write operation from the client side.

### Solution

#### Step 1: Update Firestore Security Rules

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Database:**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab

3. **Update Rules:**

Replace your current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products - Public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Categories - Public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Brands - Public read, admin write
    match /brands/{brandId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Wishlists - User-specific
    match /wishlists/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Carts - User-specific
    match /carts/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Orders - CRITICAL FOR ORDER PLACEMENT
    match /orders/{orderId} {
      // Allow authenticated users to create orders
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      
      // Allow users to read their own orders
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.admin == true);
      
      // Allow admins to update and delete orders
      allow update, delete: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

4. **Click "Publish"**

#### Step 2: Test Order Placement

1. **Open Browser Console:**
   - Press F12 (Windows) or Cmd+Option+I (Mac)
   - Go to "Console" tab

2. **Place Test Order:**
   - Add product to cart
   - Proceed to checkout
   - Enter delivery address
   - Click "Confirm Order"

3. **Check Console Logs:**

**Success indicators:**
```
✅ Order created with ID: abc123xyz
✅ Order saved to Firestore with ID: abc123xyz
✅ Order notification sent to admin email
```

**Error indicators:**
```
❌ Error creating order: Missing or insufficient permissions
❌ Failed to save order to Firestore
```

#### Step 3: Verify in Firestore

1. **Open Firestore Console:**
   - Go to Firestore Database
   - Click "Data" tab

2. **Check Orders Collection:**
   - Look for "orders" collection
   - Should see new document with Order ID
   - Click to view document data

3. **Verify Data:**
   - `orderId`: ORD-1234567890
   - `customerName`: Customer name
   - `customerEmail`: Customer email
   - `customerAddress`: Delivery address
   - `items`: Array of products
   - `totalAmount`: Order total
   - `status`: "pending"
   - `createdAt`: Timestamp
   - `userId`: User ID

---

## 🚨 Issue: Email Not Sending

### Symptoms
- Order saves to Firestore successfully
- But no email received in father's Gmail
- Console shows email error

### Solution

#### Step 1: Check EmailJS Configuration

1. **Verify Credentials:**
   - Open `/src/services/emailService.js`
   - Check:
     - `serviceID: "service_l74orya"`
     - `templateID: "template_amj7dsr"`
     - `publicKey: "9OIsKA0azrLjTtNZy"`

2. **Test EmailJS Dashboard:**
   - Go to: https://dashboard.emailjs.com/
   - Login with your account
   - Check service status (should be active)
   - Check monthly limit (200 emails/month free)

#### Step 2: Verify Email Template

1. **Open EmailJS Dashboard:**
   - Go to "Email Templates"
   - Find `template_amj7dsr`

2. **Check Template Variables:**

Required variables:
```
{{order_id}}
{{customer_name}}
{{customer_email}}
{{customer_address}}
{{product_list}}
{{order_total}}
{{order_date}}
```

3. **Test Template:**
   - Use "Test it" button in EmailJS dashboard
   - Send test email with sample data
   - Verify delivery

#### Step 3: Check Browser Console

Look for these logs:

**Success:**
```
✅ Order notification sent to admin email
```

**Failure:**
```
❌ Email notification error: [error details]
⚠️ Failed to send email notification: [reason]
```

#### Step 4: Common Email Issues

**Issue: "Service not found"**
- Solution: Verify service ID is correct
- Check EmailJS dashboard for correct ID

**Issue: "Template not found"**
- Solution: Verify template ID is correct
- Ensure template exists in EmailJS dashboard

**Issue: "Monthly limit exceeded"**
- Solution: Upgrade EmailJS plan or wait for next month
- Free tier: 200 emails/month

**Issue: "Invalid public key"**
- Solution: Get new public key from EmailJS dashboard
- Update in `emailService.js`

---

## 🚨 Issue: Orders Not Showing in Profile

### Symptoms
- Order saved to Firestore
- But not visible in customer's profile "Orders" tab

### Solution

#### Step 1: Check Firestore Query

1. **Open Browser Console**
2. **Go to Profile Page**
3. **Click "Orders" tab**
4. **Check Console for Errors:**

**Success:**
```
(No errors, orders load)
```

**Error:**
```
Error loading orders: [error details]
```

#### Step 2: Verify User ID Match

1. **Open Firestore Console**
2. **Find the order document**
3. **Check `userId` field**
4. **Compare with current user's ID:**
   - In browser console, type: `firebase.auth().currentUser.uid`
   - Should match the `userId` in order document

#### Step 3: Check Security Rules

Ensure rules allow users to read their own orders:

```javascript
match /orders/{orderId} {
  allow read: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     request.auth.token.admin == true);
}
```

---

## 🚨 Issue: Orders Not Showing in Admin Panel

### Symptoms
- Order saved to Firestore
- But not visible in `/admin/orders`

### Solution

#### Step 1: Check Admin Authentication

1. **Verify Admin Login:**
   - Ensure you're logged in as admin
   - Check admin token exists

2. **Check Admin Custom Claim:**
   - In browser console:
   ```javascript
   firebase.auth().currentUser.getIdTokenResult()
     .then(idTokenResult => {
       console.log('Admin claim:', idTokenResult.claims.admin);
     });
   ```
   - Should return `true`

#### Step 2: Verify Firestore Rules

Ensure admins can read all orders:

```javascript
match /orders/{orderId} {
  allow read: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     request.auth.token.admin == true);
}
```

#### Step 3: Check AdminOrders Component

1. **Open `/admin/orders`**
2. **Check Browser Console**
3. **Look for errors:**

**Success:**
```
(Orders load and display)
```

**Error:**
```
Error loading orders: [error details]
Failed to fetch orders
```

---

## 🧪 Complete Testing Procedure

### Test 1: Place Order

1. **As Customer:**
   - Add product to cart
   - Checkout
   - Enter address
   - Confirm order

2. **Expected Results:**
   - ✅ Success message with Order ID
   - ✅ Cart clears
   - ✅ Redirects to products page

3. **Check Console:**
   - ✅ "Order created with ID: ..."
   - ✅ "Order saved to Firestore with ID: ..."
   - ✅ "Order notification sent to admin email"

### Test 2: Verify Firestore

1. **Open Firebase Console**
2. **Go to Firestore Database**
3. **Check orders collection**
4. **Verify:**
   - ✅ Order document exists
   - ✅ All fields populated
   - ✅ `createdAt` timestamp present

### Test 3: Check Email

1. **Open Father's Gmail**
2. **Look for email:**
   - Subject: "New Order Received – Vaibhav Tools"
3. **Verify email contains:**
   - ✅ Order ID
   - ✅ Customer name and email
   - ✅ Delivery address
   - ✅ Product list
   - ✅ Total amount

### Test 4: Customer Profile

1. **Login as customer**
2. **Go to Profile page**
3. **Click "Orders" tab**
4. **Verify:**
   - ✅ Order appears in list
   - ✅ Order details correct
   - ✅ Status shows "Pending"
   - ✅ Delivery address visible

### Test 5: Admin Panel

1. **Login as admin**
2. **Go to `/admin/orders`**
3. **Verify:**
   - ✅ Order appears in table
   - ✅ Can view order details
   - ✅ Delivery address visible
   - ✅ Can update status
   - ✅ Can email customer

---

## 🔍 Debug Checklist

When orders aren't working, check these in order:

### 1. Authentication
- [ ] User is logged in
- [ ] User ID is valid
- [ ] Session is active

### 2. Firestore Rules
- [ ] Orders collection has correct rules
- [ ] `allow create` for authenticated users
- [ ] `allow read` for users and admins

### 3. Order Service
- [ ] `orderService.js` exists
- [ ] Imported correctly in Cart.jsx
- [ ] `createOrder` method works

### 4. Email Service
- [ ] EmailJS credentials correct
- [ ] Service is active
- [ ] Template exists
- [ ] Monthly limit not exceeded

### 5. Browser Console
- [ ] No JavaScript errors
- [ ] Network requests succeed
- [ ] Success logs appear

### 6. Firestore Console
- [ ] Orders collection exists
- [ ] Order documents created
- [ ] Data structure correct

### 7. Profile Page
- [ ] Orders tab loads
- [ ] `orderService.getUserOrders` works
- [ ] Orders display correctly

### 8. Admin Panel
- [ ] Admin authentication works
- [ ] Orders page loads
- [ ] Can view all orders

---

## 📞 Quick Fixes

### Fix 1: Clear Browser Cache

```
1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page
```

### Fix 2: Restart Development Server

```bash
# Stop server (Ctrl+C)
# Start again
npm start
```

### Fix 3: Re-deploy Firestore Rules

```
1. Open Firebase Console
2. Go to Firestore Database → Rules
3. Click "Publish" again
4. Wait 1-2 minutes for propagation
```

### Fix 4: Test with Different User

```
1. Logout
2. Create new account
3. Place test order
4. Check if it works
```

---

## ✅ Success Indicators

System is working correctly when:

### Customer Side:
- ✅ Can place order successfully
- ✅ Sees order in profile
- ✅ Receives confirmation message
- ✅ Cart clears after order

### Admin Side:
- ✅ Receives email notification
- ✅ Sees order in admin panel
- ✅ Can view all order details
- ✅ Can update order status

### System Side:
- ✅ Order saves to Firestore
- ✅ Email sends successfully
- ✅ No console errors
- ✅ All data synchronized

---

## 🆘 Still Not Working?

### Check These Files:

1. **`/src/services/orderService.js`** - Order creation logic
2. **`/src/services/emailService.js`** - Email sending logic
3. **`/src/pages/Cart.jsx`** - Checkout process
4. **`/src/pages/Profile.jsx`** - Order display
5. **`/src/pages/admin/AdminOrders.jsx`** - Admin order management

### Verify Imports:

```javascript
// Cart.jsx should have:
import orderService from '../services/orderService';
import emailService from '../services/emailService';

// Profile.jsx should have:
import orderService from '../services/orderService';
```

### Check Firebase Config:

```javascript
// /src/firebase.js should export:
export { db, auth, storage };
```

---

**Last Updated:** 2025-10-20  
**Version:** 1.0
