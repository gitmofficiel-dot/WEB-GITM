import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Award, PlayCircle, Lock, CheckCircle, ChevronRight, X } from 'lucide-react';
import LessonView from './academy/LessonView';
import QuizEngine from './academy/QuizEngine';

// Mock Course Data
const EDGE_AI_COURSE = {
  id: 'c1',
  title_ar: 'هندسة الذكاء الاصطناعي الطرفي (Edge AI)',
  title_en: 'Edge AI Architecture',
  description_ar: 'تعلم كيفية تصميم ونشر نماذج الذكاء الاصطناعي على الأجهزة المدمجة لتطبيقات الزمن الحقيقي.',
  description_en: 'Learn how to design and deploy AI models on embedded devices for real-time applications.',
  modules: [
    {
      id: 'm1',
      type: 'lesson',
      title_ar: 'مقدمة في الحوسبة الطرفية',
      title_en: 'Introduction to Edge Computing',
      videoUrl: null, // Placeholder will show
      content_ar: 'في هذا الدرس، سنتعرف على أساسيات الحوسبة الطرفية والفرق بينها وبين الحوسبة السحابية وكيف تسهم في تقليل وقت الاستجابة.',
      content_en: 'In this lesson, we will cover the basics of Edge Computing, the difference from Cloud Computing, and how it reduces latency.'
    },
    {
      id: 'm2',
      type: 'lesson',
      title_ar: 'تحسين نماذج التعلم العميق',
      title_en: 'Deep Learning Model Optimization',
      videoUrl: null,
      content_ar: 'سنتعلم تقنيات ضغط النماذج مثل Quantization و Pruning لتناسب الذاكرة المحدودة للأجهزة المدمجة.',
      content_en: 'We will learn model compression techniques like Quantization and Pruning to fit limited memory of embedded devices.'
    },
    {
      id: 'm3',
      type: 'quiz',
      title_ar: 'الاختبار النهائي (يجب الحصول على 70%)',
      title_en: 'Final Assessment (70% Required)',
      questions: [
        {
          question_ar: 'ما هو الهدف الرئيسي من استخدام Quantization؟',
          question_en: 'What is the main goal of using Quantization?',
          options: [
            { id: 'a', text_ar: 'زيادة حجم النموذج', text_en: 'Increase model size', isCorrect: false },
            { id: 'b', text_ar: 'تقليل حجم النموذج وتسريع الاستدلال', text_en: 'Reduce model size and speed up inference', isCorrect: true },
            { id: 'c', text_ar: 'تدريب النموذج من الصفر', text_en: 'Train the model from scratch', isCorrect: false }
          ]
        },
        {
          question_ar: 'أيهما أسرع في الاستجابة؟',
          question_en: 'Which has faster response time?',
          options: [
            { id: 'a', text_ar: 'الحوسبة السحابية (Cloud)', text_en: 'Cloud Computing', isCorrect: false },
            { id: 'b', text_ar: 'الحوسبة الطرفية (Edge)', text_en: 'Edge Computing', isCorrect: true }
          ]
        }
      ]
    }
  ]
};

export default function Academy({ setView }) {
  const { lang } = useLanguage();
  const [activeCourse, setActiveCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [unlockedModules, setUnlockedModules] = useState([0]); // Index 0 is unlocked by default
  const [courseCompleted, setCourseCompleted] = useState(false);

  const startCourse = (course) => {
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
    alert(lang === 'ar' ? 'تم إصدار شهادتك بنجاح! رقم: GITM-CERT-9092' : 'Certificate issued successfully! ID: GITM-CERT-9092');
    closeCourse();
  };

  // --- CATALOG VIEW ---
  if (!activeCourse) {
    return (
      <div className="container-custom py-24 min-h-screen relative">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
            {lang === 'ar' ? 'أكاديمية التعلم LMS' : 'Academy LMS'}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {lang === 'ar' ? 'مسارات تدريبية احترافية تنتهي بشهادات معتمدة.' : 'Professional training tracks ending with certified credentials.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Edge AI Course Card */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-colors group">
            <div className="w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? EDGE_AI_COURSE.title_ar : EDGE_AI_COURSE.title_en}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 h-20 line-clamp-3">
              {lang === 'ar' ? EDGE_AI_COURSE.description_ar : EDGE_AI_COURSE.description_en}
            </p>
            <button 
              onClick={() => startCourse(EDGE_AI_COURSE)}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-white transition-all"
            >
              <PlayCircle size={20} /> {lang === 'ar' ? 'ابدأ المسار' : 'Start Track'}
            </button>
          </div>

          {/* Locked Course Example */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-4">{lang === 'ar' ? 'الروبوتيك المتقدم' : 'Advanced Robotics'}</h3>
            <p className="text-slate-500 mb-8 h-20">
              {lang === 'ar' ? 'قريباً: تعلم برمجة الروبوتات باستخدام ROS2.' : 'Coming soon: Learn robot programming with ROS2.'}
            </p>
            <button disabled className="w-full bg-slate-200 dark:bg-slate-800 text-slate-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
              {lang === 'ar' ? 'غير متاح حالياً' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
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
          <h2 className="font-bold text-[#1e3a5f] dark:text-white line-clamp-1">{lang === 'ar' ? activeCourse.title_ar : activeCourse.title_en}</h2>
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
                    videoUrl: currentModule.videoUrl
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
