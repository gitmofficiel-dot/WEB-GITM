import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Calendar, Award, User, Code, Zap, Heart } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function MemberDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = {
    name: 'Yassine Dev',
    role: 'Member',
    email: 'yassine@example.com',
    badges: ['developer'],
    membershipId: 'GITM-MEM-1024'
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