# Product Normalization - Quick Start Guide

## 🚀 3-Step Process

### Step 1: Preview
```
1. Navigate to: http://localhost:3000/normalize-products
2. Click "Preview" tab
3. Click "👁️ Preview Changes"
4. Review what will change
```

### Step 2: Normalize
```
1. Click "Normalize" tab
2. Click "🚀 Normalize All Products"
3. Confirm the action
4. Wait for completion
```

### Step 3: Verify
```
1. Click "Verify" tab
2. Click "✓ Verify Products"
3. Check for any issues
```

---

## 📋 Standard Categories (7)

1. **Power & Hand Tools** - Drills, wrenches, screwdrivers, saws
2. **Painting & Air Tools** - Paint guns, spray guns, blowers, compressors
3. **Safety & Measurement** - Safety gear, measuring tapes, multimeters
4. **Garden & Outdoor** - Lawn mowers, trimmers, outdoor tools
5. **Cutting & Grinding** - Grinders, cutters, marble cutters, blades
6. **Fastening & Accessories** - Bits, clamps, fasteners, accessories
7. **Electrical Tools** - Soldering irons, testers, electrical equipment

---

## 🏷️ Standard Brands (5)

- Taparia
- Metro
- Indian Tools
- Bosch
- Vaibhav Tools (default)

---

## ✅ What Gets Fixed

- ✅ Categories → Standardized to 7 categories
- ✅ Brands → Standardized to 5 brands
- ✅ Prices → Invalid prices set to ₹999
- ✅ Images → Placeholders added if missing
- ✅ Fields → All required fields populated

---

## 🔍 Example Transformations

### Before:
```json
{
  "name": "High-speed drill",
  "category": "Drill Machines",
  "brand": "bosch tools",
  "price": 0
}
```

### After:
```json
{
  "name": "High-speed drill",
  "category": "Power & Hand Tools",
  "brand": "Bosch",
  "price": 999,
  "imageUrl": "https://placehold.co/400x400...",
  "stock": 100,
  "rating": 4.5
}
```

---

## ⚠️ Important

- **Backup first** (optional but recommended)
- **Preview before normalizing**
- **Verify after completion**
- **Test on `/products` page**

---

## 🧪 Testing

After normalization, test:
```
1. Visit /products
2. Check categories display correctly
3. Test category filtering
4. Test brand filtering
5. Verify prices show ₹ symbol
6. Check /debug-db for raw data
```

---

## 📊 Expected Results

```
Before: 
- Inconsistent categories
- Mixed brand names
- ~15% missing data

After:
- 7 standard categories
- 5 standard brands
- 100% complete data
```

---

## 🔗 Quick Links

- Normalizer: `/normalize-products`
- Products: `/products`
- Debug: `/debug-db`
- Admin: `/admin`

---

**Status:** ✅ Ready to use
**Time:** ~30 seconds for 100 products
