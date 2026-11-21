import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const isTouchOrMobile = () => {
  if (typeof window === 'undefined') return true;
  return (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

const bgImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
];

export default function Hero() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [titleIndex, setTitleIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const tagline = String(t('hero.tagline') || '').trim();
  const subtitle = String(t('hero.subtitle') || '').trim();
  const rawTitles = t('hero.titles');

  const titles = useMemo(() => {
    const baseList = (Array.isArray(rawTitles) ? rawTitles : [rawTitles])
      .map((item) => String(item || '').trim())
      .filter(Boolean);
    const filtered = baseList.filter((item) => item !== subtitle && item !== tagline);
    return filtered.length > 0 ? filtered : baseList;
  }, [rawTitles, subtitle, tagline]);

  const validBgIndices = useMemo(
    () => bgImages.map((_, i) => i).filter((i) => !failedImages.includes(i)),
    [failedImages]
  );

  useEffect(() => {
    setTitleIndex(0);
  }, [titles]);

  useEffect(() => {
    if (!titles || titles.length <= 1) return;
    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(titleInterval);
  }, [titles]);

  useEffect(() => {
    if (validBgIndices.length <= 1) return;
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => {
        const currentPos = validBgIndices.indexOf(prev);
        const nextPos = currentPos === -1 ? 0 : (currentPos + 1) % validBgIndices.length;
        return validBgIndices[nextPos];
      });
    }, 8000);

    return () => clearInterval(bgInterval);
  }, [validBgIndices]);

  const handleImageError = useCallback((failedIdx) => {
    setFailedImages((prev) => {
      if (prev.includes(failedIdx)) return prev;
      const nextFailed = [...prev, failedIdx];
      const nextValid = bgImages.findIndex((_, i) => !nextFailed.includes(i));
      if (nextValid !== -1) {
        setBgIndex(nextValid);
      }
      return nextFailed;
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isTouchOrMobile()) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15;
    const y = (clientY / innerHeight - 0.5) * -15;
    setMousePosition({ x, y });
  }, []);

  const activeBgSrc = validBgIndices.includes(bgIndex) ? bgImages[bgIndex] : null;
  const currentTitle = titles[titleIndex % Math.max(titles.length, 1)] || '';

  return (
    <div
      className="relative w-full max-w-full min-h-[60svh] md:min-h-screen flex items-center justify-center pt-20 md:pt-20 pb-10 md:pb-0 overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B132B] to-slate-900"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="popLayout">
        {activeBgSrc && (
          <motion.img
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={activeBgSrc}
            alt=""
            onError={() => handleImageError(bgIndex)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-gitm-light dark:from-gitm-dark via-black/30 to-black/35 z-[1]" />
      <div className="absolute inset-0 bg-black/35 z-[2]" />

      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 min-w-0 md:perspective-1000"
        animate={isTouchOrMobile() ? { rotateY: 0, rotateX: 0 } : {
          rotateY: mousePosition.x,
          rotateX: mousePosition.y
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      >
        <div className="w-full max-w-5xl min-w-0 mx-auto text-start md:text-center md:p-4 flex flex-col items-start md:items-center">

          {/* Tagline Badge */}
          {tagline && (
            <div className="inline-flex items-center justify-start md:justify-center gap-2 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-900/70 backdrop-blur-md text-blue-100 font-bold text-xs md:text-sm mb-3 md:mb-6 border border-blue-400/40 shadow-lg max-w-full">
              <Globe size={15} className="shrink-0 md:w-[18px] md:h-[18px]" />
              <span className="truncate">{tagline}</span>
            </div>
          )}

          {/* Main Headline */}
          <div className="w-full min-w-0 min-h-[3.5rem] sm:min-h-[6rem] md:min-h-[12rem] flex items-center justify-start md:justify-center mb-3 md:mb-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={`${titleIndex}-${currentTitle}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="w-full text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-tight md:leading-snug break-words"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.55)' }}
              >
                {currentTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          {subtitle && (
            <p className="w-full text-sm sm:text-base md:text-2xl text-slate-100 max-w-4xl md:mx-auto mb-5 md:mb-12 leading-relaxed font-semibold drop-shadow-lg break-words">
              {subtitle}
            </p>
          )}

          {/* Stacked Full-Width CTAs on Mobile (>=48px, zero right-edge clipping), Inline on Tablet/Desktop */}
          <div className="w-full max-w-full min-w-0 flex flex-col sm:flex-row items-stretch md:items-center justify-start md:justify-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => navigate('/projects-hub')}
              className="w-full max-w-full min-w-0 sm:w-auto min-h-[48px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Cpu size={20} className="md:w-[22px] md:h-[22px] shrink-0" />
              <span className="truncate">{t('hero.ctaPrimary')}</span>
              <ArrowRight size={18} className={`shrink-0 md:w-5 md:h-5 ${lang === 'ar' || lang === 'tzm' ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/about-us')}
              className="w-full max-w-full min-w-0 sm:w-auto min-h-[48px] bg-slate-900/85 hover:bg-slate-900 active:bg-slate-950 dark:bg-white/15 dark:hover:bg-white/25 dark:active:bg-white/30 backdrop-blur-md text-white px-4 sm:px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-md border border-white/25 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="truncate">{t('hero.ctaSecondary')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
