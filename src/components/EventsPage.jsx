import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import EventRegistrationModal from './EventRegistrationModal';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

export default function EventsPage() {
  const { lang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('startDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        } else {
          setEvents([
            { id: '1', title_ar: 'القمة التقنية 2026', title_en: 'Tech Summit 2026', location: 'الرباط', mode: 'Offline', startDate: '2026-10-15', startTime: '09:00 AM', maxCapacity: 500, isRegistrationOpen: true, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
            { id: '2', title_ar: 'ورشة عمل الذكاء الاصطناعي', title_en: 'AI Workshop', location: 'الدار البيضاء', mode: 'Offline', startDate: '2026-11-20', startTime: '10:00 AM', maxCapacity: 100, isRegistrationOpen: true, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
            { id: '3', title_ar: 'هاكاثون الويب 3', title_en: 'Web3 Hackathon', location: 'Online', mode: 'Online', startDate: '2026-12-05', startTime: '08:00 AM', maxCapacity: 1000, isRegistrationOpen: false, image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const emptyMessage = {
    en: 'No events available at the moment.',
    fr: 'Aucun événement disponible pour le moment.',
    ar: 'لا توجد فعاليات متاحة في الوقت الحالي.'
  };

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const filteredEvents = events.filter(evt => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = getLocalized(evt, 'title', lang).toLowerCase();
    const location = (evt.location || '').toLowerCase();
    return title.includes(q) || location.includes(q);
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen grid-bg py-24 px-6 md:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-card border border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.3)] mb-6"
          >
            <CalendarIcon className="w-5 h-5 text-teal-400 animate-pulse" />
            <span className="font-orbitron text-teal-300 font-bold tracking-widest uppercase text-sm">
              {lang === 'ar' ? 'فعالياتنا' : lang === 'fr' ? 'Nos Événements' : 'Our Events'}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-orbitron gradient-text"
          >
            {lang === 'ar' ? 'اكتشف الفعاليات القادمة' : lang === 'fr' ? 'Découvrez Nos Événements' : 'Discover Upcoming Events'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'انضم إلينا في ورش العمل والهاكاثونات والمؤتمرات التقنية في جميع أنحاء المغرب.' : 
             lang === 'fr' ? 'Rejoignez-nous pour des ateliers, des hackathons et des conférences tech à travers le Maroc.' : 
             'Join us for workshops, hackathons, and tech conferences across Morocco.'}
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar 
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder={lang === 'ar' ? 'ابحث في الفعاليات...' : 'Search events...'}
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : currentEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <CalendarIcon className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {currentEvents.map((evt, index) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                className="glass-card card-3d rounded-2xl overflow-hidden flex flex-col border border-slate-200/ dark:border-slate-700/ hover:border-teal-500/50 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] transition-all duration-500 group bg-white/ dark:bg-slate-900/ backdrop-blur-md"
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={evt.imageUrl || evt.image} alt="Event" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  {/* Decorative glow */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 blur-3xl rounded-full group-hover:bg-teal-500/40 transition-colors" />

                  {!evt.isRegistrationOpen && (
                    <div className="absolute top-4 right-4 bg-rose-500/20 backdrop-blur-md text-rose-300 text-xs font-bold px-4 py-1.5 rounded-full border border-rose-500/30 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      {lang === 'ar' ? 'مغلق / مكتمل' : lang === 'fr' ? 'Fermé' : 'Closed / Full'}
                    </div>
                  )}
                  {evt.mode === 'Online' && (
                    <div className="absolute top-4 left-4 bg-indigo-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      {lang === 'ar' ? 'عن بُعد' : lang === 'fr' ? 'En ligne' : 'Online'}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-4 font-orbitron group-hover:text-teal-300 transition-colors drop-shadow-md">
                    {getLocalized(evt, 'title', lang)}
                  </h3>
                  
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-slate-50/ dark:bg-slate-800/ p-2.5 rounded-lg border border-slate-200/ dark:border-slate-700/">
                      <div className="p-2 bg-teal-500/10 rounded-md">
                        <CalendarIcon className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="font-medium">{evt.startDate}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-slate-50/ dark:bg-slate-800/ p-2.5 rounded-lg border border-slate-200/ dark:border-slate-700/">
                      <div className="p-2 bg-teal-500/10 rounded-md">
                        <Clock className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="font-medium">{evt.startTime}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-slate-50/ dark:bg-slate-800/ p-2.5 rounded-lg border border-slate-200/ dark:border-slate-700/">
                      <div className="p-2 bg-teal-500/10 rounded-md">
                        <MapPin className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="font-medium">{evt.mode === 'Online' ? 'عن بُعد' : evt.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-slate-50/ dark:bg-slate-800/ p-2.5 rounded-lg border border-slate-200/ dark:border-slate-700/">
                      <div className="p-2 bg-teal-500/10 rounded-md">
                        <Users className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="font-medium">{evt.maxCapacity} {lang === 'ar' ? 'مقعد' : lang === 'fr' ? 'Places' : 'Seats'}</span>
                    </div>
                  </div>

                  {evt.isRegistrationOpen ? (
                    <button onClick={() => setSelectedEvent(evt)} className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center justify-center gap-2 group/btn">
                      {lang === 'ar' ? 'سجل الآن' : lang === 'fr' ? 'S\'inscrire' : 'Register Now'}
                      <ArrowRight className={`w-5 h-5 group-hover/btn:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`} />
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl glass text-slate-600 dark:text-slate-400 font-medium cursor-not-allowed">
                      {lang === 'ar' ? 'التسجيل مغلق' : lang === 'fr' ? 'Inscriptions fermées' : 'Registration Closed'}
                    </button>
                  )}
                </div>
              </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
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
      
      {selectedEvent && (
        <EventRegistrationModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
