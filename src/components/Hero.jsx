import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Users, Code } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WeatherWidget from './WeatherWidget';
import CurrencyWidget from './CurrencyWidget';

const Hero = ({ setView }) => {
  const { lang, t } = useLanguage();
  
  const heading = lang === 'ar' ? 'نصنع أنظمة ذكية تعيد تعريف المستقبل' : lang === 'fr' ? 'Nous concevons des systèmes intelligents qui redéfinissent l\'avenir' : 'We Engineer Smart Systems That Redefine The Future';
  const subtitle = lang === 'ar' ? 'مجموعة الابتكار التكنولوجي المغربية - ريادة وإبداع' : 'Moroccan Technological Innovation Group - Leadership and Creativity';
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#e0fcfc] dark:bg-gray-900 pt-20">
      {/* Background Particles placeholder */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-orbitron mb-6 gradient-text text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-cyan-400 dark:to-green-400"
          >
            {heading}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10"
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <button 
              onClick={() => setView && setView('projects')}
              className="btn-primary px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-semibold transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              {lang === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'} <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setView && setView('contact')}
              className="btn-glass px-8 py-3 rounded-full bg-[#e0fcfc]/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white font-semibold transition-all flex items-center justify-center"
            >
              {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-stretch gap-6 mb-16 max-w-2xl mx-auto"
          >
            <div className="flex-1">
              <WeatherWidget />
            </div>
            <div className="flex-1">
              <CurrencyWidget />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: <Activity className="text-emerald-500" />, count: '3', label: lang === 'ar' ? 'أقسام هندسية' : 'Engineering Divisions' },
              { icon: <Code className="text-cyan-500" />, count: '12+', label: lang === 'ar' ? 'مشاريع نشطة' : 'Active Projects' },
              { icon: <Users className="text-green-500" />, count: '25+', label: lang === 'ar' ? 'أعضاء الفريق' : 'Team Members' },
            ].map((stat, i) => (
              <div key={i} className="glass-card card-3d p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 hover-lift text-center">
                <div className="flex justify-center mb-3 text-3xl">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold font-orbitron text-[#0B132B] dark:text-white mb-1">{stat.count}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
