# 🔒 SECURITY WARNING

## Critical Security Information

**⚠️ IMPORTANT: The `firebase-service-account.json` file contains sensitive credentials that should NEVER be committed to version control or shared publicly.**

### Current Status:
- Firebase service account credentials are currently stored in `firebase-service-account.json`
- This file contains private keys and should be kept secure
- The file is now properly excluded via `.gitignore`

### Recommended Actions:

1. **Move credentials to environment variables:**
   ```bash
   # Add these to your .env file:
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id  
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   ```

2. **Update server.js to use environment variables:**
   ```javascript
   const serviceAccount = {
     type: "service_account",
     project_id: process.env.FIREBASE_PROJECT_ID,
     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
     private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
     client_email: process.env.FIREBASE_CLIENT_EMAIL,
     client_id: process.env.FIREBASE_CLIENT_ID,
     // ... other fields
   };
   ```

3. **Delete the firebase-service-account.json file after moving credentials**

### Production Deployment:
- Never deploy the service account JSON file
- Use your hosting platform's environment variables feature
- Consider using Firebase Admin SDK with application default credentials in production

### If Credentials Were Compromised:
1. Immediately revoke the current service account key in Firebase Console
2. Generate a new service account key
3. Update all deployment environments with new credentials
4. Rotate any other potentially exposed secrets

---
**Remember: Security is not optional. Keep your credentials safe!**
