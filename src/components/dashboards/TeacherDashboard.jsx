import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Users, Award, FlaskConical, LayoutDashboard, Settings, User, FileText, CheckCircle, Clock } from 'lucide-react';
import UserProfileSettings from './UserProfileSettings';

export default function TeacherDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = {
    name: lang === 'ar' ? 'د. يوسف' : 'Dr. Youssef',
    role: 'Teacher',
    email: 'youssef@gitm.ma',
    badges: ['speaker', 'developer'],
    membershipId: 'GITM-TCH-001'
  };

  const stats = [
    { id: 1, title: lang === 'ar' ? 'الطلاب' : 'Total Students', value: '142', icon: Users, color: 'text-blue-500' },
    { id: 2, title: lang === 'ar' ? 'الدورات' : 'Active Courses', value: '4', icon: BookOpen, color: 'text-emerald-500' },
    { id: 3, title: lang === 'ar' ? 'التقييمات المعلقة' : 'Pending Grades', value: '28', icon: FileText, color: 'text-orange-500' },
    { id: 4, title: lang === 'ar' ? 'المختبرات الافتراضية' : 'Virtual Labs', value: '12', icon: FlaskConical, color: 'text-purple-500' },
  ];

  const courses = [
    { id: 1, name: 'AI & Machine Learning', students: 45, progress: 75 },
    { id: 2, name: 'Advanced React Development', students: 38, progress: 60 },
    { id: 3, name: 'Data Science Fundamentals', students: 59, progress: 90 },
  ];

  const gradingTasks = [
    { id: 1, student: 'Ahmed Alami', assignment: 'Neural Networks Lab', status: 'pending' },
    { id: 2, student: 'Sara Benali', assignment: 'React Components Project', status: 'graded' },
    { id: 3, student: 'Karim Tazi', assignment: 'Data Ethics Essay', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {[
          { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
          { id: 'grading', icon: CheckCircle, label: lang === 'ar' ? 'التقييم' : 'Grading' },
          { id: 'labs', icon: FlaskConical, label: lang === 'ar' ? 'المختبرات' : 'Virtual Labs' },
          { id: 'profile', icon: User, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-orbitron">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UserProfileSettings currentUser={currentUser} />
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.id} className="glass-card p-6 card-3d hover-lift">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <h3 className="text-2xl font-orbitron font-bold text-white">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">
                  {lang === 'ar' ? 'الدورات الحالية' : 'Active Courses'}
                </h3>
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{course.name}</span>
                        <span className="text-emerald-400 text-sm">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{course.students} {lang === 'ar' ? 'طالب' : 'Students'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-orbitron text-white mb-4">
                  {lang === 'ar' ? 'مهام التقييم' : 'Recent Grading Tasks'}
                </h3>
                <div className="space-y-3">
                  {gradingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${task.status === 'graded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {task.status === 'graded' ? <CheckCircle size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{task.assignment}</p>
                          <p className="text-sm text-gray-400">{task.student}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-300 rounded-lg transition-colors">
                        {lang === 'ar' ? 'مراجعة' : 'Review'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="wip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <FlaskConical size={48} className="mx-auto mb-4 text-emerald-500/50" />
            <h2 className="text-2xl font-orbitron text-white mb-2">
              {lang === 'ar' ? 'قريباً' : 'Coming Soon'}
            </h2>
            <p className="text-gray-400">
              {lang === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}