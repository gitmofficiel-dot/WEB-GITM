import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, PlayCircle, Megaphone, X, Mail, ChevronLeft, CheckCircle2, Trophy, Globe, ExternalLink, FileText, Video, CheckCircle, Upload, AlertTriangle, Lightbulb, Ticket, Calendar } from 'lucide-react';
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{txt(lang, 'Event not found', 'الفعالية غير موجودة', 'Événement non trouvé', '事件未找到')}</h2>
        <button onClick={() => navigate('/events')} className="btn-primary px-6 py-2 rounded-full flex items-center gap-2">
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} /> {txt(lang, 'Back to Events', 'العودة للفعاليات', 'Retour aux événements', '返回事件')}
        </button>
      </div>
    );
  }

  // Adding mock image if not present
  const viewDetailsEvent = {
    ...ev,
    image: ev.image || IMAGES[parseInt(id) % IMAGES.length]
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
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
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
        
        <button onClick={() => navigate('/events')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors w-fit">
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          {txt(lang, 'Back to Events', 'العودة للفعاليات', 'Retour', '返回')}
        </button>

        <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl border border-cyan-300 dark:border-slate-800 overflow-hidden">
          <div className="relative h-64 sm:h-96 w-full overflow-hidden">
            <img src={viewDetailsEvent.image} alt="Event Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#e0fcfc] dark:from-slate-900 to-transparent" />
            <div className="absolute bottom-6 left-6 rtl:right-6 rtl:left-auto">
              <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-xs font-bold uppercase shadow-lg">
                {viewDetailsEvent.type || (viewDetailsEvent.scope ? txt(lang, 'Competition', 'مسابقة', 'Compétition', '竞赛') : 'Event')}
              </span>
              <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-[#1e3a5f] dark:text-white mt-3 drop-shadow-lg">
                {lang === 'ar' ? viewDetailsEvent.title_ar : viewDetailsEvent.title_en}
              </h2>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Megaphone className="text-cyan-500" /> {txt(lang, 'About The Event', 'حول الفعالية', 'À propos', '关于')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {lang === 'ar' ? viewDetailsEvent.description_ar : viewDetailsEvent.description_en}
                  </p>
                </div>
                
                {viewDetailsEvent.status === 'completed' && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-cyan-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <PlayCircle className="text-cyan-500" /> {txt(lang, 'Event Recap', 'ملخص الفعالية', 'Résumé', '回顾')}
                    </h3>
                    <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer border border-white/10 shadow-lg">
                      <img src={viewDetailsEvent.image} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                      <PlayCircle size={64} className="text-white z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    </div>
                  </div>
                )}

                {/* Media & Resources Section */}
                <div className="bg-cyan-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-cyan-100 dark:border-slate-700/50 mt-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Video className="text-cyan-500" /> {txt(lang, 'Media & Resources', 'الوسائط والموارد', 'Médias et ressources', '媒体与资源')}
                  </h3>
                  
                  {/* Promotional Videos */}
                  <div className="mb-8">
                    <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-slate-200 mb-4">{txt(lang, 'Promotional Videos', 'فيديوهات ترويجية', 'Vidéos promotionnelles', '宣传片')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[IMAGES[1], IMAGES[2]].map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden aspect-video bg-white dark:bg-slate-900 group cursor-pointer shadow-md border border-slate-200 dark:border-slate-700">
                          <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" alt={`Promo Video ${idx+1}`} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-cyan-500/90 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-cyan-400 transition-colors shadow-lg">
                              <PlayCircle size={24} className="text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                            0{idx+2}:45
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div className="mb-8">
                    <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-slate-200 mb-4">{txt(lang, 'Image Gallery', 'معرض الصور', 'Galerie d\'images', '图片库')}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {IMAGES.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200 dark:border-slate-700">
                          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Gallery ${idx+1}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-slate-200 mb-4">{txt(lang, 'Presentation Files', 'ملفات التقديم', 'Fichiers de présentation', '演示文件')}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg"><FileText size={20} /></div>
                          <div>
                            <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200">{txt(lang, 'Project Presentation Template', 'قالب تقديم المشروع', 'Modèle de présentation', '项目演示模板')}.pptx</p>
                            <p className="text-xs text-slate-500">5.2 MB</p>
                          </div>
                        </div>
                        <button className="text-cyan-600 dark:text-cyan-400 text-sm font-bold hover:underline">{txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-500 rounded-lg"><FileText size={20} /></div>
                          <div>
                            <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200">{txt(lang, 'Guidelines & Rules', 'القواعد والإرشادات', 'Règlement', '指南与规则')}.pdf</p>
                            <p className="text-xs text-slate-500">1.1 MB</p>
                          </div>
                        </div>
                        <button className="text-cyan-600 dark:text-cyan-400 text-sm font-bold hover:underline">{txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-cyan-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-cyan-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="text-cyan-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">{txt(lang, 'Start Date', 'تاريخ البدء', 'Début', '开始')}</p>
                      <p className="font-bold">{new Date(viewDetailsEvent.date).toLocaleDateString()} {viewDetailsEvent.date.includes('T') && `- ${new Date(viewDetailsEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</p>
                    </div>
                  </div>
                  {viewDetailsEvent.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-amber-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500">{txt(lang, 'End Date', 'تاريخ الانتهاء', 'Fin', '结束')}</p>
                        <p className="font-bold">{new Date(viewDetailsEvent.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-indigo-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500">{txt(lang, 'Location', 'الموقع', 'Lieu', '位置')}</p>
                        <p className="font-bold">{viewDetailsEvent.location}</p>
                      </div>
                    </div>
                    <div className="h-48 mt-2 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <LocationMap locationName={viewDetailsEvent.location} />
                    </div>
                  </div>
                  {viewDetailsEvent.contactDate && (
                    <div className="flex items-start gap-3 border-t border-cyan-200 dark:border-slate-700 pt-4 mt-2">
                      <Mail className="text-purple-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500">{txt(lang, 'Results Announcement', 'تاريخ إعلان النتائج', 'Annonce', '公告')}</p>
                        <p className="font-bold text-purple-600 dark:text-purple-400">{new Date(viewDetailsEvent.contactDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>

            {/* Registration Section */}
            {(viewDetailsEvent.status === 'upcoming' || viewDetailsEvent.status === 'open') && (
              <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-cyan-200 dark:border-slate-700 shadow-lg" id="registration-section">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
                  <Ticket className="text-cyan-500" /> {txt(lang, 'Event Registration', 'التسجيل في الفعالية', 'Inscription', '注册活动')}
                </h3>

                {step === 1 ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    {isMember ? (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-800/50">
                        <CheckCircle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-bold">
                          {lang === 'ar' ? 'مرحباً بك! سيتم تسجيل حضورك بحسابك الرسمي.' : 'Welcome back! Your attendance will be linked to your account.'}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
                        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-bold">
                          {lang === 'ar' ? 'أنت تسجل كضيف. يمكنك التسجيل في المنصة لاحقاً.' : 'You are registering as a guest.'}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                        <input type="text" required value={name} onChange={e=>setName(e.target.value)} disabled={isMember} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 disabled:opacity-60" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={isMember} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 disabled:opacity-60" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-2 block">
                        <Users size={18} className="inline mr-2 rtl:ml-2"/> 
                        {lang === 'ar' ? 'أعضاء الفريق والاختصاصات التقنية' : 'Team Members & Technical Roles'}
                      </label>
                      <textarea 
                        value={teamMembers} 
                        onChange={e=>setTeamMembers(e.target.value)} 
                        placeholder={lang === 'ar' ? 'مثال: أحمد (مهندس برمجيات)، سارة (مصممة واجهات UI/UX)' : 'e.g. Ahmed (Software Engineer), Sara (UI/UX Designer)'}
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 min-h-[100px]" 
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-2 block">
                        <FileText size={18} className="inline mr-2 rtl:ml-2"/> 
                        {lang === 'ar' ? 'الملخص التنفيذي وفكرة المشروع' : 'Executive Summary & Project Pitch'}
                      </label>
                      <textarea 
                        value={projectExplanation} 
                        onChange={e=>setProjectExplanation(e.target.value)} 
                        required
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 min-h-[120px]" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-bold text-slate-500 mb-2 block">
                          <Lightbulb size={18} className="inline mr-2 rtl:ml-2"/>
                          {lang === 'ar' ? 'الأهداف المرجوة والأثر الشخصي' : 'Expected Impact & Learning Goals'}
                        </label>
                        <textarea 
                          value={personalBenefit} 
                          onChange={e=>setPersonalBenefit(e.target.value)} 
                          required
                          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 min-h-[100px]" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-500 mb-2 block">
                          <Globe size={18} className="inline mr-2 rtl:ml-2"/>
                          {lang === 'ar' ? 'الأثر المجتمعي وقابلية التوسع (Scalability)' : 'Social Impact & Scalability'}
                        </label>
                        <textarea 
                          value={nationalBenefit} 
                          onChange={e=>setNationalBenefit(e.target.value)} 
                          required
                          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-cyan-500 min-h-[100px]" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-2 block">
                        <Upload size={18} className="inline mr-2 rtl:ml-2"/>
                        {lang === 'ar' ? 'العرض التقديمي (Pitch Deck) أو المخطط التقني' : 'Pitch Deck or Technical Architecture'}
                      </label>
                      <div className="w-full p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer group">
                        <input 
                          type="file" 
                          onChange={e=>setProjectFile(e.target.files[0])} 
                          className="hidden" 
                          id="project-upload" 
                          accept=".pdf,.pptx,.zip,.rar"
                        />
                        <label htmlFor="project-upload" className="cursor-pointer flex flex-col items-center">
                          <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-cyan-500 transition-colors" />
                          <span className="text-base text-slate-600 dark:text-slate-400 font-bold">
                            {projectFile ? projectFile.name : (lang === 'ar' ? 'انقر هنا لرفع الملف (PDF, PPTX, ZIP)' : 'Click to upload your file (PDF, PPTX, ZIP)')}
                          </span>
                        </label>
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex justify-center items-center gap-2 text-lg">
                      {isSubmitting ? <span className="animate-pulse">{lang === 'ar' ? 'جاري التأكيد...' : 'Confirming...'}</span> : <>{lang === 'ar' ? 'تأكيد التسجيل ورفع المشروع' : 'Confirm Registration & Upload'} <CheckCircle size={20}/></>}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-6 py-12">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={48} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">{lang === 'ar' ? 'تم تأكيد تسجيلك بنجاح!' : 'Registration Confirmed!'}</h3>
                      <p className="text-slate-500 text-lg">{lang === 'ar' ? 'تم إرسال نسخة من التذكرة وتفاصيل الفعالية إلى بريدك الإلكتروني.' : 'A copy of the ticket has been sent to your email.'}</p>
                    </div>

                    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden max-w-sm mx-auto shadow-inner">
                      <div className="absolute left-[-15px] top-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full"></div>
                      <div className="absolute right-[-15px] top-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full"></div>
                      
                      <div className="flex justify-center mb-6">
                        <QRCodeSVG value={ticketId} size={180} level="H" includeMargin={true} className="rounded-xl border border-slate-200 shadow-sm" />
                      </div>
                      
                      <p className="font-mono font-bold text-2xl text-slate-700 dark:text-slate-300 tracking-widest">{ticketId}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 uppercase font-bold">Ticket ID</p>
                    </div>

                    <div className="flex justify-center pt-6">
                      <button onClick={handleAddToCalendar} className="px-8 py-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-base">
                        <Calendar size={20}/> {lang === 'ar' ? 'أضف للتقويم' : 'Add to Calendar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
