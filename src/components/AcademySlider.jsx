import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';



const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 dark:text-slate-300 dark:text-slate-600'}
      />
    ))}
    <span className="text-sm font-bold text-yellow-500 ml-1">{rating}</span>
  </div>
);

const CourseCard = ({ course, lang }) => {
  const isCompleted = course.progress === 100;
  const isNew = course.progress === 0;

  return (
    <div className="min-w-[300px] md:min-w-[340px] snap-center flex-shrink-0 group">
      <div className="glass-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        {/* Header: Avatar + Category Badge */}
        <div className="flex items-start justify-between mb-5">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${course.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white dark:ring-slate-700 group-hover:scale-110 transition-transform duration-300`}>
              {course.initials}
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                {lang === 'ar' ? 'المدرب' : 'Instructor'}
              </p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {course.instructor?.[lang] || course.instructor?.en || course.instructor || 'Unknown'}
              </p>
            </div>
          </div>
          {/* Category Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.badgeColor || 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
            {course.category || 'General'}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-colors">
          {course.title?.[lang] || course.title?.en || course.title_ar || course.title}
        </h3>

        {/* Rating + Duration */}
        <div className="flex items-center justify-between mb-5">
          <StarRating rating={course.rating} />
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Clock size={14} className="text-emerald-500 dark:text-cyan-400" />
            <span className="font-semibold">{course.hours}h</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Progress Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'التقدم' : 'Progress'}
            </span>
            <div className="flex items-center gap-1.5">
              {isCompleted && (
                <Award size={14} className="text-emerald-500" />
              )}
              <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-500' : isNew ? 'text-slate-600 dark:text-slate-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                {isCompleted
                  ? (lang === 'ar' ? '✓ مكتمل' : '✓ Completed')
                  : isNew
                    ? (lang === 'ar' ? 'جديد' : 'New')
                    : `${course.progress}%`}
              </span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AcademySlider = () => {
  const { lang, courses } = useLanguage();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.6 : scrollLeft + clientWidth * 0.6;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-slate-50/50 dark:bg-gray-800/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-cyan-400 mb-2">
              {lang === 'ar' ? 'تعلّم وتطور' : 'Learn & Grow'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-slate-900 dark:text-white mb-3">
              {lang === 'ar' ? 'أكاديمية GITM' : 'GITM Academy'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-cyan-900/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-cyan-900/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {courses && courses.map((course) => {
            const instructorName = typeof course.instructor === 'object' 
              ? (course.instructor?.en || course.instructor?.ar || 'CO') 
              : (course.instructor || 'CO');
              
            return (
              <CourseCard key={course.id} course={{
                ...course,
                avatarGradient: course.avatarGradient || 'from-blue-500 to-indigo-600',
                initials: course.initials || instructorName.substring(0, 2).toUpperCase(),
                progress: course.progress || 0,
                rating: course.rating || 4.5,
                hours: course.hours || 10
              }} lang={lang} />
            );
          })}
          {(!courses || courses.length === 0) && (
            <div className="w-full text-center py-8 text-gray-500">
              {lang === 'ar' ? 'لا توجد دورات حالياً.' : 'No courses available.'}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/academy')}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 dark:shadow-cyan-500/25 hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 active:scale-[0.98]"
          >
            <span>{lang === 'ar' ? 'استكشف الأكاديمية' : 'Explore Academy'}</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        div::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
};

export default AcademySlider;
