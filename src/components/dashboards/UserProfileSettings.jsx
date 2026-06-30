import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import {
  User, Settings, Copy, Edit3, Camera, Globe, Mail, Briefcase, GraduationCap, CheckCircle, AlertCircle, Plus, Trash2, Github, Linkedin, Facebook, Instagram, Award, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PREDEFINED_SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'C++', 'Java', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Science', 'IoT', 'Robotics', 'Cybersecurity', 'Cloud Computing', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Git', 'Agile', 'UI/UX Design', '3D Modeling', 'AutoCAD', 'SolidWorks', 'Arduino', 'Raspberry Pi'];
const PREDEFINED_INTERESTS = ['Artificial Intelligence', 'Robotics', 'Internet of Things (IoT)', 'Web Development', 'Mobile App Development', 'Game Development', 'Data Analysis', 'Blockchain', 'Quantum Computing', 'Space Tech', 'Green Tech', 'Bioinformatics', 'Entrepreneurship', 'Open Source', 'Hackathons'];

const MONTHS = [
  { value: '01', ar: 'يناير', en: 'Jan' },
  { value: '02', ar: 'فبراير', en: 'Feb' },
  { value: '03', ar: 'مارس', en: 'Mar' },
  { value: '04', ar: 'أبريل', en: 'Apr' },
  { value: '05', ar: 'مايو', en: 'May' },
  { value: '06', ar: 'يونيو', en: 'Jun' },
  { value: '07', ar: 'يوليو', en: 'Jul' },
  { value: '08', ar: 'أغسطس', en: 'Aug' },
  { value: '09', ar: 'سبتمبر', en: 'Sep' },
  { value: '10', ar: 'أكتوبر', en: 'Oct' },
  { value: '11', ar: 'نوفمبر', en: 'Nov' },
  { value: '12', ar: 'ديسمبر', en: 'Dec' },
];

const SearchableMultiSelect = ({ options, selected, onChange, placeholder, lang }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o));

  const handleAdd = (val) => {
    if(val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = (val) => {
    onChange(selected.filter(s => s !== val));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        <AnimatePresence>
          {selected.map(s => (
            <motion.span key={s} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-lg flex items-center gap-2 border border-blue-100 dark:border-blue-800">
              {s}
              <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleRemove(s)} />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative">
        <input 
          type="text" 
          value={query} 
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500"
          dir="auto"
        />
        <AnimatePresence>
          {isOpen && (query || filteredOptions.length > 0) && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
              {filteredOptions.map(opt => (
                <div key={opt} onClick={() => handleAdd(opt)} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-[#1e3a5f] dark:text-white border-b border-slate-100 dark:border-slate-700 last:border-0">
                  {opt}
                </div>
              ))}
              {query && !options.includes(query) && !selected.includes(query) && (
                <div onClick={() => handleAdd(query)} className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-blue-500 font-bold flex items-center gap-2 border-t border-slate-100 dark:border-slate-700">
                  <Plus size={16}/> {lang === 'ar' ? `إضافة "${query}" كمهارة جديدة` : `Add "${query}" as new`}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function UserProfileSettings({ currentUser: propUser }) {
  const { lang } = useLanguage();
  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || propUser || { name: 'Student', role: 'student', email: 'student@gitm.ma', badges: [], membershipId: '' };
  
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [copyStatus, setCopyStatus] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  
  const [profileImage, setProfileImage] = useState(currentUser.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Expanded Form Data
  const [formData, setFormData] = useState({
    nameLatin: currentUser.nameLatin || currentUser.name || '',
    nameAr: currentUser.nameAr || '',
    email: currentUser.email || '',
    bio: currentUser.bio || '',
    github: currentUser.socialLinks?.github || '',
    linkedin: currentUser.socialLinks?.linkedin || '',
    facebook: currentUser.socialLinks?.facebook || '',
    instagram: currentUser.socialLinks?.instagram || '',
  });

  const [academicPaths, setAcademicPaths] = useState(currentUser.academicPaths || []);
  const [newPath, setNewPath] = useState({ degree: '', startYear: '', startMonth: '', endYear: '', endMonth: '' });

  const [skills, setSkills] = useState(currentUser.skills || []);
  const [interests, setInterests] = useState(currentUser.interests || []);

  const years = Array.from({length: 30}, (_, i) => new Date().getFullYear() - i);

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
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleAddPath = () => {
    if (!newPath.degree || !newPath.startYear || !newPath.startMonth) return;
    const updatedPaths = [...academicPaths, newPath].sort((a, b) => {
      if (b.startYear !== a.startYear) return b.startYear - a.startYear;
      return parseInt(b.startMonth) - parseInt(a.startMonth);
    });
    setAcademicPaths(updatedPaths);
    setNewPath({ degree: '', startYear: '', startMonth: '', endYear: '', endMonth: '' });
  };

  const handleRemovePath = (index) => {
    setAcademicPaths(academicPaths.filter((_, i) => i !== index));
  };

  const formatPathDate = (year, month) => {
    if (!year) return '';
    if (!month) return year;
    const m = MONTHS.find(x => x.value === month);
    return `${lang === 'ar' ? m.ar : m.en} ${year}`;
  };

  const handleSaveProfile = async () => {
    setSaveStatus('loading');
    try {
      if (currentUser?.membershipId) {
        let finalImageUrl = currentUser.imageUrl || '';
        if (selectedFile) {
          finalImageUrl = await uploadToCloudinary(selectedFile, 'image');
        }

        const userRef = doc(db, 'users', currentUser.membershipId);
        await updateDoc(userRef, {
          imageUrl: finalImageUrl,
          nameLatin: formData.nameLatin,
          nameAr: formData.nameAr,
          name: formData.nameLatin || currentUser.name, // Keep backwards compatible
          email: formData.email,
          bio: formData.bio,
          socialLinks: {
            github: formData.github,
            linkedin: formData.linkedin,
            facebook: formData.facebook,
            instagram: formData.instagram
          },
          academicPaths,
          skills: skills,
          interests: interests,
          updatedAt: new Date().toISOString()
        });
        setSaveStatus('success');
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaveStatus('success');
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const CVPreview = () => (
    <div className="bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 mt-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-200 dark:border-slate-800 pb-6 relative z-10">
        <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-4xl font-bold shadow-xl overflow-hidden border-2 border-transparent shrink-0">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            (formData.nameLatin || currentUser.name).charAt(0)
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{formData.nameLatin || currentUser.name}</h2>
              {formData.nameAr && <h3 className="text-xl font-bold text-[#1e3a5f]/80 dark:text-white/80 font-cairo mt-1">{formData.nameAr}</h3>}
              <p className="text-blue-600 dark:text-cyan-400 font-semibold text-lg uppercase tracking-wider mt-1">{currentUser.role} @ GITM</p>
            </div>
            {currentUser.membershipId ? (
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">{lang === 'ar' ? 'رقم العضوية' : 'Membership ID'}</p>
                <p className="font-mono text-sm font-bold text-[#1e3a5f] dark:text-white">{currentUser.membershipId}</p>
              </div>
            ) : (
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-200 shrink-0 whitespace-nowrap">
                {lang === 'ar' ? 'طالب - بدون عضوية' : 'Student - No ID'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm">
            <span className="flex items-center gap-1"><Mail size={16}/> {formData.email || currentUser.email}</span>
            <span className="flex items-center gap-1"><Globe size={16}/> Morocco</span>
          </div>

          {(formData.github || formData.linkedin || formData.facebook || formData.instagram) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {formData.github && (
                <a href={formData.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-slate-900/20">
                  <Github size={16}/> GitHub
                </a>
              )}
              {formData.linkedin && (
                <a href={formData.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-[#0A66C2]/20">
                  <Linkedin size={16}/> LinkedIn
                </a>
              )}
              {formData.facebook && (
                <a href={formData.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#0C58C2] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-[#1877F2]/20">
                  <Facebook size={16}/> Facebook
                </a>
              )}
              {formData.instagram && (
                <a href={formData.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-md">
                  <Instagram size={16}/> Instagram
                </a>
              )}
            </div>
          )}

          {formData.bio && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              {formData.bio}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Award size={20} className="text-amber-500"/> {lang === 'ar' ? 'الشارات والأوسمة' : 'Badges'}</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {(currentUser.badges || []).length > 0 ? currentUser.badges.map(b => (
              <span key={b} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-lg text-sm uppercase tracking-wide border border-amber-100 dark:border-amber-800">
                {b}
              </span>
            )) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'لا توجد شارات حالياً.' : 'No badges earned yet.'}</p>
            )}
          </div>

          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Briefcase size={20} className="text-cyan-500"/> {lang === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.length > 0 ? skills.map((s,i) => (
              <span key={i} className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold rounded-lg text-sm border border-cyan-100 dark:border-cyan-800">
                {s}
              </span>
            )) : <p className="text-sm text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'لم تتم الإضافة' : 'None added'}</p>}
          </div>

          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Globe size={20} className="text-rose-500"/> {lang === 'ar' ? 'الاهتمامات' : 'Interests'}</h3>
          <div className="flex flex-wrap gap-2">
            {interests.length > 0 ? interests.map((s,i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 font-bold rounded-lg text-sm border border-rose-100 dark:border-rose-800">
                {s}
              </span>
            )) : <p className="text-sm text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'لم تتم الإضافة' : 'None added'}</p>}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-blue-500"/> {lang === 'ar' ? 'المسار الأكاديمي' : 'Academic Path'}</h3>
          <div className="space-y-3">
            {academicPaths.length > 0 ? academicPaths.map((path, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                <p className="font-bold text-[#1e3a5f] dark:text-white">{path.degree}</p>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  {formatPathDate(path.startYear, path.startMonth)} - {formatPathDate(path.endYear, path.endMonth) || (lang === 'ar' ? 'الآن' : 'Present')}
                </p>
              </div>
            )) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'لم تتم إضافة مسارات' : 'No academic paths added'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all border-b-2 whitespace-nowrap ${activeSubTab === 'profile' ? 'border-cyan-500 text-cyan-500 dark:text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-600 dark:text-slate-300'}`}
        >
          <User size={18}/> {lang === 'ar' ? 'الملف الشخصي و السيرة الذاتية' : 'Profile & CV'}
        </button>
        <button 
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all border-b-2 whitespace-nowrap ${activeSubTab === 'settings' ? 'border-blue-500 text-blue-500 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-600 dark:text-slate-300'}`}
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
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleCopyCVLink} className="bg-slate-50 dark:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors">
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
              <Edit3 className="text-blue-500" size={24}/> {lang === 'ar' ? 'تعديل البيانات الأساسية' : 'Edit Personal Info'}
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
                    <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">{(formData.nameLatin || currentUser.name).charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current.click()} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors text-slate-800 dark:text-white">
                    {lang === 'ar' ? 'تغيير الصورة الشخصية' : 'Change Profile Photo'}
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الاسم الكامل (لاتيني)' : 'Full Name (Latin)'}</label>
                  <input type="text" value={formData.nameLatin} onChange={e => setFormData({...formData, nameLatin: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الاسم الكامل (عربي)' : 'Full Name (Arabic)'}</label>
                  <input type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500 font-cairo" dir="rtl" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'نبذة تعريفية (Bio)' : 'Bio'}</label>
                  <textarea rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>

              {/* Academic Path */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-blue-500"/> {lang === 'ar' ? 'مهارات المسار الأكاديمي' : 'Academic Path'}</h4>
                
                <div className="space-y-4 mb-6">
                  <AnimatePresence>
                    {academicPaths.map((path, idx) => (
                      <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0}} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div>
                          <p className="font-bold text-[#1e3a5f] dark:text-white">{path.degree}</p>
                          <p className="text-sm text-slate-500">
                            {formatPathDate(path.startYear, path.startMonth)} - {formatPathDate(path.endYear, path.endMonth) || (lang === 'ar' ? 'الآن' : 'Present')}
                          </p>
                        </div>
                        <button onClick={() => handleRemovePath(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'التخصص أو الشهادة' : 'Degree or Major'}</label>
                    <input type="text" value={newPath.degree} onChange={e => setNewPath({...newPath, degree: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'شهر البداية' : 'Start Month'}</label>
                        <select value={newPath.startMonth} onChange={e => setNewPath({...newPath, startMonth: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none">
                          <option value="">{lang === 'ar' ? 'الشهر' : 'Month'}</option>
                          {MONTHS.map(m => <option key={m.value} value={m.value}>{lang === 'ar' ? m.ar : m.en}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'سنة البداية' : 'Start Year'}</label>
                        <select value={newPath.startYear} onChange={e => setNewPath({...newPath, startYear: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none">
                          <option value="">{lang === 'ar' ? 'السنة' : 'Year'}</option>
                          {years.map(y => <option key={`s-${y}`} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'شهر النهاية' : 'End Month'}</label>
                        <select value={newPath.endMonth} onChange={e => setNewPath({...newPath, endMonth: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none">
                          <option value="">{lang === 'ar' ? 'الآن' : 'Present'}</option>
                          {MONTHS.map(m => <option key={m.value} value={m.value}>{lang === 'ar' ? m.ar : m.en}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'سنة النهاية' : 'End Year'}</label>
                        <select value={newPath.endYear} onChange={e => setNewPath({...newPath, endYear: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none">
                          <option value="">{lang === 'ar' ? 'الآن' : 'Present'}</option>
                          {years.map(y => <option key={`e-${y}`} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={handleAddPath} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Plus size={18} /> {lang === 'ar' ? 'إضافة مسار أكاديمي' : 'Add Academic Path'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Portfolio Data (Skills & Interests) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                <div>
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-2 flex items-center gap-2"><Briefcase size={18} className="text-purple-500"/> {lang === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h4>
                  <p className="text-xs text-slate-500 mb-4">{lang === 'ar' ? 'ابحث عن المهارة أو قم بكتابتها وإضافتها' : 'Search for a skill or type to add a new one'}</p>
                  <SearchableMultiSelect 
                    options={PREDEFINED_SKILLS} 
                    selected={skills} 
                    onChange={setSkills} 
                    placeholder={lang === 'ar' ? 'ابحث عن مهارة...' : 'Search skills...'} 
                    lang={lang}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-2 flex items-center gap-2"><Globe size={18} className="text-rose-500"/> {lang === 'ar' ? 'الاهتمامات ومجالات البحث' : 'Interests & Research Fields'}</h4>
                  <p className="text-xs text-slate-500 mb-4">{lang === 'ar' ? 'ابحث عن الاهتمامات أو قم بكتابتها وإضافتها' : 'Search for interests or type to add'}</p>
                  <SearchableMultiSelect 
                    options={PREDEFINED_INTERESTS} 
                    selected={interests} 
                    onChange={setInterests} 
                    placeholder={lang === 'ar' ? 'ابحث عن مجال بحث أو اهتمام...' : 'Search interests...'} 
                    lang={lang}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-500"/> {lang === 'ar' ? 'الروابط وحسابات التواصل' : 'Social & Portfolio Links'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Github className="text-slate-700 dark:text-slate-300" size={20} />
                    <input type="url" placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" dir="ltr"/>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="text-blue-600" size={20} />
                    <input type="url" placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" dir="ltr" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="text-blue-500" size={20} />
                    <input type="url" placeholder="Facebook URL" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" dir="ltr" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="text-pink-500" size={20} />
                    <input type="url" placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500" dir="ltr" />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end items-center gap-4">
                <AnimatePresence>
                  {saveStatus === 'success' && (
                    <motion.span initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:10}} className="text-emerald-500 font-bold flex items-center gap-2">
                      <CheckCircle size={20}/> {lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}
                    </motion.span>
                  )}
                  {saveStatus === 'error' && (
                    <motion.span initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:10}} className="text-rose-500 font-bold flex items-center gap-2">
                      <AlertCircle size={20}/> {lang === 'ar' ? 'حدث خطأ!' : 'Error saving!'}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                <button 
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'loading'}
                  className={`bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${saveStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-cyan-500/30 hover:scale-105'}`}
                >
                  {saveStatus === 'loading' 
                    ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                    : (lang === 'ar' ? 'حفظ ونشر التغييرات' : 'Save & Publish Profile')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
