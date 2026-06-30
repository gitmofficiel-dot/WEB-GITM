import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle, Ticket, Upload, Download, Copy, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

export default function EventRegistrationModal({ event, onClose }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Info/Form, 2: Success/Ticket
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMember = !!currentUser;
  
  const ticketId = `GITM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Here we would typically send this to Firebase 'event_registrations' collection
    // and decrement the event capacity
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 1500);
  };

  const handleAddToCalendar = () => {
    // Generate simple Google Calendar Link
    const text = encodeURIComponent(event.title || event.titleEn);
    const details = encodeURIComponent(event.description?.replace(/<[^>]+>/g, '') || '');
    const location = encodeURIComponent(event.mode === 'Online' ? event.virtualLink : event.location);
    const dates = `${event.startDate.replace(/-/g, '')}T${event.startTime.replace(/:/g, '')}00Z/${event.endDate ? event.endDate.replace(/-/g, '') : event.startDate.replace(/-/g, '')}T${event.endTime ? event.endTime.replace(/:/g, '') : event.startTime.replace(/:/g, '')}00Z`;
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/ dark:bg-slate-900/ backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-rose-500 to-pink-600 p-6 flex justify-between items-start">
            <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
              <X size={20} />
            </button>
            <div className="absolute -bottom-6 right-6 w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center text-rose-500">
              <Ticket size={32} />
            </div>
          </div>

          <div className="px-6 pt-10 pb-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
              {lang === 'ar' ? (event.title || event.titleEn) : (event.titleEn || event.title)}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              <span className="flex items-center gap-1"><Calendar size={16}/> {event.startDate} | {event.startTime}</span>
              <span className="flex items-center gap-1"><MapPin size={16}/> {event.mode === 'Online' ? 'عن بُعد' : 'ميداني'}</span>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isMember ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-800/50">
                    <CheckCircle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-bold">
                      {lang === 'ar' 
                        ? 'مرحباً بك! سيتم تسجيل حضورك بحسابك الرسمي. ستضاف النقاط والشارات إلى ملفك تلقائياً.' 
                        : 'Welcome back! Your attendance will be linked to your account. Badges/Points will be awarded automatically.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
                    <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-bold">
                      {lang === 'ar' 
                        ? 'أنت تسجل كضيف. يمكنك التسجيل في الأكاديمية لاحقاً لحفظ إنجازاتك!' 
                        : 'You are registering as a guest. Consider joining the academy to track your achievements!'}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input type="text" required value={name} onChange={e=>setName(e.target.value)} disabled={isMember} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500 disabled:opacity-60" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={isMember} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500 disabled:opacity-60" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone (Optional)'}</label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500" dir="ltr" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/30 transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <span className="animate-pulse">{lang === 'ar' ? 'جاري التأكيد...' : 'Confirming...'}</span> : <>{lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Reservation'} <Ticket size={18}/></>}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{lang === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Reservation Confirmed!'}</h3>
                  <p className="text-slate-500 text-sm">{lang === 'ar' ? 'تم إرسال نسخة من التذكرة إلى بريدك الإلكتروني.' : 'A copy of the ticket has been sent to your email.'}</p>
                </div>

                {/* Digital Ticket */}
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute left-[-10px] top-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full"></div>
                  <div className="absolute right-[-10px] top-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full"></div>
                  
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG value={ticketId} size={120} level="H" includeMargin={true} className="rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                  
                  <p className="font-mono font-bold text-lg text-slate-700 dark:text-slate-300 tracking-widest">{ticketId}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase">Ticket ID</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={handleAddToCalendar} className="flex-1 py-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm">
                    <Calendar size={16}/> {lang === 'ar' ? 'أضف للتقويم' : 'Add to Calendar'}
                  </button>
                  <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm">
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
