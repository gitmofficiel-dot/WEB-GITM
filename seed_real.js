import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3XilfoO1zmlnC_CQZ3BpRNteMU5x7jDA",
  authDomain: "gitm-1b637.firebaseapp.com",
  projectId: "gitm-1b637",
  storageBucket: "gitm-1b637.firebasestorage.app",
  messagingSenderId: "486384483277",
  appId: "1:486384483277:web:0f240da3fa1101e3ba6284",
  measurementId: "G-Z9JEFBG3GZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding database with verified data...");

  const projectsRef = collection(db, "projects");
  await addDoc(projectsRef, {
    titleEn: "Smart Agritech Platform",
    titleAr: "منصة التكنولوجيا الزراعية الذكية",
    titleFr: "Plateforme Agritech Intelligente",
    descriptionEn: "An IoT and AI-powered platform for optimizing water usage and predicting crop yields for Moroccan farmers. Successfully reduced water waste by 30% in pilot tests.",
    descriptionAr: "منصة تعتمد على إنترنت الأشياء والذكاء الاصطناعي لتحسين استخدام المياه وتوقع إنتاج المحاصيل. قللت هدر المياه بنسبة 30% في الاختبارات الأولية.",
    descriptionFr: "Une plateforme IoT et IA pour optimiser l'utilisation de l'eau et prédire les rendements agricoles. Réduction du gaspillage d'eau de 30% lors des tests.",
    status: "Completed",
    category: "IoT & AI",
    teamMembers: "Aymane, Sara, Youssef",
    techStack: "React, Node.js, TensorFlow",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80",
    createdAt: serverTimestamp()
  });

  await addDoc(projectsRef, {
    titleEn: "Soul of Atlas - Educational Robot",
    titleAr: "روبوت روح الأطلس التعليمي",
    titleFr: "Soul of Atlas - Robot Éducatif",
    descriptionEn: "An interactive educational robot designed to teach STEM concepts to rural students, featuring Amazigh language support and low-cost 3D printed parts.",
    descriptionAr: "روبوت تعليمي تفاعلي مصمم لتعليم مفاهيم العلوم والتكنولوجيا للطلاب في القرى، يدعم اللغة الأمازيغية ومبني بأجزاء مطبوعة ثلاثية الأبعاد منخفضة التكلفة.",
    descriptionFr: "Un robot éducatif interactif conçu pour enseigner les concepts STEM aux étudiants ruraux, avec support de la langue amazighe et pièces imprimées en 3D.",
    status: "In Progress",
    category: "Robotics",
    teamMembers: "Tariq, Fatima",
    techStack: "Arduino, C++, Python, ROS",
    imageUrl: "https://images.unsplash.com/photo-1485827404727-8a37d925d43e?w=800&q=80",
    createdAt: serverTimestamp()
  });

  await addDoc(projectsRef, {
    titleEn: "Medina VR Experience",
    titleAr: "تجربة الواقع الافتراضي للمدينة العتيقة",
    titleFr: "Expérience VR de la Médina",
    descriptionEn: "A comprehensive virtual reality preservation project digitizing historical Moroccan architecture and promoting virtual tourism.",
    descriptionAr: "مشروع شامل للواقع الافتراضي لرقمنة العمارة التاريخية المغربية وتعزيز السياحة الافتراضية والحفاظ على التراث.",
    descriptionFr: "Un projet complet de préservation en réalité virtuelle numérisant l'architecture historique marocaine.",
    status: "Beta",
    category: "VR/AR",
    teamMembers: "Mehdi, Hajar",
    techStack: "Unity, C#, Blender",
    imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    createdAt: serverTimestamp()
  });

  const coursesRef = collection(db, "courses");
  await addDoc(coursesRef, {
    titleEn: "Advanced React & Firebase Architecture",
    titleAr: "بنية متقدمة لـ React و Firebase",
    titleFr: "Architecture Avancée React & Firebase",
    descriptionEn: "A 6-week intensive course covering real-time databases, authentication, and state management for scalable applications.",
    descriptionAr: "دورة مكثفة لمدة 6 أسابيع تغطي قواعد البيانات في الوقت الفعلي والمصادقة وإدارة الحالة للتطبيقات القابلة للتوسع.",
    descriptionFr: "Un cours intensif de 6 semaines couvrant les bases de données en temps réel, l'authentification et la gestion d'état.",
    instructor: "Yassine",
    duration: "6 weeks",
    level: "Intermediate",
    enrolled: 45,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    createdAt: serverTimestamp()
  });

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
