import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ExternalLink, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function GlobalNewsDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, user } = useLanguage();
  
  const newsItem = location.state?.newsItem;

  if (!newsItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{txt(lang, 'Article not found', 'المقال غير موجود', 'Article non trouvé', '文章未找到')}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary px-6 py-2 rounded-full flex items-center gap-2">
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} /> {txt(lang, 'Go Back', 'العودة', 'Retour', '返回')}
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center grid-bg text-[#1e3a5f] dark:text-slate-200">
        <div className="max-w-md w-full glass-card p-10 rounded-3xl text-center shadow-2xl border border-cyan-200 dark:border-slate-800 animate-fade-in-up">
           <div className="w-24 h-24 bg-cyan-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <svg className="w-12 h-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
           </div>
           <h2 className="text-3xl font-bold font-orbitron mb-4">
             {txt(lang, 'Members Only', 'محتوى حصري للأعضاء', 'Membres Uniquement', '仅限会员')}
           </h2>
           <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
             {txt(lang, 'You must create a free account or log in to read full articles and access the library.', 'يجب عليك تسجيل الدخول أو إنشاء حساب مجاني لتتمكن من قراءة المقالات وتصفح المكتبة.', 'Vous devez créer un compte gratuit ou vous connecter pour lire.', '您必须创建一个免费帐户或登录。')}
           </p>
           <div className="flex flex-col gap-4">
             <button onClick={() => navigate('/login')} className="btn-primary py-4 rounded-xl font-bold w-full text-lg shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-1">
               {txt(lang, 'Log In', 'تسجيل الدخول', 'Connexion', '登录')}
             </button>
             <button onClick={() => navigate('/register')} className="bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border-2 border-cyan-200 dark:border-slate-700 py-4 rounded-xl font-bold w-full hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all text-lg">
               {txt(lang, 'Create Free Account', 'إنشاء حساب مجاني', 'Créer un compte', '创建免费帐户')}
             </button>
             <button onClick={() => navigate(-1)} className="mt-4 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 text-sm font-medium transition-colors">
               {txt(lang, 'Go Back', 'العودة', 'Retour', '返回')}
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <div className="max-w-6xl w-full mx-auto relative z-10 animate-fade-in-up flex flex-col h-[85vh]">
        
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors w-fit">
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          {txt(lang, 'Back', 'العودة', 'Retour', '返回')}
        </button>

        <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-cyan-300 dark:border-slate-800 flex-1">
          <div className="flex items-center justify-between p-4 border-b border-cyan-300 dark:border-slate-800 bg-cyan-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Globe className="text-cyan-500 shrink-0" size={24} />
              <h3 className="font-bold text-lg text-[#1e3a5f] dark:text-white line-clamp-1 pr-4">{newsItem.title}</h3>
            </div>
            {newsItem.url && (
              <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-cyan-200 dark:hover:bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap" title="Open Original">
                <ExternalLink size={18} />
                <span className="hidden sm:inline">{txt(lang, 'Original URL', 'الرابط الأصلي', 'Lien original', '原链接')}</span>
              </a>
            )}
          </div>
          <div className="flex-1 bg-white dark:bg-slate-950 relative flex items-center justify-center p-6">
            {newsItem.isApi ? (
              <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
                  <Globe className="text-white w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white leading-tight">
                  {newsItem.title}
                </h2>
                <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                  <span>Source: {newsItem.by || newsItem.author || 'Global Tech News'}</span>
                </div>
                <div className="p-6 bg-cyan-50 dark:bg-slate-900 rounded-2xl border border-cyan-200 dark:border-slate-800 w-full shadow-inner mt-4">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {lang === 'ar' ? 'هذا المقال الإخباري من مصدر خارجي عالمي. يمكنك قراءة المقال الكامل باللغة الأصلية أو استخدام أداة المترجم الذكي لدينا لترجمته.' :
                     lang === 'fr' ? 'Cet article provient d\'une source externe. Lisez-le dans la langue d\'origine ou utilisez notre traducteur IA.' :
                     lang === 'zh' ? '这篇新闻文章来自全球外部来源。您可以用原始语言阅读整篇文章，或使用我们的AI翻译工具。' :
                     'This news article is from an external global source. You can read the full article in its original language or use our AI Translator tool.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a 
                      href={newsItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-lg"
                    >
                      <span>{txt(lang, 'Read Full Article', 'قراءة المقال الكامل', 'Lire l\'article complet', '阅读全文')}</span>
                      <ExternalLink size={20} />
                    </a>
                    {newsItem.url && (
                      <a 
                        href={`https://translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(newsItem.url)}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-[#1e3a5f] dark:text-white font-bold rounded-xl shadow-md hover:bg-slate-300 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-lg border border-slate-300 dark:border-slate-700"
                      >
                        <Globe size={20} className="text-cyan-600 dark:text-cyan-400" />
                        <span>{txt(lang, 'Google Translate', 'ترجمة عبر جوجل', 'Traduire via Google', '谷歌翻译')}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl text-center p-8">
                <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-white mb-6">{newsItem.title}</h2>
                <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed text-lg mx-auto">
                  {lang === 'ar' ? newsItem.summary_ar : newsItem.summary_en || newsItem.summary_fr || newsItem.summary_ar}
                </div>
                <p className="mt-8 text-sm text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 w-fit mx-auto px-4 py-2 rounded-full">
                  Source: GITM Official • {newsItem.author}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
