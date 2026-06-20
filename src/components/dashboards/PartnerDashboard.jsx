import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Handshake, TrendingUp, Users, Presentation, Building2, ExternalLink, Bot, Sparkles, ArrowRight } from 'lucide-react';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function PartnerDashboard() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-orbitron">{txt(lang, 'Partner Dashboard', 'لوحة الشريك', 'Tableau de bord partenaire', '合作伙伴仪表板')}</h2>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-bold uppercase tracking-wider">
          Partner Organization
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Joint Projects', val: '4', icon: Handshake, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Sponsored Trainees', val: '25', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Workshops Hosted', val: '2', icon: Presentation, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Impact Score', val: '92%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold font-orbitron">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Building2 className="text-blue-500" size={20} />
            Collaboration Metrics
          </h3>
          <div className="flex justify-center items-center h-64 border-2 border-dashed border-cyan-300 dark:border-slate-700 rounded-xl">
            <p className="text-slate-500">Interactive charts will be rendered here.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Handshake className="text-emerald-500" size={20} />
            Active Initiatives
          </h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white">Summer Internship Program 2026</h4>
                    <p className="text-sm text-slate-500 mt-1">Hosting 10 GITM students for embedded systems roles.</p>
                  </div>
                  <button className="p-2 bg-[#e0fcfc] dark:bg-slate-800 rounded shadow-sm border border-cyan-300 dark:border-slate-700 text-teal-500 hover:text-teal-600 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matchmaking */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Users size={120} />
          </div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-emerald-500">
            <Bot className="w-5 h-5 text-emerald-400" />
            {txt(lang, 'AI Talent Matchmaking', 'مطابقة المواهب بالذكاء الاصطناعي', 'Recrutement IA', 'AI人才匹配')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
            {txt(lang, 'Our AI analyzed your recent request for "Embedded Systems Interns" and matched you with the top 3 students currently enrolled in the GITM Academy.', 'قام الذكاء الاصطناعي بتحليل طلبك الأخير لـ "متدربين في الأنظمة المدمجة" وطابقك مع أفضل 3 طلاب في الأكاديمية.', 'Notre IA a analysé...', '我们的AI分析了...')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Omar Tazi', match: '98%', skills: ['C++', 'FreeRTOS', 'IoT'] },
              { name: 'Sara El Fassi', match: '94%', skills: ['Python', 'Raspberry Pi', 'Edge AI'] },
              { name: 'Youssef M.', match: '91%', skills: ['C', 'STM32', 'Robotics'] },
            ].map((student, i) => (
              <div key={i} className="bg-cyan-50 dark:bg-slate-800/50 p-4 rounded-xl border border-emerald-500/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white">{student.name}</h4>
                  <span className="bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded text-xs">Match: {student.match}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {student.skills.map((skill, j) => (
                    <span key={j} className="text-[10px] bg-cyan-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="w-full py-1.5 flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition">
                  {txt(lang, 'View Profile', 'عرض الملف', 'Voir le profil', '查看个人资料')} <ArrowRight size={12} className="rtl:rotate-180"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}