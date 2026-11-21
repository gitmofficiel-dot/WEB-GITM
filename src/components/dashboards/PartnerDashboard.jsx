import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3, FolderOpen, MessageSquare, Settings, Users, TrendingUp,
  FileText, Calendar, Send, Plus, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '../../utils/toast';

export default function PartnerDashboard() {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [partnershipMetrics, setPartnershipMetrics] = useState({
    sharedProjects: 0,
    totalReach: '0+',
    eventsCoHosted: 0,
    satisfactionScore: 0
  });

  const [sharedProjects, setSharedProjects] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(collection(db, 'projects'));
        const projectsList = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data.isSharedWithPartner) {
            projectsList.push({
              id: doc.id,
              title: lang === 'ar' && data.title_ar ? data.title_ar : (data.title_en || 'Untitled Project'),
              status: data.progress === 100 ? 'Completed' : (data.progress > 0 ? 'Active' : 'Planning'),
              gitm_lead: data.creatorName || 'GITM Team',
              partner_lead: currentUser?.name || 'Partner Lead',
              progress: data.progress || 0
            });
          }
        });
        if (projectsList.length === 0) {
          projectsList.push(
            { id: 1, title: lang === 'ar' ? 'مبادرة المدن الذكية المغربية' : 'Moroccan Smart Cities Initiative', status: 'Active', gitm_lead: 'Mourad', partner_lead: currentUser?.name || 'Partner Lead', progress: 68 },
            { id: 2, title: lang === 'ar' ? 'برنامج احتضان الشركات الناشئة' : 'Startup Incubation Program', status: 'Planning', gitm_lead: 'Youssef Alaoui', partner_lead: currentUser?.name || 'Partner Lead', progress: 20 },
            { id: 3, title: lang === 'ar' ? 'مختبر البحث في الذكاء الاصطناعي' : 'AI Research Lab Partnership', status: 'Completed', gitm_lead: 'Khadija Mansouri', partner_lead: currentUser?.name || 'Partner Lead', progress: 100 }
          );
        }
        setSharedProjects(projectsList);

        const commsSnap = await getDocs(collection(db, 'communications'));
        const commsList = [];
        commsSnap.forEach(doc => commsList.push({ id: doc.id, ...doc.data() }));
        if (commsList.length === 0) {
          commsList.push(
            { id: 1, from: 'Mourad (GITM President)', subject: lang === 'ar' ? 'اجتماع مراجعة الشراكة Q3' : 'Q3 Partnership Review Meeting', date: '2026-06-25', unread: true },
            { id: 2, from: 'Youssef Alaoui', subject: lang === 'ar' ? 'تحديث مشروع المدن الذكية' : 'Smart Cities Project Update', date: '2026-06-20', unread: false },
            { id: 3, from: 'GITM Academy', subject: lang === 'ar' ? 'فرصة تدريب مشترك جديدة' : 'New Joint Training Opportunity', date: '2026-06-18', unread: true }
          );
        }
        setCommunications(commsList);

        setPartnershipMetrics({
          sharedProjects: projectsList.length,
          totalReach: '12,500+',
          eventsCoHosted: 7,
          satisfactionScore: 4.8
        });

      } catch (err) {
        console.error("Error fetching partner data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [currentUser, lang]);

  const handleProposeProject = async () => {
    if (!newProject.title) return;
    try {
      await addDoc(collection(db, 'projects'), {
        title_en: newProject.title,
        title_ar: newProject.title,
        description_en: newProject.description,
        isSharedWithPartner: true,
        creatorName: currentUser?.name || 'Partner',
        progress: 0,
        createdAt: serverTimestamp()
      });
      setShowProjectModal(false);
      setNewProject({ title: '', description: '' });
      toast.success(lang === 'ar' ? 'تم تقديم الاقتراح بنجاح!' : 'Project proposed successfully!');
    } catch (err) {
      toast.error('Error proposing project');
    }
  };

  const tabs = [
    { id: 'overview', icon: BarChart3, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'projects', icon: FolderOpen, label: lang === 'ar' ? 'المشاريع المشتركة' : 'Shared Projects' },
    { id: 'communications', icon: MessageSquare, label: lang === 'ar' ? 'التواصل مع GITM' : 'Communications' },
    { id: 'reports', icon: FileText, label: lang === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Stats' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-6 animate-fade-in-up pb-12 md:pb-10 md:min-h-screen relative w-full max-w-[100vw] overflow-x-hidden">

      {/* Mobile Header + Scrollable Top Tabs */}
      <div className="md:hidden space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="min-w-0">
            <h2 className="text-lg font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white truncate">
              {lang === 'ar' ? 'بوابة الشريك' : 'Partner Portal'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              {currentUser?.name || 'Corporate Partner'}
            </p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
            {(currentUser?.name || 'C').charAt(0)}
          </div>
        </div>

        <nav
          aria-label={lang === 'ar' ? 'تبويبات بوابة الشريك' : 'Partner portal tabs'}
          className="filter-scroll pb-1 -mx-1 px-1"
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate max-w-[130px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-full md:w-64 shrink-0 min-w-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-emerald-200 dark:border-emerald-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة الشريك' : 'Partner Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{currentUser?.name || 'Corporate Partner'}</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5 md:space-y-6">

            {activeTab === 'overview' && (
              <div className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: lang === 'ar' ? 'المشاريع المشتركة' : 'Shared Projects', value: partnershipMetrics.sharedProjects, icon: FolderOpen, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
                    { title: lang === 'ar' ? 'الوصول الإجمالي' : 'Total Reach', value: partnershipMetrics.totalReach, icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
                    { title: lang === 'ar' ? 'الفعاليات المشتركة' : 'Co-Hosted Events', value: partnershipMetrics.eventsCoHosted, icon: Calendar, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
                    { title: lang === 'ar' ? 'معدل الرضا' : 'Satisfaction', value: partnershipMetrics.satisfactionScore + '/5', icon: Star, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 md:p-6 overflow-hidden border border-slate-200/70 dark:border-slate-800">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium mb-1">{stat.title}</p>
                          <h3 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] dark:text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl shrink-0 ${stat.color}`}><stat.icon size={22} /></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 overflow-hidden border border-emerald-200/60 dark:border-emerald-900/30">
                  <h3 className="text-lg md:text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-3 md:mb-4">
                    <TrendingUp className="text-emerald-500 shrink-0" size={22} />
                    <span>{lang === 'ar' ? 'ملخص الشراكة' : 'Partnership Summary'}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'ar'
                      ? 'شراكتكم مع GITM حققت نتائج ممتازة خلال الأشهر الثلاثة الأخيرة. تم إنجاز مشروع مختبر الذكاء الاصطناعي بنجاح، مع زيادة في التفاعل بنسبة 35%.'
                      : 'Your partnership with GITM has achieved excellent results over the past quarter. The AI Research Lab project was completed successfully, with a 35% increase in engagement.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <FolderOpen className="text-emerald-500 shrink-0" />
                    <span>{lang === 'ar' ? 'المشاريع المشتركة' : 'Shared Projects'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(true)}
                    className="w-full sm:w-auto min-h-[44px] bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    <Plus size={16} /> {lang === 'ar' ? 'اقتراح مشروع' : 'Propose Project'}
                  </button>
                </div>

                <AnimatePresence>
                  {showProjectModal && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-900/30">
                        <h4 className="font-bold text-base sm:text-lg mb-4 text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'اقتراح مشروع جديد' : 'Propose New Project'}</h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'عنوان المشروع' : 'Project Title'}
                            value={newProject.title}
                            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          <textarea
                            placeholder={lang === 'ar' ? 'تفاصيل المشروع وأهدافه' : 'Project details and objectives'}
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-slate-900 dark:text-white min-h-[100px] focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5">
                            <button type="button" onClick={() => setShowProjectModal(false)} className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                            <button type="button" onClick={handleProposeProject} className="w-full sm:w-auto min-h-[44px] bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700">{lang === 'ar' ? 'إرسال الاقتراح' : 'Submit Proposal'}</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {sharedProjects.map(project => (
                    <div key={project.id} className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden border border-slate-200/70 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                        <div className="min-w-0">
                          <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white break-words">{project.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 break-words">GITM Lead: {project.gitm_lead} • Partner Lead: {project.partner_lead}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : project.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{project.status}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${project.progress === 100 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${project.progress}%` }} />
                      </div>
                      <p className="text-end text-xs mt-2 text-slate-600 dark:text-slate-300 font-bold">{project.progress}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <MessageSquare className="text-blue-500 shrink-0" />
                    <span>{lang === 'ar' ? 'الرسائل والتواصل' : 'Messages & Communications'}</span>
                  </h3>
                  <button
                    type="button"
                    className="w-full sm:w-auto min-h-[44px] bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Send size={16} /> {lang === 'ar' ? 'رسالة جديدة' : 'New Message'}
                  </button>
                </div>
                <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 overflow-hidden">
                  {communications.map(msg => (
                    <div key={msg.id} className={`flex justify-between items-center gap-3 p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 last:border-none ${msg.unread ? 'bg-blue-50/50 dark:bg-blue-900/10 rounded-xl' : ''}`}>
                      <div className="min-w-0">
                        <h4 className={`text-sm sm:text-base text-[#1e3a5f] dark:text-white break-words ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.subject}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{msg.from} • {msg.date}</p>
                      </div>
                      {msg.unread && <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-blue-500 animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-5 md:mb-6">
                  <FileText className="text-purple-500 shrink-0" />
                  <span>{lang === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'التأثير الاجتماعي' : 'Social Impact'}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'طلاب مستفيدون' : 'Students Benefited'}</span><span className="font-bold text-emerald-600 dark:text-emerald-400">2,450</span></div>
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'ورش عمل منظمة' : 'Workshops Organized'}</span><span className="font-bold text-emerald-600 dark:text-emerald-400">14</span></div>
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'شهادات ممنوحة' : 'Certificates Issued'}</span><span className="font-bold text-emerald-600 dark:text-emerald-400">680</span></div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics'}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}</span><span className="font-bold text-blue-600 dark:text-blue-400">92%</span></div>
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'رضا المشاركين' : 'Participant Satisfaction'}</span><span className="font-bold text-blue-600 dark:text-blue-400">4.8/5</span></div>
                      <div className="flex justify-between gap-2"><span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'العائد على الاستثمار' : 'ROI Index'}</span><span className="font-bold text-blue-600 dark:text-blue-400">3.2x</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
