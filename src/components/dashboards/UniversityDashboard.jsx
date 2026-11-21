import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, Users, BookOpen, Settings, Microscope, Globe,
  FileText, TrendingUp, BarChart3, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '../../utils/toast';

export default function UniversityDashboard() {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [researchCollabs, setResearchCollabs] = useState([]);
  const [exchangePrograms, setExchangePrograms] = useState([]);
  const [jointCourses, setJointCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showResearchModal, setShowResearchModal] = useState(false);
  const [newResearch, setNewResearch] = useState({ title: '', lead: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const coursesList = [];
        coursesSnap.forEach(doc => {
          const data = doc.data();
          if (data.isJointWithUniversity) {
            coursesList.push({
              id: doc.id,
              name: lang === 'ar' && data.title_ar ? data.title_ar : (data.title_en || 'Untitled'),
              students: data.students || 0,
              professor: data.teacherName || 'GITM Professor',
              status: 'Active'
            });
          }
        });

        if (coursesList.length === 0) {
          coursesList.push(
            { name: lang === 'ar' ? 'هندسة الذكاء الاصطناعي' : 'AI Engineering', students: 45, professor: 'Prof. Amrani + Mourad', status: 'Active' },
            { name: lang === 'ar' ? 'تصميم أنظمة إنترنت الأشياء' : 'IoT Systems Design', students: 32, professor: 'Dr. Benjelloun + Youssef', status: 'Active' },
            { name: lang === 'ar' ? 'الحوسبة السحابية المتقدمة' : 'Advanced Cloud Computing', students: 28, professor: 'Prof. Tazi + Khadija', status: 'Upcoming' },
            { name: lang === 'ar' ? 'الروبوتيك المتقدم' : 'Advanced Robotics', students: 20, professor: 'Prof. El Fassi + Ahmed', status: 'Upcoming' }
          );
        }
        setJointCourses(coursesList);

        const researchSnap = await getDocs(collection(db, 'research_collaborations'));
        const researchList = [];
        researchSnap.forEach(doc => researchList.push({ id: doc.id, ...doc.data() }));
        if (researchList.length === 0) {
          researchList.push(
            { id: 1, title: lang === 'ar' ? 'أبحاث التعلم العميق للمدن الذكية' : 'Deep Learning for Smart Cities Research', lead: 'Prof. Amrani', students: 12, status: 'Active', papers: 3 },
            { id: 2, title: lang === 'ar' ? 'الأمن السيبراني للبنية التحتية الحيوية' : 'Cybersecurity for Critical Infrastructure', lead: 'Dr. Benjelloun', students: 8, status: 'Active', papers: 1 },
            { id: 3, title: lang === 'ar' ? 'إنترنت الأشياء في الزراعة الذكية' : 'IoT in Smart Agriculture', lead: 'Prof. Tazi', students: 6, status: 'Completed', papers: 5 }
          );
        }
        setResearchCollabs(researchList);

        const exchangeSnap = await getDocs(collection(db, 'exchange_programs'));
        const exchangeList = [];
        exchangeSnap.forEach(doc => exchangeList.push({ id: doc.id, ...doc.data() }));
        if (exchangeList.length === 0) {
          exchangeList.push(
            { id: 1, title: lang === 'ar' ? 'برنامج التبادل الأكاديمي مع GITM' : 'Academic Exchange with GITM', duration: '6 months', spots: 15, filled: 11 },
            { id: 2, title: lang === 'ar' ? 'منحة بحثية مشتركة' : 'Joint Research Fellowship', duration: '12 months', spots: 5, filled: 3 }
          );
        }
        setExchangePrograms(exchangeList);

      } catch (err) {
        console.error("Error fetching university data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  const handleProposeResearch = async () => {
    if (!newResearch.title) return;
    try {
      const researchData = {
        title: newResearch.title,
        lead: newResearch.lead || currentUser?.name || 'Unknown',
        students: 0,
        status: 'Proposed',
        papers: 0,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'research_collaborations'), researchData);
      setResearchCollabs(prev => [...prev, { id: docRef.id, ...researchData }]);
      setShowResearchModal(false);
      setNewResearch({ title: '', lead: '' });
      toast.success(lang === 'ar' ? 'تم تقديم الاقتراح بنجاح' : 'Research proposed successfully');
    } catch (err) {
      console.error("Error proposing research:", err);
      toast.error(lang === 'ar' ? 'حدث خطأ' : 'Error proposing research');
    }
  };

  const tabs = [
    { id: 'overview', icon: BarChart3, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'research', icon: Microscope, label: lang === 'ar' ? 'التعاون البحثي' : 'Research Collabs' },
    { id: 'exchange', icon: Globe, label: lang === 'ar' ? 'برامج التبادل' : 'Exchange Programs' },
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'المقررات المشتركة' : 'Joint Courses' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-6 animate-fade-in-up pb-12 md:pb-10 md:min-h-screen relative w-full max-w-[100vw] overflow-x-hidden">

      {/* Mobile Header + Scrollable Top Tabs */}
      <div className="md:hidden space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="min-w-0">
            <h2 className="text-lg font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white truncate">
              {lang === 'ar' ? 'بوابة الجامعة' : 'University Portal'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              {currentUser?.name || 'Academic Partner'}
            </p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            {(currentUser?.name || 'A').charAt(0)}
          </div>
        </div>

        <nav
          aria-label={lang === 'ar' ? 'تبويبات بوابة الجامعة' : 'University portal tabs'}
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
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
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
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-indigo-200 dark:border-indigo-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة الجامعة' : 'University Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{currentUser?.name || 'Academic Partner'}</p>
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
                      ? 'bg-indigo-600 text-white shadow-sm'
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
                    { title: lang === 'ar' ? 'الأبحاث المشتركة' : 'Joint Research', value: '3', icon: Microscope, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' },
                    { title: lang === 'ar' ? 'الأوراق العلمية' : 'Published Papers', value: '9', icon: FileText, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
                    { title: lang === 'ar' ? 'الطلاب المشاركون' : 'Exchange Students', value: '26', icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
                    { title: lang === 'ar' ? 'المقررات المشتركة' : 'Joint Courses', value: '4', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
                  ].map((s, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 md:p-6 overflow-hidden border border-slate-200/70 dark:border-slate-800">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-1">{s.title}</p>
                          <h3 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] dark:text-white">{s.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl shrink-0 ${s.color}`}><s.icon size={22} /></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 border-t-4 border-indigo-500 overflow-hidden">
                  <h3 className="text-lg md:text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-4">
                    <TrendingUp className="text-indigo-500 shrink-0" />
                    <span>{lang === 'ar' ? 'مؤشرات الأداء الأكاديمي' : 'Academic Performance Index'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">92%</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{lang === 'ar' ? 'معدل رضا الطلاب' : 'Student Satisfaction'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.7/5</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{lang === 'ar' ? 'تقييم المقررات' : 'Course Rating'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">87%</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{lang === 'ar' ? 'معدل التخرج' : 'Graduation Rate'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Microscope className="text-indigo-500 shrink-0" />
                    <span>{lang === 'ar' ? 'التعاون البحثي' : 'Research Collaborations'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowResearchModal(true)}
                    className="w-full sm:w-auto min-h-[44px] bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Plus size={16} /> {lang === 'ar' ? 'اقتراح بحث' : 'Propose Research'}
                  </button>
                </div>

                <AnimatePresence>
                  {showResearchModal && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-900/30">
                        <h4 className="font-bold text-base sm:text-lg mb-4 text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'اقتراح بحث جديد' : 'Propose New Research'}</h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'عنوان البحث' : 'Research Title'}
                            value={newResearch.title}
                            onChange={e => setNewResearch({ ...newResearch, title: e.target.value })}
                            className="w-full min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'الباحث الرئيسي' : 'Lead Researcher'}
                            value={newResearch.lead}
                            onChange={e => setNewResearch({ ...newResearch, lead: e.target.value })}
                            className="w-full min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5">
                            <button type="button" onClick={() => setShowResearchModal(false)} className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                            <button type="button" onClick={handleProposeResearch} className="w-full sm:w-auto min-h-[44px] bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700">{lang === 'ar' ? 'إرسال الاقتراح' : 'Submit Proposal'}</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {researchCollabs.map(r => (
                    <div key={r.id} className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden border border-slate-200/70 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                        <div className="min-w-0">
                          <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white break-words">{r.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{lang === 'ar' ? 'المشرف:' : 'Lead:'} {r.lead} • {r.students} {lang === 'ar' ? 'باحث' : 'Researchers'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${r.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{r.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5"><FileText size={14} /> {r.papers} {lang === 'ar' ? 'أوراق منشورة' : 'Published Papers'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <Globe className="text-blue-500 shrink-0" />
                  <span>{lang === 'ar' ? 'برامج التبادل الأكاديمي' : 'Academic Exchange Programs'}</span>
                </h3>
                <div className="space-y-4">
                  {exchangePrograms.map(p => (
                    <div key={p.id} className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden border border-slate-200/70 dark:border-slate-800">
                      <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white mb-4 break-words">{p.title}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <p className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{p.duration}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{lang === 'ar' ? 'المدة' : 'Duration'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{p.filled}/{p.spots}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{lang === 'ar' ? 'المقاعد' : 'Spots Filled'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-center">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                            <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(p.filled / p.spots) * 100}%` }} />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-1.5">{Math.round((p.filled / p.spots) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-5 md:mb-6">
                  <BookOpen className="text-purple-500 shrink-0" />
                  <span>{lang === 'ar' ? 'المقررات المشتركة مع GITM' : 'Joint Courses with GITM'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jointCourses.map((c, i) => (
                    <div key={i} className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-base text-[#1e3a5f] dark:text-white break-words">{c.name}</h4>
                        <span className={`px-2.5 py-1 text-xs rounded-full uppercase font-bold shrink-0 ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-1.5"><Users size={14} /> {c.students} {lang === 'ar' ? 'طالب' : 'Students'}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><GraduationCap size={14} /> {c.professor}</p>
                    </div>
                  ))}
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
