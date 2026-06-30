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

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
            { id: '1', title_en: 'Advanced AI & Machine Learning', title_ar: 'الذكاء الاصطناعي المتقدم', description_en: 'Master neural networks and deep learning.', description_ar: 'تعلم الشبكات العصبية والتعلم العميق.', track: 'AI', level: 'Advanced', rating: 4.9, students: 12500, duration: '12 Weeks' },
            { id: '2', title_en: 'Full-Stack React Development', title_ar: 'تطوير تطبيقات الويب باستخدام رياكت', description_en: 'Build modern web apps from scratch.', description_ar: 'ابن تطبيقات ويب حديثة من الصفر.', track: 'Web Dev', level: 'Intermediate', rating: 4.8, students: 8400, duration: '8 Weeks' },
            { id: '3', title_en: 'Cybersecurity Fundamentals', title_ar: 'أساسيات الأمن السيبراني', description_en: 'Protect systems against modern threats.', description_ar: 'حماية الأنظمة من التهديدات الحديثة.', track: 'Security', level: 'Beginner', rating: 4.7, students: 15300, duration: '6 Weeks' }
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

  const startCourse = (course) => {
    // If no real modules exist yet, we still open the course view to show the Coursera style intro
    setActiveCourse(course);
    setCurrentModuleIndex(0);
    setUnlockedModules([0]);
    setCourseCompleted(false);
  };

  const closeCourse = () => {
    setActiveCourse(null);
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
                <button 
                  onClick={() => {
                    // Logic to jump to player
                    toast.success(lang === 'ar' ? 'تم استئناف الدورة' : 'Course resumed');
                  }}
                  className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  {lang === 'ar' ? 'سجل مجاناً وابدأ الآن' : 'Enroll for Free & Start'}
                </button>
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
           {!activeCourse.modules || activeCourse.modules.length === 0 ? (
             <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <Video className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {lang === 'ar' ? 'الدروس قيد التجهيز' : 'Curriculum is being prepared'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'سيتم إضافة محتوى الفيديو قريباً. يرجى العودة لاحقاً.' : 'Video content will be uploaded soon. Please check back later.'}
                </p>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* The actual lesson player would go here, currently handled by LessonView component if modules exist */}
                  <LessonView 
                    lesson={activeCourse.modules[currentModuleIndex]}
                    onComplete={handleLessonComplete}
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
             
             {/* Simple Tabs to switch to Library if needed */}
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
              <div className="flex flex-col gap-6">
                {currentCourses.map((course, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    key={course.id}
                    onClick={() => startCourse(course)}
                    className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all cursor-pointer group"
                  >
                    <div className="w-full sm:w-72 h-48 sm:h-auto relative overflow-hidden shrink-0">
                      <img src={course.thumbnail || 'https://via.placeholder.com/400x300'} alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between flex-1">
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                             {course.track || 'Tech'}
                           </span>
                           <span className="text-xs font-bold px-2 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md">
                             {course.level || 'Intermediate'}
                           </span>
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                           {getLocalized(course, 'title', lang)}
                         </h3>
                         <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                           {getLocalized(course, 'description', lang)}
                         </p>
                       </div>
                       
                       <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                             <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                               <Star size={16} className="text-yellow-400" fill="currentColor" />
                               {course.rating || '4.8'}
                             </div>
                             <div className="flex items-center gap-1">
                               <Users size={16} />
                               {(course.students || 0).toLocaleString()}
                             </div>
                          </div>
                          
                          <div className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                            {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            <ArrowRight size={16} className="rtl:rotate-180" />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
                
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </div>
            )
          ) : (
            /* Library View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {booksLoading ? (
                 <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" /></div>
               ) : books.map((book, idx) => {
                 const info = book.volumeInfo;
                 const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover';
                 return (
                   <div key={book.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-xl transition-all flex flex-col">
                      <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                        <img src={thumbnail} alt={info.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white line-clamp-2 mb-1">{info.title}</h4>
                      <p className="text-xs text-slate-500 mb-4">{info.authors?.join(', ') || 'Unknown Author'}</p>
                      
                      <a 
                        href={info.previewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-auto block w-full py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-center font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                      >
                        {lang === 'ar' ? 'تصفح الكتاب' : 'Read Preview'}
                      </a>
                   </div>
                 )
               })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
