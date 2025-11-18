# Order & Communication Agent - Vaibhav Tools

## 🎯 System Overview

The Order & Communication Agent automatically handles all customer orders, sending notifications to your father's Gmail account and synchronizing with the Admin Panel.

---

## 📧 EmailJS Configuration

### Current Setup

**Service ID:** `service_l74orya`  
**Template ID:** `template_amj7dsr`  
**Public Key:** `9OIsKA0azrLjTtNZy`

These credentials are configured in `/src/services/emailService.js` and will send all order notifications to the Gmail account linked to your EmailJS service.

### Email Template Variables

Your EmailJS template should include these variables:

```
{{order_id}}           - Order ID (e.g., ORD-1234567890)
{{order_date}}         - Formatted order date
{{order_total}}        - Total amount (₹)
{{customer_name}}      - Customer's name
{{customer_email}}     - Customer's email
{{customer_address}}   - Delivery address
{{product_list}}       - Formatted list of products
{{product_name}}       - First product name
{{product_price}}      - First product price
{{subject}}            - Email subject
{{message}}            - Additional message
```

### Recommended Email Template

**Subject:** `New Order Received – Vaibhav Tools`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #E10600; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .order-info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #E10600; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .label { font-weight: bold; color: #E10600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 New Order Received!</h1>
            <p>Vaibhav Tools</p>
        </div>
        
        <div class="content">
            <h2>Order Details</h2>
            
            <div class="order-info">
                <p><span class="label">Order ID:</span> {{order_id}}</p>
                <p><span class="label">Date:</span> {{order_date}}</p>
                <p><span class="label">Total Amount:</span> {{order_total}}</p>
            </div>
            
            <h3>Customer Information</h3>
            <div class="order-info">
                <p><span class="label">Name:</span> {{customer_name}}</p>
                <p><span class="label">Email:</span> {{customer_email}}</p>
                <p><span class="label">Delivery Address:</span><br>{{customer_address}}</p>
            </div>
            
            <h3>Products Ordered</h3>
            <div class="order-info">
                <pre style="white-space: pre-line; font-family: Arial;">{{product_list}}</pre>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
                <p><strong>Action Required:</strong></p>
                <p>Please check the Admin Panel at <a href="https://your-domain.com/admin/orders">Admin Orders</a> to process this order.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Vaibhav Tools</p>
            <p>Do not reply to this email</p>
        </div>
    </div>
</body>
</html>
```

---

## 🔄 Order Flow

### 1. Customer Places Order

**Steps:**
1. Customer adds products to cart
2. Clicks "Proceed to Checkout"
3. Must be signed in (redirected to login if not)
4. Address modal appears
5. Customer enters complete delivery address
6. Clicks "Confirm Order"

**What Happens:**
```javascript
// Order data collected:
{
  orderId: "ORD-1729389600000",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerAddress: "123 Main St\nMumbai, Maharashtra\n400001",
  items: [
    {
      id: "prod123",
      name: "Bosch Drill Machine",
      price: 2999,
      quantity: 1,
      image: "https://..."
    }
  ],
  subtotal: 2999,
  shipping: 0,
  tax: 239.92,
  discount: 0,
  totalAmount: 3238.92,
  date: "2025-10-20T04:00:00.000Z",
  status: "pending"
}
```

### 2. System Processing

**Automatic Actions:**

✅ **Step 1: Save to Firestore**
```javascript
await adminFirestore.createOrder(orderData);
console.log('✅ Order saved to Firestore');
```

✅ **Step 2: Send Email to Father's Gmail**
```javascript
await emailService.sendOrderNotificationToAdmin(orderData);
console.log('✅ Order notification sent to admin email');
```

✅ **Step 3: Clear Cart**
```javascript
clearCart();
setCustomerAddress('');
```

✅ **Step 4: Show Confirmation**
```
✅ Order placed successfully!

Order ID: ORD-1729389600000
Total: ₹3238.92

You will receive a confirmation email shortly.
Thank you for your purchase!
```

### 3. Admin Notification

**Father's Gmail receives:**
- **Subject:** "New Order Received – Vaibhav Tools"
- **Content:**
  - Order ID
  - Customer name, email, address
  - Product list with prices
  - Total amount
  - Order date/time

### 4. Admin Panel Synchronization

**Order appears in `/admin/orders` with:**
- All order details
- Customer information
- Delivery address
- Product list
- Order status (Pending)

---

## 🎛️ Admin Panel Features

### Accessing Orders

1. **Login to Admin Panel**
   - Navigate to `/admin-login`
   - Enter admin credentials

2. **View Orders**
   - Click "Customer Orders" in sidebar
   - Or navigate to `/admin/orders`

### Order Management

#### Search Orders
- Search by Order ID: `ORD-1729389600000`
- Search by Customer Name: `John Doe`
- Search by Email: `john@example.com`

#### Filter Orders
- **All Statuses** - Show all orders
- **Pending** - New orders awaiting processing
- **Processing** - Orders being prepared
- **Completed** - Fulfilled orders
- **Cancelled** - Cancelled orders

#### View Order Details
1. Click the **Eye icon** (👁️) on any order
2. Modal shows:
   - Order ID and date
   - Customer name and email
   - **Delivery address** (highlighted in blue)
   - Complete product list with images
   - Order summary (subtotal, shipping, tax, total)

#### Update Order Status
1. Click the status dropdown in the table
2. Select new status:
   - **Pending** → Order received
   - **Processing** → Preparing order
   - **Completed** → Order shipped/delivered
   - **Cancelled** → Order cancelled

#### Email Customer
1. Click the **Mail icon** (✉️) on any order
2. Email modal opens with:
   - Customer info pre-filled
   - Subject field
   - Message field
3. Write your message
4. Click "Send Email"
5. Customer receives email via EmailJS

#### Delete Order
1. Click the **Trash icon** (🗑️)
2. Confirm deletion
3. Order removed from system

---

## 🧪 Email Test Panel

### Purpose
Test EmailJS integration without placing real orders.

### How to Use

1. **Access Test Panel**
   - Navigate to `/admin/email-test`
   - Or click "Email Test" in admin sidebar

2. **Check Configuration**
   - Verify "Status: Configured" shows green checkmark
   - If not configured, update credentials in `.env` or `emailService.js`

3. **Send Test Email**
   - Fill in:
     - **Recipient Name:** Test User
     - **Recipient Email:** Your test email
     - **Message:** Test message content
   - Click "Send Test Email"

4. **Verify Delivery**
   - Check recipient inbox
   - Look for email from Vaibhav Tools
   - Check spam folder if not in inbox

5. **Troubleshooting**
   - If email fails, check:
     - EmailJS credentials are correct
     - EmailJS service is active
     - Monthly limit not exceeded (200 emails/month free)
     - Template variables match

---

## 📊 Order Data Structure

### Complete Order Schema

```javascript
{
  // Firestore document ID (auto-generated)
  id: "firestore_doc_id",
  
  // Order identification
  orderId: "ORD-1729389600000",
  
  // Customer details
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerAddress: "123 Main Street\nMumbai, Maharashtra\n400001",
  userId: "firebase_user_id",
  
  // Order items
  items: [
    {
      id: "product_id",
      name: "Product Name",
      price: 2999,
      quantity: 1,
      image: "https://firebase.storage.url/image.jpg"
    }
  ],
  
  // Pricing breakdown
  subtotal: 2999,
  shipping: 0,
  tax: 239.92,
  discount: 0,
  totalAmount: 3238.92,
  
  // Order metadata
  date: "2025-10-20T04:00:00.000Z",
  status: "pending", // pending | processing | completed | cancelled
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔐 Security & Privacy

### Email Security

✅ **Environment Variables (Recommended)**
```env
# Add to .env file
REACT_APP_EMAILJS_SERVICE_ID=service_l74orya
REACT_APP_EMAILJS_TEMPLATE_ID=template_amj7dsr
REACT_APP_EMAILJS_PUBLIC_KEY=9OIsKA0azrLjTtNZy
```

✅ **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      // Admins can read/write all orders
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
      
      // Users can only read their own orders
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### Customer Data Protection

- Customer addresses stored securely in Firestore
- Only admin can view all orders
- Customers can only view their own orders
- Email notifications sent via secure EmailJS service

---

## 📱 Mobile Responsiveness

All admin features work on mobile:
- ✅ Order table scrolls horizontally
- ✅ Modals adapt to screen size
- ✅ Touch-friendly buttons
- ✅ Responsive search and filters

---

## 🔔 Notification System

### Current Notifications

1. **Email to Father's Gmail**
   - Sent immediately when order placed
   - Contains all order details
   - Subject: "New Order Received – Vaibhav Tools"

2. **Customer Confirmation**
   - Alert message on screen
   - Shows order ID and total
   - Redirects to products page

3. **Admin Panel Update**
   - Order appears immediately in `/admin/orders`
   - Real-time synchronization with Firestore

### Future Enhancements

Potential additions:
- SMS notifications
- WhatsApp notifications
- Browser push notifications
- Customer email confirmations
- Order status update emails

---

## 🧪 Testing Checklist

### Before Going Live

- [ ] **EmailJS Configuration**
  - [ ] Service ID correct
  - [ ] Template ID correct
  - [ ] Public Key correct
  - [ ] Template variables match
  - [ ] Father's Gmail linked to EmailJS

- [ ] **Test Email Delivery**
  - [ ] Access `/admin/email-test`
  - [ ] Send test email
  - [ ] Verify delivery to father's Gmail
  - [ ] Check email formatting

- [ ] **Test Order Flow**
  - [ ] Add products to cart
  - [ ] Proceed to checkout
  - [ ] Enter delivery address
  - [ ] Confirm order
  - [ ] Verify order saved to Firestore
  - [ ] Verify email sent to father's Gmail
  - [ ] Check order appears in `/admin/orders`

- [ ] **Test Admin Features**
  - [ ] View order details
  - [ ] Update order status
  - [ ] Search for orders
  - [ ] Filter by status
  - [ ] Send email to customer
  - [ ] Delete test order

- [ ] **Test Mobile Experience**
  - [ ] Place order on mobile
  - [ ] View orders on mobile admin
  - [ ] Update status on mobile
  - [ ] Send email on mobile

---

## 🚨 Troubleshooting

### Email Not Received

**Problem:** Father's Gmail doesn't receive order notification

**Solutions:**
1. Check EmailJS dashboard for delivery status
2. Verify service is active (not paused)
3. Check monthly limit (200 emails/month free tier)
4. Look in spam/junk folder
5. Verify Gmail is correctly linked in EmailJS
6. Check browser console for errors
7. Test with `/admin/email-test` panel

### Order Not Appearing in Admin Panel

**Problem:** Order doesn't show in `/admin/orders`

**Solutions:**
1. Check Firestore console for order document
2. Verify Firestore security rules
3. Refresh admin panel page
4. Check browser console for errors
5. Verify admin authentication
6. Check network tab for failed requests

### Address Not Showing

**Problem:** Delivery address missing in order details

**Solutions:**
1. Ensure customer entered address before confirming
2. Check order data in Firestore
3. Verify `customerAddress` field exists
4. Update old orders manually if needed

### Email Sending Fails

**Problem:** Email service returns error

**Solutions:**
1. Verify EmailJS credentials
2. Check internet connection
3. Verify template exists in EmailJS dashboard
4. Check template variables match
5. Review EmailJS error logs
6. Ensure account is not suspended

---

## 📈 Monitoring & Analytics

### What to Monitor

1. **Order Volume**
   - Track daily/weekly orders
   - Monitor peak times
   - Identify trends

2. **Email Delivery**
   - Check EmailJS dashboard
   - Monitor delivery rates
   - Track failed deliveries

3. **Order Status**
   - Pending orders count
   - Processing time
   - Completion rate

4. **Customer Data**
   - Popular products
   - Average order value
   - Repeat customers

### EmailJS Dashboard

Access: https://dashboard.emailjs.com/

Monitor:
- Total emails sent
- Remaining monthly quota
- Delivery success rate
- Failed deliveries
- Service status

---

## 🎓 Quick Reference

### Key URLs

- **Admin Login:** `/admin-login`
- **Customer Orders:** `/admin/orders`
- **Email Test:** `/admin/email-test`
- **EmailJS Dashboard:** https://dashboard.emailjs.com/

### Key Functions

```javascript
// Send order notification to admin
await emailService.sendOrderNotificationToAdmin(orderData);

// Send email to customer
await emailService.sendCustomerEmail({
  customerName,
  customerEmail,
  subject,
  message,
  orderId
});

// Create order
await adminFirestore.createOrder(orderData);

// Get all orders
const orders = await adminFirestore.getOrders();

// Update order status
await adminFirestore.updateOrderStatus(orderId, 'completed');
```

### Order Status Values

- `pending` - New order, awaiting processing
- `processing` - Order being prepared
- `completed` - Order fulfilled
- `cancelled` - Order cancelled

---

## ✅ Success Criteria

System is working correctly when:

- ✅ Customer can place order with address
- ✅ Order saves to Firestore immediately
- ✅ Email notification sent to father's Gmail
- ✅ Order appears in admin panel
- ✅ Admin can view all order details including address
- ✅ Admin can update order status
- ✅ Admin can email customer
- ✅ Search and filter work correctly
- ✅ Email test panel works
- ✅ Mobile experience is smooth

---

## 📞 Support

### Common Questions

**Q: How do I know if an email was sent?**  
A: Check browser console for "✅ Order notification sent to admin email" message. Also check EmailJS dashboard.

**Q: Can I change the email recipient?**  
A: Yes, update the Gmail account linked in your EmailJS service settings.

**Q: What if I exceed the 200 email limit?**  
A: Upgrade to EmailJS paid plan or use a different email service.

**Q: Can customers track their orders?**  
A: Currently, only admin can see orders. Customer order tracking can be added as a future feature.

**Q: How do I backup order data?**  
A: Export from Firestore console or implement a backup script.

---

**Last Updated:** 2025-10-20  
**Version:** 1.0  
**Status:** ✅ Production Ready

---

## 🎉 Summary

The Order & Communication Agent provides:

1. **Automatic Order Processing**
   - Collects customer details and address
   - Saves to Firestore
   - Sends email to father's Gmail

2. **Admin Panel Synchronization**
   - Real-time order updates
   - Complete order management
   - Customer communication tools

3. **Email Verification**
   - Test panel for safe testing
   - Configuration validation
   - Delivery confirmation

**Everything is synchronized between:**
- Customer orders → Firestore → Admin Panel → Father's Gmail

All order information (who ordered what, for how much, and where to deliver) is clearly visible in both the Admin Panel and email notifications.
