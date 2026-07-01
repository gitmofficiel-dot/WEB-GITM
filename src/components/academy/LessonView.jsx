import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, FileText, Video, Code, Brain } from 'lucide-react';
import CodeWorkspace from './CodeWorkspace';

const LessonView = ({ lesson, onComplete, lang = 'en' }) => {
  const isRtl = lang === 'ar';
  
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);
  const [unlockedAxes, setUnlockedAxes] = useState([0]);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    setCurrentAxisIndex(0);
    setUnlockedAxes([0]);
    setQuizStarted(false);
  }, [lesson]);

  if (!lesson) return null;

  const axes = lesson.axes || [];
  const hasAxes = axes.length > 0;
  
  // If no axes exist, fallback to the lesson itself as the single axis
  const currentItem = hasAxes ? axes[currentAxisIndex] : lesson;

  const t = {
    completeAxis: isRtl ? 'إكمال المحور والمتابعة' : 'Complete Axis & Continue',
    completeLesson: isRtl ? 'إكمال الدرس' : 'Complete Lesson',
    takeQuiz: isRtl ? 'بدء اختبار الذكاء الاصطناعي' : 'Take AI Quiz',
    videoLesson: isRtl ? 'درس فيديو' : 'Video Lesson',
    articleLesson: isRtl ? 'مقال' : 'Article Lesson',
    codeLesson: isRtl ? 'تحدي برمجي' : 'Coding Challenge',
  };

  const handleNext = () => {
    if (hasAxes && currentAxisIndex < axes.length - 1) {
      const nextIndex = currentAxisIndex + 1;
      if (!unlockedAxes.includes(nextIndex)) {
        setUnlockedAxes([...unlockedAxes, nextIndex]);
      }
      setCurrentAxisIndex(nextIndex);
    } else {
      // End of axes.
      setQuizStarted(true);
    }
  };

  if (quizStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-4xl mx-auto p-4 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="glass-card rounded-2xl dark:bg-gray-800/50 bg-white/80 shadow-2xl border border-cyan-200/50 dark:border-cyan-700/50 p-8 text-center">
          <Brain className="w-20 h-20 text-cyan-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 dark:text-white text-gray-900">{isRtl ? 'اختبار نهاية الدرس' : 'Lesson Quiz'}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            {isRtl ? 'لقد أكملت جميع محاور الدرس! سيتم الآن توليد أسئلة لاختبار فهمك لما تعلمته.' : 'You have completed all axes! Questions will now be generated to test your understanding.'}
          </p>
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105"
          >
            <CheckCircle size={20} />
            {isRtl ? 'إنهاء الدرس والمتابعة' : 'Finish Lesson & Continue'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentAxisIndex} // Force re-animation on axis change
      className={`w-full max-w-5xl mx-auto p-4 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Axes Navigation */}
      {hasAxes && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {axes.map((axis, idx) => (
            <button
              key={idx}
              onClick={() => unlockedAxes.includes(idx) && setCurrentAxisIndex(idx)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                currentAxisIndex === idx ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' :
                unlockedAxes.includes(idx) ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300' :
                'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border border-transparent cursor-not-allowed opacity-60'
              }`}
            >
              {unlockedAxes.includes(idx) ? <CheckCircle size={16} className={currentAxisIndex === idx ? 'text-white' : 'text-teal-500'} /> : null}
              {isRtl ? `المحور ${idx + 1}` : `Axis ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card overflow-hidden rounded-2xl dark:bg-gray-800/50 bg-white/80 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 space-x-reverse mb-3">
            <span className="flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              {currentItem.type === 'video' && <><Video className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t.videoLesson}</>}
              {currentItem.type === 'code' && <><Code className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t.codeLesson}</>}
              {(!currentItem.type || currentItem.type === 'article') && <><FileText className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t.articleLesson}</>}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 leading-tight">
            {currentItem.title || lesson.title}
          </h1>
        </div>

        {/* Media / Video Section */}
        {currentItem.type === 'video' && (
          <div className="w-full aspect-video bg-gray-900 relative flex items-center justify-center group overflow-hidden">
            {currentItem.videoUrl ? (
              <iframe
                src={currentItem.videoUrl}
                title={currentItem.title || lesson.title}
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
        {currentItem.type !== 'code' ? (
          <div className="p-6 md:p-8 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: currentItem.content || '' }} />
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <CodeWorkspace axis={currentItem} onComplete={handleNext} />
          </div>
        )}

        {/* Footer Actions */}
        {currentItem.type !== 'code' && (
          <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <CheckCircle className={`w-6 h-6 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              {(hasAxes && currentAxisIndex < axes.length - 1) ? t.completeAxis : t.takeQuiz}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LessonView;
