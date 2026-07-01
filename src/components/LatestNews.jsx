import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LatestNews = () => {
  const { lang, news } = useLanguage();
  const navigate = useNavigate();

  const mockNews = [
    { id: '1', title: 'إطلاق برنامج التدريب الصيفي', title_ar: 'إطلاق برنامج التدريب الصيفي', title_en: 'Summer Training Program Launch', summary: 'نعلن عن بدء التسجيل في برنامجنا الصيفي...', date: '2026-06-25', category: 'Training', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800' },
    { id: '2', title: 'شراكة جديدة مع جامعة رائدة', title_ar: 'شراكة جديدة مع جامعة رائدة', title_en: 'New Partnership with Leading University', summary: 'تم توقيع اتفاقية شراكة استراتيجية لتبادل الخبرات...', date: '2026-06-18', category: 'Partnership', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800' },
    { id: '3', title: 'نجاح باهر لفعالية الهاكاثون', title_ar: 'نجاح باهر لفعالية الهاكاثون', title_en: 'Huge Success for Hackathon Event', summary: 'اختتام فعاليات الهاكاثون الوطني بمشاركة واسعة...', date: '2026-06-10', category: 'Events', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' }
  ];

  const sourceNews = (news && news.length > 0) ? news : mockNews;

  const officialNews = sourceNews
    .filter(item => !item.id || item.type === 'official' || item.id.toString().startsWith('gitm-') || typeof item.id === 'string')
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officialNews.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={item.id || index} 
              className="glass-card card-3d group cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all duration-500 border border-slate-200 dark:border-slate-700/50 hover:border-teal-500/50"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-6xl">
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent z-10" />
                <div className="group-hover:scale-110 transition-transform duration-700 relative z-0 flex items-center justify-center w-full h-full">
                  {item.image ? <img src={item.image} alt="news" className="w-full h-full object-cover" /> : '📰'}
                </div>
              </div>
              <div className="p-6 relative z-20">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-teal-500 dark:text-teal-400" /> {item.date}</span>
                  <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis"><Tag size={12} /> {item.category || item.category?.en || 'News'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 font-orbitron group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-2">
                  {item.title_ar || item.title_en || item.title?.en || item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
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
