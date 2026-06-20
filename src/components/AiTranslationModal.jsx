import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Loader2 } from 'lucide-react';

const AiTranslationModal = () => {
  const { isTranslating, lang } = useLanguage();

  if (!isTranslating) return null;

  const loadingText = lang === 'ar' 
    ? 'جاري تحديث اللغة وبنية النظام...' 
    : 'Updating language and interface structure...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg/85 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-xl glass border border-white/5 shadow-2xl">
        <Loader2 size={32} className="text-emerald-400 animate-spin" />
        <p className="text-xs font-semibold text-white/80 tracking-wide font-mono">
          {loadingText}
        </p>
      </div>
    </div>
  );
};

export default AiTranslationModal;
