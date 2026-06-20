import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3XilfoO1zmlnC_CQZ3BpRNteMU5x7jDA",
  authDomain: "gitm-1b637.firebaseapp.com",
  projectId: "gitm-1b637",
  storageBucket: "gitm-1b637.firebasestorage.app",
  messagingSenderId: "486384483277",
  appId: "1:486384483277:web:0f240da3fa1101e3ba6284",
  measurementId: "G-Z9JEFBG3GZ"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
