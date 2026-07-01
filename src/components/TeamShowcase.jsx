import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Users, BookOpen, GraduationCap, Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import { teamData } from '../data/teamData';

export default function TeamShowcase() {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: <Users size={16}/> },
    { id: 'founder', labelAr: 'القيادة', labelEn: 'Leadership', icon: <Sparkles size={16}/> },
    { id: 'professor', labelAr: 'الأساتذة', labelEn: 'Professors', icon: <GraduationCap size={16}/> },
    { id: 'teacher', labelAr: 'المعلمين', labelEn: 'Teachers', icon: <BookOpen size={16}/> },
    { id: 'member', labelAr: 'الأعضاء', labelEn: 'Members', icon: <Github size={16}/> },
  ];

  const filteredTeam = activeFilter === 'all' 
    ? teamData 
    : teamData.filter(member => member.type === activeFilter);

  return (
    <div className="w-full py-24 bg-white dark:bg-[#040914] relative overflow-hidden">
      {/* Background Glows for Premium Vibe */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 border border-blue-100 dark:border-blue-800"
          >
            <Sparkles size={16} />
            <span>{lang === 'ar' ? 'عقول مبتكرة' : 'Innovative Minds'}</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-slate-900 dark:text-white mb-6 tracking-tight">
            {lang === 'ar' ? 'فريق العمل والخبراء' : 'Meet Our Experts'}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            {lang === 'ar' 
              ? 'نخبة من خيرة العقول الأكاديمية والمهندسين يجتمعون لبناء تقنيات المستقبل في GITM.'
              : 'An elite group of academic minds and engineers coming together to build the tech of tomorrow at GITM.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {filter.icon}
                {lang === 'ar' ? filter.labelAr : filter.labelEn}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTeam.map(member => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={member.id}
                className="group relative"
              >
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glass Card */}
                <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden z-10 flex flex-col">
                  
                  {/* Decorative corner glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>

                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-50"></div>
                    <img 
                      src={member.image} 
                      alt={member.nameEn} 
                      className="relative w-full h-full object-cover rounded-[2rem] border-[3px] border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="text-center flex-1 flex flex-col">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 mx-auto backdrop-blur-md ${
                      member.type === 'founder' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                      member.type === 'professor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20' :
                      member.type === 'teacher' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                    }`}>
                      {lang === 'ar' ? member.roleAr : member.roleEn}
                    </span>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {lang === 'ar' ? member.nameAr : member.nameEn}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                      {lang === 'ar' ? member.bioAr : member.bioEn}
                    </p>
                    
                    <div className="flex items-center justify-center gap-5 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <a href={member.socials.linkedin} className="text-slate-400 hover:text-blue-500 transition-colors"><Linkedin size={20}/></a>
                      <a href={member.socials.github} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={20}/></a>
                      <a href={member.socials.twitter} className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={20}/></a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
