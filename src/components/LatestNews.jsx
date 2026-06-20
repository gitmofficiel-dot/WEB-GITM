import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const newsData = [
  {
    id: 1,
    title: { en: 'GITM Launches New AI Lab in Casablanca', ar: 'مجموعة الابتكار تطلق مختبر ذكاء اصطناعي جديد في الدار البيضاء' },
    summary: { en: 'A state-of-the-art facility for artificial intelligence research and development.', ar: 'منشأة حديثة للبحث والتطوير في مجال الذكاء الاصطناعي.' },
    date: '2026-06-15',
    category: { en: 'Technology', ar: 'تكنولوجيا' },
    image: '🤖'
  },
  {
    id: 2,
    title: { en: 'Annual Tech Innovation Summit 2026', ar: 'قمة الابتكار التكنولوجي السنوية 2026' },
    summary: { en: 'Join us for the biggest tech gathering in North Africa this September.', ar: 'انضم إلينا في أكبر تجمع تقني في شمال إفريقيا في سبتمبر.' },
    date: '2026-06-10',
    category: { en: 'Events', ar: 'فعاليات' },
    image: '📅'
  },
  {
    id: 3,
    title: { en: 'First Cohort Graduates from GITM Academy', ar: 'تخرج الدفعة الأولى من أكاديمية مجموعة الابتكار' },
    summary: { en: 'Over 50 students have completed the intensive full-stack development program.', ar: 'أكمل أكثر من 50 طالبًا البرنامج المكثف للتطوير الشامل.' },
    date: '2026-06-05',
    category: { en: 'Academy', ar: 'أكاديمية' },
    image: '🎓'
  }
];

const LatestNews = ({ setView }) => {
  const { lang } = useLanguage();

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
          {newsData.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="glass-card card-3d group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {item.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-cyan-400 bg-emerald-50 dark:bg-cyan-900/30 px-2 py-1 rounded-full"><Tag size={12} /> {item.category[lang] || item.category.en}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {item.title[lang] || item.title.en}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {item.summary[lang] || item.summary.en}
                </p>
              </div>
            </motion.div>
          ))}
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
