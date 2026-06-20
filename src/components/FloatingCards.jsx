import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Globe2, Trophy, Briefcase, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingCards = () => {
  const { language, isRTL } = useLanguage();
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const cards = [
    {
      id: 1,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: language === 'ar' ? 'طلاب نشطين' : language === 'fr' ? 'Étudiants Actifs' : language === 'zh' ? '活跃学生' : 'Active Students',
      value: '10,000+',
      depth: 1.5,
      position: 'top-[10%] left-[10%]',
      animationClass: 'animate-float'
    },
    {
      id: 2,
      icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
      title: language === 'ar' ? 'دورات متخصصة' : language === 'fr' ? 'Cours Spécialisés' : language === 'zh' ? '专业课程' : 'Expert Courses',
      value: '250+',
      depth: 0.8,
      position: 'top-[20%] right-[15%]',
      animationClass: 'animate-float-delayed'
    },
    {
      id: 3,
      icon: <Globe2 className="w-6 h-6 text-emerald-500" />,
      title: language === 'ar' ? 'شركاء عالميين' : language === 'fr' ? 'Partenaires Globaux' : language === 'zh' ? '全球合作伙伴' : 'Global Partners',
      value: '50+',
      depth: 2.2,
      position: 'bottom-[20%] left-[20%]',
      animationClass: 'animate-float-slow'
    },
    {
      id: 4,
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      title: language === 'ar' ? 'نسبة النجاح' : language === 'fr' ? 'Taux de Réussite' : language === 'zh' ? '成功率' : 'Success Rate',
      value: '98%',
      depth: 1.2,
      position: 'bottom-[15%] right-[25%]',
      animationClass: 'animate-float'
    },
    {
      id: 5,
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      title: language === 'ar' ? 'فرص عمل' : language === 'fr' ? 'Offres d\'emploi' : language === 'zh' ? '工作机会' : 'Job Placements',
      value: '5,000+',
      depth: 1.8,
      position: 'top-[45%] left-[30%]',
      animationClass: 'animate-float-slow'
    },
    {
      id: 6,
      icon: <Zap className="w-6 h-6 text-rose-500" />,
      title: language === 'ar' ? 'مشاريع ذكاء اصطناعي' : language === 'fr' ? 'Projets IA' : language === 'zh' ? 'AI项目' : 'AI Projects',
      value: '1,200+',
      depth: 0.5,
      position: 'top-[60%] right-[10%]',
      animationClass: 'animate-float-delayed'
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[600px] overflow-hidden perspective-1000 ${isRTL ? 'rtl' : 'ltr'}`}
      style={{ perspective: '1000px' }}
    >
      {/* Central Hero Content overlaying the floating cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0B132B] dark:text-white drop-shadow-lg">
            {language === 'ar' ? 'تأثير يمتد عالمياً' : language === 'fr' ? 'Un Impact Mondial' : language === 'zh' ? '全球影响力' : 'Global Impact'}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto drop-shadow-md">
            {language === 'ar' ? 'نحن نبني الجيل القادم من القادة والمبتكرين في عصر الذكاء الاصطناعي.' : language === 'fr' ? 'Nous formons la prochaine génération de leaders et d\'innovateurs à l\'ère de l\'IA.' : language === 'zh' ? '在人工智能时代，我们正在培养下一代领导者和创新者。' : 'Empowering the next generation of leaders and innovators in the age of AI.'}
          </p>
        </motion.div>
      </div>

      {/* Floating Cards */}
      {cards.map((card) => {
        // Calculate dynamic transform based on mouse position and depth
        const rotateX = -mousePosition.y * 30 * card.depth;
        const rotateY = mousePosition.x * 30 * card.depth;
        const translateX = mousePosition.x * 50 * card.depth;
        const translateY = mousePosition.y * 50 * card.depth;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: card.id * 0.1 }}
            className={`absolute ${card.position} z-20 transition-transform duration-200 ease-out`}
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className={`
              ${card.animationClass}
              glass-card p-4 rounded-2xl border border-white/20 dark:border-white/10 
              bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md shadow-xl hover:shadow-2xl
              flex items-center gap-4 w-64 cursor-pointer hover:bg-[#e0fcfc]/60 dark:hover:bg-gray-800/60 transition-colors
            `}>
              <div className="p-3 bg-[#e0fcfc] dark:bg-gray-900 rounded-xl shadow-inner">
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-[#0B132B] dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 2s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default FloatingCards;
