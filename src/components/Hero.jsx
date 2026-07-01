import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles, Code2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-gitm-light dark:bg-gitm-dark">
      
      {/* Soft Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gitm-cyan/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gitm-blue/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Corporate Grid Overlay */}
      <div className="absolute inset-0 bg-corporate-grid opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gitm-cardDark/50 backdrop-blur-md border border-gitm-borderLight dark:border-gitm-borderDark shadow-soft mb-8"
          >
            <Sparkles size={16} className="text-gitm-cyan" />
            <span className="text-sm font-semibold text-gitm-textLight dark:text-gitm-textDark">
              {lang === 'ar' ? 'منصة الابتكار التكنولوجي المغربية' : 'Moroccan Tech Innovation Platform'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-gitm-textLight dark:text-white"
          >
            {lang === 'ar' ? 'نبني تقنيات' : 'Build The'}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gitm-blue to-gitm-cyan">
              {lang === 'ar' ? 'المستقبل.' : 'Future.'}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gitm-mutedLight dark:text-gitm-mutedDark max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            {lang === 'ar' 
              ? 'مؤسسة رائدة تجمع نخبة المهندسين لتطوير أنظمة الذكاء الاصطناعي، الروبوتيك، والحلول السحابية المتقدمة برؤية عالمية.' 
              : 'A leading foundation uniting elite engineers to develop AI systems, robotics, and advanced cloud solutions with a global vision.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => navigate('/projects-hub')}
              className="w-full sm:w-auto btn-accent px-8 py-4 flex items-center justify-center gap-2 text-base"
            >
              <Code2 size={20} />
              {lang === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'}
              <ArrowRight size={18} className={`ml-1 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            
            <button 
              onClick={() => navigate('/academy')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-gitm-cardDark text-gitm-textLight dark:text-gitm-textDark font-semibold border border-gitm-borderLight dark:border-gitm-borderDark shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Globe size={20} className="text-gitm-mutedLight dark:text-gitm-mutedDark" />
              {lang === 'ar' ? 'الأكاديمية' : 'The Academy'}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
