import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar as CalendarIcon, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';
import AutomaticContent from './AutomaticContent';

const NewsCoverImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/20 dark:from-teal-950/60 dark:via-slate-800 dark:to-cyan-950/50">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-teal-700 dark:text-cyan-300">
          <div className="w-12 h-12 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-teal-200/70 dark:border-cyan-500/30">
            <Newspaper size={26} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function NewsPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (l === 'ar' && obj[`${field}Ar`]) return obj[`${field}Ar`];
    if (l === 'en' && obj[`${field}En`]) return obj[`${field}En`];
    if (l === 'fr' && obj[`${field}Fr`]) return obj[`${field}Fr`];
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const activeNewsList = newsList;

  const filteredNews = activeNewsList.filter(news => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = getLocalized(news, 'title', lang).toLowerCase();
    return title.includes(q);
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="text-start md:text-center max-w-3xl mx-auto mb-6 md:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
          {lang === 'ar' ? 'أحدث الإعلانات والأخبار' : 'Latest Announcements & News'}
        </h1>
        <div className="w-20 md:w-24 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 md:mx-auto mb-4 md:mb-6 rounded-full" />
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
          {lang === 'ar'
            ? 'ابق على اطلاع بآخر أخبار التكنولوجيا والشراكات وإنجازات فريقنا.'
            : 'Stay updated with our latest tech news, partnerships, and achievements.'}
        </p>
      </div>

      <AutomaticContent kind="news" />

      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
        {lang === 'ar' ? 'أخبار GITM' : 'GITM News'}
      </h2>

      <div className="max-w-2xl mx-auto mb-6 md:mb-10">
        <SearchBar
          onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={lang === 'ar' ? 'ابحث في الأخبار...' : 'Search news...'}
        />
      </div>

      {/* Grid — 16:9 Skeleton while loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 md:p-6 space-y-3">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : currentNews.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-70" />
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
            {lang === 'ar' ? 'لا توجد أخبار مطابقة.' : 'No news found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-8 md:gap-10 items-center">
          <div className="max-w-6xl w-full mx-auto">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <AnimatePresence>
                {currentNews.map((news) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    key={news.id}
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="group flex flex-col w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl hover:shadow-cyan-500/15 hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/50"
                  >
                    {/* 16:9 Cover Image with Unified Fallback & Skeleton */}
                    <NewsCoverImage
                      src={news.imageUrl || news.image}
                      alt={getLocalized(news, 'title', lang)}
                    />

                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                      {/* Source & Date separated cleanly above title */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-semibold text-teal-700 dark:text-cyan-400">
                          <CalendarIcon size={14} className="shrink-0" />
                          <span>{news.date || 'TBA'}</span>
                        </div>
                        {news.source && (
                          <span className="font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full">
                            {news.source}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 break-words group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {getLocalized(news, 'title', lang)}
                      </h3>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {totalPages > 1 && (
            <div className="mt-2 flex justify-center">
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
