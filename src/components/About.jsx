import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, Loader2, Users, Rocket, Activity } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gitm-light dark:bg-gitm-dark">
        <Loader2 className="w-10 h-10 animate-spin text-gitm-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gitm-light dark:bg-gitm-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gitm-blue/10 dark:bg-gitm-blue/20 text-gitm-blue dark:text-gitm-cyan font-semibold text-sm mb-6">
            {lang === 'ar' ? 'منظمة وطنية رائدة' : 'Leading National Organization'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gitm-textLight dark:text-white mb-6">
            {lang === 'ar' ? 'نصنع مستقبل التكنولوجيا في المغرب' : 'Shaping the Future of Tech in Morocco'}
          </h1>
          <p className="text-xl text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
            {lang === 'ar' 
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول التكنولوجي وتصنع مستقبل الذكاء الاصطناعي من خلال الابتكار والتعاون المشترك.' 
              : 'The Moroccan Group for Technological Innovation (GITM) leads tech transformation and shapes the future of AI through innovation and collaboration.'}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="soft-card p-8 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gitm-blue to-gitm-cyan flex items-center justify-center text-white mb-6 shadow-lg shadow-gitm-cyan/30">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
              {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="soft-card p-8 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/30">
              <Flag size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
              {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="soft-card p-8 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30">
              <History size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'تاريخنا' : 'History'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
              {lang === 'ar' ? aboutData?.history_ar : aboutData?.history_en}
            </p>
          </motion.div>
        </div>

        {/* Impact Stats */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="soft-card bg-gradient-to-br from-gitm-cardLight to-slate-50 dark:from-gitm-cardDark dark:to-[#0b101e] p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gitm-textLight dark:text-white mb-12">{lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <Rocket size={40} className="text-gitm-cyan mb-4" />
              <span className="text-5xl font-bold text-gitm-textLight dark:text-white mb-2">{aboutData?.stats?.founded || '2024'}</span>
              <span className="text-lg text-gitm-mutedLight dark:text-gitm-mutedDark font-medium">{lang === 'ar' ? 'سنة التأسيس' : 'Founded'}</span>
            </div>
            <div className="flex flex-col items-center">
              <Activity size={40} className="text-gitm-blue mb-4" />
              <span className="text-5xl font-bold text-gitm-textLight dark:text-white mb-2">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-lg text-gitm-mutedLight dark:text-gitm-mutedDark font-medium">{lang === 'ar' ? 'مشروع وطني' : 'Projects'}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users size={40} className="text-emerald-500 mb-4" />
              <span className="text-5xl font-bold text-gitm-textLight dark:text-white mb-2">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-lg text-gitm-mutedLight dark:text-gitm-mutedDark font-medium">{lang === 'ar' ? 'عضو نشط' : 'Active Members'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
