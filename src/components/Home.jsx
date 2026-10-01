import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Newspaper, Calendar, GraduationCap, Users, UserPlus } from 'lucide-react';
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
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

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

      {/* 4. Join GITM Section */}
      <Section
        title={t('home.joinTitle')}
        subtitle={t('home.joinSubtitle')}
        icon={UserPlus}
        bgClass="bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/5"
        colorTheme="blue"
      >
        <div className="glass-card p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-900/50">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gitm-textLight dark:text-white mb-4">
              {lang === 'ar' ? 'معايير الانضمام إلى الجمعية' : lang === 'fr' ? 'Critères d\'adhésion à l\'association' : 'Association Membership Criteria'}
            </h3>
            <ul className="space-y-3 mb-6 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <ArrowRight size={18} className={`mt-1 text-blue-500 shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'طالب هندسة أو تكنولوجيا، أو خريج شغوف بالابتكار.' : 'Engineering or technology student, or a graduate passionate about innovation.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={18} className={`mt-1 text-blue-500 shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'الالتزام بحضور الفعاليات والمساهمة الفعالة في مشاريع الجمعية.' : 'Commitment to attend events and actively contribute to the association\'s projects.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={18} className={`mt-1 text-blue-500 shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'الموافقة على سياسة الخصوصية وقانون الجمعية الداخلي.' : 'Agreement to the privacy policy and the association\'s internal regulations.'}</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/register')}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <UserPlus size={22} />
              {lang === 'ar' ? 'سجل كعضو جديد' : 'Register as a New Member'}
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="w-full md:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {lang === 'ar' ? 'تواصل معنا للاستفسار' : 'Contact Us for Inquiries'}
            </button>
          </div>
        </div>
      </Section>

      {/* 5. Team Section */}
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
