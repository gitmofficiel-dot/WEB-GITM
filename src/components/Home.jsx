import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Newspaper, Calendar, GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Hero from './Hero';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions';
import AcademySlider from './AcademySlider';
import TeamShowcase from './TeamShowcase';
import PartnersSlider from './PartnersSlider';

// Section Component for Moroccan Vision Design
const Section = ({ title, subtitle, icon: Icon, children, bgClass, linkText, linkUrl, colorTheme }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  let accentColor, accentBg;
  switch(colorTheme) {
    case 'red':
      accentColor = 'text-gitm-red';
      accentBg = 'bg-gitm-red/20 dark:bg-gitm-red/30';
      break;
    case 'green':
      accentColor = 'text-gitm-green';
      accentBg = 'bg-gitm-green/20 dark:bg-gitm-green/30';
      break;
    case 'blue':
      accentColor = 'text-gitm-blue';
      accentBg = 'bg-gitm-blue/20 dark:bg-gitm-blue/30';
      break;
    default:
      accentColor = 'text-gitm-red';
      accentBg = 'bg-gitm-red/20 dark:bg-gitm-red/30';
  }
  
  return (
    <section className={`w-full py-6 md:py-20 relative ${bgClass}`}>
      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className={`p-2.5 md:p-3 rounded-xl ${accentBg} backdrop-blur-sm`}>
                <Icon size={22} className={`md:w-7 md:h-7 ${accentColor}`} />
              </div>
              <h2 className="text-xl md:text-5xl font-bold tracking-tight text-gitm-textLight dark:text-white drop-shadow-md">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-gray-800 dark:text-gray-200 text-sm md:text-lg max-w-3xl rtl:ml-0 font-medium drop-shadow mt-1 md:mt-0">
                {subtitle}
              </p>
            )}
          </div>
          {linkText && linkUrl && (
            <button 
              onClick={() => navigate(linkUrl)}
              className={`flex items-center gap-2 font-bold ${accentColor} hover:underline transition-all whitespace-nowrap drop-shadow-md`}
            >
              {linkText} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-transparent">
      
      <Hero />

      <PartnersSlider />

      {/* 1. News Section (Full Width) */}
      <Section 
        title={t('home.newsTitle')}
        subtitle={t('home.newsSubtitle')}
        icon={Newspaper}
        bgClass="bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/5"
        colorTheme="red"
        linkText={t('home.newsBrowseAll')}
        linkUrl="/news"
      >
        <div className="glass-card p-3 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
          <LatestNews />
        </div>
      </Section>

      {/* 2. Events Section (Full Width) */}
      <Section 
        title={t('home.eventsTitle')}
        subtitle={t('home.eventsSubtitle')}
        icon={Calendar}
        bgClass="bg-black/5 dark:bg-black/30 backdrop-blur-md border-b border-white/20 dark:border-white/5"
        colorTheme="blue"
        linkText={t('home.eventsSchedule')}
        linkUrl="/events"
      >
        <div className="glass-card p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
          <TechExhibitions />
        </div>
      </Section>

      {/* 3. Academy Section (Full Width) */}
      <Section
        title={t('home.academyTitle')}
        subtitle={t('home.academySubtitle')}
        icon={GraduationCap}
        bgClass="bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/5"
        colorTheme="green"
        linkText={t('home.academyExplore')}
        linkUrl="/academy"
      >
        <div className="glass-card p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-xl">
          <AcademySlider />
        </div>
      </Section>

      {/* 4. Team Section */}
      <Section
        title={t('home.teamTitle')}
        subtitle={t('home.teamSubtitle')}
        icon={Users}
        bgClass="bg-black/5 dark:bg-black/30 backdrop-blur-md"
        colorTheme="red"
        linkText={t('home.teamAbout')}
        linkUrl="/about-us"
      >
        <div className="glass-card p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
          <TeamShowcase />
        </div>
      </Section>

    </div>
  );
}
