import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Github, Linkedin, Twitter, Award, CheckCircle, ShieldCheck, Copy, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MemberProfiles() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Hardcoded mock of verified team members (excluding basic students)
  const teamMembers = [
    {
      id: 'GITM-PRE-001',
      name: 'M. President',
      role: 'president',
      title_ar: 'الرئيس والمؤسس',
      title_en: 'President & Founder',
      email: 'president@gitm.ma',
      badges: ['leadership', 'ai_visionary', 'legal'],
      social: { github: '#', linkedin: '#', twitter: '#' }
    },
    {
      id: 'GITM-SUP-001',
      name: 'Ahmed Ali',
      role: 'supervisor',
      title_ar: 'مشرف المختبرات',
      title_en: 'Lab Supervisor',
      email: 'ahmed@gitm.ma',
      badges: ['lab_manager', 'hardware'],
      social: { github: '#', linkedin: '#' }
    },
    {
      id: 'GITM-TCH-001',
      name: 'Dr. Yassine',
      role: 'teacher',
      title_ar: 'أستاذ الذكاء الاصطناعي',
      title_en: 'AI Instructor',
      email: 'yassine@gitm.ma',
      badges: ['instructor', 'data_science'],
      social: { linkedin: '#', twitter: '#' }
    },
    {
      id: 'GITM-MEM-102',
      name: 'Sara Khan',
      role: 'member',
      title_ar: 'عضو فريق البحث',
      title_en: 'Research Member',
      email: 'sara@gitm.ma',
      badges: ['developer', 'writer'],
      social: { github: '#' }
    }
  ];

  const handleCopyCV = (membershipId) => {
    navigator.clipboard.writeText(`https://gitm.ma/cv/${membershipId}`).then(() => {
      setCopiedId(membershipId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const tabs = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'All Team' },
    { id: 'leadership', label: lang === 'ar' ? 'القيادة والإشراف' : 'Leadership' },
    { id: 'academic', label: lang === 'ar' ? 'الطاقم الأكاديمي' : 'Academic Staff' },
    { id: 'members', label: lang === 'ar' ? 'الأعضاء الموثقين' : 'Verified Members' }
  ];

  const getFilteredMembers = () => {
    if (activeTab === 'leadership') return teamMembers.filter(m => m.role === 'president' || m.role === 'supervisor');
    if (activeTab === 'academic') return teamMembers.filter(m => m.role === 'teacher');
    if (activeTab === 'members') return teamMembers.filter(m => m.role === 'member');
    return teamMembers;
  };

  return (
    <div className="container-custom py-12 animate-fade-in-up min-h-screen">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-[#1e3a5f] dark:text-white mb-6">
          {lang === 'ar' ? 'فريق عمل GITM' : 'The GITM Team'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {lang === 'ar' 
            ? 'اكتشف العقول التي تقود الابتكار في مجموعتنا. (تقتصر هذه القائمة على الأعضاء والطاقم الإداري والأكاديمي الموثقين).' 
            : 'Meet the minds driving innovation. (This list is restricted to verified administrative, academic, and team members).'}
        </p>
      </div>

      {/* Strict Functional Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              activeTab === tab.id 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
              : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {getFilteredMembers().map((member) => (
          <motion.div 
            key={member.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group perspective"
          >
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 border border-slate-200 dark:border-slate-800">
              
              {/* Functional Verification Badge */}
              <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck size={12}/> Verified
              </div>

              {/* Functional Role Indicator */}
              {member.role === 'president' && (
                <div className="absolute top-4 left-4 text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                  <Star size={12}/> Admin
                </div>
              )}

              <div className="flex flex-col items-center mt-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-1 mb-4 shadow-xl">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-3xl font-bold text-[#1e3a5f] dark:text-white">
                    {member.name.charAt(0)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-4">{lang === 'ar' ? member.title_ar : member.title_en}</p>

                <div className="flex flex-wrap justify-center gap-1 mb-6 h-12">
                  {member.badges.map(b => (
                    <span key={b} className={`badge badge-${b} text-[9px] uppercase tracking-wider font-bold`}>{b}</span>
                  ))}
                </div>

                {/* Functional CV Copier & View Profile */}
                <div className="w-full flex gap-2 mb-4">
                  <Link 
                    to={`/profile/${member.id}`}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
                  >
                    {lang === 'ar' ? 'عرض الملف' : 'View Profile'} <ExternalLink size={16} />
                  </Link>

                  <button 
                    onClick={() => handleCopyCV(member.id)}
                    className={`flex justify-center items-center p-2.5 rounded-xl transition-all ${
                      copiedId === member.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={lang === 'ar' ? 'نسخ رابط السيرة' : 'Copy CV Link'}
                  >
                    {copiedId === member.id ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full justify-center">
                  {member.social.github && <a href={member.social.github} className="text-slate-600 dark:text-slate-400 hover:text-[#1e3a5f] dark:hover:text-white transition-colors"><Github size={18} /></a>}
                  {member.social.linkedin && <a href={member.social.linkedin} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>}
                  {member.social.twitter && <a href={member.social.twitter} className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"><Twitter size={18} /></a>}
                </div>

              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
