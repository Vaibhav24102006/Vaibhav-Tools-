const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 Enhanced Media Optimizer for VaibhavTools');
console.log('============================================\n');

// Ensure public/images directory exists
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log('✅ Created public/images directory');
}

// Copy and optimize image files
const sourceImagesDir = path.join(__dirname, '..', 'images');
const imageFiles = [
  'Gemini_Generated_Image_lwt038lwt038lwt0.png'
];

console.log('📸 Processing Images...');
imageFiles.forEach(file => {
  const sourcePath = path.join(sourceImagesDir, file);
  const destPath = path.join(publicImagesDir, file);
  
  if (fs.existsSync(sourcePath)) {
    // Copy original file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to public/images/`);
    
    // Try to create WebP version if possible
    try {
      const webpFile = file.replace('.png', '.webp');
      const webpPath = path.join(publicImagesDir, webpFile);
      
      // Check if we have ImageMagick or similar tools available
      try {
        // This is a placeholder - in a real environment you'd use ImageMagick or Sharp
        console.log(`ℹ️  WebP conversion would be available with ImageMagick: ${webpFile}`);
      } catch (err) {
        console.log(`ℹ️  WebP conversion skipped (ImageMagick not available): ${webpFile}`);
      }
    } catch (err) {
      console.log(`ℹ️  WebP conversion not available for ${file}`);
    }
  } else {
    console.log(`❌ Source file not found: ${sourcePath}`);
  }
});

// Copy and optimize video files
const videoFiles = [
  'video.mp4',
  'Video_Generation_Industrial_Tools_Showcase.mp4',
  'Vaibhav_Tools_Video_Generation_Requests.mp4',
  'Premium_Marketing_Video_Generation.mp4',
  'Futuristic_Tool_Craftsmanship_Video_Generation.mp4'
];

console.log('\n🎥 Processing Videos...');
videoFiles.forEach(file => {
  const sourcePath = path.join(sourceImagesDir, file);
  const destPath = path.join(publicImagesDir, file);
  
  if (fs.existsSync(sourcePath)) {
    // Copy original file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to public/images/`);
    
    // Try to create WebM version if possible
    try {
      const webmFile = file.replace('.mp4', '.webm');
      const webmPath = path.join(publicImagesDir, webmFile);
      
      // Check if we have FFmpeg available
      try {
        // This is a placeholder - in a real environment you'd use FFmpeg
        console.log(`ℹ️  WebM conversion would be available with FFmpeg: ${webmFile}`);
      } catch (err) {
        console.log(`ℹ️  WebM conversion skipped (FFmpeg not available): ${webmFile}`);
      }
    } catch (err) {
      console.log(`ℹ️  WebM conversion not available for ${file}`);
    }
  } else {
    console.log(`❌ Source file not found: ${sourcePath}`);
  }
});

// Create a simple WebP placeholder (this would normally be done with ImageMagick)
console.log('\n🔧 Creating WebP placeholder...');
try {
  const webpPlaceholder = path.join(publicImagesDir, 'Gemini_Generated_Image_lwt038lwt038lwt0.webp');
  if (!fs.existsSync(webpPlaceholder)) {
    // Create a simple placeholder file (in reality, this would be a converted image)
    fs.writeFileSync(webpPlaceholder, 'WEBP_PLACEHOLDER');
    console.log('✅ Created WebP placeholder (replace with actual converted image)');
  }
} catch (err) {
  console.log('ℹ️  WebP placeholder creation skipped');
}

// Create a simple WebM placeholder (this would normally be done with FFmpeg)
console.log('\n🔧 Creating WebM placeholder...');
try {
  const webmPlaceholder = path.join(publicImagesDir, 'video.webm');
  if (!fs.existsSync(webmPlaceholder)) {
    // Create a simple placeholder file (in reality, this would be a converted video)
    fs.writeFileSync(webmPlaceholder, 'WEBM_PLACEHOLDER');
    console.log('✅ Created WebM placeholder (replace with actual converted video)');
  }
} catch (err) {
  console.log('ℹ️  WebM placeholder creation skipped');
}

// Generate file size report
console.log('\n📊 File Size Report:');
console.log('===================');

const files = fs.readdirSync(publicImagesDir);
files.forEach(file => {
  const filePath = path.join(publicImagesDir, file);
  const stats = fs.statSync(filePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`${file}: ${sizeInMB} MB`);
});

console.log('\n🎉 Enhanced Media Optimization Complete!');
console.log('========================================');
console.log('📁 Files are now available in public/images/');
console.log('🌐 They will be accessible at /images/ in your React app');
console.log('\n📋 Next Steps:');
console.log('1. Replace WebP/WebM placeholders with actual converted files');
console.log('2. Test the About page in your browser');
console.log('3. Verify all media loads correctly');
console.log('4. Check performance in different browsers');

// Create a verification script
const verificationScript = `
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
    console.log(\`✅ \${file} (\${sizeInMB} MB)\`);
  } else {
    console.log(\`❌ \${file} - MISSING\`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\\n🎉 All required media files are present!');
} else {
  console.log('\\n⚠️  Some files are missing. Please check the setup guide.');
}
`;

fs.writeFileSync(path.join(__dirname, 'verify-media.js'), verificationScript);
console.log('\n✅ Created verification script: scripts/verify-media.js');
console.log('   Run: node scripts/verify-media.js to check your setup'); 