import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ToggleRight, ToggleLeft, Key, UserCheck, Minimize2, Settings } from 'lucide-react';

const DemoController = () => {
  const { lang, t, activeDashboardRole, setActiveDashboardRole, view, setView, loginUser } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const roles = [
    { id: 'president', label: t('auth.roles.president'), email: 'president@gitm.ma' },
    { id: 'teacher', label: t('auth.roles.teacher'), email: 'teacher@gitm.ma' },
    { id: 'member', label: t('auth.roles.member'), email: 'engineer@gitm.ma' },
    { id: 'student', label: t('auth.roles.student'), email: 'student@gitm.ma' },
    { id: 'partner', label: t('auth.roles.partner'), email: 'sponsor@cnrst.ma' },
    { id: 'university', label: t('auth.roles.university'), email: 'partner.uni@um6p.ma' },
  ];

  const handleRoleSwitch = (roleId, email, name) => {
    loginUser(email, roleId, name);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-[#0d9488] to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 text-white dark:text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center border border-white/10"
        title={t('dashboards.demoControl')}
      >
        <Settings size={20} className="animate-spin" style={{ animationDuration: '4s' }} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl glass border border-cyan-300 dark:border-white/10 p-5 shadow-2xl animate-fade-in text-right rtl:text-right ltr:text-left">
      <div className="flex items-center justify-between border-b border-cyan-300 dark:border-white/5 pb-2 mb-3">
        <button 
          onClick={() => setIsCollapsed(true)} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <Minimize2 size={14} />
        </button>
        <span className="text-[10px] font-bold text-[#1e3a5f] dark:text-white uppercase tracking-wider font-orbitron flex items-center space-x-1 rtl:space-x-reverse">
          <span>{t('dashboards.demoControl')}</span>
        </span>
      </div>

      <p className="text-[9px] text-slate-500 dark:text-cyber-muted leading-tight mb-4">
        {t('dashboards.demoDesc')}
      </p>

      <div className="space-y-1.5">
        {roles.map((role) => {
          const isActive = view === 'dashboard' && activeDashboardRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSwitch(role.id, role.email, role.label.split(' / ')[0])}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-right rtl:text-right ltr:text-left transition-all flex items-center justify-between border ${
                isActive
                  ? 'bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488] dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-400 shadow-sm'
                  : 'bg-cyan-50 dark:bg-[#e0fcfc]/5 border-transparent text-[#2d507b] dark:text-cyber-muted hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/10 hover:text-[#0B132B] dark:hover:text-white'
              }`}
            >
              <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400 dark:text-cyber-muted">
                {role.id}
              </span>
              <span className="truncate">{role.label.split(' / ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoController;
