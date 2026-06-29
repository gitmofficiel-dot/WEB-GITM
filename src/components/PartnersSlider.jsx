import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const partners = [
  { name: { en: 'OCP Group', ar: 'مجموعة OCP' }, icon: '🏢', color: 'from-emerald-400 to-teal-500', subtitle: { en: 'Corporate Partner', ar: 'شريك مؤسسي' } },
  { name: { en: 'Huawei Morocco', ar: 'هواوي المغرب' }, icon: '📡', color: 'from-red-400 to-rose-500', subtitle: { en: 'Technology Partner', ar: 'شريك تقني' } },
  { name: { en: 'Microsoft for Startups', ar: 'مايكروسوفت للشركات الناشئة' }, icon: '💻', color: 'from-blue-400 to-indigo-500', subtitle: { en: 'Cloud Partner', ar: 'شريك سحابي' } },
  { name: { en: 'AWS Activate', ar: 'AWS أكتيفيت' }, icon: '☁️', color: 'from-amber-400 to-orange-500', subtitle: { en: 'Cloud Partner', ar: 'شريك سحابي' } },
  { name: { en: 'Technopark Casablanca', ar: 'تكنوبارك الدار البيضاء' }, icon: '🏗️', color: 'from-violet-400 to-purple-500', subtitle: { en: 'Innovation Hub', ar: 'مركز ابتكار' } },
  { name: { en: 'UM6P', ar: 'جامعة محمد السادس' }, icon: '🎓', color: 'from-cyan-400 to-sky-500', subtitle: { en: 'Academic Partner', ar: 'شريك أكاديمي' } },
];

const supporters = [
  { name: { en: 'Ministry of Digital Transition', ar: 'وزارة التحول الرقمي' }, icon: '🇲🇦', color: 'from-red-400 to-green-500', subtitle: { en: 'Government', ar: 'حكومة' } },
  { name: { en: 'CGEM', ar: 'الاتحاد العام لمقاولات المغرب' }, icon: '🤝', color: 'from-blue-400 to-sky-500', subtitle: { en: 'Business Federation', ar: 'اتحاد الأعمال' } },
  { name: { en: 'APEBI', ar: 'الفيدرالية المغربية لتكنولوجيا المعلومات' }, icon: '🖥️', color: 'from-teal-400 to-emerald-500', subtitle: { en: 'ICT Federation', ar: 'اتحاد تكنولوجيا المعلومات' } },
  { name: { en: 'Réseau Entreprendre Maroc', ar: 'شبكة ريادة الأعمال المغرب' }, icon: '🌐', color: 'from-purple-400 to-fuchsia-500', subtitle: { en: 'Entrepreneur Network', ar: 'شبكة رواد أعمال' } },
  { name: { en: 'UNESCO Morocco', ar: 'اليونسكو المغرب' }, icon: '🏛️', color: 'from-sky-400 to-blue-500', subtitle: { en: 'International Org', ar: 'منظمة دولية' } },
  { name: { en: 'African Development Bank', ar: 'البنك الأفريقي للتنمية' }, icon: '🏦', color: 'from-yellow-400 to-amber-500', subtitle: { en: 'Development Finance', ar: 'تمويل تنموي' } },
];

const PartnerCard = ({ partner, lang }) => (
  <div className="flex-shrink-0 mx-3 group">
    <div className="w-[220px] md:w-[260px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]">
      {/* Logo / Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {partner.icon}
      </div>
      {/* Partner Name */}
      <h4 className="font-bold text-sm md:text-base text-slate-800 dark:text-white leading-tight mb-1 truncate">
        {partner.name[lang] || partner.name.en}
      </h4>
      {/* Subtitle */}
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {partner.subtitle[lang] || partner.subtitle.en}
      </p>
    </div>
  </div>
);

const MarqueeRow = ({ items, reverse = false, lang }) => {
  const tripled = [...items, ...items, ...items];
  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee-forward';
  const animationClass2 = reverse ? 'animate-marquee-reverse2' : 'animate-marquee-forward2';

  return (
    <div className="relative flex overflow-hidden group">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-slate-50 dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-slate-50 dark:from-gray-900 to-transparent pointer-events-none" />

      {/* Track 1 */}
      <div className={`flex py-4 ${animationClass} group-hover:[animation-play-state:paused]`}>
        {tripled.map((partner, i) => (
          <PartnerCard key={`a-${i}`} partner={partner} lang={lang} />
        ))}
      </div>
      {/* Track 2 (seamless loop) */}
      <div className={`flex py-4 absolute top-0 ${animationClass2} group-hover:[animation-play-state:paused]`}>
        {tripled.map((partner, i) => (
          <PartnerCard key={`b-${i}`} partner={partner} lang={lang} />
        ))}
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="flex items-center justify-center gap-4 mb-6">
    <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-emerald-400/50" />
    <h3 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 tracking-wide">
      {children}
    </h3>
    <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-cyan-400/50" />
  </div>
);

const PartnersSlider = () => {
  const { lang } = useLanguage();

  return (
    <section className="py-16 bg-slate-50 dark:bg-gray-900 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-10 px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-cyan-400 mb-2">
          {lang === 'ar' ? 'شبكة شركاؤنا' : 'Our Network'}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-slate-900 dark:text-white">
          {lang === 'ar' ? 'شركاء النجاح' : 'Partners in Success'}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Partners Row */}
      <SectionTitle>
        {lang === 'ar' ? '🏢 المؤسسات الشريكة' : '🏢 Partner Institutions'}
      </SectionTitle>
      <MarqueeRow items={partners} lang={lang} />

      <div className="my-6" />

      {/* Supporters Row */}
      <SectionTitle>
        {lang === 'ar' ? '🤝 المؤسسات الداعمة' : '🤝 Supporting Organizations'}
      </SectionTitle>
      <MarqueeRow items={supporters} reverse lang={lang} />

      {/* Marquee Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-marquee-forward {
          animation: marqueeForward 35s linear infinite;
        }
        .animate-marquee-forward2 {
          animation: marqueeForward2 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marqueeReverse 35s linear infinite;
        }
        .animate-marquee-reverse2 {
          animation: marqueeReverse2 35s linear infinite;
        }
        @keyframes marqueeForward {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marqueeForward2 {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marqueeReverse {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marqueeReverse2 {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
};

export default PartnersSlider;
