const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Vaibhav Tools Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server on port 5000...');
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n🌐 Starting frontend development server on port 3000...');
  const frontend = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend error:', error);
  });
}, 2000);

backend.on('error', (error) => {
  console.error('❌ Backend error:', error);
  console.log('\n💡 Make sure you have:');
  console.log('1. Installed dependencies: npm install');
  console.log('2. Set up Firebase credentials in firebase-service-account.json');
  console.log('3. Created .env file with JWT_SECRET');
});

console.log('\n📋 Access URLs:');
console.log('Frontend: http://localhost:3000');
console.log('Admin Panel: http://localhost:3000/admin/login');
console.log('Backend API: http://localhost:5000/api');
console.log('\n🔑 Admin account information:');
console.log('If you need an admin account for local development, use the make-admin script or follow the setup guide.');
console.log('Do NOT use default credentials in production.');
console.log('\n⏹️  Press Ctrl+C to stop both servers\n'); 