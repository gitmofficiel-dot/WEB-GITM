import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, BookOpen, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const courses = [
  { id: 1, title: { en: 'Full-Stack React & Node.js', ar: 'تطوير شامل بـ React و Node.js' }, instructor: 'Ahmed B.', progress: 75, rating: 4.8, hours: '40h' },
  { id: 2, title: { en: 'Applied Machine Learning', ar: 'التعلم الآلي التطبيقي' }, instructor: 'Dr. Sarah K.', progress: 30, rating: 4.9, hours: '60h' },
  { id: 3, title: { en: 'Cloud Architecture with AWS', ar: 'هندسة السحابة مع AWS' }, instructor: 'Youssef M.', progress: 0, rating: 4.7, hours: '35h' },
  { id: 4, title: { en: 'Cybersecurity Fundamentals', ar: 'أساسيات الأمن السيبراني' }, instructor: 'Karim L.', progress: 100, rating: 4.9, hours: '25h' },
  { id: 5, title: { en: 'UI/UX Advanced Design', ar: 'تصميم واجهة وتجربة المستخدم المتقدم' }, instructor: 'Mona T.', progress: 50, rating: 4.6, hours: '30h' },
];

const AcademySlider = ({ setView }) => {
  const { lang } = useLanguage();
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#e0fcfc] dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-[#0B132B] dark:text-white mb-2">
              {lang === 'ar' ? 'أكاديمية GITM' : 'GITM Academy'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-cyan-900 text-gray-800 dark:text-white transition-colors">
              <ChevronLeft />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-cyan-900 text-gray-800 dark:text-white transition-colors">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => (
            <div key={course.id} className="min-w-[300px] md:min-w-[350px] snap-center glass-card card-3d p-6 rounded-2xl bg-[#e0fcfc] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={16} fill="currentColor" /> {course.rating}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] dark:text-white mb-2">{course.title[lang] || course.title.en}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{lang === 'ar' ? 'المدرب:' : 'Instructor:'} {course.instructor}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Clock size={14} /> {course.hours}
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 font-semibold">
                {course.progress}% {lang === 'ar' ? 'مكتمل' : 'Completed'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={() => setView && setView('academy')}
            className="btn-primary px-8 py-3 rounded-full bg-gray-900 dark:bg-[#e0fcfc] text-white dark:text-[#0B132B] font-semibold transition-all hover:scale-105 inline-block"
          >
            {lang === 'ar' ? 'استكشف الأكاديمية' : 'Explore Academy'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AcademySlider;
