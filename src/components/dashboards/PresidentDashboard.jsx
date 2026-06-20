import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, BookOpen, Building, Newspaper, Activity, Shield, Award, Edit, Trash2, Bot, TrendingUp, AlertTriangle } from 'lucide-react';

export default function PresidentDashboard() {
  const { lang, t, user } = useLanguage();
  const [members, setMembers] = useState([
    { id: 1, name: 'Ahmed Ali', role: 'member', badges: ['speaker'] },
    { id: 2, name: 'Sara Khan', role: 'teacher', badges: ['writer', 'speaker'] }
  ]);
  const [news, setNews] = useState([
    { id: 1, title: 'Annual Summit 2026', date: '2026-07-01' }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Total Members</p><p className="text-2xl font-bold">1,250</p></div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Active Projects</p><p className="text-2xl font-bold">45</p></div>
          <Activity className="w-8 h-8 text-green-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Courses</p><p className="text-2xl font-bold">120</p></div>
          <BookOpen className="w-8 h-8 text-purple-500" />
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div><p className="text-sm opacity-70">Partners</p><p className="text-2xl font-bold">32</p></div>
          <Building className="w-8 h-8 text-orange-500" />
        </div>
      </div>

      {/* AI Predictive Analytics */}
      <div className="glass-card rounded-2xl p-6 border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <TrendingUp size={120} />
        </div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-pink-500">
          <Bot className="w-5 h-5 text-pink-400" />
          {lang === 'ar' ? 'التحليلات التنبؤية (الذكاء الاصطناعي)' : 'AI Predictive Analytics'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyan-50 dark:bg-slate-900/50 rounded-xl p-4 border border-pink-500/20">
            <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" /> Growth Prediction (Q3 2026)
            </h4>
            <p className="text-sm text-slate-500">
              Based on current enrollment rates in the Academy, expect a <strong className="text-emerald-500">24% increase</strong> in active members next quarter. Consider opening 2 new Edge AI remote classes to handle the load.
            </p>
          </div>
          
          <div className="bg-cyan-50 dark:bg-slate-900/50 rounded-xl p-4 border border-pink-500/20">
            <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" /> Risk Assessment
            </h4>
            <p className="text-sm text-slate-500">
              Project <strong className="text-amber-500">"Smart Farm Drone"</strong> shows a 60% probability of missing its deadline due to recent low commit activity from the hardware team. Intervention recommended.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Member Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b dark:border-gray-700">
                  <th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Badges</th><th className="p-2">Actions</th>
                </tr></thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} className="border-b dark:border-gray-700/50">
                      <td className="p-2">{m.name}</td>
                      <td className="p-2"><select className="bg-transparent border rounded p-1"><option>{m.role}</option><option>admin</option></select></td>
                      <td className="p-2 flex gap-1">{m.badges.map(b => <span key={b} className={`badge badge-${b}`}>{b}</span>)}</td>
                      <td className="p-2"><button className="text-blue-500 hover:text-blue-600"><Edit className="w-4 h-4"/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Newspaper className="w-5 h-5" /> News Management</h3>
            <div className="space-y-3">
              {news.map(n => (
                <div key={n.id} className="flex justify-between items-center p-3 bg-[#e0fcfc]/5 dark:bg-black/20 rounded">
                  <div><p className="font-semibold">{n.title}</p><p className="text-xs opacity-70">{n.date}</p></div>
                  <button className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              <button className="btn-primary w-full mt-2">Add News Item</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Building className="w-5 h-5" /> Partners</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> TechCorp</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> EduGlobal</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5" /> Activity Log</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="opacity-70">10:00 AM</span> - New member joined</li>
              <li><span className="opacity-70">09:15 AM</span> - Course updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}