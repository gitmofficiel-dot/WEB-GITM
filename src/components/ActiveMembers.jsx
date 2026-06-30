import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const ActiveMembers = () => {
  const { lang, users, setSelectedProfileId } = useLanguage();
  const navigate = useNavigate();

  // Find top members based on the number of badges they have
  // Fallback to mock data if users array is empty or lacks badges
  let topMembers = [];
  
  if (users && users.length > 0) {
    topMembers = [...users]
      .filter(u => u.badges && u.badges.length > 0)
      .sort((a, b) => b.badges.length - a.badges.length)
      .slice(0, 4);
  }

  // If no members with badges, show top 4 members or mock data
  if (topMembers.length === 0) {
    if (users && users.length >= 4) {
      topMembers = users.slice(0, 4);
    } else {
      topMembers = [
        { id: 'm1', name: 'Dr. Youssef', role: 'AI Researcher', badges: ['writer', 'speaker'], avatar: 'Y' },
        { id: 'm2', name: 'Amina', role: 'Lead Developer', badges: ['developer', 'designer'], avatar: 'A' },
        { id: 'm3', name: 'Omar', role: 'Security Expert', badges: ['political', 'developer'], avatar: 'O' },
        { id: 'm4', name: 'Sara', role: 'UI/UX Designer', badges: ['designer'], avatar: 'S' }
      ];
    }
  }

  return (
    <section className="py-16 bg-[#e0fcfc] dark:bg-[#0B132B]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-[#0B132B] dark:text-white mb-2 flex items-center gap-3">
              <Award className="text-amber-500" size={32} />
              {txt(lang, 'Most Active Members', 'الأعضاء الأكثر نشاطاً', 'Membres les plus actifs', '最活跃成员')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
          </div>
          <button 
            onClick={() => navigate('/about-us')}
            className="group px-6 py-2 rounded-full border border-teal-500/30 text-teal-600 dark:text-[#00E5FF] hover:bg-teal-50 dark:hover:bg-[#00E5FF]/10 transition-all font-semibold text-sm flex items-center gap-2"
          >
            {txt(lang, 'View All Members', 'عرض كل الأعضاء', 'Voir tous les membres', '查看所有成员')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedProfileId(member.id);
                navigate(`/profile/${member.id}`);
              }}
              className="glass-card card-3d p-6 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/50 backdrop-blur-md border border-cyan-300 dark:border-slate-700 hover-lift text-center group cursor-pointer"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                {member.photoURL ? (
                  <img src={member.photoURL} alt={member.name} className="relative w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-700" />
                ) : (
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-inner">
                    <span className="text-3xl font-bold text-slate-500 dark:text-slate-300">
                      {member.avatar || member.name?.charAt(0) || <User />}
                    </span>
                  </div>
                )}
                
                {/* Badge Count Badge */}
                {member.badges && member.badges.length > 0 && (
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white dark:border-slate-800">
                    <Star size={12} className="mr-0.5" /> {member.badges.length}
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-[#0B132B] dark:text-white mb-1 group-hover:text-amber-500 transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                {member.role || 'Member'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-1">
                {(member.badges || []).slice(0, 3).map((badge, idx) => (
                  <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider badge-${badge}`}>
                    {badge}
                  </span>
                ))}
                {member.badges && member.badges.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    +{member.badges.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveMembers;
