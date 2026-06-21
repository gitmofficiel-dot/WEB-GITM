import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Handshake, TrendingUp, Briefcase, User, Building2, Target, BarChart } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function PartnerDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = {
    name: 'OCP Group Representative',
    role: 'Partner',
    email: 'contact@ocp.ma',
    badges: ['political', 'designer'],
    membershipId: 'GITM-PRT-OCP'
  };

  const sponsorships = [
    { tier: 'Platinum', project: 'GITM AI Hackathon 2026', contribution: '150,000 MAD', status: 'Active' },
    { tier: 'Gold', project: 'Smart Agriculture Lab', contribution: '80,000 MAD', status: 'Completed' }
  ];

  const internships = [
    { title: 'Data Scientist Intern', department: 'Innovation Lab', applicants: 24, status: 'Open' },
    { title: 'IoT Engineer', department: 'Smart Mining', applicants: 12, status: 'Reviewing' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'sponsorship', icon: Handshake, label: lang === 'ar' ? 'الرعاية' : 'Sponsorships' },
          { id: 'roi', icon: TrendingUp, label: lang === 'ar' ? 'العائد على الاستثمار' : 'ROI Tracking' },
          { id: 'internships', icon: Briefcase, label: lang === 'ar' ? 'التدريب' : 'Internship Offers' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
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
              <div className="glass-card p-6 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Building2 size={24}/></div>
                  <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-full text-white">2026</span>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">{lang === 'ar' ? 'مساهمات الرعاية' : 'Total Sponsorships'}</h4>
                  <p className="text-2xl font-bold text-white">230,000 MAD</p>
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Target size={24}/></div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">{lang === 'ar' ? 'المشاريع المدعومة' : 'Supported Projects'}</h4>
                  <p className="text-2xl font-bold text-white">2 Active</p>
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><BarChart size={24}/></div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">{lang === 'ar' ? 'المتدربون المعينون' : 'Interns Hired'}</h4>
                  <p className="text-2xl font-bold text-white">14 Students</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">{lang === 'ar' ? 'سجلات الرعاية' : 'Sponsorship Tiers'}</h3>
                <div className="space-y-4">
                  {sponsorships.map((sponsor, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-white">{sponsor.project}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${sponsor.tier === 'Platinum' ? 'bg-slate-300 text-slate-800' : 'bg-yellow-500/20 text-yellow-400'}`}>{sponsor.tier}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{sponsor.contribution}</span>
                        <span className="text-emerald-400">{sponsor.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">{lang === 'ar' ? 'عروض التدريب' : 'Active Internships'}</h3>
                <div className="space-y-4">
                  {internships.map((job, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <h4 className="text-white font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">{job.department}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{job.applicants} Applicants</span>
                        <span className="text-gray-300">{job.status}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    + {lang === 'ar' ? 'أضف عرض تدريب' : 'Post New Offer'}
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div key="wip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <Target size={48} className="mx-auto mb-4 text-blue-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">{lang === 'ar' ? 'قريباً' : 'Coming Soon'}</h2>
            <p className="text-gray-400">{lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}