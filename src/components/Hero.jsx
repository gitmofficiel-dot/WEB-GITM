import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Globe, Users, ShieldCheck, Target, Activity, Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-white dark:bg-slate-950">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle CSS-only dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgb(100 116 139) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Dark-mode glow orbs — indigo / violet / purple */}
        <div className="hidden dark:block">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
          <div className="absolute top-1/4 left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.06] blur-[120px]" />
          <div className="absolute bottom-[15%] right-[15%] w-[450px] h-[450px] rounded-full bg-purple-600/[0.05] blur-[120px]" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-custom relative z-10 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-8 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
            {lang === 'ar' ? 'مركز الابتكار المغربي' : 'Moroccan Innovation Hub'}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05] max-w-5xl mx-auto"
        >
          {lang === 'ar' ? 'نبني أنظمة المستقبل' : 'We Build The Future'}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
            {lang === 'ar' ? 'المدعومة بالذكاء الاصطناعي' : 'Powered by AI'}
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {lang === 'ar'
            ? 'مجموعة بحث وتطوير تسعى لتدريب وتأهيل جيل جديد من المهندسين والمبتكرين في مجالات الذكاء الاصطناعي، الروبوتيك، والأنظمة المدمجة.'
            : 'An R&D group dedicated to training and empowering a new generation of engineers and innovators in AI, Robotics, and Embedded Systems.'}
        </motion.p>

        {/* Search Bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="w-full max-w-xl mx-auto mb-14 relative z-30"
        >
          <div
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 cursor-text transition-all duration-200 group"
          >
            <Search className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={22} />
            <span className="flex-1 text-left rtl:text-right text-slate-500 font-medium text-base">
              {lang === 'ar' ? 'ما الذي تبحث عنه؟' : 'What are you looking for?'}
            </span>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
              <Command size={13} /> K
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col sm:flex-row gap-4 mb-24 z-20 relative"
        >
          <button
            onClick={() => navigate('/projects-hub')}
            className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            <Activity size={20} />
            <span>{lang === 'ar' ? 'استكشف قوة أنظمتنا' : 'Explore Our Power'}</span>
          </button>

          <button
            onClick={() => navigate('/academy')}
            className="group px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200"
          >
            <Globe size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
            {lang === 'ar' ? 'أكاديمية الذكاء الاصطناعي' : 'AI Academy'}
            <ChevronRight
              size={18}
              className={`text-slate-400 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
            />
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="grid grid-cols-1 md:grid-cols-3 gap-px w-full max-w-3xl mx-auto relative z-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800"
        >
          {[
            {
              value: '10,000',
              label: lang === 'ar' ? 'طالب مستهدف بحلول 2028' : 'Target Talents by 2028',
            },
            {
              value: '100%',
              label: lang === 'ar' ? 'أنظمة مغربية مستقلة' : 'Sovereign Moroccan AI',
            },
            {
              value: 'GITM',
              label: lang === 'ar' ? 'المنظمة الأقوى عالمياً' : "World's Strongest AI Org",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-950 px-8 py-8 flex flex-col items-center"
            >
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
