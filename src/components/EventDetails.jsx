import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, PlayCircle, Megaphone, X, Mail, ChevronLeft, CheckCircle2, Trophy, Globe, ExternalLink, FileText, Video, CheckCircle, Upload, AlertTriangle, Lightbulb, Ticket, Calendar, Award, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import LocationMap from './ui/LocationMap';
import { sendEmailNotification } from '../utils/emailjs';
import { QRCodeSVG } from 'qrcode.react';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const IMAGES = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80'
];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, events, competitions } = useLanguage();
  const { currentUser } = useAuth();

  // Registration Form States
  const [step, setStep] = useState(1);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [teamMembers, setTeamMembers] = useState('');
  const [projectExplanation, setProjectExplanation] = useState('');
  const [personalBenefit, setPersonalBenefit] = useState('');
  const [nationalBenefit, setNationalBenefit] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMember = !!currentUser;
  const ticketId = `GITM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  const allEventsAndComps = [...events, ...competitions];
  const ev = allEventsAndComps.find(e => e.id.toString() === id);

  if (!ev) {
    return (
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="min-h-[60vh] flex flex-col items-center justify-center p-6 pb-24 text-center overflow-x-hidden"
      >
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {txt(lang, 'Event not found', 'الفعالية غير موجودة', 'Événement non trouvé', '事件未找到')}
        </h2>
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="btn-primary min-h-[44px] px-6 py-2.5 rounded-full flex items-center gap-2 font-bold"
        >
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} aria-hidden="true" />
          <span>{txt(lang, 'Back to Events', 'العودة للفعاليات', 'Retour aux événements', '返回事件')}</span>
        </button>
      </div>
    );
  }

  // Adding mock image and default type if not present
  const viewDetailsEvent = {
    ...ev,
    image: ev.image || IMAGES[parseInt(id) % IMAGES.length],
    type: ev.type || (ev.scope ? 'competition' : 'event')
  };

  const isHackathon = viewDetailsEvent.type === 'hackathon';
  const eventTitle = lang === 'ar' ? (viewDetailsEvent.title_ar || viewDetailsEvent.title) : (viewDetailsEvent.title_en || viewDetailsEvent.title);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (isHackathon && step < 4) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5); // Success step
      toast.success(txt(lang, 'Registration Confirmed', 'تم تأكيد التسجيل بنجاح', 'Inscription confirmée', '注册确认'));
    }, 1500);
  };

  const handleAddToCalendar = () => {
    const text = encodeURIComponent(viewDetailsEvent.title || viewDetailsEvent.titleEn || viewDetailsEvent.title_en || viewDetailsEvent.title_ar);
    const details = encodeURIComponent(viewDetailsEvent.description?.replace(/<[^>]+>/g, '') || '');
    const location = encodeURIComponent(viewDetailsEvent.mode === 'Online' ? viewDetailsEvent.virtualLink : viewDetailsEvent.location);
    const dates = `${(viewDetailsEvent.startDate || '').replace(/-/g, '')}T${(viewDetailsEvent.startTime || '').replace(/:/g, '')}00Z/${viewDetailsEvent.endDate ? viewDetailsEvent.endDate.replace(/-/g, '') : (viewDetailsEvent.startDate || '').replace(/-/g, '')}T${viewDetailsEvent.endTime ? viewDetailsEvent.endTime.replace(/:/g, '') : (viewDetailsEvent.startTime || '').replace(/:/g, '')}00Z`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen py-6 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-x-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300"
    >

      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">

        <button
          type="button"
          onClick={() => navigate('/events')}
          aria-label={txt(lang, 'Back to Events', 'العودة للفعاليات', 'Retour', '返回')}
          className="mb-4 sm:mb-6 min-h-[44px] px-2 -ms-2 inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 font-semibold transition-colors w-fit"
        >
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} aria-hidden="true" />
          <span>{txt(lang, 'Back to Events', 'العودة للفعاليات', 'Retour', '返回')}</span>
        </button>

        <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl border border-cyan-300 dark:border-slate-800 overflow-hidden">
          <div className="relative h-56 sm:h-96 w-full overflow-hidden">
            <img src={viewDetailsEvent.image} alt={eventTitle || 'Event Cover'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#e0fcfc] via-[#e0fcfc]/60 dark:from-slate-900 dark:via-slate-900/60 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6">
              <span className="inline-block px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-bold uppercase shadow-lg">
                {viewDetailsEvent.type || (viewDetailsEvent.scope ? txt(lang, 'Competition', 'مسابقة', 'Compétition', '竞赛') : 'Event')}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold tracking-tight text-[#0B132B] dark:text-white mt-2.5 sm:mt-3 break-words">
                {eventTitle}
              </h1>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-6 min-w-0">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Megaphone className="text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                    <span>{txt(lang, 'About The Event', 'حول الفعالية', 'À propos', '关于')}</span>
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg mb-6 break-words">
                    {lang === 'ar' ? viewDetailsEvent.description_ar : viewDetailsEvent.description_en}
                  </p>

                  {isHackathon && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5 sm:space-y-6">
                      <h3 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                        {lang === 'ar' ? 'معلومات الهاكاثون الشاملة' : 'Comprehensive Hackathon Details'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-2 flex items-center gap-2">
                            <Award size={16} className="text-yellow-600 dark:text-yellow-400 shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'الجوائز الكبرى' : 'Grand Prizes'}</span>
                          </p>
                          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 text-sm font-medium">
                            <li>{lang === 'ar' ? 'المركز الأول: 10,000 دولار' : '1st Place: $10,000'}</li>
                            <li>{lang === 'ar' ? 'المركز الثاني: 5,000 دولار' : '2nd Place: $5,000'}</li>
                            <li>{lang === 'ar' ? 'المركز الثالث: 2,500 دولار' : '3rd Place: $2,500'}</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-2 flex items-center gap-2">
                            <Target size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'مسارات الهاكاثون' : 'Hackathon Tracks'}</span>
                          </p>
                          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 text-sm font-medium">
                            <li>{lang === 'ar' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</li>
                            <li>{lang === 'ar' ? 'المدن الذكية والاستدامة' : 'Smart Cities & Sustainability'}</li>
                            <li>{lang === 'ar' ? 'التقنيات المالية والتعليمية' : 'FinTech & EdTech'}</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'شروط التقديم' : 'Submission Rules'}</span>
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {lang === 'ar' ? 'يجب أن يكون المشروع نموذجاً أولياً قابلاً للعمل (MVP). يجب رفع العرض التقديمي (Pitch Deck)، فيديو قصير يشرح الفكرة، وبيانات فريق العمل المكون من 2 إلى 5 أعضاء.' : 'Must be a working MVP. You must submit a Pitch Deck, a short demo video, and the details of your 2-5 member team.'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-2 flex items-center gap-2">
                            <Globe size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'الفائدة المجتمعية (ماذا ستستفيد الأمة؟)' : 'Societal Impact'}</span>
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {lang === 'ar' ? 'سيتم تقييم المشاريع بشكل أساسي على مدى قدرتها على حل مشكلات حقيقية وتقديم قيمة مضافة وفوائد مستدامة للمجتمع وللأمة.' : 'Projects will be judged heavily on their ability to solve real-world problems and provide sustainable value and benefits to society.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {viewDetailsEvent.status === 'completed' && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-cyan-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <PlayCircle className="text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                      <span>{txt(lang, 'Event Recap', 'ملخص الفعالية', 'Résumé', '回顾')}</span>
                    </h2>
                    <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer border border-white/10 shadow-lg">
                      <img src={viewDetailsEvent.image} alt={txt(lang, 'Event recap preview', 'معاينة ملخص الفعالية', 'Aperçu du résumé', '活动回顾预览')} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                      <PlayCircle size={56} className="text-white z-10 group-hover:scale-110 transition-transform drop-shadow-sm" aria-hidden="true" />
                    </div>
                  </div>
                )}

                {/* Media & Resources Section */}
                <div className="bg-cyan-50/50 dark:bg-slate-800/30 p-4 sm:p-6 rounded-2xl border border-cyan-100 dark:border-slate-700/50 mt-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Video className="text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                    <span>{txt(lang, 'Media & Resources', 'الوسائط والموارد', 'Médias et ressources', '媒体与资源')}</span>
                  </h2>

                  {/* Promotional Videos */}
                  <div className="mb-7 sm:mb-8">
                    <h3 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-slate-200 mb-3 sm:mb-4">
                      {txt(lang, 'Promotional Videos', 'فيديوهات ترويجية', 'Vidéos promotionnelles', '宣传片')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[IMAGES[1], IMAGES[2]].map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden aspect-video bg-white dark:bg-slate-900 group cursor-pointer shadow-md border border-slate-200 dark:border-slate-700">
                          <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" alt={`Promo Video ${idx + 1}`} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-cyan-600/90 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-colors shadow-lg">
                              <PlayCircle size={24} className="text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 end-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-semibold">
                            0{idx + 2}:45
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div className="mb-7 sm:mb-8">
                    <h3 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-slate-200 mb-3 sm:mb-4">
                      {txt(lang, 'Image Gallery', 'معرض الصور', "Galerie d'images", '图片库')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {IMAGES.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200 dark:border-slate-700">
                          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Gallery ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-slate-200 mb-3 sm:mb-4">
                      {txt(lang, 'Presentation Files', 'ملفات التقديم', 'Fichiers de présentation', '演示文件')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg shrink-0" aria-hidden="true">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200 break-words">
                              {txt(lang, 'Project Presentation Template', 'قالب تقديم المشروع', 'Modèle de présentation', '项目演示模板')}.pptx
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">5.2 MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={txt(lang, 'Download Project Presentation Template', 'تحميل قالب تقديم المشروع', 'Télécharger le modèle', '下载项目演示模板')}
                          className="min-h-[44px] w-full sm:w-auto px-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-sm font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors shrink-0"
                        >
                          {txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0" aria-hidden="true">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200 break-words">
                              {txt(lang, 'Guidelines & Rules', 'القواعد والإرشادات', 'Règlement', '指南与规则')}.pdf
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">1.1 MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={txt(lang, 'Download Guidelines & Rules', 'تحميل القواعد والإرشادات', 'Télécharger le règlement', '下载指南与规则')}
                          className="min-h-[44px] w-full sm:w-auto px-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-sm font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors shrink-0"
                        >
                          {txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 min-w-0">
                <div className="bg-cyan-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-cyan-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="text-cyan-600 dark:text-cyan-400 mt-1 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">{txt(lang, 'Start Date', 'تاريخ البدء', 'Début', '开始')}</p>
                      <p className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-white break-words">
                        {new Date(viewDetailsEvent.date).toLocaleDateString()} {viewDetailsEvent.date.includes('T') && `- ${new Date(viewDetailsEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  {viewDetailsEvent.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-amber-600 dark:text-amber-400 mt-1 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">{txt(lang, 'End Date', 'تاريخ الانتهاء', 'Fin', '结束')}</p>
                        <p className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-white">{new Date(viewDetailsEvent.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-indigo-600 dark:text-indigo-400 mt-1 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">{txt(lang, 'Location', 'الموقع', 'Lieu', '位置')}</p>
                        <p className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-white break-words">{viewDetailsEvent.location}</p>
                      </div>
                    </div>
                    <div className="h-48 mt-2 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <LocationMap locationName={viewDetailsEvent.location} />
                    </div>
                  </div>
                  {viewDetailsEvent.contactDate && (
                    <div className="flex items-start gap-3 border-t border-cyan-200 dark:border-slate-700 pt-4 mt-2">
                      <Mail className="text-purple-600 dark:text-purple-400 mt-1 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">{txt(lang, 'Results Announcement', 'تاريخ إعلان النتائج', 'Annonce', '公告')}</p>
                        <p className="font-bold text-sm sm:text-base text-purple-700 dark:text-purple-400">{new Date(viewDetailsEvent.contactDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Section */}
          {(viewDetailsEvent.status === 'upcoming' || viewDetailsEvent.status === 'open') && (
            <div className="mx-4 sm:mx-8 mb-6 sm:mb-8 mt-4 md:mt-8 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-8 border border-cyan-200 dark:border-slate-700 shadow-lg" id="registration-section">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                  <Ticket className="text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                  <span>{txt(lang, 'Event Registration', 'التسجيل في الفعالية', 'Inscription', '注册活动')}</span>
                </h2>
                {isHackathon && step < 5 && (
                  <span className="self-start sm:self-auto bg-cyan-100 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-200 py-1 px-3 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                    {lang === 'ar' ? `الخطوة ${step} من 4` : `Step ${step} of 4`}
                  </span>
                )}
              </div>

              {step < 5 ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  {/* Hackathon Wizard Indicator */}
                  {isHackathon && (
                    <div className="flex justify-between items-center mb-8 relative isolate" aria-label={lang === 'ar' ? `الخطوة ${step} من 4` : `Step ${step} of 4`}>
                      <div className="absolute inset-x-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
                      <div
                        className="absolute start-0 top-1/2 h-1 bg-cyan-500 -z-10 -translate-y-1/2 transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      ></div>

                      {[1, 2, 3, 4].map(num => (
                        <div
                          key={num}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${step >= num ? 'bg-cyan-600 border-cyan-200 text-white shadow-lg shadow-cyan-500/40' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}
                        >
                          {step > num ? <CheckCircle size={16} aria-hidden="true" /> : num}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ALWAYS SHOW PERSONAL INFO (Step 1 for Hackathon, only step for others) */}
                  {(!isHackathon || step === 1) && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 sm:space-y-6">
                      {isMember ? (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-start gap-3 border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle className="shrink-0 mt-0.5" size={20} aria-hidden="true" />
                          <p className="text-sm font-bold">
                            {lang === 'ar' ? 'مرحباً بك! سيتم تسجيل حضورك بحسابك الرسمي.' : 'Welcome back! Your attendance will be linked to your account.'}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex items-start gap-3 border border-blue-200 dark:border-blue-800/50">
                          <AlertTriangle className="shrink-0 mt-0.5" size={20} aria-hidden="true" />
                          <p className="text-sm font-bold">
                            {lang === 'ar' ? 'أنت تسجل كضيف. يمكنك التسجيل في المنصة لاحقاً.' : 'You are registering as a guest.'}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <div>
                          <label htmlFor="event-reg-name" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                            {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                          </label>
                          <input
                            id="event-reg-name"
                            type="text"
                            required
                            autoComplete="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={isMember}
                            className="w-full min-h-[48px] p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label htmlFor="event-reg-email" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                            {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                          </label>
                          <input
                            id="event-reg-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isMember}
                            className="w-full min-h-[48px] p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      {isHackathon && (
                        <div>
                          <label htmlFor="event-reg-team" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Users size={18} className="shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'أعضاء الفريق والاختصاصات التقنية' : 'Team Members & Technical Roles'}</span>
                          </label>
                          <textarea
                            id="event-reg-team"
                            value={teamMembers}
                            onChange={e => setTeamMembers(e.target.value)}
                            required
                            placeholder={lang === 'ar' ? 'مثال: أحمد (مهندس برمجيات)، سارة (مصممة واجهات UI/UX)' : 'e.g. Ahmed (Software Engineer), Sara (UI/UX Designer)'}
                            className="w-full p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[100px]"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* HACKATHON STEP 2: PITCH & IMPACT */}
                  {(isHackathon && step === 2) && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 sm:space-y-6">
                      <div>
                        <label htmlFor="event-reg-pitch" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <FileText size={18} className="shrink-0" aria-hidden="true" />
                          <span>{lang === 'ar' ? 'الملخص التنفيذي وفكرة المشروع' : 'Executive Summary & Project Pitch'}</span>
                        </label>
                        <textarea
                          id="event-reg-pitch"
                          value={projectExplanation}
                          onChange={e => setProjectExplanation(e.target.value)}
                          required
                          className="w-full p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[120px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <div>
                          <label htmlFor="event-reg-personal-benefit" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Lightbulb size={18} className="shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'الأهداف المرجوة والأثر الشخصي' : 'Expected Impact & Learning Goals'}</span>
                          </label>
                          <textarea
                            id="event-reg-personal-benefit"
                            value={personalBenefit}
                            onChange={e => setPersonalBenefit(e.target.value)}
                            required
                            className="w-full p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="event-reg-national-benefit" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Globe size={18} className="shrink-0" aria-hidden="true" />
                            <span>{lang === 'ar' ? 'الأثر المجتمعي وقابلية التوسع (Scalability)' : 'Social Impact & Scalability'}</span>
                          </label>
                          <textarea
                            id="event-reg-national-benefit"
                            value={nationalBenefit}
                            onChange={e => setNationalBenefit(e.target.value)}
                            required
                            className="w-full p-3.5 sm:p-4 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#1e3a5f] dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[100px]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* HACKATHON STEP 3: FILE UPLOADS */}
                  {(isHackathon && step === 3) && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Upload size={18} className="shrink-0" aria-hidden="true" />
                          <span>{lang === 'ar' ? 'العرض التقديمي (Pitch Deck) أو المخطط التقني أو صور المخطط' : 'Pitch Deck, Technical Architecture, or Wireframes'}</span>
                        </span>
                        <div className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer group">
                          <input
                            type="file"
                            onChange={e => setProjectFile(e.target.files[0])}
                            className="hidden"
                            id="project-upload"
                            required
                            accept=".pdf,.pptx,.zip,.rar,.jpg,.jpeg,.png"
                          />
                          <label htmlFor="project-upload" className="cursor-pointer flex flex-col items-center text-center min-h-[44px] justify-center">
                            <Upload className="w-11 h-11 sm:w-12 sm:h-12 text-slate-500 dark:text-slate-400 mb-3 group-hover:text-cyan-600 transition-colors" aria-hidden="true" />
                            <span className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-bold mb-2 break-all">
                              {projectFile ? projectFile.name : (lang === 'ar' ? 'انقر لرفع الملفات (PDF, PPTX, صور، ZIP)' : 'Click to upload files (PDF, PPTX, Images, ZIP)')}
                            </span>
                            {!projectFile && (
                              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-2">
                                {lang === 'ar' ? 'يمكنك رفع الصور مباشرة (JPG, PNG) أو المستندات.' : 'You can upload images (JPG, PNG) directly or documents.'}
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* HACKATHON STEP 4: REVIEW */}
                  {(isHackathon && step === 4) && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-base sm:text-lg mb-4 text-[#1e3a5f] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                          {lang === 'ar' ? 'مراجعة بيانات التسجيل' : 'Review Registration Data'}
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 break-words">
                          <li><strong className="text-slate-900 dark:text-slate-100">{lang === 'ar' ? 'الاسم:' : 'Name:'}</strong> {name}</li>
                          <li><strong className="text-slate-900 dark:text-slate-100">{lang === 'ar' ? 'البريد:' : 'Email:'}</strong> {email}</li>
                          <li><strong className="text-slate-900 dark:text-slate-100">{lang === 'ar' ? 'أعضاء الفريق:' : 'Team Members:'}</strong> {teamMembers}</li>
                          <li><strong className="text-slate-900 dark:text-slate-100">{lang === 'ar' ? 'الفكرة:' : 'Pitch:'}</strong> {projectExplanation?.substring(0, 50)}...</li>
                          <li><strong className="text-slate-900 dark:text-slate-100">{lang === 'ar' ? 'الملف المرفق:' : 'Attached File:'}</strong> {projectFile ? projectFile.name : '-'}</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Form Controls */}
                  <div className={`flex flex-col-reverse sm:flex-row gap-3 ${isHackathon && step > 1 ? 'sm:justify-between' : 'sm:justify-end'} pt-4 mt-6 border-t border-slate-100 dark:border-slate-700`}>
                    {isHackathon && step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-h-[48px] px-8 sm:px-10 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">{lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                      ) : (
                        <>
                          <span>{(!isHackathon || step === 4) ? (lang === 'ar' ? 'تأكيد التسجيل النهائي' : 'Confirm Registration') : (lang === 'ar' ? 'التالي' : 'Next Step')}</span>
                          {(!isHackathon || step === 4)
                            ? <CheckCircle size={18} aria-hidden="true" />
                            : <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} aria-hidden="true" />}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div role="status" aria-live="polite" className="text-center space-y-6 py-8 sm:py-12">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <CheckCircle size={44} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
                      {lang === 'ar' ? 'تم تأكيد تسجيلك بنجاح!' : 'Registration Confirmed!'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                      {lang === 'ar' ? 'تم إرسال نسخة من التذكرة وتفاصيل الفعالية إلى بريدك الإلكتروني.' : 'A copy of the ticket has been sent to your email.'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden max-w-sm mx-auto shadow-inner">
                    <div className="absolute -start-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full" aria-hidden="true"></div>
                    <div className="absolute -end-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full" aria-hidden="true"></div>

                    <div className="flex justify-center mb-5 sm:mb-6">
                      <QRCodeSVG value={ticketId} size={180} level="H" includeMargin={true} className="rounded-xl border border-slate-200 shadow-sm max-w-full h-auto" />
                    </div>

                    <p dir="ltr" className="font-mono font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-200 tracking-widest break-all">{ticketId}</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 uppercase font-bold">Ticket ID</p>
                  </div>

                  <div className="flex justify-center pt-4 sm:pt-6">
                    <button
                      type="button"
                      onClick={handleAddToCalendar}
                      className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-base"
                    >
                      <Calendar size={20} aria-hidden="true" />
                      <span>{lang === 'ar' ? 'أضف للتقويم' : 'Add to Calendar'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
