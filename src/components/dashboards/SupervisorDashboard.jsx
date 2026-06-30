import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users, ClipboardList, Bell, Settings, ShieldCheck, AlertTriangle,
  CheckCircle, XCircle, Clock, UserPlus, FileText, Briefcase,
  TrendingUp, Calendar, Activity, CircleDot, ChevronRight,
  Folder, Award, MessageSquare, Zap, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function SupervisorDashboard() {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('team');

  const supervisorName = currentUser?.name || (lang === 'ar' ? 'المشرف حمزة' : 'Supervisor Hamza');
  const supervisorEmail = currentUser?.email || 'hamza@gitm.ma';

  const [teamMembers] = useState([
    { id: 1, name: 'Aymane Benali', nameAr: 'أيمن بنعلي', role: 'developer', roleAr: 'مطور', status: 'online', lastActive: '2026-06-27', avatar: 'A', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Sara Khan', nameAr: 'سارة خان', role: 'designer', roleAr: 'مصممة', status: 'online', lastActive: '2026-06-27', avatar: 'S', color: 'from-pink-500 to-rose-500' },
    { id: 3, name: 'Omar Tazi', nameAr: 'عمر التازي', role: 'developer', roleAr: 'مطور', status: 'offline', lastActive: '2026-06-26', avatar: 'O', color: 'from-emerald-500 to-teal-500' },
    { id: 4, name: 'Fatima Zahra', nameAr: 'فاطمة الزهراء', role: 'content_manager', roleAr: 'مديرة محتوى', status: 'online', lastActive: '2026-06-27', avatar: 'F', color: 'from-purple-500 to-indigo-500' },
    { id: 5, name: 'Youssef Alami', nameAr: 'يوسف العلمي', role: 'researcher', roleAr: 'باحث', status: 'offline', lastActive: '2026-06-25', avatar: 'Y', color: 'from-amber-500 to-orange-500' },
    { id: 6, name: 'Khadija Brahim', nameAr: 'خديجة إبراهيم', role: 'teacher', roleAr: 'معلمة', status: 'online', lastActive: '2026-06-27', avatar: 'K', color: 'from-indigo-500 to-blue-500' },
    { id: 7, name: 'Ahmed Ali', nameAr: 'أحمد علي', role: 'student', roleAr: 'طالب', status: 'offline', lastActive: '2026-06-24', avatar: 'AH', color: 'from-teal-500 to-emerald-500' },
    { id: 8, name: 'Amine Benjelloun', nameAr: 'أمين بنجلون', role: 'teacher', roleAr: 'معلم', status: 'online', lastActive: '2026-06-27', avatar: 'AM', color: 'from-rose-500 to-red-500' },
  ]);

  const [progressReports] = useState([
    { id: 1, project: 'Edge AI YOLOv8 Integration', projectAr: 'دمج YOLOv8 للذكاء الاصطناعي', progress: 78, deadline: '2026-07-15', status: 'on-track', lead: 'Aymane Benali', tasks: 24, completedTasks: 19, color: 'from-blue-500 to-cyan-500' },
    { id: 2, project: 'Smart Drone Controller', projectAr: 'وحدة تحكم الطائرة الذكية', progress: 45, deadline: '2026-08-01', status: 'at-risk', lead: 'Omar Tazi', tasks: 18, completedTasks: 8, color: 'from-amber-500 to-orange-500' },
    { id: 3, project: 'GITM Website Redesign', projectAr: 'إعادة تصميم موقع GITM', progress: 92, deadline: '2026-06-30', status: 'on-track', lead: 'Sara Khan', tasks: 30, completedTasks: 28, color: 'from-emerald-500 to-teal-500' },
    { id: 4, project: 'IoT Cloud Platform v2', projectAr: 'منصة إنترنت الأشياء v2', progress: 15, deadline: '2026-09-15', status: 'delayed', lead: 'Amine Benjelloun', tasks: 42, completedTasks: 6, color: 'from-purple-500 to-indigo-500' },
  ]);

  const [approvalRequests, setApprovalRequests] = useState([
    { id: 1, type: 'member', typeAr: 'عضو جديد', title: 'New Member Request: Hamid El Ouardi', titleAr: 'طلب عضوية جديد: حميد الوردي', description: 'Computer Science student at ENSAM requesting to join as developer.', descriptionAr: 'طالب علوم حاسوب في ENSAM يطلب الانضمام كمطور.', submittedDate: '2026-06-26', priority: 'medium', icon: UserPlus },
    { id: 2, type: 'project', typeAr: 'اقتراح مشروع', title: 'Project Proposal: Autonomous Robot Arm v2', titleAr: 'اقتراح مشروع: ذراع الروبوت المستقل v2', description: 'Fatima proposes Phase 2 of the robot arm with 6-DOF motion.', descriptionAr: 'تقترح فاطمة المرحلة الثانية من ذراع الروبوت بحركة 6 محاور.', submittedDate: '2026-06-25', priority: 'high', icon: Folder },
    { id: 3, type: 'content', typeAr: 'طلب نشر', title: 'Content Publish: Partnership Press Release', titleAr: 'طلب نشر: بيان صحفي عن الشراكة', description: 'Media Team requests approval to publish the Microsoft partnership announcement.', descriptionAr: 'يطلب فريق الإعلام الموافقة على نشر إعلان الشراكة مع مايكروسوفت.', submittedDate: '2026-06-24', priority: 'high', icon: FileText },
    { id: 4, type: 'member', typeAr: 'عضو جديد', title: 'New Member Request: Layla Mansouri', titleAr: 'طلب عضوية جديد: ليلى المنصوري', description: 'UI/UX Designer from EMI, specializing in mobile app design.', descriptionAr: 'مصممة واجهة مستخدم من EMI، متخصصة في تصميم تطبيقات الهاتف.', submittedDate: '2026-06-23', priority: 'low', icon: UserPlus },
  ]);

  const [notifications] = useState([
    { id: 1, type: 'success', icon: UserPlus, message: 'Ahmed Ali joined as a new student member.', messageAr: 'أحمد علي انضم كعضو طالب جديد.', time: '2 hours ago', timeAr: 'قبل ساعتين', date: '2026-06-27' },
    { id: 2, type: 'success', icon: CheckCircle, message: 'GITM Website Redesign: All milestones completed ahead of schedule.', messageAr: 'إعادة تصميم الموقع: تم إكمال جميع المراحل قبل الموعد.', time: '5 hours ago', timeAr: 'قبل 5 ساعات', date: '2026-06-27' },
    { id: 3, type: 'warning', icon: AlertTriangle, message: 'Smart Drone Controller project is at risk of missing its deadline.', messageAr: 'مشروع وحدة تحكم الطائرة في خطر تجاوز الموعد النهائي.', time: '1 day ago', timeAr: 'قبل يوم', date: '2026-06-26' },
    { id: 4, type: 'info', icon: Award, message: 'Aymane Benali earned the "AI Expert" badge for completing Edge AI certification.', messageAr: 'أيمن بنعلي حصل على شارة "خبير ذكاء اصطناعي" بعد إكمال شهادة Edge AI.', time: '2 days ago', timeAr: 'قبل يومين', date: '2026-06-25' },
    { id: 5, type: 'info', icon: MessageSquare, message: 'New comment on IoT Cloud Platform v2 design review from Dr. Amine.', messageAr: 'تعليق جديد على مراجعة تصميم منصة IoT v2 من د. أمين.', time: '2 days ago', timeAr: 'قبل يومين', date: '2026-06-25' },
    { id: 6, type: 'success', icon: Briefcase, message: 'Microsoft Morocco partnership agreement has been finalized and signed.', messageAr: 'تم إنهاء وتوقيع اتفاقية الشراكة مع مايكروسوفت المغرب.', time: '3 days ago', timeAr: 'قبل 3 أيام', date: '2026-06-24' },
    { id: 7, type: 'warning', icon: Clock, message: 'Reminder: Monthly team review meeting scheduled for June 28th.', messageAr: 'تذكير: اجتماع مراجعة الفريق الشهري مجدول ليوم 28 يونيو.', time: '3 days ago', timeAr: 'قبل 3 أيام', date: '2026-06-24' },
    { id: 8, type: 'info', icon: Zap, message: 'System update: Dashboard performance improvements deployed.', messageAr: 'تحديث النظام: تم نشر تحسينات أداء لوحة التحكم.', time: '4 days ago', timeAr: 'قبل 4 أيام', date: '2026-06-23' },
  ]);

  const handleApprove = (id) => {
    setApprovalRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleReject = (id) => {
    setApprovalRequests(prev => prev.filter(r => r.id !== id));
  };

  const statusConfig = {
    'on-track': { label: lang === 'ar' ? 'على المسار' : 'On Track', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    'at-risk': { label: lang === 'ar' ? 'في خطر' : 'At Risk', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    'delayed': { label: lang === 'ar' ? 'متأخر' : 'Delayed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };

  const notifColors = {
    success: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10',
    warning: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10',
    info: 'border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10',
  };

  const notifIconColors = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };

  const tabs = [
    { id: 'team', icon: Users, label: lang === 'ar' ? 'نظرة عامة على الفريق' : 'Team Overview' },
    { id: 'reports', icon: TrendingUp, label: lang === 'ar' ? 'تقارير التقدم' : 'Progress Reports' },
    { id: 'approvals', icon: ShieldCheck, label: lang === 'ar' ? 'طلبات الموافقة' : 'Approvals' },
    { id: 'notifications', icon: Bell, label: lang === 'ar' ? 'الإشعارات' : 'Notifications' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
  };

  return (
    <div className={`flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-indigo-200 dark:border-indigo-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة المشرف' : 'Supervisor Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{supervisorName}</p>
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
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                  {tab.id === 'approvals' && approvalRequests.length > 0 && (
                    <span className="ml-auto bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{approvalRequests.length}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">

            {/* ═══════════════ TEAM OVERVIEW TAB ═══════════════ */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Users className="text-indigo-500"/> {lang === 'ar' ? 'نظرة عامة على الفريق' : 'Team Overview'}
                  </h3>
                  <div className="flex gap-3">
                    <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                      <CircleDot size={10}/> {teamMembers.filter(m => m.status === 'online').length} {lang === 'ar' ? 'متصل' : 'Online'}
                    </span>
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
                      {teamMembers.length} {lang === 'ar' ? 'أعضاء' : 'Members'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member, i) => (
                    <motion.div key={member.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                            member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? member.nameAr : member.name}</h4>
                          <p className="text-xs text-slate-500 capitalize">{lang === 'ar' ? member.roleAr : member.role}</p>
                        </div>
                        <div className={`text-right ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            member.status === 'online'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {member.status === 'online' ? (lang === 'ar' ? 'متصل' : 'Online') : (lang === 'ar' ? 'غير متصل' : 'Offline')}
                          </span>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1 justify-end">
                            <Clock size={10}/> {member.lastActive}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════ PROGRESS REPORTS TAB ═══════════════ */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-500"/> {lang === 'ar' ? 'تقارير تقدم المشاريع' : 'Project Progress Reports'}
                </h3>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: lang === 'ar' ? 'المشاريع النشطة' : 'Active Projects', value: progressReports.length, icon: Folder, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'على المسار' : 'On Track', value: progressReports.filter(p => p.status === 'on-track').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'في خطر' : 'At Risk', value: progressReports.filter(p => p.status === 'at-risk').length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: lang === 'ar' ? 'متأخرة' : 'Delayed', value: progressReports.filter(p => p.status === 'delayed').length, icon: Clock, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                  ].map((stat, i) => (
                    <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className={`glass-card rounded-2xl p-4 text-center ${stat.bg}`}
                    >
                      <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={22}/>
                      <p className="text-2xl font-bold text-[#1e3a5f] dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {progressReports.map((project, i) => (
                    <motion.div key={project.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1.5 h-full bg-gradient-to-b ${project.color}`} />

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{lang === 'ar' ? project.projectAr : project.project}</h4>
                          <p className="text-xs text-slate-500 mt-1">{lang === 'ar' ? 'المسؤول: ' : 'Lead: '}{project.lead}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[project.status].color}`}>
                          {statusConfig[project.status].label}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                          <span>{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                            className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{lang === 'ar' ? 'الموعد النهائي' : 'Deadline'}</p>
                          <p className="text-sm font-bold text-[#1e3a5f] dark:text-white flex items-center justify-center gap-1">
                            <Calendar size={12}/> {project.deadline}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{lang === 'ar' ? 'المهام' : 'Tasks'}</p>
                          <p className="text-sm font-bold text-[#1e3a5f] dark:text-white flex items-center justify-center gap-1">
                            <Target size={12}/> {project.completedTasks}/{project.tasks}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════ APPROVALS TAB ═══════════════ */}
            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-indigo-500"/> {lang === 'ar' ? 'طلبات الموافقة المعلقة' : 'Pending Approvals'}
                  </h3>
                  <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold">
                    {approvalRequests.length} {lang === 'ar' ? 'بانتظار' : 'Pending'}
                  </span>
                </div>

                {approvalRequests.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-card rounded-2xl p-12 text-center"
                  >
                    <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48}/>
                    <h4 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">{lang === 'ar' ? 'لا توجد طلبات معلقة!' : 'No Pending Requests!'}</h4>
                    <p className="text-sm text-slate-500">{lang === 'ar' ? 'تمت معالجة جميع الطلبات.' : 'All approval requests have been processed.'}</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {approvalRequests.map((req, i) => {
                      const ReqIcon = req.icon;
                      return (
                        <motion.div key={req.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                          className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                                  req.type === 'member' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                  : req.type === 'project' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}>
                                  {lang === 'ar' ? req.typeAr : req.type}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                                  req.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  : req.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                }`}>{req.priority}</span>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mt-0.5">
                                  <ReqIcon size={20} className="text-indigo-500"/>
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? req.titleAr : req.title}</h4>
                                  <p className="text-sm text-slate-500 mt-1">{lang === 'ar' ? req.descriptionAr : req.description}</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-1"><Clock size={11}/> {req.submittedDate}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex md:flex-col gap-2 md:justify-center">
                              <button onClick={() => handleApprove(req.id)}
                                className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-105"
                              >
                                <CheckCircle size={16}/> {lang === 'ar' ? 'موافقة' : 'Approve'}
                              </button>
                              <button onClick={() => handleReject(req.id)}
                                className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-800 text-red-500 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <XCircle size={16}/> {lang === 'ar' ? 'رفض' : 'Reject'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ NOTIFICATIONS TAB ═══════════════ */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <Bell className="text-amber-500"/> {lang === 'ar' ? 'الإشعارات والتحديثات' : 'Notifications & Updates'}
                </h3>

                <div className="space-y-3">
                  {notifications.map((notif, i) => {
                    const NotifIcon = notif.icon;
                    return (
                      <motion.div key={notif.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                        className={`p-4 border rounded-xl ${notifColors[notif.type]} transition-all hover:shadow-sm`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : notif.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <NotifIcon size={18} className={notifIconColors[notif.type]}/>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#1e3a5f] dark:text-white">
                              {lang === 'ar' ? notif.messageAr : notif.message}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={10}/> {lang === 'ar' ? notif.timeAr : notif.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════════════ PROFILE TAB ═══════════════ */}
            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{
                name: supervisorName,
                role: 'supervisor',
                email: supervisorEmail,
                badges: currentUser?.badges || ['lab_manager', 'admin'],
                membershipId: currentUser?.membershipId || 'GITM-SUP-001'
              }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}