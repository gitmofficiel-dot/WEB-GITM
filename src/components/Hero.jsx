import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Globe, Zap, Users, ShieldCheck, Target, BrainCircuit, Activity, Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-slate-50 dark:bg-[#09090b]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
        {/* Core AI Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        
        {/* AI System Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-xl shadow-lg cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-500/20">
            <BrainCircuit size={14} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide font-orbitron">
            {lang === 'ar' ? 'أقوى منظومة ذكاء اصطناعي مغربية' : 'The Most Powerful Moroccan AI Ecosystem'}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-6xl md:text-[5.5rem] font-orbitron font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight drop-shadow-sm max-w-5xl mx-auto"
        >
          {lang === 'ar' ? 'نبني أنظمة المستقبل' : 'We Build The Future'}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 relative">
            {lang === 'ar' ? 'المدعومة بالذكاء الاصطناعي' : 'Powered by AI'}
            {/* Sparkle effect */}
            <span className="absolute -top-4 -right-10 text-cyan-400 animate-bounce"><Zap size={36}/></span>
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          {lang === 'ar' 
            ? 'مجموعة بحث وتطوير تسعى لتدريب وتأهيل جيل جديد من المهندسين والمبتكرين في مجالات الذكاء الاصطناعي، الروبوتيك، والأنظمة المدمجة.' 
            : 'An R&D group dedicated to training and empowering a new generation of engineers and innovators in AI, Robotics, and Embedded Systems.'}
        </motion.p>

        {/* Global Search Bar (Spotlight Trigger) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xl mx-auto mb-16 relative z-30"
        >
          <div 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500/50 shadow-xl shadow-slate-200/50 dark:shadow-none cursor-text transition-all group hover:scale-[1.02]"
          >
            <Search className="text-slate-400 group-hover:text-cyan-500 transition-colors" size={24} />
            <span className="flex-1 text-left rtl:text-right text-slate-500 font-medium text-lg">
              {lang === 'ar' ? 'ما الذي تبحث عنه؟' : 'What are you looking for?'}
            </span>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hidden sm:flex">
              <Command size={14} /> K
            </div>
          </div>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-24 z-20 relative"
        >
          <button 
            onClick={() => navigate('/projects-hub')}
            className="relative group px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105"
          >
            <Activity size={22} className="group-hover:animate-pulse" />
            <span>{lang === 'ar' ? 'استكشف قوة أنظمتنا' : 'Explore Our Power'}</span>
          </button>
          <button 
            onClick={() => navigate('/academy')}
            className="group px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-sm"
          >
            <Globe size={22} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
            {lang === 'ar' ? 'أكاديمية الذكاء الاصطناعي' : 'AI Academy'}
            <ChevronRight size={20} className={`text-slate-400 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </motion.div>

        {/* Strategic Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto relative z-10"
        >
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl flex flex-col items-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group">
            <Users className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-4xl font-orbitron font-bold text-slate-900 dark:text-white mb-2">10,000</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === 'ar' ? 'طالب مستهدف بحلول 2028' : 'Target Talents by 2028'}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl flex flex-col items-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group transform md:-translate-y-4">
            <Target className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-4xl font-orbitron font-bold text-slate-900 dark:text-white mb-2">100%</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === 'ar' ? 'أنظمة مغربية مستقلة' : 'Sovereign Moroccan AI'}</p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl flex flex-col items-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group">
            <ShieldCheck className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={36} />
            <h3 className="text-4xl font-orbitron font-bold text-slate-900 dark:text-white mb-2">GITM</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === 'ar' ? 'المنظمة الأقوى عالمياً' : 'World\'s Strongest AI Org'}</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
