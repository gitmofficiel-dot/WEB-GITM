import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, Server, Activity, Terminal, Bot, Network, Wrench } from 'lucide-react';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function SupervisorDashboard() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-orbitron text-red-600 dark:text-red-400 flex items-center gap-2">
          <ShieldAlert /> {txt(lang, 'System Supervisor', 'مشرف النظام', 'Superviseur Système', '系统主管')}
        </h2>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Server CPU', val: '24%', icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Memory Usage', val: '4.2 GB', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Active Users', val: '1,204', icon: Terminal, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Error Rate', val: '0.01%', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
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

      <div className="glass-card rounded-2xl p-6 bg-slate-900 text-green-400 font-mono text-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
          <h3 className="font-bold flex items-center gap-2 text-slate-300">
            <Terminal size={16} /> Live System Logs
          </h3>
          <span className="text-xs text-slate-500">Auto-scrolling</span>
        </div>
        <div className="space-y-2 h-64 overflow-y-auto">
          <p>[2026-06-19 23:14:02] INFO: User auth successful (ID: 4021)</p>
          <p>[2026-06-19 23:14:05] INFO: Database backup completed</p>
          <p className="text-yellow-400">[2026-06-19 23:14:15] WARN: High latency on API endpoint /v1/academy</p>
          <p>[2026-06-19 23:14:22] INFO: Container GITM-Frontend scaled to 3 instances</p>
          <p className="text-red-400">[2026-06-19 23:14:40] ERROR: Failed to connect to external mail service</p>
          <p>[2026-06-19 23:15:00] INFO: System health check passed</p>
        </div>
      </div>

      {/* AI Anomaly Detection */}
      <div className="glass-card rounded-2xl p-6 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden mt-6">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Network size={120} />
        </div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-red-500">
          <Bot className="w-5 h-5 text-red-400" />
          {txt(lang, 'AI Anomaly Detection System', 'نظام كشف الحالات الشاذة AI', 'Détection des anomalies IA', 'AI异常检测系统')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-red-500/20">
            <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-500" /> Security Threat Detected
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              AI model <strong className="text-red-400">Guardian-v4</strong> detected an unusual pattern of login attempts from IP range 192.168.x.x matching a credential stuffing profile.
            </p>
            <button className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
              <ShieldAlert size={14} /> Auto-Ban IPs
            </button>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-4 border border-amber-500/20">
            <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Server size={16} className="text-amber-500" /> Server Load Prediction
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              AI forecasts a <strong className="text-amber-400">95% CPU spike</strong> in 10 minutes due to the upcoming scheduled IoT Hackathon stream.
            </p>
            <button className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
              <Wrench size={14} /> Pre-scale Containers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}