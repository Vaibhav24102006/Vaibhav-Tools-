const admin = require('firebase-admin');

// Initialize Firebase Admin
// You need to download serviceAccountKey.json from Firebase Console
// Go to: Project Settings → Service Accounts → Generate New Private Key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// CHANGE THIS to your email
const email = '2024bcacsbvaibhav16738@poornima.edu.in';

async function setAdminClaim() {
  try {
    console.log(`Setting admin claim for: ${email}`);
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.uid}`);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('✅ Admin claim set successfully!');
    
    // Verify it was set
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('Custom claims:', updatedUser.customClaims);
    
    console.log('\n⚠️ IMPORTANT: User must sign out and sign in again for changes to take effect!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setAdminClaim();
