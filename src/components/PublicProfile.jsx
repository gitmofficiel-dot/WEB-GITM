import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Briefcase, GraduationCap, Github, Linkedin, Twitter, ExternalLink, 
  MapPin, Mail, Calendar, Code, Zap, Award, BookOpen, Heart, Activity,
  ChevronLeft, Share2, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { teamData } from '../data/teamData';

export default function PublicProfile() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const member = teamData.find(m => m.id.toString() === id);

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-cyan-50 dark:bg-[#0B132B]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{lang === 'ar' ? 'الملف الشخصي غير موجود' : 'Profile not found'}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary px-6 py-2 rounded-full flex items-center gap-2">
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} /> {lang === 'ar' ? 'العودة' : 'Go Back'}
        </button>
      </div>
    );
  }

  const profile = {
    name: lang === 'ar' ? member.nameAr : member.nameEn,
    title: lang === 'ar' ? member.roleAr : member.roleEn,
    email: member.email || 'contact@gitm.ma',
    location: lang === 'ar' ? 'المغرب' : 'Morocco',
    bio: lang === 'ar' ? member.bioAr : member.bioEn,
    avatar: member.image,
    badges: ['leadership', 'ai_visionary'],
    stats: {
      projects: Math.floor(Math.random() * 20) + 5,
      certifications: Math.floor(Math.random() * 10) + 2,
      volunteerHours: Math.floor(Math.random() * 200) + 50
    },
    social: member.socials || {},
    skills: ['Python', 'TensorFlow', 'React', 'Robotics', 'Embedded Systems', 'Leadership', 'System Architecture'],
    interests: ['AI Ethics', 'Quantum Computing', 'Green Tech', 'Space Exploration'],
    academicPath: [
      { year: '2023 - Present', title: lang === 'ar' ? 'دراسات عليا' : 'Postgraduate Studies', institution: 'University' },
      { year: '2019 - 2023', title: lang === 'ar' ? 'إجازة' : 'Bachelor Degree', institution: 'University' }
    ],
    projects: [
      { name: 'Smart System', role: 'Lead', type: 'IoT & AI' },
      { name: 'Platform', role: 'Developer', type: 'Web App' }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container-custom py-24 min-h-screen relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-2 flex items-center text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors w-fit">
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>

        {/* Header Section */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden border-t-4 border-cyan-500">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-tr from-cyan-400 to-blue-600 p-1 shadow-2xl">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
              </div>
              <div className="absolute -bottom-3 -right-3 rtl:left-[-12px] rtl:right-auto bg-emerald-500 text-white p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                <Award size={20} />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white mb-2">{profile.name}</h1>
                  <h2 className="text-xl text-cyan-600 dark:text-cyan-400 font-semibold mb-4">{profile.title}</h2>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <span className="flex items-center gap-1"><MapPin size={16}/> {profile.location}</span>
                    <span className="flex items-center gap-1"><Mail size={16}/> {profile.email}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {profile.social.github && profile.social.github !== '#' && <a href={profile.social.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Github size={20}/></a>}
                  {profile.social.linkedin && profile.social.linkedin !== '#' && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"><Linkedin size={20}/></a>}
                  {profile.social.twitter && profile.social.twitter !== '#' && <a href={profile.social.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"><Twitter size={20}/></a>}
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 ml-auto rtl:ml-0 rtl:mr-auto bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-cyan-500/30"
                  >
                    {copied ? <Check size={18} /> : <Share2 size={18} />}
                    {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'مشاركة الملف' : 'Share Profile')}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.badges.map(b => (
                  <span key={b} className={`badge badge-${b} px-3 py-1 text-xs uppercase tracking-wider font-bold`}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><Code size={24}/></div>
            <div>
              <p className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{profile.stats.projects}</p>
              <p className="text-sm font-semibold text-slate-500 uppercase">{lang === 'ar' ? 'مشاريع مكتملة' : 'Projects Done'}</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Award size={24}/></div>
            <div>
              <p className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{profile.stats.certifications}</p>
              <p className="text-sm font-semibold text-slate-500 uppercase">{lang === 'ar' ? 'شهادات معتمدة' : 'Certifications'}</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400"><Heart size={24}/></div>
            <div>
              <p className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{profile.stats.volunteerHours}h</p>
              <p className="text-sm font-semibold text-slate-500 uppercase">{lang === 'ar' ? 'ساعات تطوع' : 'Volunteer Hours'}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><BookOpen className="text-cyan-500"/> {lang === 'ar' ? 'نبذة تعريفية' : 'About Me'}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2"><GraduationCap className="text-blue-500"/> {lang === 'ar' ? 'المسار الأكاديمي' : 'Academic Path'}</h3>
              <div className="space-y-6">
                {profile.academicPath.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100 dark:border-blue-900"></div>
                      {idx !== profile.academicPath.length - 1 && <div className="w-0.5 h-full bg-blue-100 dark:bg-slate-800 my-1"></div>}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-bold text-blue-500 mb-1">{edu.year}</p>
                      <h4 className="text-lg font-bold text-[#1e3a5f] dark:text-white">{edu.title}</h4>
                      <p className="text-slate-500">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2"><Briefcase className="text-purple-500"/> {lang === 'ar' ? 'المشاريع البارزة' : 'Featured Projects'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-50/ dark:bg-slate-800/ transition-colors">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-1">{proj.name}</h4>
                    <p className="text-sm text-slate-500 mb-3">{proj.role}</p>
                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg uppercase">{proj.type}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2"><Zap className="text-amber-500"/> {lang === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2"><Activity className="text-rose-500"/> {lang === 'ar' ? 'الاهتمامات' : 'Interests'}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-semibold border border-rose-100 dark:border-rose-900/50">
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
