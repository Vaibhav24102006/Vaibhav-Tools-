# Quick Test Checklist - Wishlist & Image Upload

## 🚀 Quick Start Testing

### 1. Test Image Upload (5 minutes)

**Step 1:** Start the development server
```bash
npm start
```

**Step 2:** Access Admin Panel
- Navigate to: `http://localhost:3000/admin/products`
- Log in with admin credentials

**Step 3:** Add a New Product with Image
1. Click "Add Product" button
2. Fill in product details:
   - Name: "Test Product"
   - Price: 999
   - Category: "Power & Hand Tools"
   - Brand: "Bosch"
   - Description: "Test product description"
3. Click "Choose Image"
4. Select an image file (JPG, PNG, WEBP, or GIF under 5MB)
5. Verify preview appears
6. Click "Add Product"
7. Wait for success message

**Step 4:** Verify on Frontend
1. Navigate to: `http://localhost:3000/products`
2. Select the category you used
3. Select the brand you used
4. Find your test product
5. Verify image displays correctly

**Expected Results:**
- ✅ Image preview shows in admin form
- ✅ File info displays (name and size)
- ✅ Upload completes successfully
- ✅ Product appears on frontend with image
- ✅ Image loads without errors

---

### 2. Test Image Validation (2 minutes)

**Test Invalid File Type:**
1. In admin panel, click "Add Product"
2. Try to upload a PDF or TXT file
3. **Expected:** Error message "Invalid file type..."

**Test Large File:**
1. Try to upload an image larger than 5MB
2. **Expected:** Error message "File size too large..."

**Test Clear Image:**
1. Upload a valid image
2. Click "Clear Image" button
3. **Expected:** Preview disappears, can select new image

---

### 3. Test Wishlist (Guest User) (3 minutes)

**Step 1:** Ensure you're logged out
- If logged in, log out first

**Step 2:** Add to Wishlist
1. Navigate to: `http://localhost:3000/products`
2. Browse to any product
3. Click the heart icon (should be outline)
4. **Expected:** Heart fills with red color

**Step 3:** Verify Persistence
1. Refresh the page
2. Navigate back to the same product
3. **Expected:** Heart is still filled (red)

**Step 4:** View Wishlist Page
1. Navigate to: `http://localhost:3000/wishlist`
2. **Expected:** Product appears in wishlist
3. Verify image, name, price display correctly

**Step 5:** Remove from Wishlist
1. Click the X button on the product card
2. Confirm removal
3. **Expected:** Product disappears from wishlist

---

### 4. Test Wishlist (Logged-In User) (3 minutes)

**Step 1:** Log in
1. Navigate to: `http://localhost:3000/login`
2. Log in with your credentials

**Step 2:** Add to Wishlist
1. Navigate to products page
2. Add a product to wishlist (click heart icon)
3. **Expected:** Heart fills with red

**Step 3:** Verify Firestore Sync
1. Open Firebase Console
2. Navigate to Firestore Database
3. Check `wishlists/{userId}` collection
4. **Expected:** Document exists with items array

**Step 4:** Test Cross-Device Sync
1. Open the site in another browser/incognito
2. Log in with same credentials
3. Navigate to wishlist page
4. **Expected:** Same products appear

---

### 5. Test Newly Added Products in Wishlist (2 minutes)

**Step 1:** Add a brand new product via admin panel
1. Create a product with all fields filled
2. Include an image
3. Save the product

**Step 2:** Add to Wishlist
1. Navigate to products page
2. Find the newly created product
3. Click heart icon to add to wishlist
4. **Expected:** Product adds successfully

**Step 3:** Verify in Wishlist Page
1. Navigate to: `http://localhost:3000/wishlist`
2. **Expected:** New product appears with all details
3. Image should display correctly
4. Price should be correct

---

### 6. Test Add to Cart from Wishlist (2 minutes)

**Step 1:** Ensure you have items in wishlist

**Step 2:** Add Single Item to Cart
1. Navigate to wishlist page
2. Click "Add to Cart" on any product
3. **Expected:** Product added to cart
4. Cart icon count increases

**Step 3:** Add All Items to Cart
1. Click "Add All to Cart" button at top
2. **Expected:** All wishlist items added to cart
3. Cart count updates accordingly

---

## 🐛 Common Issues & Solutions

### Issue: Image not uploading
**Solution:**
1. Check file size (must be < 5MB)
2. Check file type (JPG, PNG, WEBP, GIF only)
3. Check Firebase Storage rules
4. Check internet connection

### Issue: Wishlist not persisting
**Solution:**
1. Check browser localStorage is enabled
2. For logged-in users, check Firestore rules
3. Clear browser cache and try again

### Issue: Product image not displaying
**Solution:**
1. Check Firebase Storage CORS settings
2. Verify image URL in Firestore is valid
3. Check browser console for errors
4. Try hard refresh (Ctrl+F5)

---

## ✅ Success Criteria

All tests pass if:
- ✅ Images upload successfully with validation
- ✅ Images display on frontend
- ✅ Wishlist persists across page refreshes
- ✅ Wishlist syncs to Firestore for logged-in users
- ✅ Newly added products work in wishlist
- ✅ Add to cart from wishlist works
- ✅ No console errors during any operation

---

## 📊 Test Results Template

Copy and fill this out:

```
Date: ___________
Tester: ___________

Image Upload Tests:
[ ] Valid image upload - PASS/FAIL
[ ] Invalid file type validation - PASS/FAIL
[ ] Large file validation - PASS/FAIL
[ ] Clear image button - PASS/FAIL
[ ] Image displays on frontend - PASS/FAIL

Wishlist Tests (Guest):
[ ] Add to wishlist - PASS/FAIL
[ ] Persistence after refresh - PASS/FAIL
[ ] View wishlist page - PASS/FAIL
[ ] Remove from wishlist - PASS/FAIL

Wishlist Tests (Logged-In):
[ ] Add to wishlist - PASS/FAIL
[ ] Firestore sync - PASS/FAIL
[ ] Cross-device sync - PASS/FAIL

Integration Tests:
[ ] New products in wishlist - PASS/FAIL
[ ] Add to cart from wishlist - PASS/FAIL
[ ] Add all to cart - PASS/FAIL

Overall Status: PASS/FAIL
Notes: ___________
```

---

**Estimated Total Test Time:** 15-20 minutes
