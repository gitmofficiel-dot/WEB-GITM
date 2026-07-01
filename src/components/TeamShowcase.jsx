import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { teamData } from '../data/teamData';
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';

export default function TeamShowcase() {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'founder', labelAr: 'القيادة', labelEn: 'Leadership' },
    { id: 'professor', labelAr: 'الأساتذة', labelEn: 'Professors' },
    { id: 'teacher', labelAr: 'المعلمين', labelEn: 'Teachers' },
    { id: 'member', labelAr: 'الأعضاء', labelEn: 'Members' },
  ];

  const filteredTeam = activeFilter === 'all'
    ? teamData
    : teamData.filter(member => member.type === activeFilter);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeFilter === filter.id
                ? 'bg-gitm-blue text-white shadow-md shadow-gitm-blue/30'
                : 'bg-white dark:bg-gitm-cardDark text-gitm-mutedLight dark:text-gitm-mutedDark hover:text-gitm-textLight dark:hover:text-gitm-textDark border border-gitm-borderLight dark:border-gitm-borderDark'
            }`}
          >
            {lang === 'ar' ? filter.labelAr : filter.labelEn}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredTeam.map((member, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={member.id}
              className="soft-card group overflow-hidden flex flex-col"
            >
              {/* Colorful Image Header */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={member.image}
                  alt={member.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Social Links on Hover */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {member.socials?.linkedin && (
                    <a href={member.socials.linkedin} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-gitm-blue transition-colors">
                      <Linkedin size={16} />
                    </a>
                  )}
                  {member.socials?.github && (
                    <a href={member.socials.github} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-900 transition-colors">
                      <Github size={16} />
                    </a>
                  )}
                  {member.socials?.twitter && (
                    <a href={member.socials.twitter} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-sky-500 transition-colors">
                      <Twitter size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-gitm-cardDark">
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gitm-textLight dark:text-white group-hover:text-gitm-blue dark:group-hover:text-gitm-cyan transition-colors">
                    {lang === 'ar' ? member.nameAr : member.nameEn}
                  </h3>
                  <p className="text-sm text-gitm-cyan font-semibold mb-3">
                    {lang === 'ar' ? member.roleAr : member.roleEn}
                  </p>
                  <p className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? member.bioAr : member.bioEn}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
