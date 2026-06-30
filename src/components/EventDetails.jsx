import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, PlayCircle, Megaphone, X, Mail, ChevronLeft, CheckCircle2, Trophy, Globe, ExternalLink, FileText, Video } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import LocationMap from './ui/LocationMap';
import { sendEmailNotification } from '../utils/emailjs';

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
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegister = async () => {
    if (!currentUser) {
      toast.info(txt(lang, 'Please log in to register.', 'يرجى تسجيل الدخول أولاً للتسجيل.', 'Veuillez vous connecter.', '请先登录。'));
      navigate('/login');
      return;
    }

    try {
      setIsRegistering(true);
      const q = query(
        collection(db, 'event_registrations'), 
        where('eventId', '==', id), 
        where('userEmail', '==', currentUser.email)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        toast.warning(txt(lang, 'You are already registered!', 'أنت مسجل بالفعل في هذه الفعالية!', 'Vous êtes déjà inscrit!', '您已注册！'));
        return;
      }

      await addDoc(collection(db, 'event_registrations'), {
        eventId: id,
        eventTitle: ev.title_en || ev.title_ar || 'Event',
        userEmail: currentUser.email,
        userName: currentUser.name || '',
        registeredAt: serverTimestamp()
      });

      // Send Email Notification
      await sendEmailNotification('template_event_registration', {
        to_email: currentUser.email,
        to_name: currentUser.name,
        event_title: ev.title_en || ev.title_ar || 'GITM Event',
        event_date: ev.date,
        event_location: ev.location
      });

      toast.success(txt(lang, 'Registered successfully! An email confirmation has been sent. 🎉', 'تم تسجيلك بنجاح! تم إرسال بريد إلكتروني للتأكيد. 🎉', 'Inscription réussie ! Un email de confirmation a été envoyé. 🎉', '注册成功！已发送确认电子邮件。🎉'));
    } catch (err) {
      console.error(err);
      toast.error(txt(lang, 'Registration failed.', 'فشل التسجيل. حاول مرة أخرى.', 'Échec.', '失败。'));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
        
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
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Video className="text-cyan-500" /> {txt(lang, 'Media & Resources', 'الوسائط والموارد', 'Médias et ressources', '媒体与资源')}
                  </h3>
                  
                  {/* Video Placeholder */}
                  <div className="mb-6 relative rounded-xl overflow-hidden aspect-video bg-white dark:bg-slate-900 group cursor-pointer shadow-lg">
                    <img src={viewDetailsEvent.image || IMAGES[1]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Video cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-cyan-500/80 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
                        <PlayCircle size={32} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg"><FileText size={20} /></div>
                        <div>
                          <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200">{txt(lang, 'Event Agenda', 'برنامج الفعالية', 'Programme', '日程安排')}.pdf</p>
                          <p className="text-xs text-slate-500">2.4 MB</p>
                        </div>
                      </div>
                      <button className="text-cyan-600 dark:text-cyan-400 text-sm font-bold hover:underline">{txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}</button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-500 rounded-lg"><FileText size={20} /></div>
                        <div>
                          <p className="font-bold text-sm text-[#1e3a5f] dark:text-slate-200">{txt(lang, 'Guidelines & Rules', 'القواعد والإرشادات', 'Règlement', '指南与规则')}.docx</p>
                          <p className="text-xs text-slate-500">1.1 MB</p>
                        </div>
                      </div>
                      <button className="text-cyan-600 dark:text-cyan-400 text-sm font-bold hover:underline">{txt(lang, 'Download', 'تحميل', 'Télécharger', '下载')}</button>
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

                {(viewDetailsEvent.status === 'upcoming' || viewDetailsEvent.status === 'open') && (
                  <button 
                    onClick={handleRegister} 
                    disabled={isRegistering}
                    className="w-full btn-primary py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all disabled:opacity-50"
                  >
                    {isRegistering ? '...' : txt(lang, 'Official Registration', 'تسجيل رسمي', 'Inscription', '注册')} {!isRegistering && <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
