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
const Section = ({ title, subtitle, icon: Icon, children, bgClass, linkText, linkUrl, isRed }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  const accentColor = isRed ? 'text-gitm-red' : 'text-gitm-green';
  const accentBg = isRed ? 'bg-gitm-red/10 dark:bg-gitm-red/20' : 'bg-gitm-green/10 dark:bg-gitm-green/20';
  
  return (
    <section className={`w-full py-24 relative ${bgClass}`}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${accentBg}`}>
                <Icon size={28} className={accentColor} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gitm-textLight dark:text-white">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-gitm-mutedLight dark:text-gitm-mutedDark text-lg max-w-3xl ml-16 rtl:mr-16 rtl:ml-0">
                {subtitle}
              </p>
            )}
          </div>
          {linkText && linkUrl && (
            <button 
              onClick={() => navigate(linkUrl)}
              className={`flex items-center gap-2 font-bold ${accentColor} hover:underline transition-all`}
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
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-gitm-light dark:bg-gitm-dark">
      
      <Hero />

      {/* Math & Tech Background Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-math-overlay bg-repeat opacity-[0.03] dark:opacity-[0.02] z-0" />

      {/* Partners Marquee at top of content */}
      <PartnersSlider />

      <Section 
        title={lang === 'ar' ? 'الأخبار والفعاليات' : 'News & Events'}
        subtitle={lang === 'ar' ? 'آخر التطورات التقنية والأنشطة في المركز الجهوي والمؤسسة.' : 'Latest tech developments and activities in the regional center and foundation.'}
        icon={Newspaper}
        bgClass="bg-white dark:bg-gitm-cardDark"
        isRed={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="tilt-card p-6 md:p-8 flex flex-col h-[550px] shadow-soft">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gitm-borderDark pb-4">
              <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white">{lang === 'ar' ? 'أخبار المؤسسة' : 'Foundation News'}</h3>
              <a href="/news" className="text-sm font-bold text-gitm-red hover:underline">{lang === 'ar' ? 'كل الأخبار' : 'All News'}</a>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <LatestNews />
            </div>
          </div>

          <div className="tilt-card p-6 md:p-8 flex flex-col h-[550px] shadow-soft">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gitm-borderDark pb-4">
              <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white">{lang === 'ar' ? 'المعارض والتداريب' : 'Exhibitions & Training'}</h3>
              <a href="/events" className="text-sm font-bold text-gitm-red hover:underline">{lang === 'ar' ? 'كل التداريب' : 'All Training'}</a>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <TechExhibitions />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title={lang === 'ar' ? 'الأكاديمية المتقدمة' : 'Advanced Academy'}
        subtitle={lang === 'ar' ? 'برامج تدريبية تواكب مستوى الجامعات العالمية وتؤهلك للمستقبل.' : 'Training programs matching global universities to prepare you for the future.'}
        icon={GraduationCap}
        bgClass="bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-gitm-borderDark"
        linkText={lang === 'ar' ? 'استكشف المناهج' : 'Explore Curriculum'}
        linkUrl="/academy"
        isRed={false}
      >
        <div className="tilt-card p-6 md:p-10 shadow-soft">
          <AcademySlider />
        </div>
      </Section>

      <Section
        title={lang === 'ar' ? 'قيادة الابتكار' : 'Innovation Leadership'}
        subtitle={lang === 'ar' ? 'نخبة المهندسين والخبراء المغاربة الذين يصنعون الفارق.' : 'The elite Moroccan engineers and experts making a difference.'}
        icon={Users}
        bgClass="bg-white dark:bg-gitm-cardDark"
        linkText={lang === 'ar' ? 'تعرف علينا' : 'About Us'}
        linkUrl="/about-us"
        isRed={true}
      >
        <TeamShowcase />
      </Section>

    </div>
  );
}
