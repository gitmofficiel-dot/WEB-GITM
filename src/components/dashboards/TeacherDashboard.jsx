import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Users, Star, ClipboardCheck, 
  Video, FileText, CheckCircle, Clock, 
  MoreVertical, Edit3, Trash2, Calendar, LayoutDashboard, Plus, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const [courses, setCourses] = useState([
    { id: 1, title: 'Edge AI Development', students: 45, rating: 4.8, status: 'Active' },
    { id: 2, title: 'Introduction to Robotics', students: 32, rating: 4.5, status: 'Active' },
    { id: 3, title: 'Advanced Neural Networks', students: 18, rating: 4.9, status: 'Draft' }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, title: 'AI Model Optimization', course: 'Edge AI Development', submitted: 40, total: 45, dueDate: '2026-06-25' },
    { id: 2, title: 'Robotics Kinematics', course: 'Introduction to Robotics', submitted: 12, total: 32, dueDate: '2026-06-30' }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'Youssef Ben', course: 'Edge AI Development', progress: 85, lastActive: '2 hours ago' },
    { id: 2, name: 'Sara Khan', course: 'Introduction to Robotics', progress: 40, lastActive: '1 day ago' },
    { id: 3, name: 'Ahmed Ali', course: 'Advanced Neural Networks', progress: 10, lastActive: '3 days ago' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{value}</h3>
          <p className={`text-sm mt-2 font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
            {trend} {lang === 'ar' ? 'هذا الشهر' : 'this month'}
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
    { id: 'courses', icon: BookOpen, label: lang === 'ar' ? 'دوراتي' : 'My Courses' },
    { id: 'assignments', icon: ClipboardCheck, label: lang === 'ar' ? 'التقييمات' : 'Assignments' },
    { id: 'students', icon: Users, label: lang === 'ar' ? 'تقدم الطلاب' : 'Student Progress' },
    { id: 'live', icon: Video, label: lang === 'ar' ? 'الجلسات المباشرة' : 'Live Sessions' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-blue-200 dark:border-slate-800">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold gradient-text">{lang === 'ar' ? 'لوحة المعلم' : 'Instructor Panel'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lang === 'ar' ? 'إدارة المواد التعليمية' : 'Manage your teaching materials'}</p>
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
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
                  <StatCard title={lang === 'ar' ? 'الدورات النشطة' : 'Active Courses'} value="3" icon={BookOpen} color="blue" trend="+1" />
                  <StatCard title={lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'} value="95" icon={Users} color="emerald" trend="+12%" />
                  <StatCard title={lang === 'ar' ? 'متوسط التقييم' : 'Average Rating'} value="4.8" icon={Star} color="amber" trend="+0.2" />
                  <StatCard title={lang === 'ar' ? 'التقييمات المعلقة' : 'Pending Grading'} value="25" icon={ClipboardCheck} color="pink" trend="-5%" />
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Calendar className="text-blue-500" size={24}/> {lang === 'ar' ? 'الجدول القادم' : 'Upcoming Schedule'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Video size={20}/></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">Live Q&A: Edge AI</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-2"><Clock size={14}/> Today, 14:00 PM</p>
                      </div>
                      <button className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Play size={16}/> Join</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <BookOpen className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة الدورات' : 'Course Management'}
                  </h3>
                  <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'إضافة دورة' : 'Add Course'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-900 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{course.title}</h4>
                        <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${course.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{course.status}</span>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <p className="text-sm text-slate-500 flex items-center gap-1"><Users size={14}/> {course.students} Students</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 text-amber-500"><Star size={14}/> {course.rating}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit3 size={16}/></button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === 'assignments' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <ClipboardCheck className="text-pink-500" size={24}/> {lang === 'ar' ? 'التقييمات المطلوب مراجعتها' : 'Assignments to Grade'}
                  </h3>
                </div>
                <div className="space-y-4">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{assignment.title}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-2"><BookOpen size={14}/> {assignment.course} • <Clock size={14}/> Due {assignment.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#1e3a5f] dark:text-white">{assignment.submitted} / {assignment.total}</p>
                          <p className="text-xs text-slate-500">Submitted</p>
                        </div>
                        <button className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 px-4 py-2 rounded-lg text-sm font-bold">Grade Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Users className="text-emerald-500" size={24}/> {lang === 'ar' ? 'تقدم الطلاب' : 'Student Progress'}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                        <th className="p-3 font-bold">Student</th>
                        <th className="p-3 font-bold">Course</th>
                        <th className="p-3 font-bold">Progress</th>
                        <th className="p-3 font-bold text-right">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-bold text-[#1e3a5f] dark:text-white">{s.name}</td>
                          <td className="p-3 text-sm text-slate-500">{s.course}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: \`\${s.progress}%\` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{s.progress}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-right text-xs text-slate-500">{s.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LIVE TAB */}
            {activeTab === 'live' && (
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Video size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                  {lang === 'ar' ? 'لا توجد جلسات حية حالياً' : 'No Live Sessions Currently'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md">
                  {lang === 'ar' ? 'يمكنك جدولة جلسة جديدة للتفاعل مع طلابك.' : 'You can schedule a new session to interact with your students directly.'}
                </p>
                <button className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Plus size={18} /> {lang === 'ar' ? 'جدولة جلسة' : 'Schedule Session'}
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}