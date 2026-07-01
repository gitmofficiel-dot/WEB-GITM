import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Users, BookOpen, GraduationCap, Github, Linkedin, Twitter, Crown } from 'lucide-react';
import { teamData } from '../data/teamData';

export default function TeamShowcase() {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: <Users size={16}/> },
    { id: 'founder', labelAr: 'القيادة', labelEn: 'Leadership', icon: <Crown size={16}/> },
    { id: 'professor', labelAr: 'الأساتذة', labelEn: 'Professors', icon: <GraduationCap size={16}/> },
    { id: 'teacher', labelAr: 'المعلمين', labelEn: 'Teachers', icon: <BookOpen size={16}/> },
    { id: 'member', labelAr: 'الأعضاء', labelEn: 'Members', icon: <Github size={16}/> },
  ];

  const filteredTeam = activeFilter === 'all'
    ? teamData
    : teamData.filter(member => member.type === activeFilter);

  const badgeColors = {
    founder: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    professor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    teacher: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    member: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  };

  return (
    <div className="w-full py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              {lang === 'ar' ? 'عقول مبتكرة' : 'Innovative Minds'}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              {lang === 'ar' ? 'فريق العمل والخبراء' : 'Meet Our Experts'}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
              {lang === 'ar'
                ? 'نخبة من الأساتذة والمهندسين يجتمعون لبناء تقنيات المستقبل.'
                : 'An elite group of professors and engineers building the tech of tomorrow.'}
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {filter.icon}
                {lang === 'ar' ? filter.labelAr : filter.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTeam.map((member, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                key={member.id}
                className="group"
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col">

                  {/* Avatar */}
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-[1.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-40 group-hover:opacity-60"></div>
                    <img
                      src={member.image}
                      alt={member.nameEn}
                      className="relative w-full h-full object-cover rounded-[1.5rem] border-[3px] border-white dark:border-slate-950 shadow-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center flex-1 flex flex-col">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 mx-auto border ${badgeColors[member.type] || badgeColors.member}`}>
                      {lang === 'ar' ? member.roleAr : member.roleEn}
                    </span>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {lang === 'ar' ? member.nameAr : member.nameEn}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                      {lang === 'ar' ? member.bioAr : member.bioEn}
                    </p>

                    {/* Socials */}
                    <div className="flex items-center justify-center gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <a href={member.socials?.linkedin || '#'} className="text-slate-400 hover:text-indigo-500 transition-colors"><Linkedin size={18}/></a>
                      <a href={member.socials?.github || '#'} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={18}/></a>
                      <a href={member.socials?.twitter || '#'} className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={18}/></a>
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
