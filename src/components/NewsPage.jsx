import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ChevronRight, User, Hash, Loader2, Globe, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

export default function NewsPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('local');
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Global News Fetch
  useEffect(() => {
    const fetchGlobalNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
        if (!apiKey) return;
        const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=${lang === 'ar' ? 'ar' : 'en'}&apikey=${apiKey}`);
        const data = await res.json();
        if (data && data.articles) {
          setGlobalNews(data.articles);
        }
      } catch (error) {
        console.error('Error fetching global news:', error);
      }
    };
    fetchGlobalNews();
  }, [lang]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedNews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNewsList(fetchedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const emptyMessage = {
    en: 'No news available at the moment.',
    fr: 'Aucune actualité disponible pour le moment.',
    ar: 'لا توجد أخبار متاحة في الوقت الحالي.'
  };

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const activeNewsSource = activeTab === 'local' ? newsList : globalNews;

  const filteredNews = activeNewsSource.filter(news => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    if (activeTab === 'local') {
      const title = getLocalized(news, 'title', lang).toLowerCase();
      const summary = getLocalized(news, 'summary', lang).toLowerCase();
      const category = (news.category || '').toLowerCase();
      return title.includes(q) || summary.includes(q) || category.includes(q);
    } else {
      const title = (news.title || '').toLowerCase();
      const summary = (news.description || '').toLowerCase();
      return title.includes(q) || summary.includes(q);
    }
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen grid-bg py-24 px-6 md:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-teal-500/30 mb-6"
          >
            <Newspaper className="w-5 h-5 text-teal-400" />
            <span className="font-orbitron text-teal-300 font-medium tracking-wide">
              {lang === 'ar' ? 'الأخبار والتحديثات' : lang === 'fr' ? 'Actualités' : 'News & Updates'}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-orbitron gradient-text"
          >
            {lang === 'ar' ? 'أحدث الإعلانات' : lang === 'fr' ? 'Dernières Annonces' : 'Latest Announcements'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'ابق على اطلاع بآخر أخبار التكنولوجيا والشراكات وإنجازات فريقنا في المغرب.' : 
             lang === 'fr' ? 'Restez informé de nos dernières actualités technologiques, partenariats et réalisations au Maroc.' : 
             'Stay updated with our latest tech news, partnerships, and achievements in Morocco.'}
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/ dark:bg-slate-900/ backdrop-blur-md p-1 rounded-2xl inline-flex border border-slate-200/ dark:border-slate-700/">
            <button
              onClick={() => { setActiveTab('local'); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'local' 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <MapPin className="w-5 h-5" />
              {lang === 'ar' ? 'أخبار GITM المحلية' : 'Local GITM News'}
            </button>
            <button
              onClick={() => { setActiveTab('global'); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'global' 
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <Globe className="w-5 h-5" />
              {lang === 'ar' ? 'الأخبار التقنية العالمية' : 'Global Tech News'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar 
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder={lang === 'ar' ? 'ابحث في الأخبار...' : 'Search news...'}
          />
        </div>

        {/* News Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : currentNews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className={`grid gap-8 ${activeTab === 'local' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-5xl mx-auto'}`}>
              {currentNews.map((news, index) => {
                if (activeTab === 'local') {
                  // Interactive Square Card Design for Local News
                  return (
                    <motion.div 
                      key={news.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                      className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700/50 hover:border-teal-500/50 shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all bg-white dark:bg-slate-900"
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      {/* Background Image */}
                      <img 
                        src={news.imageUrl || news.image || 'https://via.placeholder.com/600x600?text=GITM+News'} 
                        alt="news" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        {/* Top Meta */}
                        <div className="flex justify-between items-start">
                          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xl">
                            <Hash className="w-3 h-3 text-teal-300" />
                            <span className="text-xs font-bold text-white shadow-sm">
                              {news.category || 'News'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-teal-400"/> 
                              {news.date}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-teal-400"/> 
                              {news.author}
                            </span>
                          </div>
                          
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-orbitron line-clamp-2 group-hover:text-teal-300 transition-colors drop-shadow-md">
                            {getLocalized(news, 'title', lang)}
                          </h2>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden sm:block">
                            {getLocalized(news, 'summary', lang)}
                          </p>

                          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                            <span className="text-teal-300 font-bold text-sm">
                              {lang === 'ar' ? 'اقرأ المزيد' : lang === 'fr' ? 'Lire la suite' : 'Read Article'}
                            </span>
                            <ChevronRight className={`w-5 h-5 text-teal-300 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Global News Design (Wide Rows)
                return (
                  <motion.div 
                    key={news.url || index}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                    className="glass-card hover-lift card-3d p-1 rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700/50 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all bg-white dark:bg-slate-900"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 h-full">
                      <div className="w-full md:w-1/3 h-48 md:h-auto rounded-xl overflow-hidden relative shrink-0">
                        <img 
                          src={news.image || 'https://via.placeholder.com/600x400?text=Global+News'} 
                          alt="news" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1 shadow-md">
                          <Hash className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                            {news.source?.name}
                          </span>
                        </div>
                      </div>
                      <div className="w-full md:w-2/3 flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 font-orbitron transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-300">
                            {news.title}
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                            {news.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-slate-200 dark:border-slate-700/50 pt-4">
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-4 h-4 text-purple-500"/> 
                              {new Date(news.publishedAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US')}
                            </span>
                          </div>
                          
                          <a 
                            href={news.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold transition-colors"
                          >
                            {lang === 'ar' ? 'اقرأ من المصدر' : lang === 'fr' ? 'Lire la source' : 'Read Source'}
                            <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
