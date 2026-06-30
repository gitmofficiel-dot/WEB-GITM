import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, CheckCircle, ChevronDown, ChevronRight, 
  FileText, Code, Download, Image as ImageIcon, ZoomIn, Loader2, ArrowLeft, Cpu,
  Activity, ShieldAlert, MessageSquare, Bot, Send
} from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../../context/LanguageContext';
import HardwareLab from './HardwareLab';
import CANBusSimulator from './CANBusSimulator';
import IoTTelemetryDashboard from './IoTTelemetryDashboard';

// Helper to extract YouTube ID
const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url; // fallback to url if it's already an ID
};

const CurriculumSidebar = ({ course, activeIds, setActiveIds, completedLessons }) => {
  const { lang } = useLanguage();
  const [expandedModules, setExpandedModules] = useState([course.modules[0]?.id]);

  const toggleModule = (modId) => {
    setExpandedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
        <h3 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'فهرس المسار' : 'Curriculum'}</h3>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1 font-bold">
             <span>{completedLessons.length} {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
             <span>{Math.round((completedLessons.length / Math.max(1, course.modules.reduce((acc, m) => acc + m.lessons.length, 0))) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedLessons.length / Math.max(1, course.modules.reduce((acc, m) => acc + m.lessons.length, 0))) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {course.modules.map((mod, modIdx) => (
          <div key={mod.id} className="mb-2">
            <button 
              onClick={() => toggleModule(mod.id)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
            >
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">{lang === 'ar' ? 'الوحدة' : 'Module'} {modIdx + 1}</span>
                 <span className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200">{mod.title}</span>
              </div>
              {expandedModules.includes(mod.id) ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>

            <AnimatePresence>
              {expandedModules.includes(mod.id) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-2 pl-4 pr-2 space-y-1">
                    {mod.lessons.map((lesson, lessonIdx) => {
                      const isActive = activeIds.lessonId === lesson.id;
                      const isCompleted = completedLessons.includes(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveIds({ moduleId: mod.id, lessonId: lesson.id })}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                            isActive 
                              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                          ) : (
                            <PlayCircle size={16} className={`${isActive ? 'text-teal-500' : 'text-slate-400'} shrink-0`} />
                          )}
                          <span className={`text-sm flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {lessonIdx + 1}. {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassroomTabs = ({ lesson, courseDescription }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', icon: FileText, label: lang === 'ar' ? 'الوصف' : 'Overview' },
    { id: 'ai-tutor', icon: Bot, label: lang === 'ar' ? 'المعلم الذكي' : 'AI Tutor' },
    { id: 'downloads', icon: Download, label: lang === 'ar' ? 'المرفقات' : 'Downloads' },
    { id: 'visuals', icon: ImageIcon, label: lang === 'ar' ? 'المخططات' : 'Visuals' },
    { id: 'lab', icon: Cpu, label: lang === 'ar' ? 'المختبر السحابي' : 'Hardware Lab' },
    { id: 'canbus', icon: ShieldAlert, label: lang === 'ar' ? 'محاكي CAN' : 'CAN Simulator' },
    { id: 'telemetry', icon: Activity, label: lang === 'ar' ? 'لوحة القياسات' : 'Telemetry' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mt-6 shadow-sm">
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/10' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4 text-[#1e3a5f] dark:text-white">{lesson?.title}</h3>
                {courseDescription ? (
                   <div dangerouslySetInnerHTML={{ __html: courseDescription }} />
                ) : (
                   <p className="text-slate-500">{lang === 'ar' ? 'لا يوجد وصف متاح.' : 'No overview available.'}</p>
                )}
              </div>
            )}

            {activeTab === 'ai-tutor' && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-[400px] flex flex-col overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <Bot size={200} />
                </div>
                <div className="p-4 bg-teal-500/10 border-b border-teal-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white">GITM AI Tutor</h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{lang === 'ar' ? 'اسألني أي شيء عن هذا الدرس' : 'Ask me anything about this lesson'}</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Mock message from AI */}
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-teal-500 text-white flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-200 shadow-sm">
                      {lang === 'ar' ? `مرحباً! أنا مساعدك الذكي لدرس "${lesson?.title}". هل لديك أي استفسارات حول المحتوى؟` : `Hello! I am your AI assistant for the lesson "${lesson?.title}". Do you have any questions about the content?`}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder={lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'} 
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 dark:text-slate-200 text-sm"
                    />
                    <button className="absolute right-2 text-white bg-teal-500 hover:bg-teal-600 p-2 rounded-lg transition-colors">
                      <Send size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson?.attachmentUrl ? (
                  <a href={lesson.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-500 transition-colors group">
                     <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                       <Code size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'ملفات المشروع' : 'Project Files'}</h4>
                       <p className="text-xs text-slate-500">ZIP / PDF Archive</p>
                     </div>
                     <Download size={20} className="ml-auto text-slate-300 group-hover:text-teal-500" />
                  </a>
                ) : (
                  <p className="text-slate-500 italic">{lang === 'ar' ? 'لا توجد مرفقات لهذا الدرس' : 'No attachments for this lesson'}</p>
                )}
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                 <ImageIcon size={48} className="text-slate-300 mb-4" />
                 <p className="text-slate-500 font-bold">{lang === 'ar' ? 'مساحة المخططات والصور قيد التطوير' : 'Visuals space under development'}</p>
                 <button className="mt-4 text-teal-500 flex items-center gap-2 text-sm font-bold hover:underline">
                   <ZoomIn size={16} /> {lang === 'ar' ? 'تكبير المخطط' : 'Zoom Schematic'}
                 </button>
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="w-full">
                 <HardwareLab />
              </div>
            )}

            {activeTab === 'canbus' && (
              <div className="w-full">
                 <CANBusSimulator />
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className="w-full">
                 <IoTTelemetryDashboard />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function ClassroomTheater() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeIds, setActiveIds] = useState({ moduleId: null, lessonId: null });
  const [completedLessons, setCompletedLessons] = useState([]); // In a real app, fetch from User Profile

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setCourse(data);
          // Set initial active lesson
          if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
            setActiveIds({ 
              moduleId: data.modules[0].id, 
              lessonId: data.modules[0].lessons[0].id 
            });
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleComplete = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center flex-col gap-4 text-center px-4">
        <h2 className="text-3xl font-bold text-white font-orbitron">Course Not Found</h2>
        <button onClick={() => navigate('/academy')} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
          <ArrowLeft size={18}/> Back to Academy
        </button>
      </div>
    );
  }

  // Find active lesson object
  let activeLesson = null;
  if (activeIds.moduleId && activeIds.lessonId) {
    const mod = course.modules.find(m => m.id === activeIds.moduleId);
    if (mod) {
      activeLesson = mod.lessons.find(l => l.id === activeIds.lessonId);
    }
  }

  const videoId = getYoutubeId(activeLesson?.videoUrl);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <div className="h-16 bg-[#1e3a5f] dark:bg-[#0a0f1a] border-b border-slate-700 flex items-center px-4 md:px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/academy')} className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <ArrowLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
          <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
          <div>
            <h1 className="text-white font-bold text-sm md:text-base line-clamp-1">{course.title}</h1>
            <span className="text-teal-400 text-xs font-bold bg-teal-500/10 px-2 py-0.5 rounded">{course.track}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-64px)]">
        
        {/* Left/Right Sidebar depending on RTL */}
        <div className="hidden lg:block h-full overflow-y-auto w-80 shrink-0">
          <CurriculumSidebar 
            course={course} 
            activeIds={activeIds} 
            setActiveIds={setActiveIds} 
            completedLessons={completedLessons}
          />
        </div>

        {/* Video Player & Tabs */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#0f172a]">
          <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
            
            {/* Distraction-Free Video Player */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
              {videoId ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                  <PlayCircle size={64} className="opacity-20" />
                  <p className="font-orbitron tracking-widest uppercase text-sm">No Video Source</p>
                </div>
              )}
            </div>

            {/* Below Video Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
              <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white">
                {activeLesson?.title || 'Select a lesson'}
              </h2>
              
              {activeLesson && (
                <button 
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                  }`}
                >
                  <CheckCircle size={18} />
                  {completedLessons.includes(activeLesson.id) 
                    ? (lang === 'ar' ? 'اكتمل الدرس' : 'Completed')
                    : (lang === 'ar' ? 'تحديد كمكتمل' : 'Mark Complete')}
                </button>
              )}
            </div>

            {/* Mobile Sidebar (shown below video on small screens) */}
            <div className="lg:hidden mt-8 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
               <CurriculumSidebar 
                  course={course} 
                  activeIds={activeIds} 
                  setActiveIds={setActiveIds} 
                  completedLessons={completedLessons}
               />
            </div>

            {/* Interactive Tabs Area */}
            <ClassroomTabs lesson={activeLesson} courseDescription={course.description} />

          </div>
        </div>
      </div>
    </div>
  );
}
