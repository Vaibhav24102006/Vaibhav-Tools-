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

async function run(newEmail) {
  if (!newEmail) {
    console.error('Usage: node scripts/set-admin-email-robust.js newEmail@example.com');
    process.exit(1);
  }

  // Check if newEmail is already in use in Auth
  try {
    const existing = await admin.auth().getUserByEmail(newEmail);
    console.error(`The email ${newEmail} is already in use by Auth UID: ${existing.uid}. Aborting.`);
    process.exit(2);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log(`${newEmail} is not used in Firebase Auth. Proceeding.`);
    } else {
      console.error('Error checking email in Auth:', err.message);
      process.exit(1);
    }
  }

  // Get all Firestore admin users
  const adminsSnapshot = await db.collection('users').where('isAdmin', '==', true).get();
  if (adminsSnapshot.empty) {
    console.error('No admin docs found in Firestore.');
    process.exit(1);
  }

  // Try to identify the Auth UID(s) to update
  const authUids = new Set();

  for (const doc of adminsSnapshot.docs) {
    const data = doc.data();
    console.log(`Found admin doc id=${doc.id}, email=${data.email || '(none)'}, name=${data.name || '(none)'} `);

    // Try get auth by email
    if (data.email) {
      try {
        const authUser = await admin.auth().getUserByEmail(data.email);
        console.log(`  -> matched Auth UID: ${authUser.uid}`);
        authUids.add(authUser.uid);
      } catch (err) {
        // not found by email
      }
    }

    // Try get auth by doc id (maybe doc id is uid)
    try {
      const authById = await admin.auth().getUser(doc.id);
      if (authById) {
        console.log(`  -> doc id matches Auth UID: ${authById.uid}`);
        authUids.add(authById.uid);
      }
    } catch (err) {
      // ignore
    }
  }

  if (authUids.size === 0) {
    console.error('Could not identify any Auth user to update. Aborting.');
    process.exit(1);
  }

  // Update Auth users
  for (const uid of authUids) {
    try {
      console.log(`Updating Auth user ${uid} email -> ${newEmail}`);
      await admin.auth().updateUser(uid, { email: newEmail, emailVerified: false });
      await admin.auth().revokeRefreshTokens(uid);
      console.log(`  Updated and revoked tokens for ${uid}`);
    } catch (err) {
      console.error(`  Failed to update Auth user ${uid}:`, err.message);
    }
  }

  // Update Firestore admin docs: set email to newEmail if isAdmin true and doc references one of the authUids (id==uid or email belonged to auth user earlier)
  for (const doc of adminsSnapshot.docs) {
    const data = doc.data();
    let shouldUpdate = false;
    // Update if doc.id is in authUids or current email isn't the new email
    if (authUids.has(doc.id)) shouldUpdate = true;
    if (data.email && data.email !== newEmail) shouldUpdate = true;

    if (shouldUpdate) {
      try {
        console.log(`Updating Firestore doc ${doc.id} email -> ${newEmail}`);
        await db.collection('users').doc(doc.id).update({ email: newEmail, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      } catch (err) {
        console.error(`  Failed to update doc ${doc.id}:`, err.message);
      }
    }
  }

  console.log('Done. Verify Firebase Auth console and Firestore users collection.');
}

const newEmail = process.argv[2];
run(newEmail).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});