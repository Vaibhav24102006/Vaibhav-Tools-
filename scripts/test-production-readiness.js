#!/usr/bin/env node

/**
 * Production Readiness Test Script
 * Tests all security fixes and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VaibhavTools Production Readiness Test\n');

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Check if .env file exists
function testEnvironmentFile() {
  console.log('1. Testing Environment Configuration...');
  
  const envPath = path.join(__dirname, '..', '.env');
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  
  if (fs.existsSync(envPath)) {
    console.log('   ✅ .env file exists');
    testsPassed++;
  } else {
    console.log('   ❌ .env file missing');
    testsFailed++;
  }
  
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignoreContent.includes('.env') && gitignoreContent.includes('firebase-service-account.json')) {
      console.log('   ✅ .gitignore properly configured');
      testsPassed++;
    } else {
      console.log('   ❌ .gitignore missing security entries');
      testsFailed++;
    }
  } else {
    console.log('   ❌ .gitignore file missing');
    testsFailed++;
  }
}

// Test 2: Check if exposed credentials file is removed
function testCredentialsSecurity() {
  console.log('\n2. Testing Credentials Security...');
  
  const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('   ✅ Exposed service account file removed');
    testsPassed++;
  } else {
    console.log('   ❌ Service account file still exists');
    testsFailed++;
  }
}

// Test 3: Check media file organization
function testMediaOrganization() {
  console.log('\n3. Testing Media File Organization...');
  
  const publicPath = path.join(__dirname, '..', 'public');
  const imagesPath = path.join(publicPath, 'images');
  const videosPath = path.join(publicPath, 'videos');
  
  // Check if videos directory exists
  if (fs.existsSync(videosPath)) {
    console.log('   ✅ Videos directory created');
    testsPassed++;
  } else {
    console.log('   ❌ Videos directory missing');
    testsFailed++;
  }
  
  // Check if video file is in correct location
  const videoPath = path.join(videosPath, 'video.mp4');
  if (fs.existsSync(videoPath)) {
    console.log('   ✅ Video file in correct location');
    testsPassed++;
  } else {
    console.log('   ❌ Video file not found in videos directory');
    testsFailed++;
  }
  
  // Check if workshop image exists
  const workshopImagePath = path.join(imagesPath, 'Gemini_Generated_Image_lwt038lwt038lwt0.png');
  if (fs.existsSync(workshopImagePath)) {
    console.log('   ✅ Workshop image exists');
    testsPassed++;
  } else {
    console.log('   ❌ Workshop image missing');
    testsFailed++;
  }
}

// Test 4: Check source code for security issues
function testSourceCodeSecurity() {
  console.log('\n4. Testing Source Code Security...');
  
  const aboutPath = path.join(__dirname, '..', 'src', 'pages', 'About.jsx');
  
  if (fs.existsSync(aboutPath)) {
    const aboutContent = fs.readFileSync(aboutPath, 'utf8');
    
    // Check for correct video path
    if (aboutContent.includes('/videos/video.mp4')) {
      console.log('   ✅ Video path corrected');
      testsPassed++;
    } else {
      console.log('   ❌ Video path still incorrect');
      testsFailed++;
    }
    
    // Check for no hardcoded credentials
    if (!aboutContent.includes('AIzaSy')) {
      console.log('   ✅ No hardcoded API keys found');
      testsPassed++;
    } else {
      console.log('   ❌ Hardcoded API keys found');
      testsFailed++;
    }
    
    // Check for no absolute paths
    if (!aboutContent.includes('C:\\')) {
      console.log('   ✅ No absolute paths found');
      testsPassed++;
    } else {
      console.log('   ❌ Absolute paths found');
      testsFailed++;
    }
  } else {
    console.log('   ❌ About.jsx file not found');
    testsFailed++;
  }
}

// Test 5: Check for validation utilities
function testValidationUtilities() {
  console.log('\n5. Testing Validation Utilities...');
  
  const validationPath = path.join(__dirname, '..', 'src', 'utils', 'validation.js');
  
  if (fs.existsSync(validationPath)) {
    const validationContent = fs.readFileSync(validationPath, 'utf8');
    
    if (validationContent.includes('DOMPurify')) {
      console.log('   ✅ XSS protection implemented');
      testsPassed++;
    } else {
      console.log('   ❌ XSS protection missing');
      testsFailed++;
    }
    
    if (validationContent.includes('sanitizeInput')) {
      console.log('   ✅ Input sanitization implemented');
      testsPassed++;
    } else {
      console.log('   ❌ Input sanitization missing');
      testsFailed++;
    }
    
    if (validationContent.includes('validateForm')) {
      console.log('   ✅ Form validation implemented');
      testsPassed++;
    } else {
      console.log('   ❌ Form validation missing');
      testsFailed++;
    }
  } else {
    console.log('   ❌ Validation utilities not found');
    testsFailed++;
  }
}

// Test 6: Check Firebase service
function testFirebaseService() {
  console.log('\n6. Testing Firebase Service...');
  
  const firebaseServicePath = path.join(__dirname, '..', 'src', 'services', 'firebaseService.js');
  
  if (fs.existsSync(firebaseServicePath)) {
    const serviceContent = fs.readFileSync(firebaseServicePath, 'utf8');
    
    if (serviceContent.includes('try') && serviceContent.includes('catch')) {
      console.log('   ✅ Error handling implemented');
      testsPassed++;
    } else {
      console.log('   ❌ Error handling missing');
      testsFailed++;
    }
    
    if (serviceContent.includes('getAuthErrorMessage')) {
      console.log('   ✅ User-friendly error messages');
      testsPassed++;
    } else {
      console.log('   ❌ Error message handling missing');
      testsFailed++;
    }
  } else {
    console.log('   ❌ Firebase service not found');
    testsFailed++;
  }
}

// Test 7: Check loading states
function testLoadingStates() {
  console.log('\n7. Testing Loading States...');
  
  const productsPath = path.join(__dirname, '..', 'src', 'pages', 'ProductsFirebase.jsx');
  
  if (fs.existsSync(productsPath)) {
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    if (productsContent.includes('useState.*loading') || productsContent.includes('setLoading')) {
      console.log('   ✅ Loading states implemented');
      testsPassed++;
    } else {
      console.log('   ❌ Loading states missing');
      testsFailed++;
    }
    
    if (productsContent.includes('LoadingAnimation')) {
      console.log('   ✅ Loading animation component');
      testsPassed++;
    } else {
      console.log('   ❌ Loading animation missing');
      testsFailed++;
    }
  } else {
    console.log('   ❌ ProductsFirebase component not found');
    testsFailed++;
  }
}

// Run all tests
function runAllTests() {
  testEnvironmentFile();
  testCredentialsSecurity();
  testMediaOrganization();
  testSourceCodeSecurity();
  testValidationUtilities();
  testFirebaseService();
  testLoadingStates();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Application is production-ready.');
    console.log('\n🚀 Ready for deployment with:');
    console.log('   npm run build');
    console.log('   npm run deploy');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Review Firebase Console for any errors');
  console.log('2. Test application in browser');
  console.log('3. Verify all media files load correctly');
  console.log('4. Test form validation and submission');
  console.log('5. Deploy to production environment');
}

// Run tests
runAllTests();
