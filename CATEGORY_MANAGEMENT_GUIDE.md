# Category Management System

## Overview
This system helps normalize and manage product categories from Excel imports, ensuring consistency across your product database.

## Quick Start

### 1. Extract Categories from Your Excel Files
```bash
# Extract from single file
node scripts/extract-categories.js path/to/your/products.xlsx

# Extract from directory of Excel files
node scripts/extract-categories.js ./uploads/
```

### 2. Review and Normalize Categories
The extraction script will:
- Find all unique categories in your Excel files
- Save results to a JSON file
- Show you the raw categories that need normalization

### 3. Test Category Normalization
```javascript
const { processCategories } = require('./scripts/category-normalizer');

const rawCategories = ['Hand Tools', 'hand tools', 'POWER-TOOLS', 'Measuring Tool'];
const results = processCategories(rawCategories);

console.log(results.summary);
// Output: { total: 4, autoAccepted: 3, needReview: 1, createNew: 0, rejected: 0 }
```

## Category Normalization Rules

### Automatic Acceptance (Score ≥ 0.8)
- Exact matches: "Hand Tools" → "hand tools"
- Minor variations: "hand tools" → "hand tools"
- Common typos: "hand tool" → "hand tools"

### Manual Review (Score 0.5-0.8)
- Similar but uncertain: "power toolz" → "power tools" (score: 0.75)
- Partial matches: "measuring" → "measuring tools" (score: 0.67)

### Create New Category (Score 0.3-0.5)
- New categories that don't match existing ones
- Will be flagged for admin approval

### Reject (Score < 0.3)
- Too different from existing categories
- May indicate data quality issues

## Integration with Product Upload

The server now automatically normalizes categories during product import:

1. **Extract** categories from uploaded Excel file
2. **Normalize** each category using the similarity algorithm
3. **Flag** low-confidence matches for admin review
4. **Store** both original and normalized categories

## Admin Workflow

### Step 1: Upload Products
- Upload your Excel file through the Admin dashboard
- System processes and normalizes categories automatically

### Step 2: Review Category Mappings
- Check the "Category Review" section in admin dashboard
- Approve or reject suggested mappings
- Add new canonical categories if needed

### Step 3: Finalize Import
- Once categories are approved, complete the import
- Products are stored with normalized categories

## Canonical Categories List

Current canonical categories (can be expanded):
- hand tools
- power tools
- measuring tools
- cutting tools
- fasteners
- safety equipment
- electrical tools
- plumbing tools
- automotive tools
- woodworking tools
- gardening tools
- welding tools
- painting tools
- cleaning tools
- storage solutions
- test equipment
- dies taps
- hammers
- screwdrivers
- wrenches
- pliers
- saws
- drills
- grinders
- sanders

## Adding New Canonical Categories

### Option 1: Update the Code
Edit `scripts/category-normalizer.js` and add to the `canonicalCategories` array.

### Option 2: Use Firestore (Recommended)
Store canonical categories in Firestore for dynamic management:

```javascript
// Add to Firestore
await db.collection('canonical_categories').add({
  name: 'new category',
  normalized: 'new category',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

## Troubleshooting

### Server Won't Start
- Ensure `serviceAccountKey.json` exists in project root
- Check Firebase credentials are valid
- Verify `.env` file has required variables

### Category Not Found
- Check Excel column headers (must contain "category", "cat", or "type")
- Ensure categories are not empty strings
- Verify Excel file format (`.xlsx` or `.xls`)

### Low Similarity Scores
- Review canonical categories list
- Consider adding new categories
- Check for typos in source data

## API Endpoints

### Get Category Mappings
```
GET /api/admin/category-mappings
```

### Update Category Mapping
```
POST /api/admin/category-mappings
{
  "original": "power toolz",
  "canonical": "power tools",
  "approved": true
}
```

### Get Import Statistics
```
GET /api/admin/import-stats
```

## Best Practices

1. **Regular Category Review**: Monthly review of new categories
2. **Consistent Naming**: Use lowercase, plural form for canonical categories
3. **Documentation**: Keep a spreadsheet of approved category mappings
4. **Testing**: Test normalization with sample data before bulk imports
5. **Backup**: Export category mappings regularly

## Example Usage

```javascript
// Process categories from your Excel import
const { processCategories } = require('./scripts/category-normalizer');

const rawCategories = [
  'Hand Tools',
  'POWER-TOOLS', 
  'Measuring Tool',
  'safety equipment',
  'unknown category'
];

const results = processCategories(rawCategories, {
  autoAcceptThreshold: 0.8,
  reviewThreshold: 0.5
});

console.log('Summary:', results.summary);
console.log('Need review:', results.unmatchedCategories);

// Output:
// Summary: { total: 5, autoAccepted: 4, needReview: 1, createNew: 0, rejected: 0 }
// Need review: [{ original: 'unknown category', category: 'tools', score: 0.4, action: 'review' }]
```
