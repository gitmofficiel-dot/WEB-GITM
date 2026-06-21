import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Wrench, ShieldAlert, User, Activity, PenTool, Calendar, CheckSquare } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function SupervisorDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = {
    name: lang === 'ar' ? 'السيد أمين' : 'Mr. Amine',
    role: 'Supervisor',
    email: 'amine@gitm.ma',
    badges: ['admin', 'legal'],
    membershipId: 'GITM-SUP-012'
  };

  const equipmentLogs = [
    { id: 1, item: '3D Printer Alpha', status: 'maintenance', issue: 'Filament jam', date: '2026-06-20' },
    { id: 2, item: 'VR Headset Set B', status: 'operational', issue: 'Software updated', date: '2026-06-19' },
    { id: 3, item: 'Raspberry Pi Kits', status: 'needs_review', issue: 'Missing components', date: '2026-06-18' },
  ];

  const behaviorLogs = [
    { id: 1, student: 'Omar B.', incident: 'Excellence in Lab', type: 'positive', date: '2026-06-21' },
    { id: 2, student: 'Kawtar M.', incident: 'Late equipment return', type: 'warning', date: '2026-06-20' },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'equipment', icon: Wrench, label: lang === 'ar' ? 'المعدات' : 'Equipment Logs' },
          { id: 'behavior', icon: ShieldAlert, label: lang === 'ar' ? 'سلوك الطلاب' : 'Behavior Tracking' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-orbitron">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UserProfileSettings currentUser={currentUser} />
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-l-4 border-cyan-500 hover-lift">
                <div className="flex items-center gap-4">
                  <Activity size={32} className="text-cyan-400" />
                  <div>
                    <h4 className="text-gray-400 text-sm">Lab Usage</h4>
                    <p className="text-2xl font-bold text-white">87%</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-orange-500 hover-lift">
                <div className="flex items-center gap-4">
                  <PenTool size={32} className="text-orange-400" />
                  <div>
                    <h4 className="text-gray-400 text-sm">Pending Maintenance</h4>
                    <p className="text-2xl font-bold text-white">4 Items</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-purple-500 hover-lift">
                <div className="flex items-center gap-4">
                  <CheckSquare size={32} className="text-purple-400" />
                  <div>
                    <h4 className="text-gray-400 text-sm">Clearance Rate</h4>
                    <p className="text-2xl font-bold text-white">99%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equipment */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                  <Wrench size={20} className="text-cyan-400" />
                  {lang === 'ar' ? 'سجل المعدات' : 'Equipment Logs'}
                </h3>
                <div className="space-y-4">
                  {equipmentLogs.map(log => (
                    <div key={log.id} className="p-4 rounded-xl bg-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                      <div>
                        <p className="text-white font-medium">{log.item}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {log.date} - {log.issue}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        log.status === 'operational' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        log.status === 'maintenance' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavior */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                  <ShieldAlert size={20} className="text-cyan-400" />
                  {lang === 'ar' ? 'سلوك الطلاب' : 'Recent Behavior Tracking'}
                </h3>
                <div className="space-y-4">
                  {behaviorLogs.map(log => (
                    <div key={log.id} className="p-4 rounded-xl bg-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                      <div className={`mt-1 p-2 rounded-full ${
                        log.type === 'positive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.type === 'positive' ? <CheckSquare size={16} /> : <ShieldAlert size={16} />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{log.student}</p>
                        <p className="text-sm text-gray-300">{log.incident}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="wip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Activity size={48} className="mx-auto mb-4 text-cyan-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">
              {lang === 'ar' ? 'قريباً' : 'Coming Soon'}
            </h2>
            <p className="text-gray-400">
              {lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}