import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ShieldCheck, ChevronLeft, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, news, user } = useLanguage();

  const article = news.find(n => n.id.toString() === id);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{txt(lang, 'Article not found', 'المقال غير موجود', 'Article non trouvé', '文章未找到')}</h2>
        <button onClick={() => navigate('/news')} className="btn-primary px-6 py-2 rounded-full flex items-center gap-2">
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} /> {txt(lang, 'Back to News', 'العودة للأخبار', 'Retour', '返回新闻')}
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
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
        
        <button onClick={() => navigate('/news')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors w-fit">
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          {txt(lang, 'Back to News', 'العودة للأخبار', 'Retour aux actualités', '返回新闻')}
        </button>

        <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-cyan-300 dark:border-slate-800">
          <div className="flex items-center justify-between p-6 border-b border-cyan-300 dark:border-slate-800 bg-cyan-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-teal-500" size={24} />
              <span className="font-bold text-[#1e3a5f] dark:text-slate-200">{txt(lang, 'Official News', 'خبر رسمي', 'Nouvelles officielles', '官方新闻')}</span>
            </div>
            <button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success(lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied'))} className="p-2 text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-xl transition-colors bg-cyan-100 dark:bg-slate-800">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="p-8 md:p-12 text-[#1e3a5f] dark:text-slate-200">
            <div className="flex flex-wrap items-center gap-4 text-sm text-teal-600 dark:text-cyan-400 font-medium mb-6">
              <span className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full"><Calendar size={16}/> {article.date}</span>
              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full"><Tag size={16}/> {article.category}</span>
              <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full"><User size={16}/> {article.author}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold mb-8 text-[#0B132B] dark:text-white leading-tight">
              {lang === 'ar' ? article.title_ar : article.title_en}
            </h1>
            
            <div className="w-full h-px bg-cyan-200 dark:bg-slate-800 mb-8"></div>
            
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed space-y-6">
              <p className="text-xl font-medium text-slate-600 dark:text-slate-300 border-l-4 border-cyan-500 pl-4 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-4">
                {lang === 'ar' ? article.summary_ar : article.summary_en}
              </p>
              
              <div className="mt-8">
                {lang === 'ar' ? (article.content_ar || <p>المحتوى الكامل للمقال سيتم عرضه هنا. هذه المساحة مخصصة للتفاصيل الشاملة للخبر مع دعم الفقرات المتعددة والصور إن وجدت.</p>) : (article.content_en || <p>The full content of the article will be displayed here. This space is dedicated to comprehensive details of the news, supporting multiple paragraphs and images if any.</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
