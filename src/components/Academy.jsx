import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Award, PlayCircle, Lock, CheckCircle, ChevronRight, X, Loader2, Library, Search, Star, Filter, Users, Clock, ArrowRight, Video } from 'lucide-react';
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        
        // Add mock data if empty for demonstration
        if (coursesData.length === 0) {
          const mockCourses = [
            { id: '1', title_en: 'Advanced AI & Machine Learning', title_ar: 'الذكاء الاصطناعي المتقدم', description_en: 'Master neural networks and deep learning.', description_ar: 'تعلم الشبكات العصبية والتعلم العميق.', track: 'AI', level: 'Advanced', rating: 4.9, students: 12500, duration: '12 Weeks', thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800' },
            { 
              id: '2', 
              title_en: 'Full-Stack React Development', 
              title_ar: 'تطوير تطبيقات الويب باستخدام رياكت', 
              description_en: 'Build modern web apps from scratch.', 
              description_ar: 'ابن تطبيقات ويب حديثة من الصفر.', 
              track: 'Web Dev', level: 'Intermediate', rating: 4.8, students: 8400, duration: '8 Weeks', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
              modules: [
                {
                  title: 'React Components Deep Dive',
                  axes: [
                    { type: 'video', title: 'Introduction to Components', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { type: 'article', title: 'State and Props', content: '<h3>Understanding State</h3><p>State is local to the component...</p>' },
                    { type: 'code', title: 'Build a Counter Component', instructions: 'Write a React component that increments a counter on click.', initialCode: 'import React, { useState } from "react";\n\nexport default function Counter() {\n  return <div>Count: 0</div>;\n}' }
                  ]
                }
              ]
            },
            { id: '3', title_en: 'Cybersecurity Fundamentals', title_ar: 'أساسيات الأمن السيبراني', description_en: 'Protect systems against modern threats.', description_ar: 'حماية الأنظمة من التهديدات الحديثة.', track: 'Security', level: 'Beginner', rating: 4.7, students: 15300, duration: '6 Weeks', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' },
            { id: '4', title_en: 'Cloud Computing Architecture', title_ar: 'هندسة الحوسبة السحابية', description_en: 'Design scalable cloud systems.', description_ar: 'تصميم أنظمة سحابية قابلة للتطوير.', track: 'Cloud', level: 'Advanced', rating: 4.8, students: 9200, duration: '10 Weeks', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' }
          ];
          setCourses(mockCourses);
        } else {
          setCourses(coursesData);
        }
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

  const startCourseFlow = () => {
    setIsCourseStarted(true);
    if (activeCourse.courseIntroVideo || activeCourse.courseIntroText) {
      setShowCourseIntro(true);
    } else {
      setShowCourseIntro(false);
    }
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

  const generateCertificate = () => {
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
    if (selectedCategory !== 'All' && c.track !== selectedCategory) return false;
    if (selectedLevel !== 'All' && c.level !== selectedLevel) return false;
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

  if (activeCourse) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-[#09090b]">
        {/* Course Header - Coursera Style */}
        <div className="w-full bg-[#1e3a5f] dark:bg-slate-900 text-white py-16 px-4 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/50 to-blue-900/50 z-0"></div>
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-bold mb-4">
                <ChevronRight size={16} />
                <span>{activeCourse.track || 'Technology'}</span>
                <ChevronRight size={16} />
                <span>{getLocalized(activeCourse, 'title', lang)}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{getLocalized(activeCourse, 'title', lang)}</h1>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl">{getLocalized(activeCourse, 'description', lang)}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 mb-8">
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star fill="currentColor" size={18} />
                  <span>{activeCourse.rating || '4.8'}</span>
                  <span className="text-slate-400 font-normal ml-1">(12k reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{activeCourse.students || '10,000+'} {lang === 'ar' ? 'طالب مسجل' : 'already enrolled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{activeCourse.duration || '6 Months'} {lang === 'ar' ? 'من الدراسة' : 'to complete'}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                {!isCourseStarted ? (
                  <button 
                    onClick={startCourseFlow}
                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    {lang === 'ar' ? 'سجل مجاناً وابدأ الدورة' : 'Enroll & Start Course'}
                  </button>
                ) : (
                  <button 
                    className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-default flex items-center gap-2"
                  >
                    <CheckCircle size={20} /> {lang === 'ar' ? 'أنت مسجل في الدورة' : 'Enrolled'}
                  </button>
                )}
                <button onClick={closeCourse} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all">
                  {lang === 'ar' ? 'العودة للمقررات' : 'Back to Catalog'}
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-[400px] shrink-0">
              <div className="bg-white p-2 rounded-2xl shadow-2xl relative group overflow-hidden">
                <img src={activeCourse.thumbnail || 'https://via.placeholder.com/600x400'} className="w-full aspect-video object-cover rounded-xl" alt="Course Video Preview" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all rounded-xl cursor-pointer">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="text-white w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum & Player Area */}
        <div className="max-w-7xl mx-auto px-4 py-12">
           {!isCourseStarted ? (
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
               <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                 <Library className="text-teal-500" /> {lang === 'ar' ? 'حول هذه الدورة' : 'About this Course'}
               </h2>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
                 {getLocalized(activeCourse, 'longDescription', lang) || getLocalized(activeCourse, 'description', lang)}
               </p>
               
               <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                 {lang === 'ar' ? 'ماذا ستتعلم' : 'What you will learn'}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 {[
                   lang === 'ar' ? 'اكتساب مهارات عملية قابلة للتطبيق مباشرة' : 'Gain hands-on practical skills',
                   lang === 'ar' ? 'بناء مشاريع حقيقية لتعزيز سيرتك الذاتية' : 'Build real-world projects for your resume',
                   lang === 'ar' ? 'التعلم من خبراء الصناعة' : 'Learn from industry experts',
                   lang === 'ar' ? 'الحصول على شهادة معتمدة عند الإتمام' : 'Earn a verified certificate upon completion',
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                     <CheckCircle className="text-teal-500 mt-0.5 shrink-0" size={20} />
                     <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
           ) : !activeCourse.modules || activeCourse.modules.length === 0 ? (
             <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <Video className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {lang === 'ar' ? 'الدروس قيد التجهيز' : 'Curriculum is being prepared'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'سيتم إضافة محتوى الفيديو قريباً. يرجى العودة لاحقاً.' : 'Video content will be uploaded soon. Please check back later.'}
                </p>
             </div>
           ) : showCourseIntro ? (
             <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
                  {lang === 'ar' ? 'مقدمة التدريب' : 'Course Introduction'}
                </h2>
                
                {activeCourse.courseIntroVideo && (
                  <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <iframe 
                      src={activeCourse.courseIntroVideo} 
                      className="w-full h-full" 
                      allowFullScreen 
                      title="Course Intro Video"
                    />
                  </div>
                )}
                
                {activeCourse.courseIntroText && (
                  <div className="prose dark:prose-invert max-w-none text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-10 text-justify px-4">
                    {activeCourse.courseIntroText}
                  </div>
                )}

                <button 
                  onClick={() => setShowCourseIntro(false)}
                  className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all text-lg hover:scale-105"
                >
                  {lang === 'ar' ? 'ابدأ الدرس الأول' : 'Start First Lesson'}
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <LessonView 
                    lesson={activeCourse.modules[currentModuleIndex]}
                    onComplete={handleLessonComplete}
                    lang={lang}
                  />
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                     <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">
                        {lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}
                     </h3>
                     <div className="flex flex-col gap-3">
                        {activeCourse.modules.map((mod, idx) => (
                           <button
                             key={idx}
                             onClick={() => unlockedModules.includes(idx) && setCurrentModuleIndex(idx)}
                             className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
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
                                  {lang === 'ar' ? `الدرس ${idx + 1}` : `Lesson ${idx + 1}`}
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
    <div className="w-full bg-slate-50 dark:bg-[#09090b] min-h-screen">
      {/* Academy Hero */}
      <div className="bg-[#1e3a5f] dark:bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-blue-900/80"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
              {lang === 'ar' ? 'تعلم بلا حدود مع' : 'Learn Without Limits with'} <span className="text-teal-400">GITM</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              {lang === 'ar' ? 'اكتسب المهارات التي تحتاجها من أفضل الخبراء في التكنولوجيا والأعمال.' : 'Build the skills you need from top experts in technology and business.'}
            </p>
            
            <div className="max-w-2xl mx-auto relative flex items-center">
               <Search className="absolute left-4 text-slate-400 w-6 h-6" />
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 placeholder={lang === 'ar' ? 'ماذا تريد أن تتعلم اليوم؟' : 'What do you want to learn today?'}
                 className="w-full pl-14 pr-32 py-5 rounded-full text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/30 text-lg shadow-2xl"
               />
               <button className="absolute right-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full transition-colors">
                 {lang === 'ar' ? 'بحث' : 'Search'}
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                <Filter size={20} />
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</h3>
              </div>
              
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {lang === 'ar' ? 'التخصصات' : 'Categories'}
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
                          {cat}
                        </span>
                     </label>
                   ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {lang === 'ar' ? 'المستوى' : 'Level'}
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
                          {lvl}
                        </span>
                     </label>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
               {lang === 'ar' ? 'الدورات المتاحة' : 'Available Courses'}
               <span className="text-slate-400 text-sm ml-3 font-normal">({filteredCourses.length} results)</span>
             </h2>
             
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               <button onClick={() => setActiveTab('courses')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                 Courses
               </button>
               <button onClick={() => setActiveTab('library')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                 Books
               </button>
             </div>
          </div>

          {activeTab === 'courses' ? (
            loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
              </div>
            ) : currentCourses.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 text-lg">{lang === 'ar' ? 'لا توجد دورات مطابقة للفلتر.' : 'No courses match your filters.'}</p>
                <button onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); setSearchQuery(''); }} className="mt-4 text-teal-600 font-bold hover:underline">
                  {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <div className="max-w-6xl w-full mx-auto">
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                    {currentCourses.map((course) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        key={course.id}
                        onClick={() => startCourse(course)}
                        className="group flex flex-col w-full rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-teal-200 dark:hover:border-slate-600"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          {/* Background Image */}
                          <img 
                            src={course.thumbnail || 'https://via.placeholder.com/600x600?text=GITM+Academy'} 
                            alt={getLocalized(course, 'title', lang)} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {getLocalized(course, 'title', lang)}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                             {course.duration && <div className="flex items-center gap-1.5 font-medium">{course.duration}</div>}
                             {course.level && <div className="flex items-center gap-1.5 font-medium border-l border-slate-300 dark:border-slate-600 pl-4 rtl:pr-4 rtl:pl-0 rtl:border-l-0 rtl:border-r">{course.level}</div>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </div>
            )
          ) : (
            /* Library View */
            <div className="flex flex-col gap-6 items-center">
              <div className="max-w-6xl w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {booksLoading ? (
                     <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" /></div>
                   ) : books.map((book, idx) => {
                     const info = book.volumeInfo;
                     const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/600x600?text=No+Cover';
                     return (
                       <motion.div 
                         key={book.id} 
                         whileTap={{ scale: 0.98 }}
                         onClick={() => window.open(info.previewLink, '_blank')} 
                         className="group flex flex-col w-full rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-slate-600"
                       >
                         <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                           <img src={thumbnail} alt={info.title} className="h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-xl" />
                         </div>
                         <div className="p-6 flex flex-col flex-grow">
                             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{info.title}</h3>
                             {info.authors && (
                               <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 line-clamp-1">
                                 {info.authors.join(', ')}
                               </p>
                             )}
                         </div>
                       </motion.div>
                     )
                   })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
