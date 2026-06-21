import React from 'react';
import { motion } from 'framer-motion';
import { Code, Github, ExternalLink, Cpu, Database, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MOCK_PROJECTS = [
  {
    id: 1,
    title: { en: 'Moroccan Darija NLP', fr: 'NLP Darija Marocaine', ar: 'معالجة اللغات الطبيعية للدارجة' },
    description: { 
      en: 'An open-source transformer model fine-tuned to understand and generate Moroccan Darija text.',
      fr: 'Un modèle transformer open-source affiné pour comprendre et générer du texte en Darija marocaine.',
      ar: 'نموذج محول مفتوح المصدر تم تحسينه لفهم وإنشاء النصوص بالدارجة المغربية.'
    },
    tech: ['Python', 'PyTorch', 'HuggingFace'],
    icon: <Database className="w-8 h-8 text-teal-400" />,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    github: '#'
  },
  {
    id: 2,
    title: { en: 'Smart Agri-Sense', fr: 'Smart Agri-Sense', ar: 'الاستشعار الزراعي الذكي' },
    description: { 
      en: 'IoT-based soil monitoring system using ESP32 and ML predictions for optimal irrigation in Moroccan farms.',
      fr: 'Système de surveillance du sol basé sur l\'IoT utilisant l\'ESP32 et des prédictions ML pour une irrigation optimale dans les fermes marocaines.',
      ar: 'نظام مراقبة التربة القائم على إنترنت الأشياء باستخدام ESP32 وتوقعات التعلم الآلي للري الأمثل في المزارع المغربية.'
    },
    tech: ['C++', 'React', 'TensorFlow Lite'],
    icon: <Cpu className="w-8 h-8 text-teal-400" />,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80',
    github: '#'
  },
  {
    id: 3,
    title: { en: 'Supply Chain Blockchain', fr: 'Blockchain de la Chaîne d\'Approvisionnement', ar: 'بلوكتشين سلسلة التوريد' },
    description: { 
      en: 'A decentralized application ensuring transparency in the supply chain of Moroccan artisanal goods.',
      fr: 'Une application décentralisée garantissant la transparence dans la chaîne d\'approvisionnement des produits artisanaux marocains.',
      ar: 'تطبيق لامركزي يضمن الشفافية في سلسلة توريد السلع الحرفية المغربية.'
    },
    tech: ['Solidity', 'Next.js', 'Web3.js'],
    icon: <Layers className="w-8 h-8 text-teal-400" />,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    github: '#'
  }
];

export default function TechProjectsPage() {
  const { lang } = useLanguage();

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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROJECTS.map((proj, index) => (
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
                    <a href={proj.github} className="p-3 bg-slate-800 rounded-full hover:bg-teal-500 text-white transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-teal-500 text-white transition-colors">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                <img src={proj.image} alt="Project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 z-0 bg-slate-900/90 p-2 rounded-xl border border-slate-700 shadow-lg">
                  {proj.icon}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-3 font-orbitron group-hover:text-teal-300 transition-colors">
                  {proj.title[lang] || proj.title.en}
                </h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                  {proj.description[lang] || proj.description.en}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">
                  {proj.tech.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
