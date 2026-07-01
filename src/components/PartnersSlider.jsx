import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, Monitor, Globe, Landmark, Building, MapPin } from 'lucide-react';

const partners = [
  { id: 1, nameAr: 'الاتحاد العام لمقاولات المغرب', nameEn: 'CGEM', descAr: 'اتحاد الأعمال', descEn: 'Business Union', icon: <Briefcase size={28}/>, color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 2, nameAr: 'الفيدرالية المغربية لتكنولوجيا المعلومات', nameEn: 'APEBI', descAr: 'اتحاد تكنولوجيا المعلومات', descEn: 'IT Federation', icon: <Monitor size={28}/>, color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { id: 3, nameAr: 'شبكة ريادة الأعمال المغرب', nameEn: 'Endeavor Morocco', descAr: 'شبكة رواد أعمال', descEn: 'Entrepreneur Network', icon: <Globe size={28}/>, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 4, nameAr: 'اليونسكو المغرب', nameEn: 'UNESCO Morocco', descAr: 'منظمة دولية', descEn: 'International Org', icon: <Landmark size={28}/>, color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  { id: 5, nameAr: 'البنك الأفريقي للتنمية', nameEn: 'AfDB', descAr: 'تمويل تنموي', descEn: 'Dev Finance', icon: <Building size={28}/>, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: 6, nameAr: 'وزارة التحول الرقمي', nameEn: 'Digital Ministry', descAr: 'حكومة', descEn: 'Government', icon: <MapPin size={28}/>, color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' },
];

export default function PartnersSlider() {
  const { lang } = useLanguage();

  return (
    <div className="w-full py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            {lang === 'ar' ? 'شبكة قوية' : 'Strong Network'}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {lang === 'ar' ? 'شركاؤنا والمؤسسات الداعمة' : 'Partners & Supporters'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'نفتخر بشراكتنا مع مؤسسات رائدة في القطاعين العام والخاص لدعم الابتكار التكنولوجي.'
              : 'Proud partnerships with leading public and private institutions driving technological innovation.'}
          </p>
        </motion.div>
      </div>

      {/* Grid of partners */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${partner.color} group-hover:scale-110 transition-transform duration-300`}>
                {partner.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {lang === 'ar' ? partner.nameAr : partner.nameEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? partner.descAr : partner.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
