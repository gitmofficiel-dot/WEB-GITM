import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Briefcase, GraduationCap, Github, Linkedin, Twitter, ExternalLink, 
  MapPin, Mail, Calendar, Code, Zap, Award, BookOpen, Heart, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicProfile() {
  const { id } = useParams();
  const { lang } = useLanguage();

  // Mock data for the specific user ID
  // In a real app, you would fetch this using the `id` from the backend
  const profile = {
    id: id || 'GITM-PRE-001',
    name: 'M. President',
    title: lang === 'ar' ? 'الرئيس والمؤسس' : 'President & Founder',
    email: 'president@gitm.ma',
    location: lang === 'ar' ? 'الدار البيضاء، المغرب' : 'Casablanca, Morocco',
    bio: lang === 'ar' 
      ? 'مهندس ذكاء اصطناعي شغوف بتطوير الأنظمة المعقدة. مؤسس GITM ومهتم بنقل التكنولوجيا وبناء قدرات الشباب المغربي في مجالات البرمجة والروبوتيك.' 
      : 'AI Engineer passionate about developing complex systems. Founder of GITM, dedicated to technology transfer and capacity building for Moroccan youth in programming and robotics.',
    avatar: 'M',
    badges: ['leadership', 'ai_visionary', 'legal'],
    stats: {
      projects: 15,
      certifications: 8,
      volunteerHours: 320
    },
    social: {
      github: 'https://github.com/gitmofficiel-dot',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    skills: ['Python', 'TensorFlow', 'React', 'Robotics', 'Embedded Systems', 'Leadership', 'System Architecture'],
    interests: ['AI Ethics', 'Quantum Computing', 'Green Tech', 'Space Exploration'],
    academicPath: [
      { year: '2023 - Present', title: lang === 'ar' ? 'ماجستير في الذكاء الاصطناعي' : 'Master in AI', institution: 'UM5 Rabat' },
      { year: '2019 - 2023', title: lang === 'ar' ? 'إجازة في علوم الحاسوب' : 'Bachelor in Computer Science', institution: 'FST Settat' }
    ],
    projects: [
      { name: 'Smart Irrigation System', role: 'Lead Architect', type: 'IoT & AI' },
      { name: 'GITM LMS Platform', role: 'Fullstack Dev', type: 'Web App' }
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
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden border-t-4 border-cyan-500">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-1 shadow-2xl">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-5xl font-bold text-[#1e3a5f] dark:text-white">
                  {profile.avatar}
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
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
                
                <div className="flex gap-2">
                  {profile.social.github && <a href={profile.social.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Github size={20}/></a>}
                  {profile.social.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"><Linkedin size={20}/></a>}
                  {profile.social.twitter && <a href={profile.social.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"><Twitter size={20}/></a>}
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
