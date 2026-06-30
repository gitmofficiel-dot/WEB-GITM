import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, Monitor, Globe, Landmark, Building, MapPin } from 'lucide-react';

const partners = [
  { id: 1, nameAr: 'الاتحاد العام لمقاولات المغرب', nameEn: 'General Confederation of Moroccan Enterprises', type: 'business', icon: <Briefcase size={32}/>, color: 'text-blue-500' },
  { id: 2, nameAr: 'الفيدرالية المغربية لتكنولوجيا المعلومات', nameEn: 'Moroccan Federation of IT', type: 'tech', icon: <Monitor size={32}/>, color: 'text-indigo-500' },
  { id: 3, nameAr: 'شبكة ريادة الأعمال المغرب', nameEn: 'Entrepreneurship Network Morocco', type: 'network', icon: <Globe size={32}/>, color: 'text-emerald-500' },
  { id: 4, nameAr: 'اليونسكو المغرب', nameEn: 'UNESCO Morocco', type: 'international', icon: <Landmark size={32}/>, color: 'text-sky-500' },
  { id: 5, nameAr: 'البنك الأفريقي للتنمية', nameEn: 'African Development Bank', type: 'finance', icon: <Building size={32}/>, color: 'text-yellow-500' },
  { id: 6, nameAr: 'وزارة التحول الرقمي', nameEn: 'Ministry of Digital Transition', type: 'government', icon: <MapPin size={32}/>, color: 'text-red-500' },
];

export default function PartnersSlider() {
  const { lang } = useLanguage();

  return (
    <div className="w-full py-16 overflow-hidden bg-slate-50 dark:bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-orbitron text-[#1e3a5f] dark:text-white mb-4">
          {lang === 'ar' ? 'شركاؤنا والداعمون' : 'Our Partners & Supporters'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'نفتخر بشراكتنا مع نخبة من المؤسسات الحكومية، الدولية، وقطاع الأعمال لدعم الابتكار.' 
            : 'We are proud to partner with top government, international, and business institutions to support innovation.'}
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Shadow overlays for smooth scrolling effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-[#09090b] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-[#09090b] to-transparent z-10 pointer-events-none"></div>
        
        {/* Marquee Animation */}
        <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused]">
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 px-8 py-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all min-w-[300px] group cursor-pointer"
            >
              <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform ${partner.color}`}>
                {partner.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#1e3a5f] dark:text-white text-sm">
                  {lang === 'ar' ? partner.nameAr : partner.nameEn}
                </h4>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                  {partner.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
