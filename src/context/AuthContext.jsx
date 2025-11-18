import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Assuming you have a firebase.js config file
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import LoadingAnimation from '../components/LoadingAnimation';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    // Create user doc if not exists
    const userDoc = await getDoc(doc(db, 'users', res.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', res.user.uid), {
        name: res.user.displayName,
        email: res.user.email,
        authProvider: 'google',
      });
    }
    return res;
  };

  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create a user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      authProvider: 'local',
    });
    return userCredential;
  };

  const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    try {
      // Delete user document from Firestore first
      await deleteDoc(doc(db, 'users', user.uid));
      // Then delete the user account
      await user.delete();
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        // Handle re-authentication requirement
        throw new Error('Please sign in again to delete your account');
      }
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          // Error fetching user profile
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    signup,
    signin,
    logout,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <LoadingAnimation text="Initializing" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;