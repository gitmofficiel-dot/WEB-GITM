import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, CheckCircle2, PlayCircle, Trophy, Megaphone, Globe, ExternalLink, X, Mail, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

// We will use events from LanguageContext instead of hardcoded arrays.
const ICONS = [Trophy, Megaphone, CheckCircle2];
const GRADIENTS = ['from-cyan-500 to-blue-600', 'from-purple-500 to-fuchsia-600', 'from-emerald-500 to-teal-600'];
const IMAGES = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80'
];

const Countdown = ({ targetDate, lang }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center md:justify-start">
      {[
        { v: timeLeft.d, l: txt(lang, 'Days', 'أيام', 'Jours', '天') },
        { v: timeLeft.h, l: txt(lang, 'Hours', 'ساعات', 'Heures', '小时') },
        { v: timeLeft.m, l: txt(lang, 'Mins', 'دقائق', 'Min', '分钟') },
        { v: timeLeft.s, l: txt(lang, 'Secs', 'ثواني', 'Sec', '秒') }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center glass-card rounded-xl border border-teal-500/30 dark:border-cyan-500/30 mb-2 countdown-digit text-2xl md:text-3xl font-orbitron font-bold text-teal-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            {item.v.toString().padStart(2, '0')}
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.l}</span>
        </div>
      ))}
    </div>
  );
};

import { useNavigate } from 'react-router-dom';

export default function EventsPage() {
  const navigate = useNavigate();
  const { lang, events, competitions, user, eventRegistrations, setEventRegistrations } = useLanguage();
  
  // Enriched Events with images and icons
  const enrichedEvents = events.map((ev, idx) => ({
    ...ev,
    image: IMAGES[idx % IMAGES.length],
    color: GRADIENTS[idx % GRADIENTS.length],
    Icon: ICONS[idx % ICONS.length]
  }));

  const upcomingEvents = enrichedEvents.filter(e => e.status === 'upcoming');
  const pastEvents = enrichedEvents.filter(e => e.status === 'completed');
  
  // Modals State
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Registration Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Dynamic Form Fields
  const [projectName, setProjectName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [fileAttached, setFileAttached] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
  };

  const closeRegistration = () => {
    // legacy function kept for backwards compatibility
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 glass-card rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-teal-500/20 dark:bg-cyan-500/20 rounded-full animate-ping" />
            <CalendarIcon size={40} className="text-teal-600 dark:text-cyan-400 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'Events & Activities', 'الأحداث والأنشطة', 'Événements', '活动与活动')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Join our vibrant community in upcoming hackathons, workshops, and conferences.', 'انضم إلى مجتمعنا النابض بالحياة في الهاكاثونات وورش العمل القادمة.', 'Rejoignez notre communauté dynamique.', '参加我们即将举行的黑客马拉松，研讨会和会议，加入我们充满活力的社区。')}
          </p>
        </motion.div>

        {/* Next Big Event Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-20"
        >
          <div className="glass-card rounded-3xl p-1 border border-teal-500/30 dark:border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 dark:from-cyan-500/10 dark:to-purple-500/10" />
            <div className="bg-[#e0fcfc]/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[23px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold mb-6">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {txt(lang, 'Next Upcoming Event', 'الحدث القادم', 'Prochain événement', '下一个即将举行的活动')}
                </div>
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-[#1e3a5f] dark:text-white">
                  {lang === 'ar' ? upcomingEvents[0]?.title_ar : upcomingEvents[0]?.title_en}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                  {lang === 'ar' ? upcomingEvents[0]?.description_ar : upcomingEvents[0]?.description_en}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm font-medium">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-cyan-400 bg-teal-50 dark:bg-cyan-900/20 px-4 py-2 rounded-lg">
                    <CalendarIcon size={18} />
                    {new Date(upcomingEvents[0]?.date || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg">
                    <MapPin size={18} />
                    {upcomingEvents[0]?.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={() => navigate(`/events/${upcomingEvents[0].id}`)} className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-teal-500/30 flex items-center gap-2">
                    {txt(lang, 'Register Now', 'سجل الآن', 'S\'inscrire maintenant', '现在注册')} <ArrowRight size={18} className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => navigate(`/events/${upcomingEvents[0].id}`)} className="btn-glass px-8 py-3 rounded-full font-bold flex items-center gap-2">
                    {txt(lang, 'View Details', 'عرض التفاصيل', 'Voir les détails', '查看详情')}
                  </button>
                </div>
              </div>
              
              <div className="w-full lg:w-auto flex flex-col items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
                  {txt(lang, 'Event Starts In', 'يبدأ الحدث في', 'L\'événement commence dans', '活动开始于')}
                </h3>
                {upcomingEvents[0] && <Countdown targetDate={upcomingEvents[0].date} lang={lang} />}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Upcoming Events */}
        {upcomingEvents.length > 1 && (
        <div className="mb-20">
          <h2 className="text-3xl font-orbitron font-bold mb-8 flex items-center gap-3">
            <PlayCircle className="text-teal-500" /> {txt(lang, 'More Upcoming Events', 'المزيد من الأحداث القادمة', 'Plus d\'événements', '更多即将举行的活动')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(1).map(ev => (
              <motion.div key={ev.id} whileHover={{ y: -5 }} className="card-3d glass-card rounded-3xl overflow-hidden flex flex-col group border-t-4 border-t-purple-500">
                <div className="h-48 relative overflow-hidden">
                  <img src={ev.image} alt="event" className="w-full h-full object-cover transform group-hover:scale-110 transition-duration-700" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                  <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                    <span className="text-xs font-bold px-3 py-1 bg-[#e0fcfc]/90 dark:bg-slate-900/90 rounded-full text-[#1e3a5f] dark:text-white shadow-md">
                      {ev.type}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white drop-shadow-md">
                        {new Date(ev.date).getDate()} {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-orbitron font-bold mb-3 group-hover:text-purple-500 transition-colors text-[#1e3a5f] dark:text-white">
                    {lang === 'ar' ? ev.title_ar : ev.title_en}
                  </h3>
                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={16}/> {new Date(ev.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin size={16}/> {ev.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/events/${ev.id}`)} className="flex-1 py-3 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-bold text-sm flex justify-center items-center gap-2">
                      {txt(lang, 'RSVP', 'تأكيد الحضور', 'RSVP', '回复')}
                    </button>
                    <button onClick={() => navigate(`/events/${ev.id}`)} className="flex-1 py-3 rounded-xl bg-cyan-100 dark:bg-slate-800 text-[#1e3a5f] dark:text-slate-300 hover:bg-cyan-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm flex justify-center items-center">
                      {txt(lang, 'Details', 'التفاصيل', 'Détails', '详情')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        )}

        {/* Competitions Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-orbitron font-bold mb-8 flex items-center gap-3">
            <Trophy className="text-amber-500" /> {txt(lang, 'National & International Competitions', 'المسابقات الوطنية والدولية', 'Compétitions Nationales et Internationales', '全国和国际比赛')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions?.map(comp => (
              <div key={comp.id} className="glass-card rounded-2xl p-6 border-l-4 hover:bg-[#e0fcfc]/5 transition-colors group" style={{ borderLeftColor: comp.scope === 'international' ? '#3b82f6' : '#10b981' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${comp.scope === 'international' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      {comp.scope === 'international' ? <><Globe size={12} className="inline mr-1" /> {txt(lang, 'International', 'دولي', 'International', '国际')}</> : <><MapPin size={12} className="inline mr-1" /> {txt(lang, 'National', 'وطني', 'National', '国家')}</>}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${comp.status === 'open' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-cyan-100 text-[#2d507b] dark:bg-slate-800 dark:text-slate-400'}`}>
                      {comp.status === 'open' ? txt(lang, 'Open for Registration', 'مفتوح للتسجيل', 'Ouvert', '开放注册') : comp.status}
                    </span>
                  </div>
                  <div className="font-bold text-amber-500 dark:text-amber-400 text-sm">
                    {comp.reward}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-[#1e3a5f] dark:text-white group-hover:text-amber-500 transition-colors">
                  {lang === 'ar' ? comp.title_ar : comp.title_en}
                </h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-1"><CalendarIcon size={16}/> {comp.date}</div>
                  <div className="flex items-center gap-1"><MapPin size={16}/> {comp.location}</div>
                </div>
                
                {comp.status === 'open' && (
                  <button onClick={() => navigate(`/events/${comp.id}`)} className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors">
                    {txt(lang, 'Register Team', 'سجل فريقك', 'Inscrire l\'équipe', '注册团队')} <ExternalLink size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Past Events List */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold mb-8 flex items-center gap-3 text-slate-400">
            <CheckCircle2 /> {txt(lang, 'Past Events', 'الأحداث السابقة', 'Événements passés', '过去的活动')}
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            {pastEvents.map((ev, idx) => (
              <div key={ev.id} className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-cyan-50 dark:hover:bg-slate-800/50 transition-colors ${idx !== pastEvents.length - 1 ? 'border-b border-cyan-300 dark:border-slate-800' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-cyan-100 dark:bg-slate-800 flex flex-col items-center justify-center flex-shrink-0 text-slate-500">
                    <span className="text-sm font-bold">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-orbitron font-bold">{new Date(ev.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{lang === 'ar' ? ev.title_ar : ev.title_en}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {ev.location}</span>
                      <span className="flex items-center gap-1"><Users size={14}/> {ev.type}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate(`/events/${ev.id}`)} className="text-teal-600 dark:text-cyan-400 font-medium text-sm flex items-center gap-1 hover:underline whitespace-nowrap">
                  {txt(lang, 'View Recap', 'عرض الملخص', 'Voir le résumé', '查看回顾')} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Modal Removed - Redirects to Dedicated Details Page Now */}
      </div>
    </div>
  );
}
