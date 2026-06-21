import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, Wrench, Users, Activity, Settings, AlertTriangle, Monitor, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function SupervisorDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('equipment');

  const equipmentLogs = [
    { id: 1, item: '3D Printer MakerBot', location: 'AI Lab 1', status: 'Needs Maintenance', lastChecked: '2026-06-15' },
    { id: 2, item: 'NVIDIA Jetson Nano Kit', location: 'Robotics Lab', status: 'Operational', lastChecked: '2026-06-20' }
  ];

  const studentBehavior = [
    { id: 1, student: 'Ahmed Ali', report: 'Outstanding teamwork in hackathon', type: 'positive' },
    { id: 2, student: 'Karim N.', report: 'Late return of lab equipment', type: 'warning' }
  ];

  const tabs = [
    { id: 'equipment', icon: Monitor, label: lang === 'ar' ? 'صيانة المختبرات' : 'Lab Equipment' },
    { id: 'behavior', icon: ClipboardList, label: lang === 'ar' ? 'تقارير الأداء' : 'Behavior Logs' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-rose-200 dark:border-rose-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة المشرف' : 'Supervisor Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lab & Student Oversight</p>
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
                    ? 'bg-rose-500 text-white shadow-lg translate-x-2' 
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
            
            {activeTab === 'equipment' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Monitor className="text-rose-500"/> {lang==='ar'?'صيانة معدات المختبر':'Lab Equipment Logs'}</h3>
                  <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-rose-700 transition-colors flex items-center gap-2"><Wrench size={16}/> Report Issue</button>
                </div>
                <div className="space-y-4">
                  {equipmentLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{log.item}</h4>
                        <p className="text-sm text-slate-500">Location: {log.location} | Checked: {log.lastChecked}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><ClipboardList className="text-blue-500"/> {lang==='ar'?'تقارير سلوك الطلاب':'Student Behavior & Oversight'}</h3>
                <div className="space-y-4">
                  {studentBehavior.map(rep => (
                    <div key={rep.id} className={`flex justify-between items-center p-4 border rounded-xl bg-white dark:bg-slate-900/50 ${rep.type === 'positive' ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-amber-200 dark:border-amber-900/50'}`}>
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{rep.student}</h4>
                        <p className="text-sm text-slate-500">{rep.report}</p>
                      </div>
                      {rep.type === 'warning' ? <AlertTriangle className="text-amber-500"/> : <ShieldCheck className="text-emerald-500"/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Supervisor Hamza', role: 'supervisor', email: 'hamza@gitm.ma', badges: ['lab_manager'], membershipId: 'GITM-SUP-001' }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}