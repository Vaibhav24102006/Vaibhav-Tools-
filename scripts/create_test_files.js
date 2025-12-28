const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const products = [
    {
        Name: 'Test Hammer',
        Category: 'Hand Tools',
        Price: 19.99,
        Brand: 'TestBrand',
        Description: 'A heavy duty test hammer',
        Stock: 50
    },
    {
        Name: 'Test Drill',
        Category: 'Power Tools',
        Price: 99.99,
        Brand: 'PowerTest',
        Description: 'Cordless drill for testing',
        Stock: 20
    }
];

// Create CSV
const csvContent = Object.keys(products[0]).join(',') + '\n' +
    products.map(p => Object.values(p).join(',')).join('\n');

fs.writeFileSync('test_products.csv', csvContent);
console.log('Created test_products.csv');

// Create XLSX
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(products);
XLSX.utils.book_append_sheet(wb, ws, 'Products');
XLSX.writeFile(wb, 'test_products.xlsx');
console.log('Created test_products.xlsx');
