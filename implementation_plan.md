# Bulk Product Import Implementation Plan

Implement a bulk product import feature for the Admin Dashboard allowing upload of Word, Excel, and CSV files.

## User Review Required
- **Backend Dependency**: Adding `multer`, `mammoth`, `xlsx`, `cheerio`.
- **Database**: Using `firebase-admin` (Firestore) for insertion. Ensure permissions allow `server.js` to write to `products` collection (verified: yes, it does).

## Proposed Changes

### Backend
#### [MODIFY] [server.js](file:///c:/Users/victus/OneDrive/Desktop/VaibhavTools/server.js)
- Import `multer`, `mammoth`, `xlsx`, `cheerio`, `fs`.
- Configure `multer` storage (temp uploads).
- Add POST `/api/admin/products/import` endpoint.
- Implement logic:
    - **Word (.docx)**: Use `mammoth` to convert to HTML, `cheerio` to parse table rows. Expects headers: Name, Category, Price, Brand, Description, Stock.
    - **Excel/CSV (.xlsx, .csv)**: Use `xlsx` to parse sheets to JSON.
    - Validate required fields.
    - Loop and insert into Firestore `products` collection.
    - Return success count and error details.

### Frontend
#### [MODIFY] [AdminProducts.jsx](file:///c:/Users/victus/OneDrive/Desktop/VaibhavTools/src/pages/admin/AdminProducts.jsx)
- Add "Import Products" button next to "Add Product".
- Import and use a new sub-component `BulkImportModal`.

#### [NEW] [BulkImportModal.jsx](file:///c:/Users/victus/OneDrive/Desktop/VaibhavTools/src/components/admin/BulkImportModal.jsx) 
- Simple modal with `<input type="file" />`.
- Accepts `.docx, .xlsx, .csv`.
- `handleUpload` function uses `fetch('/api/admin/products/import')` with `FormData`.
- Shows Loading (spinner) and Success/Error messages.

## Verification Plan

### Manual Verification
1.  **Start Server**: Run `npm run server` and `npm start`.
2.  **Navigate**: Go to Admin Dashboard -> Products.
3.  **Test Excel/CSV**:
    - Create `test_products.xlsx` with headers: `name`, `price`, `category`, `brand`, `inStock`.
    - Click "Import Products", select file, upload.
    - Verify products appear in the list.
4.  **Test Word**:
    - Create `test_products.docx` with a table containing same headers.
    - Upload and verify.
5.  **Test Validation**:
    - Upload file with missing required fields (e.g. no price).
    - Verify error message.
