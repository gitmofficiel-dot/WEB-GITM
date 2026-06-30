import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Award, PlayCircle, Lock, CheckCircle, ChevronRight, X, Loader2, Library, Search } from 'lucide-react';
import LessonView from './academy/LessonView';
import QuizEngine from './academy/QuizEngine';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from '../utils/toast';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

export default function Academy() {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const [activeCourse, setActiveCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [unlockedModules, setUnlockedModules] = useState([0]); // Index 0 is unlocked by default
  const [courseCompleted, setCourseCompleted] = useState(false);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchBooks = async (query = 'technology') => {
    setBooksLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      if (!apiKey) return;
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&key=${apiKey}`);
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
    if (activeTab === 'library' && books.length === 0) {
      fetchBooks('artificial intelligence technology');
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'library' && searchQuery) {
      const timeoutId = setTimeout(() => {
        fetchBooks(searchQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeTab]);

  const startCourse = (course) => {
    if (!course.modules || course.modules.length === 0) {
      toast.info(lang === 'ar' ? 'هذا المقرر لا يحتوي على دروس بعد.' : 'This course has no lessons yet.');
      return;
    }
    setActiveCourse(course);
    setCurrentModuleIndex(0);
    setUnlockedModules([0]);
    setCourseCompleted(false);
  };

  const closeCourse = () => {
    setActiveCourse(null);
  };

  const handleLessonComplete = () => {
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

  const handleQuizFail = () => {
    // Logic to restart quiz is handled inside QuizEngine
  };

  const generateCertificate = () => {
    // In a real app, this would hit an API to mint the cert
    toast.success(lang === 'ar' ? 'تم إصدار شهادتك بنجاح! رقم: GITM-CERT-9092' : 'Certificate issued successfully! ID: GITM-CERT-9092');
    closeCourse();
  };

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const filteredCourses = courses.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = getLocalized(c, 'title', lang).toLowerCase();
    const desc = getLocalized(c, 'description', lang).toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- CATALOG VIEW ---
  if (!activeCourse) {
    return (
      <div className="container-custom py-24 min-h-screen relative flex flex-col">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
            {lang === 'ar' ? 'أكاديمية التعلم LMS' : 'Academy LMS'}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {lang === 'ar' ? 'مسارات تدريبية احترافية تنتهي بشهادات معتمدة.' : 'Professional training tracks ending with certified credentials.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900/50 backdrop-blur-md p-1 rounded-2xl inline-flex border border-slate-700/50">
            <button
              onClick={() => { setActiveTab('courses'); setCurrentPage(1); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'courses' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              {lang === 'ar' ? 'الدورات التدريبية' : 'Courses'}
            </button>
            <button
              onClick={() => { setActiveTab('library'); setCurrentPage(1); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'library' 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Library className="w-5 h-5" />
              {lang === 'ar' ? 'المكتبة الرقمية' : 'Digital Library'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchBar 
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder={
              activeTab === 'courses'
                ? (lang === 'ar' ? 'ابحث في المقررات...' : 'Search courses...')
                : (lang === 'ar' ? 'ابحث عن الكتب (مثال: AI, React)...' : 'Search books (e.g. AI, React)...')
            }
          />
        </div>

        {/* Content Area */}
        {activeTab === 'courses' ? (
          loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
              <p className="text-teal-300 font-orbitron animate-pulse">
                {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          ) : currentCourses.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400">{lang === 'ar' ? 'لا توجد دورات.' : 'No courses found.'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentCourses.map((course, index) => (
                  <motion.div 
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card hover-lift card-3d rounded-2xl overflow-hidden border border-slate-700/50 hover:border-teal-500/50 group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-teal-500/30 text-teal-300 text-xs font-bold">
                        {course.track}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 bg-slate-900/50">
                      <h3 className="text-xl font-bold text-white mb-2 font-orbitron group-hover:text-teal-300 transition-colors">
                        {getLocalized(course, 'title', lang)}
                      </h3>
                      <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                        {getLocalized(course, 'description', lang)}
                      </p>
                      
                      <div className="mt-auto">
                        <button 
                          onClick={() => startCourse(course)}
                          className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                        >
                          <PlayCircle size={18} />
                          {lang === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </div>
          )
        ) : (
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4 line-clamp-2">
                  {lang === 'ar' ? course.title_ar : course.title_en}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 h-20 line-clamp-3 flex-1">
                  {lang === 'ar' ? course.description_ar : course.description_en}
                </p>
                <button 
                  onClick={() => startCourse(course)}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-white transition-all mt-auto"
                >
                  <PlayCircle size={20} /> {lang === 'ar' ? 'ابدأ المسار' : 'Start Track'}
                </button>
              </div>
            ))}

            {/* Locked Course Example - visually appealing padding */}
            <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 opacity-60 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 shrink-0">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-400 mb-4">{lang === 'ar' ? 'الروبوتيك المتقدم' : 'Advanced Robotics'}</h3>
              <p className="text-slate-500 mb-8 h-20 flex-1">
                {lang === 'ar' ? 'قريباً: تعلم برمجة الروبوتات باستخدام ROS2.' : 'Coming soon: Learn robot programming with ROS2.'}
              </p>
                </button>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center w-full">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LMS ACTIVE COURSE VIEW ---
  const currentModule = activeCourse.modules[currentModuleIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pt-20 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-80px)] md:sticky md:top-20 shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-[#1e3a5f] dark:text-white line-clamp-1" title={lang === 'ar' ? activeCourse.title_ar : activeCourse.title_en}>
            {lang === 'ar' ? activeCourse.title_ar : activeCourse.title_en}
          </h2>
          <button onClick={closeCourse} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeCourse.modules.map((mod, idx) => {
            const isUnlocked = unlockedModules.includes(idx);
            const isActive = idx === currentModuleIndex;
            const isCompleted = unlockedModules.includes(idx + 1) || (idx === activeCourse.modules.length - 1 && courseCompleted);
            
            return (
              <button
                key={mod.id}
                disabled={!isUnlocked}
                onClick={() => setCurrentModuleIndex(idx)}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${
                  isActive ? 'bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800' 
                  : isUnlocked ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800' 
                  : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                ) : isUnlocked ? (
                  <PlayCircle size={20} className={isActive ? 'text-cyan-500' : 'text-slate-400'} shrink-0 />
                ) : (
                  <Lock size={20} className="text-slate-400 shrink-0" />
                )}
                
                <span className={`text-sm font-semibold line-clamp-2 ${isActive ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  {lang === 'ar' ? mod.title_ar : mod.title_en}
                </span>
              </button>
            );
          })}
        </div>
        
        {courseCompleted && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/20">
            <button onClick={generateCertificate} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2">
              <Award size={20} /> {lang === 'ar' ? 'استخراج الشهادة' : 'Claim Certificate'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 dark:bg-[#0f172a] p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentModule.type === 'lesson' ? (
                <LessonView 
                  lesson={{
                    title: lang === 'ar' ? currentModule.title_ar : currentModule.title_en,
                    content: lang === 'ar' ? currentModule.content_ar : currentModule.content_en,
                    videoUrl: currentModule.fileUrl || currentModule.videoUrl // fileUrl from new format
                  }} 
                  lang={lang} 
                  onComplete={handleLessonComplete} 
                />
              ) : (
                <QuizEngine 
                  questions={currentModule.questions}
                  lang={lang}
                  onComplete={handleQuizComplete}
                  onFail={handleQuizFail}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
