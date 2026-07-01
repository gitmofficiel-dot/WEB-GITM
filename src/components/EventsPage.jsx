import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';

export default function EventsPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
            { id: '1', type: 'conference', title_ar: 'القمة التقنية 2026', title_en: 'Tech Summit 2026', location: 'الرباط', mode: 'Offline', startDate: '2026-10-15', startTime: '09:00 AM', maxCapacity: 500, isRegistrationOpen: true, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
            { id: '2', type: 'workshop', title_ar: 'ورشة عمل الذكاء الاصطناعي', title_en: 'AI Workshop', location: 'الدار البيضاء', mode: 'Offline', startDate: '2026-11-20', startTime: '10:00 AM', maxCapacity: 100, isRegistrationOpen: true, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
            { id: '3', type: 'hackathon', title_ar: 'هاكاثون الويب 3', title_en: 'Web3 Hackathon', location: 'Online', mode: 'Online', startDate: '2026-12-05', startTime: '08:00 AM', maxCapacity: 1000, isRegistrationOpen: false, image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800' },
            { id: '4', type: 'conference', title_ar: 'مؤتمر الأمن السيبراني', title_en: 'Cybersecurity Conference', location: 'مراكش', mode: 'Offline', startDate: '2027-01-15', startTime: '09:00 AM', maxCapacity: 300, isRegistrationOpen: true, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' }
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

  const getLocalized = (obj, field, l) => {
    if (!obj) return '';
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const getBadgeInfo = (type) => {
    switch (type) {
      case 'hackathon':
        return { text: lang === 'ar' ? 'هاكاثون' : 'Hackathon', color: 'bg-red-500 text-white' };
      case 'competition':
        return { text: lang === 'ar' ? 'مسابقة' : 'Competition', color: 'bg-orange-500 text-white' };
      case 'workshop':
        return { text: lang === 'ar' ? 'ورشة عمل' : 'Workshop', color: 'bg-green-500 text-white' };
      default:
        return { text: lang === 'ar' ? 'فعالية' : 'Event', color: 'bg-blue-500 text-white' };
    }
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
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          {lang === 'ar' ? 'اكتشف الفعاليات القادمة' : 'Discover Upcoming Events'}
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {lang === 'ar' 
            ? 'انضم إلينا في ورش العمل والهاكاثونات والمؤتمرات التقنية.' 
            : 'Join us for workshops, hackathons, and tech conferences.'}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar 
          value={searchQuery}
          onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={lang === 'ar' ? 'ابحث في الفعاليات...' : 'Search events...'}
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        </div>
      ) : currentEvents.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {lang === 'ar' ? 'لا توجد فعاليات مطابقة.' : 'No events found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-10 items-center">
          <div className="max-w-6xl w-full mx-auto">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {currentEvents.map((evt) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={evt.id}
                  onClick={() => navigate(`/events/${evt.id}`)}
                  className="group flex flex-col w-full rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-slate-600"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* Background Image */}
                    <img 
                      src={evt.imageUrl || evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                      alt={getLocalized(evt, 'title', lang)} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getBadgeInfo(evt.type).color}`}>
                        {getBadgeInfo(evt.type).text}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {getLocalized(evt, 'title', lang)}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-1.5 font-medium"><CalendarIcon size={16} className="text-cyan-500"/> {evt.startDate || 'TBA'}</div>
                       {evt.location && <div className="flex items-center gap-1.5 font-medium"><MapPin size={16} className="text-cyan-500"/> {evt.location}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          </div>
          
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
}
