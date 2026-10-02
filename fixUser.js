import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
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

async function fixUser() {
  try {
    const q = query(collection(db, 'users'), where('email', '==', 'mohamedla749@gmail.com'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('User not found.');
      process.exit(1);
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    await updateDoc(userRef, {
      isTeamMember: true,
      role: 'president',
      roleAr: 'رئيس',
      nameLatin: 'MOHAMMED RHZAOUNI',
      nameAr: 'محمد غزاوني',
      name: 'MOHAMMED RHZAOUNI',
      bio: 'مطور برمجيات معتمد ومؤسس مجموعة الابتكار التكنولوجي بالمغرب (GITM). أمتلك خبرة عملية في بناء تطبيقات الويب المتكاملة...'
    });

    console.log('User updated successfully:', userDoc.id);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
}

fixUser();
