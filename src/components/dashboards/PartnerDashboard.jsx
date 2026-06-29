import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Handshake, BarChart3, FolderOpen, MessageSquare, Settings, Users, TrendingUp,
  FileText, Calendar, CheckCircle, Clock, Send, Plus, ExternalLink, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function PartnerDashboard() {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const partnershipMetrics = {
    sharedProjects: 3,
    totalReach: '12,500+',
    eventsCoHosted: 7,
    satisfactionScore: 4.8
  };

  const sharedProjects = [
    { id: 1, title: lang === 'ar' ? 'مبادرة المدن الذكية المغربية' : 'Moroccan Smart Cities Initiative', status: 'Active', gitm_lead: 'Mourad', partner_lead: currentUser?.name || 'Partner Lead', progress: 68 },
    { id: 2, title: lang === 'ar' ? 'برنامج احتضان الشركات الناشئة' : 'Startup Incubation Program', status: 'Planning', gitm_lead: 'Youssef Alaoui', partner_lead: currentUser?.name || 'Partner Lead', progress: 20 },
    { id: 3, title: lang === 'ar' ? 'مختبر البحث في الذكاء الاصطناعي' : 'AI Research Lab Partnership', status: 'Completed', gitm_lead: 'Khadija Mansouri', partner_lead: currentUser?.name || 'Partner Lead', progress: 100 }
  ];

  const communications = [
    { id: 1, from: 'Mourad (GITM President)', subject: lang === 'ar' ? 'اجتماع مراجعة الشراكة Q3' : 'Q3 Partnership Review Meeting', date: '2026-06-25', unread: true },
    { id: 2, from: 'Youssef Alaoui', subject: lang === 'ar' ? 'تحديث مشروع المدن الذكية' : 'Smart Cities Project Update', date: '2026-06-20', unread: false },
    { id: 3, from: 'GITM Academy', subject: lang === 'ar' ? 'فرصة تدريب مشترك جديدة' : 'New Joint Training Opportunity', date: '2026-06-18', unread: true }
  ];

  const tabs = [
    { id: 'overview', icon: BarChart3, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'projects', icon: FolderOpen, label: lang === 'ar' ? 'المشاريع المشتركة' : 'Shared Projects' },
    { id: 'communications', icon: MessageSquare, label: lang === 'ar' ? 'التواصل مع GITM' : 'Communications' },
    { id: 'reports', icon: FileText, label: lang === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Stats' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-emerald-200 dark:border-emerald-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة الشريك' : 'Partner Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentUser?.name || 'Corporate Partner'}</p>
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
                    ? 'bg-emerald-500 text-white shadow-lg translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: lang==='ar'?'المشاريع المشتركة':'Shared Projects', value: partnershipMetrics.sharedProjects, icon: FolderOpen, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
                    { title: lang==='ar'?'الوصول الإجمالي':'Total Reach', value: partnershipMetrics.totalReach, icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
                    { title: lang==='ar'?'الفعاليات المشتركة':'Co-Hosted Events', value: partnershipMetrics.eventsCoHosted, icon: Calendar, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
                    { title: lang==='ar'?'معدل الرضا':'Satisfaction', value: partnershipMetrics.satisfactionScore + '/5', icon: Star, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                          <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.color}`}><stat.icon size={22}/></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-4"><TrendingUp className="text-emerald-500" size={24}/> {lang==='ar'?'ملخص الشراكة':'Partnership Summary'}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'ar' 
                      ? 'شراكتكم مع GITM حققت نتائج ممتازة خلال الأشهر الثلاثة الأخيرة. تم إنجاز مشروع مختبر الذكاء الاصطناعي بنجاح، مع زيادة في التفاعل بنسبة 35%.'
                      : 'Your partnership with GITM has achieved excellent results over the past quarter. The AI Research Lab project was completed successfully, with a 35% increase in engagement.'
                    }
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><FolderOpen className="text-emerald-500"/>{lang==='ar'?'المشاريع المشتركة':'Shared Projects'}</h3>
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"><Plus size={16}/> {lang==='ar'?'اقتراح مشروع':'Propose Project'}</button>
                </div>
                {sharedProjects.map(project => (
                  <div key={project.id} className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white">{project.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">GITM Lead: {project.gitm_lead} • Partner Lead: {project.partner_lead}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : project.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{project.status}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${project.progress === 100 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <p className="text-right text-xs mt-2 text-slate-500 font-bold">{project.progress}%</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><MessageSquare className="text-blue-500"/>{lang==='ar'?'الرسائل والتواصل':'Messages & Communications'}</h3>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"><Send size={16}/> {lang==='ar'?'رسالة جديدة':'New Message'}</button>
                </div>
                <div className="glass-card rounded-3xl p-6">
                  {communications.map(msg => (
                    <div key={msg.id} className={`flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 last:border-none ${msg.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div>
                        <h4 className={`font-bold text-[#1e3a5f] dark:text-white ${msg.unread ? '' : 'font-normal'}`}>{msg.subject}</h4>
                        <p className="text-xs text-slate-500 mt-1">{msg.from} • {msg.date}</p>
                      </div>
                      {msg.unread && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><FileText className="text-purple-500"/>{lang==='ar'?'التقارير والإحصائيات':'Reports & Statistics'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang==='ar'?'التأثير الاجتماعي':'Social Impact'}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'طلاب مستفيدون':'Students Benefited'}</span><span className="font-bold text-emerald-600">2,450</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'ورش عمل منظمة':'Workshops Organized'}</span><span className="font-bold text-emerald-600">14</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'شهادات ممنوحة':'Certificates Issued'}</span><span className="font-bold text-emerald-600">680</span></div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4">{lang==='ar'?'مقاييس الأداء':'Performance Metrics'}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'معدل الإنجاز':'Completion Rate'}</span><span className="font-bold text-blue-600">92%</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'رضا المشاركين':'Participant Satisfaction'}</span><span className="font-bold text-blue-600">4.8/5</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">{lang==='ar'?'العائد على الاستثمار':'ROI Index'}</span><span className="font-bold text-blue-600">3.2x</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}