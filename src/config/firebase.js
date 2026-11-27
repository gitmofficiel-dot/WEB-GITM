import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, inMemoryPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3XilfoO1zmlnC_CQZ3BpRNteMU5x7jDA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gitm-1b637.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gitm-1b637",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gitm-1b637.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "486384483277",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:486384483277:web:0f240da3fa1101e3ba6284",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z9JEFBG3GZ"
};

function probeStorage(getStore) {
  let store = null;
  let probeKey = null;
  let removeAttempted = false;
  try {
    store = getStore();
    if (
      !store ||
      typeof store.getItem !== "function" ||
      typeof store.setItem !== "function" ||
      typeof store.removeItem !== "function"
    ) {
      return false;
    }
    probeKey = `__gitm_storage_probe_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    store.setItem(probeKey, "1");
    const value = store.getItem(probeKey);
    removeAttempted = true;
    store.removeItem(probeKey);
    return value === "1";
  } catch {
    return false;
  } finally {
    if (store && probeKey && !removeAttempted) {
      try {
        store.removeItem(probeKey);
      } catch {
        // Ignore cleanup errors on restricted storage
      }
    }
  }
}

function isBrowserStorageAvailable() {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    probeStorage(() => window.localStorage) &&
    probeStorage(() => window.sessionStorage)
  );
}

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth =
  typeof window === "undefined" || isBrowserStorageAvailable()
    ? getAuth(app)
    : initializeAuth(app, { persistence: inMemoryPersistence });
export const storage = getStorage(app);
