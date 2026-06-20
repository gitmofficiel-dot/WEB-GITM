import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LatestNews = ({ setView }) => {
  const { lang, news } = useLanguage();

  const officialNews = (news || [])
    .filter(item => !item.id || item.type === 'official' || item.id.toString().startsWith('gitm-'))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-gray-900 dark:text-white mb-2">
              {lang === 'ar' ? 'آخر الأخبار' : 'Latest News'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </div>
          <button 
            onClick={() => setView && setView('news')}
            className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            {lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officialNews.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={item.id || index} 
              className="glass-card card-3d group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {item.image || '📰'}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-cyan-400 bg-emerald-50 dark:bg-cyan-900/30 px-2 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis"><Tag size={12} /> {item.category || item.category?.en || 'News'}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {item.title_ar || item.title_en || item.title?.en || item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {item.content_ar || item.content_en || item.summary?.en || item.summary || 'Click to read more...'}
                </p>
              </div>
            </motion.div>
          ))}
          {officialNews.length === 0 && (
             <div className="col-span-3 text-center py-8 text-gray-500">
                {lang === 'ar' ? 'لا توجد أخبار رسمية حالياً.' : 'No official news available.'}
             </div>
          )}
        </div>
        
        <button 
          onClick={() => setView && setView('news')}
          className="w-full mt-8 sm:hidden py-3 rounded-xl border-2 border-emerald-500 dark:border-cyan-500 text-emerald-600 dark:text-cyan-400 font-bold flex items-center justify-center gap-2"
        >
          {lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
      </div>
    </section>
  );
};

export default LatestNews;
