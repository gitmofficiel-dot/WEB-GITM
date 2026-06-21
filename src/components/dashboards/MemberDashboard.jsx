import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Briefcase, MessageCircle, Star, Target, Zap, Settings, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function MemberDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('community');

  const projects = [
    { id: 1, title: 'Smart Irrigation System', role: 'Frontend Dev', status: 'In Progress', team: 4 },
    { id: 2, title: 'GITM Website Refactor', role: 'UI Designer', status: 'Completed', team: 2 }
  ];

  const networkRequests = [
    { id: 1, name: 'Sara Khan', role: 'AI Researcher', avatar: 'SK' },
    { id: 2, name: 'Youssef Alaoui', role: 'Robotics Lead', avatar: 'YA' }
  ];

  const tabs = [
    { id: 'community', icon: Users, label: lang === 'ar' ? 'المجتمع والتواصل' : 'Community Hub' },
    { id: 'projects', icon: Zap, label: lang === 'ar' ? 'مشاريعي' : 'My Projects' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-indigo-200 dark:border-slate-800 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة العضو' : 'Member Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ahmed Ali</p>
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
                    ? 'bg-indigo-500 text-white shadow-lg translate-x-2' 
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
            
            {activeTab === 'community' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-3xl p-6 border-t-4 border-indigo-500">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><Users className="text-indigo-500"/> {lang==='ar'?'طلبات التواصل':'Network Requests'}</h3>
                  <div className="space-y-4">
                    {networkRequests.map(req => (
                      <div key={req.id} className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{req.avatar}</div>
                          <div>
                            <p className="font-bold text-[#1e3a5f] dark:text-white text-sm">{req.name}</p>
                            <p className="text-xs text-slate-500">{req.role}</p>
                          </div>
                        </div>
                        <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors">Accept</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 border-t-4 border-emerald-500">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><Target className="text-emerald-500"/> {lang==='ar'?'تحديات الأسبوع':'Weekly Challenges'}</h3>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Contribute to Open Source</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1 mb-3">Push 5 commits to GITM repositories this week.</p>
                    <div className="w-full bg-emerald-200 dark:bg-emerald-900 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <p className="text-right text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-2">3 / 5 Commits</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
               <div className="glass-card rounded-3xl p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Zap className="text-amber-500"/> {lang==='ar'?'المشاريع الحالية':'Active Projects'}</h3>
                   <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold">Propose Project</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{proj.title}</h4>
                          <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{proj.status}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 flex items-center gap-2"><Briefcase size={14}/> Role: {proj.role}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1"><Users size={14}/> {proj.team} Team Members</span>
                          <button className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">Workspace</button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Ahmed Ali', role: 'member', email: 'ahmed@gitm.ma', badges: ['speaker', 'developer'] }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}