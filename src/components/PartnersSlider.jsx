import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const partners = ['Microsoft', 'Google', 'IBM', 'AWS', 'Huawei', 'Oracle', 'Cisco', 'Intel'];
const supporters = ['Moroccan Ministry of Tech', 'UM6P', 'Technopark', 'CGEM', 'AMD', 'Nvidia', 'Dell', 'HP'];

const PartnersSlider = () => {
  const { lang } = useLanguage();

  const renderMarquee = (items, reverse = false) => (
    <div className="relative flex overflow-x-hidden group">
      <div className={`py-4 animate-marquee whitespace-nowrap flex items-center ${reverse ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-2xl md:text-4xl font-black font-orbitron text-gray-300 dark:text-gray-700/50 uppercase tracking-wider hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors cursor-default">
            {item}
          </span>
        ))}
      </div>
      <div className={`absolute top-0 py-4 animate-marquee2 whitespace-nowrap flex items-center ${reverse ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-2xl md:text-4xl font-black font-orbitron text-gray-300 dark:text-gray-700/50 uppercase tracking-wider hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors cursor-default">
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-[#e0fcfc] dark:bg-gray-900 overflow-hidden border-y border-gray-100 dark:border-gray-800">
      <div className="mb-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
          {lang === 'ar' ? 'المؤسسات الشريكة' : 'Partner Organizations'}
        </h3>
      </div>
      {renderMarquee(partners)}
      
      <div className="mt-12 mb-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
          {lang === 'ar' ? 'المؤسسات الداعمة' : 'Supporting Organizations'}
        </h3>
      </div>
      {renderMarquee(supporters, true)}
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
        .direction-reverse {
          animation-direction: reverse;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
      `}} />
    </section>
  );
};

export default PartnersSlider;
