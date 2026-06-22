import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Video, FileText, CheckCircle, Clock, Award, Star, Settings, MessageSquare, PlayCircle, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function StudentDashboard() {
  const { lang, setView } = useLanguage();
  const [activeTab, setActiveTab] = useState('courses');

  const enrolledCourses = [
    { id: 1, title: 'Edge AI Development', progress: 65, nextLesson: 'Neural Networks Basics', status: 'In Progress' },
    { id: 2, title: 'Python for Robotics', progress: 100, nextLesson: '-', status: 'Completed', grade: 'A+' },
    { id: 3, title: 'IoT Cloud Architecture', progress: 15, nextLesson: 'AWS IoT Core Setup', status: 'In Progress' }
  ];

  const assignments = [
    { id: 1, course: 'Edge AI Development', title: 'Train CNN Model', dueDate: '2026-06-25', status: 'Pending' },
    { id: 2, course: 'Python for Robotics', title: 'Pathfinding Algorithm', dueDate: '2026-05-10', status: 'Graded (95/100)' }
  ];

  const tabs = [
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'دوراتي' : 'My Courses' },
    { id: 'assignments', icon: FileText, label: lang === 'ar' ? 'الواجبات' : 'Assignments' },
    { id: 'certificates', icon: Award, label: lang === 'ar' ? 'الشهادات' : 'Certificates' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-cyan-200 dark:border-slate-800 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'لوحة الطالب' : 'Student Panel'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aymane Benali</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><BookOpen className="text-blue-500"/> {lang==='ar'?'التقدم الأكاديمي':'Academic Progress'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map(course => (
                    <div key={course.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                      {course.status === 'Completed' && <div className="absolute top-0 right-0 p-4"><CheckCircle className="text-emerald-500" size={32}/></div>}
                      <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-2 pr-10">{course.title}</h4>
                      <p className="text-sm text-slate-500 mb-4">{course.status === 'Completed' ? (lang==='ar'?'مكتملة':'Completed') : (lang==='ar'?'الدرس القادم: ':'Next: ') + course.nextLesson}</p>
                      
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                        <div className={`h-2.5 rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mb-4">
                        <span>{course.progress}%</span>
                        {course.grade && <span className="text-emerald-500">Grade: {course.grade}</span>}
                      </div>

                      <button 
                        onClick={() => setView('academy')}
                        className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${course.progress === 100 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400'}`}>
                        <PlayCircle size={16}/> {course.progress === 100 ? (lang==='ar'?'مراجعة الدورة':'Review Course') : (lang==='ar'?'متابعة التعلم':'Continue Learning')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="glass-card rounded-3xl p-6">
                 <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><FileText className="text-amber-500"/> {lang==='ar'?'الواجبات والمهام':'Assignments & Tasks'}</h3>
                 <div className="space-y-4">
                    {assignments.map(task => (
                      <div key={task.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white">{task.title}</h4>
                          <p className="text-sm text-slate-500">{task.course}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block ${task.status.includes('Graded') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{task.status}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Clock size={12}/> Due: {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Aymane Benali', role: 'student', email: 'a.benali@gitm.ma', badges: ['developer'] }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}