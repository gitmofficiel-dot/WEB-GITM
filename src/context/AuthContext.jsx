import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user data from Firestore to get their real role
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCurrentUser({ ...user, ...docSnap.data() });
          } else {
            // Failsafe: if doc missing but auth exists
            setCurrentUser({ ...user, role: 'student', badges: [] });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({ ...user, role: 'student', badges: [] });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
