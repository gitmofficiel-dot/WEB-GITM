import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code2, Play, CheckCircle, Clock, ChevronDown, Layers, FileDown, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const PROJECTS = [
  {
    id: 1,
    name: 'Maroc AI Health Diagnostix',
    desc: { en: 'An AI-powered diagnostic tool helping local clinics analyze medical imaging faster.', ar: 'أداة تشخيص مدعومة بالذكاء الاصطناعي تساعد العيادات المحلية على تحليل الصور الطبية بشكل أسرع.' },
    status: 'in-progress',
    progress: 75,
    github: 'https://github.com/gitm/health-ai',
    tech: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
  },
  {
    id: 2,
    name: 'Smart Agri-IoT Network',
    desc: { en: 'IoT sensor network for optimizing water usage in Moroccan agriculture.', ar: 'شبكة مستشعرات إنترنت الأشياء لتحسين استخدام المياه في الزراعة المغربية.' },
    status: 'completed',
    progress: 100,
    github: 'https://github.com/gitm/agri-iot',
    tech: ['C++', 'Arduino', 'Node.js', 'MongoDB'],
    color: 'from-green-500 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1628102491629-77858ab5721d?w=800&q=80'
  },
  {
    id: 3,
    name: 'EduChain Credentials',
    desc: { en: 'Blockchain-based system for issuing and verifying academic credentials natively.', ar: 'نظام قائم على البلوكتشين لإصدار والتحقق من الشهادات الأكاديمية.' },
    status: 'in-progress',
    progress: 40,
    github: 'https://github.com/gitm/educhain',
    tech: ['Solidity', 'Next.js', 'Ethers.js'],
    color: 'from-purple-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=800&q=80'
  },
  {
    id: 4,
    name: 'GovTech Portal v2',
    desc: { en: 'Redesigning public administration interfaces with modern accessibility standards.', ar: 'إعادة تصميم واجهات الإدارة العامة بمعايير الوصول الحديثة.' },
    status: 'completed',
    progress: 100,
    github: 'https://github.com/gitm/govtech-portal',
    tech: ['React 19', 'Tailwind', 'Framer Motion'],
    color: 'from-rose-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  },
  {
    id: 5,
    name: 'Atlas Drone Mapping',
    desc: { en: 'Automated drone mapping software for difficult terrains in the Atlas mountains.', ar: 'برنامج رسم خرائط الطائرات بدون طيار الآلي للتضاريس الصعبة في جبال الأطلس.' },
    status: 'in-progress',
    progress: 90,
    github: 'https://github.com/gitm/atlas-drone',
    tech: ['Python', 'OpenCV', 'React Native'],
    color: 'from-orange-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80'
  },
  {
    id: 6,
    name: 'Fintech Micro-Lending API',
    desc: { en: 'Open banking API tailored for micro-lending institutions in North Africa.', ar: 'واجهة برمجة تطبيقات مصرفية مفتوحة مصممة لمؤسسات الإقراض الصغير في شمال إفريقيا.' },
    status: 'completed',
    progress: 100,
    github: 'https://github.com/gitm/fintech-api',
    tech: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
    color: 'from-teal-500 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=800&q=80'
  }
];

export default function TechProjectsPage() {
  const { lang, setView } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredProjects = PROJECTS.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 glass-card rounded-full mb-6">
            <Code2 size={40} className="text-teal-600 dark:text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'Technical Projects', 'المشاريع التقنية', 'Projets Techniques', '技术项目')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Discover the open-source tools and platforms built by the GITM community to drive technological advancement.', 'اكتشف الأدوات والمنصات مفتوحة المصدر التي بناها مجتمعنا.', 'Découvrez les outils open source.', '发现由GITM社区构建的开源工具和平台。')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: 'all', label: txt(lang, 'All Projects', 'كل المشاريع', 'Tous', '所有项目') },
            { id: 'in-progress', label: txt(lang, 'In Progress', 'قيد الإنجاز', 'En cours', '进行中') },
            { id: 'completed', label: txt(lang, 'Completed', 'مكتمل', 'Terminé', '已完成') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${filter === f.id ? 'bg-teal-600 dark:bg-cyan-500 text-white shadow-lg shadow-teal-500/30' : 'glass-card hover-lift'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map(proj => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => setView('project-details')}
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img src={proj.image} alt={proj.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${proj.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`}>
                      {proj.status === 'completed' ? txt(lang, 'Completed', 'مكتمل', 'Terminé', '已完成') : txt(lang, 'In Progress', 'قيد الإنجاز', 'En cours', '进行中')}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">{proj.name}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {proj.desc[lang] || proj.desc.en}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      {proj.team.map((member, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 z-10">
                          {member}
                        </div>
                      ))}
                    </div>
                    <span className="text-teal-600 dark:text-cyan-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {txt(lang, 'View Details', 'عرض التفاصيل', 'Voir les détails', '查看详情')} &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
