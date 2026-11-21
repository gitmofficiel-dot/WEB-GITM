import React, { useState, useEffect } from 'react';
import { MapPin, CalendarDays, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import DOMPurify from 'dompurify';

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
    <div className="grid grid-cols-4 gap-2 sm:gap-3 my-5">
      {[
        { label: lang === 'ar' ? 'أيام' : 'Days', value: timeLeft.days },
        { label: lang === 'ar' ? 'ساعات' : 'Hours', value: timeLeft.hours },
        { label: lang === 'ar' ? 'دقائق' : 'Mins', value: timeLeft.minutes },
        { label: lang === 'ar' ? 'ثواني' : 'Secs', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-center bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 rounded-xl shadow-inner">
          <span className="text-lg sm:text-2xl font-sans font-bold tracking-tight text-emerald-700 dark:text-cyan-400">
            {item.value.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
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

  if (exhibitions.length === 0) {
    return (
      <div className="py-6 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 text-sm text-slate-600 dark:text-slate-300">
        {lang === 'ar' ? 'لا توجد معارض أو فعاليات قادمة حالياً.' : 'No upcoming exhibitions or events right now.'}
      </div>
    );
  }

  const nextEvent = exhibitions[0];

  return (
    <section className="py-4 md:py-16 bg-transparent md:bg-gradient-to-b md:from-white md:to-gray-50 md:dark:from-gray-900 md:dark:to-gray-800">
      <div className="container mx-auto px-0 md:px-4">
        <div className="text-start md:text-center mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-sans tracking-tight text-[#0B132B] dark:text-white mb-2 md:mb-4">
            {lang === 'ar' ? 'المعارض التقنية القادمة' : 'Upcoming Tech Exhibitions'}
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-2xl md:mx-auto">
            {lang === 'ar' ? 'انضم إلينا في أكبر المعارض والمؤتمرات التقنية في المنطقة.' : 'Join us at the biggest tech exhibitions and conferences in the region.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
          <div className="lg:col-span-1 glass-card p-5 md:p-8 rounded-2xl md:rounded-3xl bg-emerald-50/90 dark:bg-gray-800 border border-emerald-200 dark:border-cyan-900/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-cyan-500/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">
              {lang === 'ar' ? 'الحدث القادم' : 'Next Event'}
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0B132B] dark:text-white mb-2 leading-snug break-words">
              {lang === 'ar'
                ? (nextEvent.title_ar || nextEvent.title || nextEvent.titleEn)
                : (nextEvent.title_en || nextEvent.titleEn || nextEvent.title)}
            </h3>
            <p
              className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((nextEvent.description_ar || nextEvent.description_en || nextEvent.description || '').substring(0, 100) + '...') }}
            />

            <Countdown targetDate={`${nextEvent.startDate || nextEvent.date}T${nextEvent.startTime || '00:00'}`} lang={lang} />

            <button
              type="button"
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Ticket size={18} />
              <span>{lang === 'ar' ? 'سجل الآن' : 'Register Now'}</span>
            </button>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {exhibitions.slice(1).map((exhibition) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={exhibition.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all gap-3 md:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#0B132B] dark:text-white mb-1.5 leading-snug break-words">
                    {lang === 'ar'
                      ? (exhibition.title_ar || exhibition.title || exhibition.titleEn)
                      : (exhibition.title_en || exhibition.titleEn || exhibition.title)}
                  </h4>
                  <p
                    className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((exhibition.description_ar || exhibition.description_en || exhibition.description || '').substring(0, 80) + '...') }}
                  />
                </div>
                <div className="flex flex-wrap md:flex-col gap-3 md:gap-2 w-full md:w-auto md:min-w-[200px] pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <CalendarDays size={16} className="text-emerald-600 dark:text-cyan-400 shrink-0" />
                    <span>{exhibition.startDate || exhibition.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <MapPin size={16} className="text-emerald-600 dark:text-cyan-400 shrink-0" />
                    <span>{exhibition.mode === 'Online' ? 'Online / عن بُعد' : exhibition.location}</span>
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
