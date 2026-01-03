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

async function updateAdminEmail(oldEmail, newEmail) {
  if (!oldEmail || !newEmail) {
    console.error('Usage: node scripts/update-admin-email.js old@example.com new@example.com');
    process.exit(1);
  }

  console.log(`Looking for Firestore users with email: ${oldEmail}`);
  const snapshot = await db.collection('users').where('email', '==', oldEmail).get();

  if (snapshot.empty) {
    console.log('No Firestore users found with that email.');
  } else {
    for (const doc of snapshot.docs) {
      console.log(`Updating Firestore doc ${doc.id} -> email: ${newEmail}`);
      await db.collection('users').doc(doc.id).update({ email: newEmail, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  }

  // Update Firebase Auth user
  try {
    console.log(`Fetching Auth user by email: ${oldEmail}`);
    const user = await admin.auth().getUserByEmail(oldEmail);
    console.log(`Found Auth UID: ${user.uid}. Updating email to ${newEmail}`);
    await admin.auth().updateUser(user.uid, { email: newEmail, emailVerified: false });
    // Revoke refresh tokens to force re-auth
    await admin.auth().revokeRefreshTokens(user.uid);
    console.log('Auth user updated and sessions revoked.');
  } catch (err) {
    console.error('Auth update error (may mean no Auth user found):', err.message);
  }

  console.log('Done. Please verify the Firestore documents and Auth console to confirm changes.');
}

const [oldEmail, newEmail] = process.argv.slice(2);
updateAdminEmail(oldEmail, newEmail).catch(err => {
  console.error('Error updating admin email:', err);
  process.exit(1);
});