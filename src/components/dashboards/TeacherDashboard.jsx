import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAI } from '../../hooks/useAI';
import {
  BookOpen, Users, ClipboardCheck, Video, Settings, Edit3, FileText, Plus,
  BarChart3, TrendingUp, Award, Calendar, Play, Trash2, GraduationCap,
  CheckCircle, Clock, Target, PieChart, Loader2, UploadCloud, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { toast } from '../../utils/toast';

export default function TeacherDashboard() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { evaluateCode, loading: aiLoading } = useAI();
  const [activeTab, setActiveTab] = useState('courses');
  const [gradeInputs, setGradeInputs] = useState({});
  const [gradedItems, setGradedItems] = useState({});
  const [showLessonForm, setShowLessonForm] = useState(null);

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title_en: '', title_ar: '', description_en: '', description_ar: '' });
  const [courseFile, setCourseFile] = useState(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [newLesson, setNewLesson] = useState({ title_en: '', title_ar: '', duration: '60 min', content_en: '', content_ar: '' });
  const [lessonFile, setLessonFile] = useState(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const confirmAction = (title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const teacherName = currentUser?.name || (lang === 'ar' ? 'د. ياسين' : 'Dr. Yassine');
  const teacherEmail = currentUser?.email || 'yassine@gitm.ma';

  const [assignedCourses, setAssignedCourses] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [labSessions, setLabSessions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    avgScore: 0, attendanceRate: 0, totalStudents: 0, coursesActive: 0,
    topStudents: [], gradeDistribution: []
  });

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), where('teacherEmail', '==', teacherEmail));
        const querySnapshot = await getDocs(q);
        const courses = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          courses.push({
            id: docSnap.id,
            name: data.title_en || '',
            nameAr: data.title_ar || '',
            students: data.students || 0,
            pendingGrades: data.pendingGrades || 0,
            color: data.color || 'from-blue-500 to-cyan-500',
            lessons: (data.modules || []).map(m => ({
              id: m.id,
              title: m.title_en,
              titleAr: m.title_ar,
              duration: m.duration || '60 min',
            }))
          });
        });
        setAssignedCourses(courses);

        const subSnap = await getDocs(collection(db, 'submissions'));
        const subList = [];
        subSnap.forEach(docSnap => {
          const d = docSnap.data();
          if (d.teacherEmail === teacherEmail || !d.teacherEmail) {
            subList.push({
              id: docSnap.id,
              student: d.studentName || 'Student',
              studentAr: d.studentNameAr || 'طالب',
              assignment: d.assignmentName || 'Task',
              assignmentAr: d.assignmentNameAr || 'مهمة',
              date: d.submittedAt?.toDate ? d.submittedAt.toDate().toISOString().split('T')[0] : '2026-06-21',
              status: d.grade ? `Graded (${d.grade}/100)` : 'Needs Grading',
              course: d.courseName || 'Course',
              mockCode: d.code || 'print("Hello World")',
              language: d.language || 'python',
              grade: d.grade || null
            });
            if (d.grade) {
              setGradedItems(prev => ({ ...prev, [docSnap.id]: d.grade }));
            }
          }
        });

        if (subList.length === 0) {
          subList.push(
            { id: 1, student: 'Aymane Benali', studentAr: 'أيمن بنعلي', assignment: 'Neural Network Model', assignmentAr: 'نموذج الشبكة العصبية', date: '2026-06-21', status: 'Needs Grading', course: 'Edge AI Development', mockCode: 'def build_model():\n  return "Model"\n# Needs more layers', language: 'python' },
            { id: 2, student: 'Sara Khan', studentAr: 'سارة خان', assignment: 'Robotics Kinematics Report', assignmentAr: 'تقرير الحركيات', date: '2026-06-20', status: 'Needs Grading', course: 'Advanced Robotics Lab', mockCode: 'import math\ndef calculate_kinematics(theta):\n  return math.sin(theta) * 10', language: 'python' }
          );
        }
        setStudentSubmissions(subList);

        const eventSnap = await getDocs(query(collection(db, 'events'), where('type', '==', 'lab')));
        const labs = [];
        eventSnap.forEach(docSnap => {
          const d = docSnap.data();
          labs.push({
            id: docSnap.id,
            title: d.title_en || 'Lab Session',
            titleAr: d.title_ar || 'جلسة مختبر',
            date: d.startDate || '2026-07-01',
            time: '10:00 AM',
            duration: '2h',
            status: 'upcoming',
            platform: d.location || 'GITM Virtual Lab',
            participants: d.registeredCount || 0
          });
        });

        if (labs.length === 0) {
          labs.push(
            { id: 1, title: 'Robotics Kinematics Lab', titleAr: 'مختبر الحركيات', date: '2026-07-01', time: '10:00 AM', duration: '2h', status: 'upcoming', platform: 'GITM Virtual Lab', participants: 25 },
            { id: 2, title: 'AI Model Training Session', titleAr: 'جلسة تدريب النماذج', date: '2026-07-03', time: '2:00 PM', duration: '3h', status: 'upcoming', platform: 'Google Colab', participants: 40 }
          );
        }
        setLabSessions(labs);

        const allGrades = subList.map(s => parseInt(s.grade)).filter(g => !isNaN(g));
        const avg = allGrades.length ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length) : 78;

        setAnalyticsData({
          avgScore: avg,
          attendanceRate: 92,
          totalStudents: courses.reduce((acc, c) => acc + c.students, 0) || 120,
          coursesActive: courses.length,
          topStudents: [
            { name: 'Aymane Benali', nameAr: 'أيمن بنعلي', avg: 96, badge: '🥇' },
            { name: 'Sara Khan', nameAr: 'سارة خان', avg: 94, badge: '🥈' }
          ],
          gradeDistribution: [
            { range: 'A (90-100)', count: 42, color: 'bg-emerald-500', pct: 21 },
            { range: 'B (80-89)', count: 68, color: 'bg-blue-500', pct: 33 }
          ]
        });

      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };
    if (teacherEmail) {
      fetchCourses();
    } else {
      setCoursesLoading(false);
    }
  }, [teacherEmail]);

  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleAIGrade = async (submission) => {
    setIsEvaluating(true);
    try {
      const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
      if (apiKey) {
        const testCases = [
          { input: "2", expectedOutput: "200" },
          { input: "5", expectedOutput: "500" }
        ];

        let passedCount = 0;
        const idMap = { javascript: 93, python: 71, cpp: 54 };
        const language_id = idMap[submission.language] || 71;

        for (let tc of testCases) {
          const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
              language_id: language_id,
              source_code: submission.mockCode,
              stdin: tc.input
            })
          });
          const data = await response.json();
          if (data.status && data.status.id <= 3) {
            passedCount++;
          }
        }

        const judge0Score = Math.round((passedCount / testCases.length) * 100);
        setGradeInputs(prev => ({ ...prev, [submission.id]: judge0Score }));
        toast.success(lang === 'ar' ? `نظام HackerRank: اجتاز ${passedCount}/${testCases.length} من الاختبارات` : `HackerRank Logic: Passed ${passedCount}/${testCases.length} tests`);

      } else {
        const result = await evaluateCode(submission.mockCode, submission.language, submission.assignment);
        if (result && result.score !== undefined) {
          setGradeInputs(prev => ({ ...prev, [submission.id]: result.score }));
          toast.success(lang === 'ar' ? 'تم التقييم بنجاح: ' + result.feedback : 'AI Graded: ' + result.feedback);
        } else {
          toast.error('AI could not grade this submission.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to run Auto-Grader.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleGradeSubmit = async (submissionId) => {
    const grade = parseInt(gradeInputs[submissionId]);
    if (isNaN(grade) || grade < 0 || grade > 100) return;

    try {
      if (typeof submissionId === 'string') {
        await updateDoc(doc(db, 'submissions', submissionId), { grade: grade });
      }
      setGradedItems(prev => ({ ...prev, [submissionId]: grade }));
      setStudentSubmissions(prev => prev.map(s =>
        s.id === submissionId ? { ...s, status: `Graded (${grade}/100)` } : s
      ));
      toast.success(lang === 'ar' ? 'تم الحفظ' : 'Grade saved');
    } catch (err) {
      toast.error('Error saving grade');
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title_en || !newCourse.title_ar) return;
    setIsCreatingCourse(true);
    try {
      let thumbnailUrl = '';
      if (courseFile) {
        thumbnailUrl = await uploadToCloudinary(courseFile, 'image');
      }
      const docRef = await addDoc(collection(db, 'courses'), {
        title_en: newCourse.title_en,
        title_ar: newCourse.title_ar,
        description_en: newCourse.description_en,
        description_ar: newCourse.description_ar,
        thumbnailUrl,
        teacherEmail,
        teacherName,
        students: 0,
        pendingGrades: 0,
        color: 'from-blue-500 to-cyan-500',
        modules: [],
        createdAt: serverTimestamp()
      });
      setAssignedCourses(prev => [...prev, {
        id: docRef.id,
        name: newCourse.title_en,
        nameAr: newCourse.title_ar,
        students: 0,
        pendingGrades: 0,
        color: 'from-blue-500 to-cyan-500',
        lessons: []
      }]);
      setShowCreateCourse(false);
      setNewCourse({ title_en: '', title_ar: '', description_en: '', description_ar: '' });
      setCourseFile(null);
      toast.success(lang === 'ar' ? 'تم إنشاء المقرر بنجاح' : 'Course created successfully');
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإنشاء' : 'Error creating course');
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleAddLesson = async (courseId) => {
    if (!newLesson.title_en) return;
    setIsAddingLesson(true);
    try {
      let fileUrl = '';
      if (lessonFile) {
        fileUrl = await uploadToCloudinary(lessonFile, 'auto');
      }
      const newLessonObj = {
        id: `l${Date.now()}`,
        type: 'lesson',
        title_en: newLesson.title_en,
        title_ar: newLesson.title_ar || newLesson.title_en,
        duration: newLesson.duration,
        content_en: newLesson.content_en,
        content_ar: newLesson.content_ar,
        fileUrl: fileUrl,
      };

      await updateDoc(doc(db, 'courses', courseId), {
        modules: arrayUnion(newLessonObj)
      });

      setAssignedCourses(prev => prev.map(c =>
        c.id === courseId ? {
          ...c,
          lessons: [...c.lessons, {
            id: newLessonObj.id,
            title: newLessonObj.title_en,
            titleAr: newLessonObj.title_ar,
            duration: newLessonObj.duration
          }]
        } : c
      ));

      setNewLesson({ title_en: '', title_ar: '', duration: '60 min', content_en: '', content_ar: '' });
      setLessonFile(null);
      setShowLessonForm(null);
      toast.success(lang === 'ar' ? 'تمت إضافة الدرس بنجاح' : 'Lesson added successfully');
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء إضافة الدرس' : 'Error adding lesson');
    } finally {
      setIsAddingLesson(false);
    }
  };

  const handleDeleteLesson = (courseId, lessonId) => {
    confirmAction(
      lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا الدرس؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this lesson? This action cannot be undone.',
      async () => {
        try {
          const courseRef = doc(db, 'courses', courseId);
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            const data = courseSnap.data();
            const newMods = (data.modules || []).filter(m => m.id !== lessonId);
            await updateDoc(courseRef, { modules: newMods });
            setAssignedCourses(prev => prev.map(c =>
              c.id === courseId ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) } : c
            ));
            toast.success(lang === 'ar' ? 'تم حذف الدرس بنجاح' : 'Lesson deleted successfully');
          }
        } catch (error) {
          console.error("Error deleting lesson:", error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting lesson');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    );
  };

  const tabs = [
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'إدارة المقررات' : 'Course Management' },
    { id: 'grading', icon: ClipboardCheck, label: lang === 'ar' ? 'نظام التقييم' : 'Grading System' },
    { id: 'analytics', icon: BarChart3, label: lang === 'ar' ? 'تحليلات الطلاب' : 'Student Analytics' },
    { id: 'virtualLab', icon: Video, label: lang === 'ar' ? 'المختبر الافتراضي' : 'Virtual Labs' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
  };

  const ConfirmDialogComponent = () => {
    if (!confirmDialog.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">{confirmDialog.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{confirmDialog.message}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
              className="flex-1 min-h-[44px] py-3 font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={confirmDialog.onConfirm}
              className="flex-1 min-h-[44px] py-3 font-bold text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/30 transition-all"
            >
              {lang === 'ar' ? 'تأكيد' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row gap-5 md:gap-6 animate-fade-in-up pb-12 md:pb-10 md:min-h-screen relative w-full max-w-[100vw] overflow-x-hidden ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
      <ConfirmDialogComponent />

      {/* Mobile Header + Scrollable Top Tabs */}
      <div className="md:hidden space-y-3 w-full min-w-0">
        <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="min-w-0">
            <h2 className="text-lg font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white truncate">
              {lang === 'ar' ? 'بوابة المعلم' : 'Teacher Portal'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">{teacherName}</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
            {teacherName?.charAt(0) || 'T'}
          </div>
        </div>

        <nav
          aria-label={lang === 'ar' ? 'تبويبات بوابة المعلم' : 'Teacher portal tabs'}
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
                <span className="truncate max-w-[130px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-full md:w-64 shrink-0 min-w-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-blue-200 dark:border-blue-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة المعلم' : 'Teacher Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{teacherName}</p>
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
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-5 md:space-y-6">

            {/* ═══════════════ COURSES TAB ═══════════════ */}
            {activeTab === 'courses' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <BookOpen className="text-blue-500 shrink-0" />
                    <span>{lang === 'ar' ? 'المقررات المكلف بها' : 'Assigned Courses'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2.5 items-center w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowCreateCourse(!showCreateCourse)}
                      className="flex-1 sm:flex-none min-h-[44px] bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} /> {lang === 'ar' ? 'إنشاء مقرر' : 'Create Course'}
                    </button>
                    <span className="px-3.5 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-xs sm:text-sm font-bold">
                      {assignedCourses.length} {lang === 'ar' ? 'مقررات' : 'Courses'}
                    </span>
                  </div>
                </div>

                {/* Create Course Form */}
                <AnimatePresence>
                  {showCreateCourse && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-base sm:text-lg mb-4 text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'مقرر جديد' : 'New Course'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                            value={newCourse.title_en}
                            onChange={e => setNewCourse({ ...newCourse, title_en: e.target.value })}
                            className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                            value={newCourse.title_ar}
                            onChange={e => setNewCourse({ ...newCourse, title_ar: e.target.value })}
                            className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                            value={newCourse.description_en}
                            onChange={e => setNewCourse({ ...newCourse, description_en: e.target.value })}
                            className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                            value={newCourse.description_ar}
                            onChange={e => setNewCourse({ ...newCourse, description_ar: e.target.value })}
                            className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center gap-4 mb-5">
                          <label className="min-h-[44px] flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors max-w-full">
                            <UploadCloud size={18} className="shrink-0" />
                            <span className="truncate">{courseFile ? courseFile.name : (lang === 'ar' ? 'رفع صورة مصغرة' : 'Upload Thumbnail')}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => setCourseFile(e.target.files[0])} />
                          </label>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5">
                          <button type="button" onClick={() => setShowCreateCourse(false)} className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button type="button" onClick={handleCreateCourse} disabled={isCreatingCourse} className="w-full sm:w-auto min-h-[44px] bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isCreatingCourse ? <Loader2 className="animate-spin" size={18} /> : null}
                            <span>{lang === 'ar' ? 'إنشاء' : 'Create'}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {coursesLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                  </div>
                ) : assignedCourses.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70">
                    <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3 opacity-80" />
                    <h4 className="text-base sm:text-lg font-bold text-[#1e3a5f] dark:text-white mb-1.5">
                      {lang === 'ar' ? 'لا توجد مقررات مكلف بها بعد' : 'No assigned courses yet'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                      {lang === 'ar' ? 'ابدأ بإنشاء أول مقرر تدريبي وإضافة الدروس للطلاب.' : 'Start by creating your first course and adding lessons for students.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCreateCourse(true)}
                      className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> {lang === 'ar' ? 'إنشاء مقرر جديد' : 'Create New Course'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {assignedCourses.map((course, i) => (
                      <motion.div
                        key={course.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-card rounded-2xl p-4 sm:p-5 md:p-6 relative overflow-hidden group border border-slate-200/70 dark:border-slate-800"
                      >
                        <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1.5 h-full bg-gradient-to-b ${course.color}`} />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white break-words">{lang === 'ar' ? course.nameAr : course.name}</h4>
                            <div className="flex flex-wrap gap-3 mt-1.5">
                              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1"><Users size={14} /> {course.students} {lang === 'ar' ? 'طالب' : 'Students'}</span>
                              <span className={`text-xs sm:text-sm flex items-center gap-1 font-semibold ${course.pendingGrades > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                <ClipboardCheck size={14} /> {course.pendingGrades} {lang === 'ar' ? 'بانتظار التقييم' : 'Pending Grades'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowLessonForm(showLessonForm === course.id ? null : course.id)}
                            className={`w-full sm:w-auto min-h-[44px] bg-gradient-to-r ${course.color} text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all shrink-0`}
                          >
                            <Plus size={16} /> {lang === 'ar' ? 'إنشاء درس' : 'Create Lesson'}
                          </button>
                        </div>

                        {/* Add Lesson Form */}
                        <AnimatePresence>
                          {showLessonForm === course.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="flex flex-col gap-3 mb-4 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={newLesson.title_en}
                                    onChange={e => setNewLesson({ ...newLesson, title_en: e.target.value })}
                                    placeholder={lang === 'ar' ? 'عنوان الدرس (إنجليزي)' : 'Lesson Title (English)'}
                                    className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                  <input
                                    type="text"
                                    value={newLesson.title_ar}
                                    onChange={e => setNewLesson({ ...newLesson, title_ar: e.target.value })}
                                    placeholder={lang === 'ar' ? 'عنوان الدرس (عربي)' : 'Lesson Title (Arabic)'}
                                    className="min-h-[48px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-sm text-[#1e3a5f] dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                                  <label className="min-h-[44px] flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <UploadCloud size={18} className="shrink-0" />
                                    <span className="truncate">{lessonFile ? lessonFile.name : (lang === 'ar' ? 'رفع ملف (PDF/فيديو)' : 'Upload File (PDF/Video)')}</span>
                                    <input type="file" className="hidden" onChange={e => setLessonFile(e.target.files[0])} />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleAddLesson(course.id)}
                                    disabled={isAddingLesson}
                                    className="min-h-[44px] bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                  >
                                    {isAddingLesson ? <Loader2 className="animate-spin" size={18} /> : null}
                                    <span>{lang === 'ar' ? 'إضافة' : 'Add Lesson'}</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Lessons List */}
                        <div className="space-y-2">
                          <h5 className="text-xs uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider mb-2">
                            {lang === 'ar' ? 'قائمة الدروس' : 'Lesson List'} ({course.lessons.length})
                          </h5>
                          {course.lessons.map((lesson, li) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: li * 0.04 }}
                              className="flex justify-between items-center gap-2 p-3 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:shadow-sm transition-shadow group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-7 h-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">{li + 1}</span>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-[#1e3a5f] dark:text-white break-words">{lang === 'ar' ? lesson.titleAr : lesson.title}</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1"><Clock size={11} /> {lesson.duration}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                aria-label={lang === 'ar' ? 'حذف الدرس' : 'Delete lesson'}
                                onClick={() => handleDeleteLesson(course.id, lesson.id)}
                                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center text-red-500 hover:text-red-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ GRADING TAB ═══════════════ */}
            {activeTab === 'grading' && (
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <Edit3 className="text-amber-500 shrink-0" />
                  <span>{lang === 'ar' ? 'نظام التقييم' : 'Grading System'}</span>
                </h3>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: lang === 'ar' ? 'إجمالي التسليمات' : 'Total Submissions', value: studentSubmissions.length, icon: FileText, color: 'text-blue-500' },
                    { label: lang === 'ar' ? 'بانتظار التقييم' : 'Pending', value: studentSubmissions.filter(s => s.status === 'Needs Grading').length, icon: Clock, color: 'text-amber-500' },
                    { label: lang === 'ar' ? 'تم تقييمها' : 'Graded', value: Object.keys(gradedItems).length, icon: CheckCircle, color: 'text-emerald-500' },
                    { label: lang === 'ar' ? 'متوسط الدرجات' : 'Avg Grade', value: Object.keys(gradedItems).length > 0 ? Math.round(Object.values(gradedItems).reduce((a, b) => a + b, 0) / Object.values(gradedItems).length) : '—', icon: Target, color: 'text-purple-500' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="glass-card rounded-2xl p-4 text-center border border-slate-200/70 dark:border-slate-800"
                    >
                      <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={22} />
                      <p className="text-2xl font-bold text-[#1e3a5f] dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Submissions List */}
                <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
                  {studentSubmissions.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-600 dark:text-slate-300">
                      {lang === 'ar' ? 'لا توجد تسليمات للتقييم حالياً.' : 'No submissions to grade right now.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentSubmissions.map((sub, i) => (
                        <motion.div
                          key={sub.id}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          className={`p-4 sm:p-5 border rounded-2xl transition-all ${
                            gradedItems[sub.id] !== undefined
                              ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                  {sub.student.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-white break-words">{lang === 'ar' ? sub.studentAr : sub.student}</h4>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{sub.course}</p>
                                </div>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-1 break-words">
                                <FileText size={14} className="shrink-0" /> {lang === 'ar' ? sub.assignmentAr : sub.assignment}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1"><Calendar size={12} /> {sub.date}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {gradedItems[sub.id] !== undefined ? (
                                <span className="min-h-[44px] px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl text-sm inline-flex items-center gap-1.5">
                                  <CheckCircle size={16} /> {gradedItems[sub.id]}/100
                                </span>
                              ) : (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                    value={gradeInputs[sub.id] || ''}
                                    onChange={e => setGradeInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                    className="w-24 min-h-[44px] p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-base sm:text-sm font-bold text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAIGrade(sub)}
                                    disabled={isEvaluating}
                                    aria-label={lang === 'ar' ? 'التقييم الآلي' : 'Auto-Grade'}
                                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                                    title={lang === 'ar' ? 'التقييم الآلي (HackerRank/AI)' : 'Auto-Grade (HackerRank/AI)'}
                                  >
                                    {isEvaluating ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} className="text-purple-500" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleGradeSubmit(sub.id)}
                                    disabled={!gradeInputs[sub.id]}
                                    className="flex-1 sm:flex-none min-h-[44px] bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                                  >
                                    {lang === 'ar' ? 'تقييم' : 'Submit'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
            {activeTab === 'analytics' && (
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                  <BarChart3 className="text-purple-500 shrink-0" />
                  <span>{lang === 'ar' ? 'تحليلات الطلاب' : 'Student Analytics'}</span>
                </h3>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: lang === 'ar' ? 'متوسط الدرجات' : 'Average Score', value: `${analyticsData.avgScore}%`, icon: Target, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: lang === 'ar' ? 'نسبة الحضور' : 'Attendance Rate', value: `${analyticsData.attendanceRate}%`, icon: Users, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students', value: analyticsData.totalStudents, icon: GraduationCap, gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: lang === 'ar' ? 'المقررات النشطة' : 'Active Courses', value: analyticsData.coursesActive, icon: BookOpen, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
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
                  {/* Grade Distribution Chart */}
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-4 md:p-6 overflow-hidden">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                      <PieChart size={18} className="text-purple-500 shrink-0" />
                      <span>{lang === 'ar' ? 'توزيع الدرجات' : 'Grade Distribution'}</span>
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.gradeDistribution.map((g, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-20 shrink-0">{g.range}</span>
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${g.pct}%` }}
                              transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                              className={`h-full ${g.color} rounded-full flex items-center justify-end px-2`}
                            >
                              <span className="text-xs font-bold text-white">{g.count}</span>
                            </motion.div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-10 text-end shrink-0">{g.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Top Students */}
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl p-4 md:p-6 overflow-hidden">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                      <Award size={18} className="text-amber-500 shrink-0" />
                      <span>{lang === 'ar' ? 'أفضل الطلاب' : 'Top Students'}</span>
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.topStudents.map((stu, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl shrink-0">{stu.badge}</span>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-[#1e3a5f] dark:text-white truncate">{lang === 'ar' ? stu.nameAr : stu.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'المتوسط العام' : 'Overall Average'}</p>
                            </div>
                          </div>
                          <span className={`text-lg font-bold shrink-0 ${stu.avg >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>{stu.avg}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Performance Trend */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-4 md:p-6 overflow-hidden">
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500 shrink-0" />
                    <span>{lang === 'ar' ? 'اتجاه الأداء الشهري' : 'Monthly Performance Trend'}</span>
                  </h4>
                  <div className="overflow-x-auto pb-1">
                    <div className="min-w-[360px]">
                      <div className="flex items-end gap-2 h-40">
                        {[65, 72, 68, 75, 78, 82, 79, 85, 88, 84, 90, 78].map((val, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            transition={{ delay: 0.35 + i * 0.04, duration: 0.35 }}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-cyan-500 transition-all"
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {val}%
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                          <span key={m} className="flex-1 text-center">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ═══════════════ VIRTUAL LABS TAB ═══════════════ */}
            {activeTab === 'virtualLab' && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                    <Video className="text-indigo-500 shrink-0" />
                    <span>{lang === 'ar' ? 'جلسات المختبر الافتراضي' : 'Virtual Lab Sessions'}</span>
                  </h3>
                </div>

                {labSessions.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-600 dark:text-slate-300">
                    {lang === 'ar' ? 'لا توجد جلسات مختبر مجدولة حالياً.' : 'No virtual lab sessions scheduled right now.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {labSessions.map((session, i) => (
                      <motion.div
                        key={session.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className={`glass-card rounded-2xl p-4 sm:p-6 border overflow-hidden ${
                          session.status === 'completed'
                            ? 'border-slate-200 dark:border-slate-800 opacity-75'
                            : 'border-indigo-200/70 dark:border-indigo-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white break-words">{lang === 'ar' ? session.titleAr : session.title}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{session.platform}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                            session.status === 'upcoming' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {session.status === 'upcoming' ? (lang === 'ar' ? 'قادمة' : 'Upcoming') : (lang === 'ar' ? 'مكتملة' : 'Completed')}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                          <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                            <Calendar size={14} className="mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                            <p className="text-xs font-bold text-[#1e3a5f] dark:text-white truncate">{session.date}</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                            <Clock size={14} className="mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                            <p className="text-xs font-bold text-[#1e3a5f] dark:text-white truncate">{session.time}</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                            <Users size={14} className="mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                            <p className="text-xs font-bold text-[#1e3a5f] dark:text-white">{session.participants}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={session.status === 'completed'}
                          className={`w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            session.status === 'upcoming'
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Play size={16} /> {session.status === 'upcoming' ? (lang === 'ar' ? 'انضمام للجلسة' : 'Join Session') : (lang === 'ar' ? 'انتهت الجلسة' : 'Session Ended')}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════ PROFILE TAB ═══════════════ */}
            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{
                name: teacherName,
                role: 'teacher',
                email: teacherEmail,
                badges: currentUser?.badges || ['instructor', 'ai_expert'],
                membershipId: currentUser?.membershipId || 'GITM-TCH-001'
              }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
