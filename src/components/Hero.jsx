import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../translations/LanguageContext';

const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
};

const bgImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531297172867-4f50fcc2cb26?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
];

export default function Hero() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  
  const [titleIndex, setTitleIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Dynamically load titles from translation dictionary
  const rawTitles = t('hero.titles');
  const titles = useMemo(() => Array.isArray(rawTitles) ? rawTitles : [rawTitles], [rawTitles]);

  useEffect(() => {
    if (!titles || titles.length === 0) return;
    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(titleInterval);
  }, [titles]);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000);

    return () => clearInterval(bgInterval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isTouchDevice()) return; // Skip 3D effect on touch devices
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15; 
    const y = (clientY / innerHeight - 0.5) * -15;
    setMousePosition({ x, y });
  }, []);

  return (
    <div 
      className="relative min-h-[85vh] md:min-h-screen flex items-end md:items-center justify-center pt-16 md:pt-20 pb-20 md:pb-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="popLayout">
        <motion.img
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          src={bgImages[bgIndex]}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-gitm-light dark:from-gitm-dark via-transparent to-transparent z-[1]" />
      <div className="absolute inset-0 bg-black/40 z-[2]" />

      <motion.div 
        className="container mx-auto px-4 z-10 perspective-1000"
        animate={isTouchDevice() ? {} : { 
          rotateY: mousePosition.x, 
          rotateX: mousePosition.y 
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      >
        <div className="max-w-5xl mx-auto text-left rtl:text-right md:text-center p-3 md:p-4">
          
          <div className="inline-flex items-center justify-start md:justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-100 font-bold text-xs md:text-sm mb-4 md:mb-6 border border-blue-400/30 shadow-lg">
            <Globe size={16} className="md:w-[18px] md:h-[18px]" />
            {t('hero.tagline')}
          </div>

          <div className="h-28 sm:h-36 md:h-48 flex items-end md:items-center justify-start md:justify-center mb-3 md:mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-tight"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              >
                {titles[titleIndex] || ''}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-sm sm:text-base md:text-2xl text-gray-200 max-w-4xl mx-auto mb-6 md:mb-12 leading-relaxed font-semibold drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center justify-start md:justify-center gap-3 md:gap-5">
            <button 
              onClick={() => navigate('/projects-hub')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:-translate-y-1 active:scale-[0.98]"
            >
              <Cpu size={20} className="md:w-[22px] md:h-[22px]" />
              {t('hero.ctaPrimary')}
              <ArrowRight size={18} className={`md:w-5 md:h-5 ${lang === 'ar' || lang === 'tzm' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-sm border border-white/20 hover:-translate-y-1 active:scale-[0.98]"
            >
              {t('hero.ctaSecondary')}
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
