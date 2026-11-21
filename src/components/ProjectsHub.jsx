import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ArrowRight, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

const ProjectCardImage = ({ src, fallbackSrc, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-500/15 via-cyan-500/15 to-slate-200 dark:from-blue-950/60 dark:via-slate-800 dark:to-cyan-950/50">
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {!failed && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gitm-blue dark:text-cyan-300">
          <div className="w-12 h-12 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-blue-200/70 dark:border-cyan-500/30">
            <Cpu size={26} />
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectsHub = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination, Category & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    'تجربة الواقع الافتراضي للمدينة العتيقة': { en: 'Old Medina VR Experience', fr: "Expérience VR de l'Ancienne Médina" },
    'روبوت روح الأطلس': { en: 'Atlas Spirit Robot', fr: "Robot Esprit de l'Atlas" },
    'منصة التكنولوجيا الزراعية': { en: 'AgriTech Platform', fr: 'Plateforme AgriTech' },
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
      keywords: ['تجربة الواقع الافتراضي للمدينة العتيقة', 'المدينة العتيقة', 'medina'],
      en: 'An immersive virtual reality tour exploring the historic alleys, architecture, and heritage of the Old Medina.',
      fr: "Une visite immersive en réalité virtuelle explorant les ruelles historiques, l'architecture et le patrimoine de l'ancienne Médina."
    },
    {
      keywords: ['روبوت روح الأطلس', 'روح الأطلس', 'روبوت', 'atlas spirit', 'robot'],
      en: 'An autonomous intelligent robot engineered for exploration, assistance, and smart automation in challenging environments.',
      fr: "Un robot intelligent autonome conçu pour l'exploration, l'assistance et l'automatisation intelligente dans des environnements complexes."
    },
    {
      keywords: ['منصة التكنولوجيا الزراعية', 'التكنولوجيا الزراعية', 'الزراعية', 'agritech', 'agriculture'],
      en: 'A smart digital agriculture platform leveraging sensors and data analytics to boost crop yield and sustainability.',
      fr: "Une plateforme d'agriculture numérique intelligente exploitant des capteurs et l'analyse de données pour optimiser les rendements et la durabilité."
    },
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
    if (text.includes('روبوت') || text.includes('روح الأطلس') || text.includes('robot') || text.includes('atlas')) {
      return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80';
    }
    if (text.includes('الزراعية') || text.includes('agritech') || text.includes('agriculture')) {
      return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80';
    }
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

  const getProjectCoverImage = (proj) => {
    const img = (proj?.coverImage || '').trim();
    return (!img || img.includes('photo-1518770660439-4636190af475')) ? getDefaultCoverImage(proj) : img;
  };

  const getLocalized = (obj, field) => {
    if (!obj) return '';
    const hasArabic = (s) => /[\u0600-\u06FF]/.test(s || '');
    const candidate = lang === 'ar'
      ? (obj[`${field}Ar`] || obj[`${field}_ar`] || obj[field] || '')
      : (lang === 'en' ? obj[`${field}En`] : obj[`${field}Fr`]) || obj[`${field}_${lang}`] || (lang === 'fr' ? obj[`${field}_fr`] : '') || obj[field] || '';
    const rawVal = String(candidate).trim();
    if (lang === 'ar' || (rawVal && !hasArabic(rawVal))) return rawVal;

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

  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = projects.filter(proj => {
    const matchesCategory = selectedCategory === 'all' || proj.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (getLocalized(proj, 'title') || '').toLowerCase();
    const desc = (getLocalized(proj, 'description') || getLocalized(proj, 'desc') || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="text-start md:text-center max-w-3xl mx-auto mb-6 md:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gitm-textLight dark:text-white mb-3 md:mb-4 leading-tight">
          {lang === 'ar'
            ? 'معرض الأفكار والمشاريع'
            : lang === 'fr'
              ? 'Galerie des Idées et Projets'
              : 'Ideas & Projects Gallery'}
        </h1>
        <div className="w-20 md:w-24 h-1.5 bg-gradient-to-r from-gitm-red to-gitm-blue md:mx-auto mb-4 md:mb-6 rounded-full" />
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
          {lang === 'ar'
            ? 'نشارك الأفكار المبتكرة والحلول الهندسية التي نطورها، إيماناً منا بأن الابتكار يبدأ بفكرة تلهم الجميع.'
            : lang === 'fr'
              ? "Nous partageons les idées innovantes et les solutions d'ingénierie que nous développons."
              : 'We share innovative ideas and engineering solutions we develop, believing that innovation starts with an inspiring idea.'}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-4 md:mb-8">
        <SearchBar
          onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={
            lang === 'ar'
              ? 'ابحث في الأفكار والمشاريع...'
              : lang === 'fr'
                ? 'Rechercher des idées et projets...'
                : 'Search ideas and projects...'
          }
        />
      </div>

      {/* Scrollable Category Filter Chips (>=44px touch targets) */}
      {categories.length > 1 && (
        <div className="filter-scroll md:flex-wrap md:justify-center pb-2 mb-6 md:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`min-h-[44px] px-4 md:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gitm-blue text-white border-gitm-blue shadow-md shadow-gitm-blue/20'
                  : 'bg-white dark:bg-gitm-cardDark text-slate-700 dark:text-slate-200 border-slate-200 dark:border-gitm-borderDark hover:border-gitm-blue hover:text-gitm-blue'
              }`}
            >
              {cat === 'all' ? (lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tous' : 'All') : cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid — 16:9 Skeleton while loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-gitm-cardDark border border-slate-200 dark:border-gitm-borderDark shadow-sm animate-pulse">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : currentProjects.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-2xl bg-slate-50 dark:bg-gitm-cardDark border border-slate-200 dark:border-gitm-borderDark">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-70" />
          <h3 className="text-lg md:text-2xl font-bold text-gitm-textLight dark:text-white mb-1">
            {lang === 'ar' ? 'لا توجد مشاريع مطابقة.' : lang === 'fr' ? 'Aucun projet trouvé.' : 'No projects found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-8 md:gap-10">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {currentProjects.map((proj) => {
                const title = getLocalized(proj, 'title');
                const desc = getLocalized(proj, 'description') || getLocalized(proj, 'desc');

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    key={proj.id}
                    onClick={() => navigate(`/project-details/${proj.id}`)}
                    className="group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-gitm-cardDark border border-slate-200 dark:border-gitm-borderDark shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* 16:9 Cover Image with Unified Fallback & Skeleton */}
                    <ProjectCardImage
                      src={getProjectCoverImage(proj)}
                      fallbackSrc={getDefaultCoverImage(proj)}
                      alt={title}
                    />

                    {/* Card Body — Category Badge cleanly separated above Title */}
                    <div className="p-4 md:p-5 flex-1 flex flex-col">
                      <div className="mb-2.5">
                        <span className="inline-block bg-gitm-blue/10 dark:bg-gitm-blue/25 text-gitm-blue dark:text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
                          {proj.category || 'Innovation'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2 break-words group-hover:text-gitm-blue dark:group-hover:text-cyan-400 transition-colors">
                        {title}
                      </h3>

                      {desc && (
                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed mb-4">
                          {desc}
                        </p>
                      )}

                      <div className="flex-1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project-details/${proj.id}`);
                        }}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-gitm-blue text-slate-900 dark:text-white group-hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>
                          {lang === 'ar' ? 'عرض التفاصيل' : lang === 'fr' ? 'Voir les détails' : 'View Details'}
                        </span>
                        <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-2 flex justify-center">
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
