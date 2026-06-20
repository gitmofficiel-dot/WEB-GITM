import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, Camera, ZoomIn, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../config/cloudinary';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const MOCK_GALLERY = [
  { id: 1, type: 'image', category: 'Events', title: { en: 'Annual Tech Summit 2025' }, date: '2025-11-12', cldId: 'cld-sample', height: 'h-64' },
  { id: 2, type: 'image', category: 'Workshops', title: { en: 'React 19 Masterclass' }, date: '2025-10-05', cldId: 'cld-sample-2', height: 'h-80' },
  { id: 3, type: 'image', category: 'Meetings', title: { en: 'Board of Directors Meeting' }, date: '2025-09-20', cldId: 'cld-sample-3', height: 'h-48' },
  { id: 4, type: 'image', category: 'Project Milestones', title: { en: 'Smart City App Launch' }, date: '2025-08-15', cldId: 'cld-sample-4', height: 'h-96' },
  { id: 5, type: 'image', category: 'Events', title: { en: 'Hackathon Highlights' }, date: '2025-07-22', cldId: 'cld-sample-5', height: 'h-64' },
  { id: 6, type: 'image', category: 'Workshops', title: { en: 'UI/UX Design Thinking' }, date: '2025-06-10', cldId: 'sample', height: 'h-72' }
];

const CATEGORIES = ['All', 'Meetings', 'Project Milestones', 'Events', 'Workshops'];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = MOCK_GALLERY.filter(item => filter === 'All' || item.category === filter);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 glass-card rounded-full mb-6">
            <Camera size={40} className="text-teal-600 dark:text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'Media Gallery', 'معرض الوسائط', 'Galerie Multimédia', '媒体库')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Explore our visual journey through meetings, workshops, events, and milestones.', 'استكشف رحلتنا المرئية عبر الاجتماعات وورش العمل والأحداث.', 'Explorez notre voyage visuel.', '探索我们的视觉之旅。')}
          </p>
        </motion.div>

        {/* Filters & Counter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${filter === cat ? 'bg-teal-600 dark:bg-cyan-500 text-white shadow-lg' : 'glass-card hover-lift'}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full font-orbitron text-sm">
            <Layers size={16} className="text-teal-600 dark:text-cyan-400" />
            <span>{filteredItems.length} {txt(lang, 'Items', 'عناصر', 'Éléments', '项目')}</span>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer card-3d break-inside-avoid ${item.height} bg-cyan-200 dark:bg-slate-800`}
                onClick={() => setSelectedItem(item)}
              >
                <AdvancedImage 
                  cldImg={cld.image(item.cldId).format('auto').quality('auto')} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <div className="bg-[#e0fcfc]/20 backdrop-blur-md p-3 rounded-full mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.type === 'video' ? <Play className="text-white ml-1" size={24} /> : <ZoomIn className="text-white" size={24} />}
                  </div>
                  <h3 className="text-white font-bold text-center font-orbitron translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.title.en}
                  </h3>
                  <span className="text-white/80 text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {item.date}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4 glass px-2 py-1 rounded-md flex items-center gap-1 text-white/90 text-xs font-bold backdrop-blur-md">
                  {item.type === 'video' ? <Play size={12} /> : <ImageIcon size={12} />}
                  {item.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 lightbox-overlay backdrop-blur-xl bg-slate-900/90"
              onClick={() => setSelectedItem(null)}
            >
              <button className="absolute top-6 right-6 text-white hover:text-cyan-400 transition-colors p-2 glass rounded-full" onClick={() => setSelectedItem(null)}>
                <X size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl rounded-2xl overflow-hidden glass-card border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className={`w-full aspect-video bg-black flex items-center justify-center relative overflow-hidden`}>
                  <AdvancedImage 
                    cldImg={cld.image(selectedItem.cldId).format('auto').quality('auto')} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="p-6 md:p-8 bg-[#e0fcfc] dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl md:text-3xl font-orbitron font-bold gradient-text">
                      {selectedItem.title.en}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="glass px-3 py-1 rounded-full text-sm font-medium dark:text-white">
                        {selectedItem.category}
                      </span>
                      <span className="text-slate-500 text-sm">{selectedItem.date}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {txt(lang, 'Detailed description of the media item goes here. This captures the essence of the moment and provides context to the viewer.', 'وصف تفصيلي لعنصر الوسائط يذهب هنا. هذا يجسد جوهر اللحظة ويوفر سياقًا للمشاهد.', 'Description détaillée du média. Cela capture l\'essence du moment.', '媒体项目的详细描述在这里。')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
