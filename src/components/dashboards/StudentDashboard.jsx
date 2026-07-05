import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen, FileText, CheckCircle, Clock, Award, Star, Settings, PlayCircle,
  Download, Share2, Eye, BarChart3, Target, TrendingUp, Zap, Brain,
  Calendar, Medal, GraduationCap, Flame, Copy, ExternalLink, Terminal, Printer, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import CodeSimulator from './CodeSimulator';
import InspirationCard from './InspirationCard';

export default function StudentDashboard() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [copiedLink, setCopiedLink] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const studentName = currentUser?.name || (lang === 'ar' ? 'أيمن بنعلي' : 'Aymane Benali');
  const studentEmail = currentUser?.email || 'a.benali@gitm.ma';

  const enrolledCourses = [
    { id: 1, title: 'Edge AI Development', titleAr: 'تطوير الذكاء الاصطناعي الحافي', progress: 65, nextLesson: 'Neural Networks Basics', nextLessonAr: 'أساسيات الشبكات العصبية', status: 'In Progress', color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'Python for Robotics', titleAr: 'بايثون للروبوتات', progress: 100, nextLesson: '-', nextLessonAr: '-', status: 'Completed', grade: 'A+', color: 'from-emerald-500 to-teal-500' },
    { id: 3, title: 'IoT Cloud Architecture', titleAr: 'بنية سحابة إنترنت الأشياء', progress: 15, nextLesson: 'AWS IoT Core Setup', nextLessonAr: 'إعداد AWS IoT Core', status: 'In Progress', color: 'from-purple-500 to-indigo-500' },
    { id: 4, title: 'Cybersecurity Fundamentals', titleAr: 'أساسيات الأمن السيبراني', progress: 42, nextLesson: 'Network Scanning', nextLessonAr: 'مسح الشبكات', status: 'In Progress', color: 'from-rose-500 to-pink-500' },
  ];

  const assignments = [
    { id: 1, course: 'Edge AI Development', courseAr: 'تطوير الذكاء الاصطناعي', title: 'Train CNN Model', titleAr: 'تدريب نموذج CNN', dueDate: '2026-06-25', status: 'Pending', priority: 'high' },
    { id: 2, course: 'Python for Robotics', courseAr: 'بايثون للروبوتات', title: 'Pathfinding Algorithm', titleAr: 'خوارزمية البحث عن المسار', dueDate: '2026-05-10', status: 'Graded (95/100)', priority: 'done' },
    { id: 3, course: 'IoT Cloud Architecture', courseAr: 'بنية سحابة إنترنت الأشياء', title: 'AWS Lambda Setup', titleAr: 'إعداد AWS Lambda', dueDate: '2026-07-01', status: 'Pending', priority: 'medium' },
    { id: 4, course: 'Cybersecurity Fundamentals', courseAr: 'أساسيات الأمن السيبراني', title: 'Vulnerability Assessment Report', titleAr: 'تقرير تقييم الثغرات', dueDate: '2026-06-28', status: 'In Progress', priority: 'high' },
  ];

  const certificates = [
    { id: 'CERT-GITM-2026-0042', course: 'Python for Robotics', courseAr: 'بايثون للروبوتات', issueDate: '2026-05-15', grade: 'A+', instructor: 'Dr. Amine', color: 'from-emerald-500 to-teal-500' },
    { id: 'CERT-GITM-2026-0089', course: 'Data Structures & Algorithms', courseAr: 'هياكل البيانات والخوارزميات', issueDate: '2026-03-20', grade: 'A', instructor: 'Dr. Fatima', color: 'from-blue-500 to-indigo-500' },
    { id: 'CERT-GITM-2025-0312', course: 'Introduction to AI', courseAr: 'مقدمة في الذكاء الاصطناعي', issueDate: '2025-12-10', grade: 'A+', instructor: 'Dr. Yassine', color: 'from-purple-500 to-violet-500' },
  ];

  const learningStats = {
    studyHoursThisWeek: 12,
    coursesCompleted: 2,
    quizAverage: 87,
    streak: 14,
    totalPoints: 2450,
    rank: 3,
    weeklyGoal: 15,
    weeklyData: [1.5, 2, 1, 2.5, 1.5, 2, 1.5],
  };

  const handleShareCert = (certId) => {
    const link = `https://gitm.ma/verify/${certId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(certId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const tabs = [
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'دوراتي' : 'My Courses' },
    { id: 'assignments', icon: FileText, label: lang === 'ar' ? 'الواجبات' : 'Assignments' },
    { id: 'lab', icon: Terminal, label: lang === 'ar' ? 'محاكي البرمجة' : 'Virtual Lab' },
    { id: 'certificates', icon: Award, label: lang === 'ar' ? 'الشهادات' : 'Certificates' },
    { id: 'stats', icon: BarChart3, label: lang === 'ar' ? 'إحصائيات التعلم' : 'Learning Stats' },
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
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-cyan-200 dark:border-slate-800 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'لوحة الطالب' : 'Student Panel'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{studentName}</p>
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
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
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

            {/* ═══════════════ COURSES TAB ═══════════════ */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <InspirationCard lang={lang} />
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <BookOpen className="text-blue-500"/> {lang === 'ar' ? 'التقدم الأكاديمي' : 'Academic Progress'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course, i) => (
                    <motion.div key={course.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-slate-200/50 dark:border-slate-800"
                    >
                      {course.status === 'Completed' && (
                        <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} p-4`}>
                          <CheckCircle className="text-emerald-500" size={32}/>
                        </div>
                      )}
                      <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-gradient-to-b ${course.color}`} />

                      <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-2 pr-10">
                        {lang === 'ar' ? course.titleAr : course.title}
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">
                        {course.status === 'Completed'
                          ? (lang === 'ar' ? 'مكتملة' : 'Completed')
                          : (lang === 'ar' ? 'الدرس القادم: ' : 'Next: ') + (lang === 'ar' ? course.nextLessonAr : course.nextLesson)}
                      </p>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${course.progress}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                          className={`h-2.5 rounded-full bg-gradient-to-r ${course.color}`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mb-4">
                        <span>{course.progress}%</span>
                        {course.grade && <span className="text-emerald-500">{lang === 'ar' ? 'الدرجة: ' : 'Grade: '}{course.grade}</span>}
                      </div>

                      <button
                        onClick={() => navigate('/academy')}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
                          course.progress === 100
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            : `bg-gradient-to-r ${course.color} text-white hover:shadow-lg`
                        }`}
                      >
                        <PlayCircle size={16}/>
                        {course.progress === 100
                          ? (lang === 'ar' ? 'مراجعة الدورة' : 'Review Course')
                          : (lang === 'ar' ? 'متابعة التعلم' : 'Continue Learning')}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════ ASSIGNMENTS TAB ═══════════════ */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <FileText className="text-amber-500"/> {lang === 'ar' ? 'الواجبات والمهام' : 'Assignments & Tasks'}
                </h3>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: lang === 'ar' ? 'بانتظار التسليم' : 'Pending', value: assignments.filter(a => a.status === 'Pending').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: lang === 'ar' ? 'قيد العمل' : 'In Progress', value: assignments.filter(a => a.status === 'In Progress').length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'تم التقييم' : 'Graded', value: assignments.filter(a => a.status.includes('Graded')).length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  ].map((stat, i) => (
                    <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className={`glass-card rounded-2xl p-4 text-center ${stat.bg}`}
                    >
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="space-y-4">
                    {assignments.map((task, i) => (
                      <motion.div key={task.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-12 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' : task.priority === 'done' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          <div>
                            <h4 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? task.titleAr : task.title}</h4>
                            <p className="text-sm text-slate-500">{lang === 'ar' ? task.courseAr : task.course}</p>
                          </div>
                        </div>
                        <div className={`flex flex-col items-end gap-1 ${lang === 'ar' ? 'items-start' : 'items-end'}`}>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                            task.status.includes('Graded') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>{task.status}</span>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {lang === 'ar' ? 'الموعد: ' : 'Due: '}{task.dueDate}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ CERTIFICATES TAB ═══════════════ */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Award className="text-amber-500"/> {lang === 'ar' ? 'شهاداتي' : 'My Certificates'}
                  </h3>
                  <span className="px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-bold">
                    {certificates.length} {lang === 'ar' ? 'شهادات' : 'Earned'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {certificates.map((cert, i) => (
                    <motion.div key={cert.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800"
                    >
                      {/* Certificate Header Gradient */}
                      <div className={`bg-gradient-to-r ${cert.color} p-5 relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Medal className="text-white/90" size={24}/>
                              <h4 className="font-bold text-lg text-white">{lang === 'ar' ? cert.courseAr : cert.course}</h4>
                            </div>
                            <p className="text-white/70 text-sm">{lang === 'ar' ? 'المدرب: ' : 'Instructor: '}{cert.instructor}</p>
                          </div>
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold">
                            {lang === 'ar' ? 'الدرجة: ' : 'Grade: '}{cert.grade}
                          </span>
                        </div>
                      </div>

                      {/* Certificate Details */}
                      <div className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'رقم الشهادة' : 'Certificate ID'}</p>
                            <p className="font-mono text-sm font-bold text-[#1e3a5f] dark:text-white">{cert.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                            <p className="text-sm font-bold text-[#1e3a5f] dark:text-white flex items-center gap-1"><Calendar size={12}/> {cert.issueDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'الحالة' : 'Status'}</p>
                            <p className="text-sm font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={12}/> {lang === 'ar' ? 'تم التحقق' : 'Verified'}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => setSelectedCert(cert)}
                            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-[#1e3a5f] dark:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Eye size={16}/> {lang === 'ar' ? 'عرض الشهادة' : 'View Certificate'}
                          </button>
                          <button
                            onClick={() => handleShareCert(cert.id)}
                            className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-[1.02]"
                          >
                            {copiedLink === cert.id ? (
                              <><CheckCircle size={16}/> {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</>
                            ) : (
                              <><Share2 size={16}/> {lang === 'ar' ? 'مشاركة الرابط' : 'Share Link'}</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════ LEARNING STATS TAB ═══════════════ */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <BarChart3 className="text-indigo-500"/> {lang === 'ar' ? 'إحصائيات التعلم' : 'Learning Statistics'}
                </h3>

                {/* Main KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: lang === 'ar' ? 'ساعات الدراسة هذا الأسبوع' : 'Study Hours This Week', value: `${learningStats.studyHoursThisWeek}h`, icon: Clock, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'الدورات المكتملة' : 'Courses Completed', value: learningStats.coursesCompleted, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'متوسط الاختبارات' : 'Quiz Average', value: `${learningStats.quizAverage}%`, icon: Target, gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: lang === 'ar' ? 'سلسلة الأيام' : 'Day Streak', value: `${learningStats.streak} 🔥`, icon: Flame, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                  ].map((kpi, i) => (
                    <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className={`glass-card rounded-2xl p-5 ${kpi.bg} border border-slate-200/50 dark:border-slate-800`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-3`}>
                        <kpi.icon size={20} className="text-white"/>
                      </div>
                      <p className="text-2xl font-bold text-[#1e3a5f] dark:text-white">{kpi.value}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{kpi.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weekly Study Chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-500"/> {lang === 'ar' ? 'ساعات الدراسة اليومية' : 'Daily Study Hours'}
                    </h4>
                    <div className="flex items-end gap-3 h-36">
                      {learningStats.weeklyData.map((hours, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: `${(hours / 3) * 100}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-cyan-500 transition-all min-h-[4px]"
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-50 dark:bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {hours}h
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                      {(lang === 'ar' ? ['أحد','إثن','ثلا','أرب','خمي','جمع','سبت'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']).map(d => (
                        <span key={d} className="flex-1 text-center">{d}</span>
                      ))}
                    </div>

                    {/* Weekly Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>{lang === 'ar' ? 'هدف الأسبوع' : 'Weekly Goal'}</span>
                        <span>{learningStats.studyHoursThisWeek}/{learningStats.weeklyGoal}h</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((learningStats.studyHoursThisWeek / learningStats.weeklyGoal) * 100, 100)}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Achievements & Motivation */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                        <Star size={18} className="text-amber-500"/> {lang === 'ar' ? 'الإنجازات' : 'Achievements'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                              <p className="font-semibold text-sm text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'إجمالي النقاط' : 'Total Points'}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'الترتيب: #' : 'Rank: #'}{learningStats.rank}</p>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-amber-500">{learningStats.totalPoints}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📚</span>
                            <p className="font-semibold text-sm text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'شهادات مكتسبة' : 'Certificates Earned'}</p>
                          </div>
                          <span className="text-xl font-bold text-emerald-500">{certificates.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🧠</span>
                            <p className="font-semibold text-sm text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'اختبارات تم اجتيازها' : 'Quizzes Passed'}</p>
                          </div>
                          <span className="text-xl font-bold text-purple-500">18</span>
                        </div>
                      </div>
                    </div>

                    {/* Motivational Message */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                      className="mt-5 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white relative overflow-hidden"
                    >
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                      <div className="relative z-10">
                        <p className="text-lg font-bold flex items-center gap-2"><Zap size={20}/> {lang === 'ar' ? 'استمر!' : 'Keep Going!'}</p>
                        <p className="text-sm text-white/80 mt-1">
                          {lang === 'ar'
                            ? `أنت في المرتبة #${learningStats.rank}! واصل التعلم ${learningStats.streak} يوماً متتالية — لقد حققت تقدماً رائعاً! 🚀`
                            : `You're ranked #${learningStats.rank}! ${learningStats.streak} day streak — you're making incredible progress! 🚀`}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ═══════════════ PROFILE TAB ═══════════════ */}
            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{
                name: studentName,
                role: 'student',
                email: studentEmail,
                uid: currentUser?.uid,
                badges: currentUser?.badges || ['developer'],
                membershipId: currentUser?.membershipId || ''
              }} />
            )}

            {/* ═══════════════ VIRTUAL LAB TAB ═══════════════ */}
            {activeTab === 'lab' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Terminal className="text-cyan-500"/> {lang === 'ar' ? 'محاكي البرمجة والبيئة الافتراضية' : 'Virtual Lab & Code Simulator'}
                  </h3>
                  <span className="px-4 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-bold animate-pulse">
                    {lang === 'ar' ? 'HackerRank محرك' : 'HackerRank Engine'}
                  </span>
                </div>
                <p className="text-slate-500 mb-4 text-sm">
                  {lang === 'ar' 
                    ? 'بيئة حية لتنفيذ الأكواد مباشرة من المتصفح دون الحاجة لتثبيت أي برامج.' 
                    : 'A live environment to execute code directly from the browser without installing any software.'}
                </p>
                <CodeSimulator lang={lang} />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Certificate Print Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static print:inset-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:rounded-none"
          >
            {/* Modal Actions (Hidden in Print) */}
            <div className="p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:hidden">
              <h3 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'عرض الشهادة' : 'Certificate View'}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-transform hover:scale-105"
                >
                  <Printer size={18} /> {lang === 'ar' ? 'طباعة الشهادة' : 'Print Certificate'}
                </button>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Certificate Printable Area */}
            <div id="printable-cert" 
                 className="w-full aspect-video p-6 sm:p-10 md:p-16 relative flex flex-col justify-center items-center text-center mx-auto my-4 rounded-xl print:m-0 print:w-[297mm] print:h-[210mm] print:aspect-auto bg-cover bg-center overflow-hidden border-4 border-teal-800/30 shadow-inner"
                 style={{ backgroundImage: 'url(/certificate-bg.png)' }}>
              {/* Overlay to ensure text readability if needed */}
              <div className="absolute inset-0 bg-white/40 print:bg-white/40 pointer-events-none z-0"></div>
              
              <div className="relative z-10 mb-4 sm:mb-8 mt-6 sm:mt-12">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-orbitron text-[#0a1f3d] mb-1 sm:mb-2 tracking-widest drop-shadow-md">CERTIFICATE</h1>
                <h2 className="text-lg sm:text-xl md:text-2xl text-teal-900 font-bold uppercase tracking-[0.2em] drop-shadow-sm">Of Completion</h2>
              </div>

              <div className="space-y-4 sm:space-y-6 relative z-10 w-full max-w-2xl mx-auto">
                <p className="text-sm sm:text-lg text-slate-900 font-semibold uppercase tracking-widest drop-shadow-sm">This is to certify that</p>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#0a1f3d] border-b-2 border-[#0a1f3d]/40 pb-2 sm:pb-4 mb-2 sm:mb-4 drop-shadow-lg">{studentName}</h3>
                
                <p className="text-lg text-slate-900 font-semibold drop-shadow-sm">Has successfully completed the advanced course</p>
                <h4 className="text-2xl md:text-4xl font-black text-teal-900 my-4 drop-shadow-lg">{selectedCert.course}</h4>
                
                <div className="flex justify-center items-center gap-8 text-slate-900 pt-8 mt-8 border-t border-[#0a1f3d]/30">
                  <div className="text-center">
                    <p className="font-bold text-lg text-[#0a1f3d] drop-shadow-sm">{selectedCert.issueDate}</p>
                    <p className="text-sm font-bold uppercase tracking-widest border-t border-[#0a1f3d]/40 mt-1 pt-1 drop-shadow-sm">Date</p>
                  </div>
                  <div className="w-px h-12 bg-[#0a1f3d]/40"></div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-[#0a1f3d] signature-font italic drop-shadow-sm">{selectedCert.instructor}</p>
                    <p className="text-sm font-bold uppercase tracking-widest border-t border-[#0a1f3d]/40 mt-1 pt-1 drop-shadow-sm">Instructor</p>
                  </div>
                </div>
              </div>

              {/* QR Code Validation */}
              <div className="absolute bottom-12 right-12 flex flex-col items-center z-10">
                <div className="bg-white p-2 border-2 border-teal-800 rounded-lg shadow-2xl">
                  <QRCodeSVG 
                    value={`https://gitm.ma/verify-certificate?id=${selectedCert.id}`} 
                    size={90} 
                    fgColor="#0a1f3d"
                  />
                </div>
                <p className="text-[10px] text-white font-mono mt-2 bg-black/60 px-2 py-0.5 rounded drop-shadow-md">{selectedCert.id}</p>
              </div>

              {/* Logo */}
              <div className="absolute bottom-12 left-12 z-10 drop-shadow-xl bg-white/80 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-3xl font-black font-orbitron text-teal-900">GITM</h2>
                <p className="text-xs text-slate-900 font-bold tracking-widest">ACADEMY</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Print CSS injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: static !important; }
        }
      `}} />
    </div>
  );
}