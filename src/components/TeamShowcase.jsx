import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Github, Linkedin, Twitter, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberAvatar = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 text-slate-600 dark:text-slate-300">
        <User size={40} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
};

export default function TeamShowcase() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'users'), where('isTeamMember', '==', true));
        const snap = await getDocs(q);
        const members = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            nameEn: data.name || data.firstName || 'Unknown',
            nameAr: data.name || data.firstName || 'مجهول',
            roleEn: data.role || 'Member',
            roleAr: data.role || 'عضو',
            type: data.role === 'president' || data.role === 'supervisor' ? 'founder'
              : data.role === 'teacher' ? 'professor'
                : 'member',
            image: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'GITM')}&background=random`,
            bioEn: data.bio || 'GITM Team Member',
            bioAr: data.bio || 'عضو في فريق GITM',
            socials: data.socials || {}
          };
        });
        setTeamMembers(members);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'founder', labelAr: 'القيادة', labelEn: 'Leadership' },
    { id: 'professor', labelAr: 'الأساتذة', labelEn: 'Professors' },
    { id: 'teacher', labelAr: 'المعلمين', labelEn: 'Teachers' },
    { id: 'member', labelAr: 'الأعضاء', labelEn: 'Members' },
  ];

  const filteredTeam = activeFilter === 'all'
    ? teamMembers
    : teamMembers.filter(member => member.type === activeFilter);

  return (
    <div className="w-full">
      {/* Scrollable Filter Chips on Mobile (>=44px touch targets), Centered on Desktop */}
      <div className="filter-scroll md:flex-wrap md:justify-center pb-2 mb-6 md:mb-12">
        {filters.map(filter => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`min-h-[44px] px-5 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-gitm-red text-white border-gitm-red shadow-lg shadow-gitm-red/20'
                : 'bg-white dark:bg-gitm-cardDark text-slate-700 dark:text-slate-200 border-gray-200 dark:border-gitm-borderDark hover:border-gitm-red hover:text-gitm-red'
            }`}
          >
            {lang === 'ar' ? filter.labelAr : filter.labelEn}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 animate-pulse">
              <div className="aspect-square sm:aspect-[4/3] bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence>
            {filteredTeam.map((member) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={member.id}
                onClick={() => navigate(`/profile/${member.id}`)}
                className="tilt-card group overflow-hidden flex flex-col shadow-soft cursor-pointer hover:shadow-2xl transition-shadow max-w-[400px] mx-auto w-full sm:max-w-none"
              >
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                  <MemberAvatar src={member.image} alt={member.nameEn} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div
                    className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {member.socials?.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-gitm-red flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-lg">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {member.socials?.github && (
                      <a href={member.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg">
                        <Github size={18} />
                      </a>
                    )}
                    {member.socials?.twitter && (
                      <a href={member.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-gitm-green flex items-center justify-center text-white hover:bg-green-700 transition-colors shadow-lg">
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-4 md:p-8 flex-1 flex flex-col bg-white dark:bg-gitm-cardDark border-t-2 md:border-t-4 border-gitm-red">
                  <h3 className="break-words text-base md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 text-gitm-textLight dark:text-white group-hover:text-gitm-red transition-colors leading-snug">
                    {lang === 'ar' ? member.nameAr : member.nameEn}
                  </h3>
                  <p className="text-xs md:text-base lg:text-lg text-gitm-green font-bold mb-2 md:mb-5">
                    {lang === 'ar' ? member.roleAr : member.roleEn}
                  </p>
                  <p className="text-xs md:text-base text-slate-700 dark:text-slate-300 line-clamp-2 md:line-clamp-3 leading-relaxed border-t border-gray-100 dark:border-gitm-borderDark pt-2 md:pt-5">
                    {lang === 'ar' ? member.bioAr : member.bioEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
