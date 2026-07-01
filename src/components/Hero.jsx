import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />

      <div className="container-custom relative z-10 flex flex-col items-center text-center px-4 max-w-6xl">
        
        {/* Subtle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-minimal bg-white/50 dark:bg-black/50 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-[#F97316]" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            {lang === 'ar' ? 'الجيل الجديد من الابتكار' : 'Next-Gen Innovation'}
          </span>
        </motion.div>

        {/* Massive Typography Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold leading-[0.9] tracking-tighter-xl mb-8"
        >
          {lang === 'ar' ? 'نبني تقنيات' : 'Build The'}<br/>
          <span className="text-slate-400 dark:text-slate-600">
            {lang === 'ar' ? 'المستقبل.' : 'Future.'}
          </span>
        </motion.h1>

        {/* Minimal Sub-headline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
        >
          {lang === 'ar' 
            ? 'منظمة مستقلة تجمع نخبة المهندسين المغاربة لتطوير أنظمة الذكاء الاصطناعي والروبوتيك برؤية عالمية.' 
            : 'An independent organization uniting elite Moroccan engineers to develop AI and robotics systems with a global vision.'}
        </motion.p>

        {/* Clean CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => navigate('/projects-hub')}
            className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm"
          >
            {lang === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'}
            <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
          
          <button 
            onClick={() => navigate('/about-us')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border-minimal hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
