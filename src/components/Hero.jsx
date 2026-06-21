import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Globe, Zap, Users, ShieldCheck, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ setView }) {
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        
        {/* Verification / Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md"
        >
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-300">
            {lang === 'ar' ? 'المنظومة المغربية الرائدة في الابتكار التكنولوجي' : 'The Leading Moroccan Ecosystem for Tech Innovation'}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 mb-6 leading-tight"
        >
          {lang === 'ar' ? 'نصنع أنظمة ذكية' : 'We Engineer Smart Systems'}<br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            {lang === 'ar' ? 'تعيد تعريف المستقبل' : 'That Redefine The Future'}
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
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
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button 
            onClick={() => setView('tech-projects')}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1"
          >
            <Zap size={20} className="group-hover:animate-pulse" />
            {lang === 'ar' ? 'استكشف مشاريعنا' : 'Explore Projects'}
          </button>
          <button 
            onClick={() => setView('academy')}
            className="group px-8 py-4 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 hover:bg-slate-800 font-bold text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1 backdrop-blur-sm"
          >
            <Globe size={20} />
            {lang === 'ar' ? 'بوابة الأكاديمية' : 'Academy Portal'}
            <ChevronRight size={20} className={`group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </motion.div>

        {/* Strategic Metrics (Real functional goals from PresidentDashboard) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center border-t-2 border-cyan-500/50">
            <Users className="text-cyan-400 mb-3" size={32} />
            <h3 className="text-4xl font-bold text-white mb-2">6,000<span className="text-lg text-slate-500">/10k</span></h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'طالب مستهدف بحلول 2028' : 'Target Talents by 2028'}</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center border-t-2 border-blue-500/50">
            <Target className="text-blue-400 mb-3" size={32} />
            <h3 className="text-4xl font-bold text-white mb-2">100%</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'أنظمة مغربية مستقلة' : 'Sovereign Moroccan Systems'}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col items-center border-t-2 border-purple-500/50">
            <ShieldCheck className="text-purple-400 mb-3" size={32} />
            <h3 className="text-4xl font-bold text-white mb-2">5</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'شراكات أكاديمية وطنية' : 'National Academic Partners'}</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
