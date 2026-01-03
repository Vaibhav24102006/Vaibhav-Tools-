const admin = require('firebase-admin');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');

let serviceAccount;
if (fs.existsSync('./firebase-service-account.json')) {
  serviceAccount = require('../firebase-service-account.json');
} else if (fs.existsSync('./serviceAccountKey.json')) {
  serviceAccount = require('../serviceAccountKey.json');
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  console.error('No Firebase service account found');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function test(email) {
  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (snapshot.empty) {
    console.error('No user found');
    return;
  }
  const doc = snapshot.docs[0];
  console.log('Found doc', doc.id);

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiry = Date.now() + 60 * 60 * 1000;

  await db.collection('users').doc(doc.id).update({ resetTokenHash: tokenHash, resetTokenExpiry: expiry });
  console.log('Set reset token and expiry. Token (one-time):', token);

  // Simulate reset
  const fetched = await db.collection('users').doc(doc.id).get();
  const data = fetched.data();
  const verifyHash = crypto.createHash('sha256').update(token).digest('hex');
  if (verifyHash !== data.resetTokenHash) {
    console.error('Token hash mismatch');
    return;
  }
  if (Date.now() > data.resetTokenExpiry) {
    console.error('Token expired');
    return;
  }

  const newPassword = 'TempP@ssw0rd1';
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.collection('users').doc(doc.id).update({ password: hashed, resetTokenHash: admin.firestore.FieldValue.delete(), resetTokenExpiry: admin.firestore.FieldValue.delete(), passwordChangedAt: Math.floor(Date.now() / 1000) });
  console.log('Password updated to new temp. New password:', newPassword);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/test-reset-direct.js admin@example.com');
  process.exit(1);
}

test(email).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });