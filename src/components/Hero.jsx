import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Play, X, Globe, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = {
  ar: [
    "الواجهة التقنية لعاصمة الابتكار.",
    "نبني أنظمة الذكاء الاصطناعي للمستقبل.",
    "رؤية وطنية بأبعاد تكنولوجية عالمية.",
    "منصة المهندسين المغاربة للإبداع.",
    "نصمم خوارزميات الغد اليوم.",
    "دعم الأبحاث العلمية المتقدمة.",
    "تطوير روبوتات تخدم المجتمع.",
    "نؤسس نادي الألعاب الإلكترونية والتطوير.",
    "نتعاون مع المركز الجهوي للاستثمار.",
    "منصات سحابية تعزز الاقتصاد الرقمي.",
    "نحو مستقبل تقني مستدام.",
    "الفيدرالية المغربية لخبراء التكنولوجيا.",
    "نصنع جيلاً جديداً من المبدعين.",
    "نبتكر حلولاً للتحديات المعاصرة.",
    "التميز في الهندسة والبرمجيات."
  ],
  en: [
    "The Technical Interface for Innovation.",
    "Building AI Systems for the Future.",
    "A National Vision with Global Tech Dimensions.",
    "The Platform for Moroccan Engineers.",
    "Designing Tomorrow's Algorithms Today.",
    "Supporting Advanced Scientific Research.",
    "Developing Robotics for Society.",
    "Founding the Gaming & Development Club.",
    "Collaborating with the Regional Investment Center.",
    "Cloud Platforms Boosting the Digital Economy.",
    "Towards a Sustainable Tech Future.",
    "Moroccan Federation of Technology Experts.",
    "Creating a New Generation of Innovators.",
    "Innovating Solutions for Modern Challenges.",
    "Excellence in Engineering and Software."
  ]
};

const bgImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531297172867-4f50fcc2cb26?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
];

export default function Hero() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  const [titleIndex, setTitleIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % 15);
    }, 4000);

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000);

    return () => {
      clearInterval(titleInterval);
      clearInterval(bgInterval);
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15; 
    const y = (clientY / innerHeight - 0.5) * -15;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="popLayout">
        <motion.img
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          src={bgImages[bgIndex]}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-gitm-light dark:from-gitm-dark via-transparent to-transparent z-[1]" />
      <div className="absolute inset-0 bg-black/40 z-[2]" />

      <motion.div 
        className="container mx-auto px-4 z-10 perspective-1000"
        animate={{ 
          rotateY: mousePosition.x, 
          rotateX: mousePosition.y 
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      >
        {/* Removed the black background card completely. Text floats freely. */}
        <div className="max-w-5xl mx-auto text-center p-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-100 font-bold text-sm mb-8 border border-blue-400/30 shadow-lg">
            <Globe size={18} />
            {lang === 'ar' ? 'واجهة عالمية للابتكار' : 'Global Interface for Innovation'}
          </div>

          <div className="h-32 sm:h-40 md:h-48 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              >
                {lang === 'ar' ? titles.ar[titleIndex] : titles.en[titleIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-lg md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed font-semibold drop-shadow-lg">
            {lang === 'ar' 
              ? 'نجمع نخبة المهندسين والمبدعين لتطوير مشاريع رائدة تسهم في التحول الرقمي والتكنولوجي، برؤية وطنية طموحة وبصمة عالمية مؤثرة تصنع المستقبل.' 
              : 'Uniting elite engineers and creators to develop pioneering projects contributing to digital and technological transformation, with an ambitious national vision shaping the future globally.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => navigate('/projects-hub')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1"
            >
              <Cpu size={22} />
              {lang === 'ar' ? 'اكتشف التقنيات' : 'Discover Tech'}
              <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
