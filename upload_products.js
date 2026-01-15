const fs = require('fs');
const csv = require('fast-csv');
const axios = require('axios');
const FormData = require('form-data');

// Config
const INPUT = process.env.INPUT || 'test_products.csv';
const FIXED = process.env.FIXED || 'test_products_fixed.csv';
const API_URL = process.env.API_URL || 'http://localhost:5050/api/admin/products/import';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null; // Optional: set to your admin token if required

const rows = [];
let rowCount = 0;
let fixedCount = 0;

fs.createReadStream(INPUT)
  .pipe(csv.parse({ headers: true, trim: true }))
  .on('error', (error) => {
    console.error('Error reading CSV:', error);
    process.exit(1);
  })
  .on('data', (row) => {
    rowCount++;
    const fixedRow = {
      Name: row.Name || '',
      Category: row.Category || '',
      // Price: default to "1" if missing/blank
      Price: row.Price && row.Price.toString().trim() !== '' ? row.Price : '1',
      // Brand: default to "VaibhavTools" if missing/blank
      Brand: row.Brand && row.Brand.toString().trim() !== '' ? row.Brand : 'VaibhavTools',
      Description: row.Description || '',
      Stock: row.Stock || ''
    };

    if ((row.Price === undefined || row.Price === '' || row.Price.toString().trim() === '') ||
        (row.Brand === undefined || row.Brand === '' || row.Brand.toString().trim() === '')) {
      fixedCount++;
    }

    rows.push(fixedRow);
  })
  .on('end', async () => {
    // Write fixed CSV with exact header order
    const ws = fs.createWriteStream(FIXED);
    csv.write(rows, { headers: ['Name','Category','Price','Brand','Description','Stock'] }).pipe(ws);

    ws.on('finish', async () => {
      console.log(`Cleaned CSV generated: ${FIXED} (rows: ${rowCount}, modified: ${fixedCount})`);

      // Upload to server
      try {
        const form = new FormData();
        form.append('file', fs.createReadStream(FIXED));

        const headers = form.getHeaders();
        if (ADMIN_TOKEN) headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;

        console.log(`Uploading to ${API_URL} ${ADMIN_TOKEN ? 'with ADMIN_TOKEN' : '(no auth)'}...`);

        const res = await axios.post(API_URL, form, { headers, maxBodyLength: Infinity, maxContentLength: Infinity });

        console.log('Upload response:', res.data);
      } catch (err) {
        console.error('Upload failed:', err.response?.data || err.message);
        process.exit(1);
      }
    });
  });
