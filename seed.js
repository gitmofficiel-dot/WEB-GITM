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
  console.log("Seeding database...");

  // Seed News
  const newsRef = collection(db, "news");
  await addDoc(newsRef, {
    title_en: "GITM Partners with OCP Group",
    title_ar: "مجموعة الابتكار التكنولوجي تتعاون مع المكتب الشريف للفوسفاط",
    content_en: "We are thrilled to announce a strategic partnership with OCP Group to develop AI-driven solutions for sustainable agriculture in Morocco and Africa.",
    content_ar: "نحن سعداء بالإعلان عن شراكة استراتيجية مع مجموعة OCP لتطوير حلول تعتمد على الذكاء الاصطناعي لزراعة مستدامة في المغرب وإفريقيا.",
    category: "Partners",
    author: "Yassine",
    date: new Date().toISOString(),
    imageUrl: "https://res.cloudinary.com/dzx2xxx/image/upload/v1700000000/gitm/ocp_partner.jpg"
  });

  await addDoc(newsRef, {
    title_en: "GITM AI Hackathon at UM5",
    title_ar: "هاكاثون الذكاء الاصطناعي في جامعة محمد الخامس",
    content_en: "Our upcoming AI hackathon at UM5 will gather over 200 developers to build innovative solutions for smart cities.",
    content_ar: "سيجمع هاكاثون الذكاء الاصطناعي القادم في جامعة محمد الخامس أكثر من 200 مطور لبناء حلول مبتكرة للمدن الذكية.",
    category: "Events",
    author: "Mohammed",
    date: new Date().toISOString(),
    imageUrl: "https://res.cloudinary.com/dzx2xxx/image/upload/v1700000000/gitm/hackathon.jpg"
  });

  // Seed Projects
  const projectsRef = collection(db, "projects");
  await addDoc(projectsRef, {
    title_en: "Smart Agritech Platform",
    title_ar: "منصة التكنولوجيا الزراعية الذكية",
    description_en: "An IoT and AI-powered platform for optimizing water usage and predicting crop yields for Moroccan farmers.",
    description_ar: "منصة تعتمد على إنترنت الأشياء والذكاء الاصطناعي لتحسين استخدام المياه وتوقع إنتاج المحاصيل للمزارعين المغاربة.",
    status: "in-progress",
    teamMembers: "Aymane, Sara, Youssef",
    githubLink: "https://github.com/gitm/smart-agritech",
    techStack: "React, Node.js, TensorFlow",
    imageUrl: "https://res.cloudinary.com/dzx2xxx/image/upload/v1700000000/gitm/agritech.jpg"
  });

  // Seed Events
  const eventsRef = collection(db, "events");
  await addDoc(eventsRef, {
    title_en: "Cloud Computing Workshop",
    title_ar: "ورشة عمل الحوسبة السحابية",
    description_en: "A comprehensive workshop on AWS cloud architecture, organized in collaboration with Technopark Casablanca.",
    description_ar: "ورشة عمل شاملة حول بنية الحوسبة السحابية AWS، نظمت بالتعاون مع تكنوبارك الدار البيضاء.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Technopark Casablanca",
    type: "workshop",
    status: "upcoming"
  });

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
