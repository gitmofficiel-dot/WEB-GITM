import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Newspaper, Calendar, GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Hero from './Hero';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions'; // Trainings
import AcademySlider from './AcademySlider';
import TeamShowcase from './TeamShowcase';
import PartnersSlider from './PartnersSlider';

// Reusable Section Component for high-contrast Corporate design
const Section = ({ title, subtitle, icon: Icon, children, bgClass, linkText, linkUrl }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <section className={`w-full py-24 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gitm-blue/10 dark:bg-gitm-blue/20 rounded-xl">
                <Icon size={24} className="text-gitm-blue dark:text-gitm-cyan" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gitm-textLight dark:text-white">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-gitm-mutedLight dark:text-gitm-mutedDark text-lg max-w-2xl ml-16 rtl:mr-16 rtl:ml-0">
                {subtitle}
              </p>
            )}
          </div>
          {linkText && linkUrl && (
            <button 
              onClick={() => navigate(linkUrl)}
              className="flex items-center gap-2 font-semibold text-gitm-blue dark:text-gitm-cyan hover:text-gitm-cyan transition-colors"
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
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. News & Events Section */}
      <Section 
        title={lang === 'ar' ? 'الأخبار والفعاليات' : 'News & Events'}
        subtitle={lang === 'ar' ? 'تابع أحدث التطورات التقنية والفعاليات القادمة في مجتمعنا.' : 'Follow the latest tech developments and upcoming events in our community.'}
        icon={Newspaper}
        bgClass="bg-white dark:bg-gitm-cardDark border-y border-gitm-borderLight dark:border-gitm-borderDark"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="soft-card p-6 md:p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gitm-textLight dark:text-white">{lang === 'ar' ? 'آخر الأخبار' : 'Latest News'}</h3>
              <a href="/news" className="text-sm font-semibold text-gitm-blue hover:underline">{lang === 'ar' ? 'المزيد' : 'More'}</a>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {/* Added mask to fade out bottom */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-white dark:from-gitm-cardDark via-transparent to-transparent h-12 top-auto" />
              <div className="h-full overflow-y-auto pr-2 pb-8">
                <LatestNews />
              </div>
            </div>
          </div>

          <div className="soft-card p-6 md:p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gitm-textLight dark:text-white">{lang === 'ar' ? 'الفعاليات والتداريب' : 'Events & Trainings'}</h3>
              <a href="/events" className="text-sm font-semibold text-gitm-blue hover:underline">{lang === 'ar' ? 'المزيد' : 'More'}</a>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-white dark:from-gitm-cardDark via-transparent to-transparent h-12 top-auto" />
              <div className="h-full overflow-y-auto pr-2 pb-8">
                <TechExhibitions />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Academy Section */}
      <Section
        title={lang === 'ar' ? 'أكاديمية GITM' : 'GITM Academy'}
        subtitle={lang === 'ar' ? 'مسارات تدريبية متقدمة لتأهيلك في مجالات البرمجة والذكاء الاصطناعي.' : 'Advanced training tracks to qualify you in programming and AI.'}
        icon={GraduationCap}
        bgClass="bg-gitm-light dark:bg-gitm-dark"
        linkText={lang === 'ar' ? 'تصفح الدورات' : 'Browse Courses'}
        linkUrl="/academy"
      >
        <div className="soft-card p-6 md:p-10">
          <AcademySlider />
        </div>
      </Section>

      {/* 4. Partners Section */}
      <section className="w-full bg-white dark:bg-gitm-cardDark border-y border-gitm-borderLight dark:border-gitm-borderDark py-16">
        <PartnersSlider />
      </section>

      {/* 5. Team Section */}
      <Section
        title={lang === 'ar' ? 'فريق العمل' : 'Our Team'}
        subtitle={lang === 'ar' ? 'تعرف على الخبراء والمهندسين الذين يقفون خلف ابتكاراتنا.' : 'Meet the experts and engineers behind our innovations.'}
        icon={Users}
        bgClass="bg-gitm-light dark:bg-gitm-dark"
        linkText={lang === 'ar' ? 'من نحن' : 'About Us'}
        linkUrl="/about-us"
      >
        <TeamShowcase />
      </Section>

    </div>
  );
}
