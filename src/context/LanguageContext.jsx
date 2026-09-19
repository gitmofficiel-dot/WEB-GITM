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
  

  // Users fallback
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gitm_users');
    return saved ? JSON.parse(saved) : [
      { id: 'user1', name: 'Eng. Mohammed Rhzaouni', firstName: 'Ã™â€¦. Ã™â€¦Ã˜Â­Ã™â€¦Ã˜Â¯ Ã˜ÂºÃ˜Â²Ã˜Â§Ã™Ë†Ã™â€ Ã™Å ', email: 'president@gitm.ma', role: 'president', isTeamMember: true, bio: 'Ã™â€¦Ã™â€¡Ã™â€ Ã˜Â¯Ã˜Â³ Ã˜Â±Ã˜Â¤Ã™Å Ã™Ë†Ã™Å Ã˜Å’ Ã™â€šÃ˜Â§Ã˜Â¯ Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¯Ã™Å Ã˜Â¯ Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â¨Ã˜ÂªÃ™Æ’Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ˜Â£Ã™â€ Ã˜Â¸Ã™â€¦Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â¯Ã™â€¦Ã˜Â¬Ã˜Â© Ã™Ë†Ã˜Â¥Ã™â€ Ã˜ÂªÃ˜Â±Ã™â€ Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â´Ã™Å Ã˜Â§Ã˜Â¡ Ã™â€žÃ˜Â¨Ã™â€ Ã˜Â§Ã˜Â¡ Ã™â€¦Ã˜Â³Ã˜ÂªÃ™â€šÃ˜Â¨Ã™â€ž Ã˜Â°Ã™Æ’Ã™Å .' },
      { id: 'user2', name: 'Prof. Ahmed Bensalem', firstName: 'Ã˜Â£. Ã˜Â¯. Ã˜Â£Ã˜Â­Ã™â€¦Ã˜Â¯ Ã˜Â¨Ã™â€ Ã˜Â³Ã˜Â§Ã™â€žÃ™â€¦', email: 'ahmed@gitm.ma', role: 'teacher', isTeamMember: true, bio: 'Ã˜Â£Ã˜Â³Ã˜ÂªÃ˜Â§Ã˜Â° Ã˜Â¨Ã˜Â§Ã˜Â­Ã˜Â« Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ˜Â°Ã™Æ’Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂµÃ˜Â·Ã™â€ Ã˜Â§Ã˜Â¹Ã™Å Ã˜Å’ Ã™Ë†Ã˜Â®Ã˜Â¨Ã™Å Ã˜Â± Ã˜Â¹Ã˜Â§Ã™â€žÃ™â€¦Ã™Å  Ã™ÂÃ™Å  Ã™â€¦Ã˜Â¹Ã˜Â§Ã™â€žÃ˜Â¬Ã˜Â© Ã˜Â§Ã™â€žÃ™â€žÃ˜ÂºÃ˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â·Ã˜Â¨Ã™Å Ã˜Â¹Ã™Å Ã˜Â© Ã™Ë†Ã˜ÂªÃ˜Â·Ã™Ë†Ã™Å Ã˜Â± Ã™â€ Ã™â€¦Ã˜Â§Ã˜Â°Ã˜Â¬ Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¹Ã™â€žÃ™â€¦ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€š Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂªÃ˜Â·Ã™Ë†Ã˜Â±Ã˜Â©.' },
      { id: 'user3', name: 'Dr. Laila Ammari', firstName: 'Ã˜Â¯. Ã™â€žÃ™Å Ã™â€žÃ™â€° Ã˜Â¹Ã™â€¦Ã˜Â§Ã˜Â±Ã™Å ', email: 'laila@gitm.ma', role: 'teacher', isTeamMember: true, bio: 'Ã˜Â£Ã˜Â³Ã˜ÂªÃ˜Â§Ã˜Â°Ã˜Â© Ã˜Â¹Ã™â€žÃ™Ë†Ã™â€¦ Ã˜Â§Ã™â€žÃ˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã™Ë†Ã˜Â±Ã˜Â§Ã˜Â¦Ã˜Â¯Ã˜Â© Ã˜Â£Ã˜Â¨Ã˜Â­Ã˜Â§Ã˜Â« Ã˜Â§Ã™â€žÃ˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¶Ã˜Â®Ã™â€¦Ã˜Â©Ã˜Å’ Ã™Ë†Ã™â€žÃ™â€¡Ã˜Â§ Ã˜Â¥Ã˜Â³Ã™â€¡Ã˜Â§Ã™â€¦Ã˜Â§Ã˜Âª Ã™Æ’Ã˜Â¨Ã™Å Ã˜Â±Ã˜Â© Ã™ÂÃ™Å  Ã˜ÂªÃ˜Â­Ã™â€žÃ™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜ÂªÃ™â€ Ã˜Â¨Ã˜Â¤Ã™Å Ã˜Â©.' },
      { id: 'user4', name: 'Eng. Sarah Alaoui', firstName: 'Ã™â€¦. Ã˜Â³Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€žÃ™Ë†Ã™Å ', email: 'sarah@gitm.ma', role: 'supervisor', isTeamMember: true, bio: 'Ã™â€¦Ã˜Â¯Ã™Å Ã˜Â±Ã˜Â© Ã˜Â£Ã™â€ Ã˜Â¸Ã™â€¦Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â±Ã™Ë†Ã˜Â¨Ã™Ë†Ã˜ÂªÃ˜Â§Ã˜ÂªÃ˜Å’ Ã™â€¦Ã™â€¡Ã™â€ Ã˜Â¯Ã˜Â³Ã˜Â© Ã™â€¦Ã˜ÂªÃ™â€¦Ã™Å Ã˜Â²Ã˜Â© Ã˜ÂªÃ™â€šÃ™Ë†Ã˜Â¯ Ã˜ÂªÃ˜Â·Ã™Ë†Ã™Å Ã˜Â± Ã˜Â£Ã™â€ Ã˜Â¸Ã™â€¦Ã˜Â© ROS2 Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂªÃ™â€šÃ˜Â¯Ã™â€¦Ã˜Â© Ã™â€žÃ™â€žÃ˜Â±Ã™Ë†Ã˜Â¨Ã™Ë†Ã˜ÂªÃ˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â³Ã˜ÂªÃ™â€šÃ™â€žÃ˜Â©.' },
      { id: 'user5', name: 'Omar Tazi', firstName: 'Ã˜Â¹Ã™â€¦Ã˜Â± Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â§Ã˜Â²Ã™Å ', email: 'omar@gitm.ma', role: 'supervisor', isTeamMember: true, bio: 'Ã™â€¦Ã™â€¡Ã™â€ Ã˜Â¯Ã˜Â³ Ã˜Â§Ã™â€žÃ˜Â¨Ã™â€ Ã™Å Ã˜Â© Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â­Ã˜ÂªÃ™Å Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â­Ã˜Â§Ã˜Â¨Ã™Å Ã˜Â© Ã™Ë†Ã˜Â®Ã˜Â¨Ã™Å Ã˜Â± Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ˜Â£Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â¨Ã˜Â±Ã˜Â§Ã™â€ Ã™Å Ã˜Å’ Ã™Å Ã˜Â¶Ã™â€¦Ã™â€  Ã˜Â§Ã˜Â³Ã˜ÂªÃ™â€šÃ˜Â±Ã˜Â§Ã˜Â± Ã˜Â®Ã™Ë†Ã˜Â§Ã˜Â¯Ã™â€¦Ã™â€ Ã˜Â§.' },
      { id: 'user6', name: 'Youssef El Idrissi', firstName: 'Ã™Å Ã™Ë†Ã˜Â³Ã™Â Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¯Ã˜Â±Ã™Å Ã˜Â³Ã™Å ', email: 'youssef@gitm.ma', role: 'member', isTeamMember: true, bio: 'Ã™â€¦Ã˜Â·Ã™Ë†Ã˜Â± Ã™Ë†Ã™Å Ã˜Â¨ Ã™â€¦Ã˜ÂªÃ˜Â®Ã˜ÂµÃ˜Âµ Ã™ÂÃ™Å  Ã˜Â¨Ã™â€ Ã˜Â§Ã˜Â¡ Ã™Ë†Ã˜Â§Ã˜Â¬Ã™â€¡Ã˜Â§Ã˜Âª Ã™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã˜Â­Ã˜Â¯Ã™Å Ã˜Â«Ã˜Â© Ã™Ë†Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â© Ã™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â«Ã™â€ Ã˜Â§Ã˜Â¦Ã™Å Ã˜Â©.' }
    ];
  });

  // 6. Data States
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('gitm_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('gitm_courses');
    return saved ? JSON.parse(saved) : [
      { id: 'react-node', track: 'web', title_ar: 'Ã˜ÂªÃ˜Â·Ã™Ë†Ã™Å Ã˜Â± Ã˜Â´Ã˜Â§Ã™â€¦Ã™â€ž Ã˜Â¨Ã™â‚¬ React Ã™Ë† Node.js', title_en: 'Full-Stack React & Node.js', instructor: {ar: 'Ã˜Â£Ã˜Â­Ã™â€¦Ã˜Â¯ Ã˜Â¨Ã™â€ Ã˜Â¹Ã™â€žÃ™Å ', en: 'Ahmed Benali'}, progress: 75, enrolled: 120, status: 'Active', hours: 40, rating: 4.8 },
      { id: 'ai-ml', track: 'ai', title_ar: 'Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¹Ã™â€žÃ™â€¦ Ã˜Â§Ã™â€žÃ˜Â¢Ã™â€žÃ™Å  Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â·Ã˜Â¨Ã™Å Ã™â€šÃ™Å ', title_en: 'Applied Machine Learning', instructor: {ar: 'Ã˜Â¯. Ã˜Â³Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â·Ã˜Â§Ã˜Â¨Ã™Å ', en: 'Dr. Sara Khattabi'}, progress: 30, enrolled: 85, status: 'Active', hours: 60, rating: 4.9 },
      { id: 'cloud-aws', track: 'cloud', title_ar: 'Ã™â€¡Ã™â€ Ã˜Â¯Ã˜Â³Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â­Ã˜Â§Ã˜Â¨Ã˜Â© Ã™â€¦Ã˜Â¹ AWS', title_en: 'Cloud Architecture with AWS', instructor: {ar: 'Ã™Å Ã™Ë†Ã˜Â³Ã™Â Ã˜Â§Ã™â€žÃ™â€¦Ã™â€ Ã˜ÂµÃ™Ë†Ã˜Â±Ã™Å ', en: 'Youssef Mansouri'}, progress: 0, enrolled: 60, status: 'Upcoming', hours: 35, rating: 4.7 },
      { id: 'cybersecurity', track: 'security', title_ar: 'Ã˜Â£Ã˜Â³Ã˜Â§Ã˜Â³Ã™Å Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â£Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â¨Ã˜Â±Ã˜Â§Ã™â€ Ã™Å ', title_en: 'Cybersecurity Fundamentals', instructor: {ar: 'Ã™Æ’Ã˜Â±Ã™Å Ã™â€¦ Ã™â€žÃ˜Â­Ã™â€žÃ™Ë†', en: 'Karim Lahlou'}, progress: 100, enrolled: 150, status: 'Completed', hours: 25, rating: 4.9 },
      { id: 'ui-ux', track: 'design', title_ar: 'Ã˜ÂªÃ˜ÂµÃ™â€¦Ã™Å Ã™â€¦ Ã™Ë†Ã˜Â§Ã˜Â¬Ã™â€¡Ã˜Â© Ã™Ë†Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂªÃ™â€šÃ˜Â¯Ã™â€¦', title_en: 'UI/UX Advanced Design', instructor: {ar: 'Ã™â€¦Ã™â€ Ã™â€° Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â§Ã˜Â²Ã™Å ', en: 'Mona Tazi'}, progress: 50, enrolled: 90, status: 'Active', hours: 30, rating: 4.6 }
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
      { id: 1, title_ar: 'Ã˜Â¥Ã˜Â·Ã™â€žÃ˜Â§Ã™â€š Ã˜Â¨Ã˜Â±Ã™â€ Ã˜Â§Ã™â€¦Ã˜Â¬ Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¯Ã˜Â±Ã™Å Ã˜Â¨ Ã˜Â§Ã™â€žÃ˜ÂµÃ™Å Ã™ÂÃ™Å ', title_en: 'Launch of Summer Training Program', summary_ar: 'Ã™â€ Ã˜Â¹Ã™â€žÃ™â€  Ã˜Â¹Ã™â€  Ã˜Â¨Ã˜Â¯Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â³Ã˜Â¬Ã™Å Ã™â€ž Ã™ÂÃ™Å  Ã˜Â¨Ã˜Â±Ã™â€ Ã˜Â§Ã™â€¦Ã˜Â¬ Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¯Ã˜Â±Ã™Å Ã˜Â¨ Ã˜Â§Ã™â€žÃ˜ÂµÃ™Å Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ™â€¦Ã™Æ’Ã˜Â«Ã™Â Ã™â€žÃ™â€žÃ™â€¦Ã™â€¡Ã™â€ Ã˜Â¯Ã˜Â³Ã™Å Ã™â€ .', summary_en: 'Registration for our intensive summer training program is now open.', category: 'academy', date: '2026-06-25', author: 'GITM Team', pinned: true },
      { id: 2, title_ar: 'Ã˜Â´Ã˜Â±Ã˜Â§Ã™Æ’Ã˜Â© Ã˜Â¬Ã˜Â¯Ã™Å Ã˜Â¯Ã˜Â© Ã™â€¦Ã˜Â¹ Ã˜Â¬Ã˜Â§Ã™â€¦Ã˜Â¹Ã˜Â© Ã˜Â±Ã˜Â§Ã˜Â¦Ã˜Â¯Ã˜Â©', title_en: 'New Partnership with Leading University', summary_ar: 'Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ™Ë†Ã™â€šÃ™Å Ã˜Â¹ Ã˜Â§Ã˜ÂªÃ™ÂÃ˜Â§Ã™â€šÃ™Å Ã˜Â© Ã˜ÂªÃ˜Â¹Ã˜Â§Ã™Ë†Ã™â€  Ã™â€¦Ã˜Â¹ Ã™Æ’Ã˜Â¨Ã˜Â±Ã™â€° Ã˜Â§Ã™â€žÃ˜Â¬Ã˜Â§Ã™â€¦Ã˜Â¹Ã˜Â§Ã˜Âª Ã™â€žÃ˜ÂªÃ˜Â·Ã™Ë†Ã™Å Ã˜Â± Ã˜Â¨Ã˜Â±Ã˜Â§Ã™â€¦Ã˜Â¬ Ã˜Â§Ã™â€žÃ˜Â¨Ã˜Â­Ã˜Â« Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€žÃ™â€¦Ã™Å .', summary_en: 'Cooperation agreement signed with major universities to develop research.', category: 'partners', date: '2026-06-20', author: 'President', pinned: false },
      { id: 3, title_ar: 'Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­ Ã˜Â¨Ã˜Â§Ã™â€¡Ã˜Â± Ã™â€žÃ™ÂÃ˜Â¹Ã˜Â§Ã™â€žÃ™Å Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¡Ã˜Â§Ã™Æ’Ã˜Â§Ã˜Â«Ã™Ë†Ã™â€ ', title_en: 'Outstanding Success of Hackathon', summary_ar: 'Ã˜Â§Ã˜Â®Ã˜ÂªÃ˜ÂªÃ˜Â§Ã™â€¦ Ã™ÂÃ˜Â¹Ã˜Â§Ã™â€žÃ™Å Ã˜Â§Ã˜Âª Ã™â€¡Ã˜Â§Ã™Æ’Ã˜Â§Ã˜Â«Ã™Ë†Ã™â€  Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â¨Ã˜ÂªÃ™Æ’Ã˜Â§Ã˜Â± 2026 Ã˜Â¨Ã™â€¦Ã˜Â´Ã˜Â§Ã˜Â±Ã™Æ’Ã˜Â© Ã™â€¦Ã˜ÂªÃ™â€¦Ã™Å Ã˜Â²Ã˜Â© Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ™â€¦Ã™Ë†Ã˜Â§Ã™â€¡Ã˜Â¨.', summary_en: 'Conclusion of Innovation Hackathon 2026 with outstanding participation.', category: 'events', date: '2026-06-15', author: 'Events Team', pinned: false },
      { id: 4, title_ar: 'Ã˜ÂªÃ˜Â­Ã˜Â¯Ã™Å Ã˜Â« Ã™â€¦Ã™â€ Ã˜ÂµÃ˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â§Ã˜Â±Ã™Å Ã˜Â¹', title_en: 'Projects Platform Update', summary_ar: 'Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã™â€¦Ã™Å Ã˜Â²Ã˜Â§Ã˜Âª Ã˜Â¬Ã˜Â¯Ã™Å Ã˜Â¯Ã˜Â© Ã™â€žÃ˜ÂªÃ˜Â³Ã™â€¡Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¬Ã™â€¦Ã˜Â§Ã˜Â¹Ã™Å  Ã™Ë†Ã˜Â¥Ã˜Â¯Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€¦Ã™â€¡Ã˜Â§Ã™â€¦ Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â§Ã˜Â±Ã™Å Ã˜Â¹ Ã˜Â¨Ã™ÂÃ˜Â¹Ã˜Â§Ã™â€žÃ™Å Ã˜Â©.', summary_en: 'New features added to facilitate teamwork and task management.', category: 'platform', date: '2026-06-10', author: 'Dev Team', pinned: false }
    ];
  });

  // 8. Gallery Data
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('gitm_gallery');
    return saved ? JSON.parse(saved) : [
      { id: 1, title_ar: 'Ã˜Â§Ã˜Â¬Ã˜ÂªÃ™â€¦Ã˜Â§Ã˜Â¹ Ã˜Â§Ã™â€žÃ™ÂÃ˜Â±Ã™Å Ã™â€š Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â³Ã˜Â¨Ã™Ë†Ã˜Â¹Ã™Å ', title_en: 'Weekly Team Meeting', category: 'meetings', date: '2026-06-12', type: 'image', color: '#0d9488' },
      { id: 2, title_ar: 'Ã˜Â§Ã˜Â®Ã˜ÂªÃ˜Â¨Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â±Ã™Ë†Ã˜Â¨Ã™Ë†Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â£Ã™Ë†Ã™â€ž', title_en: 'First Robot Test', category: 'projects', date: '2026-06-08', type: 'image', color: '#6366f1' },
      { id: 3, title_ar: 'Ã™Ë†Ã˜Â±Ã˜Â´Ã˜Â© Ã˜Â¹Ã™â€¦Ã™â€ž PCB', title_en: 'PCB Workshop', category: 'workshops', date: '2026-06-05', type: 'image', color: '#f59e0b' },
      { id: 4, title_ar: 'Ã˜Â¹Ã˜Â±Ã˜Â¶ Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹ Ã˜Â§Ã™â€žÃ™â€ Ã™â€¡Ã˜Â§Ã˜Â¦Ã™Å ', title_en: 'Final Project Demo', category: 'events', date: '2026-05-30', type: 'video', color: '#ef4444' },
      { id: 5, title_ar: 'Ã˜Â²Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â®Ã˜ÂªÃ˜Â¨Ã˜Â±', title_en: 'Lab Tour', category: 'meetings', date: '2026-05-25', type: 'image', color: '#8b5cf6' },
    ];
  });

  // 9. Events & Competitions Data
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('gitm_events');
    return saved ? JSON.parse(saved) : [
      { id: 1, title_ar: 'Ã™â€¡Ã˜Â§Ã™Æ’Ã˜Â§Ã˜Â«Ã™Ë†Ã™â€  GITM 2026', title_en: 'GITM Hackathon 2026', date: '2026-07-15T09:00', endDate: '2026-07-17T18:00', contactDate: '2026-07-20', location: 'Casablanca TechHub', type: 'hackathon', status: 'upcoming', description_ar: 'Ã™â€¦Ã˜Â³Ã˜Â§Ã˜Â¨Ã™â€šÃ˜Â© Ã˜Â¨Ã˜Â±Ã™â€¦Ã˜Â¬Ã™Å Ã˜Â© Ã˜Â¹Ã™â€žÃ™â€° Ã™â€¦Ã˜Â¯Ã˜Â§Ã˜Â± 48 Ã˜Â³Ã˜Â§Ã˜Â¹Ã˜Â©', description_en: '48-hour coding competition', requirements: { teamMin: 2, teamMax: 5, needsProjectName: true, needsFileUpload: true } },
      { id: 2, title_ar: 'Ã™Ë†Ã˜Â±Ã˜Â´Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â°Ã™Æ’Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂµÃ˜Â·Ã™â€ Ã˜Â§Ã˜Â¹Ã™Å ', title_en: 'AI Workshop', date: '2026-07-05T14:00', endDate: '2026-07-05T18:00', contactDate: '2026-07-06', location: 'GITM Lab', type: 'workshop', status: 'upcoming', description_ar: 'Ã˜ÂªÃ˜Â¹Ã™â€žÃ™â€¦ Ã˜Â£Ã˜Â³Ã˜Â§Ã˜Â³Ã™Å Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¹Ã™â€žÃ™â€¦ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€š', description_en: 'Learn deep learning fundamentals', requirements: { teamMin: 1, teamMax: 1, needsProjectName: false, needsFileUpload: false } },
      { id: 3, title_ar: 'Ã™â€¦Ã˜Â¤Ã˜ÂªÃ™â€¦Ã˜Â± Ã˜Â§Ã™â€žÃ˜ÂªÃ™Æ’Ã™â€ Ã™Ë†Ã™â€žÃ™Ë†Ã˜Â¬Ã™Å Ã˜Â§ Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂºÃ˜Â±Ã˜Â¨Ã™Å ', title_en: 'Morocco Tech Conference', date: '2026-08-20T10:00', endDate: '2026-08-21T18:00', contactDate: '2026-08-25', location: 'Rabat Convention Center', type: 'conference', status: 'upcoming', description_ar: 'Ã˜Â£Ã™Æ’Ã˜Â¨Ã˜Â± Ã™â€¦Ã˜Â¤Ã˜ÂªÃ™â€¦Ã˜Â± Ã˜ÂªÃ™â€šÃ™â€ Ã™Å  Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂºÃ˜Â±Ã˜Â¨', description_en: 'Morocco\'s largest tech conference', requirements: { teamMin: 1, teamMax: 1, needsProjectName: false, needsFileUpload: false } },
      { id: 4, title_ar: 'Ã™â€žÃ™â€šÃ˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â¹Ã˜Â¶Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â´Ã™â€¡Ã˜Â±Ã™Å ', title_en: 'Monthly Members Meetup', date: '2026-06-01T18:00', endDate: '2026-06-01T20:00', contactDate: '2026-06-02', location: 'Online', type: 'meetup', status: 'completed', description_ar: 'Ã˜Â§Ã˜Â¬Ã˜ÂªÃ™â€¦Ã˜Â§Ã˜Â¹ Ã˜Â´Ã™â€¡Ã˜Â±Ã™Å  Ã™â€žÃ™â€¦Ã˜Â±Ã˜Â§Ã˜Â¬Ã˜Â¹Ã˜Â© Ã˜Â§Ã™â€žÃ˜ÂªÃ™â€šÃ˜Â¯Ã™â€¦', description_en: 'Monthly progress review meeting' },
    ];
  });

  const [competitions, setCompetitions] = useState(() => {
    const saved = localStorage.getItem('gitm_competitions');
    return saved ? JSON.parse(saved) : [
      { id: 1, scope: 'national', title_ar: 'Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â³Ã˜Â§Ã˜Â¨Ã™â€šÃ˜Â© Ã˜Â§Ã™â€žÃ™Ë†Ã˜Â·Ã™â€ Ã™Å Ã˜Â© Ã™â€žÃ™â€žÃ˜Â±Ã™Ë†Ã˜Â¨Ã™Ë†Ã˜ÂªÃ˜Â§Ã˜Âª', title_en: 'National Robotics Competition', date: '2026-09-10', location: 'Rabat', reward: '100,000 MAD', status: 'open' },
      { id: 2, scope: 'international', title_ar: 'Ã˜ÂªÃ˜Â­Ã˜Â¯Ã™Å  Ã™â€ Ã˜Â§Ã˜Â³Ã˜Â§ Ã™â€žÃ˜ÂªÃ˜Â·Ã˜Â¨Ã™Å Ã™â€šÃ˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™ÂÃ˜Â¶Ã˜Â§Ã˜Â¡', title_en: 'NASA Space Apps Challenge', date: '2026-10-01', location: 'Online & Casablanca Hub', reward: 'Global Recognition', status: 'open' },
      { id: 3, scope: 'international', title_ar: 'Ã˜Â¨Ã˜Â·Ã™Ë†Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â§Ã™â€žÃ™â€¦ Ã™â€žÃ™â€žÃ˜Â°Ã™Æ’Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂµÃ˜Â·Ã™â€ Ã˜Â§Ã˜Â¹Ã™Å ', title_en: 'World AI Championship', date: '2026-11-15', location: 'Dubai, UAE', reward: '$50,000', status: 'upcoming' },
      { id: 4, scope: 'national', title_ar: 'Ã˜Â¬Ã˜Â§Ã˜Â¦Ã˜Â²Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â¨Ã˜ÂªÃ™Æ’Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂºÃ˜Â±Ã˜Â¨Ã™Å Ã˜Â©', title_en: 'Moroccan Innovation Award', date: '2026-08-05', location: 'Marrakech', reward: '50,000 MAD', status: 'closed' },
    ];
  });

  // 10. Partners Data
  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('gitm_partners');
    return saved ? JSON.parse(saved) : {
      strategic: ['Microsoft Morocco', 'IBM Cloud', 'Google DevSpace', 'AWS Activate', 'Huawei ICT Academy', 'Oracle Academy'],
      supporting: ['UniversitÃƒÂ© Hassan II', 'ENSAM Casablanca', 'OFPPT', 'ONDA', 'Maroc Telecom', 'OCP Group', 'CGEM']
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

  // Effect: Listen to Firebase Auth State & Sync with Firestore (Removed to prevent duplication)

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

  const changeLanguage = (newLang) => {
    if (newLang === lang) return;
    setIsTranslating(true);
    setTargetLang(newLang);
    
    setTimeout(() => {
      // Set our internal state to English if it's a foreign language,
      // so the base DOM is predictable (English) before Google translates it.
      // Or just set to newLang and let our ternary default to English.
      setLang(newLang);
      
      setIsTranslating(false);
      setTargetLang(null);
    }, 300);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Removed mock auth to avoid conflicts with real AuthContext.
  
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

  const t_inline = (arStr, enStr) => {
    if (lang === 'ar') return arStr;
    if (lang === 'en') return enStr;
    // Fallback for other languages (fr, es, etc.)
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
