import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const { lang } = useLanguage();

  // In a real app, this data would be fetched from a backend, which is managed by PresidentDashboard -> About Us CMS.
  const aboutData = {
    vision_ar: 'الريادة في تطوير الذكاء الاصطناعي المغربي وتصديره للعالم.',
    vision_en: 'Leading the development of Moroccan AI and exporting it to the world.',
    mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية، وتمكينهم من بناء أنظمة ذكية تحل مشاكل واقعية.',
    mission_en: 'Providing an advanced research environment for Moroccan talents to build smart systems.',
    history_ar: 'تأسست GITM في عام 2024 لتوحيد جهود المهندسين المغاربة. قمنا بتدريب المئات وشاركنا في الهاكاثونات الوطنية والدولية بنجاح مبهر.',
    history_en: 'Founded in 2024, GITM unites Moroccan engineers. We have trained hundreds and successfully participated in national and international hackathons.'
  };

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
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
          {lang === 'ar' ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) هي الرائدة في قيادة التحول التكنولوجي.' 
            : 'The Moroccan Group for Technological Innovation (GITM) is leading the tech transformation.'}
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
      >
        {/* Vision Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-cyan-500 relative group overflow-hidden">
          <div className="absolute -right-6 -top-6 text-cyan-500/10 group-hover:scale-110 transition-transform duration-500">
            <Target size={120} />
          </div>
          <Target className="text-cyan-400 mb-6 relative z-10" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10">
            {lang === 'ar' ? aboutData.vision_ar : aboutData.vision_en}
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-blue-500 relative group overflow-hidden">
          <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
            <Flag size={120} />
          </div>
          <Flag className="text-blue-400 mb-6 relative z-10" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10">
            {lang === 'ar' ? aboutData.mission_ar : aboutData.mission_en}
          </p>
        </motion.div>

        {/* History Section */}
        <motion.div variants={itemVariants} className="glass-card p-10 rounded-3xl border-t-4 border-purple-500 md:col-span-2 relative group overflow-hidden">
          <div className="absolute -right-6 -top-6 text-purple-500/10 group-hover:scale-110 transition-transform duration-500">
            <History size={160} />
          </div>
          <History className="text-purple-400 mb-6 relative z-10" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">{lang === 'ar' ? 'تاريخنا وإنجازاتنا' : 'History & Milestones'}</h2>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10 max-w-3xl">
            {lang === 'ar' ? aboutData.history_ar : aboutData.history_en}
          </p>
          <div className="mt-8 flex gap-4 relative z-10">
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl">
              <span className="block text-2xl font-bold text-cyan-400 mb-1">2024</span>
              <span className="text-sm text-slate-400">{lang === 'ar' ? 'سنة التأسيس' : 'Founded'}</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl">
              <span className="block text-2xl font-bold text-blue-400 mb-1">15+</span>
              <span className="text-sm text-slate-400">{lang === 'ar' ? 'مشروع وطني' : 'National Projects'}</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
