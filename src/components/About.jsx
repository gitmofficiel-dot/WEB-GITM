import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, Loader2, Users, Rocket, Activity, Library, ChevronLeft } from 'lucide-react';
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
            vision_ar: 'الريادة في تطوير الذكاء الاصطناعي المغربي وتصديره للعالم، وبناء جسور متينة للإبداع التكنولوجي المبتكر والأكاديمي المتألق.',
            vision_en: 'Leading the development of Moroccan AI and exporting it globally, building strong bridges for innovative tech creativity and academic brilliance.',
            mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية، وتمكينهم من بناء أنظمة ذكية تحل مشاكل واقعية بدعم من المؤسسات الوطنية.',
            mission_en: 'Providing an advanced research environment for Moroccan talents to build smart systems with national support.',
            history_ar: 'تأسست GITM في عام 2024 لتوحيد جهود المهندسين المغاربة. قمنا بتأسيس نادي الألعاب وعقدنا شراكات مع المركز الجهوي للاستثمار.',
            history_en: 'Founded in 2024, GITM unites Moroccan engineers. We established the Gaming Club and partnered with CRI.',
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
      <div className="min-h-screen flex items-center justify-center bg-gitm-light dark:bg-gitm-dark">
        <Loader2 className="w-10 h-10 animate-spin text-gitm-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gitm-light dark:bg-gitm-dark pt-32 pb-24 relative overflow-hidden">
      
      {/* Math & Tech Overlay */}
      <div className="absolute inset-0 bg-math-overlay opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gitm-red/10 text-gitm-red font-bold text-sm mb-6 border border-gitm-red/20">
            {lang === 'ar' ? 'منظمة وطنية ذات رؤية عالمية' : 'National Organization, Global Vision'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gitm-textLight dark:text-white mb-8">
            {lang === 'ar' ? 'نصنع التكنولوجيا من المغرب إلى العالم' : 'Building Tech from Morocco to the World'}
          </h1>
          <p className="text-xl md:text-2xl text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
            {lang === 'ar' 
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول الرقمي بالتعاون مع كبرى المؤسسات وتفتح آفاقاً للشباب المغربي للتألق في الجامعات العالمية.' 
              : 'The Moroccan Group for Technological Innovation (GITM) leads digital transformation and opens horizons for Moroccan youth globally.'}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="tilt-card p-8 group border-t-4 border-gitm-red bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gitm-red/10 flex items-center justify-center text-gitm-red mb-6 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الرؤية العالمية' : 'Global Vision'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="tilt-card p-8 group border-t-4 border-gitm-green bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gitm-green/10 flex items-center justify-center text-gitm-green mb-6 group-hover:scale-110 transition-transform">
              <Flag size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الرسالة الوطنية' : 'National Mission'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="tilt-card p-8 group border-t-4 border-black dark:border-white bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gitm-textLight dark:text-white mb-6 group-hover:scale-110 transition-transform">
              <Library size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الأكاديميات الشريكة' : 'Partner Academies'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.history_ar : aboutData?.history_en}
            </p>
          </motion.div>
        </div>

        {/* Impact Stats */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="tilt-card bg-[#111] border border-gitm-borderDark p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle gradient inside */}
          <div className="absolute inset-0 bg-gradient-to-r from-gitm-red/20 via-transparent to-gitm-green/20 pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 relative z-10">{lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gitm-red/20 rounded-full mb-6">
                <Rocket size={48} className="text-gitm-red" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.founded || '2024'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'الانطلاقة' : 'Launch'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <Activity size={48} className="text-white" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'مشروع ابتكاري' : 'Projects'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gitm-green/20 rounded-full mb-6">
                <Users size={48} className="text-gitm-green" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'عضو أكاديمي' : 'Academic Members'}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
