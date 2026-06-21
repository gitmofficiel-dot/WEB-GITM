import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, Settings, Download, Edit3, Camera, Bell, Lock, Globe, Moon, Sun, Monitor, ShieldCheck, Mail, Briefcase, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfileSettings({ currentUser = { name: 'Mourad', role: 'admin', email: 'mourad@gitm.ma', badges: ['founder', 'developer'] } }) {
  const { lang, setLang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Print CV function
  const handlePrintCV = () => {
    window.print();
  };

  const CVPreview = () => (
    <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 mt-6 print:shadow-none print:border-none print:m-0 print:p-0">
      <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-200 pb-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-xl">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#1e3a5f]">{currentUser.name}</h2>
          <p className="text-blue-600 font-semibold text-lg uppercase tracking-wider">{currentUser.role} @ GITM</p>
          <div className="flex gap-4 mt-2 text-slate-500 text-sm">
            <span className="flex items-center gap-1"><Mail size={16}/> {currentUser.email}</span>
            <span className="flex items-center gap-1"><Globe size={16}/> Casablanca, Morocco</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><Briefcase size={20} className="text-cyan-500"/> {lang === 'ar' ? 'المهارات والشارات' : 'Skills & Badges'}</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges.map(b => (
              <span key={b} className="px-3 py-1 bg-cyan-50 text-cyan-700 font-bold rounded-lg text-sm uppercase tracking-wide border border-cyan-100">
                {b}
              </span>
            ))}
            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm border border-slate-200">React.js</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm border border-slate-200">Leadership</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-purple-500"/> {lang === 'ar' ? 'المسار الأكاديمي' : 'Academy Track'}</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="font-bold text-slate-700">Edge AI Development</p>
                <p className="text-xs text-slate-500">GITM Academy - 2025</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <p className="font-bold text-slate-700">IoT Cloud Infrastructure</p>
                <p className="text-xs text-slate-500">In Progress (80%)</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 print:hidden">
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all border-b-2 ${activeSubTab === 'profile' ? 'border-cyan-500 text-cyan-500 dark:text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          <User size={18}/> {lang === 'ar' ? 'الملف الشخصي و السيرة الذاتية' : 'Profile & CV'}
        </button>
        <button 
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all border-b-2 ${activeSubTab === 'settings' ? 'border-blue-500 text-blue-500 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          <Settings size={18}/> {lang === 'ar' ? 'الإعدادات' : 'Settings'}
        </button>
      </div>

      {activeSubTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <User className="text-cyan-500" size={24}/> {lang === 'ar' ? 'تجهيز السيرة الذاتية (CV)' : 'CV Builder'}
            </h3>
            <button onClick={handlePrintCV} className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
              <Download size={16}/> {lang === 'ar' ? 'تصدير PDF' : 'Export PDF'}
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 print:hidden">
            {lang === 'ar' 
              ? 'سيرتك الذاتية يتم إنشاؤها تلقائياً بناءً على نشاطاتك والشارات التي كسبتها في أكاديمية ومشاريع GITM.' 
              : 'Your CV is automatically generated based on your activities and badges earned in GITM Academy and projects.'}
          </p>
          
          <CVPreview />
        </motion.div>
      )}

      {activeSubTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
          
          <div className="glass-card rounded-3xl p-6 md:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <Edit3 className="text-blue-500" size={24}/> {lang === 'ar' ? 'تعديل البيانات الأساسية' : 'Edit Personal Info'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center relative group overflow-hidden">
                  <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">{currentUser.name.charAt(0)}</span>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors">{lang === 'ar' ? 'تغيير الصورة' : 'Change Photo'}</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input type="text" defaultValue={currentUser.name} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" defaultValue={currentUser.email} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'نبذة شخصية (Bio)' : 'Bio'}</label>
                <textarea rows="3" placeholder={lang === 'ar' ? 'اكتب نبذة عنك تظهر في ملفك...' : 'Write something about yourself...'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all">
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                <ShieldCheck className="text-emerald-500" size={20}/> {lang === 'ar' ? 'الأمان' : 'Security'}
              </h3>
              <button className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
                <Lock size={18} className="text-slate-500"/>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</span>
              </button>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                <Bell className="text-amber-500" size={20}/> {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Email Alerts</span>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Academy Updates</span>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </label>
              </div>
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}
