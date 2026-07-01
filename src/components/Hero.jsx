import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Play, X, Globe, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = {
  ar: [
    "الواجهة التقنية لعاصمة الابتكار.",
    "نربط مدينة وزان بأكبر الجامعات العالمية.",
    "نبني أنظمة الذكاء الاصطناعي للمستقبل.",
    "رؤية وطنية بأبعاد تكنولوجية عالمية.",
    "منصة المهندسين المغاربة للإبداع.",
    "نصمم خوارزميات الغد اليوم.",
    "نحو شراكات استراتيجية مع هارفارد.",
    "جامعة محمد السادس متعددة التخصصات كملهم لنا.",
    "دعم الأبحاث العلمية المتقدمة.",
    "تطوير روبوتات تخدم المجتمع.",
    "نؤسس نادي الألعاب الإلكترونية والتطوير.",
    "نتعاون مع المركز الجهوي للاستثمار.",
    "منصات سحابية تعزز الاقتصاد الرقمي.",
    "نحو مستقبل تقني مستدام.",
    "الفيدرالية المغربية لخبراء التكنولوجيا."
  ],
  en: [
    "The Technical Interface for Innovation.",
    "Connecting Ouezzane to Global Universities.",
    "Building AI Systems for the Future.",
    "A National Vision with Global Tech Dimensions.",
    "The Platform for Moroccan Engineers.",
    "Designing Tomorrow's Algorithms Today.",
    "Towards Strategic Partnerships with Harvard.",
    "UM6P as Our Inspiration.",
    "Supporting Advanced Scientific Research.",
    "Developing Robotics for Society.",
    "Founding the Gaming & Development Club.",
    "Collaborating with the Regional Investment Center.",
    "Cloud Platforms Boosting the Digital Economy.",
    "Towards a Sustainable Tech Future.",
    "Moroccan Federation of Technology Experts."
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % 15);
    }, 4000); // Change title every 4 seconds

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000); // Change bg every 8 seconds

    return () => {
      clearInterval(titleInterval);
      clearInterval(bgInterval);
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // max tilt 20deg
    const y = (clientY / innerHeight - 0.5) * -20;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background Slider */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          src={bgImages[bgIndex]}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      {/* Math Overlay Pattern */}
      <div className="absolute inset-0 bg-math-overlay bg-repeat z-[1] opacity-50 dark:opacity-30 mix-blend-overlay" />
      
      {/* Moroccan Flag Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gitm-dark/90 via-gitm-dark/80 to-gitm-red/20 z-[2]" />

      {/* Main 3D Container */}
      <motion.div 
        className="container mx-auto px-4 z-10 perspective-1000"
        animate={{ 
          rotateY: mousePosition.x, 
          rotateX: mousePosition.y 
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      >
        <div className="max-w-5xl mx-auto text-center tilt-card p-10 md:p-16 border-t-4 border-t-gitm-red border-b-4 border-b-gitm-green bg-white/10 dark:bg-black/40 backdrop-blur-xl shadow-3d">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gitm-red/10 text-gitm-red dark:text-red-400 font-bold text-sm mb-8 border border-gitm-red/20">
            <Globe size={18} />
            {lang === 'ar' ? 'واجهة عالمية للابتكار' : 'Global Interface for Innovation'}
          </div>

          {/* Typewriter Rotator */}
          <div className="h-32 sm:h-40 md:h-48 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg"
              >
                {lang === 'ar' ? titles.ar[titleIndex] : titles.en[titleIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            {lang === 'ar' 
              ? 'نبني جسوراً تكنولوجية من وزان إلى هارفارد ولندن وجامعة محمد السادس، لنصنع جيلاً جديداً من الأنظمة الذكية المدعومة برؤية المركز الجهوي للاستثمار والشركاء الوطنيين.' 
              : 'Building technological bridges from Ouezzane to Harvard, London, and UM6P, shaping a new generation of intelligent systems backed by CRI and national partners.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => navigate('/projects-hub')}
              className="w-full sm:w-auto bg-gitm-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-gitm-green/30 hover:-translate-y-1"
            >
              <Cpu size={22} />
              {lang === 'ar' ? 'اكتشف التقنيات' : 'Discover Tech'}
              <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
            
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all backdrop-blur-sm hover:-translate-y-1"
            >
              <Play fill="currentColor" size={20} />
              {lang === 'ar' ? 'شاهد الفيديو التعريفي' : 'Watch Intro Video'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-gitm-red text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-gitm-red/20 border border-white/10"
            >
              {/* YouTube Embed Placeholder */}
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="GITM Presentation" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
