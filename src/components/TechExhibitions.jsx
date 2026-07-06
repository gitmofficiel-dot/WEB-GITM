import React, { useState, useEffect } from 'react';
import { MapPin, CalendarDays, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Countdown = ({ targetDate, lang }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 my-6">
      {[
        { label: lang === 'ar' ? 'أيام' : 'Days', value: timeLeft.days },
        { label: lang === 'ar' ? 'ساعات' : 'Hours', value: timeLeft.hours },
        { label: lang === 'ar' ? 'دقائق' : 'Mins', value: timeLeft.minutes },
        { label: lang === 'ar' ? 'ثواني' : 'Secs', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg min-w-[70px] shadow-inner">
          <span className="text-2xl font-orbitron font-bold text-emerald-600 dark:text-cyan-400">{item.value.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500 uppercase">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const TechExhibitions = () => {
  const { lang, events } = useLanguage();
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    if (events && events.length > 0) {
      const futureEvents = events
        .filter(e => new Date(`${e.startDate || e.date}T${e.startTime || '00:00'}`) > new Date())
        .sort((a, b) => new Date(`${a.startDate || a.date}T${a.startTime || '00:00'}`) - new Date(`${b.startDate || b.date}T${b.startTime || '00:00'}`));
      setExhibitions(futureEvents);
    } else {
      setExhibitions([]);
    }
  }, [events]);

  if (exhibitions.length === 0) return null;

  const nextEvent = exhibitions[0];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-[#0B132B] dark:text-white mb-4">
            {lang === 'ar' ? 'المعارض التقنية القادمة' : 'Upcoming Tech Exhibitions'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {lang === 'ar' ? 'انضم إلينا في أكبر المعارض والمؤتمرات التقنية في المنطقة.' : 'Join us at the biggest tech exhibitions and conferences in the region.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card p-8 rounded-3xl bg-emerald-50 dark:bg-gray-800 border-2 border-emerald-100 dark:border-cyan-900/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-cyan-500/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
              {lang === 'ar' ? 'الحدث القادم' : 'Next Event'}
            </span>
            <h3 className="text-2xl font-bold text-[#0B132B] dark:text-white mb-2">{lang === 'ar' ? (nextEvent.title_ar || nextEvent.title || nextEvent.titleEn) : (nextEvent.title_en || nextEvent.titleEn || nextEvent.title)}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: (nextEvent.description_ar || nextEvent.description_en || nextEvent.description || '').substring(0, 100) + '...' }}></p>
            
            <Countdown targetDate={`${nextEvent.startDate || nextEvent.date}T${nextEvent.startTime || '00:00'}`} lang={lang} />
            
            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <Ticket size={18} /> {lang === 'ar' ? 'سجل الآن' : 'Register Now'}
            </button>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {exhibitions.slice(1).map((exhibition) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={exhibition.id} 
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl bg-[#e0fcfc] dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#0B132B] dark:text-white mb-2">{lang === 'ar' ? (exhibition.title_ar || exhibition.title || exhibition.titleEn) : (exhibition.title_en || exhibition.titleEn || exhibition.title)}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: (exhibition.description_ar || exhibition.description_en || exhibition.description || '').substring(0, 80) + '...' }}></p>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarDays size={16} className="text-emerald-500 dark:text-cyan-400" /> 
                    {exhibition.startDate || exhibition.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="text-emerald-500 dark:text-cyan-400" /> 
                    {exhibition.mode === 'Online' ? 'Online / عن بُعد' : exhibition.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechExhibitions;
