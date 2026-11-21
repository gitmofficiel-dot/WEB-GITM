import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
    if (isTouchDevice()) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15;
    const y = (clientY / innerHeight - 0.5) * -15;
    setMousePosition({ x, y });
  }, []);

  return (
    <div
      className="relative min-h-[78vh] md:min-h-screen flex items-end md:items-center justify-center pt-24 md:pt-20 pb-12 md:pb-0 overflow-hidden"
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
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-gitm-light dark:from-gitm-dark via-black/30 to-black/35 z-[1]" />
      <div className="absolute inset-0 bg-black/35 z-[2]" />

      <motion.div
        className="container mx-auto px-4 z-10 perspective-1000"
        animate={isTouchDevice() ? {} : {
          rotateY: mousePosition.x,
          rotateX: mousePosition.y
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      >
        <div className="max-w-5xl mx-auto text-left rtl:text-right md:text-center px-1 sm:px-3 md:p-4 flex flex-col items-start md:items-center">

          {/* Tagline Badge — clearly separated from H1 to prevent overlap */}
          <div className="inline-flex items-center justify-start md:justify-center gap-2 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-900/70 backdrop-blur-md text-blue-100 font-bold text-xs md:text-sm mb-4 md:mb-6 border border-blue-400/40 shadow-lg max-w-full">
            <Globe size={15} className="shrink-0 md:w-[18px] md:h-[18px]" />
            <span className="truncate">{t('hero.tagline')}</span>
          </div>

          {/* Main Headline — immediate display, readable 24–28px on mobile */}
          <div className="w-full min-h-[4.5rem] sm:min-h-[7rem] md:min-h-[12rem] flex items-center justify-start md:justify-center mb-3 md:mb-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={titleIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-tight md:leading-snug break-words"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.55)' }}
              >
                {titles[titleIndex] || ''}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-sm sm:text-base md:text-2xl text-slate-100 max-w-4xl md:mx-auto mb-6 md:mb-12 leading-relaxed font-semibold drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          {/* Stacked Full-Width CTAs on Mobile (>=48px), Inline on Tablet/Desktop */}
          <div className="w-full flex flex-col sm:flex-row items-stretch md:items-center justify-start md:justify-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => navigate('/projects-hub')}
              className="w-full sm:w-auto min-h-[48px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Cpu size={20} className="md:w-[22px] md:h-[22px] shrink-0" />
              <span>{t('hero.ctaPrimary')}</span>
              <ArrowRight size={18} className={`shrink-0 md:w-5 md:h-5 ${lang === 'ar' || lang === 'tzm' ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="w-full sm:w-auto min-h-[48px] bg-slate-900/85 hover:bg-slate-900 active:bg-slate-950 dark:bg-white/15 dark:hover:bg-white/25 dark:active:bg-white/30 backdrop-blur-md text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-md border border-white/25 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>{t('hero.ctaSecondary')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
