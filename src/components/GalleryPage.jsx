import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MOCK_GALLERY = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    title: { en: 'UM5 AI Bootcamp 2026', fr: 'Bootcamp IA UM5 2026', ar: 'معسكر الذكاء الاصطناعي بجامعة محمد الخامس 2026' },
    location: { en: 'Rabat, Morocco', fr: 'Rabat, Maroc', ar: 'الرباط، المغرب' },
    date: '2026-03-15',
    category: 'hackathon'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
    title: { en: 'GITEX Africa Delegation', fr: 'Délégation GITEX Africa', ar: 'وفد جيتكس أفريقيا' },
    location: { en: 'Marrakech, Morocco', fr: 'Marrakech, Maroc', ar: 'مراكش، المغرب' },
    date: '2026-05-20',
    category: 'conference'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    title: { en: 'ENSIAS Workshop', fr: 'Atelier ENSIAS', ar: 'ورشة عمل ENSIAS' },
    location: { en: 'Rabat, Morocco', fr: 'Rabat, Maroc', ar: 'الرباط، المغرب' },
    date: '2026-02-10',
    category: 'workshop'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    title: { en: 'OCP Tech Partnership', fr: 'Partenariat Tech OCP', ar: 'شراكة OCP التقنية' },
    location: { en: 'Casablanca, Morocco', fr: 'Casablanca, Maroc', ar: 'الدار البيضاء، المغرب' },
    date: '2026-01-25',
    category: 'event'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    title: { en: 'Coding Night', fr: 'Nuit du Code', ar: 'ليلة البرمجة' },
    location: { en: 'Tangier, Morocco', fr: 'Tanger, Maroc', ar: 'طنجة، المغرب' },
    date: '2025-11-05',
    category: 'hackathon'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    title: { en: 'Smart Agri Tour', fr: 'Tournée Agri Tech', ar: 'جولة التكنولوجيا الزراعية' },
    location: { en: 'Agadir, Morocco', fr: 'Agadir, Maroc', ar: 'أكادير، المغرب' },
    date: '2025-12-12',
    category: 'event'
  }
];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(null);
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: { en: 'All', fr: 'Tout', ar: 'الكل' } },
    { id: 'hackathon', label: { en: 'Hackathons', fr: 'Hackathons', ar: 'هاكاثونات' } },
    { id: 'conference', label: { en: 'Conferences', fr: 'Conférences', ar: 'مؤتمرات' } },
    { id: 'workshop', label: { en: 'Workshops', fr: 'Ateliers', ar: 'ورش عمل' } },
    { id: 'event', label: { en: 'Events', fr: 'Événements', ar: 'أحداث' } }
  ];

  const filteredGallery = filter === 'all' ? MOCK_GALLERY : MOCK_GALLERY.filter(item => item.category === filter);

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
              onClick={() => setFilter(f.id)}
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
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGallery.map((item) => (
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
                  src={item.url} 
                  alt={item.title[lang] || item.title.en} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2 font-orbitron">{item.title[lang] || item.title.en}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-teal-400"/> {item.location[lang] || item.location.en}</span>
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
                  src={selectedImg.url} 
                  alt={selectedImg.title[lang] || selectedImg.title.en}
                  className="w-full max-h-[80vh] object-contain bg-slate-900/50"
                />
                <div className="p-6 bg-slate-900/80 backdrop-blur-md border-t border-teal-500/20">
                  <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">{selectedImg.title[lang] || selectedImg.title.en}</h3>
                  <div className="flex items-center gap-6 text-slate-300">
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-400"/> {selectedImg.location[lang] || selectedImg.location.en}</span>
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
