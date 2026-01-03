const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Extract unique categories from Excel files
function extractCategoriesFromExcel(filePath) {
  try {
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    
    const categories = new Set();
    const columnNames = Object.keys(json[0] || {});
    
    // Find category column (case-insensitive)
    const categoryColumn = columnNames.find(col => 
      col.toLowerCase().includes('category') || 
      col.toLowerCase().includes('cat') ||
      col.toLowerCase().includes('type')
    );
    
    if (!categoryColumn) {
      console.log('Available columns:', columnNames);
      throw new Error('No category column found. Available columns: ' + columnNames.join(', '));
    }
    
    json.forEach((row, index) => {
      const rawCat = row[categoryColumn];
      if (rawCat && typeof rawCat === 'string') {
        const trimmed = rawCat.toString().trim();
        if (trimmed) categories.add(trimmed);
      }
    });
    
    return {
      categories: Array.from(categories).sort(),
      totalCount: json.length,
      columnUsed: categoryColumn,
      fileName: path.basename(filePath)
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    throw error;
  }
}

// Process all Excel files in a directory
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const excelFiles = files.filter(file => 
    file.endsWith('.xlsx') || file.endsWith('.xls')
  );
  
  if (excelFiles.length === 0) {
    console.log('No Excel files found in directory:', dirPath);
    return [];
  }
  
  const results = [];
  
  excelFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    console.log(`\nProcessing: ${file}`);
    
    try {
      const result = extractCategoriesFromExcel(filePath);
      results.push(result);
      
      console.log(`Found ${result.categories.length} unique categories`);
      console.log('Categories:', result.categories);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error.message);
    }
  });
  
  // Combine all unique categories
  const allCategories = new Set();
  results.forEach(result => {
    result.categories.forEach(cat => allCategories.add(cat));
  });
  
  return {
    files: results,
    allCategories: Array.from(allCategories).sort(),
    summary: {
      filesProcessed: results.length,
      totalCategories: allCategories.size,
      totalRows: results.reduce((sum, r) => sum + r.totalCount, 0)
    }
  };
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node extract-categories.js <file-or-directory-path>');
    console.log('Example: node extract-categories.js ./test_products.xlsx');
    console.log('Example: node extract-categories.js ./uploads/');
    process.exit(1);
  }
  
  const targetPath = args[0];
  const isDirectory = fs.statSync(targetPath).isDirectory();
  
  try {
    if (isDirectory) {
      const result = processDirectory(targetPath);
      console.log('\n=== SUMMARY ===');
      console.log(`Processed ${result.summary.filesProcessed} files`);
      console.log(`Found ${result.summary.totalCategories} unique categories across ${result.summary.totalRows} rows`);
      console.log('\nAll unique categories:');
      result.allCategories.forEach(cat => console.log(`  - ${cat}`));
      
      // Save to file
      const outputPath = path.join(__dirname, 'extracted-categories.json');
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`\nResults saved to: ${outputPath}`);
      
    } else {
      const result = extractCategoriesFromExcel(targetPath);
      console.log('\n=== RESULTS ===');
      console.log(`File: ${result.fileName}`);
      console.log(`Total rows: ${result.totalCount}`);
      console.log(`Column used: ${result.columnUsed}`);
      console.log(`Unique categories found: ${result.categories.length}`);
      console.log('\nCategories:');
      result.categories.forEach(cat => console.log(`  - ${cat}`));
      
      // Save to file
      const outputPath = path.join(__dirname, `categories-${Date.now()}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`\nResults saved to: ${outputPath}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  extractCategoriesFromExcel,
  processDirectory
};
