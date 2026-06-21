import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FileText, Edit, Image as ImageIcon, Mail, 
  BarChart2, Eye, TrendingUp, AlertCircle, 
  PlusCircle, CheckSquare, Clock, Globe,
  LayoutDashboard, Search, Trash2, Edit3, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentManagerDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const [articles, setArticles] = useState([
    { id: 1, title: 'The Future of AI in Morocco', author: 'Sara Khan', date: '2026-06-20', status: 'Published', views: 1240 },
    { id: 2, title: 'Hackathon 2026 Highlights', author: 'Ahmed Ali', date: '2026-06-18', status: 'Draft', views: 0 },
    { id: 3, title: 'Quantum Computing for Beginners', author: 'Content Team', date: '2026-06-22', status: 'Pending Review', views: 0 }
  ]);

  const [media, setMedia] = useState([
    { id: 1, name: 'AI_Lab_Opening.jpg', type: 'Image', size: '2.4 MB', date: '2026-06-15' },
    { id: 2, name: 'Hackathon_Promo.mp4', type: 'Video', size: '15.2 MB', date: '2026-06-10' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{value}</h3>
          <p className={`text-sm mt-2 font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
            {trend}
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
    { id: 'articles', icon: FileText, label: lang === 'ar' ? 'المقالات والمحتوى' : 'Articles' },
    { id: 'media', icon: ImageIcon, label: lang === 'ar' ? 'مكتبة الوسائط' : 'Media Library' },
    { id: 'seo', icon: TrendingUp, label: lang === 'ar' ? 'تحسين محركات البحث' : 'SEO & Analytics' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-purple-200 dark:border-slate-800">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold gradient-text">{lang === 'ar' ? 'مدير المحتوى' : 'Content Manager'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lang === 'ar' ? 'إدارة النشر والإعلام' : 'Publishing & Media Control'}</p>
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30 translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400'
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
                  <StatCard title={lang === 'ar' ? 'المقالات المنشورة' : 'Published'} value="45" icon={FileText} color="blue" trend="+3 this week" />
                  <StatCard title={lang === 'ar' ? 'مسودات قيد المراجعة' : 'Pending Drafts'} value="8" icon={Edit} color="amber" trend="-2 since yesterday" />
                  <StatCard title={lang === 'ar' ? 'مشاهدات المعرض' : 'Gallery Views'} value="12.4K" icon={Eye} color="emerald" trend="+15% this month" />
                  <StatCard title={lang === 'ar' ? 'مشتركي النشرة' : 'Subscribers'} value="3,250" icon={Mail} color="purple" trend="+120 new" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Drafts */}
                  <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Clock className="text-amber-500" size={24}/> {lang === 'ar' ? 'أحدث المسودات' : 'Recent Drafts'}
                    </h3>
                    <div className="space-y-3">
                      {articles.filter(a => a.status !== 'Published').map(article => (
                        <div key={article.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center bg-white dark:bg-slate-900/50 hover:border-purple-200 transition-colors">
                          <div>
                            <p className="font-bold text-[#1e3a5f] dark:text-white truncate max-w-[200px] sm:max-w-xs">{article.title}</p>
                            <p className="text-xs text-slate-500">{article.author} - {article.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg"><Edit3 size={16}/></button>
                            <button className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-2 rounded-lg"><CheckSquare size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO Alerts */}
                  <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <AlertCircle className="text-red-500" size={24}/> {lang === 'ar' ? 'تنبيهات السيو' : 'SEO Alerts'}
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-500 shrink-0"/>
                        <div>
                          <p className="font-bold text-amber-700 dark:text-amber-400">Missing Meta Descriptions</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">3 recently published articles are missing meta descriptions. This affects search ranking.</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 flex items-start gap-3">
                        <Globe size={20} className="text-blue-500 shrink-0"/>
                        <div>
                          <p className="font-bold text-blue-700 dark:text-blue-400">Broken Links Detected</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Found 2 dead links in the 'About Us' page footer. Please update them.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES TAB */}
            {activeTab === 'articles' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <FileText className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة المقالات' : 'Article Management'}
                  </h3>
                  <button className="btn-primary bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><PlusCircle size={16}/> {lang === 'ar' ? 'كتابة مقال' : 'New Article'}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                        <th className="p-3 font-bold">Title</th>
                        <th className="p-3 font-bold">Author</th>
                        <th className="p-3 font-bold">Status</th>
                        <th className="p-3 font-bold">Views</th>
                        <th className="p-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {articles.map(article => (
                        <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-bold text-[#1e3a5f] dark:text-white">{article.title}</td>
                          <td className="p-3 text-sm text-slate-500">{article.author}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${
                              article.status === 'Published' ? 'bg-emerald-100 text-emerald-600' :
                              article.status === 'Draft' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' : 'bg-amber-100 text-amber-600'
                            }`}>{article.status}</span>
                          </td>
                          <td className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400">{article.views}</td>
                          <td className="p-3 text-right">
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit3 size={16}/></button>
                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <ImageIcon className="text-pink-500" size={24}/> {lang === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}
                  </h3>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <PlusCircle size={16}/> {lang === 'ar' ? 'رفع ملف' : 'Upload Files'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.map(item => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4">
                      {item.type === 'Image' ? <ImageIcon size={40} className="text-slate-400 mb-2"/> : <Globe size={40} className="text-slate-400 mb-2"/>}
                      <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-300 truncate w-full">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.size}</p>
                      
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button className="p-2 bg-white/20 hover:bg-blue-500 text-white rounded-lg transition-colors" title="View"><Eye size={16}/></button>
                        <button className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-lg transition-colors" title="Delete"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload placeholder */}
                  <div className="rounded-xl aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <PlusCircle size={32} className="text-slate-400 mb-2" />
                    <p className="text-sm font-bold text-slate-500">Quick Upload</p>
                  </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-full flex items-center justify-center mb-4">
                  <BarChart2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                  {lang === 'ar' ? 'تحليلات الأداء المتقدمة' : 'Advanced Analytics Dashboard'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md">
                  {lang === 'ar' ? 'تتبع أداء المقالات، الكلمات المفتاحية، وزيارات الموقع بالتفصيل.' : 'Track article performance, keywords, and website traffic in detail.'}
                </p>
                <button className="btn-primary bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Globe size={18} /> {lang === 'ar' ? 'ربط Google Analytics' : 'Connect Google Analytics'}
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}