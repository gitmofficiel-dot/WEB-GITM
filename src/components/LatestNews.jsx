import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Newspaper, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NewsCard = ({ item, index, lang, onOpen }) => {
  const [imgError, setImgError] = useState(false);
  const title = lang === 'ar'
    ? (item.title_ar || item.title?.ar || item.title_en || item.title?.en || item.title)
    : (item.title_en || item.title?.en || item.title_ar || item.title?.ar || item.title);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onOpen}
      className="group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* 16:9 Cover Image with Unified Fallback Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/20 dark:from-teal-900/40 dark:via-slate-800 dark:to-cyan-900/40">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-teal-700 dark:text-cyan-300">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-900/70 flex items-center justify-center shadow-sm border border-teal-200/70 dark:border-cyan-500/30">
              <Newspaper size={26} />
            </div>
          </div>
        )}
      </div>

      {/* Card Body — zero overlap between date/badge and title */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        {item.date && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-cyan-400 mb-2">
            <Calendar size={13} className="shrink-0" />
            <span>{item.date}</span>
          </div>
        )}
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 break-words group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
      </div>
    </motion.article>
  );
};

const LatestNews = () => {
  const { lang, news } = useLanguage();
  const navigate = useNavigate();

  const sourceNews = news || [];

  const officialNews = sourceNews
    .filter(item => item.title || item.title_ar || item.title_en)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 4);

  return (
    <section className="py-4 md:py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10 px-0 md:px-4">
        <div className="flex justify-between items-end mb-5 md:mb-10 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-sans tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-400 dark:to-cyan-400 mb-2">
              {lang === 'ar' ? 'آخر الأخبار' : 'Latest News'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
          </div>
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-teal-500/40 text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500 transition-all font-semibold text-sm"
          >
            <span>{lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'}</span>
            <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {officialNews.map((item, index) => (
              <NewsCard
                key={item.id || index}
                item={item}
                index={index}
                lang={lang}
                onOpen={() => navigate(`/news/${item.id}`)}
              />
            ))}
          </AnimatePresence>
          {officialNews.length === 0 && (
            <div className="col-span-full text-center py-6 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 text-sm text-slate-600 dark:text-slate-300">
              {lang === 'ar' ? 'لا توجد أخبار رسمية حالياً.' : 'No official news available.'}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate('/news')}
          className="group w-full min-h-[48px] mt-5 sm:hidden px-6 py-3 rounded-xl border border-teal-600/40 text-teal-700 dark:text-[#00E5FF] hover:bg-teal-50 dark:hover:bg-[#00E5FF]/10 transition-all font-bold text-sm flex items-center justify-center gap-2"
        >
          <span>{lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'}</span>
          <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
      </div>
    </section>
  );
};

export default LatestNews;
