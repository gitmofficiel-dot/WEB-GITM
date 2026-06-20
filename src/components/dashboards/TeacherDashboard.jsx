import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Users, Star, Video, FileText, PlusCircle, CheckCircle, Edit, Sparkles, Wand2, Trash2 } from 'lucide-react';

export default function TeacherDashboard() {
  const { lang, t, courses, setCourses } = useLanguage();
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Introduction to Leadership', order: 1, type: 'video' },
    { id: 2, title: 'Communication Skills', order: 2, type: 'pdf' }
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', progress: 85, grade: 'A' },
    { id: 2, name: 'Jane Smith', progress: 60, grade: 'B' }
  ]);
  const [pendingReviews, setPendingReviews] = useState([
    { id: 1, student: 'Omar Tazi', course: 'Edge AI Architecture', lesson: 'Model Quantization', submittedAt: '10 mins ago', type: 'code' },
    { id: 2, student: 'Sara El Fassi', course: 'IoT Cloud Integration', lesson: 'MQTT Basics', submittedAt: '1 hour ago', type: 'file' }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Total Courses</p><p className="text-2xl font-bold">5</p></div>
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Students Enrolled</p><p className="text-2xl font-bold">342</p></div>
          <Users className="w-8 h-8 text-green-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Avg Score</p><p className="text-2xl font-bold">88%</p></div>
          <Star className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Lessons Published</p><p className="text-2xl font-bold">24</p></div>
          <Video className="w-8 h-8 text-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Course Management</h3>
            <button 
              onClick={() => {
                const title = prompt(lang === 'ar' ? 'أدخل اسم الكورس الجديد:' : 'Enter new course title:');
                if (title) {
                  setCourses(prev => [...prev, { id: 'new_' + Date.now(), track: 'new', title, progress: 0, enrolled: false, mode: 'remote' }]);
                }
              }}
              className="btn-primary flex items-center gap-1 text-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add Course
            </button>
          </div>
          <div className="space-y-3">
            {courses.map((c, idx) => (
              <div key={c.id} className="flex justify-between items-center p-3 bg-white/5 dark:bg-black/20 rounded border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <span className="font-bold opacity-50">{idx + 1}.</span>
                  <BookOpen className="w-4 h-4 text-blue-400"/>
                  <p className="font-medium text-sm truncate max-w-[200px]">{c.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{c.mode}</span>
                  <button onClick={() => setCourses(prev => prev.filter(course => course.id !== c.id))} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-500">
              <Wand2 className="w-5 h-5" /> AI Quiz Generator
            </h3>
            <p className="text-xs text-slate-400 mb-4">Paste lesson text or upload a PDF, and let AI generate 10 multiple-choice questions automatically.</p>
            
            <div className="bg-white/5 dark:bg-black/20 p-4 rounded mb-4 border border-cyan-500/30">
              <textarea 
                placeholder="Paste lesson content here..." 
                className="w-full h-24 bg-transparent border border-gray-500/50 rounded mb-3 p-3 outline-none text-sm resize-none focus:border-cyan-500"
              ></textarea>
              <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                <Sparkles size={16} /> Generate Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Student Progress</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b dark:border-gray-700">
                <th className="p-2">Student Name</th><th className="p-2">Progress</th><th className="p-2">Grade</th><th className="p-2">Actions</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b dark:border-gray-700/50">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${s.progress}%`}}></div>
                      </div>
                    </td>
                    <td className="p-2 font-bold">{s.grade}</td>
                    <td className="p-2"><button className="text-blue-500 text-sm">Manage Grade</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500"><FileText className="w-5 h-5" /> Pending Assignments Review</h3>
          <div className="space-y-4">
            {pendingReviews.map(pr => (
              <div key={pr.id} className="p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{pr.student}</h4>
                  <p className="text-xs text-gray-500">{pr.course} - {pr.lesson}</p>
                  <p className="text-xs text-amber-500 mt-1">Submitted: {pr.submittedAt}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition">Approve</button>
                  <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition">Review Code</button>
                </div>
              </div>
            ))}
            {pendingReviews.length === 0 && (
              <p className="text-center text-gray-500 py-4">No pending assignments to review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}