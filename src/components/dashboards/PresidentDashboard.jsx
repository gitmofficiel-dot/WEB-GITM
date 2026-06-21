import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, BookOpen, Building, Newspaper, Activity, Shield, Award, 
  Edit, Trash2, Bot, TrendingUp, AlertTriangle, Plus, Mail, Video, 
  Megaphone, CheckCircle, XCircle, LayoutDashboard, Settings, BrainCircuit,
  GraduationCap, Calendar, Database, Eye, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PresidentDashboard() {
  const { lang, t, user, eventRegistrations, setEventRegistrations } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const [members, setMembers] = useState([
    { id: 1, name: 'Ahmed Ali', email: 'ahmed@gitm.ma', role: 'member', badges: ['speaker', 'developer'], avatar: 'AA' },
    { id: 2, name: 'Sara Khan', email: 'sara@gitm.ma', role: 'teacher', badges: ['writer', 'designer'], avatar: 'SK' },
    { id: 3, name: 'Youssef Ben', email: 'youssef@gitm.ma', role: 'student', badges: ['political'], avatar: 'YB' },
    { id: 4, name: 'Mona Rami', email: 'mona@gitm.ma', role: 'admin', badges: ['legal', 'speaker'], avatar: 'MR' }
  ]);

  const [news, setNews] = useState([
    { id: 1, title: 'Annual Summit 2026', date: '2026-07-01', status: 'Published' },
    { id: 2, title: 'New AI Lab Opening', date: '2026-06-25', status: 'Draft' }
  ]);

  const [courses, setCourses] = useState([
    { id: 1, title: 'Edge AI Development', instructor: 'Sara Khan', enrolled: 124, status: 'Active' },
    { id: 2, title: 'Quantum Computing Intro', instructor: 'Dr. Yassine', enrolled: 89, status: 'Active' },
    { id: 3, title: 'Advanced Robotics', instructor: 'Ahmed Ali', enrolled: 45, status: 'Upcoming' }
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'GITM Hackathon 2026', date: '2026-08-15', attendees: 350, status: 'Planning' },
    { id: 2, title: 'AI Ethics Conference', date: '2026-09-10', attendees: 120, status: 'Confirmed' }
  ]);

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
    { id: 'members', icon: Shield, label: lang === 'ar' ? 'إدارة الأعضاء' : 'Members' },
    { id: 'academy', icon: GraduationCap, label: lang === 'ar' ? 'الأكاديمية والتداريب' : 'Academy & Training' },
    { id: 'events', icon: Calendar, label: lang === 'ar' ? 'الفعاليات والمشاريع' : 'Events & Projects' },
    { id: 'news', icon: Newspaper, label: lang === 'ar' ? 'إدارة الأخبار' : 'News & Media' },
    { id: 'gallery', icon: Image, label: lang === 'ar' ? 'المعرض والصور' : 'Gallery & Media' },
    { id: 'ai', icon: BrainCircuit, label: lang === 'ar' ? 'إدارة الذكاء الاصطناعي' : 'AI Management' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-cyan-200 dark:border-slate-800">
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
                    : 'text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400'
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
                  <StatCard title={lang === 'ar' ? 'إجمالي الأعضاء' : 'Total Members'} value="1,250" icon={Users} color="blue" trend="+12%" />
                  <StatCard title={lang === 'ar' ? 'المشاريع النشطة' : 'Active Projects'} value="45" icon={Activity} color="emerald" trend="+5%" />
                  <StatCard title={lang === 'ar' ? 'الدورات التدريبية' : 'Courses'} value="120" icon={BookOpen} color="purple" trend="+18%" />
                  <StatCard title={lang === 'ar' ? 'ميزانية الروبوتات' : 'Robotics Budget'} value="$45K" icon={Database} color="pink" trend="-2%" />
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
              </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Shield className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة الأعضاء والصلاحيات' : 'Member & Roles Management'}
                  </h3>
                  <div className="flex gap-2">
                    <button className="bg-cyan-100 text-cyan-700 dark:bg-slate-800 dark:text-cyan-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Mail size={16}/> {lang === 'ar' ? 'دعوة عضو' : 'Invite'}</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                        <th className="p-3 font-bold">User</th>
                        <th className="p-3 font-bold">Role</th>
                        <th className="p-3 font-bold">Badges</th>
                        <th className="p-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {members.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">{m.avatar}</div>
                              <div>
                                <p className="font-bold text-[#1e3a5f] dark:text-white">{m.name}</p>
                                <p className="text-xs text-slate-500">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <select className="bg-slate-100 dark:bg-slate-900 border border-transparent hover:border-cyan-300 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer">
                              <option>{m.role}</option>
                              <option>admin</option>
                              <option>president</option>
                              <option>teacher</option>
                              <option>student</option>
                              <option>content_manager</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1.5">
                              {m.badges.map(b => <span key={b} className={`badge badge-${b} text-[10px]`}>{b}</span>)}
                              <button className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors" title="Add Badge"><Plus size={12}/></button>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'دورة جديدة' : 'New Course'}</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map(course => (
                      <div key={course.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-900 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white">{course.title}</h4>
                          <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${course.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{course.status}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 flex items-center gap-2"><Users size={14}/> {course.enrolled} Students Enrolled</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Inst: {course.instructor}</span>
                          <button className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline">Manage Syllabus</button>
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
                      <Calendar className="text-amber-500" size={24}/> {lang === 'ar' ? 'إدارة الفعاليات والمشاريع' : 'Events & Projects Management'}
                    </h3>
                    <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'حدث جديد' : 'New Event'}</button>
                  </div>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{event.title}</h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14}/> {event.date} • <Users size={14}/> {event.attendees} Registered</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">{event.status}</span>
                          <button className="text-amber-600 dark:text-amber-400 font-bold text-sm hover:underline flex items-center gap-1"><Eye size={16}/> View Details</button>
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
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">No pending requests.</p>
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
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Newspaper className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة الأخبار والميديا' : 'News & Media Management'}
                  </h3>
                  <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'مقال جديد' : 'Write Article'}</button>
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
                          <button className="text-slate-400 hover:text-blue-500 p-2"><Edit size={16}/></button>
                          <button className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'رفع صور جديدة' : 'Upload Media'}</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4,5,6].map(img => (
                      <div key={img} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
                          <Image size={48} className="text-slate-400" />
                        </div>
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                          <button className="p-2 bg-white/10 hover:bg-blue-500 text-white rounded-lg transition-colors"><Edit size={16}/></button>
                          <button className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xs font-bold truncate">IMG_2026_{img}.jpg</p>
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
                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <p className="flex justify-between"><span>Model:</span> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">gemini-1.5-pro</span></p>
                        <p className="flex justify-between"><span>Actions/Day:</span> <span className="font-bold">1,450</span></p>
                      </div>
                      <button className="mt-4 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#1e3a5f] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Configure Rules</button>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Bot size={18} className="text-purple-500"/> Predictive Analytics AI</h4>
                          <p className="text-xs text-slate-500 mt-1">Generates weekly growth and risk reports.</p>
                        </div>
                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <p className="flex justify-between"><span>Model:</span> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">gemini-1.5-flash</span></p>
                        <p className="flex justify-between"><span>Confidence Threshold:</span> <span className="font-bold">85%</span></p>
                      </div>
                      <button className="mt-4 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#1e3a5f] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Adjust Parameters</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}