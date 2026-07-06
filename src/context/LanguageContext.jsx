import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../translations/dictionary';
import { auth } from '../config/firebaseAuth';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

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



  // 5. Active Dashboard Role
  const [activeDashboardRole, setActiveDashboardRole] = useState('president');

  // Users fallback
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gitm_users');
    return saved ? JSON.parse(saved) : [
      { id: 'user1', name: 'Eng. Mohammed Rhzaouni', firstName: 'م. محمد غزاوني', email: 'president@gitm.ma', role: 'president', isTeamMember: true, bio: 'مهندس رؤيوي، قاد العديد من الابتكارات في الأنظمة المدمجة وإنترنت الأشياء لبناء مستقبل ذكي.' },
      { id: 'user2', name: 'Prof. Ahmed Bensalem', firstName: 'أ. د. أحمد بنسالم', email: 'ahmed@gitm.ma', role: 'teacher', isTeamMember: true, bio: 'أستاذ باحث في الذكاء الاصطناعي، وخبير عالمي في معالجة اللغات الطبيعية وتطوير نماذج التعلم العميق المتطورة.' },
      { id: 'user3', name: 'Dr. Laila Ammari', firstName: 'د. ليلى عماري', email: 'laila@gitm.ma', role: 'teacher', isTeamMember: true, bio: 'أستاذة علوم البيانات ورائدة أبحاث البيانات الضخمة، ولها إسهامات كبيرة في تحليل البيانات التنبؤية.' },
      { id: 'user4', name: 'Eng. Sarah Alaoui', firstName: 'م. سارة العلوي', email: 'sarah@gitm.ma', role: 'supervisor', isTeamMember: true, bio: 'مديرة أنظمة الروبوتات، مهندسة متميزة تقود تطوير أنظمة ROS2 المتقدمة للروبوتات المستقلة.' },
      { id: 'user5', name: 'Omar Tazi', firstName: 'عمر التازي', email: 'omar@gitm.ma', role: 'supervisor', isTeamMember: true, bio: 'مهندس البنية التحتية السحابية وخبير في الأمن السيبراني، يضمن استقرار خوادمنا.' },
      { id: 'user6', name: 'Youssef El Idrissi', firstName: 'يوسف الإدريسي', email: 'youssef@gitm.ma', role: 'member', isTeamMember: true, bio: 'مطور ويب متخصص في بناء واجهات مستخدم حديثة وتجربة مستخدم استثنائية.' }
    ];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('gitm_courses');
    return saved ? JSON.parse(saved) : [
      { id: 'react-node', track: 'web', title_ar: 'تطوير شامل بـ React و Node.js', title_en: 'Full-Stack React & Node.js', instructor: {ar: 'أحمد بنعلي', en: 'Ahmed Benali'}, progress: 75, enrolled: 120, status: 'Active', hours: 40, rating: 4.8 },
      { id: 'ai-ml', track: 'ai', title_ar: 'التعلم الآلي التطبيقي', title_en: 'Applied Machine Learning', instructor: {ar: 'د. سارة الخطابي', en: 'Dr. Sara Khattabi'}, progress: 30, enrolled: 85, status: 'Active', hours: 60, rating: 4.9 },
      { id: 'cloud-aws', track: 'cloud', title_ar: 'هندسة السحابة مع AWS', title_en: 'Cloud Architecture with AWS', instructor: {ar: 'يوسف المنصوري', en: 'Youssef Mansouri'}, progress: 0, enrolled: 60, status: 'Upcoming', hours: 35, rating: 4.7 },
      { id: 'cybersecurity', track: 'security', title_ar: 'أساسيات الأمن السيبراني', title_en: 'Cybersecurity Fundamentals', instructor: {ar: 'كريم لحلو', en: 'Karim Lahlou'}, progress: 100, enrolled: 150, status: 'Completed', hours: 25, rating: 4.9 },
      { id: 'ui-ux', track: 'design', title_ar: 'تصميم واجهة وتجربة المستخدم المتقدم', title_en: 'UI/UX Advanced Design', instructor: {ar: 'منى التازي', en: 'Mona Tazi'}, progress: 50, enrolled: 90, status: 'Active', hours: 30, rating: 4.6 }
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
      { id: 1, title_ar: 'إطلاق برنامج التدريب الصيفي', title_en: 'Launch of Summer Training Program', summary_ar: 'نعلن عن بدء التسجيل في برنامج التدريب الصيفي المكثف للمهندسين.', summary_en: 'Registration for our intensive summer training program is now open.', category: 'academy', date: '2026-06-25', author: 'GITM Team', pinned: true },
      { id: 2, title_ar: 'شراكة جديدة مع جامعة رائدة', title_en: 'New Partnership with Leading University', summary_ar: 'تم توقيع اتفاقية تعاون مع كبرى الجامعات لتطوير برامج البحث العلمي.', summary_en: 'Cooperation agreement signed with major universities to develop research.', category: 'partners', date: '2026-06-20', author: 'President', pinned: false },
      { id: 3, title_ar: 'نجاح باهر لفعالية الهاكاثون', title_en: 'Outstanding Success of Hackathon', summary_ar: 'اختتام فعاليات هاكاثون الابتكار 2026 بمشاركة متميزة من المواهب.', summary_en: 'Conclusion of Innovation Hackathon 2026 with outstanding participation.', category: 'events', date: '2026-06-15', author: 'Events Team', pinned: false },
      { id: 4, title_ar: 'تحديث منصة المشاريع', title_en: 'Projects Platform Update', summary_ar: 'إضافة ميزات جديدة لتسهيل العمل الجماعي وإدارة مهام المشاريع بفعالية.', summary_en: 'New features added to facilitate teamwork and task management.', category: 'platform', date: '2026-06-10', author: 'Dev Team', pinned: false }
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
    // FORCE CLEAR old local storage so dummy data doesn't persist
    localStorage.removeItem('gitm_courses');
    localStorage.removeItem('gitm_news');
    localStorage.removeItem('gitm_users');
    localStorage.removeItem('gitm_events');
    localStorage.removeItem('gitm_partners');

    const unsubTasks = onSnapshot(doc(db, 'gitm_data', 'tasks'), snap => snap.exists() && snap.data().items && setTasks(snap.data().items));
    
    // Proper root collections
    const unsubNews = onSnapshot(collection(db, 'news'), snap => setNews(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubEvents = onSnapshot(collection(db, 'events'), snap => setEvents(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubGallery = onSnapshot(collection(db, 'gallery'), snap => setGallery(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubCourses = onSnapshot(collection(db, 'courses'), snap => setCourses(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubPartners = onSnapshot(collection(db, 'partners'), snap => setPartners(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    return () => {
      unsubTasks();
      unsubNews();
      unsubEvents();
      unsubGallery();
      unsubCourses();
      unsubPartners();
    };
  }, []);

  // Generic Sync Helper
  const syncToFirestore = (key, data) => {
    if (user && data.length > 0) {
      setDoc(doc(db, 'gitm_data', key), { items: data }, { merge: true });
    }
  };

  // Sync tasks to Firestore when changed locally
  useEffect(() => { syncToFirestore('tasks', tasks); }, [tasks, user]);
  // Removed auto-sync for news, gallery, events, courses since they are managed individually

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
