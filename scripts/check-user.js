const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = '2024bcacsbvaibhav16738@poornima.edu.in';

async function checkUser() {
  try {
    console.log(`Checking user: ${email}\n`);
    
    const user = await admin.auth().getUserByEmail(email);
    
    console.log('✅ User found!');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);
    console.log('Email Verified:', user.emailVerified);
    console.log('Disabled:', user.disabled);
    console.log('Custom Claims:', user.customClaims);
    console.log('Provider Data:', user.providerData);
    console.log('\n');
    
    if (user.disabled) {
      console.log('⚠️ WARNING: User account is DISABLED!');
    }
    
    if (!user.emailVerified) {
      console.log('⚠️ WARNING: Email is NOT verified!');
    }
    
    if (user.customClaims && user.customClaims.admin) {
      console.log('✅ Admin claim is SET');
    } else {
      console.log('❌ Admin claim is NOT set');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nThis user does NOT exist in Firebase Auth!');
    console.error('You need to create this account first.');
    process.exit(1);
  }
}

checkUser();
