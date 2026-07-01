import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { teamData } from '../data/teamData';
import { ArrowUpRight } from 'lucide-react';

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
    <div className="w-full py-24 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {lang === 'ar' ? 'فريق العمل.' : 'The Team.'}
            </h2>
            <p className="text-slate-500 max-w-lg">
              {lang === 'ar'
                ? 'تعرف على العقول التي تبني تقنيات المستقبل في المغرب.'
                : 'Meet the minds building the future of tech in Morocco.'}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {lang === 'ar' ? filter.labelAr : filter.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence>
            {filteredTeam.map((member, index) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key={member.id}
                className="group flex flex-col cursor-pointer"
              >
                {/* Grayscale Image */}
                <div className="relative aspect-square w-full mb-6 overflow-hidden bg-slate-100 dark:bg-[#111]">
                  <img
                    src={member.image}
                    alt={member.nameEn}
                    className="w-full h-full object-cover img-grayscale"
                  />
                  <div className="absolute inset-0 border-minimal pointer-events-none" />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-[#F97316] transition-colors">
                      {lang === 'ar' ? member.nameAr : member.nameEn}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {lang === 'ar' ? member.roleAr : member.roleEn}
                    </p>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#F97316] opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
