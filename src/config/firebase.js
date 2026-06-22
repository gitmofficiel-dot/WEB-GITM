import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3XilfoO1zmlnC_CQZ3BpRNteMU5x7jDA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gitm-1b637.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gitm-1b637",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gitm-1b637.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "486384483277",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:486384483277:web:0f240da3fa1101e3ba6284",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z9JEFBG3GZ"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
