import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Library, GraduationCap, CheckCircle, Clock, FileText, Settings, Users, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function UniversityDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('programs');

  const jointPrograms = [
    { id: 1, name: 'AI & Data Science Master', enrolled: 120, status: 'Active' },
    { id: 2, name: 'Robotics Engineering Diploma', enrolled: 45, status: 'Upcoming' }
  ];

  const creditRequests = [
    { id: 1, student: 'Aymane Benali', course: 'Edge AI Development', status: 'Pending Validation' },
    { id: 2, student: 'Sara Khan', course: 'Python for Robotics', status: 'Validated' }
  ];

  const tabs = [
    { id: 'programs', icon: BookOpen, label: lang === 'ar' ? 'البرامج المشتركة' : 'Joint Programs' },
    { id: 'credits', icon: GraduationCap, label: lang === 'ar' ? 'معادلة الساعات' : 'Credit Transfer' },
    { id: 'rnd', icon: FileText, label: lang === 'ar' ? 'البحث والتطوير' : 'R&D Projects' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'ملف الجامعة' : 'University Profile' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-purple-200 dark:border-purple-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة المؤسسة' : 'University Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Academic Partner Tier</p>
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
                    ? 'bg-purple-600 text-white shadow-lg translate-x-2' 
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
            
            {activeTab === 'programs' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><BookOpen className="text-purple-500"/> {lang==='ar'?'إدارة البرامج المشتركة':'Joint Programs Management'}</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-700 transition-colors">Propose New Program</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jointPrograms.map(prog => (
                    <div key={prog.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{prog.name}</h4>
                        <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${prog.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{prog.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-2"><Users size={14}/> {prog.enrolled} Students Enrolled</p>
                      <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">View Syllabus</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'credits' && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><GraduationCap className="text-blue-500"/> {lang==='ar'?'معادلة واعتماد الساعات':'Credit Validation'}</h3>
                <div className="space-y-4">
                  {creditRequests.map(req => (
                    <div key={req.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{req.student}</h4>
                        <p className="text-sm text-slate-500">{req.course}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span>
                        {req.status === 'Pending Validation' && (
                          <button className="text-blue-600 font-bold hover:underline text-sm">Validate Credit</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'UM5 University', role: 'university', email: 'contact@um5.ac.ma', badges: ['academic_partner'], membershipId: 'GITM-UNI-001' }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}