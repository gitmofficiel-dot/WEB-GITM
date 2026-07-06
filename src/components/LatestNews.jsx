import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LatestNews = () => {
  const { lang, news } = useLanguage();
  const navigate = useNavigate();

  const sourceNews = news || [];

  const officialNews = sourceNews
    .filter(item => item.title || item.title_ar || item.title_en)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 4);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container-custom relative z-10 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-2 drop-shadow-sm">
              {lang === 'ar' ? 'آخر الأخبار' : 'Latest News'}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
          </div>
          <button 
            onClick={() => navigate('/news')}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500 transition-all font-semibold"
          >
            {lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {officialNews.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={item.id || index}
                onClick={() => navigate(`/news/${item.id}`)}
                className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Background Image */}
                <img 
                  src={item.image || 'https://via.placeholder.com/600x600?text=GITM+News'} 
                  alt={item.title_ar || item.title_en || item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:via-black/50" />
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                    {item.title_ar || item.title_en || item.title?.en || item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {officialNews.length === 0 && (
             <div className="col-span-full text-center py-8 text-gray-500">
                {lang === 'ar' ? 'لا توجد أخبار رسمية حالياً.' : 'No official news available.'}
             </div>
          )}
        </div>
        
        <button            
          onClick={() => navigate('/news')}
          className="group w-full mt-8 sm:hidden px-6 py-3 rounded-xl border border-teal-500/30 text-teal-600 dark:text-[#00E5FF] hover:bg-teal-50 dark:hover:bg-[#00E5FF]/10 transition-all font-semibold flex items-center justify-center gap-2"
        >
          {lang === 'ar' ? 'عرض كل الأخبار' : 'View All News'} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
      </div>
    </section>
  );
};

export default LatestNews;
