const admin = require('firebase-admin');
const fs = require('fs');

// Load service account
let serviceAccount;
if (fs.existsSync('./firebase-service-account.json')) {
  serviceAccount = require('../firebase-service-account.json');
} else if (fs.existsSync('./serviceAccountKey.json')) {
  serviceAccount = require('../serviceAccountKey.json');
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  console.error('No Firebase service account found (firebase-service-account.json or serviceAccountKey.json).');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function listAdmins() {
  const admins = [];
  const snapshot = await db.collection('users').where('isAdmin', '==', true).get();
  if (snapshot.empty) {
    console.log('No admin users found in Firestore.');
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    admins.push({ id: doc.id, ...data });
  });

  console.log('Found admin users:');
  admins.forEach((u, idx) => {
    console.log(`\n[${idx + 1}] Firestore doc id: ${u.id}`);
    console.log(`    name: ${u.name || '(no name)'}`);
    console.log(`    email: ${u.email || '(no email)'}`);
    console.log(`    uid (if any): ${u.uid || '(none)'}`);
  });

  // Try to fetch corresponding Firebase Auth users by email (if email exists)
  console.log('\nChecking Firebase Auth for matching users...');
  for (const u of admins) {
    if (!u.email) continue;
    try {
      const authUser = await admin.auth().getUserByEmail(u.email);
      const claims = authUser.customClaims || {};
      console.log(`\nAuth user for ${u.email}:`);
      console.log(`    uid: ${authUser.uid}`);
      console.log(`    displayName: ${authUser.displayName || '(none)'}`);
      console.log(`    customClaims: ${JSON.stringify(claims)}`);
    } catch (err) {
      console.log(`\nNo Auth user found for ${u.email} (or error fetching): ${err.message}`);
    }
  }
}

listAdmins().catch(err => {
  console.error('Error listing admins:', err);
  process.exit(1);
});