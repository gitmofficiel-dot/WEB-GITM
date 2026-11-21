import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Building2, GraduationCap, Briefcase, Landmark } from 'lucide-react';

const getPartnerIcon = (type) => {
  switch (type) {
    case 'corporate': return <Building2 size={28} className="text-gitm-green" />;
    case 'academic': return <GraduationCap size={28} className="text-blue-600" />;
    case 'ngo': return <Landmark size={28} className="text-gitm-red" />;
    default: return <Briefcase size={28} className="text-indigo-600" />;
  }
};

export default function PartnersSlider() {
  const { lang, partners } = useLanguage();

  const rawPartners = partners && Array.isArray(partners) ? partners : [];

  const partnerList = rawPartners.filter((partner, index, self) =>
    index === self.findIndex((p) => p.name === partner.name)
  );

  // Hide empty partners section automatically to prevent large blank gaps
  if (partnerList.length === 0) return null;

  const duplicatedPartners = [...partnerList, ...partnerList];

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gitm-cardDark py-8 md:py-12 relative border-y border-gray-200 dark:border-gitm-borderDark">

      <div className="text-center mb-6 md:mb-10 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-gitm-textLight dark:text-white mb-2 leading-snug">
          {lang === 'ar' ? 'الشركاء الاستراتيجيون والمؤسسات الداعمة' : 'Strategic Partners & Supporting Institutions'}
        </h3>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          {lang === 'ar' ? 'نعمل جنباً إلى جنب مع كبرى المؤسسات الوطنية والعالمية' : 'Working alongside major national and global institutions'}
        </p>
      </div>

      {/* Left/Right Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-10 md:w-24 bg-gradient-to-r from-white dark:from-gitm-cardDark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 md:w-24 bg-gradient-to-l from-white dark:from-gitm-cardDark to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex w-fit group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-4 md:gap-8 px-4">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id || partner.name}-${index}`}
              className="flex items-center gap-3 md:gap-4 min-w-[260px] sm:min-w-[320px] max-w-[340px] md:max-w-[400px] p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gitm-borderDark rounded-2xl cursor-pointer hover:border-gitm-red hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-2.5 md:p-3 bg-white dark:bg-black rounded-xl shadow-sm shrink-0">
                {partner.icon ? (
                  <img src={partner.icon} alt={partner.name} className="w-8 h-8 object-contain" />
                ) : (
                  getPartnerIcon(partner.type)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gitm-textLight dark:text-white truncate">
                  {lang === 'ar' ? (partner.nameAr || partner.name) : (partner.nameEn || partner.name)}
                </h4>
                {partner.description && (
                  <p
                    className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2"
                    title={lang === 'ar' ? (partner.descriptionAr || partner.description) : (partner.descriptionEn || partner.description)}
                  >
                    {lang === 'ar' ? (partner.descriptionAr || partner.description) : (partner.descriptionEn || partner.description)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
