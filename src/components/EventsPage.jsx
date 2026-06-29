import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function EventsPage() {
  const { lang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(fetchedEvents);
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
            <CalendarIcon className="w-5 h-5 text-teal-400" />
            <span className="font-orbitron text-teal-300 font-medium tracking-wide">
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
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'انضم إلينا في ورش العمل والهاكاثونات والمؤتمرات التقنية في جميع أنحاء المغرب.' : 
             lang === 'fr' ? 'Rejoignez-nous pour des ateliers, des hackathons et des conférences tech à travers le Maroc.' : 
             'Join us for workshops, hackathons, and tech conferences across Morocco.'}
          </motion.p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 font-orbitron animate-pulse">
              {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto p-12 text-center rounded-2xl border border-teal-500/30"
          >
            <CalendarIcon className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-orbitron text-white mb-2">{emptyMessage[lang] || emptyMessage.en}</h3>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {events.map((evt, index) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card card-3d rounded-2xl overflow-hidden flex flex-col border border-slate-700/50 hover:border-teal-500/50 transition-colors group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={evt.imageUrl || evt.image} alt="Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {evt.status === 'past' && (
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                      {lang === 'ar' ? 'منتهي' : lang === 'fr' ? 'Terminé' : 'Past Event'}
                    </div>
                  )}
                  {evt.internal && (
                    <div className="absolute top-4 left-4 bg-rose-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {lang === 'ar' ? 'داخلي' : lang === 'fr' ? 'Interne' : 'Internal'}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-4 font-orbitron group-hover:text-teal-300 transition-colors">
                    {getLocalized(evt, 'title', lang)}
                  </h3>
                  
                  <div className="space-y-3 mb-8 flex-grow">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <CalendarIcon className="w-4 h-4 text-teal-500" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Clock className="w-4 h-4 text-teal-500" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>{getLocalized(evt, 'location', lang)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Users className="w-4 h-4 text-teal-500" />
                      <span>{evt.attendees} {lang === 'ar' ? 'مشارك' : lang === 'fr' ? 'Participants' : 'Attendees'}</span>
                    </div>
                  </div>

                  {evt.status === 'upcoming' ? (
                    evt.internal ? (
                      <button disabled className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium border border-slate-700 flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-4 h-4" />
                        {lang === 'ar' ? 'يتطلب معرف العضوية' : lang === 'fr' ? 'Nécessite un ID Membre' : 'Requires Membership ID'}
                      </button>
                    ) : (
                      <button className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group/btn">
                        {lang === 'ar' ? 'سجل الآن' : lang === 'fr' ? 'S\'inscrire' : 'Register Now'}
                        <ArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`} />
                      </button>
                    )
                  ) : (
                    <button className="w-full py-3 rounded-xl glass text-slate-300 font-medium hover:bg-slate-800 transition-colors">
                      {lang === 'ar' ? 'عرض الملخص' : lang === 'fr' ? 'Voir le Résumé' : 'View Recap'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
