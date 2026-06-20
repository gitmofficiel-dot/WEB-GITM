import React, { useState, useEffect } from 'react';
import { Microscope, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FACTS = [
  { en: "Zero is the only number that cannot be represented by Roman numerals.", ar: "الصفر هو الرقم الوحيد الذي لا يمكن تمثيله بالأرقام الرومانية.", fr: "Le zéro est le seul nombre qui ne peut être représenté par des chiffres romains." },
  { en: "A 'jiffy' is an actual unit of time: 1/100th of a second.", ar: "'جيفي' هي وحدة زمنية فعلية تعادل 1/100 من الثانية.", fr: "Un 'jiffy' est une véritable unité de temps : 1/100 de seconde." },
  { en: "If you shuffle a deck of cards properly, it's highly likely that exact order has never existed before in history.", ar: "إذا قمت بخلط أوراق اللعب جيداً، فمن المحتمل جداً أن هذا الترتيب الدقيق لم يوجد من قبل في التاريخ.", fr: "Si vous mélangez bien un jeu de cartes, il est très probable que cet ordre n'ait jamais existé." },
  { en: "Fibonacci sequence appears in biological settings, such as branching in trees and leaves.", ar: "تظهر تسلسلات فيبوناتشي في الطبيعة، مثل تفرع الأشجار والأوراق.", fr: "La suite de Fibonacci apparaît dans la nature, comme dans les branches d'arbres." },
  { en: "The word 'hundred' comes from the old Norse term 'hundrath', which actually means 120.", ar: "كلمة 'مائة' بالإنجليزية تأتي من الكلمة النوردية القديمة 'hundrath'، والتي تعني في الواقع 120.", fr: "Le mot anglais 'hundred' vient de l'ancien terme nordique 'hundrath', qui signifie en fait 120." }
];

const ScienceFactWidget = () => {
  const { lang } = useLanguage();
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFact = () => {
    setLoading(true);
    setTimeout(() => {
      const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
      setFact(lang === 'ar' ? randomFact.ar : lang === 'fr' ? randomFact.fr : randomFact.en);
      setLoading(false);
    }, 500); // slight delay for animation effect
  };

  useEffect(() => {
    fetchFact();
  }, [lang]);

  const title = lang === 'ar' ? 'معلومة رياضية اليوم' : lang === 'fr' ? 'Fait Mathématique du Jour' : 'Math Fact of the Day';

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Microscope size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-xl font-bold font-orbitron flex items-center gap-2 text-[#1e3a5f] dark:text-white">
          <Microscope className="text-emerald-500" /> {title}
        </h3>
        <button 
          onClick={fetchFact} 
          disabled={loading}
          className="p-2 bg-cyan-100 dark:bg-slate-800 hover:bg-cyan-200 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-10 min-h-[100px] flex items-center justify-center">
        {loading ? (
          <Loader className="animate-spin text-emerald-500" />
        ) : (
          <p className="text-lg text-[#2d507b] dark:text-slate-300 italic font-medium text-center leading-relaxed px-4">
            "{fact}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ScienceFactWidget;
