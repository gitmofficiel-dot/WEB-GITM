import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, Loader2, Users, Rocket, Activity, Library, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function About() {
  const { lang } = useLanguage();
  const [aboutData, setAboutData] = useState(null);
  const [teamMembers, setTeamMembers] = useState({ official: [], internal: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          setAboutData({
            vision_ar: 'الريادة في تطوير الذكاء الاصطناعي المغربي وتصديره للعالم، وبناء جسور متينة للإبداع التكنولوجي المبتكر والأكاديمي المتألق.',
            vision_en: 'Leading the development of Moroccan AI and exporting it globally, building strong bridges for innovative tech creativity and academic brilliance.',
            mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية، وتمكينهم من بناء أنظمة ذكية تحل مشاكل واقعية بدعم من المؤسسات الوطنية.',
            mission_en: 'Providing an advanced research environment for Moroccan talents to build smart systems with national support.',
            history_ar: 'تأسست GITM في عام 2026 لتوحيد جهود المهندسين المغاربة. قمنا بتأسيس نادي الألعاب وعقدنا شراكات مع المركز الجهوي للاستثمار.',
            history_en: 'Founded in 2026, GITM unites Moroccan engineers. We established the Gaming Club and partnered with CRI.',
            stats: { founded: '2026', projects: '15+', members: '500+' }
          });
        }

        // Fetch team members
        const q = query(collection(db, 'users'), where('isTeamMember', '==', true));
        const usersSnap = await getDocs(q);
        const official = [];
        const internal = [];
        
        usersSnap.forEach(docSnap => {
          const data = docSnap.data();
          const member = {
            id: docSnap.id,
            name: data.name || data.firstName || 'Unknown',
            name_ar: data.name || data.firstName || 'مجهول',
            role: data.role || 'member',
            role_ar: data.role || 'عضو',
            projectsCount: Math.floor(Math.random() * 15) + 1, // Simulated projects count
            image: data.photoURL || `https://ui-avatars.com/api/?name=${data.name || 'GITM'}&background=random`
          };
          
          if (['president', 'supervisor', 'teacher', 'partner', 'university'].includes(member.role)) {
            official.push(member);
          } else {
            internal.push(member);
          }
        });

        // Add defaults if none found from DB
        if (official.length === 0 && internal.length === 0) {
          official.push(
            { id: 1, name: 'Dr. Yassine', name_ar: 'د. ياسين', role: 'President & Founder', role_ar: 'الرئيس والمؤسس', projectsCount: 12, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
            { id: 2, name: 'Eng. Fatima', name_ar: 'م. فاطمة', role: 'Head of Robotics', role_ar: 'رئيسة قسم الروبوتات', projectsCount: 8, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }
          );
          internal.push(
            { id: 4, name: 'Karim', name_ar: 'كريم', role: 'AI Researcher', role_ar: 'باحث في الذكاء الاصطناعي', projectsCount: 15, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
            { id: 5, name: 'Sara', name_ar: 'سارة', role: 'UI/UX Lead', role_ar: 'قائدة تصميم الواجهات', projectsCount: 10, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
          );
        }

        setTeamMembers({ official, internal });

      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gitm-light dark:bg-gitm-dark">
        <Loader2 className="w-10 h-10 animate-spin text-gitm-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gitm-light dark:bg-gitm-dark pt-32 pb-24 relative overflow-hidden">
      
      {/* Math & Tech Overlay */}
      <div className="absolute inset-0 bg-math-overlay opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gitm-red/10 text-gitm-red font-bold text-sm mb-6 border border-gitm-red/20">
            {lang === 'ar' ? 'منظمة وطنية ذات رؤية عالمية' : 'National Organization, Global Vision'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gitm-textLight dark:text-white mb-8">
            {lang === 'ar' ? 'نصنع التكنولوجيا من المغرب إلى العالم' : 'Building Tech from Morocco to the World'}
          </h1>
          <p className="text-xl md:text-2xl text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
            {lang === 'ar' 
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول الرقمي بالتعاون مع كبرى المؤسسات وتفتح آفاقاً للشباب المغربي للتألق في الجامعات العالمية.' 
              : 'The Moroccan Group for Technological Innovation (GITM) leads digital transformation and opens horizons for Moroccan youth globally.'}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="tilt-card p-8 group border-t-4 border-gitm-red bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gitm-red/10 flex items-center justify-center text-gitm-red mb-6 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الرؤية العالمية' : 'Global Vision'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="tilt-card p-8 group border-t-4 border-gitm-green bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gitm-green/10 flex items-center justify-center text-gitm-green mb-6 group-hover:scale-110 transition-transform">
              <Flag size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الرسالة الوطنية' : 'National Mission'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="tilt-card p-8 group border-t-4 border-black dark:border-white bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gitm-textLight dark:text-white mb-6 group-hover:scale-110 transition-transform">
              <Library size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'الأكاديميات الشريكة' : 'Partner Academies'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.history_ar : aboutData?.history_en}
            </p>
          </motion.div>
        </div>

        {/* Impact Stats */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="tilt-card bg-[#111] border border-gitm-borderDark p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle gradient inside */}
          <div className="absolute inset-0 bg-gradient-to-r from-gitm-red/20 via-transparent to-gitm-green/20 pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 relative z-10">{lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gitm-red/20 rounded-full mb-6">
                <Rocket size={48} className="text-gitm-red" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.founded || '2026'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'الانطلاقة' : 'Launch'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <Activity size={48} className="text-white" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'مشروع ابتكاري' : 'Projects'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gitm-green/20 rounded-full mb-6">
                <Users size={48} className="text-gitm-green" />
              </div>
              <span className="text-6xl font-bold text-white mb-4">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-xl text-gray-400 font-bold">{lang === 'ar' ? 'عضو أكاديمي' : 'Academic Members'}</span>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gitm-textLight dark:text-white mb-6">
              {lang === 'ar' ? 'فريقنا المتميز' : 'Our Exceptional Team'}
            </h2>
            <p className="text-xl text-gitm-mutedLight dark:text-gitm-mutedDark max-w-2xl mx-auto">
              {lang === 'ar' ? 'نخبة من المهندسين والباحثين الذين يقودون رؤية GITM إلى أرض الواقع.' : 'An elite group of engineers and researchers turning GITM vision into reality.'}
            </p>
          </motion.div>

          {/* Official Team */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
              {lang === 'ar' ? 'أعضاء الفريق الرسميين' : 'Official Team Members'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.official.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gitm-cardDark rounded-2xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gitm-textLight dark:text-white mb-1">{lang === 'ar' ? member.name_ar : member.name}</h4>
                    <p className="text-gitm-red font-medium text-sm mb-4">{lang === 'ar' ? member.role_ar : member.role}</p>
                    <div className="flex items-center gap-2 text-sm text-gitm-mutedLight dark:text-gitm-mutedDark bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                      <Activity size={16} className="text-gitm-green" />
                      <span className="font-bold">{member.projectsCount}</span>
                      <span>{lang === 'ar' ? 'مشاريع شارك فيها' : 'Projects Participated'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Internal Team */}
          <div>
            <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
              {lang === 'ar' ? 'أعضاء الفريق الداخلي' : 'Internal Team'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.internal.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gitm-cardDark rounded-2xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gitm-textLight dark:text-white mb-1">{lang === 'ar' ? member.name_ar : member.name}</h4>
                    <p className="text-gitm-green font-medium text-sm mb-4">{lang === 'ar' ? member.role_ar : member.role}</p>
                    <div className="flex items-center gap-2 text-sm text-gitm-mutedLight dark:text-gitm-mutedDark bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                      <Activity size={16} className="text-gitm-red" />
                      <span className="font-bold">{member.projectsCount}</span>
                      <span>{lang === 'ar' ? 'مشاريع شارك فيها' : 'Projects Participated'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
