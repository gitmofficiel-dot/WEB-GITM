import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Users, ClipboardCheck, Video, Settings, Edit3, MessageCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function TeacherDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('courses');

  const assignedCourses = [
    { id: 1, name: 'Advanced Robotics Lab', students: 45, pendingGrades: 12 },
    { id: 2, name: 'AI Ethics', students: 120, pendingGrades: 0 }
  ];

  const studentSubmissions = [
    { id: 1, student: 'Aymane Benali', assignment: 'Neural Network Model', date: '2026-06-21', status: 'Needs Grading' },
    { id: 2, student: 'Sara Khan', assignment: 'Robotics Kinematics', date: '2026-06-20', status: 'Needs Grading' }
  ];

  const tabs = [
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'إدارة المقررات' : 'Course Management' },
    { id: 'grading', icon: ClipboardCheck, label: lang === 'ar' ? 'نظام التقييم' : 'Grading System' },
    { id: 'virtualLab', icon: Video, label: lang === 'ar' ? 'المختبر الافتراضي' : 'Virtual Labs' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-blue-200 dark:border-blue-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة المعلم' : 'Teacher Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Academic Instructor</p>
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
                    ? 'bg-blue-600 text-white shadow-lg translate-x-2' 
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
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><BookOpen className="text-blue-500"/> {lang==='ar'?'المقررات المكلف بها':'Assigned Courses'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedCourses.map(course => (
                    <div key={course.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                      <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-2">{course.name}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Users size={14}/> {course.students} Students Enrolled</p>
                      <p className="text-sm text-amber-500 flex items-center gap-2"><ClipboardCheck size={14}/> {course.pendingGrades} Assignments to Grade</p>
                      <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Manage Syllabus</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grading' && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><Edit3 className="text-amber-500"/> {lang==='ar'?'نظام التقييم':'Grading System'}</h3>
                <div className="space-y-4">
                  {studentSubmissions.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{sub.student}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><FileText size={14}/> {sub.assignment}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full">{sub.status}</span>
                        <button className="text-blue-600 font-bold hover:underline text-sm">Review & Grade</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Dr. Yassine', role: 'teacher', email: 'yassine@gitm.ma', badges: ['instructor', 'ai_expert'], membershipId: 'GITM-TCH-001' }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}