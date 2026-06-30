import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Pagination from './ui/Pagination';

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
        setGallery(fetchedGallery);
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
    <div className="min-h-screen grid-bg py-24 px-6 md:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-teal-500/30 mb-6"
          >
            <Camera className="w-5 h-5 text-teal-400" />
            <span className="font-orbitron text-teal-300 font-medium tracking-wide">
              {lang === 'ar' ? 'معرض الصور' : lang === 'fr' ? 'Notre Galerie' : 'Our Gallery'}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-orbitron gradient-text"
          >
            {lang === 'ar' ? 'التقاط الابتكار' : lang === 'fr' ? 'Capturer l\'Innovation' : 'Capturing Innovation'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'استكشف اللحظات من فعالياتنا ومشاريعنا الابتكارية عبر المغرب.' : 
             lang === 'fr' ? 'Explorez les moments de nos événements et projets innovants à travers le Maroc.' : 
             'Explore moments from our events and innovative projects across Morocco.'}
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setCurrentPage(1); }}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === f.id 
                  ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(13,148,136,0.5)]' 
                  : 'glass text-slate-300 hover:text-teal-300 hover:bg-teal-500/10'
              }`}
            >
              {f.label[lang] || f.label.en}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : currentGallery.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <Camera className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentGallery.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden glass-card card-3d cursor-pointer h-72"
                  onClick={() => setSelectedImg(item)}
                >
                  <img 
                    src={item.imageUrl || item.url || item.image} 
                    alt={getLocalized(item, 'title', lang)} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-2 font-orbitron">{getLocalized(item, 'title', lang)}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-teal-400"/> {getLocalized(item, 'location', lang)}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-teal-400"/> {item.date}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-teal-500/20 p-2 rounded-full backdrop-blur-md border border-teal-500/30">
                      <ZoomIn className="w-5 h-5 text-teal-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm lightbox-overlay"
              onClick={() => setSelectedImg(null)}
            >
              <button 
                className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-teal-500/20 rounded-full text-slate-300 hover:text-white transition-colors border border-slate-700 hover:border-teal-500/50"
                onClick={(e) => { e.stopPropagation(); setSelectedImg(null); }}
              >
                <X className="w-6 h-6" />
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full rounded-2xl overflow-hidden glass-card border border-teal-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImg.imageUrl || selectedImg.url || selectedImg.image} 
                  alt={getLocalized(selectedImg, 'title', lang)}
                  className="w-full max-h-[80vh] object-contain bg-slate-900/50"
                />
                <div className="p-6 bg-slate-900/80 backdrop-blur-md border-t border-teal-500/20">
                  <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">{getLocalized(selectedImg, 'title', lang)}</h3>
                  <div className="flex items-center gap-6 text-slate-300">
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-400"/> {getLocalized(selectedImg, 'location', lang)}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-teal-400"/> {selectedImg.date}</span>
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
