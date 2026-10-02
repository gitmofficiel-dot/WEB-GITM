import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../e:/GITM/.env') }); // This is ugly, let's just copy it to the gitm folder and run it there.

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

const projects = [
  {
    title: 'Smart Solar Irrigation System',
    description: 'An AI-driven irrigation system powered by solar panels to optimize water usage in Moroccan agriculture.',
    members: [{ id: '1', name: 'Youssef El Fassi', role: 'Hardware Engineer', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200' }],
    status: 'completed',
    progress: 100,
    category: 'IoT',
    githubUrl: 'https://github.com/gitm/smart-irrigation',
    techStack: 'IoT, Arduino, React, Python, ML',
    coverImage: 'https://images.unsplash.com/photo-1628183183556-9fb8c531d054?w=800',
    createdAt: serverTimestamp()
  },
  {
    title: 'Morocco Heritage VR',
    description: 'A virtual reality application allowing users to explore historical Moroccan landmarks seamlessly in 3D.',
    members: [{ id: '2', name: 'Khadija Amrani', role: '3D Artist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }],
    status: 'in-progress',
    progress: 65,
    category: 'Web',
    githubUrl: 'https://github.com/gitm/heritage-vr',
    techStack: 'Unity, C#, Three.js, React 360',
    coverImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
    createdAt: serverTimestamp()
  },
  {
    title: 'EduConnect Platform',
    description: 'A comprehensive cloud-based e-learning platform dedicated to bringing technical education to rural areas.',
    members: [{ id: '3', name: 'Omar Bennis', role: 'Full Stack Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }],
    status: 'in-progress',
    progress: 40,
    category: 'Cloud',
    githubUrl: 'https://github.com/gitm/educonnect',
    techStack: 'Next.js, Node.js, Firebase, TailwindCSS',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    createdAt: serverTimestamp()
  }
];

const courses = [
  {
    title: 'Introduction to AI & Machine Learning',
    description: 'A comprehensive workshop and course covering the fundamentals of Artificial Intelligence, neural networks, and their applications in modern software.',
    category: 'Robotics',
    level: 'Beginner',
    instructor: 'Dr. Amine Tazi',
    teacherEmail: 'amine.tazi@gitm.ma',
    duration: '4 Weeks',
    type: 'course',
    lessons: [
      { title: 'Week 1: AI Fundamentals', duration: '2 Hours' },
      { title: 'Week 2: Neural Networks Basics', duration: '2.5 Hours' },
      { title: 'Week 3: Practical ML with Python', duration: '3 Hours' },
      { title: 'Week 4: Final Project', duration: '4 Hours' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
    createdAt: serverTimestamp()
  }
];

async function seed() {
  try {
    for (const p of projects) {
      await addDoc(collection(db, 'projects'), p);
      console.log('Added project:', p.title);
    }
    for (const c of courses) {
      await addDoc(collection(db, 'courses'), c);
      console.log('Added course:', c.title);
    }
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
