import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle, Ticket, Upload, Users, FileText, AlertTriangle, Lightbulb, Globe } from 'lucide-react';
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
  
  // New detailed fields
  const [teamMembers, setTeamMembers] = useState('');
  const [projectExplanation, setProjectExplanation] = useState('');
  const [personalBenefit, setPersonalBenefit] = useState('');
  const [nationalBenefit, setNationalBenefit] = useState('');
  const [projectFile, setProjectFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMember = !!currentUser;
  
  const ticketId = `GITM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Here we would typically send this to Firebase 'event_registrations' collection
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 1500);
  };

  const handleAddToCalendar = () => {
    const text = encodeURIComponent(event.title || event.titleEn || event.title_en || event.title_ar);
    const details = encodeURIComponent(event.description?.replace(/<[^>]+>/g, '') || '');
    const location = encodeURIComponent(event.mode === 'Online' ? event.virtualLink : event.location);
    const dates = `${(event.startDate || '').replace(/-/g, '')}T${(event.startTime || '').replace(/:/g, '')}00Z/${event.endDate ? event.endDate.replace(/-/g, '') : (event.startDate || '').replace(/-/g, '')}T${event.endTime ? event.endTime.replace(/:/g, '') : (event.startTime || '').replace(/:/g, '')}00Z`;
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="relative h-28 bg-gradient-to-r from-teal-500 to-cyan-600 p-6 flex justify-between items-start shrink-0">
            <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
              <X size={20} />
            </button>
            <div className="absolute -bottom-6 right-6 rtl:left-6 rtl:right-auto w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center text-teal-500">
              <Ticket size={32} />
            </div>
          </div>

          <div className="px-6 pt-10 pb-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
              {lang === 'ar' ? (event.title_ar || event.title) : (event.title_en || event.title)}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              <span className="flex items-center gap-1"><Calendar size={16}/> {event.startDate} | {event.startTime}</span>
              <span className="flex items-center gap-1"><MapPin size={16}/> {event.mode === 'Online' ? (lang === 'ar' ? 'عن بُعد' : 'Online') : (event.location || 'On-site')}</span>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {isMember ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-800/50">
                    <CheckCircle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-bold">
                      {lang === 'ar' 
                        ? 'مرحباً بك! سيتم تسجيل حضورك بحسابك الرسمي.' 
                        : 'Welcome back! Your attendance will be linked to your account.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
                    <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-bold">
                      {lang === 'ar' 
                        ? 'أنت تسجل كضيف. يمكنك التسجيل في المنصة لاحقاً.' 
                        : 'You are registering as a guest.'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input type="text" required value={name} onChange={e=>setName(e.target.value)} disabled={isMember} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 disabled:opacity-60" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={isMember} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 disabled:opacity-60" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">
                    <Users size={16} className="inline mr-1 rtl:ml-1"/> 
                    {lang === 'ar' ? 'أعضاء الفريق وأدوارهم' : 'Team Members & Roles'}
                  </label>
                  <textarea 
                    value={teamMembers} 
                    onChange={e=>setTeamMembers(e.target.value)} 
                    placeholder={lang === 'ar' ? 'مثال: أحمد (مبرمج)، سارة (مصممة)' : 'e.g. Ahmed (Developer), Sara (Designer)'}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 min-h-[80px]" 
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">
                    <FileText size={16} className="inline mr-1 rtl:ml-1"/> 
                    {lang === 'ar' ? 'اشرح مشروعك / فكرتك' : 'Explain your Project/Idea'}
                  </label>
                  <textarea 
                    value={projectExplanation} 
                    onChange={e=>setProjectExplanation(e.target.value)} 
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 min-h-[100px]" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-1 block">
                      <Lightbulb size={16} className="inline mr-1 rtl:ml-1"/>
                      {lang === 'ar' ? 'ماذا ستستفيد من هذا المشروع؟' : 'Personal Benefit'}
                    </label>
                    <textarea 
                      value={personalBenefit} 
                      onChange={e=>setPersonalBenefit(e.target.value)} 
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 min-h-[80px]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-1 block">
                      <Globe size={16} className="inline mr-1 rtl:ml-1"/>
                      {lang === 'ar' ? 'ماذا ستستفيد الأمة / المجتمع؟' : 'National/Community Benefit'}
                    </label>
                    <textarea 
                      value={nationalBenefit} 
                      onChange={e=>setNationalBenefit(e.target.value)} 
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 min-h-[80px]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">
                    <Upload size={16} className="inline mr-1 rtl:ml-1"/>
                    {lang === 'ar' ? 'رفع ملف المشروع (PDF, PPTX, ZIP)' : 'Upload Project File'}
                  </label>
                  <div className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500 transition-colors bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer">
                    <input 
                      type="file" 
                      onChange={e=>setProjectFile(e.target.files[0])} 
                      className="hidden" 
                      id="project-upload" 
                      accept=".pdf,.pptx,.zip,.rar"
                    />
                    <label htmlFor="project-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                        {projectFile ? projectFile.name : (lang === 'ar' ? 'انقر لرفع الملف' : 'Click to upload file')}
                      </span>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <span className="animate-pulse">{lang === 'ar' ? 'جاري التأكيد...' : 'Confirming...'}</span> : <>{lang === 'ar' ? 'تأكيد التسجيل ورفع المشروع' : 'Confirm Registration & Upload'} <CheckCircle size={18}/></>}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{lang === 'ar' ? 'تم تأكيد تسجيلك بنجاح!' : 'Registration Confirmed!'}</h3>
                  <p className="text-slate-500">{lang === 'ar' ? 'تم إرسال نسخة من التذكرة إلى بريدك الإلكتروني.' : 'A copy of the ticket has been sent to your email.'}</p>
                </div>

                {/* Digital Ticket */}
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden max-w-sm mx-auto">
                  <div className="absolute left-[-10px] top-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full"></div>
                  <div className="absolute right-[-10px] top-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full"></div>
                  
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG value={ticketId} size={150} level="H" includeMargin={true} className="rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                  
                  <p className="font-mono font-bold text-xl text-slate-700 dark:text-slate-300 tracking-widest">{ticketId}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase">Ticket ID</p>
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
