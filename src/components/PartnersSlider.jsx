import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Building2, Gamepad2, GraduationCap, Briefcase, Landmark } from 'lucide-react';

const getPartnerIcon = (type) => {
  switch(type) {
    case 'corporate': return <Building2 size={32} className="text-gitm-green" />;
    case 'academic': return <GraduationCap size={32} className="text-blue-600" />;
    case 'ngo': return <Landmark size={32} className="text-gitm-red" />;
    default: return <Briefcase size={32} className="text-indigo-600" />;
  }
};

export default function PartnersSlider() {
  const { lang, partners } = useLanguage();
  
  // Clean structure from context - default if not provided
  const partnerList = partners && Array.isArray(partners) ? partners : [];
  
  // Double the array for infinite seamless scrolling
  const duplicatedPartners = partnerList.length > 0 ? [...partnerList, ...partnerList] : [];

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gitm-cardDark py-12 relative border-y border-gray-200 dark:border-gitm-borderDark">
      
      <div className="text-center mb-10 px-4">
        <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-2">
          {lang === 'ar' ? 'الشركاء الاستراتيجيون والمؤسسات الداعمة' : 'Strategic Partners & Supporting Institutions'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'ar' ? 'نعمل جنباً إلى جنب مع كبرى المؤسسات الوطنية والعالمية' : 'Working alongside major national and global institutions'}
        </p>
      </div>

      {/* Left/Right Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gitm-cardDark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gitm-cardDark to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex w-fit group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-8 px-4">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex items-center gap-4 min-w-[300px] p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gitm-borderDark rounded-2xl cursor-pointer hover:border-gitm-red hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm">
                {partner.icon ? (
                  <img src={partner.icon} alt={partner.name} className="w-8 h-8 object-contain" />
                ) : (
                  getPartnerIcon(partner.type)
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gitm-textLight dark:text-white line-clamp-2">
                  {lang === 'ar' ? (partner.nameAr || partner.name) : (partner.nameEn || partner.name)}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
