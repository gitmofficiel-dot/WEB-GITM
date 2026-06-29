import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Github, ExternalLink, Cpu, Database, Layers, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({
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
  }, []);

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const getIcon = (iconName) => {
    if (typeof iconName === 'string') {
      const IconComp = ICON_MAP[iconName] || Code;
      return <IconComp className="w-8 h-8 text-teal-400" />;
    }
    return iconName || <Code className="w-8 h-8 text-teal-400" />;
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
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'استكشف المشاريع المفتوحة المصدر والمبادرات التقنية التي يطورها أعضاء مجتمعنا.' : 
             lang === 'fr' ? 'Explorez les projets open-source et les initiatives technologiques développées par les membres de notre communauté.' : 
             'Explore open-source projects and tech initiatives developed by our community members.'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card card-3d hover-lift rounded-2xl overflow-hidden flex flex-col border border-slate-700/50 hover:border-teal-500/50 group"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <a href={proj.github || '#'} className="p-3 bg-slate-800 rounded-full hover:bg-teal-500 text-white transition-colors">
                        <Github className="w-6 h-6" />
                      </a>
                      <a href={proj.link || '#'} className="p-3 bg-slate-800 rounded-full hover:bg-teal-500 text-white transition-colors">
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                  <img src={proj.imageUrl || proj.image} alt="Project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 z-0 bg-slate-900/90 p-2 rounded-xl border border-slate-700 shadow-lg">
                    {getIcon(proj.icon)}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow bg-slate-900/50">
                  <h3 className="text-xl font-bold text-white mb-3 font-orbitron group-hover:text-teal-300 transition-colors">
                    {getLocalized(proj, 'title', lang)}
                  </h3>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    {getLocalized(proj, 'description', lang)}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">
                    {proj.tech && proj.tech.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
