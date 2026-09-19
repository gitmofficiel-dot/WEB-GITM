import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../translations/dictionary';
import { auth } from '../config/firebaseAuth';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { useAuth } from './AuthContext';

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

  // 4. Removed Auth User State from here, it should only be managed by AuthContext.

  // 5. Active Dashboard Role
  const [activeDashboardRole, setActiveDashboardRole] = useState('student');

  // Users - empty fallback, real data comes from Firebase
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gitm_users');
    return saved ? JSON.parse(saved) : [];
  });

  // 6. Data States
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('gitm_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Courses - empty fallback, real data from Firebase
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('gitm_courses');
    return saved ? JSON.parse(saved) : [];
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

  // 7. News Data - empty fallback, real data from Firebase
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('gitm_news');
    return saved ? JSON.parse(saved) : [];
  });

  // 8. Gallery Data - empty fallback, real data from Firebase
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('gitm_gallery');
    return saved ? JSON.parse(saved) : [];
  });

  // 9. Events & Competitions Data - empty fallback, real data from Firebase
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('gitm_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [competitions, setCompetitions] = useState(() => {
    const saved = localStorage.getItem('gitm_competitions');
    return saved ? JSON.parse(saved) : [];
  });

  // 10. Partners Data - empty fallback, real data from Firebase
  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('gitm_partners');
    return saved ? JSON.parse(saved) : [];
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

  // Effect: Listen to Data from Firestore
  useEffect(() => {
    // FORCE CLEAR old local storage so dummy data doesn't persist
    localStorage.removeItem('gitm_courses');
    localStorage.removeItem('gitm_news');
    localStorage.removeItem('gitm_users');
    localStorage.removeItem('gitm_events');
    localStorage.removeItem('gitm_partners');
    localStorage.removeItem('gitm_competitions');
    localStorage.removeItem('gitm_gallery');

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

  // Effect: Save data to localStorage (Local Fallback)
  useEffect(() => { localStorage.setItem('gitm_grades', JSON.stringify(grades)); }, [grades]);
  useEffect(() => { localStorage.setItem('gitm_ai_jobs', JSON.stringify(aiJobs)); }, [aiJobs]);
  useEffect(() => { localStorage.setItem('gitm_internships', JSON.stringify(internships)); }, [internships]);
  useEffect(() => { localStorage.setItem('gitm_papers', JSON.stringify(papers)); }, [papers]);
  useEffect(() => { localStorage.setItem('gitm_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gitm_competitions', JSON.stringify(competitions)); }, [competitions]);
  useEffect(() => { localStorage.setItem('gitm_partners', JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem('gitm_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
  useEffect(() => { localStorage.setItem('gitm_event_registrations', JSON.stringify(eventRegistrations)); }, [eventRegistrations]);

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

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations['ar'];
    
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Arabic
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

  const t_inline = (arStr, enStr) => {
    if (lang === 'ar') return arStr;
    if (lang === 'en') return enStr;
    return enStr;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage,
      t,
      t_inline,
      languages,
      isTranslating,
      targetLang,
      
      theme,
      toggleTheme,
      
      view,
      setView,
      selectedProfileId,
      setSelectedProfileId,
      
      users,
      setUsers,
      
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
