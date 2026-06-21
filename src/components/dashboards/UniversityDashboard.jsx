import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, GraduationCap, Microscope, User, Network, Globe, Library } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function UniversityDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = {
    name: 'Pr. Mohammed',
    role: 'University Admin (UM5)',
    email: 'admin@um5.ac.ma',
    badges: ['writer', 'admin'],
    membershipId: 'GITM-UNI-UM5'
  };

  const jointPrograms = [
    { name: 'MSc in Artificial Intelligence', students: 120, satisfaction: 94 },
    { name: 'PhD Embedded Systems', students: 15, satisfaction: 98 }
  ];

  const rdProjects = [
    { title: 'NLP for Moroccan Darija', lead: 'Pr. Alaoui', status: 'Phase 2', funding: 'Secured' },
    { title: 'Smart Water Management IoT', lead: 'Pr. Benjelloun', status: 'Prototyping', funding: 'Pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'joint-programs', icon: GraduationCap, label: lang === 'ar' ? 'برامج مشتركة' : 'Joint Programs' },
          { id: 'rd-projects', icon: Microscope, label: lang === 'ar' ? 'مشاريع البحث' : 'R&D Projects' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
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
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Network, title: 'Network Partners', val: '12' },
                { icon: Library, title: 'Shared Resources', val: '450+' },
                { icon: Globe, title: 'International Reach', val: '8 Countries' },
                { icon: GraduationCap, title: 'Alumni Match', val: '89%' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-5 flex items-center gap-4 hover-lift">
                  <div className="p-3 bg-white/5 rounded-xl text-purple-400"><stat.icon size={24} /></div>
                  <div>
                    <h4 className="text-gray-400 text-xs">{stat.title}</h4>
                    <p className="text-xl font-bold text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">{lang === 'ar' ? 'البرامج المشتركة' : 'Joint Programs Stats'}</h3>
                <div className="space-y-4">
                  {jointPrograms.map((prog, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 hover-lift">
                      <h4 className="text-white font-medium mb-2">{prog.name}</h4>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>{prog.students} Enrolled</span>
                        <span className="text-purple-400">{prog.satisfaction}% Satisfaction</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">{lang === 'ar' ? 'مشاريع البحث والتطوير' : 'R&D Projects'}</h3>
                <div className="space-y-4">
                  {rdProjects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                      <h4 className="text-white font-medium">{proj.title}</h4>
                      <p className="text-sm text-gray-400 my-1">Lead: {proj.lead}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">{proj.status}</span>
                        <span className={`text-xs px-2 py-1 rounded ${proj.funding === 'Secured' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>{proj.funding}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div key="wip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <Microscope size={48} className="mx-auto mb-4 text-purple-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">{lang === 'ar' ? 'قريباً' : 'Coming Soon'}</h2>
            <p className="text-gray-400">{lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}