import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, ChevronRight, Activity, Users, Globe, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import TeamShowcase from './TeamShowcase';

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
          // Fallback data
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="container-custom py-20 min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-blue-500/30 mb-6">
          <Globe className="w-5 h-5 text-blue-400" />
          <span className="font-orbitron text-blue-300 font-medium tracking-wide uppercase">
            {lang === 'ar' ? 'منظمة وطنية رائدة' : 'Leading National Organization'}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 mb-8 drop-shadow-lg">
          {lang === 'ar' ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {lang === 'ar' 
            ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول التكنولوجي وتصنع مستقبل الذكاء الاصطناعي.' 
            : 'The Moroccan Group for Technological Innovation (GITM) leads tech transformation and shapes the future of AI.'}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10"
        >
        {/* Vision Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-cyan-500 relative group overflow-hidden card-3d">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/40 transition-all duration-700"></div>
          <Target className="text-cyan-400 mb-6 relative z-10" size={56} />
          <h2 className="text-3xl font-bold text-white mb-6 font-orbitron relative z-10">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg relative z-10 font-medium">
            {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-indigo-500 relative group overflow-hidden card-3d">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
          <Flag className="text-indigo-400 mb-6 relative z-10" size={56} />
          <h2 className="text-3xl font-bold text-white mb-6 font-orbitron relative z-10">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg relative z-10 font-medium">
            {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
          </p>
        </motion.div>

        {/* History Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-purple-500 md:col-span-2 lg:col-span-1 relative group overflow-hidden card-3d">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-all duration-700"></div>
          <History className="text-purple-400 mb-6 relative z-10" size={56} />
          <h2 className="text-3xl font-bold text-white mb-6 font-orbitron relative z-10">{lang === 'ar' ? 'تاريخنا' : 'History'}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg relative z-10 font-medium">
            {lang === 'ar' ? aboutData?.history_ar : aboutData?.history_en}
          </p>
        </motion.div>

        {/* Global Impact Stats */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-emerald-500 md:col-span-2 lg:col-span-3 relative group overflow-hidden mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-50"></div>
          <h2 className="text-3xl font-bold text-white mb-10 font-orbitron text-center relative z-10">{lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
              <Zap className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">{aboutData?.stats?.founded || '2024'}</span>
              <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">{lang === 'ar' ? 'سنة التأسيس' : 'Founded'}</span>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
              <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">{lang === 'ar' ? 'مشروع وطني' : 'National Projects'}</span>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">{lang === 'ar' ? 'عضو نشط' : 'Active Members'}</span>
            </div>
          </div>
        </motion.div>

        {/* Meet the Team Showcase */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 mt-16 w-full max-w-[100vw] overflow-hidden -mx-4 px-4">
           <TeamShowcase />
        </motion.div>

      </motion.div>
      )}
    </div>
  );
}
