import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SearchBar from './ui/SearchBar';
import Pagination from './ui/Pagination';
import AutomaticContent from './AutomaticContent';

const EventCoverImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-cyan-500/15 via-teal-500/15 to-blue-600/20 dark:from-cyan-950/60 dark:via-slate-800 dark:to-blue-950/50">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-cyan-700 dark:text-cyan-300">
          <div className="w-12 h-12 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-cyan-200/70 dark:border-cyan-500/30">
            <CalendarIcon size={26} />
          </div>
        </div>
      )}
    </div>
  );
};

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
          setEvents([]);
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
    if (l === 'ar' && obj[`${field}Ar`]) return obj[`${field}Ar`];
    if (l === 'en' && obj[`${field}En`]) return obj[`${field}En`];
    if (l === 'fr' && obj[`${field}Fr`]) return obj[`${field}Fr`];
    if (obj[`${field}_${l}`]) return obj[`${field}_${l}`];
    if (obj[field] && typeof obj[field] === 'object') return obj[field][l] || obj[field].en || '';
    return obj[field] || '';
  };

  const getBadgeInfo = (t) => {
    const type = (t || '').toLowerCase();
    switch (type) {
      case 'hackathon':
        return { text: lang === 'ar' ? 'هاكاثون' : 'Hackathon', color: 'bg-red-600 text-white' };
      case 'competition':
        return { text: lang === 'ar' ? 'مسابقة' : 'Competition', color: 'bg-orange-600 text-white' };
      case 'workshop':
        return { text: lang === 'ar' ? 'ورشة عمل' : 'Workshop', color: 'bg-green-600 text-white' };
      case 'training':
        return { text: lang === 'ar' ? 'تدريب' : 'Training', color: 'bg-purple-600 text-white' };
      case 'meetup':
        return { text: lang === 'ar' ? 'لقاء' : 'Meetup', color: 'bg-pink-600 text-white' };
      case 'conference':
        return { text: lang === 'ar' ? 'مؤتمر' : 'Conference', color: 'bg-indigo-600 text-white' };
      default:
        return { text: lang === 'ar' ? 'فعالية' : 'Event', color: 'bg-blue-600 text-white' };
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
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="text-start md:text-center max-w-3xl mx-auto mb-6 md:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
          {lang === 'ar' ? 'اكتشف الفعاليات القادمة' : 'Discover Upcoming Events'}
        </h1>
        <div className="w-20 md:w-24 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 md:mx-auto mb-4 md:mb-6 rounded-full" />
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
          {lang === 'ar'
            ? 'انضم إلينا في ورش العمل والهاكاثونات والمؤتمرات التقنية.'
            : 'Join us for workshops, hackathons, and tech conferences.'}
        </p>
      </div>

      <AutomaticContent kind="events" />

      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
        {lang === 'ar' ? 'فعاليات GITM' : 'GITM Events'}
      </h2>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6 md:mb-10">
        <SearchBar
          onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder={lang === 'ar' ? 'ابحث في الفعاليات...' : 'Search events...'}
        />
      </div>

      {/* Gallery Grid — 16:9 Skeleton while loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 md:p-6 space-y-3">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : currentEvents.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-70" />
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
            {lang === 'ar' ? 'لا توجد فعاليات مطابقة.' : 'No events found.'}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-8 md:gap-10 items-center">
          <div className="max-w-6xl w-full mx-auto">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              <AnimatePresence>
                {currentEvents.map((evt) => {
                  const badge = getBadgeInfo(evt.eventType || evt.type);
                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.3 }}
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="group flex flex-col w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl hover:shadow-cyan-500/15 hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/50"
                    >
                      {/* 16:9 Cover Image with Unified Fallback & Skeleton */}
                      <EventCoverImage
                        src={evt.imageUrl || evt.image}
                        alt={getLocalized(evt, 'title', lang)}
                      />

                      <div className="p-4 md:p-6 flex flex-col flex-grow">
                        {/* Status / Type Badge in its own separate row above the title (zero overlap) */}
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                            {badge.text}
                          </span>
                          {evt.startDate && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 px-2.5 py-1 rounded-full">
                              <CalendarIcon size={13} className="shrink-0" />
                              <span>{evt.startDate}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug whitespace-normal break-words group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {getLocalized(evt, 'title', lang)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-auto pt-3 pb-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-1.5 font-medium">
                            <CalendarIcon size={15} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                            <span>{evt.startDate || 'TBA'}</span>
                          </div>
                          {evt.location && (
                            <div className="flex items-center gap-1.5 font-medium">
                              <MapPin size={15} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                              <span className="break-words">{evt.location}</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${evt.id}`);
                          }}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>{lang === 'ar' ? 'التفاصيل والتسجيل' : 'Details & Register'}</span>
                          <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

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
}
