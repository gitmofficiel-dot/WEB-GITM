import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function About() {
  const { lang } = useLanguage();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          setAboutData({
            vision_ar: 'الريادة في تطوير الذكاء الاصطناعي المغربي وتصديره للعالم.',
            vision_en: 'Leading the development of Moroccan AI and exporting it to the world.',
            mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية، وتمكينهم من بناء أنظمة ذكية تحل مشاكل واقعية.',
            mission_en: 'Providing an advanced research environment for Moroccan talents to build smart systems.',
            history_ar: 'تأسست GITM في عام 2024 لتوحيد جهود المهندسين المغاربة. قمنا بتدريب المئات وشاركنا في الهاكاثونات الوطنية والدولية بنجاح مبهر.',
            history_en: 'Founded in 2024, GITM unites Moroccan engineers. We have trained hundreds and successfully participated in national and international hackathons.',
            stats: { founded: '2024', projects: '15+', members: '500+' }
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 block">
            {lang === 'ar' ? 'منظمة وطنية رائدة' : 'Leading National Organization'}
          </span>
          <h1 className="text-[4rem] sm:text-[5rem] font-bold leading-none tracking-tighter-xl mb-8">
            {lang === 'ar' ? 'من نحن.' : 'About Us.'}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {lang === 'ar' 
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول التكنولوجي وتصنع مستقبل الذكاء الاصطناعي.' 
              : 'The Moroccan Group for Technological Innovation (GITM) leads tech transformation and shapes the future of AI.'}
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-12"
        >
          <div className="border-minimal p-8 bg-white dark:bg-[#0a0a0a] group">
            <Target className="mb-6 text-slate-400 group-hover:text-[#F97316] transition-colors" size={32} />
            <h2 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
            </p>
          </div>

          <div className="border-minimal p-8 bg-white dark:bg-[#0a0a0a] group">
            <Flag className="mb-6 text-slate-400 group-hover:text-[#F97316] transition-colors" size={32} />
            <h2 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
            </p>
          </div>

          <div className="border-minimal p-8 bg-white dark:bg-[#0a0a0a] group">
            <History className="mb-6 text-slate-400 group-hover:text-[#F97316] transition-colors" size={32} />
            <h2 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'تاريخنا' : 'History'}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {lang === 'ar' ? aboutData?.history_ar : aboutData?.history_en}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 pt-24 border-t border-minimal"
        >
          <h2 className="text-2xl font-bold mb-12">{lang === 'ar' ? 'أرقامنا' : 'Our Impact'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <span className="block text-[3rem] font-bold leading-none tracking-tighter-xl mb-2">{aboutData?.stats?.founded || '2024'}</span>
              <span className="text-sm text-slate-500 font-medium uppercase tracking-widest">{lang === 'ar' ? 'سنة التأسيس' : 'Founded'}</span>
            </div>
            <div>
              <span className="block text-[3rem] font-bold leading-none tracking-tighter-xl mb-2">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-sm text-slate-500 font-medium uppercase tracking-widest">{lang === 'ar' ? 'مشروع وطني' : 'Projects'}</span>
            </div>
            <div>
              <span className="block text-[3rem] font-bold leading-none tracking-tighter-xl mb-2">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-sm text-slate-500 font-medium uppercase tracking-widest">{lang === 'ar' ? 'عضو نشط' : 'Members'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
