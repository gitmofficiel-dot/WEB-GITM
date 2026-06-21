import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, Tag, ChevronRight, Pin, Bookmark, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TechNewsWidget from './TechNewsWidget';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const CATEGORIES = ['All', 'Technology', 'Events', 'Academy', 'Partners'];

import { useNavigate } from 'react-router-dom';

export default function NewsPage() {
  const navigate = useNavigate();
  const { lang, news, savedItems, toggleSave } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredNews = news.filter(item => {
    const matchCat = category === 'All' || item.category === category || item.category.toLowerCase() === category.toLowerCase();
    const matchSearch = 
      (item.title_en && item.title_en.toLowerCase().includes(search.toLowerCase())) || 
      (item.title_ar && item.title_ar.includes(search)) ||
      (item.summary_en && item.summary_en.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featuredNews = filteredNews.find(n => n.pinned || n.featured);
  const regularNews = filteredNews.filter(n => !(n.pinned || n.featured)).slice(0, visibleCount);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'Latest News', 'آخر الأخبار', 'Dernières Nouvelles', '最新新闻')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Stay updated with the latest innovations, events, and milestones from GITM.', 'ابق على اطلاع بأحدث الابتكارات والأحداث والإنجازات من المجموعة.', 'Restez au courant des dernières innovations, événements et étapes du GITM.', '随时了解GITM的最新创新、活动和里程碑。')}
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCategory(cat); setVisibleCount(5); }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${category === cat ? 'bg-teal-600 dark:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'glass-card hover-lift'}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={txt(lang, 'Search news...', 'ابحث في الأخبار...', 'Rechercher...', '搜索新闻...')}
              className="w-full glass-card py-3 px-12 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-500 text-[#1e3a5f] dark:text-white"
            />
            <Search className={`absolute top-3 ${lang === 'ar' ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
          </div>
        </div>

        {/* Global Tech News Widget */}
        <div className="mb-12">
          <TechNewsWidget />
        </div>

        {/* Featured News */}
        <AnimatePresence mode="wait">
          {featuredNews && category === 'All' && !search && (() => {
            const isSaved = savedItems?.news?.some(n => n.id === featuredNews.id);
            return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-16 card-3d glass-card rounded-3xl overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row h-full">
                <div className={`lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-teal-500 to-emerald-600 relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <Pin className="text-white w-20 h-20 opacity-50 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 glass px-4 py-1 rounded-full text-white font-bold text-sm flex items-center gap-2">
                    <Pin size={14} /> {txt(lang, 'Featured', 'مميز', 'En vedette', '精选')}
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-teal-600 dark:text-cyan-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={16}/> {featuredNews.date}</span>
                      <span className="flex items-center gap-1"><Tag size={16}/> {featuredNews.category}</span>
                    </div>
                    <button 
                      onClick={() => toggleSave('news', featuredNews)}
                      className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'bg-cyan-100 text-slate-400 hover:bg-cyan-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                    >
                      <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold w-fit">
                    <ShieldCheck size={14} /> {txt(lang, 'Official GITM News', 'خبر رسمي - فريق GITM', 'Officiel GITM', '官方GITM新闻')}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">
                    {lang === 'ar' ? featuredNews.title_ar : featuredNews.title_en}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 line-clamp-3">
                    {lang === 'ar' ? featuredNews.summary_ar : featuredNews.summary_en}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-cyan-200 dark:bg-slate-700 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="font-medium">{featuredNews.author}</span>
                    </div>
                    <button onClick={() => navigate(`/news/${featuredNews.id}`)} className="btn-primary rounded-full px-6 py-2 flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(13,148,136,0.6)] dark:group-hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all">
                      {txt(lang, 'Read More', 'اقرأ المزيد', 'Lire la suite', '阅读更多')} <ChevronRight size={18} className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )})}
        </AnimatePresence>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {regularNews.map((item, idx) => {
              const isSaved = savedItems?.news?.some(n => n.id === item.id);
              return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-3d glass-card rounded-2xl overflow-hidden flex flex-col group relative"
              >
                <div className={`h-32 bg-gradient-to-tr from-blue-500 to-cyan-600 relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500" />
                  <div className="glass px-3 py-1 rounded-full absolute top-4 right-4 text-white text-xs font-bold tracking-wider">
                    {item.category}
                  </div>
                  <div className="glass px-3 py-1 rounded-full absolute top-4 left-4 text-white text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> {txt(lang, 'Official', 'رسمي', 'Officiel', '官方')}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                      <span className="flex items-center gap-1"><User size={14}/> {item.author}</span>
                    </div>
                    <button 
                      onClick={() => toggleSave('news', item)}
                      className={`p-1.5 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-cyan-200 dark:hover:bg-slate-700'}`}
                    >
                      <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-3 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {lang === 'ar' ? item.title_ar : item.title_en}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow line-clamp-3">
                    {lang === 'ar' ? item.summary_ar : item.summary_en}
                  </p>
                  <button onClick={() => navigate(`/news/${item.id}`)} className="text-teal-600 dark:text-cyan-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto self-start">
                    {txt(lang, 'Read Article', 'اقرأ المقال', 'Lire l\'article', '阅读文章')} <ChevronRight size={16} className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {regularNews.length < filteredNews.filter(n => !n.featured).length && (
          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="btn-glass px-8 py-3 rounded-full font-orbitron tracking-widest text-sm uppercase"
            >
              {txt(lang, 'Load More', 'تحميل المزيد', 'Charger plus', '加载更多')}
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
}
