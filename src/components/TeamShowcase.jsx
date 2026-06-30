import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Users, BookOpen, GraduationCap, Github, Linkedin, Twitter } from 'lucide-react';

const teamData = [
  {
    id: 1,
    nameAr: 'أ. د. أحمد بنسالم',
    nameEn: 'Prof. Ahmed Bensalem',
    roleAr: 'أستاذ باحث في الذكاء الاصطناعي',
    roleEn: 'AI Research Professor',
    type: 'professor',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    bioAr: 'خبير في معالجة اللغات الطبيعية وتعلم الآلة.',
    bioEn: 'Expert in NLP and Machine Learning.'
  },
  {
    id: 2,
    nameAr: 'م. سارة العلوي',
    nameEn: 'Eng. Sarah Alaoui',
    roleAr: 'معلمة أنظمة مدمجة',
    roleEn: 'Embedded Systems Teacher',
    type: 'teacher',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bioAr: 'مهندسة متخصصة في إنترنت الأشياء والروبوتات.',
    bioEn: 'Engineer specializing in IoT and Robotics.'
  },
  {
    id: 3,
    nameAr: 'يوسف الإدريسي',
    nameEn: 'Youssef El Idrissi',
    roleAr: 'عضو أساسي - مطور ويب',
    roleEn: 'Core Member - Web Developer',
    type: 'member',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80',
    bioAr: 'مطور واجهات أمامية مهتم بتصميم تجربة المستخدم.',
    bioEn: 'Frontend developer passionate about UX design.'
  },
  {
    id: 4,
    nameAr: 'د. ليلى عماري',
    nameEn: 'Dr. Laila Ammari',
    roleAr: 'أستاذة علوم البيانات',
    roleEn: 'Data Science Professor',
    type: 'professor',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bioAr: 'باحثة في مجالات البيانات الضخمة والتحليل الإحصائي.',
    bioEn: 'Researcher in Big Data and Statistical Analysis.'
  },
  {
    id: 5,
    nameAr: 'عمر التازي',
    nameEn: 'Omar Tazi',
    roleAr: 'عضو أساسي - مهندس شبكات',
    roleEn: 'Core Member - Network Engineer',
    type: 'member',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bioAr: 'خبير في الأمن السيبراني وهندسة الشبكات.',
    bioEn: 'Cybersecurity and Network Engineering expert.'
  },
  {
    id: 6,
    nameAr: 'م. حسن الناصري',
    nameEn: 'Eng. Hassan Naciri',
    roleAr: 'معلم تطوير الألعاب',
    roleEn: 'Game Dev Teacher',
    type: 'teacher',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bioAr: 'مطور ألعاب ومحترف في Unreal Engine و Unity.',
    bioEn: 'Game developer and Unreal/Unity professional.'
  }
];

export default function TeamShowcase() {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'professor', 'teacher', 'member'

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: <Users size={16}/> },
    { id: 'professor', labelAr: 'الأساتذة', labelEn: 'Professors', icon: <GraduationCap size={16}/> },
    { id: 'teacher', labelAr: 'المعلمين', labelEn: 'Teachers', icon: <BookOpen size={16}/> },
    { id: 'member', labelAr: 'الأعضاء', labelEn: 'Members', icon: <Github size={16}/> },
  ];

  const filteredTeam = activeFilter === 'all' 
    ? teamData 
    : teamData.filter(member => member.type === activeFilter);

  return (
    <div className="w-full py-20 bg-white dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-[#1e3a5f] dark:text-white mb-6">
            {lang === 'ar' ? 'فريق العمل والخبراء' : 'Our Team & Experts'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            {lang === 'ar' 
              ? 'تعرف على نخبة الأساتذة، المعلمين، والأعضاء المؤسسين الذين يقودون رؤية GITM للإبداع التكنولوجي.'
              : 'Meet the elite professors, teachers, and core members driving GITM\'s vision for tech innovation.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter.icon}
                {lang === 'ar' ? filter.labelAr : filter.labelEn}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTeam.map(member => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={member.id}
                className="group bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md group-hover:border-blue-400 transition-colors">
                  <img src={member.image} alt={member.nameEn} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    member.type === 'professor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    member.type === 'teacher' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {lang === 'ar' ? member.roleAr : member.roleEn}
                  </span>
                  
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                    {lang === 'ar' ? member.nameAr : member.nameEn}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                    {lang === 'ar' ? member.bioAr : member.bioEn}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin size={18}/></a>
                    <a href="#" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><Github size={18}/></a>
                    <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={18}/></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
