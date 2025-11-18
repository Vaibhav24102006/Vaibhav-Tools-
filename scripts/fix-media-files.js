const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Media Files for VaibhavTools');
console.log('======================================\n');

// Ensure public/images directory exists
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log('✅ Created public/images directory');
}

// Source directory
const sourceImagesDir = path.join(__dirname, '..', 'images');

// Required files
const requiredFiles = [
  {
    source: 'Gemini_Generated_Image_lwt038lwt038lwt0.png',
    dest: 'Gemini_Generated_Image_lwt038lwt038lwt0.png',
    type: 'image'
  },
  {
    source: 'video.mp4',
    dest: 'video.mp4',
    type: 'video'
  }
];

let allGood = true;

console.log('📁 Checking and copying required files...\n');

requiredFiles.forEach(file => {
  const sourcePath = path.join(sourceImagesDir, file.source);
  const destPath = path.join(publicImagesDir, file.dest);
  
  if (fs.existsSync(sourcePath)) {
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    
    // Check file size
    const stats = fs.statSync(destPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ ${file.type.toUpperCase()}: ${file.dest} (${sizeInMB} MB)`);
    
    // Verify the file is not a placeholder (should be > 1KB)
    if (stats.size < 1024) {
      console.log(`⚠️  WARNING: ${file.dest} is very small (${stats.size} bytes) - might be a placeholder`);
      allGood = false;
    }
  } else {
    console.log(`❌ ERROR: Source file not found: ${sourcePath}`);
    allGood = false;
  }
});

// Remove any placeholder files
console.log('\n🧹 Cleaning up placeholder files...');
const filesToRemove = [
  'Gemini_Generated_Image_lwt038lwt038lwt0.webp',
  'video.webm'
];

filesToRemove.forEach(file => {
  const filePath = path.join(publicImagesDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size < 1024) { // Remove files smaller than 1KB
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed placeholder: ${file}`);
    }
  }
});

// List all files in public/images
console.log('\n📋 Files in public/images/:');
const files = fs.readdirSync(publicImagesDir);
files.forEach(file => {
  const filePath = path.join(publicImagesDir, file);
  const stats = fs.statSync(filePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  const status = stats.size > 1024 ? '✅' : '⚠️';
  console.log(`${status} ${file}: ${sizeInMB} MB`);
});

console.log('\n🔍 Verification Summary:');
console.log('=======================');

if (allGood) {
  console.log('✅ All required media files are present and properly sized');
  console.log('✅ Files are accessible at /images/ in your React app');
  console.log('✅ Ready for testing');
} else {
  console.log('❌ Some issues were found. Please check the errors above.');
}

console.log('\n📝 Next Steps:');
console.log('1. Start your React development server');
console.log('2. Navigate to the About page');
console.log('3. Check browser console for any errors');
console.log('4. If issues persist, open debug-media.html in your browser');

// Create a simple test URL
console.log('\n🌐 Test URLs:');
console.log(`Image: http://localhost:3000/images/Gemini_Generated_Image_lwt038lwt038lwt0.png`);
console.log(`Video: http://localhost:3000/images/video.mp4`);
console.log(`Debug: http://localhost:3000/debug-media.html`); 