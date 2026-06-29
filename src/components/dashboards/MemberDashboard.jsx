import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, Award, User, Code, Zap, Heart, UserPlus, Search } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function MemberDashboard() {
  const { lang } = useLanguage();
  const { currentUser: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = authUser || {
    name: 'Member',
    role: 'member',
    email: 'member@gitm.ma',
    badges: ['developer'],
    membershipId: ''
  };

  const upcomingEvents = [
    { title: 'React 19 Workshop', date: 'Next Friday', type: 'Technical' },
    { title: 'Morocco AI Summit', date: 'Nov 12', type: 'Conference' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'projects', icon: Code, label: lang === 'ar' ? 'مشاريعي' : 'My Projects' },
          { id: 'events', icon: Calendar, label: lang === 'ar' ? 'الأحداث' : 'Events' },
          { id: 'certificates', icon: Award, label: lang === 'ar' ? 'الشهادات' : 'Certificates' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-orbitron">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <UserProfileSettings currentUser={currentUser} />
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-t-2 border-rose-500 hover-lift">
                <Code size={32} className="text-rose-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'المشاريع' : 'Projects Contributed'}</h4>
                <p className="text-3xl font-bold text-white mt-2">12</p>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-t-2 border-emerald-500 hover-lift">
                <Zap size={32} className="text-emerald-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'النقاط' : 'Activity Points'}</h4>
                <p className="text-3xl font-bold text-white mt-2">1,450</p>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-t-2 border-blue-500 hover-lift">
                <Heart size={32} className="text-blue-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'العمل التطوعي' : 'Volunteer Hours'}</h4>
                <p className="text-3xl font-bold text-white mt-2">48h</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-rose-400" />
                  {lang === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events'}
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((evt, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{evt.title}</h4>
                        <p className="text-sm text-rose-400">{evt.date}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">{evt.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <Award size={48} className="text-yellow-400 mb-4" />
                <h3 className="text-xl font-orbitron text-white mb-2">{lang === 'ar' ? 'احصل على شهاداتك' : 'Claim Your Certificates'}</h3>
                <p className="text-gray-400 mb-6">
                  {lang === 'ar' ? 'لديك شهادات جديدة متاحة للتحميل من ورشة العمل الأخيرة.' : 'You have new certificates available for download from the recent workshop.'}
                </p>
                <button className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-medium">
                  {lang === 'ar' ? 'عرض الشهادات' : 'View Certificates'}
                </button>
              </div>
            </div>

          </motion.div>
        ) : activeTab === 'projects' ? (
          <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                <Code className="text-cyan-400" />
                {lang === 'ar' ? 'مشاريعي وفرق العمل' : 'My Projects & Teams'}
              </h3>

              {/* Project Card with Creator Logic */}
              <div className="bg-white/5 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/10 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-xl text-white">Smart Irrigation System</h4>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block">Active Project</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-rose-400 font-bold">{lang === 'ar' ? 'أنت منشئ هذا المشروع' : 'You are the Creator'}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4 mb-6 text-sm text-gray-400">
                  <span><User size={14} className="inline mr-1"/> 4 Team Members</span>
                  <span><Zap size={14} className="inline mr-1"/> Frontend Dev Role</span>
                </div>

                {/* PROJECT CREATOR EXCLUSIVE UI */}
                <div className="border-t border-white/10 pt-6">
                  <h5 className="font-bold text-gray-300 mb-3 flex items-center gap-2"><UserPlus size={18} className="text-rose-400"/> {lang === 'ar' ? 'إضافة مسجلين لفريقك' : 'Add Registered Users to Team'}</h5>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                      <input 
                        type="text" 
                        placeholder={lang === 'ar' ? 'ابحث عن طلاب مسجلين...' : 'Search registered students...'}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <button className="bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">
                      {lang === 'ar' ? 'إضافة العضو' : 'Add Member'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {lang === 'ar' ? '* كمنشئ المشروع، يمكنك فقط رؤية هذه الخاصية.' : '* As the project creator, only you can see this feature.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="wip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <LayoutDashboard size={48} className="mx-auto mb-4 text-rose-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">{lang === 'ar' ? 'قريباً' : 'Coming Soon'}</h2>
            <p className="text-gray-400">{lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}