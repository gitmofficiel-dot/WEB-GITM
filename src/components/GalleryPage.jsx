import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Pagination from './ui/Pagination';

const GalleryTileImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/20 dark:from-teal-950/60 dark:via-slate-800 dark:to-cyan-950/50">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-teal-700 dark:text-cyan-300">
          <div className="w-11 h-11 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-teal-200/70 dark:border-cyan-500/30">
            <Camera size={22} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(null);
  const [filter, setFilter] = useState('all');
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedGallery = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetchedGallery.length > 0) {
          setGallery(fetchedGallery);
        } else {
          setGallery([]);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filters = [
    { id: 'all', label: { en: 'All', fr: 'Tout', ar: 'الكل' } },
    { id: 'hackathon', label: { en: 'Hackathons', fr: 'Hackathons', ar: 'هاكاثونات' } },
    { id: 'conference', label: { en: 'Conferences', fr: 'Conférences', ar: 'مؤتمرات' } },
    { id: 'workshop', label: { en: 'Workshops', fr: 'Ateliers', ar: 'ورش عمل' } },
    { id: 'event', label: { en: 'Events', fr: 'Événements', ar: 'أحداث' } }
  ];

  const filteredGallery = filter === 'all' ? gallery : gallery.filter(item => item.category === filter);
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const currentGallery = filteredGallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const emptyMessage = {
    en: 'No images available at the moment.',
    fr: 'Aucune image disponible pour le moment.',
    ar: 'لا توجد صور متاحة في الوقت الحالي.'
  };

  return (
    <div className="min-h-screen grid-bg pt-24 pb-16 md:py-28 px-4 md:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-start md:text-center mb-8 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30 mb-4 md:mb-6"
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5 text-teal-600 dark:text-teal-400" />
            <span className="font-sans font-bold text-xs sm:text-sm text-teal-700 dark:text-teal-300 tracking-wide">
              {lang === 'ar' ? 'معرض الصور' : lang === 'fr' ? 'Notre Galerie' : 'Our Gallery'}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-6xl font-bold mb-3 md:mb-6 font-sans tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {lang === 'ar' ? 'التقاط الابتكار' : lang === 'fr' ? "Capturer l'Innovation" : 'Capturing Innovation'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-700 dark:text-slate-300 max-w-2xl md:mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
          >
            {lang === 'ar'
              ? 'استكشف اللحظات من فعالياتنا ومشاريعنا الابتكارية عبر المغرب.'
              : lang === 'fr'
                ? 'Explorez les moments de nos événements et projets innovants à travers le Maroc.'
                : 'Explore moments from our events and innovative projects across Morocco.'}
          </motion.p>
        </div>

        {/* Scrollable Filter Chips (>=44px touch targets) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="filter-scroll md:flex-wrap md:justify-center pb-2 mb-6 md:mb-12"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => { setFilter(f.id); setCurrentPage(1); }}
              className={`min-h-[44px] px-4 md:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border whitespace-nowrap transition-all duration-300 ${
                filter === f.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300'
              }`}
            >
              {f.label[lang] || f.label.en}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid — 2 columns on mobile (1:1), 3 on desktop (4:3), with matching Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-square md:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-200/70 dark:border-slate-700/70"
              />
            ))}
          </div>
        ) : currentGallery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 max-w-2xl mx-auto p-8 md:p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <Camera className="w-12 h-12 md:w-16 md:h-16 text-slate-400 mx-auto mb-4 opacity-70" />
            <h3 className="text-lg md:text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-white">
              {emptyMessage[lang] || emptyMessage.en}
            </h3>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <AnimatePresence>
              {currentGallery.map((item) => (
                <motion.button
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="group relative aspect-square md:aspect-[4/3] w-full rounded-xl md:rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition-shadow text-start"
                  onClick={() => setSelectedImg(item)}
                >
                  <GalleryTileImage
                    src={item.imageUrl || item.url || item.image}
                    alt={getLocalized(item, 'title', lang)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-5">
                    <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white leading-snug line-clamp-2">
                      {getLocalized(item, 'title', lang)}
                    </h3>
                    <div className="hidden md:flex items-center gap-4 text-xs text-slate-200 mt-1.5">
                      {getLocalized(item, 'location', lang) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          {getLocalized(item, 'location', lang)}
                        </span>
                      )}
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" />
                          {item.date}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:flex absolute top-3 end-3 bg-slate-900/70 p-2 rounded-full backdrop-blur-md border border-white/20">
                      <ZoomIn className="w-4 h-4 text-teal-300" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Mobile-Friendly Full-Screen Lightbox */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md lightbox-overlay"
              onClick={() => setSelectedImg(null)}
            >
              <button
                type="button"
                aria-label={lang === 'ar' ? 'إغلاق المعاينة' : 'Close preview'}
                className="fixed top-4 end-4 z-20 flex items-center justify-center w-11 h-11 bg-slate-900/90 hover:bg-teal-600 rounded-full text-white transition-colors border border-white/25 shadow-lg active:scale-95"
                onClick={(e) => { e.stopPropagation(); setSelectedImg(null); }}
              >
                <X className="w-6 h-6" />
              </button>
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                className="relative max-w-4xl w-full max-h-[90dvh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 min-h-0 flex items-center justify-center bg-black p-2">
                  <img
                    src={selectedImg.imageUrl || selectedImg.url || selectedImg.image}
                    alt={getLocalized(selectedImg, 'title', lang)}
                    className="max-w-full max-h-[68dvh] w-auto h-auto object-contain rounded-lg"
                  />
                </div>
                <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 shrink-0">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-2 leading-snug break-words">
                    {getLocalized(selectedImg, 'title', lang)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
                    {getLocalized(selectedImg, 'location', lang) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                        {getLocalized(selectedImg, 'location', lang)}
                      </span>
                    )}
                    {selectedImg.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                        {selectedImg.date}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
