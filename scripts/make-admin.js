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

async function makeAdmin(email) {
  if (!email) {
    console.error('Usage: node scripts/make-admin.js user@example.com');
    process.exit(1);
  }

  try {
    // Find auth user
    const authUser = await admin.auth().getUserByEmail(email);
    const uid = authUser.uid;
    console.log(`Found Auth user: uid=${uid}, email=${authUser.email}, displayName=${authUser.displayName || '(none)'} `);

    // Set custom claim admin:true
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Set custom claim { admin: true }');

    // Revoke refresh tokens to force re-login
    await admin.auth().revokeRefreshTokens(uid);
    console.log('Revoked refresh tokens for user.');

    // Update Firestore docs: any doc with email==email -> set isAdmin true and uid if missing
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        console.log(`Updating Firestore doc ${doc.id} -> isAdmin: true, uid: ${uid}`);
        const updateData = { isAdmin: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        if (!doc.data().uid) updateData.uid = uid;
        await usersRef.doc(doc.id).update(updateData);
      }
    } else {
      // create a new user doc with id == uid
      const newDoc = {
        email,
        name: authUser.displayName || 'Admin User',
        uid,
        isAdmin: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await usersRef.doc(uid).set(newDoc);
      console.log(`Created new Firestore user doc with id ${uid}`);
    }

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    console.log('\nPassword reset link (use once):');
    console.log(resetLink);

    console.log('\nDone. Verify the user in Firebase Console (Auth) and Firestore (users collection).');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

const email = process.argv[2];
makeAdmin(email).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});