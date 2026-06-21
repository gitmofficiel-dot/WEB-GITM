import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MOCK_EVENTS = [
  {
    id: 1,
    title: { en: 'AI & Web3 Summit Rabat', fr: 'Sommet IA & Web3 Rabat', ar: 'قمة الذكاء الاصطناعي و Web3 بالرباط' },
    date: '2026-08-20',
    time: '09:00 - 18:00',
    location: { en: 'Technopolis, Rabat', fr: 'Technopolis, Rabat', ar: 'تكنوبوليس، الرباط' },
    attendees: 150,
    internal: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    status: 'upcoming'
  },
  {
    id: 2,
    title: { en: 'GITM Leadership Workshop', fr: 'Atelier de Leadership GITM', ar: 'ورشة القيادة لـ GITM' },
    date: '2026-07-10',
    time: '14:00 - 17:00',
    location: { en: 'ENSIAS Campus', fr: 'Campus ENSIAS', ar: 'حرم ENSIAS' },
    attendees: 30,
    internal: true,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    status: 'upcoming'
  },
  {
    id: 3,
    title: { en: 'Casablanca Tech Meetup', fr: 'Rencontre Tech Casablanca', ar: 'ملتقى التكنولوجيا بالدار البيضاء' },
    date: '2026-05-15',
    time: '18:00 - 21:00',
    location: { en: 'Twin Center, Casablanca', fr: 'Twin Center, Casablanca', ar: 'تويين سنتر، الدار البيضاء' },
    attendees: 80,
    internal: false,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    status: 'past'
  }
];

export default function EventsPage() {
  const { lang } = useLanguage();

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((evt, index) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card card-3d rounded-2xl overflow-hidden flex flex-col border border-slate-700/50 hover:border-teal-500/50 transition-colors group"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={evt.image} alt="Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  {evt.title[lang] || evt.title.en}
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
                    <span>{evt.location[lang] || evt.location.en}</span>
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
      </div>
    </div>
  );
}
