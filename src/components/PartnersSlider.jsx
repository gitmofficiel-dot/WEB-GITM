import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Building2, Gamepad2, GraduationCap, Briefcase, Landmark } from 'lucide-react';

const partners = [
  { id: 1, nameAr: "مجموعة OCP", nameEn: "OCP Group", icon: <Building2 size={32} className="text-gitm-green" /> },
  { id: 2, nameAr: "المركز الجهوي للاستثمار بني ملال-خنيفرة", nameEn: "CRI Beni Mellal-Khenifra", icon: <Landmark size={32} className="text-gitm-red" /> },
  { id: 3, nameAr: "نادي الألعاب الإلكترونية", nameEn: "Gaming Club", icon: <Gamepad2 size={32} className="text-purple-500" /> },
  { id: 4, nameAr: "جامعة محمد السادس", nameEn: "UM6P", icon: <GraduationCap size={32} className="text-blue-600" /> },
  { id: 5, nameAr: "جامعة هارفارد (رؤية)", nameEn: "Harvard (Vision)", icon: <Landmark size={32} className="text-amber-600" /> },
  { id: 6, nameAr: "جامعة لندن (رؤية)", nameEn: "University of London (Vision)", icon: <GraduationCap size={32} className="text-indigo-600" /> },
  { id: 7, nameAr: "الوزارة المنتدبة للانتقال الرقمي", nameEn: "Digital Transition Ministry", icon: <Briefcase size={32} className="text-gitm-red" /> },
];

export default function PartnersSlider() {
  const { lang } = useLanguage();
  
  // Double the array for infinite seamless scrolling
  const duplicatedPartners = [...partners, ...partners];

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
                {partner.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gitm-textLight dark:text-white line-clamp-2">
                  {lang === 'ar' ? partner.nameAr : partner.nameEn}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
