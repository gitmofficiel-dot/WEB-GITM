import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, BookOpen, Building, Newspaper, Activity, Shield, Award, Edit, Trash2, Bot, TrendingUp, AlertTriangle, Plus, Mail, Video, Megaphone, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PresidentDashboard() {
  const { lang, t, user, eventRegistrations, setEventRegistrations } = useLanguage();
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

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold gradient-text">{lang === 'ar' ? 'لوحة تحكم الرئيس' : 'President Dashboard'}</h2>
          <p className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'نظرة عامة على إدارة المؤسسة' : 'Organization Management Overview'}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary rounded-xl px-4 py-2 flex items-center gap-2"><Plus size={18}/> {lang === 'ar' ? 'إضافة عضو' : 'Add Member'}</button>
          <button className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700 text-[#1e3a5f] dark:text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-colors"><Mail size={18}/> {lang === 'ar' ? 'مراسلة الجميع' : 'Email All'}</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={lang === 'ar' ? 'إجمالي الأعضاء' : 'Total Members'} value="1,250" icon={Users} color="blue" trend="+12%" />
        <StatCard title={lang === 'ar' ? 'المشاريع النشطة' : 'Active Projects'} value="45" icon={Activity} color="emerald" trend="+5%" />
        <StatCard title={lang === 'ar' ? 'الدورات التدريبية' : 'Courses'} value="120" icon={BookOpen} color="purple" trend="+18%" />
        <StatCard title={lang === 'ar' ? 'الشركاء الاستراتيجيين' : 'Strategic Partners'} value="32" icon={Building} color="orange" trend="+2%" />
      </div>

      {/* AI Predictive Analytics */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-8 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)] relative overflow-hidden bg-gradient-to-br from-white to-pink-50 dark:from-slate-900 dark:to-pink-950/20">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Bot size={150} />
        </div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg shadow-pink-500/30 text-white">
            <Bot size={24} />
          </div>
          <h3 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400">
            {lang === 'ar' ? 'التحليلات التنبؤية (الذكاء الاصطناعي)' : 'AI Predictive Analytics'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 dark:border-pink-900/50 hover:shadow-lg transition-all hover:-translate-y-1">
            <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3 flex items-center gap-2 text-lg">
              <TrendingUp size={20} className="text-emerald-500" /> {lang === 'ar' ? 'توقعات النمو (الربع الثالث)' : 'Growth Prediction (Q3)'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on current enrollment rates in the Academy, expect a <strong className="text-emerald-500 dark:text-emerald-400 px-1 bg-emerald-100 dark:bg-emerald-900/30 rounded">24% increase</strong> in active members next quarter. Consider opening 2 new Edge AI remote classes.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 dark:border-pink-900/50 hover:shadow-lg transition-all hover:-translate-y-1">
            <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3 flex items-center gap-2 text-lg">
              <AlertTriangle size={20} className="text-amber-500" /> {lang === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Project <strong className="text-amber-600 dark:text-amber-400 px-1 bg-amber-100 dark:bg-amber-900/30 rounded">"Smart Farm Drone"</strong> shows a 60% probability of missing its deadline due to recent low commit activity. Intervention recommended.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Member Management Table */}
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                <Shield className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة الأعضاء والصلاحيات' : 'Member & Roles Management'}
              </h3>
              <button className="text-sm text-cyan-600 font-bold hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</button>
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
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
                            {m.avatar}
                          </div>
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
                          <option>teacher</option>
                          <option>student</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {m.badges.map(b => <span key={b} className={`badge badge-${b} text-[10px]`}>{b}</span>)}
                          <button className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors" title="Add Badge"><Plus size={12}/></button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><Edit size={16}/></button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Event Registrations Review */}
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <Award className="text-amber-500" size={24}/> {lang === 'ar' ? 'مراجعة طلبات الفعاليات' : 'Event Registrations Review'}
            </h3>
            {(!eventRegistrations || eventRegistrations.length === 0) ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">{lang === 'ar' ? 'لا توجد طلبات معلقة حالياً' : 'All caught up! No pending registrations.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventRegistrations.map(reg => (
                  <div key={reg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-black tracking-wider ${reg.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : reg.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {reg.status}
                        </span>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{reg.eventTitle}</h4>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Applicant: {reg.userName}</p>
                      <p className="text-xs text-slate-500 mt-1">Project: {reg.projectName || 'N/A'} {reg.hasFile && <span className="inline-flex items-center gap-1 text-emerald-600 ml-2 bg-emerald-50 px-1.5 py-0.5 rounded"><Bot size={10}/> File Attached</span>}</p>
                    </div>
                    <div className="flex gap-2">
                      {reg.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateRegStatus(reg.id, 'approved')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-emerald-500/30 flex items-center gap-1"><CheckCircle size={16}/> Approve</button>
                          <button onClick={() => handleUpdateRegStatus(reg.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 font-bold rounded-xl text-sm transition-all flex items-center gap-1"><XCircle size={16}/> Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-slate-900 hover:bg-cyan-100 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-semibold transition-colors border border-transparent hover:border-cyan-200 dark:hover:border-slate-700">
                <Megaphone size={18} /> {lang === 'ar' ? 'نشر إعلان جديد' : 'Publish Announcement'}
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-400 font-semibold transition-colors border border-transparent hover:border-purple-200 dark:hover:border-slate-700">
                <Video size={18} /> {lang === 'ar' ? 'جدولة اجتماع مجلس' : 'Schedule Board Meeting'}
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-slate-700">
                <BookOpen size={18} /> {lang === 'ar' ? 'اعتماد دورة جديدة' : 'Approve New Course'}
              </button>
            </div>
          </div>

          {/* News Management */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white"><Newspaper className="text-blue-500" size={20} /> {lang === 'ar' ? 'إدارة الأخبار' : 'News Management'}</h3>
            <div className="space-y-4">
              {news.map(n => (
                <div key={n.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-slate-900/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-[#1e3a5f] dark:text-white line-clamp-2">{n.title}</h4>
                    <button className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1">{n.date}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${n.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{n.status}</span>
                  </div>
                </div>
              ))}
              <button className="btn-primary w-full rounded-xl py-2 flex items-center justify-center gap-2 text-sm"><Plus size={16}/> {lang === 'ar' ? 'إضافة خبر' : 'Add News Item'}</button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white"><Activity className="text-emerald-500" size={20} /> {lang === 'ar' ? 'سجل النشاطات' : 'Activity Log'}</h3>
            <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-white dark:ring-slate-950"></div>
                <p className="text-sm font-semibold text-[#1e3a5f] dark:text-white">New Partner Onboarded</p>
                <p className="text-xs text-slate-500">TechCorp joined the alliance • 10:00 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white dark:ring-slate-950"></div>
                <p className="text-sm font-semibold text-[#1e3a5f] dark:text-white">Course "React Adv" Published</p>
                <p className="text-xs text-slate-500">By Sara Khan • Yesterday</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-amber-500 rounded-full ring-4 ring-white dark:ring-slate-950"></div>
                <p className="text-sm font-semibold text-[#1e3a5f] dark:text-white">System Backup Completed</p>
                <p className="text-xs text-slate-500">Automated • 2 days ago</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}