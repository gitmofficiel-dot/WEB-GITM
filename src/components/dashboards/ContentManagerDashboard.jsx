import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  PenTool, Image as ImageIcon, BarChart2, Plus, Edit, Trash2, Eye, Calendar, Globe, Settings,
  Search, CheckCircle, XCircle, Clock, Upload, FileText, Link2, ArrowUpRight,
  AlertTriangle, Send, Filter, X, Save, ListChecks, Loader2, MapPin, Users, BookOpen, Rocket, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { db } from '../../config/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { toast } from '../../utils/toast';
import SmartArticleEditor from './SmartArticleEditor';
import SmartEventEditor from './SmartEventEditor';
import SmartCourseBuilder from './SmartCourseBuilder';
import SmartProjectBuilder from './SmartProjectBuilder';
import VisitorAnalytics from './VisitorAnalytics';
import MembersDashboard from './MembersDashboard';
import ActivityLog from './ActivityLog';

export default function ContentManagerDashboard() {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');

  const managerName = currentUser?.name || (lang === 'ar' ? 'فريق الإعلام' : 'Media Team');
  const managerEmail = currentUser?.email || 'media@gitm.ma';

  // --- Articles State ---
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({ title: '', titleEn: '', author: '', status: 'Draft', content: '', category: '' });
  const [articleImage, setArticleImage] = useState(null);
  const [isSavingArticle, setIsSavingArticle] = useState(false);

  // --- Events State ---
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // --- Courses State ---
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // --- Projects State ---
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showProjectEditor, setShowProjectEditor] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSavingProject, setIsSavingProject] = useState(false);

  // --- Media State ---
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaForm, setMediaForm] = useState({ title: '', category: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // --- SEO & Queue State ---
  const [seoData, setSeoData] = useState({
    pageTitle: 'GITM - Global Institute of Technology Morocco',
    metaDescription: 'Leading tech education platform in Morocco specializing in AI, Robotics, and IoT.',
    sitemapStatus: 'healthy',
    lastCrawl: new Date().toISOString().split('T')[0],
    indexedPages: 156,
    errors: 0,
    titleScore: 92,
    descriptionScore: 85,
  });

  const [publishQueue, setPublishQueue] = useState([]);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const confirmAction = (title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  // --- Fetch Data ---
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const q = query(collection(db, 'events'), orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchMedia();
    fetchEvents();
    fetchCourses();
    fetchProjects();
  }, []);

  useEffect(() => {
    // Dynamically update Publish Queue from drafts
    const drafts = articles.filter(a => a.status === 'Draft' || a.status === 'Pending').map(a => ({
      id: a.id,
      title: a.titleEn || a.title,
      titleAr: a.title || a.titleEn,
      type: 'article',
      author: a.author || managerName,
      submittedDate: a.date || new Date().toISOString().split('T')[0],
      priority: 'medium'
    }));

    const eventDrafts = events.filter(e => e.status === 'Draft').map(e => ({
      id: e.id,
      title: e.title_en || e.title_ar,
      titleAr: e.title_ar || e.title_en,
      type: 'event',
      author: e.creatorName || managerName,
      submittedDate: e.startDate || new Date().toISOString().split('T')[0],
      priority: 'high'
    }));

    const queue = [...drafts, ...eventDrafts];
    if (queue.length === 0 && !loadingArticles && !loadingEvents) {
      queue.push({ id: 'dummy', title: 'New IoT Workshop Announcement', titleAr: 'إعلان ورشة إنترنت الأشياء', type: 'article', author: 'Fatima Zahra', submittedDate: '2026-06-24', priority: 'high' });
    }
    setPublishQueue(queue);

    // Dynamically compute SEO data
    if (articles.length > 0 || events.length > 0) {
      setSeoData(prev => ({
        ...prev,
        indexedPages: 100 + articles.length + events.length + projects.length + courses.length,
        errors: Math.max(0, 3 - Math.floor(articles.length / 5))
      }));
    }
  }, [articles, events, projects, courses, loadingArticles, loadingEvents, managerName]);

  // --- Handlers ---
  const handleSaveArticle = async () => {
    if (!articleForm.title.trim() && !articleForm.titleEn.trim()) return;
    setIsSavingArticle(true);
    try {
      let imageUrl = editingArticle?.imageUrl || '';
      if (articleImage) {
        imageUrl = await uploadToCloudinary(articleImage);
      }
      
      const articleData = {
        title: articleForm.title || articleForm.titleEn,
        titleEn: articleForm.titleEn || articleForm.title,
        author: articleForm.author || managerName,
        status: articleForm.status || 'Draft',
        content: articleForm.content,
        category: articleForm.category,
        imageUrl,
        date: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp(),
      };

      if (editingArticle) {
        const articleRef = doc(db, 'news', editingArticle.id);
        await updateDoc(articleRef, articleData);
      } else {
        articleData.createdAt = serverTimestamp();
        articleData.views = 0;
        await addDoc(collection(db, 'news'), articleData);
      }
      
      setShowArticleModal(false);
      setEditingArticle(null);
      setArticleForm({ title: '', titleEn: '', author: '', status: 'Draft', content: '', category: '' });
      setArticleImage(null);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleSaveArticleFromEditor = async (data) => {
    setIsSavingArticle(true);
    try {
      const articleData = {
        title: data.title,
        titleEn: data.title, // or handle translation
        author: managerName,
        status: 'Published', // you might want to read this from editor data
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        attachments: data.attachments || [],
        date: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp(),
      };

      if (editingArticle) {
        const articleRef = doc(db, 'news', editingArticle.id);
        await updateDoc(articleRef, articleData);
        toast.success(lang === 'ar' ? 'تم تحديث المقال بنجاح' : 'Article updated successfully');
      } else {
        articleData.createdAt = serverTimestamp();
        articleData.views = 0;
        await addDoc(collection(db, 'news'), articleData);
        toast.success(lang === 'ar' ? 'تم نشر المقال بنجاح' : 'Article published successfully');
      }
      
      setShowArticleModal(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article from editor:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving article');
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleDeleteArticle = (id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this article? This action cannot be undone.',
      async () => {
        try {
          await deleteDoc(doc(db, 'news', id));
          setArticles(prev => prev.filter(a => a.id !== id));
          toast.success(lang === 'ar' ? 'تم حذف المقال بنجاح' : 'Article deleted successfully');
        } catch (error) {
          console.error('Error deleting article:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleSaveEventFromEditor = async (data, imageFile) => {
    setIsSavingEvent(true);
    try {
      let imageUrl = editingEvent?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }
      
      const eventData = {
        ...data,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingEvent) {
        const eventRef = doc(db, 'events', editingEvent.id);
        await updateDoc(eventRef, eventData);
        toast.success(lang === 'ar' ? 'تم تحديث الفعالية بنجاح' : 'Event updated successfully');
      } else {
        eventData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'events'), eventData);
        toast.success(lang === 'ar' ? 'تم نشر الفعالية بنجاح' : 'Event published successfully');
      }
      
      setShowEventEditor(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving event');
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = (id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذه الفعالية؟ لا يمكن التراجع.' : 'Are you sure you want to delete this event? Cannot be undone.',
      async () => {
        try {
          await deleteDoc(doc(db, 'events', id));
          setEvents(prev => prev.filter(a => a.id !== id));
          toast.success(lang === 'ar' ? 'تم حذف الفعالية بنجاح' : 'Event deleted successfully');
        } catch (error) {
          console.error('Error deleting event:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleSaveCourseFromEditor = async (courseData) => {
    setIsSavingCourse(true);
    try {
      const dataToSave = {
        ...courseData,
        updatedAt: serverTimestamp(),
      };

      if (editingCourse) {
        const courseRef = doc(db, 'courses', editingCourse.id);
        await updateDoc(courseRef, dataToSave);
        toast.success(lang === 'ar' ? 'تم تحديث المسار بنجاح' : 'Course updated successfully');
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, 'courses'), dataToSave);
        toast.success(lang === 'ar' ? 'تم نشر المسار بنجاح' : 'Course published successfully');
      }
      
      setShowCourseEditor(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving course');
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleDeleteCourse = (id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا المسار؟ لا يمكن التراجع.' : 'Are you sure you want to delete this course? Cannot be undone.',
      async () => {
        try {
          await deleteDoc(doc(db, 'courses', id));
          setCourses(prev => prev.filter(a => a.id !== id));
          toast.success(lang === 'ar' ? 'تم حذف المسار بنجاح' : 'Course deleted successfully');
        } catch (error) {
          console.error('Error deleting course:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleSaveProjectFromEditor = async (projectData) => {
    setIsSavingProject(true);
    try {
      const dataToSave = {
        ...projectData,
        updatedAt: serverTimestamp(),
      };

      if (editingProject) {
        const projectRef = doc(db, 'projects', editingProject.id);
        await updateDoc(projectRef, dataToSave);
        toast.success(lang === 'ar' ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, 'projects'), dataToSave);
        toast.success(lang === 'ar' ? 'تم حفظ المشروع بنجاح' : 'Project saved successfully');
      }
      
      setShowProjectEditor(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving project');
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = (id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع.' : 'Are you sure you want to delete this project? Cannot be undone.',
      async () => {
        try {
          await deleteDoc(doc(db, 'projects', id));
          setProjects(prev => prev.filter(a => a.id !== id));
          toast.success(lang === 'ar' ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
        } catch (error) {
          console.error('Error deleting project:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({ 
      title: article.title || '', 
      titleEn: article.titleEn || '',
      author: article.author || '', 
      status: article.status || 'Draft',
      content: article.content || '',
      category: article.category || ''
    });
    setArticleImage(null);
    setShowArticleModal(true);
  };

  const handleUploadMedia = async () => {
    if (!mediaFile) return;
    setIsUploadingMedia(true);
    try {
      const url = await uploadToCloudinary(mediaFile);
      const isVideo = mediaFile.type.startsWith('video/');
      
      const mediaData = {
        title: mediaForm.title || mediaFile.name,
        category: mediaForm.category || 'General',
        url,
        type: isVideo ? 'video' : 'image',
        size: (mediaFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
      };

      await addDoc(collection(db, 'gallery'), mediaData);
      setShowMediaModal(false);
      setMediaForm({ title: '', category: '' });
      setMediaFile(null);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = (id) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this media? This action cannot be undone.',
      async () => {
        try {
          await deleteDoc(doc(db, 'gallery', id));
          setMediaItems(prev => prev.filter(m => m.id !== id));
          toast.success(lang === 'ar' ? 'تم حذف الملف بنجاح' : 'Media deleted successfully');
        } catch (error) {
          console.error('Error deleting media:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred during deletion');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const handleApproveQueue = (id) => {
    setPublishQueue(prev => prev.filter(item => item.id !== id));
  };
  const handleRejectQueue = (id) => {
    setPublishQueue(prev => prev.filter(item => item.id !== id));
  };

  const statusColors = {
    Published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Archived: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  const tabs = [
    { id: 'analytics', icon: BarChart2, label: lang === 'ar' ? 'التحليلات' : 'Analytics' },
    { id: 'articles', icon: PenTool, label: lang === 'ar' ? 'المقالات' : 'Articles' },
    { id: 'events', icon: Calendar, label: lang === 'ar' ? 'إدارة الفعاليات' : 'Events' },
    { id: 'projects', icon: Rocket, label: lang === 'ar' ? 'إدارة المشاريع' : 'Projects' },
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'هيكلة التداريب' : 'Courses' },
    { id: 'members', icon: Users, label: lang === 'ar' ? 'إدارة الأعضاء' : 'Members' },
    { id: 'activity', icon: Activity, label: lang === 'ar' ? 'سجل النشاطات' : 'Activity Log' },
    { id: 'media', icon: ImageIcon, label: lang === 'ar' ? 'مكتبة الوسائط' : 'Media Library' },
    { id: 'seo', icon: Search, label: lang === 'ar' ? 'أدوات SEO' : 'SEO Tools' },
    { id: 'queue', icon: ListChecks, label: lang === 'ar' ? 'طابور النشر' : 'Publishing Queue' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
  };

  const ConfirmDialogComponent = () => {
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
    <div className={`flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
      <ConfirmDialogComponent />
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 min-w-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-rose-200 dark:border-rose-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'مدير المحتوى' : 'Content Manager'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{managerName}</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                  {tab.id === 'queue' && publishQueue.length > 0 && (
                    <span className="ml-auto bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{publishQueue.length}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">

            {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <VisitorAnalytics />
              </div>
            )}

            {/* ═══════════════ ARTICLES TAB ═══════════════ */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <PenTool className="text-rose-500"/> {lang === 'ar' ? 'إدارة المقالات' : 'Article Management'}
                  </h3>
                  <button
                    onClick={() => { 
                      setEditingArticle(null); 
                      setArticleForm({ title: '', titleEn: '', author: '', status: 'Draft', content: '', category: '' }); 
                      setArticleImage(null);
                      setShowArticleModal(true); 
                    }}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-rose-500/20 transition-all hover:scale-105"
                  >
                    <Plus size={16}/> {lang === 'ar' ? 'مقال جديد (المحرر الذكي)' : 'New Article (Smart)'}
                  </button>
                </div>

                {showArticleModal ? (
                  <SmartArticleEditor 
                    initialData={editingArticle || null}
                    onCancel={() => setShowArticleModal(false)}
                    onSave={(data) => {
                      handleSaveArticleFromEditor(data);
                    }}
                  />
                ) : (
                  <>
                    {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: lang === 'ar' ? 'منشور' : 'Published', value: articles.filter(a => a.status === 'Published').length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'مسودة' : 'Drafts', value: articles.filter(a => a.status === 'Draft').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: lang === 'ar' ? 'أرشيف' : 'Archived', value: articles.filter(a => a.status === 'Archived').length, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/50' },
                  ].map((s, i) => (
                    <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible" className={`glass-card rounded-2xl p-4 text-center ${s.bg}`}>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Articles List */}
                <div className="glass-card rounded-2xl p-6">
                  {loadingArticles ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-rose-500" size={32}/></div>
                  ) : (
                    <div className="space-y-3">
                      {articles.map((art, i) => (
                        <motion.div key={art.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                        >
                          <div className="flex-1 flex items-center gap-4">
                            {art.imageUrl && (
                              <img src={art.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover hidden sm:block" />
                            )}
                            <div>
                              <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? (art.title || art.titleEn) : (art.titleEn || art.title)}</h4>
                              <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {art.date}</span>
                                <span className="text-xs text-slate-500">{lang === 'ar' ? 'الكاتب: ' : 'By: '}{art.author}</span>
                                {art.views > 0 && <span className="text-xs text-slate-500 flex items-center gap-1"><Eye size={12}/> {art.views}</span>}
                                {art.category && <span className="text-xs text-slate-500 flex items-center gap-1"><Filter size={12}/> {art.category}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            <span className={`px-3 py-1 text-[10px] rounded-full uppercase font-bold ${statusColors[art.status] || statusColors.Draft}`}>{art.status || 'Draft'}</span>
                            <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                              <button onClick={() => handleEditArticle(art)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit size={15}/></button>
                              <button onClick={() => handleDeleteArticle(art.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={15}/></button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                </>
                )}
              </div>
            )}

            {/* ═══════════════ EVENTS TAB ═══════════════ */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Calendar className="text-rose-500"/> {lang === 'ar' ? 'إدارة الفعاليات' : 'Events Management'}
                  </h3>
                  <button
                    onClick={() => { 
                      setEditingEvent(null); 
                      setShowEventEditor(true); 
                    }}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-rose-500/20 transition-all hover:scale-105"
                  >
                    <Plus size={16}/> {lang === 'ar' ? 'فعالية جديدة' : 'New Event'}
                  </button>
                </div>

                {showEventEditor ? (
                  <SmartEventEditor 
                    initialData={editingEvent || null}
                    onCancel={() => setShowEventEditor(false)}
                    onSave={handleSaveEventFromEditor}
                  />
                ) : (
                  <>
                    <div className="glass-card rounded-2xl p-6">
                      {loadingEvents ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-rose-500" size={32}/></div>
                      ) : (
                        <div className="space-y-3">
                          {events.map((ev, i) => (
                            <motion.div key={ev.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                            >
                              <div className="flex-1 flex items-center gap-4">
                                {ev.imageUrl && (
                                  <img src={ev.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover hidden sm:block" />
                                )}
                                <div>
                                  <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? (ev.title || ev.titleEn) : (ev.titleEn || ev.title)}</h4>
                                  <div className="flex flex-wrap gap-3 mt-1">
                                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {ev.startDate}</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> {ev.mode === 'Online' ? 'عن بُعد' : ev.location}</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={12}/> {ev.maxCapacity} Seats</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                <span className={`px-3 py-1 text-[10px] rounded-full uppercase font-bold ${ev.isRegistrationOpen ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                  {ev.isRegistrationOpen ? 'Open' : 'Closed'}
                                </span>
                                <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                                  <button onClick={() => { setEditingEvent(ev); setShowEventEditor(true); }} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit size={15}/></button>
                                  <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={15}/></button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {events.length === 0 && (
                            <p className="text-center text-slate-500 font-bold py-8">{lang === 'ar' ? 'لا توجد فعاليات' : 'No events found'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ═══════════════ COURSES TAB ═══════════════ */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <BookOpen className="text-teal-500"/> {lang === 'ar' ? 'هيكلة التداريب (Academy)' : 'Course Management'}
                  </h3>
                  <button
                    onClick={() => { 
                      setEditingCourse(null); 
                      setShowCourseEditor(true); 
                    }}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-teal-500/20 transition-all hover:scale-105"
                  >
                    <Plus size={16}/> {lang === 'ar' ? 'مسار جديد' : 'New Course'}
                  </button>
                </div>

                {showCourseEditor ? (
                  <SmartCourseBuilder 
                    initialData={editingCourse || null}
                    onCancel={() => setShowCourseEditor(false)}
                    onSave={handleSaveCourseFromEditor}
                  />
                ) : (
                  <div className="glass-card rounded-2xl p-6">
                    {loadingCourses ? (
                      <div className="flex justify-center p-8"><Loader2 className="animate-spin text-teal-500" size={32}/></div>
                    ) : (
                      <div className="space-y-3">
                        {courses.map((course, i) => (
                          <motion.div key={course.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                          >
                            <div className="flex-1 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-500 hidden sm:flex">
                                <BookOpen size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-[#1e3a5f] dark:text-white">{course.title}</h4>
                                <div className="flex flex-wrap gap-3 mt-1">
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{course.track}</span>
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{course.level}</span>
                                  <span className="text-xs text-slate-500 flex items-center gap-1">{course.modules?.length || 0} Modules</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                              <span className={`px-3 py-1 text-[10px] rounded-full uppercase font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`}>
                                {course.status || 'Published'}
                              </span>
                              <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                                <button onClick={() => { setEditingCourse(course); setShowCourseEditor(true); }} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit size={15}/></button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={15}/></button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {courses.length === 0 && (
                          <p className="text-center text-slate-500 font-bold py-8">{lang === 'ar' ? 'لا توجد مسارات أكاديمية' : 'No courses found'}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ PROJECTS TAB ═══════════════ */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Rocket className="text-indigo-500"/> {lang === 'ar' ? 'إدارة المشاريع الهندسية' : 'Engineering Projects'}
                  </h3>
                  <button
                    onClick={() => { 
                      setEditingProject(null); 
                      setShowProjectEditor(true); 
                    }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-105"
                  >
                    <Plus size={16}/> {lang === 'ar' ? 'مشروع جديد' : 'New Project'}
                  </button>
                </div>

                {showProjectEditor ? (
                  <SmartProjectBuilder 
                    initialData={editingProject || null}
                    onCancel={() => setShowProjectEditor(false)}
                    onSave={handleSaveProjectFromEditor}
                  />
                ) : (
                  <div className="glass-card rounded-2xl p-6">
                    {loadingProjects ? (
                      <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" size={32}/></div>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((project, i) => (
                          <motion.div key={project.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                          >
                            <div className="flex-1 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 hidden sm:flex shrink-0">
                                <Rocket size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? (project.titleAr || project.titleEn) : (project.titleEn || project.titleAr)}</h4>
                                <div className="flex flex-wrap gap-3 mt-1">
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{project.category}</span>
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-indigo-500">{project.progress}%</span>
                                  <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={12}/> {project.teamMembers?.length || 0} Members</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                              <span className={`px-3 py-1 text-[10px] rounded-full uppercase font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`}>
                                {project.status}
                              </span>
                              <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                                <button onClick={() => { setEditingProject(project); setShowProjectEditor(true); }} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit size={15}/></button>
                                <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={15}/></button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {projects.length === 0 && (
                          <p className="text-center text-slate-500 font-bold py-8">{lang === 'ar' ? 'لا توجد مشاريع هندسية' : 'No projects found'}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ MEMBERS TAB ═══════════════ */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <MembersDashboard />
              </div>
            )}

            {/* ═══════════════ ACTIVITY TAB ═══════════════ */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <ActivityLog />
              </div>
            )}

            {/* ═══════════════ MEDIA LIBRARY TAB ═══════════════ */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <ImageIcon className="text-indigo-500"/> {lang === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}
                  </h3>
                  <button 
                    onClick={() => { setShowMediaModal(true); setMediaForm({ title: '', category: '' }); setMediaFile(null); }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Upload size={16}/> {lang === 'ar' ? 'رفع ملف' : 'Upload File'}
                  </button>
                </div>

                {loadingMedia ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" size={32}/></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaItems.map((item, i) => (
                      <motion.div key={item.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                        className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 group relative cursor-pointer hover:shadow-lg transition-all"
                      >
                        <div className="h-32 relative bg-slate-100 dark:bg-slate-800">
                          {item.type === 'image' && item.url ? (
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          ) : item.type === 'video' && item.url ? (
                            <video src={item.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20">
                              <ImageIcon size={32} className="text-indigo-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/40 text-white backdrop-blur-sm transition-all"><Eye size={20}/></a>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteMedia(item.id); }} className="p-2 bg-red-500/80 rounded-full hover:bg-red-600 text-white backdrop-blur-sm transition-all"><Trash2 size={20}/></button>
                          </div>
                          {item.type === 'video' && (
                            <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">VIDEO</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-[#1e3a5f] dark:text-white truncate">{item.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-slate-600 dark:text-slate-400">{item.size}</span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400">{item.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Media Upload Modal */}
                <AnimatePresence>
                  {showMediaModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                      onClick={() => setShowMediaModal(false)}
                    >
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        className="glass-card rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white">
                            {lang === 'ar' ? 'رفع وسائط جديدة' : 'Upload New Media'}
                          </h3>
                          <button onClick={() => setShowMediaModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 p-1"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'العنوان (اختياري)' : 'Title (Optional)'}</label>
                            <input type="text" value={mediaForm.title} onChange={e => setMediaForm(p => ({...p, title: e.target.value}))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'التصنيف' : 'Category'}</label>
                            <input type="text" value={mediaForm.category} onChange={e => setMediaForm(p => ({...p, category: e.target.value}))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الملف' : 'File'}</label>
                            <input type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files[0])}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
                            />
                          </div>
                          <button onClick={handleUploadMedia} disabled={!mediaFile || isUploadingMedia}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                          >
                            {isUploadingMedia ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16}/>} 
                            {isUploadingMedia ? (lang === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (lang === 'ar' ? 'رفع الملف' : 'Upload File')}
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ═══════════════ SEO TOOLS TAB ═══════════════ */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <Search className="text-emerald-500"/> {lang === 'ar' ? 'أدوات تحسين محركات البحث' : 'SEO Tools Dashboard'}
                </h3>

                {/* SEO Status Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: lang === 'ar' ? 'الصفحات المفهرسة' : 'Indexed Pages', value: seoData.indexedPages, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'آخر زحف' : 'Last Crawl', value: seoData.lastCrawl, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'حالة خريطة الموقع' : 'Sitemap', value: lang === 'ar' ? 'سليمة' : 'Healthy', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'أخطاء' : 'Errors', value: seoData.errors, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                  ].map((stat, i) => (
                    <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className={`glass-card rounded-2xl p-4 ${stat.bg}`}
                    >
                      <stat.icon className={`mb-2 ${stat.color}`} size={22}/>
                      <p className="text-lg font-bold text-[#1e3a5f] dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Page Title Checker */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500"/> {lang === 'ar' ? 'فحص عنوان الصفحة' : 'Page Title Checker'}
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text" value={seoData.pageTitle}
                      onChange={e => setSeoData(p => ({ ...p, pageTitle: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 w-48">
                          <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${seoData.titleScore}%` }} />
                        </div>
                        <span className="text-sm font-bold text-emerald-500">{seoData.titleScore}/100</span>
                      </div>
                      <span className={`text-xs font-bold ${seoData.pageTitle.length <= 60 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {seoData.pageTitle.length}/60 {lang === 'ar' ? 'حرف' : 'chars'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Meta Description Editor */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                    <Edit size={18} className="text-purple-500"/> {lang === 'ar' ? 'محرر الوصف التعريفي' : 'Meta Description Editor'}
                  </h4>
                  <div className="space-y-3">
                    <textarea
                      rows={3} value={seoData.metaDescription}
                      onChange={e => setSeoData(p => ({ ...p, metaDescription: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" style={{ width: `${seoData.descriptionScore}%` }} />
                        </div>
                        <span className="text-sm font-bold text-purple-500">{seoData.descriptionScore}/100</span>
                      </div>
                      <span className={`text-xs font-bold ${seoData.metaDescription.length <= 160 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {seoData.metaDescription.length}/160 {lang === 'ar' ? 'حرف' : 'chars'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Sitemap Status */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                    <Link2 size={18} className="text-emerald-500"/> {lang === 'ar' ? 'حالة خريطة الموقع' : 'Sitemap Status'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 flex items-center gap-3">
                      <CheckCircle className="text-emerald-500" size={24}/>
                      <div>
                        <p className="font-bold text-sm text-[#1e3a5f] dark:text-white">sitemap.xml</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{lang === 'ar' ? 'سليمة ومحدثة' : 'Valid & Up-to-date'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 flex items-center gap-3">
                      <CheckCircle className="text-emerald-500" size={24}/>
                      <div>
                        <p className="font-bold text-sm text-[#1e3a5f] dark:text-white">robots.txt</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{lang === 'ar' ? 'مُعدّ بشكل صحيح' : 'Properly Configured'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-900/30 flex items-center gap-3">
                      <AlertTriangle className="text-amber-500" size={24}/>
                      <div>
                        <p className="font-bold text-sm text-[#1e3a5f] dark:text-white">canonical URLs</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">{lang === 'ar' ? 'خطأان يحتاجان إصلاح' : '2 issues need fixing'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ═══════════════ PUBLISHING QUEUE TAB ═══════════════ */}
            {activeTab === 'queue' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <ListChecks className="text-amber-500"/> {lang === 'ar' ? 'طابور النشر' : 'Publishing Queue'}
                  </h3>
                  <span className="px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-bold">
                    {publishQueue.length} {lang === 'ar' ? 'بانتظار المراجعة' : 'Pending Review'}
                  </span>
                </div>

                {publishQueue.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-card rounded-2xl p-12 text-center"
                  >
                    <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48}/>
                    <h4 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">{lang === 'ar' ? 'كل شيء محدث!' : 'All Caught Up!'}</h4>
                    <p className="text-sm text-slate-500">{lang === 'ar' ? 'لا توجد عناصر بانتظار المراجعة.' : 'No items pending review.'}</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {publishQueue.map((item, i) => (
                      <motion.div key={item.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                        className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-bold ${
                                item.type === 'article' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : item.type === 'press' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              }`}>{item.type}</span>
                              <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-bold ${
                                item.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : item.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                              }`}>{item.priority}</span>
                            </div>
                            <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? item.titleAr : item.title}</h4>
                            <div className="flex gap-3 mt-1">
                              <span className="text-xs text-slate-500">{lang === 'ar' ? 'بواسطة: ' : 'By: '}{item.author}</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={11}/> {item.submittedDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveQueue(item.id)}
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                            >
                              <CheckCircle size={16}/> {lang === 'ar' ? 'موافقة' : 'Approve'}
                            </button>
                            <button onClick={() => handleRejectQueue(item.id)}
                              className="bg-slate-100 dark:bg-slate-800 text-red-500 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <XCircle size={16}/> {lang === 'ar' ? 'رفض' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ PROFILE TAB ═══════════════ */}
            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{
                name: managerName,
                role: 'content_manager',
                email: managerEmail,
                badges: currentUser?.badges || ['writer', 'designer'],
                membershipId: currentUser?.membershipId || 'GITM-2026-MEDIA'
              }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
