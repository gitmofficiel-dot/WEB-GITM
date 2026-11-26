import React, { useState, useEffect } from 'react';
import { hasCourseModules, resolveCourseStartTransition } from '../utils/academyCourseState';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, PlayCircle, Lock, CheckCircle, ChevronRight, Library, Search, Filter, Clock, Video } from 'lucide-react';
import LessonView from './academy/LessonView';
import QuizEngine from './academy/QuizEngine';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

const CourseThumbnail = ({ src, alt, icon: Icon = BookOpen, contain = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/20 dark:from-teal-950/60 dark:via-slate-800 dark:to-cyan-950/50 flex items-center justify-center">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`transition-all duration-500 group-hover:scale-105 ${
            contain ? 'h-full w-auto object-contain p-3 drop-shadow-lg' : 'w-full h-full object-cover'
          } ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-teal-200/70 dark:border-cyan-500/30 text-teal-700 dark:text-cyan-300">
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};

export default function Academy() {
  const { lang } = useLanguage();
  const t = (ar, en, fr) => (lang === 'ar' ? ar : lang === 'fr' ? fr : en);
  const [courses, setCourses] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const [activeCourse, setActiveCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [unlockedModules, setUnlockedModules] = useState([0]);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isCourseStarted, setIsCourseStarted] = useState(false);
  const [showCourseIntro, setShowCourseIntro] = useState(false);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedBookLang, setSelectedBookLang] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });

        if (coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchBooks = async (query = '') => {
    setBooksLoading(true);
    try {
      let finalQuery = query.trim() || 'technology';
      if (selectedCategory !== 'All') {
        finalQuery = `${selectedCategory} ${finalQuery}`.trim();
      }

      let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(finalQuery)}&maxResults=12`;

      if (selectedBookLang === 'ar') url += '&langRestrict=ar';
      else if (selectedBookLang === 'en') url += '&langRestrict=en';
      else if (selectedBookLang === 'fr') url += '&langRestrict=fr';

      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      if (apiKey) url += `&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.items) {
        setBooks(data.items);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'library') {
      const timeoutId = setTimeout(() => {
        fetchBooks(searchQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeTab, selectedCategory, selectedBookLang]);

  const startCourse = (course) => {
    setActiveCourse(course);
    setIsCourseStarted(false);
    setShowCourseIntro(false);
    setCurrentModuleIndex(0);
    setUnlockedModules([0]);
    setCourseCompleted(false);
  };

  const startCourseFlow = () => {
    const next = resolveCourseStartTransition(activeCourse);
    if (!next.allowed) return;
    setIsCourseStarted(next.started);
    setShowCourseIntro(next.showIntro);
  };

  const closeCourse = () => {
    setActiveCourse(null);
    setIsCourseStarted(false);
    setShowCourseIntro(false);
    setCurrentModuleIndex(0);
    setUnlockedModules([0]);
  };

  const handleLessonComplete = () => {
    if (!activeCourse.modules) return;
    const nextIndex = currentModuleIndex + 1;
    if (nextIndex < activeCourse.modules.length) {
      if (!unlockedModules.includes(nextIndex)) {
        setUnlockedModules([...unlockedModules, nextIndex]);
      }
      setCurrentModuleIndex(nextIndex);
    } else {
      setCourseCompleted(true);
    }
  };

  const handleQuizComplete = (score) => {
    setCourseCompleted(true);
  };


  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (l === 'ar' && obj[`${field}Ar`]) return obj[`${field}Ar`];
    if (l === 'en' && obj[`${field}En`]) return obj[`${field}En`];
    if (l === 'fr' && obj[`${field}Fr`]) return obj[`${field}Fr`];
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const getCategoryLabel = (cat) => {
    if (lang === 'fr') {
      const frMap = {
        All: 'Toutes',
        AI: 'IA',
        'Web Dev': 'Développement Web',
        Security: 'Sécurité',
        'Data Science': 'Science des données',
        Cloud: 'Cloud',
        Technology: 'Technologie'
      };
      return frMap[cat] || cat;
    }
    if (lang !== 'ar') return cat;
    const map = {
      All: 'الكل',
      AI: 'الذكاء الاصطناعي',
      'Web Dev': 'تطوير الويب',
      Security: 'الأمن السيبراني',
      'Data Science': 'علوم البيانات',
      Cloud: 'الحوسبة السحابية'
    };
    return map[cat] || cat;
  };

  const getLevelLabel = (lvl) => {
    if (!lvl) return '';
    const key = lvl.toLowerCase();
    if (lang === 'ar') {
      const map = { all: 'الكل', beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' };
      return map[key] || lvl;
    }
    if (lang === 'fr') {
      const map = { all: 'Tous', beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' };
      return map[key] || lvl;
    }
    return lvl;
  };

  // Category matching is tolerant: data may store the track in any case, in Arabic,
  // or as a generic value such as "Technology", so also match keywords in title/description.
  const CATEGORY_KEYWORDS = {
    'AI': ['ai', 'artificial', 'machine learning', 'ذكاء', 'تعلم الآلة', 'التعلم الآلي', 'intelligence'],
    'Web Dev': ['web', 'frontend', 'backend', 'react', 'html', 'ويب', 'مواقع'],
    'Security': ['security', 'cyber', 'أمن', 'سيبراني', 'sécurité'],
    'Data Science': ['data', 'بيانات', 'données', 'analytics'],
    'Cloud': ['cloud', 'سحاب', 'aws', 'devops']
  };
  const courseMatchesCategory = (c, cat) => {
    const track = String(c.track || '').trim().toLowerCase();
    if (track && track === cat.toLowerCase()) return true;
    const kws = CATEGORY_KEYWORDS[cat] || [];
    const hay = [track, c.title, c.titleAr, c.titleEn, c.titleFr, c.description, c.descriptionAr, c.descriptionEn]
      .filter((v) => typeof v === 'string').join(' ').toLowerCase();
    return kws.some((k) => hay.includes(k));
  };

  const filteredCourses = courses.filter(c => {
    if (selectedCategory !== 'All' && !courseMatchesCategory(c, selectedCategory)) return false;
    if (selectedLevel !== 'All' && String(c.level || '').trim().toLowerCase() !== selectedLevel.toLowerCase()) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = getLocalized(c, 'title', lang).toLowerCase();
    const desc = getLocalized(c, 'description', lang).toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = ['All', 'AI', 'Web Dev', 'Security', 'Data Science', 'Cloud'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const bookLangs = [
    { value: 'All', labelAr: 'الكل', labelEn: 'All', labelFr: 'Toutes' },
    { value: 'ar', labelAr: 'العربية', labelEn: 'Arabic', labelFr: 'Arabe' },
    { value: 'en', labelAr: 'الإنجليزية', labelEn: 'English', labelFr: 'Anglais' },
    { value: 'fr', labelAr: 'الفرنسية', labelEn: 'French', labelFr: 'Français' }
  ];

  const activeCount = activeTab === 'courses' ? filteredCourses.length : books.length;
  const countLabel = lang === 'ar'
    ? (activeCount === 1 || activeCount > 10 ? 'نتيجة' : 'نتائج')
    : lang === 'fr'
      ? (activeCount === 1 ? 'résultat' : 'résultats')
      : (activeCount === 1 ? 'result' : 'results');

  if (activeCourse) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-[#09090b] pb-16">
        {/* Course Header */}
        <div className="w-full bg-[#1e3a5f] dark:bg-slate-900 text-white pt-24 pb-10 md:py-16 px-4 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/50 to-blue-900/50 z-0" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-teal-300 text-xs sm:text-sm font-bold mb-3">
                <ChevronRight size={15} className="rtl:rotate-180 shrink-0" />
                <span>{getCategoryLabel(activeCourse.track || 'Technology')}</span>
                <ChevronRight size={15} className="rtl:rotate-180 shrink-0" />
                <span className="break-words">{getLocalized(activeCourse, 'title', lang)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight break-words">
                {getLocalized(activeCourse, 'title', lang)}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-5 md:mb-6 max-w-2xl leading-relaxed">
                {getLocalized(activeCourse, 'description', lang)}
              </p>

              {String(activeCourse.duration || '').trim() && (
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs sm:text-sm text-slate-200 mb-6 md:mb-8">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{String(activeCourse.duration).trim()} {t('من الدراسة', 'to complete', 'pour terminer')}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                {!hasCourseModules(activeCourse) ? (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-3.5 bg-slate-600/80 text-slate-200 font-bold rounded-xl shadow-lg cursor-not-allowed"
                  >
                    {t('الدروس قيد التجهيز', 'Curriculum is being prepared', 'Le programme est en cours de préparation')}
                  </button>
                ) : !isCourseStarted ? (
                  <button
                    type="button"
                    onClick={startCourseFlow}
                    className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    {t('سجل مجاناً وابدأ الدورة', 'Enroll & Start Course', "S'inscrire et commencer le cours")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-default flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} /> {t('أنت مسجل في الدورة', 'Enrolled', 'Inscrit')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeCourse}
                  className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl backdrop-blur-md transition-all"
                >
                  {t('العودة للمقررات', 'Back to Catalog', 'Retour au catalogue')}
                </button>
              </div>
            </div>

            <div className="w-full md:w-[400px] shrink-0">
              <div className="bg-white/10 p-1.5 md:p-2 rounded-2xl shadow-2xl relative group overflow-hidden">
                <div className="rounded-xl overflow-hidden">
                  <CourseThumbnail
                    src={activeCourse.thumbnail}
                    alt={getLocalized(activeCourse, 'title', lang)}
                  />
                </div>
                {hasCourseModules(activeCourse) && (
                  <div
                    onClick={startCourseFlow}
                    className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/20 transition-all rounded-xl cursor-pointer"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="text-white w-9 h-9 md:w-10 md:h-10" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum & Player Area */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {!isCourseStarted ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold mb-5 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                <Library className="text-teal-500 shrink-0" />
                <span>{t('حول هذه الدورة', 'About this Course', 'À propos de ce cours')}</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg">
                {getLocalized(activeCourse, 'longDescription', lang) || getLocalized(activeCourse, 'description', lang)}
              </p>
            </div>
          ) : !activeCourse.modules || activeCourse.modules.length === 0 ? (
            <div className="text-center py-16 md:py-24 px-4 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Video className="w-14 h-14 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('الدروس قيد التجهيز', 'Curriculum is being prepared', 'Le programme est en cours de préparation')}
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                {t('سيتم إضافة محتوى الفيديو قريباً. يرجى العودة لاحقاً.', 'Video content will be uploaded soon. Please check back later.', 'Le contenu vidéo sera bientôt disponible. Revenez plus tard.')}
              </p>
            </div>
          ) : showCourseIntro ? (
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-slate-900 dark:text-white">
                {t('مقدمة التدريب', 'Course Introduction', 'Introduction du cours')}
              </h2>

              {activeCourse.courseIntroVideo && (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <iframe
                    src={activeCourse.courseIntroVideo}
                    className="w-full h-full"
                    allowFullScreen
                    title="Course Intro Video"
                  />
                </div>
              )}

              {activeCourse.courseIntroText && (
                <div className="prose dark:prose-invert max-w-none text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-start px-1 md:px-4">
                  {activeCourse.courseIntroText}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowCourseIntro(false)}
                className="w-full sm:w-auto min-h-[48px] px-10 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all text-base md:text-lg"
              >
                {t('ابدأ الدرس الأول', 'Start First Lesson', 'Commencer la première leçon')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <LessonView
                  lesson={activeCourse.modules[currentModuleIndex]}
                  onComplete={handleLessonComplete}
                  lang={lang}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm lg:sticky lg:top-24">
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-slate-900 dark:text-white">
                    {t('محتوى الدورة', 'Course Content', 'Contenu du cours')}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {activeCourse.modules.map((mod, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => unlockedModules.includes(idx) && setCurrentModuleIndex(idx)}
                        className={`min-h-[48px] flex items-center justify-between p-3.5 md:p-4 rounded-xl border text-left rtl:text-right transition-all ${
                          currentModuleIndex === idx
                            ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400 shadow-sm'
                            : unlockedModules.includes(idx)
                              ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {unlockedModules.includes(idx) ? (
                            <PlayCircle size={18} className={currentModuleIndex === idx ? 'text-teal-500' : 'text-slate-400'} />
                          ) : (
                            <Lock size={18} className="text-slate-400" />
                          )}
                          <span className="font-semibold text-sm">
                            {t(`الدرس ${idx + 1}`, `Lesson ${idx + 1}`, `Leçon ${idx + 1}`)}
                          </span>
                        </div>
                        {currentModuleIndex > idx && <CheckCircle size={16} className="text-green-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-[#09090b] min-h-screen pb-16">
      {/* Academy Hero */}
      <div className="bg-[#1e3a5f] dark:bg-slate-900 text-white pt-24 pb-10 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-blue-900/80" />
        <div className="max-w-7xl mx-auto relative z-10 text-start md:text-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-6 font-sans tracking-tight leading-tight">
            {t('تعلم بلا حدود مع', 'Learn Without Limits with', 'Apprenez sans limites avec')} <span className="text-teal-400">GITM</span>
          </h1>
          <p className="text-sm sm:text-base md:text-2xl text-slate-200 max-w-3xl md:mx-auto mb-6 md:mb-10 leading-relaxed">
            {t('تصفح دورات أكاديمية GITM والمكتبة الرقمية المتاحة.', 'Browse available GITM Academy courses and digital library resources.', 'Parcourez les cours disponibles de la GITM Academy et la bibliothèque numérique.')}
          </p>

          <div className="max-w-2xl md:mx-auto relative flex items-center">
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 text-slate-500 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t('ماذا تريد أن تتعلم اليوم؟', 'What do you want to learn today?', 'Que souhaitez-vous apprendre aujourd’hui ?')}
              className="w-full min-h-[48px] pl-12 pr-24 rtl:pr-12 rtl:pl-24 md:pl-14 md:pr-32 md:rtl:pr-14 md:rtl:pl-32 py-3.5 md:py-5 rounded-full bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-500/30 text-base md:text-lg shadow-2xl"
            />
            <button
              type="button"
              className="absolute right-1.5 rtl:right-auto rtl:left-1.5 min-h-[44px] px-4 md:px-6 py-2 md:py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-full transition-colors"
            >
              {t('بحث', 'Search', 'Rechercher')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-8">

        {/* Mobile Scrollable Filter Chips (< lg) */}
        <div className="lg:hidden space-y-3">
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              {t('التخصصات', 'Categories', 'Catégories')}
            </p>
            <div className="filter-scroll pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'courses' ? (
            <div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                {t('المستوى', 'Level', 'Niveau')}
              </p>
              <div className="filter-scroll pb-1">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => { setSelectedLevel(lvl); setCurrentPage(1); }}
                    className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {getLevelLabel(lvl)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                {t('لغة الكتاب', 'Book Language', 'Langue du livre')}
              </p>
              <div className="filter-scroll pb-1">
                {bookLangs.map(bl => (
                  <button
                    key={bl.value}
                    type="button"
                    onClick={() => { setSelectedBookLang(bl.value); setCurrentPage(1); }}
                    className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                      selectedBookLang === bl.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? bl.labelAr : lang === 'fr' ? bl.labelFr : bl.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Filters (lg+) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
              <Filter size={20} />
              <h3 className="font-bold text-lg">{t('تصفية النتائج', 'Filters', 'Filtres')}</h3>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {t('التخصصات', 'Categories', 'Catégories')}
              </h4>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                      className="w-4 h-4 text-teal-500 focus:ring-teal-500 border-gray-300"
                    />
                    <span className={`text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors ${selectedCategory === cat ? 'font-bold text-teal-600 dark:text-teal-400' : ''}`}>
                      {getCategoryLabel(cat)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {activeTab === 'courses' ? (
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('المستوى', 'Level', 'Niveau')}
                </h4>
                <div className="flex flex-col gap-2">
                  {levels.map(lvl => (
                    <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === lvl}
                        onChange={() => { setSelectedLevel(lvl); setCurrentPage(1); }}
                        className="w-4 h-4 text-teal-500 focus:ring-teal-500 border-gray-300"
                      />
                      <span className={`text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors ${selectedLevel === lvl ? 'font-bold text-teal-600 dark:text-teal-400' : ''}`}>
                        {getLevelLabel(lvl)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('لغة الكتاب', 'Book Language', 'Langue du livre')}
                </h4>
                <div className="flex flex-col gap-2">
                  {bookLangs.map(bl => (
                    <label key={bl.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="bookLang"
                        checked={selectedBookLang === bl.value}
                        onChange={() => { setSelectedBookLang(bl.value); setCurrentPage(1); }}
                        className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className={`text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${selectedBookLang === bl.value ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
                        {lang === 'ar' ? bl.labelAr : lang === 'fr' ? bl.labelFr : bl.labelEn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex flex-wrap items-baseline gap-2">
              <span>
                {activeTab === 'courses'
                  ? t('الدورات المتاحة', 'Available Courses', 'Cours disponibles')
                  : t('الكتب المتاحة', 'Available Books', 'Livres disponibles')}
              </span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                ({activeCount} {countLabel})
              </span>
            </h2>

            {/* Courses / Library Tabs (equal width on mobile, >=44px touch targets) */}
            <div className="grid grid-cols-2 sm:flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`min-h-[44px] sm:min-h-0 flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-700 dark:text-teal-300'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PlayCircle size={16} />
                <span>{t('الدورات', 'Courses', 'Cours')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`min-h-[44px] sm:min-h-0 flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'library'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen size={16} />
                <span>{t('المكتبة والكتب', 'Library & Books', 'Bibliothèque & Livres')}</span>
              </button>
            </div>
          </div>

          {activeTab === 'courses' ? (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
                    <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
                    <div className="p-4 md:p-6 space-y-3">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : currentCourses.length === 0 ? (
              <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg font-medium">
                  {t('لا توجد دورات مطابقة للفلتر.', 'No courses match your filters.', 'Aucun cours ne correspond à vos filtres.')}
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); setSearchQuery(''); }}
                  className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-bold text-sm hover:bg-teal-100 transition-colors"
                >
                  {t('مسح الفلاتر', 'Clear Filters', 'Réinitialiser les filtres')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <div className="w-full">
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    <AnimatePresence>
                      {currentCourses.map((course) => (
                        <motion.article
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.3 }}
                          key={course.id}
                          onClick={() => startCourse(course)}
                          className="group flex flex-col w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl hover:shadow-teal-500/15 hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500/50"
                        >
                          {/* 16:9 Course Cover with Unified Fallback & Skeleton */}
                          <CourseThumbnail
                            src={course.thumbnail}
                            alt={getLocalized(course, 'title', lang)}
                          />

                          <div className="p-4 md:p-6 flex flex-col flex-grow">
                            {/* Level Badge cleanly separated above Title */}
                            {course.level && (
                              <div className="mb-2.5">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-700/50">
                                  {getLevelLabel(course.level)}
                                </span>
                              </div>
                            )}

                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug whitespace-normal break-words group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {getLocalized(course, 'title', lang)}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-auto pt-3 pb-4 border-t border-slate-100 dark:border-slate-700">
                              {course.duration && (
                                <div className="flex items-center gap-1.5 font-medium">
                                  <Clock size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                  <span>{course.duration}</span>
                                </div>
                              )}
                              {course.modules?.length > 0 && (
                                <div className="flex items-center gap-1.5 font-medium">
                                  <PlayCircle size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                  <span>{course.modules.length} {t('دروس', 'lessons', 'leçons')}</span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startCourse(course);
                              }}
                              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                              <PlayCircle size={17} />
                              <span>{t('ابدأ الدورة', 'Start Course', 'Commencer le cours')}</span>
                            </button>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </div>
            )
          ) : (
            /* Library View */
            <div className="flex flex-col gap-6 items-center">
              <div className="w-full">
                {booksLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
                        <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
                        <div className="p-4 md:p-6 space-y-3">
                          <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : books.length === 0 ? (
                  <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800">
                    <Library className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {t('المكتبة فارغة حالياً', 'No books found right now', 'Aucun livre trouvé pour le moment')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('جرّب تغيير لغة البحث أو الكلمات المفتاحية.', 'Try adjusting the search keywords or language filter.', 'Essayez d’ajuster les mots-clés ou le filtre de langue.')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {books.map((book) => {
                      const info = book.volumeInfo;
                      const thumbnail = info.imageLinks?.thumbnail;
                      return (
                        <motion.article
                          key={book.id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            const link = (info.previewLink || info.infoLink || '').replace(/^http:\/\//, 'https://');
                            if (link) window.open(link, '_blank', 'noopener,noreferrer');
                          }}
                          className="group flex flex-col w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50"
                        >
                          <CourseThumbnail
                            src={thumbnail}
                            alt={info.title}
                            icon={Library}
                            contain
                          />
                          <div className="p-4 md:p-6 flex flex-col flex-grow">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug whitespace-normal break-words group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {info.title}
                            </h3>
                            {info.authors && (
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 line-clamp-1">
                                {info.authors.join(', ')}
                              </p>
                            )}
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

