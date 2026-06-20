import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink, Briefcase, Award, MapPin, Code, BookOpen, Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { lang, t, users, selectedProfileId, setView } = useLanguage();
  
  const user = users.find(u => u.id === selectedProfileId);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Profile Not Found</h2>
        <button onClick={() => setView('about')} className="mt-4 text-cyan-500 hover:underline">Return to Members</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <button onClick={() => setView('about')} className="flex items-center text-slate-500 hover:text-cyan-500 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {lang === 'ar' ? 'العودة' : 'Back to Members'}
      </button>

      {/* Hero Section */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-5xl font-black text-white">{user.name[0].toUpperCase()}</span>
          </div>
          
          <div className="text-center md:text-left rtl:md:text-right flex-1">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white font-orbitron mb-2">
              {user.name}
            </h1>
            <p className="text-xl text-cyan-600 dark:text-cyan-400 font-medium mb-4 flex justify-center md:justify-start items-center gap-2">
              <Briefcase size={20} />
              <span className="uppercase text-sm tracking-wider">{user.role}</span>
            </p>
            
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-lg leading-relaxed mb-6">
              {user.bio || 'GITM Team Member passionate about technology and innovation.'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a href={`mailto:${user.email}`} className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-cyan-500 hover:text-white transition-all">
                <Mail size={16} /> Contact
              </a>
              {user.github && (
                <a href={`https://${user.github}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-[#24292e] hover:text-white transition-all">
                  <Github size={16} /> GitHub
                </a>
              )}
              {user.linkedin && (
                <a href={`https://${user.linkedin}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-[#0077b5] hover:text-white transition-all">
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Badges Section */}
        <div className="glass-card p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <Award className="text-emerald-500" />
            {lang === 'ar' ? 'شارات التميز' : 'Earned Badges'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {badge}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">{lang === 'ar' ? 'لا توجد شارات بعد' : 'No badges earned yet.'}</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="md:col-span-2 glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <Code className="text-cyan-500" size={20} />
            {lang === 'ar' ? 'المشاريع والإنجازات' : 'Projects & Contributions'}
          </h3>
          
          <div className="space-y-4">
            {user.projects && user.projects.length > 0 ? (
              user.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-cyan-500 transition-colors">{proj}</h4>
                      <p className="text-sm text-slate-500 dark:text-cyber-muted mt-1">
                        {lang === 'ar' ? 'تمت المساهمة كجزء من فريق التطوير.' : 'Contributed as part of the core development team.'}
                      </p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-cyan-500 bg-white dark:bg-white/5 rounded-lg shadow-sm">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">{lang === 'ar' ? 'لم يتم إضافة مشاريع بعد.' : 'No projects added yet.'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Learning Path */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <BookOpen className="text-blue-500" size={20} />
            {lang === 'ar' ? 'المسار التعليمي' : 'Learning Path'}
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 rtl:before:mr-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl shadow-sm border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Edge AI Architecture</span>
                  <span className="text-xs text-slate-500">100%</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Completed on June 15, 2026</p>
              </div>
            </div>
            
            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-amber-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Target size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl shadow-sm border border-amber-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-white">IoT Cloud Integration</span>
                  <span className="text-xs font-bold text-amber-500">40%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-300 dark:bg-slate-700 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-current"></div>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 opacity-60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-white">Industrial Robotics</span>
                  <span className="text-xs text-slate-500">Not Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interests & Radar Chart (Mock) */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <Star className="text-purple-500" size={20} />
            {lang === 'ar' ? 'الاهتمامات والمهارات' : 'Interests & Skills'}
          </h3>
          
          <div className="mb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{lang === 'ar' ? 'المجالات التقنية المفضلة:' : 'Core interests:'}</p>
            <div className="flex flex-wrap gap-2">
              {['Artificial Intelligence', 'Embedded Systems', 'Computer Vision', 'Cloud Computing', 'IoT'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-dashed border-purple-300 dark:border-purple-900/50 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-2 border-2 border-purple-400 dark:border-purple-700 rounded-full opacity-50"></div>
                <div className="absolute inset-6 border border-purple-500 dark:border-purple-500 rounded-full opacity-25"></div>
                <Award className="w-10 h-10 text-purple-500" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Skill Graph</p>
              <p className="text-xs text-slate-500">{lang === 'ar' ? 'رسم بياني يوضح توزع المهارات بناءً على الدورات والمشاريع.' : 'Visual skill distribution based on courses and projects.'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Share Link */}
      <div className="text-center mt-8">
         <p className="text-sm text-slate-500 mb-2">{lang === 'ar' ? 'رابط الملف الشخصي للمشاركة:' : 'Shareable Profile Link:'}</p>
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">https://gitm.ma/profile/{user.id}</span>
            <button className="text-cyan-500 hover:text-cyan-400 font-bold text-xs uppercase" onClick={() => alert('Link copied!')}>Copy</button>
         </div>
      </div>
    </div>
  );
};

// Also import Code, CheckCircle from lucide-react at the top
import { CheckCircle } from 'lucide-react';

export default PublicProfile;
