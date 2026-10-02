import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function mergeDocs() {
  try {
    const docOldRef = doc(db, 'users', 'GITM-MBR-147');
    const docOldSnap = await getDoc(docOldRef);
    
    if (docOldSnap.exists()) {
      const data = docOldSnap.data();
      
      const docNewRef = doc(db, 'users', 'XFvFNW7dJhPcZTvZGeGvD4qknLB2');
      await updateDoc(docNewRef, {
        ...data,
        uid: 'XFvFNW7dJhPcZTvZGeGvD4qknLB2', // ensure uid is not overwritten with empty
        membershipId: 'GITM-MBR-147' // ensure membershipId remains
      });
      console.log('Merged data to UID document.');
      
      await deleteDoc(docOldRef);
      console.log('Deleted old duplicate document.');
    } else {
      console.log('Old document not found.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error merging docs:', error);
    process.exit(1);
  }
}

mergeDocs();
