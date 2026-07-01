import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

import Hero from './Hero';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions';
import AcademySlider from './AcademySlider';
import TeamShowcase from './TeamShowcase';
import PartnersSlider from './PartnersSlider';

const Home = () => {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
      
      {/* 1. Typography Hero */}
      <Hero />

      {/* 2. Structured Section: News & Events */}
      <section className="w-full border-t border-minimal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {lang === 'ar' ? 'الأخبار والفعاليات.' : 'News & Events.'}
            </h2>
            <a href="/news" className="flex items-center gap-2 text-sm font-bold text-[#F97316] hover:gap-3 transition-all">
              {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border-minimal bg-white dark:bg-[#0a0a0a] p-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                {lang === 'ar' ? 'أخبار محلية' : 'Local News'}
              </h3>
              <div className="h-[400px] overflow-hidden">
                <LatestNews />
              </div>
            </div>

            <div className="border-minimal bg-white dark:bg-[#0a0a0a] p-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                {lang === 'ar' ? 'تداريب' : 'Trainings'}
              </h3>
              <div className="h-[400px] overflow-hidden">
                <TechExhibitions />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Structured Section: Academy */}
      <section className="w-full border-t border-minimal bg-slate-50 dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {lang === 'ar' ? 'الأكاديمية.' : 'The Academy.'}
            </h2>
          </div>
          <div className="border-minimal bg-white dark:bg-black p-4">
            <AcademySlider />
          </div>
        </div>
      </section>

      {/* 4. Structured Section: Partners */}
      <section className="w-full border-t border-minimal">
        <PartnersSlider />
      </section>

      {/* 5. Structured Section: Team */}
      <section className="w-full border-t border-minimal">
        <TeamShowcase />
      </section>

    </div>
  );
};

export default Home;
