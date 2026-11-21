import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, Users, Rocket, Activity, Library, Github, Linkedin, Globe, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import SEO from './SEO';

const MemberCardImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="aspect-square md:aspect-[4/5] overflow-hidden relative bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
          <User size={40} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

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
            vision_ar: 'ريادة تطوير الذكاء الاصطناعي المغربي وتصديره عالميا، وبناء جسور متينة للإبداع التقني المبتكر والتفوق الأكاديمي.',
            vision_en: 'Leading the development of Moroccan AI and exporting it globally, building strong bridges for innovative tech creativity and academic brilliance.',
            mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية لبناء أنظمة ذكية بدعم وطني.',
            mission_en: 'Providing an advanced research environment for Moroccan talents to build smart systems with national support.',
            history_ar: 'تأسست GITM لتوحيد المبدعين والمبتكرين المغاربة. نسعى لتوفير بيئة تكنولوجية متكاملة تفتح آفاقاً جديدة للشباب المغربي.',
            history_en: 'GITM was founded to unite Moroccan creators and innovators. We strive to provide an integrated technological environment that opens new horizons for Moroccan youth.',
            stats: { founded: '2026', projects: '3', members: '45' }
          });
        }

        const q = query(collection(db, 'users'), where('isTeamMember', '==', true));
        const usersSnap = await getDocs(q);
        const official = [];
        const internal = [];

        usersSnap.forEach(docSnap => {
          const data = docSnap.data();
          const member = {
            id: docSnap.id,
            name: data.nameLatin || data.name || data.firstName || 'Unknown',
            name_ar: data.nameAr || data.name || data.firstName || 'مجهول',
            role: data.role || 'member',
            role_ar: data.roleAr || data.role || 'عضو',
            projectsCount: Math.floor(Math.random() * 15) + 1,
            image: data.imageUrl || data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'GITM')}&background=random`,
            socialLinks: data.socialLinks || {}
          };

          if (['president', 'supervisor', 'teacher', 'partner', 'university'].includes(member.role)) {
            official.push(member);
          } else {
            internal.push(member);
          }
        });

        if (official.length === 0 && internal.length === 0) {
          official.push(
            { id: 1, name: 'Dr. Yassine', name_ar: 'د. ياسين', role: 'President & Founder', role_ar: 'الرئيس والمؤسس', projectsCount: 12, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', socialLinks: { linkedin: '#', github: '#' } },
            { id: 2, name: 'Eng. Fatima', name_ar: 'م. فاطمة', role: 'Head of Robotics', role_ar: 'رئيسة قسم الروبوتات', projectsCount: 8, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', socialLinks: { linkedin: '#' } }
          );
          internal.push(
            { id: 4, name: 'Karim', name_ar: 'كريم', role: 'AI Researcher', role_ar: 'باحث في الذكاء الاصطناعي', projectsCount: 15, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', socialLinks: { github: '#' } },
            { id: 5, name: 'Sara', name_ar: 'سارة', role: 'UI/UX Lead', role_ar: 'قائدة تصميم الواجهات', projectsCount: 10, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', socialLinks: {} }
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
      <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 bg-gitm-light dark:bg-gitm-dark">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
          <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-52 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مجموعة الابتكار التكنولوجي بالمغرب",
    "alternateName": "Groupe Innovation Technologique Maroc (GITM)",
    "url": "https://gitm.pages.dev",
    "logo": "https://gitm.pages.dev/logo.png",
    "founder": {
      "@type": "Person",
      "name": "محمد غزاوني",
      "alternateName": "MOHAMMED RHZAOUNI",
      "birthPlace": {
        "@type": "Place",
        "name": "وادي زم، المغرب"
      },
      "jobTitle": "مؤسس المجموعة والمشرف العام",
      "description": "أسس في يونيو 2026 مجموعة الابتكار التكنولوجي بالمغرب GITM لقيادة مبادرات الروبوتات والذكاء الاصطناعي. مطور مشروع نبض إكس NABD-X لمدن الذكية، ومبتكر الروبوت المجنزر علي Ali. مهتم بالأنظمة المدمجة، وبروتوكولات تشخيص السيارات، التصوير، الديكور، والزراعة العضوية، بالإضافة للعمل التطوعي.",
      "knowsAbout": [
        "Robotics",
        "Artificial Intelligence",
        "Python",
        "C++",
        "JavaScript",
        "Node.js",
        "Embedded Systems",
        "IoT",
        "Smart Cities",
        "Automotive Diagnostic Protocols",
        "Nature Photography",
        "Ambient Lighting Design",
        "Organic Farming"
      ],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "Software Engineer Certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "HackerRank"
        }
      }
    }
  };

  if (teamMembers.official.length > 0 || teamMembers.internal.length > 0) {
    const allMembers = [...teamMembers.official, ...teamMembers.internal];
    schemaMarkup.employee = allMembers.map(member => {
      const socialLinks = [];
      if (member.socialLinks?.linkedin) socialLinks.push(member.socialLinks.linkedin);
      if (member.socialLinks?.github) socialLinks.push(member.socialLinks.github);
      if (member.socialLinks?.facebook) socialLinks.push(member.socialLinks.facebook);

      return {
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "image": member.image,
        "sameAs": socialLinks
      };
    });
  }

  const pageTitle = lang === 'ar' ? 'من نحن | محمد غزاوني - مؤسس GITM' : 'About Us | MOHAMMED RHZAOUNI - GITM Founder';
  const pageDesc = lang === 'ar' ? 'نحن منصة تكنولوجية مغربية رائدة. محمد غزاوني - MOHAMMED RHZAOUNI هو مؤسس مجموعة الابتكار التكنولوجي بالمغرب GITM.' : 'We are a leading Moroccan tech initiative. MOHAMMED RHZAOUNI is the founder of GITM.';

  const renderMemberCard = (member, i) => (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className="bg-white dark:bg-gitm-cardDark rounded-2xl overflow-hidden shadow-soft border border-slate-200 dark:border-slate-800 group hover:-translate-y-1 transition-transform duration-300 flex flex-col"
    >
      <MemberCardImage src={member.image} alt={member.name} />
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <h4 className="text-base md:text-xl font-bold text-slate-900 dark:text-white mb-1 leading-snug break-words">
          {lang === 'ar' ? member.name_ar : member.name}
        </h4>
        <p className="text-gitm-red font-semibold text-xs md:text-sm mb-3 break-words">
          {lang === 'ar' ? member.role_ar : member.role}
        </p>
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 px-3 py-2 rounded-xl justify-center md:justify-start mb-3 mt-auto">
          <Activity size={14} className="text-gitm-green shrink-0" />
          <span className="font-bold">{member.projectsCount}</span>
          <span>{lang === 'ar' ? 'مشاريع' : 'Projects'}</span>
        </div>
        {member.socialLinks && (member.socialLinks.linkedin || member.socialLinks.github || member.socialLinks.facebook) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} GitHub`}
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github size={18} />
              </a>
            )}
            {member.socialLinks.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} Facebook`}
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"
              >
                <Globe size={18} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gitm-light dark:bg-gitm-dark pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <SEO title={pageTitle} description={pageDesc} schema={schemaMarkup} />
      <div className="absolute inset-0 bg-math-overlay opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-start md:text-center max-w-5xl mx-auto mb-8 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gitm-red/10 text-gitm-red font-bold text-xs sm:text-sm mb-4 md:mb-6 border border-gitm-red/20">
            {lang === 'ar' ? 'منظمة وطنية ذات رؤية عالمية' : 'National Organization, Global Vision'}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 md:mb-8 leading-tight">
            {lang === 'ar' ? 'نصنع التكنولوجيا من المغرب إلى العالم' : 'Building Tech from Morocco to the World'}
          </h1>
          <p className="text-sm sm:text-base md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تساهم في التحول الرقمي وتفتح آفاقاً للشباب المغربي لتطوير مهاراتهم التقنية.'
              : 'The Moroccan Group for Technological Innovation (GITM) contributes to digital transformation and opens horizons for Moroccan youth to develop their tech skills.'}
          </p>
        </motion.div>

        {/* Vision, Mission, Journey Cards (High Contrast in Light & Dark) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl md:rounded-3xl p-5 md:p-8 group border border-slate-200 dark:border-slate-800 border-t-4 border-t-gitm-red bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gitm-red/10 flex items-center justify-center text-gitm-red mb-4 md:mb-6 group-hover:scale-105 transition-transform">
              <Target size={26} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 md:mb-4">
              {lang === 'ar' ? 'الرؤية العالمية' : 'Global Vision'}
            </h2>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.vision_ar : aboutData?.vision_en}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl md:rounded-3xl p-5 md:p-8 group border border-slate-200 dark:border-slate-800 border-t-4 border-t-gitm-green bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gitm-green/10 flex items-center justify-center text-gitm-green mb-4 md:mb-6 group-hover:scale-105 transition-transform">
              <Flag size={26} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 md:mb-4">
              {lang === 'ar' ? 'الرسالة الوطنية' : 'National Mission'}
            </h2>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'ar' ? aboutData?.mission_ar : aboutData?.mission_en}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl md:rounded-3xl p-5 md:p-8 group border border-slate-200 dark:border-slate-800 border-t-4 border-t-slate-900 dark:border-t-white bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-4 md:mb-6 group-hover:scale-105 transition-transform">
              <Library size={26} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 md:mb-4">
              {lang === 'ar' ? 'رحلة التأسيس' : 'Our Journey'}
            </h2>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'ar'
                ? 'تأسست GITM لتوحيد جهود المبدعين والمبتكرين المغاربة. نسعى لتوفير بيئة تكنولوجية متكاملة تفتح آفاقاً جديدة للشباب المغربي.'
                : 'GITM was founded to unite Moroccan creators and innovators. We strive to provide an integrated technological environment that opens new horizons for Moroccan youth.'}
            </p>
          </motion.div>
        </div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8 md:mb-20 bg-white dark:bg-gitm-cardDark p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-soft border border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="flex-1 text-start">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4">
                {lang === 'ar' ? 'محمد غزاوني' : 'MOHAMMED RHZAOUNI'}
              </h2>
              <p className="text-base md:text-2xl text-gitm-red font-bold mb-4 md:mb-6">
                {lang === 'ar' ? 'مؤسس المجموعة والمشرف العام' : 'Founder & General Supervisor'}
              </p>
              <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base md:text-lg">
                <p>
                  {lang === 'ar' ? 'تاريخ ومكان الازدياد: 31 يناير 2004 بمدينة وادي زم، المغرب.' : 'Born: January 31, 2004 in Oued Zem, Morocco.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'محمد غزاوني هو شاب مغربي يمتلك شغفاً كبيراً بمجال التكنولوجيا والابتكار. يكرس جهده من خلال هذه المجموعة لقيادة المشاريع التقنية وتوفير بيئة خصبة للإبداع التكنولوجي، إيماناً منه بقدرة الشباب المغربي على التميز وصناعة المستقبل.'
                    : 'Mohammed Rhzaouni is a young Moroccan with a great passion for technology and innovation. He dedicates his effort through this group to lead technical projects and provide a fertile environment for technological creativity.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Stats (Compact 2-col on mobile, 3-col on tablet/desktop) */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl md:rounded-3xl bg-white dark:bg-gitm-cardDark border border-slate-200 dark:border-gitm-borderDark p-5 md:p-16 text-center relative overflow-hidden shadow-soft"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gitm-red/10 via-transparent to-gitm-green/10 pointer-events-none" />

          <h2 className="text-xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 md:mb-14 relative z-10">
            {lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-12 relative z-10">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="p-2.5 md:p-4 bg-gitm-red/15 rounded-full mb-3 md:mb-5">
                <Rocket size={26} className="text-gitm-red md:w-10 md:h-10" />
              </div>
              <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3">
                {aboutData?.stats?.founded || '2026'}
              </span>
              <span className="text-xs sm:text-sm md:text-lg text-slate-700 dark:text-slate-300 font-bold">
                {lang === 'ar' ? 'الانطلاقة' : 'Launch'}
              </span>
            </div>

            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="p-2.5 md:p-4 bg-slate-200 dark:bg-white/10 rounded-full mb-3 md:mb-5">
                <Activity size={26} className="text-slate-900 dark:text-white md:w-10 md:h-10" />
              </div>
              <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3">
                {aboutData?.stats?.projects || '15+'}
              </span>
              <span className="text-xs sm:text-sm md:text-lg text-slate-700 dark:text-slate-300 font-bold">
                {lang === 'ar' ? 'مشروعاً مبتكراً' : 'Innovative Projects'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="p-2.5 md:p-4 bg-gitm-green/15 rounded-full mb-3 md:mb-5">
                <Users size={26} className="text-gitm-green md:w-10 md:h-10" />
              </div>
              <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3">
                {aboutData?.stats?.members || '500+'}
              </span>
              <span className="text-xs sm:text-sm md:text-lg text-slate-700 dark:text-slate-300 font-bold">
                {lang === 'ar' ? 'عضو أكاديمي' : 'Academic Members'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mt-12 md:mt-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-start md:text-center mb-8 md:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 md:mb-5">
              {lang === 'ar' ? 'فريقنا المتميز' : 'Our Exceptional Team'}
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl md:mx-auto leading-relaxed">
              {lang === 'ar' ? 'نخبة من المهندسين والباحثين الذين يقودون رؤية GITM إلى أرض الواقع.' : 'An elite group of engineers and researchers turning GITM vision into reality.'}
            </p>
          </motion.div>

          {/* Official Team */}
          <div className="mb-12 md:mb-20">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-5 md:mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 md:pb-4">
              {lang === 'ar' ? 'أعضاء الفريق الرسميين' : 'Official Team Members'}
            </h3>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.official.map((member, i) => renderMemberCard(member, i))}
            </div>
          </div>

          {/* Internal Team */}
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-5 md:mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 md:pb-4">
              {lang === 'ar' ? 'أعضاء الفريق الداخلي' : 'Internal Team'}
            </h3>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.internal.map((member, i) => renderMemberCard(member, i))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
