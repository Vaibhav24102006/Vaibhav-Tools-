# Quick Setup Guide - Order & Communication Agent

## 🚀 5-Minute Setup

### Step 1: Verify EmailJS Configuration ✅

Your EmailJS credentials are already configured:
- **Service ID:** `service_l74orya`
- **Template ID:** `template_amj7dsr`
- **Public Key:** `9OIsKA0azrLjTtNZy`

**Location:** `/src/services/emailService.js`

### Step 2: Set Up EmailJS Template

1. **Login to EmailJS**
   - Go to: https://dashboard.emailjs.com/
   - Login with your account

2. **Verify Email Service**
   - Go to "Email Services"
   - Ensure `service_l74orya` is active
   - Verify father's Gmail is linked

3. **Create/Update Template**
   - Go to "Email Templates"
   - Find or create `template_amj7dsr`
   - Copy the template from `ORDER_COMMUNICATION_AGENT_GUIDE.md`
   - Or use this minimal template:

```
Subject: New Order Received – Vaibhav Tools

Body:
🛒 NEW ORDER RECEIVED!

Order ID: {{order_id}}
Date: {{order_date}}
Total: {{order_total}}

CUSTOMER DETAILS:
Name: {{customer_name}}
Email: {{customer_email}}

DELIVERY ADDRESS:
{{customer_address}}

PRODUCTS ORDERED:
{{product_list}}

---
Check Admin Panel: https://your-domain.com/admin/orders
```

4. **Save Template**

### Step 3: Test Email Delivery

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Login to Admin Panel:**
   - Navigate to: `http://localhost:3000/admin-login`
   - Enter admin credentials

3. **Access Email Test Panel:**
   - Click "Email Test" in sidebar
   - Or go to: `http://localhost:3000/admin/email-test`

4. **Send Test Email:**
   - Fill in:
     - **Recipient Name:** Test User
     - **Recipient Email:** Your test email (or father's email)
     - **Message:** This is a test email from Vaibhav Tools
   - Click "Send Test Email"

5. **Verify Delivery:**
   - Check the recipient's inbox
   - Look for email from Vaibhav Tools
   - If not in inbox, check spam folder

6. **Success Indicators:**
   - ✅ Green success message appears
   - ✅ Email received in inbox
   - ✅ Console shows: "✅ Order notification sent to admin email"

### Step 4: Test Complete Order Flow

1. **Place Test Order (as Customer):**
   - Logout from admin (or use incognito window)
   - Browse products: `http://localhost:3000/products`
   - Add a product to cart
   - Go to cart: `http://localhost:3000/cart`
   - Click "Proceed to Checkout"
   - If not logged in, sign in or create account
   - Enter delivery address in modal:
     ```
     123 Test Street
     Test Area
     Mumbai, Maharashtra
     400001
     India
     ```
   - Click "Confirm Order"

2. **Verify Order Processing:**
   - ✅ Success message appears with Order ID
   - ✅ Cart is cleared
   - ✅ Redirected to products page

3. **Check Father's Gmail:**
   - ✅ Email received with subject "New Order Received – Vaibhav Tools"
   - ✅ Email contains:
     - Order ID
     - Customer name and email
     - Delivery address
     - Product list
     - Total amount

4. **Check Admin Panel:**
   - Login to admin: `http://localhost:3000/admin-login`
   - Go to orders: `http://localhost:3000/admin/orders`
   - ✅ New order appears in table
   - Click eye icon to view details
   - ✅ All information matches:
     - Order ID
     - Customer details
     - Delivery address (in blue box)
     - Products
     - Total amount

### Step 5: Test Admin Features

1. **Search Order:**
   - Type Order ID in search box
   - ✅ Order filters correctly

2. **Update Status:**
   - Click status dropdown
   - Change to "Processing"
   - ✅ Status updates immediately

3. **Email Customer:**
   - Click mail icon
   - Write test message
   - Click "Send Email"
   - ✅ Success message appears
   - Check customer's email inbox

4. **View Order Details:**
   - Click eye icon
   - ✅ Modal shows complete order info
   - ✅ Delivery address visible in blue box

---

## ✅ Verification Checklist

After setup, verify these work:

### Email System
- [ ] Email test panel shows "Configured" status
- [ ] Test email sends successfully
- [ ] Test email received in inbox
- [ ] EmailJS dashboard shows sent email

### Order Flow
- [ ] Customer can add products to cart
- [ ] Checkout requires login
- [ ] Address modal appears
- [ ] Order saves to Firestore
- [ ] Email sent to father's Gmail
- [ ] Order appears in admin panel
- [ ] All order details correct

### Admin Panel
- [ ] Can view all orders
- [ ] Search works correctly
- [ ] Filter by status works
- [ ] Can view order details
- [ ] Delivery address displays
- [ ] Can update order status
- [ ] Can email customer
- [ ] Can delete orders

---

## 🔧 Troubleshooting

### Email Not Sending

**Check:**
1. EmailJS credentials correct in `emailService.js`
2. EmailJS service is active (not paused)
3. Template ID matches
4. Monthly limit not exceeded (200/month free)
5. Browser console for errors

**Fix:**
- Verify credentials at https://dashboard.emailjs.com/
- Check service status
- Upgrade plan if limit exceeded

### Order Not Saving

**Check:**
1. Firestore security rules allow writes
2. User is authenticated
3. Browser console for errors
4. Network tab for failed requests

**Fix:**
- Update Firestore rules (see guide)
- Ensure user is logged in
- Check Firebase console

### Address Not Showing

**Check:**
1. Customer entered address before confirming
2. Address field in Firestore document
3. AdminOrders component updated

**Fix:**
- Ensure latest code is deployed
- Check Firestore document structure
- Clear browser cache

---

## 🎯 Quick Commands

### Start Development Server
```bash
npm start
```

### Access Key URLs
```
Customer Site:     http://localhost:3000
Admin Login:       http://localhost:3000/admin-login
Admin Orders:      http://localhost:3000/admin/orders
Email Test:        http://localhost:3000/admin/email-test
EmailJS Dashboard: https://dashboard.emailjs.com
```

### Check Console Logs
```javascript
// Successful order flow shows:
✅ Order saved to Firestore
✅ Order notification sent to admin email

// Failed email shows:
❌ Order notification error: [error details]
```

---

## 📊 Expected Behavior

### When Customer Places Order:

1. **Customer Side:**
   - Sees address modal
   - Enters delivery address
   - Clicks "Confirm Order"
   - Sees success message with Order ID
   - Cart clears
   - Redirects to products

2. **System Side:**
   - Saves order to Firestore
   - Sends email to father's Gmail
   - Logs success to console

3. **Admin Side:**
   - Order appears in `/admin/orders`
   - Email received in Gmail
   - All data synchronized

### Email Content:

**Subject:** New Order Received – Vaibhav Tools

**Contains:**
- Order ID (e.g., ORD-1729389600000)
- Customer name
- Customer email
- Delivery address (full address)
- Product list (with quantities and prices)
- Total amount
- Order date/time

---

## 🔐 Security Notes

### Production Deployment

Before going live:

1. **Move credentials to environment variables:**
   ```env
   # .env file
   REACT_APP_EMAILJS_SERVICE_ID=service_l74orya
   REACT_APP_EMAILJS_TEMPLATE_ID=template_amj7dsr
   REACT_APP_EMAILJS_PUBLIC_KEY=9OIsKA0azrLjTtNZy
   ```

2. **Update Firestore security rules:**
   ```javascript
   match /orders/{orderId} {
     allow read, write: if request.auth != null && 
       request.auth.token.admin == true;
     allow read: if request.auth != null && 
       resource.data.userId == request.auth.uid;
   }
   ```

3. **Enable HTTPS** for production domain

4. **Set up email alerts** for failed deliveries

---

## 📱 Mobile Testing

Test on mobile devices:

1. **Customer Flow:**
   - [ ] Add to cart works
   - [ ] Checkout button accessible
   - [ ] Address modal displays correctly
   - [ ] Keyboard doesn't hide modal
   - [ ] Success message visible

2. **Admin Flow:**
   - [ ] Login works on mobile
   - [ ] Orders table scrolls horizontally
   - [ ] Search and filter accessible
   - [ ] Modals display correctly
   - [ ] Email modal keyboard-friendly

---

## 🎓 Training for Father/Admin

### Daily Tasks:

1. **Check for New Orders:**
   - Check Gmail for "New Order Received" emails
   - Or login to admin panel and check `/admin/orders`

2. **Process Orders:**
   - View order details (click eye icon)
   - Note delivery address
   - Update status to "Processing"
   - Prepare and ship order
   - Update status to "Completed"

3. **Contact Customers:**
   - Click mail icon on order
   - Write message (e.g., "Your order has shipped")
   - Send email

4. **Search Orders:**
   - Use search box for Order ID or customer name
   - Filter by status to see pending orders

### Weekly Tasks:

1. Review completed orders
2. Check for any pending orders
3. Monitor EmailJS usage (dashboard)
4. Backup order data if needed

---

## ✅ Success Indicators

System is working when you see:

### In Browser Console:
```
✅ Order saved to Firestore
✅ Order notification sent to admin email
```

### In Father's Gmail:
- Email with subject "New Order Received – Vaibhav Tools"
- Contains all order details
- Delivery address clearly visible

### In Admin Panel:
- Order appears in table
- All fields populated correctly
- Delivery address in blue box
- Can update status
- Can send email to customer

---

## 🆘 Need Help?

### Check These First:

1. **Browser Console** - Look for error messages
2. **EmailJS Dashboard** - Check delivery status
3. **Firestore Console** - Verify order saved
4. **Network Tab** - Check for failed requests

### Common Issues:

**"Email not configured"**
- Update credentials in `emailService.js`

**"Order not appearing"**
- Check Firestore security rules
- Verify admin authentication

**"Address not showing"**
- Ensure customer entered address
- Check order document in Firestore

---

**Setup Time:** ~5 minutes  
**First Test:** ~2 minutes  
**Total:** ~7 minutes to fully operational

🎉 **You're ready to go!**
