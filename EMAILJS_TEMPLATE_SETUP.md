# 📧 EmailJS Template Setup Guide

## 🚨 CRITICAL: Template Configuration Required

The error **"The recipient's address is empty"** means your EmailJS template is missing the `to_email` variable.

---

## ✅ **Step-by-Step Fix**

### **Step 1: Go to EmailJS Dashboard**

1. Open: https://dashboard.emailjs.com/
2. Sign in with your account
3. Click on **"Email Templates"** in left sidebar

---

### **Step 2: Find Your Template**

1. Look for template: **`template_amj7dsr`**
2. Click on it to open the editor

---

### **Step 3: Add Required Variables**

On the **right-hand side**, you'll see "Template Parameters" section.

**Required Variables:**

```
✅ to_email          ← MUST EXIST (recipient)
✅ to_name           ← Admin name
✅ from_name         ← Customer/sender name
✅ from_email        ← Customer email
✅ reply_to          ← Reply-to address
✅ subject           ← Email subject
✅ message           ← Email body/message
✅ order_id          ← Order ID
✅ order_date        ← Order date
✅ order_total       ← Total amount
✅ customer_name     ← Customer name
✅ customer_email    ← Customer email
✅ customer_address  ← Delivery address
✅ product_list      ← List of products
```

---

### **Step 4: Template Content Example**

**Subject Line:**
```
{{subject}}
```

**Email Body:**
```html
<h2>🔔 New Order Received</h2>

<p>Hello {{to_name}},</p>

<p>A new order has been placed on Vaibhav Tools!</p>

<h3>Order Details:</h3>
<ul>
  <li><strong>Order ID:</strong> {{order_id}}</li>
  <li><strong>Date:</strong> {{order_date}}</li>
  <li><strong>Total Amount:</strong> {{order_total}}</li>
</ul>

<h3>Customer Information:</h3>
<ul>
  <li><strong>Name:</strong> {{customer_name}}</li>
  <li><strong>Email:</strong> {{customer_email}}</li>
  <li><strong>Delivery Address:</strong> {{customer_address}}</li>
</ul>

<h3>Products Ordered:</h3>
<pre>{{product_list}}</pre>

<hr>

<p><strong>Message:</strong></p>
<p>{{message}}</p>

<hr>

<p>Please prepare this order for delivery.</p>

<p>Best regards,<br>
Vaibhav Tools Website</p>
```

---

### **Step 5: Configure Recipient**

In the template settings:

**To Email:** `{{to_email}}`  
**To Name:** `{{to_name}}`  
**From Name:** `{{from_name}}`  
**Reply To:** `{{reply_to}}`

---

### **Step 6: Test Template**

1. Click **"Test It"** button in EmailJS dashboard
2. Fill in test values:
   ```
   to_email: your-email@gmail.com
   to_name: Test Admin
   from_name: Test Customer
   order_id: TEST-123
   order_total: ₹1500
   ```
3. Click **"Send Test"**
4. Check your inbox

---

## 🔧 **Code Already Updated**

Your code is already sending the correct parameters:

```javascript
const templateParams = {
  to_email: adminEmail,              // ✅ ADDED
  to_name: 'Vaibhav Tools Admin',    // ✅ ADDED
  order_id: orderId,
  order_date: formattedDate,
  order_total: `₹${totalAmount.toFixed(2)}`,
  customer_name: customerName,
  customer_email: customerEmail,
  customer_address: customerAddress,
  product_list: itemsList,
  subject: '🔔 New Order Received – Vaibhav Tools',
  from_name: 'Vaibhav Tools Website',
  reply_to: customerEmail,
  message: '...'
};
```

---

## ⚙️ **Environment Variable**

Add to your `.env` file:

```env
REACT_APP_ADMIN_EMAIL=vaibhavtools@gmail.com
```

Replace with your actual email address.

---

## 🧪 **Testing After Setup**

### **Test 1: Configuration Check**
```bash
npm start
# Go to: http://localhost:3000/admin/email-test
# Click: "🔍 Check Configuration"
# Should show: Admin Email (recipient): vaibhavtools@gmail.com
```

### **Test 2: Send Test Email**
```bash
# Click: "📧 Send Test Email"
# Expected console output:
[EmailJS] Sending to admin email: vaibhavtools@gmail.com
✅ [EmailJS] Order notification sent successfully
```

### **Test 3: Check Inbox**
- Open your Gmail
- Look for: "🔔 New Order Received – Vaibhav Tools"
- Verify all order details are present

---

## 🐛 **Troubleshooting**

### **Still getting "recipient's address is empty"?**

**Check 1:** Template has `{{to_email}}` variable
- Go to EmailJS dashboard
- Open template `template_amj7dsr`
- Look for `to_email` in variables list
- If missing, add it

**Check 2:** Template recipient field uses variable
- In template settings
- "To Email" field should be: `{{to_email}}`
- NOT a hardcoded email

**Check 3:** .env has admin email
```env
REACT_APP_ADMIN_EMAIL=your-email@gmail.com
```

**Check 4:** Server restarted after .env change
```bash
# Stop server (Ctrl+C)
npm start
```

---

## 📋 **Checklist**

Before testing, verify:

- [ ] EmailJS template `template_amj7dsr` exists
- [ ] Template has `to_email` variable
- [ ] Template "To Email" field is `{{to_email}}`
- [ ] `.env` has `REACT_APP_ADMIN_EMAIL`
- [ ] Server restarted after .env change
- [ ] Console shows admin email when sending

---

## 🎯 **Expected Flow**

```
1. User places order
   ↓
2. Code calls sendOrderNotificationToAdmin()
   ↓
3. Sets to_email = process.env.REACT_APP_ADMIN_EMAIL
   ↓
4. EmailJS receives template params with to_email
   ↓
5. Template uses {{to_email}} as recipient
   ↓
6. Email sent to admin inbox
   ↓
7. Success! ✅
```

---

## 📞 **Support**

If issues persist:

1. **Check EmailJS logs:** https://dashboard.emailjs.com/admin/logs
2. **Verify template:** Click "Test It" in dashboard
3. **Check console:** Look for `[EmailJS]` logs
4. **Check Firestore:** `emailEvents` collection for error details

---

**Status:** ✅ Code updated, template setup required  
**Next:** Configure template in EmailJS dashboard  
**Time:** 5 minutes
