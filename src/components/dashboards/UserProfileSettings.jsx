import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, Settings, Copy, Edit3, Camera, Bell, Lock, Globe, ShieldCheck, Mail, Briefcase, GraduationCap, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfileSettings({ currentUser = { name: 'Student', role: 'student', email: 'student@gitm.ma', badges: [], membershipId: '' } }) {
  const { lang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [copyStatus, setCopyStatus] = useState('');
  
  // Real functional image upload state
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleCopyCVLink = () => {
    if (!currentUser.membershipId) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(''), 3000);
      return;
    }
    
    const cvLink = `https://gitm.ma/cv/${currentUser.membershipId}`;
    navigator.clipboard.writeText(cvLink).then(() => {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(''), 3000);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const CVPreview = () => (
    <div className="bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 mt-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-200 dark:border-slate-800 pb-6 relative z-10">
        <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-4xl font-bold shadow-xl overflow-hidden border-2 border-transparent">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            currentUser.name.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{currentUser.name}</h2>
              <p className="text-blue-600 dark:text-cyan-400 font-semibold text-lg uppercase tracking-wider">{currentUser.role} @ GITM</p>
            </div>
            {currentUser.membershipId ? (
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'رقم العضوية' : 'Membership ID'}</p>
                <p className="font-mono text-sm font-bold text-[#1e3a5f] dark:text-white">{currentUser.membershipId}</p>
              </div>
            ) : (
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-200">
                {lang === 'ar' ? 'طالب - بدون عضوية' : 'Student - No ID'}
              </span>
            )}
          </div>
          <div className="flex gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm">
            <span className="flex items-center gap-1"><Mail size={16}/> {currentUser.email}</span>
            <span className="flex items-center gap-1"><Globe size={16}/> Morocco</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Briefcase size={20} className="text-cyan-500"/> {lang === 'ar' ? 'المهارات والشارات' : 'Skills & Badges'}</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges.length > 0 ? currentUser.badges.map(b => (
              <span key={b} className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold rounded-lg text-sm uppercase tracking-wide border border-cyan-100 dark:border-cyan-800">
                {b}
              </span>
            )) : (
              <p className="text-sm text-slate-400">{lang === 'ar' ? 'لا توجد شارات حالياً.' : 'No badges earned yet.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white mb-2">
                <User className="text-cyan-500" size={24}/> {lang === 'ar' ? 'معاينة السيرة الذاتية (CV)' : 'CV Preview'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lang === 'ar' 
                  ? 'يتم توليد السيرة الذاتية رسمياً للأعضاء الموثقين فقط.' 
                  : 'CV is officially generated for verified members only.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {copyStatus === 'success' && (
                  <motion.span initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:10}} className="text-emerald-500 text-sm font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                    <CheckCircle size={16}/> {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}
                  </motion.span>
                )}
                {copyStatus === 'error' && (
                  <motion.span initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:10}} className="text-amber-500 text-sm font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                    <AlertCircle size={16}/> {lang === 'ar' ? 'غير مصرح (لا يوجد رقم عضوية)' : 'Unauthorized (No ID)'}
                  </motion.span>
                )}
              </AnimatePresence>
              <button onClick={handleCopyCVLink} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <Copy size={16}/> {lang === 'ar' ? 'نسخ رابط السيرة الذاتية' : 'Copy CV Link'}
              </button>
            </div>
          </div>
          
          <CVPreview />
        </motion.div>
      )}

      {activeSubTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <Edit3 className="text-blue-500" size={24}/> {lang === 'ar' ? 'تعديل البيانات الأساسية والهوية الرقمية' : 'Edit Personal Info & Digital Identity'}
            </h3>
            
            <div className="space-y-8">
              {/* Functional Image Upload */}
              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative group overflow-hidden cursor-pointer border-2 border-dashed border-slate-400 hover:border-blue-500 transition-colors shadow-lg"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">{currentUser.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors text-slate-800 dark:text-white"
                  >
                    {lang === 'ar' ? 'اختيار صورة جديدة' : 'Choose New Photo'}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">{lang === 'ar' ? 'يُفضل استخدام صورة احترافية مربعة (1:1)' : 'Preferably a professional square image (1:1)'}</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input type="text" defaultValue={currentUser.name} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" defaultValue={currentUser.email} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'نبذة تعريفية (Bio)' : 'Bio'}</label>
                  <textarea rows="3" placeholder={lang === 'ar' ? 'تحدث عن شغفك ومجال تخصصك...' : 'Talk about your passion and expertise...'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
                </div>
              </div>

              {/* Advanced Portfolio Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                <div>
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Briefcase size={18} className="text-purple-500"/> {lang === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h4>
                  <input type="text" placeholder={lang === 'ar' ? 'مثال: Python, React, AI (افصل بينها بفاصلة)' : 'e.g. Python, React, AI (comma separated)'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-rose-500"/> {lang === 'ar' ? 'الاهتمامات ومجالات البحث' : 'Interests & Research Fields'}</h4>
                  <input type="text" placeholder={lang === 'ar' ? 'مثال: الروبوتيك، إنترنت الأشياء (افصل بينها بفاصلة)' : 'e.g. Robotics, IoT (comma separated)'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              {/* Academic Path */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-blue-500"/> {lang === 'ar' ? 'المسار الأكاديمي' : 'Academic Path'}</h4>
                <div className="flex gap-4">
                  <input type="text" placeholder={lang === 'ar' ? 'السنة (مثال: 2023)' : 'Year (e.g. 2023)'} className="w-1/4 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white" />
                  <input type="text" placeholder={lang === 'ar' ? 'التخصص أو الشهادة' : 'Degree or Major'} className="w-1/2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white" />
                  <button className="w-1/4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">{lang === 'ar' ? 'إضافة' : 'Add'}</button>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-500"/> {lang === 'ar' ? 'الروابط وحسابات التواصل' : 'Social & Portfolio Links'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="url" placeholder="GitHub URL" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white" />
                  <input type="url" placeholder="LinkedIn URL" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#1e3a5f] dark:text-white" />
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all">
                  {lang === 'ar' ? 'حفظ ونشر التغييرات' : 'Save & Publish Profile'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
