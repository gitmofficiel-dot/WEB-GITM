import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 dark:text-slate-600'}
      />
    ))}
    <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-yellow-400 ml-1 rtl:ml-0 rtl:mr-1">{rating}</span>
  </div>
);

const CourseCard = ({ course, lang }) => {
  const [imgError, setImgError] = useState(false);
  const isCompleted = course.progress === 100;
  const isNew = course.progress === 0;
  const coverUrl = course.image || course.thumbnail || course.coverImage;
  const courseTitle = course.title?.[lang] || course.title?.en || course.title_ar || course.title;

  return (
    <div className="w-[85vw] max-w-[300px] md:w-[340px] md:max-w-[340px] snap-center flex-shrink-0 group">
      <div className="glass-card bg-white dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

        {/* 16:9 Course Cover with Unified Fallback Placeholder */}
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-emerald-500/15 via-cyan-500/15 to-blue-600/20 dark:from-emerald-900/40 dark:via-slate-800 dark:to-cyan-900/40">
          {coverUrl && !imgError ? (
            <img
              src={coverUrl}
              alt={courseTitle}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-emerald-700 dark:text-cyan-300">
              <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-900/70 flex items-center justify-center shadow-sm border border-emerald-200/70 dark:border-cyan-500/30">
                <BookOpen size={26} />
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          {/* Category Badge — cleanly separated above title */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${course.badgeColor || 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
              {course.category || 'General'}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 shrink-0">
              <Clock size={14} className="text-emerald-600 dark:text-cyan-400" />
              <span className="font-semibold">{course.hours}h</span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug whitespace-normal break-words group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-colors">
            {courseTitle}
          </h3>

          {/* Instructor + Rating */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-br ${course.avatarGradient} flex items-center justify-center text-white font-bold text-xs shadow ring-2 ring-white dark:ring-slate-700`}>
                {course.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {lang === 'ar' ? 'المدرب' : 'Instructor'}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {course.instructor?.[lang] || course.instructor?.en || course.instructor || 'Unknown'}
                </p>
              </div>
            </div>
            <StarRating rating={course.rating} />
          </div>

          <div className="flex-1" />

          {/* Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'ar' ? 'التقدم' : 'Progress'}
              </span>
              <div className="flex items-center gap-1.5">
                {isCompleted && <Award size={14} className="text-emerald-500" />}
                <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : isNew ? 'text-slate-600 dark:text-slate-300' : 'text-cyan-700 dark:text-cyan-400'}`}>
                  {isCompleted
                    ? (lang === 'ar' ? '✓ مكتمل' : '✓ Completed')
                    : isNew
                      ? (lang === 'ar' ? 'جديد' : 'New')
                      : `${course.progress}%`}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
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
    <section className="py-4 md:py-16 bg-transparent md:bg-slate-50/50 md:dark:bg-gray-800/30 overflow-hidden">
      <div className="container mx-auto px-0 md:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-cyan-400 mb-1.5">
              {lang === 'ar' ? 'تعلّم وتطور' : 'Learn & Grow'}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-sans tracking-tight text-slate-900 dark:text-white mb-2.5">
              {lang === 'ar' ? 'أكاديمية GITM' : 'GITM Academy'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
          </div>

          {/* Navigation Arrows (>=44px touch targets) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-cyan-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-cyan-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:pb-6 snap-x snap-mandatory hide-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {courses && courses.map((course) => {
            const instructorName = typeof course.instructor === 'object'
              ? (course.instructor?.en || course.instructor?.ar || 'CO')
              : (course.instructor || 'CO');

            return (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  avatarGradient: course.avatarGradient || 'from-blue-500 to-indigo-600',
                  initials: course.initials || instructorName.substring(0, 2).toUpperCase(),
                  progress: course.progress || 0,
                  rating: course.rating || 4.5,
                  hours: course.hours || 10
                }}
                lang={lang}
              />
            );
          })}
          {(!courses || courses.length === 0) && (
            <div className="w-full text-center py-6 text-sm text-slate-600 dark:text-slate-300">
              {lang === 'ar' ? 'لا توجد دورات حالياً.' : 'No courses available.'}
            </div>
          )}
        </div>

        {/* CTA Button (Full-width 48px on mobile) */}
        <div className="text-center mt-6 md:mt-10">
          <button
            type="button"
            onClick={() => navigate('/academy')}
            className="w-full sm:w-auto min-h-[48px] group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 dark:shadow-cyan-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{lang === 'ar' ? 'استكشف الأكاديمية' : 'Explore Academy'}</span>
            <ChevronRight size={18} className={`transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AcademySlider;
