import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Briefcase, CheckSquare, Target, Activity, Calendar, Bot, Code2, Camera } from 'lucide-react';
import CloudinaryUploader from '../CloudinaryUploader';
import { auth } from '../../config/firebaseAuth';
import { updateProfile } from 'firebase/auth';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function MemberDashboard() {
  const { lang, user, setView } = useLanguage();
  const [showUploader, setShowUploader] = useState(false);

  const handleAvatarUpload = async (fileData) => {
    if (!auth.currentUser) return;
    try {
      // Update Firebase Auth
      await updateProfile(auth.currentUser, { photoURL: fileData.url });
      // Update Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { photoURL: fileData.url });
      
      // We rely on onAuthStateChanged in LanguageContext to pick up the change or we can manually reload the page/state
      alert(lang === 'ar' ? 'تم تحديث الصورة بنجاح!' : 'Profile picture updated successfully!');
      setShowUploader(false);
      window.location.reload(); // Quick way to refresh context
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Error updating profile picture.");
    }
  };

  const myTasks = [
    { id: 1, title: 'Code Review: Health AI', status: 'in-progress', deadline: 'Today' },
    { id: 2, title: 'Draft Tech Specs for Drone', status: 'pending', deadline: 'Tomorrow' },
    { id: 3, title: 'Meeting with UI/UX team', status: 'completed', deadline: 'Yesterday' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => setShowUploader(!showUploader)}>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-500/50 shadow-lg bg-slate-800 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-orbitron">
              {txt(lang, 'Welcome, ', 'مرحباً، ', 'Bienvenue, ', '欢迎， ')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">{user?.name}</span>
            </h2>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs font-bold uppercase tracking-wider mt-2 inline-block">
              {txt(lang, 'Member Dashboard', 'لوحة العضو', 'Tableau de bord membre', '成员仪表板')}
            </span>
          </div>
        </div>
      </div>

      {showUploader && (
        <div className="glass-card p-6 rounded-2xl border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
          <h3 className="font-bold mb-4">{lang === 'ar' ? 'تغيير الصورة الشخصية' : 'Change Profile Picture'}</h3>
          <CloudinaryUploader onUploadSuccess={handleAvatarUpload} />
          <button onClick={() => setShowUploader(false)} className="mt-4 text-sm text-red-500 hover:underline">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: txt(lang, 'Active Projects', 'مشاريع نشطة', 'Projets actifs', '活跃项目'), val: '3', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: txt(lang, 'Pending Tasks', 'مهام قيد الانتظار', 'Tâches', '待办任务'), val: '5', icon: CheckSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: txt(lang, 'Contributions', 'المساهمات', 'Contributions', '贡献'), val: '42', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: txt(lang, 'Upcoming Events', 'أحداث قادمة', 'Événements', '即将举行的活动'), val: '2', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold font-orbitron">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">{txt(lang, 'Architecture Collaboration', 'التعاون المعماري', 'Collaboration', '协作')}</h3>
              <p className="text-sm text-slate-500">Join your team on the live whiteboard to draw system architectures.</p>
            </div>
            <button onClick={() => setView('collab-board')} className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <Target size={18} /> {txt(lang, 'Open Whiteboard', 'افتح اللوحة البيضاء', 'Ouvrir', '打开白板')}
            </button>
          </div>
        </div>

        {/* My Tasks */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Target className="text-amber-500" size={20} />
            {txt(lang, 'My Tasks', 'مهامي', 'Mes tâches', '我的任务')}
          </h3>
          <div className="space-y-3">
            {myTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                <input 
                  type="checkbox" 
                  checked={task.status === 'completed'} 
                  readOnly
                  className="w-5 h-5 rounded border-cyan-400 text-teal-500 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-[#1e3a5f] dark:text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Due: {task.deadline}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 
                  'bg-cyan-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Code Reviewer */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Code2 size={120} />
          </div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-500">
            <Bot className="w-5 h-5 text-cyan-400" />
            {txt(lang, 'AI Code Reviewer', 'مراجع الكود الذكي AI', 'Revue de code IA', 'AI代码审查器')}
          </h3>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm border border-slate-700">
            <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
              <span className="text-slate-400">File: src/components/DataPipeline.js</span>
              <span className="text-amber-400 text-xs px-2 py-1 bg-amber-400/10 rounded">Optimization Suggestion</span>
            </div>
            <p className="text-emerald-400 mb-2">
              // AI Suggestion: Replace mapping over huge arrays with a stream to reduce memory usage by 40%.
            </p>
            <pre className="text-slate-300">
              {`- const result = hugeData.map(processRow);\n+ const result = hugeData.stream().map(processRow);`}
            </pre>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition">Apply Fix</button>
              <button className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold transition">Ignore</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Activity className="text-blue-500" size={20} />
            {txt(lang, 'Recent Activity', 'النشاط الأخير', 'Activité récente', '近期活动')}
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 rtl:before:mr-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-cyan-200 dark:before:bg-slate-700">
            {[
              { text: 'Pushed 5 commits to EduChain repo', time: '2 hours ago', icon: Briefcase, color: 'bg-blue-500' },
              { text: 'Completed Review for PR #42', time: '5 hours ago', icon: CheckSquare, color: 'bg-emerald-500' },
              { text: 'Registered for Web3 Conference', time: '1 day ago', icon: Calendar, color: 'bg-purple-500' },
            ].map((act, i) => (
              <div key={i} className="relative flex items-center gap-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 z-10 border-4 border-white dark:border-[#0B132B] ${act.color}`}>
                  <act.icon size={14} />
                </div>
                <div className="glass p-4 rounded-xl flex-1 border border-cyan-300 dark:border-slate-800">
                  <p className="text-sm font-medium text-[#1e3a5f] dark:text-white">{act.text}</p>
                  <span className="text-xs text-slate-500">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}