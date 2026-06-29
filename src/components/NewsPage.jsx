import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ChevronRight, User, Hash, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function NewsPage() {
  const { lang } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

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
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'ابق على اطلاع بآخر أخبار التكنولوجيا والشراكات وإنجازات فريقنا في المغرب.' : 
             lang === 'fr' ? 'Restez informé de nos dernières actualités technologiques, partenariats et réalisations au Maroc.' : 
             'Stay updated with our latest tech news, partnerships, and achievements in Morocco.'}
          </motion.p>
        </div>

        {/* News Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : newsList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <div className="grid gap-8 max-w-5xl mx-auto">
            {newsList.map((news, index) => (
              <motion.div 
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card hover-lift card-3d p-1 rounded-2xl overflow-hidden group border border-slate-700/50 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-slate-900/50">
                  <div className="w-full md:w-1/3 h-48 md:h-auto rounded-xl overflow-hidden relative">
                    <img src={news.imageUrl || news.image} alt="news" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-teal-500/30 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-teal-400" />
                      <span className="text-xs font-medium text-teal-300">{news.category}</span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-3 font-orbitron group-hover:text-teal-300 transition-colors">
                        {getLocalized(news, 'title', lang)}
                      </h2>
                      <p className="text-slate-400 mb-6 line-clamp-3">
                        {getLocalized(news, 'summary', lang)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-slate-700/50 pt-4">
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-teal-500"/> {news.date}</span>
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-teal-500"/> {news.author}</span>
                      </div>
                      <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
                        {lang === 'ar' ? 'اقرأ المزيد' : lang === 'fr' ? 'Lire la suite' : 'Read Article'}
                        <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
