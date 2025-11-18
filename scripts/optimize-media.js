const fs = require('fs');
const path = require('path');

// Ensure public/images directory exists
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy image files from images/ to public/images/
const sourceImagesDir = path.join(__dirname, '..', 'images');
const imageFiles = [
  'Gemini_Generated_Image_lwt038lwt038lwt0.png'
];

imageFiles.forEach(file => {
  const sourcePath = path.join(sourceImagesDir, file);
  const destPath = path.join(publicImagesDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to public/images/`);
  } else {
    console.log(`❌ Source file not found: ${sourcePath}`);
  }
});

// Copy video files from images/ to public/images/
const videoFiles = [
  'video.mp4',
  'Video_Generation_Industrial_Tools_Showcase.mp4',
  'Vaibhav_Tools_Video_Generation_Requests.mp4',
  'Premium_Marketing_Video_Generation.mp4',
  'Futuristic_Tool_Craftsmanship_Video_Generation.mp4'
];

videoFiles.forEach(file => {
  const sourcePath = path.join(sourceImagesDir, file);
  const destPath = path.join(publicImagesDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to public/images/`);
  } else {
    console.log(`❌ Source file not found: ${sourcePath}`);
  }
});

console.log('\n🎉 Media optimization complete!');
console.log('📁 Files are now available in public/images/');
console.log('🌐 They will be accessible at /images/ in your React app'); 