import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import LatestNews from './LatestNews';
import AcademySlider from './AcademySlider';
import TechExhibitions from './TechExhibitions';
import PartnersSlider from './PartnersSlider';
import TeamShowcase from './TeamShowcase';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Newspaper, Cpu } from 'lucide-react';

const section = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const Home = () => {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 overflow-hidden">
      {/* 1. Hero */}
      <Hero />

      {/* 2. News & Exhibitions — Bento Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
        {/* Section Header */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
              {lang === 'ar' ? 'ابقَ على اطلاع' : 'Stay Updated'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'ar' ? 'آخر الأخبار والفعاليات' : 'Latest News & Events'}
            </h2>
          </div>
          <a href="/news" className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all">
            {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
            className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={18} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{lang === 'ar' ? 'أخبار محلية' : 'Local News'}</span>
              </div>
              <div className="max-h-[520px] overflow-hidden">
                <LatestNews />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
            className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={18} className="text-violet-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{lang === 'ar' ? 'تداريب وفعاليات' : 'Training & Events'}</span>
              </div>
              <div className="max-h-[520px] overflow-hidden">
                <TechExhibitions />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Academy Showcase */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-24">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
          className="max-w-7xl mx-auto px-4 sm:px-6"
        >
          <AcademySlider />
        </motion.div>
      </section>

      {/* 4. Partners & Supporters */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
        className="w-full"
      >
        <PartnersSlider />
      </motion.div>

      {/* 5. Team */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section}
        className="w-full"
      >
        <TeamShowcase />
      </motion.div>
    </div>
  );
};

export default Home;
