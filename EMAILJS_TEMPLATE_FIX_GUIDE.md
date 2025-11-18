# 🔧 EmailJS Template Fix Guide

## 🚨 CRITICAL ISSUE: "The recipients address is empty"

This error occurs because the EmailJS template is not properly configured with the `{{to_email}}` parameter.

---

## ✅ **STEP-BY-STEP FIX**

### **1. Access EmailJS Dashboard**
1. Go to: https://dashboard.emailjs.com/
2. Sign in to your account
3. Navigate to **Email Templates**

### **2. Find Your Template**
- Look for template ID: `template_amj7dsr`
- Click on the template to edit it

### **3. Configure Template Parameters**
In the **Template Parameters** section, ensure these parameters exist:

```
to_email          ← CRITICAL: Must exist
to_name           ← Required
order_id          ← Required
customer_name     ← Required
customer_email    ← Required
order_total       ← Required
product_list      ← Required
message          ← Required
```

### **4. Set Email Recipients**
In the **Email Settings** section:

**To Email:** `{{to_email}}`
**To Name:** `{{to_name}}`
**Subject:** `New Order: {{order_id}}`

### **5. Template Content Example**
```html
<h2>New Order Received</h2>
<p><strong>Order ID:</strong> {{order_id}}</p>
<p><strong>Customer:</strong> {{customer_name}}</p>
<p><strong>Email:</strong> {{customer_email}}</p>
<p><strong>Total:</strong> {{order_total}}</p>

<h3>Products:</h3>
<pre>{{product_list}}</pre>

<p>{{message}}</p>
```

### **6. Save Template**
- Click **Save** to apply changes
- Test the template with sample data

---

## 🧪 **TESTING THE FIX**

### **1. Test in Admin Panel**
1. Go to: `http://localhost:3000/admin/email-test`
2. Fill in test data
3. Click "Send Test Email"
4. Check console logs for detailed information

### **2. Expected Console Output**
```
[EmailJS] Template params prepared: {
  to_email: 'vaibhavtools@gmail.com',
  orderId: 'TEST-123',
  customerName: 'Test Customer',
  ...
}
[EmailJS] Full template params: { ... }
✅ [EmailJS] Order notification sent successfully
```

### **3. Check Email Delivery**
- Check `vaibhavtools@gmail.com` inbox
- Check spam folder if not received
- Verify email contains order details

---

## 🔍 **DEBUGGING STEPS**

### **If Still Getting "Recipients Address is Empty":**

1. **Check Template Parameters:**
   ```javascript
   // In browser console, check:
   console.log('Template params:', templateParams);
   console.log('to_email value:', templateParams.to_email);
   ```

2. **Verify EmailJS Configuration:**
   ```javascript
   // Check if config is loaded:
   console.log('Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
   console.log('Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
   console.log('Public Key:', process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
   ```

3. **Test with Minimal Template:**
   - Create a simple test template
   - Use only `{{to_email}}` and `{{message}}`
   - Test with basic parameters

### **Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| Template parameter missing | Add `{{to_email}}` to template |
| Wrong parameter name | Use exact parameter names from code |
| Template not saved | Save template in EmailJS dashboard |
| Service not connected | Check EmailJS service configuration |
| Wrong template ID | Verify template ID matches code |

---

## 📧 **ENVIRONMENT VARIABLES**

Ensure these are set in your `.env` file:

```env
REACT_APP_EMAILJS_SERVICE_ID=service_l74orya
REACT_APP_EMAILJS_TEMPLATE_ID=template_amj7dsr
REACT_APP_EMAILJS_PUBLIC_KEY=9OIsKA0azrLjTtNZy
REACT_APP_ADMIN_EMAIL=vaibhavtools@gmail.com
```

---

## 🎯 **SUCCESS INDICATORS**

✅ **Template configured correctly when:**
- Email is received at `vaibhavtools@gmail.com`
- Email contains order details
- No "recipients address is empty" error
- Console shows successful email sending

✅ **Order placement working when:**
- Order is saved to Firestore
- Stock is updated correctly
- Email notification is sent
- Cart is cleared after order
- Success message is displayed

---

## 🚀 **QUICK FIX SUMMARY**

1. **Go to EmailJS Dashboard** → Templates → `template_amj7dsr`
2. **Add Parameter:** `{{to_email}}` in template settings
3. **Set To Email:** `{{to_email}}` in email settings
4. **Save Template**
5. **Test in Admin Panel**
6. **Verify Email Delivery**

This should resolve the "recipients address is empty" error completely!

