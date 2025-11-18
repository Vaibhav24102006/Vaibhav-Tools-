// Firebase config and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDGccnDx00tBfc4SjLUX0seN8LcVZvp4Lo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "vaibhavtools-70e4f.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "vaibhavtools-70e4f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "vaibhavtools-70e4f.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "842533829975",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:842533829975:web:8333eda265d53203c4d212",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-ZH9HEZ0G2L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
