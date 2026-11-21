import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

const ProjectsHub = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [lang]);
  const PROJECT_TRANSLATIONS = {
    'منصة إديوكونيكت': { en: 'EduConnect Platform', fr: 'Plateforme EduConnect' },
    'تراث المغرب بالواقع الافتراضي': { en: 'Morocco Heritage VR', fr: 'Patrimoine du Maroc en VR' },
    'نظام الري الذكي بالطاقة الشمسية': { en: 'Solar Smart Irrigation System', fr: "Système d'Irrigation Solaire Intelligent" },
    'نظام الري الذكي': { en: 'Solar Smart Irrigation System', fr: "Système d'Irrigation Solaire Intelligent" },
    'تجربة الواقع الافتراضي للمدينة': { en: 'Smart City VR Experience', fr: 'Expérience VR Ville Intelligente' },
    'تجربة الواقع الافتراضي للمدينة الذكية': { en: 'Smart City VR Experience', fr: 'Expérience VR Ville Intelligente' },
    'نظام إدارة المرور الذكية عبر الدرونز': { en: 'Smart Drone Traffic Management', fr: 'Gestion Intelligente du Trafic par Drones' },
  };
const DESCRIPTION_TRANSLATIONS = [
    {
      keywords: ['إديوكونيكت', 'educonnect', 'تعليم', 'تعلم'],
      en: 'An interactive digital learning platform connecting students and educators with smart educational resources.',
      fr: "Une plateforme d'apprentissage numérique interactive reliant étudiants et enseignants avec des ressources pédagogiques intelligentes."
    },
    {
      keywords: ['تراث المغرب', 'heritage', 'تراث'],
      en: "An immersive virtual reality experience showcasing Morocco's rich historical landmarks and cultural heritage.",
      fr: 'Une expérience de réalité virtuelle immersive mettant en valeur les monuments historiques et le patrimoine culturel du Maroc.'
    },
    {
      keywords: ['الري الذكي', 'الطاقة الشمسية', 'irrigation', 'زراعة'],
      en: 'An IoT-powered automated irrigation system driven by solar energy to optimize agricultural water usage.',
      fr: "Un système d'irrigation automatisé alimenté par l'énergie solaire et l'IoT pour optimiser la consommation d'eau agricole."
    },
    {
      keywords: ['الواقع الافتراضي للمدينة', 'مدينة ذكية', 'smart city'],
      en: 'A virtual reality simulation exploring sustainable smart city infrastructure and urban innovation.',
      fr: "Une simulation en réalité virtuelle explorant les infrastructures durables des villes intelligentes et l'innovation urbaine."
    },
    {
      keywords: ['المرور', 'الدرونز', 'drone', 'درون'],
      en: 'An intelligent aerial monitoring system using autonomous drones and AI to optimize urban traffic flow.',
      fr: "Un système de surveillance aérienne intelligent utilisant des drones autonomes et l'IA pour fluidifier le trafic urbain."
    }
  ];

  const getDefaultCoverImage = (proj) => {
    const text = [proj?.title, proj?.titleAr, proj?.titleEn, proj?.category].filter(Boolean).join(' ').toLowerCase();
    if (text.includes('تراث') || text.includes('heritage')) {
      return 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80';
    }
    if (text.includes('الواقع الافتراضي') || text.includes('vr') || text.includes('ar') || text.includes('المدينة') || text.includes('city')) {
      return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80';
    }
    if (text.includes('الري') || text.includes('irrigation') || text.includes('شمسية') || text.includes('solar') || text.includes('iot') || text.includes('زراعة')) {
      return 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80';
    }
    if (text.includes('درون') || text.includes('drone') || text.includes('مرور') || text.includes('traffic')) {
      return 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80';
    }
    if (text.includes('إديوكونيكت') || text.includes('educonnect') || text.includes('تعليم') || text.includes('edu')) {
      return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';
  };
  const getLocalized = (obj, field) => {
    if (!obj) return '';
    if (obj[`${field}Ar`] && lang === 'ar') return obj[`${field}Ar`];
    if (obj[`${field}En`] && lang === 'en') return obj[`${field}En`];
    if (obj[`${field}_${lang}`]) return obj[`${field}_${lang}`];
    if (obj[`${field}Fr`] && lang === 'fr') return obj[`${field}Fr`];
    if (obj[`${field}_fr`] && lang === 'fr') return obj[`${field}_fr`];
    const rawVal = (obj[field] || '').trim();
    if (lang === 'en' || lang === 'fr') {
      if (PROJECT_TRANSLATIONS[rawVal]?.[lang]) {
        return PROJECT_TRANSLATIONS[rawVal][lang];
      }
      if (field === 'title') {
        const matchedKey = Object.keys(PROJECT_TRANSLATIONS).find(k => rawVal.includes(k));
        if (matchedKey && PROJECT_TRANSLATIONS[matchedKey]?.[lang]) {
          return PROJECT_TRANSLATIONS[matchedKey][lang];
        }
      }
      if (field === 'description' || field === 'desc') {
        const contextText = `${obj.title || ''} ${obj.titleAr || ''} ${rawVal}`.toLowerCase();
        const match = DESCRIPTION_TRANSLATIONS.find(item => item.keywords.some(k => contextText.includes(k)));
        if (match?.[lang]) return match[lang];
      }
    }
    return obj[field] || '';
  };

  const filteredProjects = projects.filter(proj => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (getLocalized(proj, 'title') || '').toLowerCase();
    const desc = (getLocalized(proj, 'description') || getLocalized(proj, 'desc') || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-gitm-textLight dark:text-white mb-4">
          {lang === 'ar' ? 'معرض الأفكار والمشاريع' : 'Ideas & Projects Gallery'}
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-gitm-red to-gitm-blue mx-auto mb-6 rounded-full"></div>
        <p className="text-gitm-mutedLight dark:text-gitm-mutedDark text-lg">
          {lang === 'ar' 
            ? 'نشارك الأفكار المبتكرة والحلول الهندسية التي نطورها، إيماناً منا بأن الابتكار يبدأ بفكرة تلهم الجميع.' 
            : 'We share innovative ideas and engineering solutions we develop, believing that innovation starts with an inspiring idea.'}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar 
          onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={lang === 'ar' ? 'ابحث في الأفكار والمشاريع...' : 'Search ideas and projects...'}
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-gitm-blue animate-spin mb-4" />
        </div>
      ) : currentProjects.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-2">
            {lang === 'ar' ? 'لا توجد مشاريع مطابقة.' : 'No projects found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentProjects.map((proj) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={proj.id}
                  onClick={() => navigate(`/project-details/${proj.id}`)}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Background Image */}
                  <img 
                    src={proj.coverImage || getDefaultCoverImage(proj)} 
                    alt={getLocalized(proj, 'title')} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getDefaultCoverImage(proj);
                      }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:via-black/50" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-gitm-blue/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {proj.category || 'Innovation'}
                  </div>

                  {/* Title and Short Idea overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                      {getLocalized(proj, 'title')}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {getLocalized(proj, 'description') || getLocalized(proj, 'desc')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProjectsHub;
