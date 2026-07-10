import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
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

        // Fetch upcoming events
        const eventsQ = query(collection(db, 'events'));
        const eventsSnap = await getDocs(eventsQ);
        const eventsData = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(e => new Date(e.startDate) >= new Date())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);
        setUpcomingEvents(eventsData);

        // Fetch user's projects (created by them or where they are a member)
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
      // 1. Find user by email or membershipId
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

      // 2. Add to project teamMembers array
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        teamMembers: arrayUnion(foundUser)
      });
      
      // Update local state
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

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'projects', icon: Code, label: lang === 'ar' ? 'مشاريعي' : 'My Projects' },
          { id: 'matchmaker', icon: Users, label: lang === 'ar' ? 'فريق الهاكاثون' : 'Matchmaker' },
          { id: 'ledger', icon: BookOpen, label: lang === 'ar' ? 'دفتر الأخطاء' : 'Bug Ledger' },
          { id: 'events', icon: Calendar, label: lang === 'ar' ? 'الأحداث' : 'Events' },
          { id: 'certificates', icon: Award, label: lang === 'ar' ? 'الشهادات' : 'Certificates' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-orbitron">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <UserProfileSettings currentUser={currentUser} />
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            
            <InspirationCard lang={lang} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-t-2 border-rose-500 hover-lift">
                <Code size={32} className="text-rose-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'المشاريع' : 'Projects Contributed'}</h4>
                <p className="text-3xl font-bold text-white mt-2">12</p>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-t-2 border-emerald-500 hover-lift">
                <Zap size={32} className="text-emerald-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'النقاط' : 'Activity Points'}</h4>
                <p className="text-3xl font-bold text-white mt-2">1,450</p>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-t-2 border-blue-500 hover-lift">
                <Heart size={32} className="text-blue-400 mb-4" />
                <h4 className="text-gray-400">{lang === 'ar' ? 'العمل التطوعي' : 'Volunteer Hours'}</h4>
                <p className="text-3xl font-bold text-white mt-2">48h</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-rose-400" />
                  {lang === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events'}
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500 text-sm">{lang === 'ar' ? 'لا توجد أحداث قادمة قريباً' : 'No upcoming events soon'}</p>
                  ) : upcomingEvents.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{lang === 'ar' ? evt.titleAr || evt.title : evt.titleEn || evt.title}</h4>
                        <p className="text-sm text-rose-400">{evt.startDate}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">{evt.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <Award size={48} className="text-yellow-400 mb-4" />
                <h3 className="text-xl font-orbitron text-white mb-2">{lang === 'ar' ? 'احصل على شهاداتك' : 'Claim Your Certificates'}</h3>
                <p className="text-gray-400 mb-6">
                  {lang === 'ar' ? 'لديك شهادات جديدة متاحة للتحميل من ورشة العمل الأخيرة.' : 'You have new certificates available for download from the recent workshop.'}
                </p>
                <button className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-medium">
                  {lang === 'ar' ? 'عرض الشهادات' : 'View Certificates'}
                </button>
              </div>
            </div>

          </motion.div>
        ) : activeTab === 'projects' ? (
          <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                <Code className="text-cyan-400" />
                {lang === 'ar' ? 'مشاريعي وفرق العمل' : 'My Projects & Teams'}
              </h3>

              {myProjects.length === 0 ? (
                <div className="bg-white/5 dark:bg-slate-900/40 p-8 rounded-2xl border border-white/10 text-center">
                  <p className="text-gray-400 mb-4">{lang === 'ar' ? 'ليس لديك أي مشاريع حالياً.' : 'You don\'t have any projects yet.'}</p>
                </div>
              ) : myProjects.map(proj => (
                <div key={proj.id} className="bg-white/5 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/10 dark:border-slate-800 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-white">{proj.title}</h4>
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block">{proj.category || 'Active Project'}</span>
                    </div>
                    {proj.creatorId === currentUser?.uid && (
                      <div className="text-right">
                        <p className="text-sm text-rose-400 font-bold flex items-center gap-1"><Zap size={14}/> {lang === 'ar' ? 'أنت منشئ هذا المشروع' : 'You are the Creator'}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 mb-6 text-sm text-gray-400">
                    <span><Users size={14} className="inline mr-1"/> {proj.teamMembers ? proj.teamMembers.length : 0} {lang === 'ar' ? 'أعضاء' : 'Members'}</span>
                    {proj.teamMembers && proj.teamMembers.map((m, i) => (
                       <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">{m.name}</span>
                    ))}
                  </div>

                  {/* PROJECT CREATOR EXCLUSIVE UI */}
                  {proj.creatorId === currentUser?.uid && (
                    <div className="border-t border-white/10 pt-6">
                      <h5 className="font-bold text-gray-300 mb-3 flex items-center gap-2"><UserPlus size={18} className="text-rose-400"/> {lang === 'ar' ? 'إضافة عضو للفريق' : 'Add Member to Team'}</h5>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                          <input 
                            type="text" 
                            value={searchMemberQuery}
                            onChange={(e) => setSearchMemberQuery(e.target.value)}
                            placeholder={lang === 'ar' ? 'البريد الإلكتروني أو رقم العضوية...' : 'Email or Membership ID...'}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <button 
                          onClick={() => handleAddMemberToProject(proj.id)}
                          disabled={addMemberStatus?.id === proj.id && addMemberStatus.status === 'loading'}
                          className="bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50"
                        >
                          {addMemberStatus?.id === proj.id && addMemberStatus.status === 'loading' ? '...' : (lang === 'ar' ? 'إضافة العضو' : 'Add Member')}
                        </button>
                      </div>
                      
                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'success' && <p className="text-xs text-emerald-400 mt-2">{lang === 'ar' ? 'تمت إضافة العضو بنجاح' : 'Member added successfully'}</p>}
                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'not_found' && <p className="text-xs text-red-400 mt-2">{lang === 'ar' ? 'لم يتم العثور على العضو' : 'Member not found'}</p>}
                      {addMemberStatus?.id === proj.id && addMemberStatus.status === 'error' && <p className="text-xs text-red-400 mt-2">{lang === 'ar' ? 'حدث خطأ' : 'An error occurred'}</p>}
                      
                      <p className="text-xs text-gray-500 mt-3">
                        {lang === 'ar' ? '* كمنشئ المشروع، يمكنك فقط رؤية هذه الخاصية.' : '* As the project creator, only you can see this feature.'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'matchmaker' ? (
          <motion.div key="matchmaker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <HackathonMatchmaker />
          </motion.div>
        ) : activeTab === 'ledger' ? (
          <motion.div key="ledger" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DebuggingLedger />
          </motion.div>
        ) : activeTab === 'events' ? (
          <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                <Calendar className="text-rose-400" />
                {lang === 'ar' ? 'الأحداث المتاحة' : 'Available Events'}
              </h3>
              
              {upcomingEvents.length === 0 ? (
                <div className="bg-white/5 dark:bg-slate-900/40 p-12 rounded-2xl border border-white/10 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">{lang === 'ar' ? 'لا توجد أحداث قادمة مسجلة حالياً.' : 'No upcoming events registered currently.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(evt => (
                    <div key={evt.id} className="bg-white/5 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/10 hover:border-rose-500/50 transition-colors group">
                      <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{lang === 'ar' ? evt.titleAr || evt.title : evt.titleEn || evt.title}</h4>
                      <p className="text-sm text-gray-400 mb-4">{evt.startDate} • {evt.type}</p>
                      <button className="w-full py-2 bg-white/10 hover:bg-rose-500 hover:text-white text-gray-300 rounded-xl text-sm font-medium transition-colors">
                        {lang === 'ar' ? 'التفاصيل والتسجيل' : 'Details & Registration'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'certificates' ? (
          <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                <Award className="text-yellow-400" />
                {lang === 'ar' ? 'الشهادات' : 'Certificates'}
              </h3>
              
              <div className="bg-white/5 dark:bg-slate-900/40 p-12 rounded-2xl border border-white/10 text-center">
                <Award size={48} className="mx-auto mb-4 text-gray-600" />
                <h2 className="text-xl font-orbitron text-white mb-2">{lang === 'ar' ? 'لا توجد شهادات بعد' : 'No Certificates Yet'}</h2>
                <p className="text-gray-400">
                  {lang === 'ar' 
                    ? 'سيتم إضافة شهاداتك هنا بمجرد إكمال ورش العمل أو الهاكاثون.' 
                    : 'Your certificates will appear here once you complete workshops or hackathons.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="wip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <LayoutDashboard size={48} className="mx-auto mb-4 text-rose-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">{lang === 'ar' ? 'قريباً' : 'Coming Soon'}</h2>
            <p className="text-gray-400">{lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
