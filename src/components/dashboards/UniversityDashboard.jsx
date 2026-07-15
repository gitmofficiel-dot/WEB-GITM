import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, Users, BookOpen, Award, Settings, Microscope, Globe, 
  FileText, TrendingUp, Calendar, CheckCircle, BarChart3, Building, Plus
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

  const [researchCollabs, setResearchCollabs] = useState([
    { id: 1, title: lang==='ar'?'أبحاث التعلم العميق للمدن الذكية':'Deep Learning for Smart Cities Research', lead: 'Prof. Amrani', students: 12, status: 'Active', papers: 3 },
    { id: 2, title: lang==='ar'?'الأمن السيبراني للبنية التحتية الحيوية':'Cybersecurity for Critical Infrastructure', lead: 'Dr. Benjelloun', students: 8, status: 'Active', papers: 1 },
    { id: 3, title: lang==='ar'?'إنترنت الأشياء في الزراعة الذكية':'IoT in Smart Agriculture', lead: 'Prof. Tazi', students: 6, status: 'Completed', papers: 5 }
  ]);

  const [exchangePrograms, setExchangePrograms] = useState([
    { id: 1, title: lang==='ar'?'برنامج التبادل الأكاديمي مع GITM':'Academic Exchange with GITM', duration: '6 months', spots: 15, filled: 11 },
    { id: 2, title: lang==='ar'?'منحة بحثية مشتركة':'Joint Research Fellowship', duration: '12 months', spots: 5, filled: 3 }
  ]);

  const [jointCourses, setJointCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [newResearch, setNewResearch] = useState({ title: '', lead: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, 'courses'));
        const coursesList = [];
        snap.forEach(doc => {
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
        
        if(coursesList.length === 0) {
          coursesList.push(
            { name: lang==='ar'?'هندسة الذكاء الاصطناعي':'AI Engineering', students: 45, professor: 'Prof. Amrani + Mourad', status: 'Active' },
            { name: lang==='ar'?'تصميم أنظمة إنترنت الأشياء':'IoT Systems Design', students: 32, professor: 'Dr. Benjelloun + Youssef', status: 'Active' },
            { name: lang==='ar'?'الحوسبة السحابية المتقدمة':'Advanced Cloud Computing', students: 28, professor: 'Prof. Tazi + Khadija', status: 'Upcoming' },
            { name: lang==='ar'?'الروبوتيك المتقدم':'Advanced Robotics', students: 20, professor: 'Prof. El Fassi + Ahmed', status: 'Upcoming' }
          );
        }
        setJointCourses(coursesList);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [lang]);

  const handleProposeResearch = () => {
    if(!newResearch.title) return;
    setResearchCollabs(prev => [...prev, {
      id: Date.now(),
      title: newResearch.title,
      lead: newResearch.lead || currentUser?.name,
      students: 0,
      status: 'Proposed',
      papers: 0
    }]);
    setShowResearchModal(false);
    setNewResearch({ title: '', lead: '' });
    toast.success(lang === 'ar' ? 'تم تقديم الاقتراح' : 'Research proposed');
  };

  const tabs = [
    { id: 'overview', icon: BarChart3, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'research', icon: Microscope, label: lang === 'ar' ? 'التعاون البحثي' : 'Research Collabs' },
    { id: 'exchange', icon: Globe, label: lang === 'ar' ? 'برامج التبادل' : 'Exchange Programs' },
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'المقررات المشتركة' : 'Joint Courses' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative w-full max-w-[100vw] overflow-x-hidden">
      <div className="w-full md:w-64 shrink-0 min-w-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-indigo-200 dark:border-indigo-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة الجامعة' : 'University Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentUser?.name || 'Academic Partner'}</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg translate-x-2' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-800'
                  }`}>
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: lang==='ar'?'الأبحاث المشتركة':'Joint Research', value: '3', icon: Microscope, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' },
                    { title: lang==='ar'?'الأوراق العلمية':'Published Papers', value: '9', icon: FileText, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
                    { title: lang==='ar'?'الطلاب المشاركون':'Exchange Students', value: '26', icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
                    { title: lang==='ar'?'المقررات المشتركة':'Joint Courses', value: '4', icon: BookOpen, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
                  ].map((s, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6">
                      <div className="flex justify-between items-start">
                        <div><p className="text-slate-500 text-sm mb-1">{s.title}</p><h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{s.value}</h3></div>
                        <div className={`p-3 rounded-xl ${s.color}`}><s.icon size={22}/></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-3xl p-6 border-t-4 border-indigo-500">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-4"><TrendingUp className="text-indigo-500"/>{lang==='ar'?'مؤشرات الأداء الأكاديمي':'Academic Performance Index'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">92%</p>
                      <p className="text-sm text-slate-500 mt-1">{lang==='ar'?'معدل رضا الطلاب':'Student Satisfaction'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.7/5</p>
                      <p className="text-sm text-slate-500 mt-1">{lang==='ar'?'تقييم المقررات':'Course Rating'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                      <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">87%</p>
                      <p className="text-sm text-slate-500 mt-1">{lang==='ar'?'معدل التخرج':'Graduation Rate'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Microscope className="text-indigo-500"/>{lang==='ar'?'التعاون البحثي':'Research Collaborations'}</h3>
                  <button onClick={() => setShowResearchModal(true)} className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"><Plus size={16}/> {lang==='ar'?'اقتراح بحث':'Propose Research'}</button>
                </div>
                
                {/* Proposal Modal */}
                <AnimatePresence>
                  {showResearchModal && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-6 border border-indigo-200 dark:border-indigo-900/30">
                        <h4 className="font-bold text-lg mb-4 text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'اقتراح بحث جديد' : 'Propose New Research'}</h4>
                        <div className="space-y-4">
                          <input type="text" placeholder={lang === 'ar' ? 'عنوان البحث' : 'Research Title'} value={newResearch.title} onChange={e => setNewResearch({...newResearch, title: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
                          <input type="text" placeholder={lang === 'ar' ? 'الباحث الرئيسي' : 'Lead Researcher'} value={newResearch.lead} onChange={e => setNewResearch({...newResearch, lead: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setShowResearchModal(false)} className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                            <button onClick={handleProposeResearch} className="bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-600">{lang === 'ar' ? 'إرسال الاقتراح' : 'Submit Proposal'}</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {researchCollabs.map(r => (
                  <div key={r.id} className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{r.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{lang==='ar'?'المشرف:':'Lead:'} {r.lead} • {r.students} {lang==='ar'?'باحث':'Researchers'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{r.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><FileText size={14}/> {r.papers} {lang==='ar'?'أوراق منشورة':'Published Papers'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Globe className="text-blue-500"/>{lang==='ar'?'برامج التبادل الأكاديمي':'Academic Exchange Programs'}</h3>
                {exchangePrograms.map(p => (
                  <div key={p.id} className="glass-card rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-3">{p.title}</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-2xl font-bold text-indigo-600">{p.duration}</p><p className="text-xs text-slate-500">{lang==='ar'?'المدة':'Duration'}</p></div>
                      <div><p className="text-2xl font-bold text-emerald-600">{p.filled}/{p.spots}</p><p className="text-xs text-slate-500">{lang==='ar'?'المقاعد':'Spots Filled'}</p></div>
                      <div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(p.filled/p.spots)*100}%` }}></div></div>
                        <p className="text-xs text-slate-500 mt-1">{Math.round((p.filled/p.spots)*100)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><BookOpen className="text-purple-500"/>{lang==='ar'?'المقررات المشتركة مع GITM':'Joint Courses with GITM'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jointCourses.map((c, i) => (
                    <div key={i} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{c.name}</h4>
                        <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{c.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Users size={14}/> {c.students} {lang === 'ar' ? 'طالب' : 'Students'}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-2"><GraduationCap size={14}/> {c.professor}</p>
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
