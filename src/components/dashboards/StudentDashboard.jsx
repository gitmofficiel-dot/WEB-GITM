import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen, FileText, CheckCircle, Clock, Award, Star, Settings, PlayCircle,
  Share2, Eye, BarChart3, Target, TrendingUp, Zap,
  Calendar, Medal, Flame, Terminal, Printer, X, ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import CodeSimulator from './CodeSimulator';
import InspirationCard from './InspirationCard';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function StudentDashboard() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [copiedLink, setCopiedLink] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const studentName = currentUser?.name || (lang === 'ar' ? 'أيمن بنعلي' : 'Aymane Benali');
  const studentEmail = currentUser?.email || 'a.benali@gitm.ma';

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [learningStats, setLearningStats] = useState({
    studyHoursThisWeek: 0,
    coursesCompleted: 0,
    quizAverage: 0,
    streak: 0,
    totalPoints: 0,
    rank: 0,
    weeklyGoal: 15,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const snap = await getDocs(collection(db, 'courses'));
        const colors = ['from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-purple-500 to-indigo-500', 'from-rose-500 to-pink-500'];
        const fetchedCourses = snap.docs.map((doc, i) => {
          const data = doc.data();
          const color = colors[i % colors.length];
          return {
            id: doc.id,
            title: data.titleEn || data.title || 'Untitled',
            titleAr: data.titleAr || data.title || 'بدون عنوان',
            progress: 0,
            nextLesson: data.modules?.[0]?.titleEn || data.modules?.[0]?.title || 'Introduction',
            nextLessonAr: data.modules?.[0]?.titleAr || data.modules?.[0]?.title || 'مقدمة',
            status: 'In Progress',
            color: color
          };
        });
        setEnrolledCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchRealData();
  }, []);

  const handleShareCert = (certId) => {
    const link = `${window.location.origin}/verify-certificate?id=${certId}`;
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
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
  };

  return (
    <div className={`flex flex-col md:flex-row gap-5 md:gap-6 animate-fade-in-up pb-12 md:pb-10 md:min-h-screen relative w-full max-w-[100vw] overflow-x-hidden ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>

      {/* Mobile Header + Scrollable Top Tabs */}
      <div className="md:hidden space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="min-w-0">
            <h2 className="text-lg font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white truncate">
              {lang === 'ar' ? 'لوحة الطالب' : 'Student Panel'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">{studentName}</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
            {studentName.charAt(0)}
          </div>
        </div>

        <nav
          aria-label={lang === 'ar' ? 'تبويبات لوحة الطالب' : 'Student dashboard tabs'}
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
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate max-w-[120px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar (Desktop only) */}
      <div className="hidden md:block w-full md:w-64 shrink-0 min-w-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-cyan-200 dark:border-slate-800 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white">
              {lang === 'ar' ? 'لوحة الطالب' : 'Student Panel'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{studentName}</p>
          </div>
          <nav className="flex flex-col gap-2 w-full">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
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

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 md:space-y-6 w-full min-w-0"
          >

            {/* ═══════════════ COURSES TAB ═══════════════ */}
            {activeTab === 'courses' && (
              <div className="space-y-5 md:space-y-6">
                <div className="overflow-hidden rounded-2xl">
                  <InspirationCard lang={lang} />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <BookOpen className="text-blue-500 shrink-0" size={22} />
                  <span>{lang === 'ar' ? 'التقدم الأكاديمي' : 'Academic Progress'}</span>
                </h3>

                {enrolledCourses.length === 0 ? (
                  <div className="glass-card rounded-2xl p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                      <BookOpen size={28} />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#1e3a5f] dark:text-white mb-2">
                      {lang === 'ar' ? 'لم تسجل في أي دورة بعد' : 'No enrolled courses yet'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
                      {lang === 'ar'
                        ? 'استكشف دورات أكاديمية GITM التقنية وابدأ رحلة التعلم اليوم.'
                        : 'Explore GITM Academy technical courses and start your learning journey today.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/academy')}
                      className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>{lang === 'ar' ? 'تصفح الأكاديمية' : 'Browse Academy'}</span>
                      <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {enrolledCourses.map((course, i) => (
                      <motion.div
                        key={course.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-card rounded-2xl p-4 sm:p-5 md:p-6 relative overflow-hidden group border border-slate-200/70 dark:border-slate-800"
                      >
                        {course.status === 'Completed' && (
                          <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} p-4`}>
                            <CheckCircle className="text-emerald-500" size={28} />
                          </div>
                        )}
                        <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-gradient-to-b ${course.color}`} />

                        <h4 className="font-bold text-base md:text-lg text-[#1e3a5f] dark:text-white mb-1.5 pe-8 break-words leading-snug">
                          {lang === 'ar' ? course.titleAr : course.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 break-words">
                          {course.status === 'Completed'
                            ? (lang === 'ar' ? 'مكتملة' : 'Completed')
                            : (lang === 'ar' ? 'الدرس القادم: ' : 'Next: ') + (lang === 'ar' ? course.nextLessonAr : course.nextLesson)}
                        </p>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                            className={`h-2.5 rounded-full bg-gradient-to-r ${course.color}`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-4">
                          <span>{course.progress}%</span>
                          {course.grade && <span className="text-emerald-600 dark:text-emerald-400">{lang === 'ar' ? 'الدرجة: ' : 'Grade: '}{course.grade}</span>}
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate('/academy')}
                          className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                            course.progress === 100
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                              : `bg-gradient-to-r ${course.color} text-white hover:shadow-lg`
                          }`}
                        >
                          <PlayCircle size={16} />
                          <span>
                            {course.progress === 100
                              ? (lang === 'ar' ? 'مراجعة الدورة' : 'Review Course')
                              : (lang === 'ar' ? 'متابعة التعلم' : 'Continue Learning')}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ ASSIGNMENTS TAB ═══════════════ */}
            {activeTab === 'assignments' && (
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <FileText className="text-amber-500 shrink-0" />
                  <span>{lang === 'ar' ? 'الواجبات والمهام' : 'Assignments & Tasks'}</span>
                </h3>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: lang === 'ar' ? 'بانتظار التسليم' : 'Pending', value: assignments.filter(a => a.status === 'Pending').length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: lang === 'ar' ? 'قيد العمل' : 'In Progress', value: assignments.filter(a => a.status === 'In Progress').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'تم التقييم' : 'Graded', value: assignments.filter(a => a.status.includes('Graded')).length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`glass-card rounded-2xl p-4 text-center border border-slate-200/60 dark:border-slate-800 ${stat.bg}`}
                    >
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-4 sm:p-6">
                  {assignments.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <FileText className="w-11 h-11 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {lang === 'ar' ? 'لا توجد واجبات مطلوبة حالياً.' : 'No assignments due right now.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {assignments.map((task, i) => (
                        <motion.div
                          key={task.id}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-2 h-12 shrink-0 rounded-full ${
                              task.priority === 'high' ? 'bg-red-500' : task.priority === 'done' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-white break-words">{lang === 'ar' ? task.titleAr : task.title}</h4>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{lang === 'ar' ? task.courseAr : task.course}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                              task.status.includes('Graded') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>{task.status}</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1"><Clock size={12} /> {lang === 'ar' ? 'الموعد: ' : 'Due: '}{task.dueDate}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════ CERTIFICATES TAB ═══════════════ */}
            {activeTab === 'certificates' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Award className="text-amber-500 shrink-0" />
                    <span>{lang === 'ar' ? 'شهاداتي' : 'My Certificates'}</span>
                  </h3>
                  <span className="px-3.5 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs sm:text-sm font-bold">
                    {certificates.length} {lang === 'ar' ? 'شهادات' : 'Earned'}
                  </span>
                </div>

                {certificates.length === 0 ? (
                  <div className="glass-card rounded-2xl p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70">
                    <Award className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-80" />
                    <h4 className="text-base sm:text-lg font-bold text-[#1e3a5f] dark:text-white mb-1.5">
                      {lang === 'ar' ? 'لا توجد شهادات مكتسبة بعد' : 'No certificates earned yet'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                      {lang === 'ar' ? 'أكمل دورة في الأكاديمية للحصول على شهادتك الموثقة.' : 'Complete a course in the Academy to earn your verified certificate.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/academy')}
                      className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm"
                    >
                      {lang === 'ar' ? 'استكشف الدورات' : 'Explore Courses'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {certificates.map((cert, i) => (
                      <motion.div
                        key={cert.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-card rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800"
                      >
                        <div className={`bg-gradient-to-r ${cert.color} p-4 sm:p-5 relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Medal className="text-white/90 shrink-0" size={22} />
                                <h4 className="font-bold text-base sm:text-lg text-white break-words">{lang === 'ar' ? cert.courseAr : cert.course}</h4>
                              </div>
                              <p className="text-white/85 text-xs sm:text-sm">{lang === 'ar' ? 'المدرب: ' : 'Instructor: '}{cert.instructor}</p>
                            </div>
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-bold shrink-0">
                              {lang === 'ar' ? 'الدرجة: ' : 'Grade: '}{cert.grade}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'رقم الشهادة' : 'Certificate ID'}</p>
                              <p className="font-mono text-sm font-bold text-[#1e3a5f] dark:text-white break-all">{cert.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                              <p className="text-sm font-bold text-[#1e3a5f] dark:text-white flex items-center gap-1"><Calendar size={13} /> {cert.issueDate}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{lang === 'ar' ? 'الحالة' : 'Status'}</p>
                              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={13} /> {lang === 'ar' ? 'تم التحقق' : 'Verified'}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedCert(cert)}
                              className="flex-1 min-h-[44px] py-2.5 bg-slate-100 dark:bg-slate-800 text-[#1e3a5f] dark:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Eye size={16} /> {lang === 'ar' ? 'عرض الشهادة' : 'View Certificate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareCert(cert.id)}
                              className="flex-1 min-h-[44px] py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                            >
                              {copiedLink === cert.id ? (
                                <><CheckCircle size={16} /> {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</>
                              ) : (
                                <><Share2 size={16} /> {lang === 'ar' ? 'مشاركة الرابط' : 'Share Link'}</>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ LEARNING STATS TAB ═══════════════ */}
            {activeTab === 'stats' && (
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <BarChart3 className="text-indigo-500 shrink-0" />
                  <span>{lang === 'ar' ? 'إحصائيات التعلم' : 'Learning Statistics'}</span>
                </h3>

                {/* Main KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: lang === 'ar' ? 'ساعات الدراسة هذا الأسبوع' : 'Study Hours This Week', value: `${learningStats.studyHoursThisWeek}h`, icon: Clock, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'الدورات المكتملة' : 'Courses Completed', value: learningStats.coursesCompleted, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'متوسط الاختبارات' : 'Quiz Average', value: `${learningStats.quizAverage}%`, icon: Target, gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: lang === 'ar' ? 'سلسلة الأيام' : 'Day Streak', value: `${learningStats.streak} 🔥`, icon: Flame, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                  ].map((kpi, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`glass-card rounded-2xl p-4 md:p-5 ${kpi.bg} border border-slate-200/70 dark:border-slate-800`}
                    >
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-2.5`}>
                        <kpi.icon size={18} className="text-white" />
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white">{kpi.value}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1 leading-snug">{kpi.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Weekly Study Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-4 md:p-6 overflow-hidden"
                  >
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-500 shrink-0" />
                      <span>{lang === 'ar' ? 'ساعات الدراسة اليومية' : 'Daily Study Hours'}</span>
                    </h4>
                    <div className="flex items-end gap-2 sm:gap-3 h-36">
                      {learningStats.weeklyData.map((hours, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(hours / 3) * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-cyan-500 transition-all min-h-[4px]"
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {hours}h
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                      {(lang === 'ar' ? ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map(d => (
                        <span key={d} className="flex-1 text-center truncate">{d}</span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                        <span>{lang === 'ar' ? 'هدف الأسبوع' : 'Weekly Goal'}</span>
                        <span>{learningStats.studyHoursThisWeek}/{learningStats.weeklyGoal}h</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((learningStats.studyHoursThisWeek / learningStats.weeklyGoal) * 100, 100)}%` }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Achievements & Motivation */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card rounded-2xl p-4 md:p-6 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                        <Star size={18} className="text-amber-500 shrink-0" />
                        <span>{lang === 'ar' ? 'الإنجازات' : 'Achievements'}</span>
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

                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-5 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white relative overflow-hidden"
                    >
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      <div className="relative z-10">
                        <p className="text-base sm:text-lg font-bold flex items-center gap-2"><Zap size={18} /> {lang === 'ar' ? 'استمر!' : 'Keep Going!'}</p>
                        <p className="text-xs sm:text-sm text-white/90 mt-1 leading-relaxed">
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
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Terminal className="text-cyan-500 shrink-0" />
                    <span>{lang === 'ar' ? 'محاكي البرمجة والبيئة الافتراضية' : 'Virtual Lab & Code Simulator'}</span>
                  </h3>
                  <span className="self-start sm:self-auto px-3.5 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs sm:text-sm font-bold">
                    {lang === 'ar' ? 'HackerRank محرك' : 'HackerRank Engine'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {lang === 'ar'
                    ? 'بيئة حية لتنفيذ الأكواد مباشرة من المتصفح دون الحاجة لتثبيت أي برامج.'
                    : 'A live environment to execute code directly from the browser without installing any software.'}
                </p>
                <div className="overflow-x-auto">
                  <CodeSimulator lang={lang} />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Certificate Print Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl print:shadow-none print:max-w-none print:rounded-none"
          >
            <div className="p-4 flex flex-wrap justify-between items-center gap-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:hidden">
              <h3 className="font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'عرض الشهادة' : 'Certificate View'}</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-transform"
                >
                  <Printer size={18} /> {lang === 'ar' ? 'طباعة الشهادة' : 'Print Certificate'}
                </button>
                <button
                  type="button"
                  aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                  onClick={() => setSelectedCert(null)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 overflow-x-auto">
              <div
                id="printable-cert"
                className="w-full min-w-[320px] aspect-video p-6 sm:p-10 md:p-16 relative flex flex-col justify-center items-center text-center mx-auto rounded-xl print:m-0 print:w-[297mm] print:h-[210mm] print:aspect-auto bg-cover bg-center overflow-hidden border-4 border-teal-800/30 shadow-inner"
                style={{ backgroundImage: 'url(/certificate-bg.png)' }}
              >
                <div className="absolute inset-0 bg-white/40 print:bg-white/40 pointer-events-none z-0" />

                <div className="relative z-10 mb-4 sm:mb-8 mt-4 sm:mt-12">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-sans tracking-widest text-[#0a1f3d] mb-1 sm:mb-2 drop-shadow-md">CERTIFICATE</h1>
                  <h2 className="text-sm sm:text-xl md:text-2xl text-teal-900 font-bold uppercase tracking-[0.2em] drop-shadow-sm">Of Completion</h2>
                </div>

                <div className="space-y-2 sm:space-y-6 relative z-10 w-full max-w-2xl mx-auto">
                  <p className="text-xs sm:text-lg text-slate-900 font-semibold uppercase tracking-widest drop-shadow-sm">This is to certify that</p>
                  <h3 className="text-xl sm:text-3xl md:text-5xl font-black text-[#0a1f3d] border-b-2 border-[#0a1f3d]/40 pb-2 sm:pb-4 mb-2 sm:mb-4 drop-shadow-lg">{studentName}</h3>

                  <p className="text-xs sm:text-lg text-slate-900 font-semibold drop-shadow-sm">Has successfully completed the advanced course</p>
                  <h4 className="text-lg sm:text-2xl md:text-4xl font-black text-teal-900 my-2 sm:my-4 drop-shadow-lg">{selectedCert.course}</h4>

                  <div className="flex justify-center items-center gap-6 sm:gap-8 text-slate-900 pt-4 sm:pt-8 mt-4 sm:mt-8 border-t border-[#0a1f3d]/30">
                    <div className="text-center">
                      <p className="font-bold text-xs sm:text-lg text-[#0a1f3d] drop-shadow-sm">{selectedCert.issueDate}</p>
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-widest border-t border-[#0a1f3d]/40 mt-1 pt-1 drop-shadow-sm">Date</p>
                    </div>
                    <div className="w-px h-10 sm:h-12 bg-[#0a1f3d]/40" />
                    <div className="text-center">
                      <p className="font-bold text-xs sm:text-lg text-[#0a1f3d] signature-font italic drop-shadow-sm">{selectedCert.instructor}</p>
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-widest border-t border-[#0a1f3d]/40 mt-1 pt-1 drop-shadow-sm">Instructor</p>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex absolute bottom-8 md:bottom-12 right-8 md:right-12 flex-col items-center z-10">
                  <div className="bg-white p-2 border-2 border-teal-800 rounded-lg shadow-2xl">
                    <QRCodeSVG
                      value={`https://gitm.ma/verify-certificate?id=${selectedCert.id}`}
                      size={84}
                      fgColor="#0a1f3d"
                    />
                  </div>
                  <p className="text-xs text-white font-mono mt-2 bg-black/60 px-2 py-0.5 rounded drop-shadow-md">{selectedCert.id}</p>
                </div>

                <div className="hidden sm:block absolute bottom-8 md:bottom-12 left-8 md:left-12 z-10 drop-shadow-xl bg-white/80 p-3 md:p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-teal-900">GITM</h2>
                  <p className="text-xs text-slate-900 font-bold tracking-widest">ACADEMY</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Print CSS injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: static !important; }
        }
      `}} />
    </div>
  );
}
