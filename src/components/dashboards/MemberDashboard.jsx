import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { collection, query, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { LayoutDashboard, Calendar, Award, User, Code, Zap, Heart, UserPlus, Search, Users, BookOpen } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';
import HackathonMatchmaker from './HackathonMatchmaker';
import DebuggingLedger from './DebuggingLedger';
import InspirationCard from './InspirationCard';

export default function MemberDashboard() {
  const { lang } = useLanguage();
  const { currentUser: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = authUser || {
    name: 'Member',
    role: 'member',
    email: 'member@gitm.ma',
    badges: ['developer'],
    membershipId: ''
  };

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [addMemberStatus, setAddMemberStatus] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const uid = currentUser?.uid;
        if (!uid) return;

        const eventsQ = query(collection(db, 'events'));
        const eventsSnap = await getDocs(eventsQ);
        const eventsData = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(e => new Date(e.startDate) >= new Date())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);
        setUpcomingEvents(eventsData);

        const projectsQ = query(collection(db, 'projects'));
        const projectsSnap = await getDocs(projectsQ);
        const projectsData = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.creatorId === uid || (p.teamMembers && p.teamMembers.some(m => m.uid === uid)));
        setMyProjects(projectsData);

      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, [currentUser]);

  const handleAddMemberToProject = async (projectId) => {
    if (!searchMemberQuery.trim()) return;
    setAddMemberStatus({ id: projectId, status: 'loading' });
    try {
      const usersQ = query(collection(db, 'users'));
      const usersSnap = await getDocs(usersQ);
      let foundUser = null;
      usersSnap.forEach(doc => {
        const data = doc.data();
        if (data.email === searchMemberQuery.trim() || data.membershipId === searchMemberQuery.trim()) {
          foundUser = { uid: doc.id, name: data.nameLatin || data.name, email: data.email, role: 'member' };
        }
      });

      if (!foundUser) {
        setAddMemberStatus({ id: projectId, status: 'not_found' });
        setTimeout(() => setAddMemberStatus(null), 3000);
        return;
      }

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        teamMembers: arrayUnion(foundUser)
      });

      setMyProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          const currentMembers = p.teamMembers || [];
          if (!currentMembers.some(m => m.uid === foundUser.uid)) {
            return { ...p, teamMembers: [...currentMembers, foundUser] };
          }
        }
        return p;
      }));

      setSearchMemberQuery('');
      setAddMemberStatus({ id: projectId, status: 'success' });
      setTimeout(() => setAddMemberStatus(null), 3000);

    } catch (error) {
      console.error('Error adding member:', error);
      setAddMemberStatus({ id: projectId, status: 'error' });
      setTimeout(() => setAddMemberStatus(null), 3000);
    }
  };

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'projects', icon: Code, label: lang === 'ar' ? 'مشاريعي' : 'My Projects' },
    { id: 'matchmaker', icon: Users, label: lang === 'ar' ? 'فريق الهاكاثون' : 'Matchmaker' },
    { id: 'ledger', icon: BookOpen, label: lang === 'ar' ? 'دفتر الأخطاء' : 'Bug Ledger' },
    { id: 'events', icon: Calendar, label: lang === 'ar' ? 'الأحداث' : 'Events' },
    { id: 'certificates', icon: Award, label: lang === 'ar' ? 'الشهادات' : 'Certificates' },
    { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
  ];

  return (
    <div className="space-y-5 md:space-y-6 pb-12 md:pb-10 md:min-h-screen relative w-full max-w-[100vw] overflow-x-hidden">

      {/* Mobile Header + Scrollable Top Tabs */}
      <div className="md:hidden space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-sm">
          <div className="min-w-0">
            <h2 className="text-lg font-sans font-bold tracking-tight text-white truncate">
              {lang === 'ar' ? 'لوحة العضو' : 'Member Panel'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 truncate">{currentUser?.name}</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
            {(currentUser?.name || 'M').charAt(0)}
          </div>
        </div>

        <nav
          aria-label={lang === 'ar' ? 'تبويبات لوحة العضو' : 'Member dashboard tabs'}
          className="filter-scroll pb-1 -mx-1 px-1"
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                <tab.icon size={16} className="shrink-0" />
                <span className="truncate max-w-[120px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Navigation (Desktop) */}
      <div className="hidden md:flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-sans font-bold tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <UserProfileSettings currentUser={currentUser} />
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5 md:space-y-6">

            <div className="overflow-hidden rounded-2xl">
              <InspirationCard lang={lang} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="glass-card p-5 md:p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-t-2 border-rose-500 overflow-hidden">
                <Code size={28} className="text-rose-400 mb-3" />
                <h4 className="text-slate-600 dark:text-slate-300 text-sm">{lang === 'ar' ? 'المشاريع' : 'Projects Contributed'}</h4>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">12</p>
              </div>
              <div className="glass-card p-5 md:p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-t-2 border-emerald-500 overflow-hidden">
                <Zap size={28} className="text-emerald-400 mb-3" />
                <h4 className="text-slate-600 dark:text-slate-300 text-sm">{lang === 'ar' ? 'النقاط' : 'Activity Points'}</h4>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">1,450</p>
              </div>
              <div className="glass-card p-5 md:p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-t-2 border-blue-500 overflow-hidden">
                <Heart size={28} className="text-blue-400 mb-3" />
                <h4 className="text-slate-600 dark:text-slate-300 text-sm">{lang === 'ar' ? 'ساعات الابتكار' : 'Innovation Hours'}</h4>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">48h</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="glass-card p-5 md:p-6 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-rose-400 shrink-0" />
                  <span>{lang === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events'}</span>
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{lang === 'ar' ? 'لا توجد أحداث قادمة قريباً' : 'No upcoming events soon'}</p>
                  ) : upcomingEvents.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base break-words">{lang === 'ar' ? evt.titleAr || evt.title : evt.titleEn || evt.title}</h4>
                        <p className="text-xs sm:text-sm text-rose-500 dark:text-rose-400 mt-0.5">{evt.startDate}</p>
                      </div>
                      <span className="self-start sm:self-auto text-xs px-2.5 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300 rounded-md font-semibold shrink-0">{evt.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5 md:p-6 flex flex-col items-center justify-center text-center overflow-hidden">
                <Award size={44} className="text-yellow-500 dark:text-yellow-400 mb-3" />
                <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-2">{lang === 'ar' ? 'احصل على شهاداتك' : 'Claim Your Certificates'}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                  {lang === 'ar' ? 'لديك شهادات جديدة متاحة للتحميل من ورشة العمل الأخيرة.' : 'You have new certificates available for download from the recent workshop.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold text-sm shadow-sm"
                >
                  {lang === 'ar' ? 'عرض الشهادات' : 'View Certificates'}
                </button>
              </div>
            </div>

          </motion.div>
        ) : activeTab === 'projects' ? (
          <motion.div key="projects" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5 md:space-y-6">
            <div className="glass-card p-4 sm:p-6 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Code className="text-cyan-500 shrink-0" />
                <span>{lang === 'ar' ? 'مشاريعي وفرق العمل' : 'My Projects & Teams'}</span>
              </h3>

              {myProjects.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{lang === 'ar' ? 'ليس لديك أي مشاريع حالياً.' : "You don't have any projects yet."}</p>
                </div>
              ) : myProjects.map(proj => (
                <div key={proj.id} className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-5 last:mb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white break-words">{proj.title}</h4>
                      <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full mt-2 inline-block">{proj.category || 'Active Project'}</span>
                    </div>
                    {proj.creatorId === currentUser?.uid && (
                      <p className="text-xs sm:text-sm text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1 shrink-0">
                        <Zap size={14} /> {lang === 'ar' ? 'أنت منشئ هذا المشروع' : 'You are the Creator'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 mb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1"><Users size={14} /> {proj.teamMembers ? proj.teamMembers.length : 0} {lang === 'ar' ? 'أعضاء' : 'Members'}</span>
                    {proj.teamMembers && proj.teamMembers.map((m, i) => (
                      <span key={i} className="bg-slate-200 dark:bg-white/10 px-2.5 py-1 rounded-md text-xs font-medium">{m.name}</span>
                    ))}
                  </div>

                  {proj.creatorId === currentUser?.uid && (
                    <div className="border-t border-slate-200 dark:border-white/10 pt-5">
                      <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <UserPlus size={18} className="text-rose-500 shrink-0" />
                        <span>{lang === 'ar' ? 'إضافة عضو للفريق' : 'Add Member to Team'}</span>
                      </h5>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input
                            type="text"
                            value={searchMemberQuery}
                            onChange={(e) => setSearchMemberQuery(e.target.value)}
                            placeholder={lang === 'ar' ? 'البريد الإلكتروني أو رقم العضوية...' : 'Email or Membership ID...'}
                            className="w-full min-h-[48px] bg-white dark:bg-black/30 border border-slate-300 dark:border-white/15 rounded-xl py-2.5 ps-10 pe-4 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddMemberToProject(proj.id)}
                          disabled={addMemberStatus?.id === proj.id && addMemberStatus.status === 'loading'}
                          className="w-full sm:w-auto min-h-[48px] bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 shrink-0"
                        >
                          {addMemberStatus?.id === proj.id && addMemberStatus.status === 'loading' ? '...' : (lang === 'ar' ? 'إضافة العضو' : 'Add Member')}
                        </button>
                      </div>

                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'success' && <p className="text-xs text-emerald-500 font-semibold mt-2">{lang === 'ar' ? 'تمت إضافة العضو بنجاح' : 'Member added successfully'}</p>}
                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'not_found' && <p className="text-xs text-red-500 font-semibold mt-2">{lang === 'ar' ? 'لم يتم العثور على العضو' : 'Member not found'}</p>}
                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'error' && <p className="text-xs text-red-500 font-semibold mt-2">{lang === 'ar' ? 'حدث خطأ' : 'An error occurred'}</p>}

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        {lang === 'ar' ? '* كمنشئ المشروع، يمكنك فقط رؤية هذه الخاصية.' : '* As the project creator, only you can see this feature.'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'matchmaker' ? (
          <motion.div key="matchmaker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="overflow-x-auto">
            <HackathonMatchmaker />
          </motion.div>
        ) : activeTab === 'ledger' ? (
          <motion.div key="ledger" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="overflow-x-auto">
            <DebuggingLedger />
          </motion.div>
        ) : activeTab === 'events' ? (
          <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5">
            <div className="glass-card p-4 sm:p-6 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Calendar className="text-rose-400 shrink-0" />
                <span>{lang === 'ar' ? 'الأحداث المتاحة' : 'Available Events'}</span>
              </h3>

              {upcomingEvents.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
                  <Calendar size={40} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'لا توجد أحداث قادمة مسجلة حالياً.' : 'No upcoming events registered currently.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {upcomingEvents.map(evt => (
                    <div key={evt.id} className="bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-rose-500/50 transition-colors group">
                      <div className="w-11 h-11 bg-rose-500/15 text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center mb-3">
                        <Calendar size={22} />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 break-words">{lang === 'ar' ? evt.titleAr || evt.title : evt.titleEn || evt.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">{evt.startDate} • {evt.type}</p>
                      <button
                        type="button"
                        className="w-full min-h-[44px] py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-rose-600 hover:text-white text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-colors"
                      >
                        {lang === 'ar' ? 'التفاصيل والتسجيل' : 'Details & Registration'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'certificates' ? (
          <motion.div key="certificates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5">
            <div className="glass-card p-4 sm:p-6 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Award className="text-yellow-500 shrink-0" />
                <span>{lang === 'ar' ? 'الشهادات' : 'Certificates'}</span>
              </h3>

              <div className="bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
                <Award size={44} className="mx-auto mb-3 text-slate-400" />
                <h2 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-2">{lang === 'ar' ? 'لا توجد شهادات بعد' : 'No Certificates Yet'}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'سيتم إضافة شهاداتك هنا بمجرد إكمال ورش العمل أو الهاكاثون.'
                    : 'Your certificates will appear here once you complete workshops or hackathons.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="overview-fallback" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="overflow-hidden rounded-2xl">
            <InspirationCard lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
