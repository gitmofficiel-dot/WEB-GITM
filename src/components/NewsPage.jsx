import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, AlertCircle, Loader2, Calendar as CalendarIcon, Globe, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

export default function NewsPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Global News
  const [newsType, setNewsType] = useState('local'); // 'local' or 'global'
  const [globalNews, setGlobalNews] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedNews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetchedNews.length > 0) {
          setNewsList(fetchedNews);
        } else {
          setNewsList([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const fetchGlobalNews = async (query = '"Artificial Intelligence" OR "AI" OR "IoT" OR "Internet of Things"') => {
    if (globalNews.length > 0 && !searchQuery) return;
    setLoadingGlobal(true);
    try {
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
      if (!apiKey) {
        console.warn('GNews API Key missing');
        return;
      }
      const q = searchQuery || query;
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=20&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.articles) {
        const mapped = data.articles.map((art, idx) => ({
          id: `global-${idx}`,
          title_en: art.title,
          title_ar: art.title, // GNews doesn't auto-translate, we just fallback
          date: art.publishedAt ? art.publishedAt.split('T')[0] : 'TBA',
          image: art.image,
          url: art.url,
          source: art.source?.name
        }));
        setGlobalNews(mapped);
      }
    } catch (error) {
      console.error('Error fetching global news:', error);
    } finally {
      setLoadingGlobal(false);
    }
  };

  useEffect(() => {
    if (newsType === 'global') {
      const timeoutId = setTimeout(() => {
        fetchGlobalNews();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [newsType, searchQuery]);

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    // Support new camelCase format (titleAr, titleEn) from SmartArticleEditor
    if (l === 'ar' && obj[`${field}Ar`]) return obj[`${field}Ar`];
    if (l === 'en' && obj[`${field}En`]) return obj[`${field}En`];
    if (l === 'fr' && obj[`${field}Fr`]) return obj[`${field}Fr`];
    
    // Support old snake_case format (title_ar, title_en)
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    
    // Support object format (title: {en: '', ar: ''})
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    
    // Fallback to base field
    return obj[field] || '';
  };

  const activeNewsList = newsType === 'local' ? newsList : globalNews;

  const filteredNews = activeNewsList.filter(news => {
    if (!searchQuery && newsType === 'local') return true;
    if (newsType === 'global') return true; // Handled by API
    const q = searchQuery.toLowerCase();
    const title = getLocalized(news, 'title', lang).toLowerCase();
    return title.includes(q);
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-10 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 md:mb-4">
          {lang === 'ar' ? 'أحدث الإعلانات والأخبار' : 'Latest Announcements & News'}
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {lang === 'ar' 
            ? 'ابق على اطلاع بآخر أخبار التكنولوجيا والشراكات وإنجازات فريقنا.' 
            : 'Stay updated with our latest tech news, partnerships, and achievements.'}
        </p>
      </div>

      {/* Search & Toggle */}
      <div className="max-w-2xl mx-auto mb-8 md:mb-12 flex flex-col items-center gap-4 md:gap-6">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl md:rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => { setNewsType('local'); setCurrentPage(1); setSearchQuery(''); }}
            className={`flex items-center justify-center gap-1.5 md:gap-2 flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${
              newsType === 'local' 
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Home size={16} />
            {lang === 'ar' ? 'أخبار GITM' : 'GITM News'}
          </button>
          <button
            onClick={() => { setNewsType('global'); setCurrentPage(1); setSearchQuery(''); }}
            className={`flex items-center justify-center gap-1.5 md:gap-2 flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${
              newsType === 'global' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Globe size={16} />
            {lang === 'ar' ? 'أخبار عالمية' : 'Global News'}
          </button>
        </div>

        <SearchBar 
          value={searchQuery}
          onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={lang === 'ar' ? 'ابحث في الأخبار...' : 'Search news...'}
        />
      </div>

      {/* Grid */}
      {(newsType === 'local' ? loading : loadingGlobal) ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        </div>
      ) : currentNews.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {lang === 'ar' ? 'لا توجد أخبار مطابقة.' : 'No news found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-10 items-center">
          <div className="max-w-6xl w-full mx-auto">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <AnimatePresence>
              {currentNews.map((news) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={news.id}
                  onClick={() => {
                    if (newsType === 'global' && news.url) {
                      window.open(news.url, '_blank');
                    } else {
                      navigate(`/news/${news.id}`);
                    }
                  }}
                  className="group flex flex-col w-full rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-slate-600"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* Background Image */}
                    <img 
                      src={news.imageUrl || news.image || 'https://via.placeholder.com/600x600?text=GITM+News'} 
                      alt={getLocalized(news, 'title', lang)} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {getLocalized(news, 'title', lang)}
                    </h3>
                    
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-1.5 font-medium"><CalendarIcon size={16} className="text-cyan-500"/> {news.date || 'TBA'}</div>
                       {newsType === 'global' && news.source && (
                         <div className="flex items-center gap-1.5 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs">
                           {news.source}
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
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
  );
}
