#!/usr/bin/env node

/**
 * Media Setup Verification Script
 * Verifies that all required media files are properly placed for About.jsx
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Vaibhav Tools About.jsx Media Setup...\n');

// File paths to check
const mediaFiles = [
  {
    path: './public/images/Gemini_Generated_Image_lwt038lwt038lwt0.png',
    type: 'Workshop Image',
    required: true,
    description: 'Used in "Our Story" section'
  },
  {
    path: './public/images/video.mp4',
    type: 'Background Video',
    required: true,
    description: 'Used in "Join Our Legacy" section'
  },
  {
    path: './public/images/Gemini_Generated_Image_lwt038lwt038lwt0.webp',
    type: 'Workshop Image (WebP)',
    required: false,
    description: 'Optional - 30% smaller file size'
  },
  {
    path: './public/images/video.webm',
    type: 'Background Video (WebM)',
    required: false,
    description: 'Optional - 50% smaller file size'
  }
];

// Component files to check
const componentFiles = [
  {
    path: './src/pages/About.jsx',
    type: 'React Component',
    required: true,
    description: 'Main About page component'
  },
  {
    path: './src/styles/About.css',
    type: 'Stylesheet',
    required: true,
    description: 'Cross-browser compatibility styles'
  }
];

let allRequired = true;
let totalSize = 0;

console.log('📁 Checking Media Files:');
console.log('=' .repeat(80));

mediaFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  const status = exists ? '✅' : (file.required ? '❌' : '⚠️');
  
  if (exists) {
    const stats = fs.statSync(file.path);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    totalSize += stats.size;
    
    console.log(`${status} ${file.type}`);
    console.log(`   Path: ${file.path}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`   Description: ${file.description}`);
  } else {
    console.log(`${status} ${file.type} - ${file.required ? 'MISSING (REQUIRED)' : 'Not Found (Optional)'}`);
    console.log(`   Expected: ${file.path}`);
    console.log(`   Description: ${file.description}`);
    
    if (file.required) {
      allRequired = false;
    }
  }
  console.log('');
});

console.log('📄 Checking Component Files:');
console.log('=' .repeat(80));

componentFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(file.path);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`${status} ${file.type}`);
    console.log(`   Path: ${file.path}`);
    console.log(`   Size: ${sizeKB} KB`);
    console.log(`   Description: ${file.description}`);
  } else {
    console.log(`${status} ${file.type} - MISSING`);
    console.log(`   Expected: ${file.path}`);
    allRequired = false;
  }
  console.log('');
});

// Summary
console.log('📊 Summary:');
console.log('=' .repeat(80));
console.log(`Total Media Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

if (allRequired) {
  console.log('🎉 SUCCESS: All required files are properly set up!');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('   1. Run: npm start');
  console.log('   2. Navigate to: http://localhost:3000/about');
  console.log('   3. Test the workshop image and background video');
  console.log('');
  console.log('💡 Optional Optimizations:');
  console.log('   - Convert PNG to WebP for 30% smaller files');
  console.log('   - Convert MP4 to WebM for 50% smaller files');
  console.log('   - See ABOUT_MEDIA_SETUP_GUIDE.md for instructions');
} else {
  console.log('⚠️  INCOMPLETE: Some required files are missing.');
  console.log('');
  console.log('🔧 Fix Required:');
  console.log('   1. Ensure files are in /public/images/ directory');
  console.log('   2. Check exact filenames (case-sensitive)');
  console.log('   3. See ABOUT_MEDIA_SETUP_GUIDE.md for complete setup');
}

console.log('');
console.log('📚 For detailed setup instructions, see:');
console.log('   → ABOUT_MEDIA_SETUP_GUIDE.md');
console.log('');
