import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, languages } from '../translations/dictionary';
import { auth } from '../config/firebaseAuth';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import safeStorage from '../utils/safeStorage';

import { useNavigate, useLocation } from 'react-router-dom';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const ALLOWED_THEMES = ['dark', 'light'];
const isValidSavedItems = (val) =>
  Boolean(val) &&
  typeof val === 'object' &&
  !Array.isArray(val) &&
  Array.isArray(val.news) &&
  Array.isArray(val.books);

export const LanguageProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const invalidFallbackRef = useRef(null);
  if (invalidFallbackRef.current === null) {
    invalidFallbackRef.current = new Map();
  }

  const recordInvalidFallback = (key, value) => {
    let seen = invalidFallbackRef.current.get(key);
    if (!seen) {
      seen = new Set();
      invalidFallbackRef.current.set(key, seen);
    }
    seen.add(value);
  };

  const initString = (key, allowedValues, fallback) => {
    const res = safeStorage.readString(key, allowedValues, fallback);
    if (!res.valid) {
      recordInvalidFallback(key, res.value);
    }
    return res.value;
  };

  const initJSON = (key, validator, createFallback) => {
    const res = safeStorage.readJSON(key, validator, createFallback);
    if (!res.valid) {
      recordInvalidFallback(key, res.value);
    }
    return res.value;
  };

  const syncPersisted = (key, value, serialize = (v) => v) => {
    const seenInvalid = invalidFallbackRef.current.get(key);
    if (seenInvalid) {
      if (seenInvalid.has(value)) {
        return;
      }
      invalidFallbackRef.current.delete(key);
    }
    safeStorage.setItem(key, serialize(value));
  };

  // 1. Language State
  const [lang, setLang] = useState(() => initString('gitm_lang', languages, 'ar'));
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState(null);

  // 2. Theme State (Light / Dark)
  const [theme, setTheme] = useState(() => initString('gitm_theme', ALLOWED_THEMES, 'dark'));

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
  const [users, setUsers] = useState(() => initJSON('gitm_users', Array.isArray, () => []));

  // 6. Data States
  const [tasks, setTasks] = useState(() => initJSON('gitm_tasks', Array.isArray, () => []));

  // Courses - empty fallback, real data from Firebase
  const [courses, setCourses] = useState(() => initJSON('gitm_courses', Array.isArray, () => []));

  const [grades, setGrades] = useState(() => initJSON('gitm_grades', Array.isArray, () => []));

  const [aiJobs, setAiJobs] = useState(() => initJSON('gitm_ai_jobs', Array.isArray, () => []));

  const [internships, setInternships] = useState(() => initJSON('gitm_internships', Array.isArray, () => []));

  const [papers, setPapers] = useState(() => initJSON('gitm_papers', Array.isArray, () => []));

  // 7. News Data - empty fallback, real data from Firebase
  const [news, setNews] = useState(() => initJSON('gitm_news', Array.isArray, () => []));

  // 8. Gallery Data - empty fallback, real data from Firebase
  const [gallery, setGallery] = useState(() => initJSON('gitm_gallery', Array.isArray, () => []));

  // 9. Events & Competitions Data - empty fallback, real data from Firebase
  const [events, setEvents] = useState(() => initJSON('gitm_events', Array.isArray, () => []));

  const [competitions, setCompetitions] = useState(() => initJSON('gitm_competitions', Array.isArray, () => []));

  // 10. Partners Data - empty fallback, real data from Firebase
  const [partners, setPartners] = useState(() => initJSON('gitm_partners', Array.isArray, () => []));

  // 11. Saved/Bookmarked Items
  const [savedItems, setSavedItems] = useState(() =>
    initJSON('gitm_saved_items', isValidSavedItems, () => ({ news: [], books: [] }))
  );

  const toggleSave = (type, item) => {
    if (type !== 'news' && type !== 'books') return;
    if (!item || typeof item !== 'object') return;
    setSavedItems(prev => {
      const base = isValidSavedItems(prev) ? prev : { news: [], books: [] };
      const currentList = Array.isArray(base[type]) ? base[type] : [];
      const isSaved = currentList.some(i =>
        i && typeof i === 'object' &&
        ((item.id !== undefined && i.id === item.id) ||
         (item.key !== undefined && i.key === item.key))
      );
      const updated = isSaved 
        ? currentList.filter(i =>
            !(i && typeof i === 'object' &&
              ((item.id !== undefined && i.id === item.id) ||
               (item.key !== undefined && i.key === item.key)))
          )
        : [...currentList, item];
      return {
        news: Array.isArray(base.news) ? base.news : [],
        books: Array.isArray(base.books) ? base.books : [],
        [type]: updated
      };
    });
  };

  // 12. Event Registrations (Project Submissions)
  const [eventRegistrations, setEventRegistrations] = useState(() =>
    initJSON('gitm_event_registrations', Array.isArray, () => [])
  );

  // Effect: Sync Language
  useEffect(() => {
    syncPersisted('gitm_lang', lang);
    const dir = languages[lang]?.dir || 'ltr';
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Effect: Sync Theme
  useEffect(() => {
    syncPersisted('gitm_theme', theme);
    if (typeof document !== 'undefined' && document.documentElement) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  // Effect: Listen to Data from Firestore
  useEffect(() => {
    // FORCE CLEAR old local storage so dummy data doesn't persist
    safeStorage.removeItem('gitm_courses');
    safeStorage.removeItem('gitm_news');
    safeStorage.removeItem('gitm_users');
    safeStorage.removeItem('gitm_events');
    safeStorage.removeItem('gitm_partners');
    safeStorage.removeItem('gitm_competitions');
    safeStorage.removeItem('gitm_gallery');

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
  useEffect(() => { syncPersisted('gitm_grades', grades, JSON.stringify); }, [grades]);
  useEffect(() => { syncPersisted('gitm_ai_jobs', aiJobs, JSON.stringify); }, [aiJobs]);
  useEffect(() => { syncPersisted('gitm_internships', internships, JSON.stringify); }, [internships]);
  useEffect(() => { syncPersisted('gitm_papers', papers, JSON.stringify); }, [papers]);
  useEffect(() => { syncPersisted('gitm_users', users, JSON.stringify); }, [users]);
  useEffect(() => { syncPersisted('gitm_competitions', competitions, JSON.stringify); }, [competitions]);
  useEffect(() => { syncPersisted('gitm_partners', partners, JSON.stringify); }, [partners]);
  useEffect(() => { syncPersisted('gitm_saved_items', savedItems, JSON.stringify); }, [savedItems]);
  useEffect(() => { syncPersisted('gitm_event_registrations', eventRegistrations, JSON.stringify); }, [eventRegistrations]);

  const changeLanguage = (newLang) => {
    if (!Object.prototype.hasOwnProperty.call(languages, newLang)) return;
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
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Arabic
        let fallback = translations['ar'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
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
