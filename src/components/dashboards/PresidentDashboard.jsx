import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import UserProfileSettings from './UserProfileSettings';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, BookOpen, Building, Newspaper, Activity, Shield, Award, 
  Edit, Trash2, Bot, TrendingUp, AlertTriangle, Plus, Mail, Video, 
  Megaphone, CheckCircle, XCircle, LayoutDashboard, Settings, BrainCircuit,
  GraduationCap, Calendar, Database, Eye, Image, X, Save, Target, MapPin,
  Link, UserPlus, Handshake, Info, Search, Zap, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../utils/toast';
import VisitorAnalytics from './VisitorAnalytics';

export default function PresidentDashboard() {
  const navigate = useNavigate();
  const { lang, t, user, eventRegistrations, setEventRegistrations } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // --- Firebase User Data State ---
  const [firebaseUsers, setFirebaseUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirebaseUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد تغيير الصلاحية' : 'Confirm Role Change',
      lang === 'ar' ? `هل أنت متأكد من تغيير صلاحية هذا المستخدم إلى ${newRole}؟` : `Change this user role to ${newRole}?`,
      async () => {
        try {
          const userRef = doc(db, 'users', userId);
          const updates = { role: newRole };
          
          if (newRole === 'member') {
            const user = firebaseUsers.find(u => u.id === userId);
            if (!user.membershipId) {
              updates.membershipId = `GITM-MBR-${Math.floor(Math.random() * 10000)}`;
            }
          }
          
          await updateDoc(userRef, updates);
          toast.success(lang === 'ar' ? 'تم تغيير الصلاحية بنجاح' : 'Role updated successfully');
        } catch (err) {
          console.error("Error updating role", err);
          toast.error(lang === 'ar' ? "فشل في تحديث الصلاحية" : "Failed to update role");
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const [news, setNews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubNews = onSnapshot(collection(db, 'news'), snap => setNews(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubCourses = onSnapshot(collection(db, 'courses'), snap => setCourses(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubEvents = onSnapshot(collection(db, 'events'), snap => setEvents(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubGallery = onSnapshot(collection(db, 'gallery'), snap => setGallery(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubProjects = onSnapshot(collection(db, 'projects'), snap => setProjects(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubNews(); unsubCourses(); unsubEvents(); unsubGallery(); unsubProjects(); };
  }, []);

  const [aiSettings, setAiSettings] = useState({
    moderation: { model: 'gemini-1.5-pro', actions: 1450, active: true },
    predictive: { model: 'gemini-1.5-flash', threshold: 85, active: true }
  });

  // --- Modal States ---
  const [modalState, setModalState] = useState({ isOpen: false, type: '', data: null });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const openModal = (type, data = null) => setModalState({ isOpen: true, type, data });
  const closeModal = () => setModalState({ isOpen: false, type: '', data: null });

  const confirmAction = (title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  // --- Editor Handlers Removed (Moved to Standalone Editors) ---

  // --- CRUD Handlers ---
  const handleSave = async (formData) => {
    const isEdit = !!modalState.data;
    const colName = modalState.type === 'event' ? 'events' : 
                    modalState.type === 'course' ? 'courses' : 
                    modalState.type === 'news' ? 'news' : 
                    modalState.type === 'gallery' ? 'gallery' : null;

    if (!colName) return closeModal();

    try {
      if (isEdit) {
        await updateDoc(doc(db, colName, modalState.data.id), { ...formData, updatedAt: serverTimestamp() });
      } else {
        const extraData = modalState.type === 'event' ? { attendees: 0, status: 'Planning' } :
                          modalState.type === 'course' ? { enrolled: 0, status: 'Upcoming' } :
                          modalState.type === 'news' ? { date: new Date().toISOString().split('T')[0], status: 'Draft' } :
                          modalState.type === 'gallery' ? { type: 'image' } : {};
        await addDoc(collection(db, colName), { ...formData, ...extraData, createdAt: serverTimestamp() });
      }
      toast.success(lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully');
    } catch (error) {
      console.error("Save error:", error);
      toast.error(lang === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
    closeModal();
  };

  const handleDelete = (type, id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this? This action cannot be undone.',
      async () => {
        if (type === 'member') {
          handleRoleChange(id, 'suspended');
          setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
          return;
        }
        const colName = type === 'event' ? 'events' : 
                        type === 'course' ? 'courses' : 
                        type === 'news' ? 'news' : 
                        type === 'project' ? 'projects' : 
                        type === 'gallery' ? 'gallery' : null;
        if (colName) {
          try {
            await deleteDoc(doc(db, colName, id));
            toast.success(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
          } catch (error) {
            console.error("Delete error:", error);
            toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
          }
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleUpdateRegStatus = (id, newStatus) => {
    setEventRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{value}</h3>
          <p className={`text-sm mt-2 font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
            {trend} this month
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'vision', icon: Target, label: lang === 'ar' ? 'الرؤية الاستراتيجية' : 'Strategic Vision' },
    { id: 'about_cms', icon: Info, label: lang === 'ar' ? 'إدارة صفحة من نحن' : 'About Us CMS' },
    { id: 'members', icon: Shield, label: lang === 'ar' ? 'إدارة التوظيف والصلاحيات' : 'Roles & Hiring' },
    { id: 'partners', icon: Handshake, label: lang === 'ar' ? 'الشركات والجمعيات' : 'Partners & NGOs' },
    { id: 'academy', icon: GraduationCap, label: lang === 'ar' ? 'الأكاديمية والتداريب' : 'Academy & Training' },
    { id: 'projects', icon: Rocket, label: lang === 'ar' ? 'إدارة المشاريع' : 'Projects Management' },
    { id: 'events', icon: Calendar, label: lang === 'ar' ? 'إدارة الفعاليات' : 'Events Management' },
    { id: 'news', icon: Newspaper, label: lang === 'ar' ? 'إدارة الأخبار' : 'News & Media' },
    { id: 'gallery', icon: Image, label: lang === 'ar' ? 'المعرض والصور' : 'Gallery & Media' },
    { id: 'ai', icon: BrainCircuit, label: lang === 'ar' ? 'إدارة الذكاء الاصطناعي' : 'AI Management' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings' }
  ];

  // --- Modal Component ---
  const CrudModal = () => {
    if (!modalState.isOpen) return null;
    const isEdit = !!modalState.data;
    
    // Create local state for form data
    const [formData, setFormData] = useState(modalState.data || {});

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const renderFields = () => {
      switch (modalState.type) {
        case 'event':
          return (
            <>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"عنوان الحدث (عربي)":"Event Title (Arabic)"}</label>
              <input name="title_ar" value={formData.title_ar || formData.title || ''} onChange={handleChange} placeholder={lang==='ar'?"عنوان الحدث":"Event Title"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"عنوان الحدث (إنجليزي)":"Event Title (English)"}</label>
              <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Event Title" className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"التاريخ":"Date"}</label>
              <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"المكان":"Location"}</label>
              <input name="location" value={formData.location || ''} onChange={handleChange} placeholder={lang==='ar'?"المكان":"Location"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"وصف الحدث":"Description"}</label>
              <textarea name="description_ar" value={formData.description_ar || ''} onChange={handleChange} rows={3} placeholder={lang==='ar'?"الوصف بالعربية":"Arabic Description"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"نوع الحدث":"Event Type"}</label>
              <select name="type" value={formData.type || 'workshop'} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  <option value="workshop">{lang==='ar'?"ورشة عمل":"Workshop"}</option>
                  <option value="conference">{lang==='ar'?"مؤتمر":"Conference"}</option>
                  <option value="hackathon">{lang==='ar'?"هاكاثون":"Hackathon"}</option>
                  <option value="meetup">{lang==='ar'?"لقاء":"Meetup"}</option>
              </select>
              {isEdit && (
                  <>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الحالة":"Status"}</label>
                  <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      <option value="Planning">Planning</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                  </select>
                  </>
              )}
            </>
          );
        case 'course':
          return (
            <>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"اسم الدورة (عربي)":"Course Title (Arabic)"}</label>
              <input name="title_ar" value={formData.title_ar || formData.title || ''} onChange={handleChange} placeholder={lang==='ar'?"اسم الدورة":"Course Title"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"اسم الدورة (إنجليزي)":"Course Title (English)"}</label>
              <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Course Title" className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"المدرب":"Instructor"}</label>
              <input name="instructor" value={formData.instructor || ''} onChange={handleChange} placeholder={lang==='ar'?"المدرب":"Instructor"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"وصف الدورة":"Description"}</label>
              <textarea name="description_ar" value={formData.description_ar || ''} onChange={handleChange} rows={3} placeholder={lang==='ar'?"الوصف":"Description"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الوضع":"Mode"}</label>
              <select name="mode" value={formData.mode || 'remote'} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  <option value="remote">{lang==='ar'?"عن بعد":"Remote"}</option>
                  <option value="in-person">{lang==='ar'?"حضوري":"In-Person"}</option>
              </select>
              {isEdit && (
                  <>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الحالة":"Status"}</label>
                  <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      <option value="Upcoming">Upcoming</option>
                      <option value="Active">Active</option>
                      <option value="Archived">Archived</option>
                  </select>
                  </>
              )}
            </>
          );
        case 'news':
          return (
            <>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"عنوان المقال (عربي)":"Article Title (Arabic)"}</label>
              <input name="title_ar" value={formData.title_ar || formData.title || ''} onChange={handleChange} placeholder={lang==='ar'?"عنوان المقال":"Article Title"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"عنوان المقال (إنجليزي)":"Article Title (English)"}</label>
              <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Article Title" className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"المحتوى (عربي)":"Content (Arabic)"}</label>
              <textarea name="content_ar" value={formData.content_ar || ''} onChange={handleChange} rows={4} placeholder={lang==='ar'?"محتوى المقال":"Article Content"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"صورة المقال (رابط)":"Image URL"}</label>
              <input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"القسم":"Category"}</label>
              <select name="category" value={formData.category || 'Technology'} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  <option value="Technology">Technology</option>
                  <option value="Events">Events</option>
                  <option value="Academy">Academy</option>
                  <option value="Partners">Partners</option>
              </select>
              {isEdit && (
                  <>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الحالة":"Status"}</label>
                  <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                  </select>
                  </>
              )}
            </>
          );
        case 'gallery':
          return (
            <>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"اسم الصورة/الملف":"File Name"}</label>
              <input name="name" value={formData.name || ''} onChange={handleChange} placeholder={lang==='ar'?"اسم الصورة/الملف":"File Name"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الصورة":"Image"}</label>
              <input type="file" className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
            </>
          );
        case 'ai':
           return (
             <>
               <label className="text-sm font-bold text-slate-500 mb-1 block">AI Model</label>
               <input name="model" value={formData.model || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
               <label className="text-sm font-bold text-slate-500 mb-1 block">Parameter</label>
               <input type="number" name="param" value={formData.param || ''} onChange={handleChange} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
             </>
           )
        case 'member':
            return (
              <>
                <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"الاسم":"Name"}</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder={lang==='ar'?"الاسم":"Name"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
                <label className="text-sm font-bold text-slate-500 mb-1 block">{lang==='ar'?"البريد الإلكتروني":"Email"}</label>
                <input name="email" value={formData.email || ''} onChange={handleChange} placeholder={lang==='ar'?"البريد الإلكتروني":"Email"} className="w-full p-3 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
              </>
            )
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/ dark:bg-slate-900/ backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white">
              {isEdit ? (lang==='ar'?'تعديل':'Edit') : (lang==='ar'?'إضافة جديد':'Add New')}
            </h3>
            <button onClick={closeModal} className="text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors p-2"><X size={20}/></button>
          </div>
          <div className="mb-6">
            {renderFields()}
          </div>
          <button onClick={() => handleSave(formData)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex justify-center items-center gap-2">
            <Save size={20}/> {lang==='ar'?'حفظ التغييرات':'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  // --- Confirm Dialog Component ---
  const ConfirmDialog = () => {
    if (!confirmDialog.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/ dark:bg-slate-900/ backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">{confirmDialog.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{confirmDialog.message}</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })} className="flex-1 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button onClick={confirmDialog.onConfirm} className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/30 transition-all">
              {lang === 'ar' ? 'تأكيد' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-cyan-200 dark:border-slate-800 shadow-xl shadow-cyan-900/5">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold gradient-text">{lang === 'ar' ? 'القيادة العليا' : 'Supreme Command'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lang === 'ar' ? 'نظام التحكم المركزي' : 'Central Control System'}</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-slate-50 dark:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 w-full"
          >
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title={lang === 'ar' ? 'إجمالي الأعضاء والطلاب' : 'Total Registered'} value={firebaseUsers.length.toString()} icon={Users} color="blue" trend="+12%" />
                  <StatCard title={lang === 'ar' ? 'المشاريع والفعاليات' : 'Events & Projects'} value={events.length.toString()} icon={Activity} color="emerald" trend="+5%" />
                  <StatCard title={lang === 'ar' ? 'الدورات التدريبية' : 'Courses'} value={courses.length.toString()} icon={BookOpen} color="purple" trend="+18%" />
                  <StatCard title={lang === 'ar' ? 'المقالات والأخبار' : 'News Articles'} value={news.length.toString()} icon={Newspaper} color="pink" trend="+2%" />
                </div>

                <div className="glass-card rounded-3xl p-8 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)] bg-gradient-to-br from-white to-pink-50 dark:from-slate-900 dark:to-pink-950/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Bot size={150} /></div>
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg shadow-pink-500/30 text-white"><Bot size={24} /></div>
                      <h3 className="text-xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400">
                        {lang === 'ar' ? 'موجز الذكاء الاصطناعي التنبؤي' : 'AI Predictive Summary'}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 dark:border-pink-900/50">
                      <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3 flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-emerald-500" /> {lang === 'ar' ? 'نمو الأكاديمية' : 'Academy Growth'}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Expect a 24% increase in Edge AI course demand next week. Auto-scaling servers is recommended.</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 dark:border-pink-900/50">
                      <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3 flex items-center gap-2 text-sm"><AlertTriangle size={16} className="text-amber-500" /> {lang === 'ar' ? 'تحليل تفاعل الأعضاء' : 'Member Engagement'}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Engagement in 'Cybersecurity 101' dropped by 15%. Consider sending a motivational email campaign.</p>
                    </div>
                  </div>
                </div>

                <VisitorAnalytics />
              </div>
            )}

            {/* STRATEGIC VISION TAB */}
            {activeTab === 'vision' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-8 border-t-4 border-cyan-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Target className="text-cyan-500" size={28}/> {lang === 'ar' ? 'الأهداف الاستراتيجية لـ GITM' : 'GITM Strategic Goals'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'تدريب الكفاءات المغربية' : 'Train Moroccan Talents'}</h4>
                        <span className="text-cyan-600 font-bold">60%</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{lang === 'ar' ? 'الهدف: تدريب 10,000 طالب في مجالات الذكاء الاصطناعي والتكنولوجيا المتقدمة بحلول 2028.' : 'Goal: Train 10,000 students in AI and advanced tech by 2028.'}</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-right text-xs mt-2 font-bold text-slate-500">6,000 / 10,000</p>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'التوسع الإقليمي' : 'Regional Expansion'}</h4>
                        <span className="text-purple-600 font-bold">40%</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{lang === 'ar' ? 'الهدف: افتتاح مختبرات GITM في 5 مدن مغربية رئيسية (الدار البيضاء، الرباط، طنجة، مراكش، أكادير).' : 'Goal: Open GITM labs in 5 major Moroccan cities.'}</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <p className="text-right text-xs mt-2 font-bold text-slate-500 flex items-center justify-end gap-1"><MapPin size={12}/> 2 / 5 Cities</p>
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 md:col-span-2">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'البحث والتطوير (R&D)' : 'Research & Development'}</h4>
                        <span className="text-emerald-600 font-bold">85%</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{lang === 'ar' ? 'الهدف: إطلاق نظام ذكاء اصطناعي مغربي 100% للشركات الناشئة.' : 'Goal: Launch a 100% Moroccan AI system for startups.'}</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-right text-xs mt-2 font-bold text-slate-500">Beta Testing Phase</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT US CMS TAB */}
            {activeTab === 'about_cms' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6 border-t-4 border-cyan-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Info className="text-cyan-500" size={24}/> {lang === 'ar' ? 'نظام إدارة محتوى (من نحن)' : 'About Us Content Management'}
                    </h3>
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-cyan-500/30 transition-shadow">
                      {lang === 'ar' ? 'حفظ التغييرات ونشر' : 'Save & Publish'}
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                        {lang === 'ar' ? 'رؤية المجموعة (Vision)' : 'Our Vision'}
                      </label>
                      <textarea 
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-24"
                        defaultValue={lang === 'ar' ? 'الريادة في تطوير الذكاء الاصطناعي المغربي وتصديره للعالم.' : 'Leading the development of Moroccan AI and exporting it to the world.'}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                        {lang === 'ar' ? 'رسالتنا (Mission)' : 'Our Mission'}
                      </label>
                      <textarea 
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-24"
                        defaultValue={lang === 'ar' ? 'توفير بيئة بحثية متقدمة للمواهب المغربية، وتمكينهم من بناء أنظمة ذكية تحل مشاكل واقعية.' : 'Providing an advanced research environment for Moroccan talents to build smart systems.'}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                        {lang === 'ar' ? 'تاريخ وإنجازات المجموعة (History & Milestones)' : 'Group History & Milestones'}
                      </label>
                      <textarea 
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-32"
                        defaultValue={lang === 'ar' ? 'تأسست GITM في عام 2024 لتوحيد جهود المهندسين المغاربة. قمنا بتدريب المئات وشاركنا في الهاكاثونات الوطنية والدولية بنجاح مبهر.' : 'Founded in 2024, GITM unites Moroccan engineers. We have trained hundreds and successfully participated in national and international hackathons.'}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS TAB (ROLE MANAGEMENT) */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white mb-1">
                        <Shield className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة التوظيف والترقيات' : 'Roles & Promotions Management'}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {lang === 'ar' ? 'جميع المسجلين الجدد هم (طالب). لا أحد يرتقي إلا بتغيير صلاحياته من هنا، أو بإرسال رابط دعوة خاص.' : 'All new signups are Students. Upgrade their roles here or send a direct invite link.'}
                      </p>
                    </div>
                    <button onClick={() => {
                        toast.success(lang === 'ar' ? 'تم نسخ رابط الدعوة للفريق: https://gitm.ma/invite/XYZ-123' : 'Team Invite Link Copied: https://gitm.ma/invite/XYZ-123');
                    }} className="bg-slate-50 dark:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-slate-700 transition-colors">
                      <Link size={16}/> {lang === 'ar' ? 'إنشاء رابط دعوة' : 'Generate Invite Link'}
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                          <th className="p-3 font-bold">User</th>
                          <th className="p-3 font-bold">Current Role</th>
                          <th className="p-3 font-bold">Promote To</th>
                          <th className="p-3 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {firebaseUsers.map(m => (
                          <tr key={m.id} className={`hover:bg-slate-50 dark:hover:bg-slate-50/ dark:bg-slate-800/ transition-colors ${m.role === 'suspended' ? 'opacity-50' : ''}`}>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
                                  {m.name ? m.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                  <p className="font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                                    {m.name} 
                                    {m.membershipId && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 rounded-full border border-amber-200">{m.membershipId}</span>}
                                  </p>
                                  <p className="text-xs text-slate-500">{m.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${
                                m.role === 'student' ? 'bg-slate-100 text-slate-600' : 
                                m.role === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                              }`}>{m.role}</span>
                            </td>
                            <td className="p-3">
                              <select 
                                value={m.role}
                                onChange={(e) => handleRoleChange(m.id, e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer">
                                <option value="student">Student (Default)</option>
                                <option value="member">Member</option>
                                <option value="teacher">Teacher</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="content_manager">Content Manager</option>
                                <option value="partner">Partner</option>
                                <option value="university">University</option>
                                <option value="president">President</option>
                                <option value="suspended" className="text-red-500 font-bold">Suspend Account</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => navigate(`/profile/${m.id}`)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg"><Eye size={16}/></button>
                                <button onClick={() => handleDelete('member', m.id)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg"><Trash2 size={16}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PARTNERS & NGOs TAB */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Handshake className="text-emerald-500" size={24}/> {lang === 'ar' ? 'إدارة الشراكات والجمعيات' : 'Partnerships & NGOs'}
                    </h3>
                    <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><Plus size={16}/> {lang === 'ar' ? 'إضافة شريك جديد' : 'Add Partner'}</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">OCP Group</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> Verified Corporate Partner</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">Active</span>
                    </div>
                    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">UM5 University</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> Verified Academic Partner</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMY TAB */}
            {activeTab === 'academy' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <GraduationCap className="text-purple-500" size={24}/> {lang === 'ar' ? 'الإدارة الأكاديمية والتداريب' : 'Academy & Training Management'}
                    </h3>
                    <button onClick={() => window.open('/editor/course/new', '_blank')} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform"><Plus size={16}/> {lang === 'ar' ? 'دورة جديدة' : 'New Course'}</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map(course => (
                      <div key={course.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-900 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white">{course.title}</h4>
                          <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${course.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{course.status}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 flex items-center gap-2"><Users size={14}/> {course.enrolled || 0} {lang==='ar'?'طالب مسجل':'Students Enrolled'}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Inst: {course.instructor || 'Admin'}</span>
                          <div className="flex gap-2">
                              <button onClick={() => window.open(`/editor/course/edit/${course.id}`, '_blank')} className="text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit size={16}/></button>
                              <button onClick={() => handleDelete('course', course.id)} className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Rocket className="text-amber-500" size={24}/> {lang === 'ar' ? 'إدارة المشاريع وفرق العمل' : 'Projects & Teams Management'}
                    </h3>
                    <button onClick={() => window.open('/editor/project/new', '_blank')} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform">
                      <Plus size={16}/> {lang === 'ar' ? 'مشروع جديد' : 'New Project'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-xl text-[#1e3a5f] dark:text-white">{project.titleAr || project.title}</h4>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block uppercase">{project.status}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => window.open(`/editor/project/edit/${project.id}`, '_blank')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                            <button onClick={() => handleDelete('project', project.id)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </div>

                        {/* PROJECT CREATOR EXCLUSIVE UI */}
                        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                          <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><UserPlus size={18}/> {lang === 'ar' ? 'إضافة أعضاء لفريق مشروعك' : 'Add Team Members to Your Project'}</h5>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" size={18}/>
                              <input 
                                type="text" 
                                placeholder={lang === 'ar' ? 'ابحث بالاسم أو رقم العضوية...' : 'Search registered members by name or ID...'}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <button className="bg-slate-50 dark:bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-600 transition-colors">
                              {lang === 'ar' ? 'إضافة' : 'Add Member'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Calendar className="text-amber-500" size={24}/> {lang === 'ar' ? 'إدارة الفعاليات والهاكاثونات' : 'Events & Hackathons Management'}
                    </h3>
                    <button onClick={() => window.open('/editor/event/new', '_blank')} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"><Plus size={16}/> {lang === 'ar' ? 'حدث جديد' : 'New Event'}</button>
                  </div>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{event.titleAr || event.title}</h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14}/> {event.startDate || event.date} • <Users size={14}/> {event.attendees || 0} Registered</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">{event.status || 'Published'}</span>
                          <button onClick={() => window.open(`/editor/event/edit/${event.id}`, '_blank')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                          <button onClick={() => handleDelete('event', event.id)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <CheckCircle className="text-emerald-500" size={20}/> {lang === 'ar' ? 'طلبات تسجيل الحضور/المشاريع' : 'Registration Requests'}
                  </h3>
                  {(!eventRegistrations || eventRegistrations.length === 0) ? (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">No pending requests at the moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {eventRegistrations.map(reg => (
                        <div key={reg.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center bg-white dark:bg-slate-900/50">
                          <div>
                            <p className="font-bold text-[#1e3a5f] dark:text-white">{reg.eventTitle}</p>
                            <p className="text-xs text-slate-500">{reg.userName} - {reg.status}</p>
                          </div>
                          {reg.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateRegStatus(reg.id, 'approved')} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-2 rounded-lg"><CheckCircle size={18}/></button>
                              <button onClick={() => handleUpdateRegStatus(reg.id, 'rejected')} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg"><XCircle size={18}/></button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Newspaper className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة الأخبار والميديا' : 'News & Media Management'}
                    </h3>
                    <button onClick={() => window.open('/editor/article/new', '_blank')} className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"><Plus size={16}/> {lang === 'ar' ? 'مقال جديد' : 'Write Article'}</button>
                  </div>
                  <div className="space-y-4">
                    {news.map(n => (
                      <div key={n.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md transition-shadow bg-white dark:bg-slate-900/50">
                        <div>
                          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{n.title}</h4>
                          <p className="text-sm text-slate-500">{n.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${n.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{n.status}</span>
                          <div className="flex gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                            <button onClick={() => window.open(`/editor/article/edit/${n.id}`, '_blank')} className="text-slate-600 dark:text-slate-400 hover:text-blue-500 p-2 transition-colors"><Edit size={16}/></button>
                            <button onClick={() => handleDelete('news', n.id)} className="text-slate-600 dark:text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Image className="text-indigo-500" size={24}/> {lang === 'ar' ? 'إدارة المعرض والصور' : 'Gallery Management'}
                    </h3>
                    <button onClick={() => openModal('gallery')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"><Plus size={16}/> {lang === 'ar' ? 'رفع صور جديدة' : 'Upload Media'}</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map(img => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
                          <Image size={48} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="absolute inset-0 bg-white/ dark:bg-slate-900/ opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                          <button onClick={() => openModal('gallery', img)} className="p-2 bg-white/10 hover:bg-blue-500 text-white rounded-lg transition-colors"><Edit size={16}/></button>
                          <button onClick={() => handleDelete('gallery', img.id)} className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xs font-bold truncate">{img.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-pink-200 dark:border-pink-900/30">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                    <BrainCircuit size={24}/> {lang === 'ar' ? 'إعدادات وكلاء الذكاء الاصطناعي' : 'AI Agents Configuration'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Bot size={18} className="text-blue-500"/> Content Moderation AI</h4>
                          <p className="text-xs text-slate-500 mt-1">Scans forums and comments for policy violations.</p>
                        </div>
                        <div 
                          onClick={() => setAiSettings({...aiSettings, moderation: {...aiSettings.moderation, active: !aiSettings.moderation.active}})}
                          className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${aiSettings.moderation.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${aiSettings.moderation.active ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <p className="flex justify-between"><span>Model:</span> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">{aiSettings.moderation.model}</span></p>
                        <p className="flex justify-between"><span>Actions/Day:</span> <span className="font-bold">{aiSettings.moderation.actions}</span></p>
                      </div>
                      <button onClick={() => openModal('ai', {type: 'moderation', model: aiSettings.moderation.model, param: aiSettings.moderation.actions})} className="mt-4 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#1e3a5f] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800 transition-colors">Configure Rules</button>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Bot size={18} className="text-purple-500"/> Predictive Analytics AI</h4>
                          <p className="text-xs text-slate-500 mt-1">Generates weekly growth and risk reports.</p>
                        </div>
                        <div 
                          onClick={() => setAiSettings({...aiSettings, predictive: {...aiSettings.predictive, active: !aiSettings.predictive.active}})}
                          className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${aiSettings.predictive.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${aiSettings.predictive.active ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <p className="flex justify-between"><span>Model:</span> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">{aiSettings.predictive.model}</span></p>
                        <p className="flex justify-between"><span>Confidence Threshold:</span> <span className="font-bold">{aiSettings.predictive.threshold}%</span></p>
                      </div>
                      <button onClick={() => openModal('ai', {type: 'predictive', model: aiSettings.predictive.model, param: aiSettings.predictive.threshold})} className="mt-4 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#1e3a5f] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800 transition-colors">Adjust Parameters</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE & SETTINGS TAB */}
            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Mourad', role: 'president', email: 'mourad@gitm.ma', badges: ['founder', 'developer'] }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Dynamic Modal Overlay */}
      <CrudModal />
      <ConfirmDialog />

    </div>
  );
}