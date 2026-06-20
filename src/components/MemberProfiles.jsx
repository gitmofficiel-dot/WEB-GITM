import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Shield, Code, PenTool, Scale, Building2, Megaphone, Palette, Search, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const BADGE_INFO = {
  writer: { icon: PenTool, label: 'Writer', class: 'badge-writer', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  legal: { icon: Scale, label: 'Legal Advisor', class: 'badge-legal', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  political: { icon: Building2, label: 'Political', class: 'badge-political', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' },
  speaker: { icon: Megaphone, label: 'Speaker', class: 'badge-speaker', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  developer: { icon: Code, label: 'Developer', class: 'badge-developer', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
  designer: { icon: Palette, label: 'Designer', class: 'badge-designer', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
  admin: { icon: Shield, label: 'Admin', class: 'badge-admin', color: 'bg-slate-800 text-white dark:bg-cyan-200 dark:text-[#0B132B]' }
};

const MOCK_MEMBERS = [
  {
    id: 1,
    name: 'Dr. Youssef Alaoui',
    role: { en: 'President & Founder', ar: 'الرئيس والمؤسس' },
    email: 'youssef@gitm.ma',
    bio: { en: 'Visionary leader bridging the gap between Moroccan tech talent and global opportunities.', ar: 'قائد ذو رؤية يسد الفجوة بين المواهب التقنية المغربية والفرص العالمية.' },
    skills: ['Leadership', 'AI/ML', 'Strategy'],
    badges: ['admin', 'speaker', 'political'],
    social: { github: '#', linkedin: '#', twitter: '#' }
  },
  {
    id: 2,
    name: 'Amina Bennis',
    role: { en: 'Lead Developer', ar: 'المطور الرئيسي' },
    email: 'amina@gitm.ma',
    bio: { en: 'Full-stack architect with a passion for scalable decentralized systems.', ar: 'مهندسة برمجيات شغوفة بالأنظمة اللامركزية القابلة للتوسع.' },
    skills: ['React', 'Node.js', 'Solidity', 'AWS'],
    badges: ['developer', 'speaker'],
    social: { github: '#', linkedin: '#' }
  },
  {
    id: 3,
    name: 'Karim Tazi',
    role: { en: 'Legal Counsel', ar: 'مستشار قانوني' },
    email: 'karim@gitm.ma',
    bio: { en: 'Expert in tech policy, data privacy, and intellectual property in the MENA region.', ar: 'خبير في سياسة التكنولوجيا وخصوصية البيانات والملكية الفكرية في منطقة الشرق الأوسط وشمال أفريقيا.' },
    skills: ['Tech Law', 'GDPR', 'IP Rights'],
    badges: ['legal', 'writer'],
    social: { linkedin: '#', twitter: '#' }
  },
  {
    id: 4,
    name: 'Sara Idrissi',
    role: { en: 'UX/UI Director', ar: 'مديرة تجربة المستخدم' },
    email: 'sara@gitm.ma',
    bio: { en: 'Crafting digital experiences that are inclusive, beautiful, and hyper-functional.', ar: 'صياغة تجارب رقمية شاملة وجميلة وعالية الوظائف.' },
    skills: ['Figma', 'User Research', 'Framer'],
    badges: ['designer', 'writer'],
    social: { github: '#', linkedin: '#' }
  },
  {
    id: 5,
    name: 'Omar Chraibi',
    role: { en: 'Community Manager', ar: 'مدير المجتمع' },
    email: 'omar@gitm.ma',
    bio: { en: 'Connecting people, organizing events, and keeping the GITM spirit alive.', ar: 'ربط الناس وتنظيم الأحداث وإبقاء روح المجموعة حية.' },
    skills: ['Public Relations', 'Event Mgmt', 'Social Media'],
    badges: ['speaker', 'political'],
    social: { linkedin: '#', twitter: '#' }
  },
  {
    id: 6,
    name: 'Hassan Mansour',
    role: { en: 'Senior DevOps', ar: 'مهندس عمليات التطوير' },
    email: 'hassan@gitm.ma',
    bio: { en: 'Automating everything. Ensuring our infrastructure is robust and highly available.', ar: 'أتمتة كل شيء. ضمان بنية تحتية قوية ومتاحة للغاية.' },
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Go'],
    badges: ['developer'],
    social: { github: '#' }
  },
  {
    id: 7,
    name: 'Nadia Fassi',
    role: { en: 'Tech Journalist', ar: 'صحفية تقنية' },
    email: 'nadia@gitm.ma',
    bio: { en: 'Documenting the rise of the Moroccan tech ecosystem one article at a time.', ar: 'توثيق صعود النظام البيئي التقني المغربي مقالاً تلو الآخر.' },
    skills: ['Copywriting', 'SEO', 'Tech Analysis'],
    badges: ['writer', 'speaker'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 8,
    name: 'Tarik Benali',
    role: { en: 'Blockchain Researcher', ar: 'باحث بلوكتشين' },
    email: 'tarik@gitm.ma',
    bio: { en: 'Exploring zero-knowledge proofs and their applications in secure voting.', ar: 'استكشاف براهين المعرفة الصفرية وتطبيقاتها في التصويت الآمن.' },
    skills: ['Cryptography', 'Rust', 'ZKP'],
    badges: ['developer', 'writer'],
    social: { github: '#', twitter: '#' }
  }
];

export default function MemberProfiles() {
  const { lang, user, setView, setSelectedProfileId } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterBadge, setFilterBadge] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});

  const isAdmin = user?.role === 'president'; // Example admin check

  const filteredMembers = MOCK_MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchBadge = filterBadge === 'all' || m.badges.includes(filterBadge);
    return matchSearch && matchBadge;
  });

  const toggleFlip = (id, e) => {
    // prevent flip if clicking on links or buttons inside
    if (e.target.closest('a') || e.target.closest('button')) return;
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'GITM Members', 'أعضاء المجموعة', 'Membres du GITM', 'GITM成员')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Meet the talented individuals driving innovation and shaping the future.', 'تعرف على الأفراد الموهوبين الذين يقودون الابتكار.', 'Rencontrez les personnes talentueuses.', '认识推动创新和塑造未来的才华横溢的人们。')}
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-[#e0fcfc]/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={txt(lang, 'Search members...', 'ابحث عن الأعضاء...', 'Rechercher...', '搜索成员...')}
              className="w-full bg-[#e0fcfc]/80 dark:bg-slate-800/80 py-3 px-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 border border-cyan-300 dark:border-slate-700"
            />
            <Search className={`absolute top-3.5 ${lang === 'ar' ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={20} className="text-slate-500 mr-2" />
            <button
              onClick={() => setFilterBadge('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterBadge === 'all' ? 'bg-teal-600 text-white' : 'bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-700'}`}
            >
              {txt(lang, 'All', 'الكل', 'Tous', '所有')}
            </button>
            {Object.entries(BADGE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setFilterBadge(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${filterBadge === key ? 'ring-2 ring-teal-500 ' + info.color : 'bg-cyan-100 dark:bg-slate-800/50 hover:bg-cyan-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100'}`}
              >
                <info.icon size={14} /> <span className="hidden sm:inline">{info.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid - 3D Flip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 perspective-1000">
          <AnimatePresence>
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative h-96 w-full cursor-pointer group"
                onClick={(e) => toggleFlip(member.id, e)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d duration-700"
                  animate={{ rotateY: flippedCards[member.id] ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* FRONT OF CARD */}
                  <div className="absolute inset-0 w-full h-full backface-hidden glass-card rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border-t-4 border-t-teal-500 shadow-xl hover:shadow-[0_0_30px_rgba(13,148,136,0.3)] dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-shadow">
                    
                    {isAdmin && (
                      <button className="absolute top-3 right-3 text-slate-400 hover:text-teal-500 transition-colors p-1" title="Manage Badges">
                        <Shield size={18} />
                      </button>
                    )}

                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-1 mb-4">
                      <div className="w-full h-full rounded-full bg-[#e0fcfc] dark:bg-slate-900 flex items-center justify-center text-3xl font-orbitron font-bold text-teal-600 dark:text-cyan-400">
                        {member.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold font-orbitron text-center mb-1">{member.name}</h3>
                    <p className="text-teal-600 dark:text-cyan-400 font-medium text-sm text-center mb-4">
                      {member.role[lang] || member.role.en}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-auto">
                      {member.badges.slice(0,3).map(b => {
                        const BadgeIcon = BADGE_INFO[b].icon;
                        return (
                          <div key={b} className={`w-8 h-8 rounded-full flex items-center justify-center ${BADGE_INFO[b].color}`} title={BADGE_INFO[b].label}>
                            <BadgeIcon size={16} />
                          </div>
                        );
                      })}
                      {member.badges.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                          +{member.badges.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute bottom-3 text-xs text-slate-400 animate-pulse">
                      {txt(lang, 'Click to flip', 'انقر للقلب', 'Cliquez pour retourner', '点击翻转')}
                    </div>
                  </div>

                  {/* BACK OF CARD */}
                  <div 
                    className="absolute inset-0 w-full h-full backface-hidden glass-card rounded-2xl overflow-hidden p-6 flex flex-col shadow-xl border-t-4 border-t-blue-500"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center gap-3 mb-4 border-b border-cyan-300 dark:border-slate-700 pb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold font-orbitron leading-tight">{member.name}</h3>
                        <a href={`mailto:${member.email}`} className="text-xs text-slate-500 hover:text-teal-500 flex items-center gap-1">
                          <Mail size={10} /> {member.email}
                        </a>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-4 flex-grow">
                      {member.bio[lang] || member.bio.en}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">{txt(lang, 'Skills', 'المهارات', 'Compétences', '技能')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map(s => (
                          <span key={s} className="px-2 py-1 text-[10px] font-bold rounded bg-cyan-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-auto pt-4 border-t border-cyan-300 dark:border-slate-700">
                      {member.social.github && (
                        <a href={member.social.github} className="text-slate-400 hover:text-[#1e3a5f] dark:hover:text-white transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-slate-400 hover:text-blue-600 transition-colors">
                          <Linkedin size={20} />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-slate-400 hover:text-sky-500 transition-colors">
                          <Twitter size={20} />
                        </a>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => { setSelectedProfileId(member.id); setView('profile'); }}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 hover:from-teal-500 hover:to-blue-500 border border-teal-500/30 hover:border-transparent text-teal-600 dark:text-cyan-400 hover:text-white rounded-xl text-sm font-bold transition-all duration-300"
                    >
                      {txt(lang, 'View Full Profile', 'عرض السيرة الذاتية', 'Voir le profil complet', '查看完整个人资料')}
                    </button>
                  </div>

                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
