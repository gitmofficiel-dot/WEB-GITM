import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Globe, Zap, Users, ShieldCheck, Target, BrainCircuit, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
        {/* Core AI Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        
        {/* AI System Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/ dark:bg-slate-900/ border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer hover:bg-white/ dark:bg-slate-900/ hover:scale-105 transition-all"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20">
            <BrainCircuit size={16} className="text-cyan-400 animate-pulse" />
          </div>
          <span className="text-sm font-bold text-slate-200 tracking-wide font-orbitron">
            {lang === 'ar' ? 'أقوى منظومة ذكاء اصطناعي مغربية' : 'The Most Powerful Moroccan AI Ecosystem'}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-700 dark:from-white dark:via-cyan-100 dark:to-blue-200 mb-6 leading-tight drop-shadow-2xl"
        >
          {lang === 'ar' ? 'نبني أنظمة المستقبل' : 'We Build The Future'}<br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 relative">
            {lang === 'ar' ? 'المدعومة بالذكاء الاصطناعي' : 'Powered by AI'}
            {/* Sparkle effect */}
            <span className="absolute -top-4 -right-8 text-cyan-300 animate-bounce"><Zap size={32}/></span>
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          {lang === 'ar' 
            ? 'مجموعة بحث وتطوير مغربية تسعى لتدريب وتأهيل جيل جديد من المهندسين والمبتكرين في مجالات الذكاء الاصطناعي، الروبوتيك، والأنظمة المدمجة.' 
            : 'A Moroccan R&D group dedicated to training and empowering a new generation of engineers and innovators in AI, Robotics, and Embedded Systems.'}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 mb-24 z-20 relative"
        >
          <button 
            onClick={() => navigate('/projects-hub')}
            className="relative group px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.8)] transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <Activity size={24} className="group-hover:animate-pulse relative z-10" />
            <span className="relative z-10">{lang === 'ar' ? 'استكشف قوة أنظمتنا' : 'Explore Our Power'}</span>
          </button>
          <button 
            onClick={() => navigate('/academy')}
            className="group px-10 py-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white border-2 border-cyan-500/30 hover:border-cyan-400 hover:bg-white dark:hover:bg-slate-50 dark:bg-slate-800 font-bold text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 backdrop-blur-md hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]"
          >
            <Globe size={24} className="text-cyan-600 dark:text-cyan-400" />
            {lang === 'ar' ? 'أكاديمية الذكاء الاصطناعي' : 'AI Academy'}
            <ChevronRight size={24} className={`text-cyan-400 group-hover:translate-x-2 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
          </button>
        </motion.div>

        {/* Strategic Metrics (Real functional goals from PresidentDashboard) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10"
        >
          <div className="glass-card card-3d p-8 rounded-3xl flex flex-col items-center border-t-4 border-cyan-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Users className="text-cyan-400 mb-4" size={40} />
            <h3 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-2">10,000</h3>
            <p className="text-sm font-semibold text-cyan-100 uppercase tracking-wider text-center">{lang === 'ar' ? 'طالب مستهدف بحلول 2028' : 'Target Talents by 2028'}</p>
          </div>
          
          <div className="glass-card card-3d p-8 rounded-3xl flex flex-col items-center border-t-4 border-blue-500 relative overflow-hidden group transform md:-translate-y-4">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Target className="text-blue-400 mb-4" size={40} />
            <h3 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">100%</h3>
            <p className="text-sm font-semibold text-blue-100 uppercase tracking-wider text-center">{lang === 'ar' ? 'أنظمة مغربية مستقلة' : 'Sovereign Moroccan AI'}</p>
          </div>

          <div className="glass-card card-3d p-8 rounded-3xl flex flex-col items-center border-t-4 border-purple-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ShieldCheck className="text-purple-400 mb-4" size={40} />
            <h3 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">GITM</h3>
            <p className="text-sm font-semibold text-purple-100 uppercase tracking-wider text-center">{lang === 'ar' ? 'المنظمة الأقوى عالمياً' : 'World\'s Strongest AI Org'}</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
