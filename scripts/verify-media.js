
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Media Files...');
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

const requiredFiles = [
  'Gemini_Generated_Image_lwt038lwt038lwt0.png',
  'video.mp4'
];

let allGood = true;
requiredFiles.forEach(file => {
  const filePath = path.join(publicImagesDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ ${file} (${sizeInMB} MB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n🎉 All required media files are present!');
} else {
  console.log('\n⚠️  Some files are missing. Please check the setup guide.');
}
