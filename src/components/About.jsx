import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Flag, History, Loader2, Users, Rocket, Activity, Library, ChevronLeft, Github, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import SEO from './SEO';

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
            image: data.imageUrl || data.photoURL || `https://ui-avatars.com/api/?name=${data.name || 'GITM'}&background=random`,
            socialLinks: data.socialLinks || {}
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
      <div className="min-h-screen flex items-center justify-center bg-gitm-light dark:bg-gitm-dark">
        <Loader2 className="w-10 h-10 animate-spin text-gitm-red" />
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
      "birthDate": "2004-01-31",
      "birthPlace": {
        "@type": "Place",
        "name": "وادي زم، المغرب"
      },
      "jobTitle": "مؤسس المجموعة والمشرف العام"
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
  const pageDesc = lang === 'ar' ? 'نحن منصة تكنولوجية مغربية رائدة. محمد غزاوني - MOHAMMED RHZAOUNI هو مؤسس مجموعة الابتكار التكنولوجي بالمغرب GITM.' : 'We are a leading Moroccan tech initiative. MOHAMMED RHZAOUNI is the founder of GITM.';;

  return (
    <div className="min-h-screen bg-gitm-light dark:bg-gitm-dark pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <SEO title={pageTitle} description={pageDesc} schema={schemaMarkup} />
      {/* Math & Tech Overlay */}
      <div className="absolute inset-0 bg-math-overlay opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto mb-10 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gitm-red/10 text-gitm-red font-bold text-sm mb-6 border border-gitm-red/20">
            {lang === 'ar' ? 'منظمة وطنية ذات رؤية عالمية' : 'National Organization, Global Vision'}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tight text-gitm-textLight dark:text-white mb-3 md:mb-8">
            {lang === 'ar' ? 'نصنع التكنولوجيا من المغرب إلى العالم' : 'Building Tech from Morocco to the World'}
          </h1>
          <p className="text-base md:text-2xl text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed">
            {lang === 'ar' 
              ? 'المجموعة المغربية للابتكار التكنولوجي (GITM) تقود التحول الرقمي بالتعاون مع كبرى المؤسسات وتفتح آفاقاً للشباب المغربي للتألق في الجامعات العالمية.' 
              : 'The Moroccan Group for Technological Innovation (GITM) leads digital transformation and opens horizons for Moroccan youth globally.'}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="tilt-card p-6 md:p-8 group border-t-4 border-gitm-red bg-white dark:bg-gitm-cardDark shadow-soft"
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
            className="tilt-card p-6 md:p-8 group border-t-4 border-gitm-green bg-white dark:bg-gitm-cardDark shadow-soft"
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
            className="tilt-card p-6 md:p-8 group border-t-4 border-black dark:border-white bg-white dark:bg-gitm-cardDark shadow-soft"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gitm-textLight dark:text-white mb-6 group-hover:scale-110 transition-transform">
              <Library size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-4">{lang === 'ar' ? 'رحلة التأسيس' : 'Our Journey'}</h2>
            <p className="text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium">
              {lang === 'ar' 
                ? 'تأسست GITM لتوحيد جهود المبدعين والمبتكرين المغاربة. نسعى لتوفير بيئة تكنولوجية متكاملة تفتح آفاقاً جديدة للشباب المغربي.' 
                : 'GITM was founded to unite Moroccan creators and innovators. We strive to provide an integrated technological environment that opens new horizons for Moroccan youth.'}
            </p>
          </motion.div>
        </div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 md:mb-20 bg-white dark:bg-gitm-cardDark p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right rtl:md:text-right ltr:md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-gitm-textLight dark:text-white mb-4">
                {lang === 'ar' ? 'محمد غزاوني' : 'MOHAMMED RHZAOUNI'}
              </h1>
              <h2 className="text-xl md:text-2xl text-gitm-red font-bold mb-6">
                {lang === 'ar' ? 'مؤسس المجموعة والمشرف العام' : 'Founder & General Supervisor'}
              </h2>
                            <div className="space-y-6 text-gitm-mutedLight dark:text-gitm-mutedDark leading-relaxed font-medium text-lg">
                <p>
                  {lang === 'ar' ? 'تاريخ ومكان الازدياد: 31 يناير 2004 بمدينة وادي زم، المغرب.' : 'Born: January 31, 2004 in Oued Zem, Morocco.'}
                </p>
                <div>
                  <h3 className="text-xl font-bold text-gitm-textLight dark:text-white mb-2">
                    {lang === 'ar' ? 'القيادة التقنية والمهارات:' : 'Technical Leadership & Skills:'}
                  </h3>
                  <p>
                    {lang === 'ar' 
                      ? 'أسس في يونيو 2026 "مجموعة الابتكار التكنولوجي بالمغرب" (GITM) لقيادة مبادرات الروبوتات والذكاء الاصطناعي. يحمل شهادة مهندس برمجيات موثقة من منصة HackerRank، ويتقن العمل بلغات وتقنيات متعددة مثل Python، C++، JavaScript، و Node.js.' 
                      : 'Founded the "Moroccan Innovation and Technology Group" (GITM) in June 2026 to lead robotics and AI initiatives. Holds a certified Software Engineer credential from HackerRank, and is proficient in multiple languages and technologies such as Python, C++, JavaScript, and Node.js.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gitm-textLight dark:text-white mb-2">
                    {lang === 'ar' ? 'المشاريع والابتكارات:' : 'Projects & Innovations:'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      {lang === 'ar'
                        ? 'مطور مشروع "نبض إكس" (NABD-X)، وهو مشروع شخصي حصري يهدف إلى بناء بيئة مدن ذكية باستخدام إنترنت الأشياء والذكاء الاصطناعي.'
                        : 'Developer of the "NABD-X" project, an exclusive personal project aimed at building a smart city environment using IoT and AI.'}
                    </li>
                    <li>
                      {lang === 'ar'
                        ? 'صمم وابتكر الروبوت المجنزر "علي" (Ali) المعتمد على الذكاء الاصطناعي والمتحكمات الدقيقة.'
                        : 'Designed and created the tracked robot "Ali" based on AI and microcontrollers.'}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gitm-textLight dark:text-white mb-2">
                    {lang === 'ar' ? 'الاهتمامات المتنوعة:' : 'Diverse Interests:'}
                  </h3>
                  <p>
                    {lang === 'ar'
                      ? 'إلى جانب شغفه ببرمجيات الويب، الأنظمة المدمجة، وبروتوكولات تشخيص السيارات، يهتم بالتصوير الفوتوغرافي للطبيعة، وتصميم الإضاءة المحيطية والديكور، والزراعة العضوية، بالإضافة إلى مشاركته الفعالة في العمل التطوعي وتأطير الشباب.'
                      : 'Besides his passion for web software, embedded systems, and automotive diagnostic protocols, he is interested in nature photography, ambient lighting and decor design, organic farming, in addition to his active participation in volunteer work and youth mentoring.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="tilt-card border border-gitm-borderDark p-6 md:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle gradient inside */}
          <div className="absolute inset-0 bg-gradient-to-r from-gitm-red/20 via-transparent to-gitm-green/20 pointer-events-none" />
          
          <h2 className="text-xl md:text-4xl font-bold text-gitm-textLight dark:text-white mb-6 md:mb-16 relative z-10">{lang === 'ar' ? 'أرقامنا وإنجازاتنا' : 'Our Impact'}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 relative z-10">
            <div className="flex flex-col items-center">
              <div className="p-3 md:p-4 bg-gitm-red/20 rounded-full mb-4 md:mb-6">
                <Rocket size={36} className="text-gitm-red md:w-12 md:h-12" />
              </div>
              <span className="text-4xl md:text-6xl font-bold text-gitm-textLight dark:text-white mb-2 md:mb-4">{aboutData?.stats?.founded || '2026'}</span>
              <span className="text-lg md:text-xl text-gitm-mutedLight dark:text-gray-400 font-bold">{lang === 'ar' ? 'الانطلاقة' : 'Launch'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 md:p-4 bg-slate-200 dark:bg-white/10 rounded-full mb-4 md:mb-6">
                <Activity size={36} className="text-gitm-textLight dark:text-white md:w-12 md:h-12" />
              </div>
              <span className="text-4xl md:text-6xl font-bold text-gitm-textLight dark:text-white mb-2 md:mb-4">{aboutData?.stats?.projects || '15+'}</span>
              <span className="text-lg md:text-xl text-gitm-mutedLight dark:text-gray-400 font-bold">{lang === 'ar' ? 'مشروعاً مبتكراً' : 'Innovative Projects'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 md:p-4 bg-gitm-green/20 rounded-full mb-4 md:mb-6">
                <Users size={36} className="text-gitm-green md:w-12 md:h-12" />
              </div>
              <span className="text-4xl md:text-6xl font-bold text-gitm-textLight dark:text-white mb-2 md:mb-4">{aboutData?.stats?.members || '500+'}</span>
              <span className="text-lg md:text-xl text-gitm-mutedLight dark:text-gray-400 font-bold">{lang === 'ar' ? 'عضو أكاديمي' : 'Academic Members'}</span>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mt-16 md:mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-16"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.official.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gitm-cardDark rounded-2xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="aspect-square md:aspect-[4/5] overflow-hidden relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold text-gitm-textLight dark:text-white mb-1 truncate">{lang === 'ar' ? member.name_ar : member.name}</h4>
                    <p className="text-gitm-red font-medium text-xs md:text-sm mb-3 md:mb-4 truncate">{lang === 'ar' ? member.role_ar : member.role}</p>
                    <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gitm-mutedLight dark:text-gitm-mutedDark bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg justify-center md:justify-start mb-3">
                      <Activity size={14} className="text-gitm-green shrink-0" />
                      <span className="font-bold">{member.projectsCount}</span>
                      <span className="truncate">{lang === 'ar' ? 'مشاريع' : 'Projects'}</span>
                    </div>
                    {member.socialLinks && (
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {member.socialLinks.linkedin && (
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.socialLinks.github && (
                          <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Github size={18} />
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <Globe size={18} />
                          </a>
                        )}
                      </div>
                    )}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.internal.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gitm-cardDark rounded-2xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="aspect-square md:aspect-[4/5] overflow-hidden relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold text-gitm-textLight dark:text-white mb-1 truncate">{lang === 'ar' ? member.name_ar : member.name}</h4>
                    <p className="text-gitm-red font-medium text-xs md:text-sm mb-3 md:mb-4 truncate">{lang === 'ar' ? member.role_ar : member.role}</p>
                    <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gitm-mutedLight dark:text-gitm-mutedDark bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg justify-center md:justify-start mb-3">
                      <Activity size={14} className="text-gitm-green shrink-0" />
                      <span className="font-bold">{member.projectsCount}</span>
                      <span className="truncate">{lang === 'ar' ? 'مشاريع' : 'Projects'}</span>
                    </div>
                    {member.socialLinks && (
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {member.socialLinks.linkedin && (
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.socialLinks.github && (
                          <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Github size={18} />
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <Globe size={18} />
                          </a>
                        )}
                      </div>
                    )}
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
