import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, FileText, Video } from 'lucide-react';

const LessonView = ({ lesson, onComplete, lang = 'en' }) => {
  const isRtl = lang === 'ar';
  
  const t = {
    complete: isRtl ? 'تحديد كمكتمل والمتابعة' : 'Mark as Completed & Continue',
    videoLesson: isRtl ? 'درس فيديو' : 'Video Lesson',
    articleLesson: isRtl ? 'مقال' : 'Article Lesson',
  };

  if (!lesson) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-4xl mx-auto p-4 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="glass-card overflow-hidden rounded-2xl dark:bg-gray-800/50 bg-white/80 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 space-x-reverse mb-3">
            <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              {lesson.type === 'video' ? (
                <><Video className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t.videoLesson}</>
              ) : (
                <><FileText className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t.articleLesson}</>
              )}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 leading-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Media / Video Section */}
        {lesson.type === 'video' && (
          <div className="w-full aspect-video bg-gray-900 relative flex items-center justify-center group overflow-hidden">
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
                <PlayCircle className="w-20 h-20 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer" />
                <p>Video content will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 md:p-8 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onComplete}
            className="flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <CheckCircle className={`w-6 h-6 ${isRtl ? 'ml-2' : 'mr-2'}`} />
            {t.complete}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonView;
