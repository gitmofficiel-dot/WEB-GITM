import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../translations/dictionary';
import { auth } from '../config/firebaseAuth';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

import { useNavigate, useLocation } from 'react-router-dom';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Language State
  const [lang, setLang] = useState(() => localStorage.getItem('gitm_lang') || 'ar');
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState(null);

  // 2. Theme State (Light / Dark)
  const [theme, setTheme] = useState(() => localStorage.getItem('gitm_theme') || 'dark');

  // 3. Router View State (Derived from URL)
  const path = location.pathname.split('/')[1] || 'home';
  const view = path === 'home' ? 'home' : path;
  
  const setView = (v) => {
    if (v === 'home') navigate('/');
    else if (v === 'dashboard') {
      const secureHash = Math.random().toString(36).substring(2, 10);
      navigate(`/dashboard/${secureHash}`);
    }
    else navigate('/' + v);
  };

  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // 4. Auth User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gitm_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Users Roster (Extended with CV Data)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gitm_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'سفيان العلوي', email: 'soufiane@gitm.ma', role: 'president', badges: ['developer', 'admin', 'speaker'], bio: 'Embedded Systems Engineer & AI Researcher.', projects: ['Edge AI YOLOv8', 'Smart Drone Controller'], github: 'github.com/soufiane', linkedin: 'linkedin.com/in/soufiane' },
      { id: 2, name: 'فاطمة الزهراء', email: 'fatima@gitm.ma', role: 'teacher', badges: ['writer', 'developer'], bio: 'Senior Robotics Instructor.', projects: ['Autonomous Robot Arm'], github: 'github.com/fatima', linkedin: 'linkedin.com/in/fatima' },
      { id: 3, name: 'عمر التازي', email: 'omar@gitm.ma', role: 'student', badges: ['developer'], bio: 'IoT Enthusiast and Maker.', projects: ['Smart Home Hub'], github: 'github.com/omar', linkedin: 'linkedin.com/in/omar' },
      { id: 4, name: 'أمين بنجلون', email: 'amine@gitm.ma', role: 'teacher', badges: ['speaker', 'developer'], bio: 'Cloud Architect & AI Specialist.', projects: ['IoT Cloud Platform'], github: 'github.com/amine', linkedin: 'linkedin.com/in/amine' },
      { id: 5, name: 'ياسين المراكشي', email: 'yassine@gitm.ma', role: 'member', badges: ['designer'], bio: 'UI/UX Designer for Tech Apps.', projects: ['GITM App Redesign'], github: 'github.com/yassine', linkedin: 'linkedin.com/in/yassine' },
      { id: 6, name: 'سارة الفاسي', email: 'sara@gitm.ma', role: 'member', badges: ['developer', 'writer'], bio: 'Cybersecurity Analyst.', projects: ['Network Monitor'], github: 'github.com/sara', linkedin: 'linkedin.com/in/sara' },
      { id: 7, name: 'محمد الحسني', email: 'mohammed@gitm.ma', role: 'content_manager', badges: ['writer', 'designer'], bio: 'Tech Journalist & Content Creator.', projects: [], github: 'github.com/mohammed', linkedin: 'linkedin.com/in/mohammed' },
      { id: 8, name: 'خديجة بناني', email: 'khadija@gitm.ma', role: 'supervisor', badges: ['admin', 'legal'], bio: 'Project Manager & Legal Advisor.', projects: [], github: 'github.com/khadija', linkedin: 'linkedin.com/in/khadija' },
    ];
  });

  // 5. Active Dashboard Role
  const [activeDashboardRole, setActiveDashboardRole] = useState('president');

  // 6. Data States
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('gitm_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Optimizing YOLOv8 model for Jetson Nano', member: 'Dr. Amine Benjelloun', status: 'In Progress' },
      { id: 2, title: 'Routing 4-layer power distribution PCB', member: 'Yassine El Marrakchi', status: 'Completed' },
      { id: 3, title: 'Securing WebSocket connection logs', member: 'Sara El Fassi', status: 'Pending' }
    ];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('gitm_courses');
    return saved ? JSON.parse(saved) : [
      { id: 'edge', track: 'edge', title: 'Edge AI & Embedded Systems Specialist', progress: 0, enrolled: false, mode: 'remote' },
      { id: 'robotics', track: 'robotics', title: 'Autonomous Robotics & ROS2 Architect', progress: 0, enrolled: false, mode: 'in-person', location: 'GITM Lab, Casablanca, Morocco' },
      { id: 'iotCloud', track: 'iotCloud', title: 'IoT Cloud Platform & Core Web Architect', progress: 0, enrolled: false, mode: 'remote' }
    ];
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('gitm_grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiJobs, setAiJobs] = useState(() => {
    const saved = localStorage.getItem('gitm_ai_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [internships, setInternships] = useState(() => {
    const saved = localStorage.getItem('gitm_internships');
    return saved ? JSON.parse(saved) : [];
  });

  const [papers, setPapers] = useState(() => {
    const saved = localStorage.getItem('gitm_papers');
    return saved ? JSON.parse(saved) : [];
  });

  // 7. News Data
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('gitm_news');
    return saved ? JSON.parse(saved) : [
      { id: 1, title_ar: 'إطلاق مختبر الذكاء الاصطناعي الجديد', title_en: 'New AI Lab Launch', title_fr: 'Lancement du nouveau labo IA', summary_ar: 'تم افتتاح مختبر الذكاء الاصطناعي المجهز بأحدث التقنيات', summary_en: 'Our new AI lab equipped with cutting-edge technology is now open', category: 'technology', date: '2026-06-15', author: 'GITM Team', pinned: true },
      { id: 2, title_ar: 'ورشة عمل الروبوتات المستقلة', title_en: 'Autonomous Robotics Workshop', title_fr: 'Atelier Robotique Autonome', summary_ar: 'ورشة عمل تفاعلية حول بناء الروبوتات ذاتية القيادة', summary_en: 'Interactive workshop on building self-driving robots', category: 'events', date: '2026-06-10', author: 'Dr. Amine', pinned: false },
      { id: 3, title_ar: 'دورة جديدة في إنترنت الأشياء', title_en: 'New IoT Course Available', title_fr: 'Nouveau cours IoT disponible', summary_ar: 'أطلقنا دورة شاملة في تطوير أنظمة إنترنت الأشياء', summary_en: 'We launched a comprehensive IoT systems development course', category: 'academy', date: '2026-06-05', author: 'Sara El Fassi', pinned: false },
      { id: 4, title_ar: 'شراكة جديدة مع مايكروسوفت', title_en: 'New Partnership with Microsoft', title_fr: 'Nouveau partenariat avec Microsoft', summary_ar: 'وقعنا اتفاقية شراكة استراتيجية مع مايكروسوفت المغرب', summary_en: 'We signed a strategic partnership agreement with Microsoft Morocco', category: 'partners', date: '2026-06-01', author: 'GITM Team', pinned: false },
      { id: 5, title_ar: 'مسابقة الهاكاثون السنوية', title_en: 'Annual Hackathon Competition', title_fr: 'Compétition Hackathon Annuelle', summary_ar: 'انطلاق التسجيل في مسابقة الهاكاثون السنوية لفريق GITM', summary_en: 'Registration opens for GITM annual hackathon competition', category: 'events', date: '2026-05-28', author: 'Yassine', pinned: false },
    ];
  });

  // 8. Gallery Data
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('gitm_gallery');
    return saved ? JSON.parse(saved) : [
      { id: 1, title_ar: 'اجتماع الفريق الأسبوعي', title_en: 'Weekly Team Meeting', category: 'meetings', date: '2026-06-12', type: 'image', color: '#0d9488' },
      { id: 2, title_ar: 'اختبار الروبوت الأول', title_en: 'First Robot Test', category: 'projects', date: '2026-06-08', type: 'image', color: '#6366f1' },
      { id: 3, title_ar: 'ورشة عمل PCB', title_en: 'PCB Workshop', category: 'workshops', date: '2026-06-05', type: 'image', color: '#f59e0b' },
      { id: 4, title_ar: 'عرض المشروع النهائي', title_en: 'Final Project Demo', category: 'events', date: '2026-05-30', type: 'video', color: '#ef4444' },
      { id: 5, title_ar: 'زيارة المختبر', title_en: 'Lab Tour', category: 'meetings', date: '2026-05-25', type: 'image', color: '#8b5cf6' },
    ];
  });

  // 9. Events & Competitions Data
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('gitm_events');
    return saved ? JSON.parse(saved) : [
      { id: 1, title_ar: 'هاكاثون GITM 2026', title_en: 'GITM Hackathon 2026', date: '2026-07-15T09:00', endDate: '2026-07-17T18:00', contactDate: '2026-07-20', location: 'Casablanca TechHub', type: 'hackathon', status: 'upcoming', description_ar: 'مسابقة برمجية على مدار 48 ساعة', description_en: '48-hour coding competition', requirements: { teamMin: 2, teamMax: 5, needsProjectName: true, needsFileUpload: true } },
      { id: 2, title_ar: 'ورشة الذكاء الاصطناعي', title_en: 'AI Workshop', date: '2026-07-05T14:00', endDate: '2026-07-05T18:00', contactDate: '2026-07-06', location: 'GITM Lab', type: 'workshop', status: 'upcoming', description_ar: 'تعلم أساسيات التعلم العميق', description_en: 'Learn deep learning fundamentals', requirements: { teamMin: 1, teamMax: 1, needsProjectName: false, needsFileUpload: false } },
      { id: 3, title_ar: 'مؤتمر التكنولوجيا المغربي', title_en: 'Morocco Tech Conference', date: '2026-08-20T10:00', endDate: '2026-08-21T18:00', contactDate: '2026-08-25', location: 'Rabat Convention Center', type: 'conference', status: 'upcoming', description_ar: 'أكبر مؤتمر تقني في المغرب', description_en: 'Morocco\'s largest tech conference', requirements: { teamMin: 1, teamMax: 1, needsProjectName: false, needsFileUpload: false } },
      { id: 4, title_ar: 'لقاء الأعضاء الشهري', title_en: 'Monthly Members Meetup', date: '2026-06-01T18:00', endDate: '2026-06-01T20:00', contactDate: '2026-06-02', location: 'Online', type: 'meetup', status: 'completed', description_ar: 'اجتماع شهري لمراجعة التقدم', description_en: 'Monthly progress review meeting' },
    ];
  });

  const [competitions, setCompetitions] = useState(() => {
    const saved = localStorage.getItem('gitm_competitions');
    return saved ? JSON.parse(saved) : [
      { id: 1, scope: 'national', title_ar: 'المسابقة الوطنية للروبوتات', title_en: 'National Robotics Competition', date: '2026-09-10', location: 'Rabat', reward: '100,000 MAD', status: 'open' },
      { id: 2, scope: 'international', title_ar: 'تحدي ناسا لتطبيقات الفضاء', title_en: 'NASA Space Apps Challenge', date: '2026-10-01', location: 'Online & Casablanca Hub', reward: 'Global Recognition', status: 'open' },
      { id: 3, scope: 'international', title_ar: 'بطولة العالم للذكاء الاصطناعي', title_en: 'World AI Championship', date: '2026-11-15', location: 'Dubai, UAE', reward: '$50,000', status: 'upcoming' },
      { id: 4, scope: 'national', title_ar: 'جائزة الابتكار المغربية', title_en: 'Moroccan Innovation Award', date: '2026-08-05', location: 'Marrakech', reward: '50,000 MAD', status: 'closed' },
    ];
  });

  // 10. Partners Data
  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('gitm_partners');
    return saved ? JSON.parse(saved) : {
      strategic: ['Microsoft Morocco', 'IBM Cloud', 'Google DevSpace', 'AWS Activate', 'Huawei ICT Academy', 'Oracle Academy'],
      supporting: ['Université Hassan II', 'ENSAM Casablanca', 'OFPPT', 'ONDA', 'Maroc Telecom', 'OCP Group', 'CGEM']
    };
  });

  // 11. Saved/Bookmarked Items
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('gitm_saved_items');
    return saved ? JSON.parse(saved) : { news: [], books: [] };
  });

  const toggleSave = (type, item) => {
    setSavedItems(prev => {
      const isSaved = prev[type].some(i => i.id === item.id || i.key === item.key);
      const updated = isSaved 
        ? prev[type].filter(i => i.id !== item.id && i.key !== item.key)
        : [...prev[type], item];
      return { ...prev, [type]: updated };
    });
  };

  // 12. Event Registrations (Project Submissions)
  const [eventRegistrations, setEventRegistrations] = useState(() => {
    const saved = localStorage.getItem('gitm_event_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  // Effect: Sync Language
  useEffect(() => {
    localStorage.setItem('gitm_lang', lang);
    const dir = languages[lang]?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  // Effect: Sync Theme
  useEffect(() => {
    localStorage.setItem('gitm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Effect: Listen to Firebase Auth State & Sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let syncedUser;
        if (userSnap.exists()) {
          syncedUser = { ...userSnap.data(), uid: firebaseUser.uid };
        } else {
          // New User
          const name = firebaseUser.displayName || firebaseUser.email.split('@')[0];
          syncedUser = { 
            uid: firebaseUser.uid,
            email: firebaseUser.email, 
            role: 'student', 
            name, 
            badges: [],
            photoURL: firebaseUser.photoURL || null
          };
          await setDoc(userRef, syncedUser);
          setUsers(prev => [...prev, { id: firebaseUser.uid, ...syncedUser }]);
        }

        // If they updated photo via Google, ensure we have it
        if (firebaseUser.photoURL && syncedUser.photoURL !== firebaseUser.photoURL) {
          syncedUser.photoURL = firebaseUser.photoURL;
          await setDoc(userRef, { photoURL: firebaseUser.photoURL }, { merge: true });
        }

        setUser(syncedUser);
        localStorage.setItem('gitm_user', JSON.stringify(syncedUser));
        setActiveDashboardRole(syncedUser.role);
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('gitm_user');
      }
    });

    return () => unsubscribe();
  }, []);

  // Effect: Listen to Data from Firestore
  useEffect(() => {
    if (!user) return;
    
    const collections = [
      { key: 'tasks', setter: setTasks },
      { key: 'news', setter: setNews },
      { key: 'gallery', setter: setGallery },
      { key: 'events', setter: setEvents },
      { key: 'courses', setter: setCourses }
    ];

    const unsubscribes = collections.map(({ key, setter }) => {
      const docRef = doc(db, 'gitm_data', key);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().items) {
          setter(docSnap.data().items);
        }
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user]);

  // Generic Sync Helper
  const syncToFirestore = (key, data) => {
    if (user && data.length > 0) {
      setDoc(doc(db, 'gitm_data', key), { items: data }, { merge: true });
    }
  };

  // Sync tasks to Firestore when changed locally
  useEffect(() => { syncToFirestore('tasks', tasks); }, [tasks, user]);
  useEffect(() => { syncToFirestore('news', news); }, [news, user]);
  useEffect(() => { syncToFirestore('gallery', gallery); }, [gallery, user]);
  useEffect(() => { syncToFirestore('events', events); }, [events, user]);
  useEffect(() => { syncToFirestore('courses', courses); }, [courses, user]);

  // Effect: Save all data (Local Fallback for smaller data or non-migrated yet)
  // localStorage.setItem('gitm_tasks', JSON.stringify(tasks)); - Moved to Firestore
  // localStorage.setItem('gitm_news', JSON.stringify(news)); - Moved to Firestore
  // localStorage.setItem('gitm_gallery', JSON.stringify(gallery)); - Moved to Firestore
  // localStorage.setItem('gitm_events', JSON.stringify(events)); - Moved to Firestore
  // localStorage.setItem('gitm_courses', JSON.stringify(courses)); - Moved to Firestore
  useEffect(() => { localStorage.setItem('gitm_grades', JSON.stringify(grades)); }, [grades]);
  useEffect(() => { localStorage.setItem('gitm_ai_jobs', JSON.stringify(aiJobs)); }, [aiJobs]);
  useEffect(() => { localStorage.setItem('gitm_internships', JSON.stringify(internships)); }, [internships]);
  useEffect(() => { localStorage.setItem('gitm_papers', JSON.stringify(papers)); }, [papers]);
  useEffect(() => { localStorage.setItem('gitm_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gitm_competitions', JSON.stringify(competitions)); }, [competitions]);
  useEffect(() => { localStorage.setItem('gitm_partners', JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem('gitm_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
  useEffect(() => { localStorage.setItem('gitm_event_registrations', JSON.stringify(eventRegistrations)); }, [eventRegistrations]);

  // Effect: Sync user role
  useEffect(() => {
    if (user && user.email) {
      const found = users.find(u => u.email === user.email);
      if (found && found.role !== user.role) {
        const updatedUser = { ...user, role: found.role, name: found.name, badges: found.badges || [] };
        setUser(updatedUser);
        localStorage.setItem('gitm_user', JSON.stringify(updatedUser));
        setActiveDashboardRole(found.role);
      }
    }
  }, [users, user]);

  const changeLanguage = (newLang) => {
    if (newLang === lang) return;
    setIsTranslating(true);
    setTargetLang(newLang);
    setTimeout(() => {
      setLang(newLang);
      setIsTranslating(false);
      setTargetLang(null);
    }, 300);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const registerUser = (email, name) => {
    const exists = users.find(u => u.email === email);
    let newUser;
    if (exists) {
      newUser = exists;
    } else {
      newUser = { id: Date.now(), name: name || email.split('@')[0], email, role: 'student', badges: [] };
      setUsers(prev => [...prev, newUser]);
    }
    setUser(newUser);
    localStorage.setItem('gitm_user', JSON.stringify(newUser));
    setActiveDashboardRole('student');
    setView('dashboard');
  };

  const loginUser = (email, role, name) => {
    const foundUser = users.find(u => u.email === email);
    const actualRole = foundUser ? foundUser.role : role;
    const actualName = foundUser ? foundUser.name : (name || email.split('@')[0]);
    const actualBadges = foundUser ? (foundUser.badges || []) : [];

    const newUser = { email, role: actualRole, name: actualName, badges: actualBadges };
    setUser(newUser);
    localStorage.setItem('gitm_user', JSON.stringify(newUser));
    setActiveDashboardRole(actualRole);
    setView('dashboard');
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('gitm_user');
      setView('home');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations['ar'];
    
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        let fallback = translations['ar'];
        for (const fKey of keys) {
          if (fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      changeLanguage,
      t,
      languages,
      isTranslating,
      targetLang,
      
      theme,
      toggleTheme,
      
      view,
      setView,
      selectedProfileId,
      setSelectedProfileId,
      
      user,
      loginUser,
      logoutUser,
      users,
      setUsers,
      registerUser,
      
      activeDashboardRole,
      setActiveDashboardRole,
      
      tasks,
      setTasks,
      courses,
      setCourses,
      grades,
      setGrades,
      aiJobs,
      setAiJobs,
      internships,
      setInternships,
      papers,
      setPapers,

      news,
      setNews,
      gallery,
      setGallery,
      events,
      setEvents,
      competitions,
      setCompetitions,
      partners,
      setPartners,
      savedItems,
      toggleSave,
      eventRegistrations,
      setEventRegistrations,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
