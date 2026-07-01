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
      accentBg = 'bg-gitm-red/10 dark:bg-gitm-red/20';
      break;
    case 'green':
      accentColor = 'text-gitm-green';
      accentBg = 'bg-gitm-green/10 dark:bg-gitm-green/20';
      break;
    case 'blue':
      accentColor = 'text-gitm-blue';
      accentBg = 'bg-gitm-blue/10 dark:bg-gitm-blue/20';
      break;
    default:
      accentColor = 'text-gitm-red';
      accentBg = 'bg-gitm-red/10 dark:bg-gitm-red/20';
  }
  
  return (
    <section className={`w-full py-20 relative ${bgClass}`}>
      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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
              <p className="text-gitm-mutedLight dark:text-gitm-mutedDark text-lg max-w-3xl rtl:ml-0">
                {subtitle}
              </p>
            )}
          </div>
          {linkText && linkUrl && (
            <button 
              onClick={() => navigate(linkUrl)}
              className={`flex items-center gap-2 font-bold ${accentColor} hover:underline transition-all whitespace-nowrap`}
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

      <PartnersSlider />

      {/* 1. News Section (Full Width) */}
      <Section 
        title={lang === 'ar' ? 'أخبار المؤسسة' : 'Foundation News'}
        subtitle={lang === 'ar' ? 'آخر التطورات التقنية والأنشطة الإدارية الخاصة بالمجموعة.' : 'Latest tech developments and administrative activities of the group.'}
        icon={Newspaper}
        bgClass="bg-white dark:bg-gitm-dark border-b border-gray-100 dark:border-gitm-borderDark"
        colorTheme="red"
        linkText={lang === 'ar' ? 'تصفح كل الأخبار' : 'Browse All News'}
        linkUrl="/news"
      >
        <div className="tilt-card p-6 md:p-8 shadow-soft">
          <LatestNews />
        </div>
      </Section>

      {/* 2. Events Section (Full Width) */}
      <Section 
        title={lang === 'ar' ? 'الفعاليات والمعارض' : 'Events & Exhibitions'}
        subtitle={lang === 'ar' ? 'مشاركاتنا في المعارض الوطنية والدولية والفعاليات التقنية.' : 'Our participation in national and international tech exhibitions.'}
        icon={Calendar}
        bgClass="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-100 dark:border-gitm-borderDark"
        colorTheme="blue"
        linkText={lang === 'ar' ? 'جدول الفعاليات' : 'Events Schedule'}
        linkUrl="/events"
      >
        <div className="tilt-card p-6 md:p-8 shadow-soft">
          <TechExhibitions />
        </div>
      </Section>

      {/* 3. Academy Section (Full Width) */}
      <Section
        title={lang === 'ar' ? 'الأكاديمية والتداريب' : 'Academy & Training'}
        subtitle={lang === 'ar' ? 'برامج تدريبية تواكب مستوى الجامعات العالمية وتؤهلك للمستقبل.' : 'Training programs matching global universities to prepare you for the future.'}
        icon={GraduationCap}
        bgClass="bg-white dark:bg-gitm-dark border-b border-gray-100 dark:border-gitm-borderDark"
        colorTheme="green"
        linkText={lang === 'ar' ? 'استكشف المناهج' : 'Explore Curriculum'}
        linkUrl="/academy"
      >
        <div className="tilt-card p-6 md:p-10 shadow-soft">
          <AcademySlider />
        </div>
      </Section>

      {/* 4. Team Section */}
      <Section
        title={lang === 'ar' ? 'قيادة الابتكار' : 'Innovation Leadership'}
        subtitle={lang === 'ar' ? 'نخبة المهندسين والخبراء المغاربة الذين يصنعون الفارق.' : 'The elite Moroccan engineers and experts making a difference.'}
        icon={Users}
        bgClass="bg-gray-50 dark:bg-[#0f0f0f]"
        colorTheme="red"
        linkText={lang === 'ar' ? 'تعرف علينا' : 'About Us'}
        linkUrl="/about-us"
      >
        <TeamShowcase />
      </Section>

    </div>
  );
}
