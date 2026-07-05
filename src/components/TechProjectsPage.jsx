import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Github, ExternalLink, Cpu, Database, Layers, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ICON_MAP = {
  Database,
  Cpu,
  Layers,
  Code
};

export default function TechProjectsPage() {
  const { lang } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'));
        const querySnapshot = await getDocs(q);
        let fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [lang]);

  const getLocalizedTitle = (proj, l) => {
    if (!proj) return '';
    if (l === 'ar') return proj.titleAr || proj.titleEn || proj.title || '';
    return proj.titleEn || proj.titleAr || proj.title || '';
  };

  const getLocalizedDesc = (proj, l) => {
    if (!proj) return '';
    if (l === 'ar') return proj.descriptionAr || proj.descriptionEn || proj.description || '';
    return proj.descriptionEn || proj.descriptionAr || proj.description || '';
  };

  const emptyMessage = {
    en: 'No tech projects available at the moment.',
    fr: 'Aucun projet tech disponible pour le moment.',
    ar: 'لا توجد مشاريع تقنية متاحة في الوقت الحالي.'
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
            <Code className="w-5 h-5 text-teal-400" />
            <span className="font-orbitron text-teal-300 font-medium tracking-wide">
              {lang === 'ar' ? 'مشاريعنا التقنية' : lang === 'fr' ? 'Nos Projets Tech' : 'Our Tech Projects'}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-orbitron gradient-text"
          >
            {lang === 'ar' ? 'ابتكارات تقود المستقبل' : lang === 'fr' ? 'Des Innovations pour l\'Avenir' : 'Innovations Driving the Future'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'استكشف الأفكار المفتوحة المصدر والمبادرات التقنية التي يطورها أعضاء مجتمعنا.' : 
             lang === 'fr' ? 'Explorez les idées open-source et les initiatives technologiques développées par les membres de notre communauté.' : 
             'Explore open-source ideas and tech initiatives developed by our community members.'}
          </motion.p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <Code className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {projects.map((proj, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={proj.id}
                  onClick={() => navigate(`/project-details/${proj.id}`)}
                  className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <img 
                    src={proj.image || proj.coverImage || proj.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'} 
                    alt={getLocalizedTitle(proj, lang)} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:via-black/50" />
                  
                  {proj.category && (
                    <div className="absolute top-4 right-4 bg-teal-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {proj.category}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {getLocalizedTitle(proj, lang)}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
