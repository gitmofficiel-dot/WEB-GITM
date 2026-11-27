import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import safeStorage from '../utils/safeStorage';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up and create Firestore document
  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Default data for new user
    const userData = {
      uid: user.uid,
      name: name || email.split('@')[0],
      email: user.email,
      role: 'student', // Default role according to rules
      membershipId: '',
      badges: [],
      skills: [],
      interests: [],
      academicPath: [],
      social: {},
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    
    // Set local state to reflect new role immediately
    setCurrentUser({ ...user, ...userData });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    safeStorage.removeItem('gitm_user');
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeDoc = null;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ ...user, ...docSnap.data() });
          } else {
            setCurrentUser({ ...user, role: 'student', badges: [] });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user data:", error);
          setCurrentUser({ ...user, role: 'student', badges: [] });
          setLoading(false);
        });
      } else {
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
        const saved = safeStorage.getItem('gitm_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setCurrentUser(parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null);
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  const demoLogin = (email, role, name) => {
    const newUser = { email, role, name, badges: [] };
    safeStorage.setItem('gitm_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
  };


  const value = {
    currentUser,
    login,
    signup,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
