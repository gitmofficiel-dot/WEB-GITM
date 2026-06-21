import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  PenTool, Image as ImageIcon, BarChart2, Share2, Plus, Edit, Trash2, Eye, Calendar, Globe, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function ContentManagerDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('articles');

  const articles = [
    { id: 1, title: 'مستقبل الذكاء الاصطناعي في المغرب', views: 1205, status: 'Published', date: '2026-06-20' },
    { id: 2, title: 'تغطية هاكاثون الابتكار 2026', views: 0, status: 'Draft', date: '2026-06-22' }
  ];

  const seoMetrics = {
    domainAuthority: 45,
    monthlyVisitors: '24.5K',
    topKeyword: 'AI Morocco'
  };

  const tabs = [
    { id: 'articles', icon: PenTool, label: lang === 'ar' ? 'إدارة المقالات' : 'Articles' },
    { id: 'seo', icon: BarChart2, label: lang === 'ar' ? 'تحليلات SEO' : 'SEO Analytics' },
    { id: 'social', icon: Share2, label: lang === 'ar' ? 'النشر على المنصات' : 'Social Media' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'الملف الشخصي' : 'Profile & Settings' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-rose-200 dark:border-rose-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'مدير المحتوى' : 'Content Manager'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">GITM Media Team</p>
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
                    ? 'bg-rose-500 text-white shadow-lg translate-x-2' 
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
            
            {activeTab === 'articles' && (
              <div className="glass-card rounded-3xl p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><PenTool className="text-rose-500"/> {lang==='ar'?'إدارة المحتوى':'Content Management'}</h3>
                   <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang==='ar'?'مقال جديد':'New Article'}</button>
                 </div>
                 <div className="space-y-4">
                    {articles.map(art => (
                      <div key={art.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] dark:text-white">{art.title}</h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14}/> {art.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Eye size={14}/> {art.views}</span>
                          <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${art.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{art.status}</span>
                          <div className="flex gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                            <button className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                            <button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="glass-card rounded-3xl p-6 text-center border-t-4 border-blue-500">
                    <Globe className="mx-auto text-blue-500 mb-2" size={32}/>
                    <p className="text-slate-500 text-sm font-bold">Domain Authority</p>
                    <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{seoMetrics.domainAuthority}/100</h3>
                 </div>
                 <div className="glass-card rounded-3xl p-6 text-center border-t-4 border-emerald-500">
                    <Users className="mx-auto text-emerald-500 mb-2" size={32}/>
                    <p className="text-slate-500 text-sm font-bold">Monthly Visitors</p>
                    <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{seoMetrics.monthlyVisitors}</h3>
                 </div>
                 <div className="glass-card rounded-3xl p-6 text-center border-t-4 border-purple-500">
                    <BarChart2 className="mx-auto text-purple-500 mb-2" size={32}/>
                    <p className="text-slate-500 text-sm font-bold">Top Keyword</p>
                    <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mt-2">{seoMetrics.topKeyword}</h3>
                 </div>
              </div>
            )}

            {activeTab === 'social' && (
               <div className="glass-card rounded-3xl p-6 text-center py-20 border border-dashed border-slate-300 dark:border-slate-700">
                  <Share2 className="mx-auto text-slate-400 mb-4" size={48}/>
                  <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Social Media Automation</h3>
                  <p className="text-sm text-slate-500 mb-6">Connect LinkedIn, Twitter, and Instagram to auto-publish articles.</p>
                  <button className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold">Connect Accounts</button>
               </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'Media Team', role: 'content_manager', email: 'media@gitm.ma', badges: ['writer', 'designer'], membershipId: 'GITM-2026-MEDIA' }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}