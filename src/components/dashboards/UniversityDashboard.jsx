import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GraduationCap, Users, BookOpen, LibraryBig, Bot, ArrowRight, Sparkles } from 'lucide-react';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function UniversityDashboard() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-orbitron">{txt(lang, 'University Dashboard', 'لوحة الجامعة', 'Tableau de bord Université', '大学仪表板')}</h2>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-500 rounded-full text-sm font-bold uppercase tracking-wider">
          Academic Partner
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Students', val: '120', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Joint Researches', val: '8', icon: LibraryBig, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Shared Courses', val: '5', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Alumni Employed', val: '45', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
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

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <GraduationCap className="text-indigo-500" size={20} />
          Student Performance Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500">
                <th className="p-3">Student ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Program</th>
                <th className="p-3">Progress</th>
                <th className="p-3">GPA Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map((item) => (
                <tr key={item} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-sm text-slate-500">STU-2026-00{item}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-white">Student Name {item}</td>
                  <td className="p-3 text-sm">Edge AI Engineering</td>
                  <td className="p-3">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${60 + item * 10}%` }}></div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-indigo-500">3.{8 - item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Matchmaking */}
      <div className="glass-card rounded-2xl p-6 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden mt-6">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <GraduationCap size={120} />
        </div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-500">
          <Bot className="w-5 h-5 text-indigo-400" />
          {txt(lang, 'AI Academic Insights', 'رؤى أكاديمية ذكية', 'Analyses IA', 'AI学术洞察')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
          {txt(lang, 'Our AI has identified 3 students showing exceptional potential in Embedded AI who are recommended for your advanced research scholarship program.', 'اكتشف الذكاء الاصطناعي 3 طلاب يظهرون إمكانات استثنائية في الذكاء الاصطناعي المدمج، ويوصى بهم لبرنامج المنح البحثية المتقدمة لديك.', 'Notre IA a identifié...', '我们的AI识别出...')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Omar Tazi', match: 'Exceptional', skills: ['C++', 'FreeRTOS', 'IoT'] },
            { name: 'Sara El Fassi', match: 'Highly Rec.', skills: ['Python', 'Raspberry Pi', 'Edge AI'] },
            { name: 'Youssef M.', match: 'Recommended', skills: ['C', 'STM32', 'Robotics'] },
          ].map((student, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-indigo-500/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800 dark:text-white">{student.name}</h4>
                <span className="bg-indigo-500/10 text-indigo-500 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider">{student.match}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {student.skills.map((skill, j) => (
                  <span key={j} className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full py-1.5 flex justify-center items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-bold transition">
                {txt(lang, 'Review Portfolio', 'مراجعة الملف', 'Examiner le portfolio', '查看作品集')} <ArrowRight size={12} className="rtl:rotate-180"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}