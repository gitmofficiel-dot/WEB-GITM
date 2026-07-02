import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Video, Users, Clock, Plus, Trash2, Save, 
  X, ArrowLeft, Bot, CheckCircle, Activity, Image as ImageIcon, Map, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from '../../utils/toast';

const EVENT_TYPES = ['Workshop', 'Hackathon', 'Training', 'Meetup', 'Conference'];

export default function SmartEventEditor({ initialData, onCancel, onSave, standalone }) {
  const { lang, user } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isLoading, setIsLoading] = useState(standalone && !!id);
  
  // Basic Info
  const [title, setTitle] = useState(initialData?.title || '');
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [eventType, setEventType] = useState(initialData?.eventType || 'Workshop');
  
  // Timing
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');

  // Location & Modes
  const [mode, setMode] = useState(initialData?.mode || 'Offline'); // Online, Offline, Hybrid
  const [locationStr, setLocationStr] = useState(initialData?.location || '');
  const [virtualLink, setVirtualLink] = useState(initialData?.virtualLink || '');

  // RSVP & Capacity
  const [maxCapacity, setMaxCapacity] = useState(initialData?.maxCapacity || 50);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(initialData?.isRegistrationOpen ?? true);

  // Agenda Builder
  const [agenda, setAgenda] = useState(initialData?.agenda || []);
  const [newAgendaItem, setNewAgendaItem] = useState({ time: '', title: '', desc: '' });

  // Speakers (Mocking selection for now, could be dynamic)
  const [speakers, setSpeakers] = useState(initialData?.speakers || []);
  const [speakerInput, setSpeakerInput] = useState('');

  // Image & Rich Media
  const [coverImage, setCoverImage] = useState(initialData?.imageUrl || null);
  const [imageFile, setImageFile] = useState(null);
  const [fbVideo, setFbVideo] = useState(initialData?.fbVideo || '');
  const [ytVideo, setYtVideo] = useState(initialData?.ytVideo || '');
  const [attachments, setAttachments] = useState(initialData?.attachments || []);
  const fileInputRef = useRef(null);

  // States
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [marketingCopy, setMarketingCopy] = useState('');

  // --- Auto-Save Drafts & Standalone Load ---
  useEffect(() => {
    if (standalone && id) {
      const fetchEvent = async () => {
        try {
          const docRef = doc(db, 'events', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setTitleEn(data.titleEn || '');
            setDescription(data.description || '');
            setEventType(data.eventType || 'Workshop');
            setStartDate(data.startDate || '');
            setStartTime(data.startTime || '');
            setEndDate(data.endDate || '');
            setEndTime(data.endTime || '');
            setMode(data.mode || 'Offline');
            setLocationStr(data.location || '');
            setVirtualLink(data.virtualLink || '');
            setMaxCapacity(data.maxCapacity || 50);
            setIsRegistrationOpen(data.isRegistrationOpen ?? true);
            setAgenda(data.agenda || []);
            setSpeakers(data.speakers || []);
            setCoverImage(data.imageUrl || data.mainImage || null);
            setFbVideo(data.fbVideo || '');
            setYtVideo(data.ytVideo || '');
            setAttachments(data.attachments || []);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error(lang === 'ar' ? 'فشل جلب الفعالية' : 'Failed to fetch event');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEvent();
    } else if (!initialData) {
      const savedDraft = localStorage.getItem('gitm_event_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.title) setTitle(draft.title);
          if (draft.titleEn) setTitleEn(draft.titleEn);
          if (draft.description) setDescription(draft.description);
          if (draft.eventType) setEventType(draft.eventType);
          if (draft.startDate) setStartDate(draft.startDate);
          if (draft.mode) setMode(draft.mode);
        } catch (e) {
          console.error('Failed to parse draft', e);
        }
      }
      setIsLoading(false);
    }
  }, [standalone, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description) {
        localStorage.setItem('gitm_event_draft', JSON.stringify({ 
          title, titleEn, description, eventType, startDate, mode 
        }));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, titleEn, description, eventType, startDate, mode]);

  const handleAddAgenda = () => {
    if (newAgendaItem.time && newAgendaItem.title) {
      setAgenda([...agenda, { ...newAgendaItem, id: Date.now() }]);
      setNewAgendaItem({ time: '', title: '', desc: '' });
    }
  };

  const handleRemoveAgenda = (id) => {
    setAgenda(agenda.filter(a => a.id !== id));
  };

  const handleAddSpeaker = (e) => {
    if (e.key === 'Enter' && speakerInput.trim()) {
      e.preventDefault();
      if (!speakers.includes(speakerInput.trim())) {
        setSpeakers([...speakers, speakerInput.trim()]);
      }
      setSpeakerInput('');
    }
  };

  const handleGenerateMarketing = () => {
    setAiLoading(true);
    setTimeout(() => {
      setMarketingCopy(lang === 'ar' 
        ? `🚀 هل أنتم مستعدون لتجربة استثنائية؟\nانضموا إلينا في "${title}" لتوسيع مدارككم وبناء شبكة علاقات قوية مع خبراء التقنية.\n\n📅 الموعد: ${startDate}\n📍 المكان: ${mode === 'Online' ? 'أونلاين عبر Zoom' : locationStr}\n\nمقاعد محدودة (${maxCapacity} فقط). سجلوا الآن ولا تفوتوا الفرصة! 🔥 #GITM #Tech #Innovation`
        : `🚀 Ready for an exceptional experience?\nJoin us at "${titleEn || title}" to expand your horizons and network with tech experts.\n\n📅 Date: ${startDate}\n📍 Location: ${mode === 'Online' ? 'Online via Zoom' : locationStr}\n\nLimited seats (${maxCapacity} only). Register now and don't miss out! 🔥 #GITM #Tech #Innovation`);
      setAiLoading(false);
    }, 2000);
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCoverImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleCancelClick = () => {
    if (standalone) {
      setShowDraftModal(true);
    } else {
      if (onCancel) onCancel();
    }
  };

  const handleConfirmDraft = async (saveAsDraft) => {
    if (saveAsDraft) {
      setIsSaving(true);
      try {
        const eventData = {
          title, titleEn, description, eventType, mode,
          location: locationStr, virtualLink,
          startDate, startTime, endDate, endTime,
          maxCapacity: Number(maxCapacity),
          isRegistrationOpen,
          agenda, speakers,
          fbVideo, ytVideo, attachments,
          imageUrl: coverImage,
          author: user?.displayName || 'Admin',
          status: 'draft',
          updatedAt: serverTimestamp(),
        };

        if (id) {
          await updateDoc(doc(db, 'events', id), eventData);
        } else {
          eventData.createdAt = serverTimestamp();
          await addDoc(collection(db, 'events'), eventData);
        }
        toast.success(lang === 'ar' ? 'تم الحفظ كمسودة بنجاح' : 'Draft saved successfully');
      } catch (error) {
        console.error(error);
        toast.error(lang === 'ar' ? 'فشل حفظ المسودة' : 'Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    }
    
    if (standalone && !id) localStorage.removeItem('gitm_event_draft');
    window.close();
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const eventData = {
      title, titleEn, description, eventType, mode,
      location: locationStr, virtualLink,
      startDate, startTime, endDate, endTime,
      maxCapacity: Number(maxCapacity),
      isRegistrationOpen,
      agenda, speakers,
      fbVideo, ytVideo, attachments,
      imageUrl: coverImage,
      status: 'Published'
    };
    
    localStorage.removeItem('gitm_event_draft');

    if (standalone) {
      try {
        const dataToSave = {
          ...eventData,
          author: user?.displayName || 'Admin',
          updatedAt: serverTimestamp(),
        };

        if (id) {
          await updateDoc(doc(db, 'events', id), dataToSave);
          toast.success(lang === 'ar' ? 'تم تحديث الفعالية بنجاح' : 'Event updated successfully');
        } else {
          dataToSave.createdAt = serverTimestamp();
          await addDoc(collection(db, 'events'), dataToSave);
          toast.success(lang === 'ar' ? 'تم نشر الفعالية بنجاح' : 'Event published successfully');
        }
        window.close();
      } catch (error) {
        console.error(error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء النشر' : 'Error publishing event');
        setIsSaving(false);
      }
    } else {
      onSave(eventData, imageFile);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Activity className="animate-spin text-blue-500" size={32}/></div>;
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pb-12">
      
      {/* Draft Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">
              {lang === 'ar' ? 'حفظ كمسودة؟' : 'Save as Draft?'}
            </h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">
              {lang === 'ar' ? 'لديك تغييرات غير محفوظة. هل تريد حفظها كمسودة قبل المغادرة؟' : 'You have unsaved changes. Do you want to save as draft before leaving?'}
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleConfirmDraft(true)} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors">
                {lang === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
              </button>
              <button onClick={() => handleConfirmDraft(false)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold transition-colors">
                {lang === 'ar' ? 'الخروج بدون حفظ' : 'Discard & Leave'}
              </button>
              <button onClick={() => setShowDraftModal(false)} className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold transition-colors">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Topbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {(standalone || onCancel) && (
            <button onClick={handleCancelClick} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded-xl transition-colors">
               <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300"/>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <Calendar className="text-rose-500" size={24}/> 
              {lang === 'ar' ? 'مخطط الفعاليات الذكي' : 'Smart Event Planner'}
            </h2>
            <p className="text-xs text-slate-500">{lang === 'ar' ? 'إدارة شاملة للحدث، المواقع، والأجندة' : 'Comprehensive management for events, locations, and agenda'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} disabled={isSaving || !title || !startDate}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? <Activity size={18} className="animate-spin"/> : <Save size={18}/>} 
          {lang === 'ar' ? 'نشر الفعالية' : 'Publish Event'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">{lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'عنوان الحدث (بالعربية)' : 'Event Title (Arabic)'}</label>
                  <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500" dir="auto" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'عنوان الحدث (بالإنجليزية)' : 'Event Title (English)'}</label>
                  <input type="text" value={titleEn} onChange={e=>setTitleEn(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500" dir="ltr" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'نوع الحدث' : 'Event Type'}</label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map(type => (
                    <button key={type} onClick={() => setEventType(type)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${eventType === type ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'الوصف الشامل' : 'Full Description'}</label>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-40 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Agenda Builder */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Clock size={20} className="text-blue-500"/> {lang === 'ar' ? 'بناء جدول الأعمال (Agenda)' : 'Agenda Builder'}
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence>
                {agenda.map((item, index) => (
                  <motion.div key={item.id} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg shrink-0">{item.time}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                      {item.desc && <p className="text-sm text-slate-500 mt-1">{item.desc}</p>}
                    </div>
                    <button onClick={() => handleRemoveAgenda(item.id)} className="text-slate-600 dark:text-slate-400 hover:text-red-500 shrink-0"><Trash2 size={18}/></button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <input type="time" value={newAgendaItem.time} onChange={e=>setNewAgendaItem({...newAgendaItem, time: e.target.value})} className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                  <input type="text" placeholder={lang === 'ar' ? 'عنوان الجلسة' : 'Session Title'} value={newAgendaItem.title} onChange={e=>setNewAgendaItem({...newAgendaItem, title: e.target.value})} className="md:col-span-3 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" dir="auto" />
                </div>
                <div className="flex gap-3">
                  <input type="text" placeholder={lang === 'ar' ? 'وصف مختصر (اختياري)' : 'Short Description (Optional)'} value={newAgendaItem.desc} onChange={e=>setNewAgendaItem({...newAgendaItem, desc: e.target.value})} className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none text-sm" dir="auto" />
                  <button onClick={handleAddAgenda} disabled={!newAgendaItem.time || !newAgendaItem.title} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1">
                    <Plus size={16}/> {lang === 'ar' ? 'إضافة' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Timing & Mode */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'الزمان والمكان' : 'Time & Location'}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Start Date</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Start Time</label>
                  <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">End Date</label>
                  <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">End Time</label>
                  <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-3">
                  {['Offline', 'Online', 'Hybrid'].map(m => (
                    <button key={m} onClick={() => setMode(m)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === m ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-white' : 'text-slate-500'}`}>
                      {m === 'Online' ? 'عن بُعد' : m === 'Offline' ? 'حضوري' : 'مدمج'}
                    </button>
                  ))}
                </div>

                {(mode === 'Offline' || mode === 'Hybrid') && (
                  <div className="mb-3">
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><MapPin size={12}/> {lang === 'ar' ? 'الموقع (ميداني)' : 'Location'}</label>
                    <input type="text" placeholder="Casablanca Lab, Technopark..." value={locationStr} onChange={e=>setLocationStr(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none" />
                  </div>
                )}
                {(mode === 'Online' || mode === 'Hybrid') && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Video size={12}/> {lang === 'ar' ? 'رابط البث (يظهر للمسجلين فقط)' : 'Stream Link (Registered only)'}</label>
                    <input type="url" placeholder="https://zoom.us/j/..." value={virtualLink} onChange={e=>setVirtualLink(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RSVP & Tickets */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Users size={18} className="text-indigo-500"/> {lang === 'ar' ? 'نظام التسجيل (RSVP)' : 'Registration & Tickets'}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'السعة القصوى للحضور' : 'Max Capacity'}</span>
                <input type="number" min="1" value={maxCapacity} onChange={e=>setMaxCapacity(e.target.value)} className="w-20 p-1 text-center rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none text-indigo-600 dark:text-indigo-400" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={isRegistrationOpen} onChange={() => setIsRegistrationOpen(!isRegistrationOpen)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isRegistrationOpen ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isRegistrationOpen ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isRegistrationOpen ? (lang === 'ar' ? 'التسجيل مفتوح' : 'Registration Open') : (lang === 'ar' ? 'التسجيل مغلق' : 'Registration Closed')}
                </div>
              </label>
            </div>
          </div>

          {/* Speakers */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'المتحدثون والمدربون' : 'Speakers & Trainers'}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {speakers.map(sp => (
                <span key={sp} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg flex items-center gap-1">
                  {sp} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setSpeakers(speakers.filter(s => s !== sp))} />
                </span>
              ))}
            </div>
            <input type="text" placeholder={lang === 'ar' ? 'ابحث عن عضو واضغط Enter' : 'Type name & press Enter'} value={speakerInput} onChange={e=>setSpeakerInput(e.target.value)} onKeyDown={handleAddSpeaker} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-indigo-500" dir="auto" />
          </div>

          {/* AI Marketing */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
            <Bot size={80} className="absolute -right-4 -bottom-4 text-purple-500/10" />
            <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2 relative z-10"><Bot size={18}/> {lang === 'ar' ? 'التسويق الآلي' : 'AI Marketing Copy'}</h3>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mb-4 relative z-10">{lang === 'ar' ? 'توليد نصوص جذابة مخصصة لمنصات التواصل الاجتماعي بنقرة واحدة.' : 'Generate engaging social media copy with one click.'}</p>
            
            {marketingCopy ? (
              <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl text-sm text-slate-800 dark:text-slate-200 relative z-10 whitespace-pre-wrap border border-purple-200 dark:border-purple-800">
                {marketingCopy}
              </div>
            ) : (
              <button onClick={handleGenerateMarketing} disabled={aiLoading || !title} className="w-full py-2.5 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl shadow-sm hover:shadow transition-all relative z-10 flex items-center justify-center gap-2 text-sm border border-purple-200 dark:border-purple-800 disabled:opacity-50">
                {aiLoading ? <Activity size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                {lang === 'ar' ? 'توليد نص إعلاني' : 'Generate Promo Text'}
              </button>
            )}
          </div>

          {/* Cover Image */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><ImageIcon size={18}/> {lang === 'ar' ? 'صورة الغلاف' : 'Cover Image'}</h3>
            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden mb-3 group">
                <img src={coverImage} alt="Cover" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => {setCoverImage(null); setImageFile(null);}} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/ dark:bg-slate-900/ transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon size={24} className="text-slate-600 dark:text-slate-400 mb-2"/>
                  <p className="text-xs text-slate-500 font-bold">{lang === 'ar' ? 'انقر لرفع صورة' : 'Click to upload image'}</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
              </label>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
             <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'المرفقات والوسائط المتعددة' : 'Rich Media & Attachments'}</h3>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'تضمين فيديو فيسبوك (رابط)' : 'Facebook Video URL'}</label>
                   <input type="text" value={fbVideo} onChange={e=>setFbVideo(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500 text-sm" placeholder="https://facebook.com/..." dir="ltr" />
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'تضمين فيديو يوتيوب (رابط)' : 'YouTube Video URL'}</label>
                   <input type="text" value={ytVideo} onChange={e=>setYtVideo(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-rose-500 text-sm" placeholder="https://youtube.com/watch?v=..." dir="ltr" />
                </div>
                
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
                   {attachments.map((file, i) => (
                     <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                       <div className="flex items-center gap-2 overflow-hidden">
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                       </div>
                       <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-slate-600 dark:text-slate-400 hover:text-red-500 shrink-0 p-1">
                         <X size={14}/>
                       </button>
                     </div>
                   ))}
                   
                   <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                   <button 
                     onClick={() => fileInputRef.current.click()}
                     className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-slate-500 font-bold text-sm flex items-center justify-center gap-2"
                   >
                     <Plus size={16}/> {lang === 'ar' ? 'رفع ملفات / صور متعددة' : 'Upload Files / Multiple Images'}
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Required for react-quill rendering */}
      <style jsx global>{`
        .ql-container {
          font-family: 'Cairo', sans-serif !important;
          font-size: 1rem;
          border: none !important;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
          background: rgba(248, 250, 252, 0.5) !important;
        }
        .dark .ql-toolbar {
          background: rgba(15, 23, 42, 0.5) !important;
          border-bottom-color: rgba(30, 41, 59, 1) !important;
        }
        .dark .ql-picker { color: #cbd5e1; }
        .dark .ql-stroke { stroke: #cbd5e1; }
        .dark .ql-fill { fill: #cbd5e1; }
      `}</style>
    </div>
  );
}
