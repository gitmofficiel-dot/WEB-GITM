import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Globe, ChevronLeft, ExternalLink, Bookmark, Book } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function LibraryBookDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, savedItems, toggleSave, user } = useLanguage();
  
  const book = location.state?.book;

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{txt(lang, 'Book not found', 'الكتاب غير موجود', 'Livre non trouvé', '书籍未找到')}</h2>
        <button onClick={() => navigate('/library')} className="btn-primary px-6 py-2 rounded-full flex items-center gap-2">
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

  const isSaved = savedItems?.books?.some(b => b.key === book.key);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300 flex flex-col pt-24">
      <div className="max-w-6xl w-full mx-auto relative z-10 animate-fade-in-up flex flex-col h-auto min-h-[80vh]">
        
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors w-fit bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-cyan-100 dark:border-slate-700">
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
          {txt(lang, 'Back to Library', 'العودة للمكتبة', 'Retour à la bibliothèque', '返回图书馆')}
        </button>

        <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-cyan-300 dark:border-slate-800 flex-1">
          <div className="flex items-center justify-between p-4 border-b border-cyan-300 dark:border-slate-800 bg-cyan-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-500 shrink-0" size={24} />
              <h3 className="font-bold text-lg text-[#1e3a5f] dark:text-white line-clamp-1 pr-4">{book.title}</h3>
            </div>
            {book.previewLink && (
              <a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-cyan-200 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap" title="Preview Original">
                <ExternalLink size={18} />
                <span className="hidden sm:inline">{txt(lang, 'Preview Link', 'رابط المعاينة الأصلي', 'Lien original', '预览链接')}</span>
              </a>
            )}
          </div>
          <div className="flex-1 bg-white dark:bg-slate-950 relative overflow-y-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
              {/* Book Cover */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-64 h-96 md:w-full md:h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative">
                  {book.cover_i ? (
                    <img src={book.cover_i} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Book size={80} className="text-white/50" />
                    </div>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="w-full md:w-2/3 flex flex-col">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="px-4 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-bold uppercase tracking-wider rounded-full">
                    GITM Academy Library
                  </span>
                  <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-full">
                    {book.first_publish_year || 'Unknown Year'}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-[#1e3a5f] dark:text-white mb-4 leading-tight tracking-tight">
                  {book.title}
                </h1>
                <h2 className="text-2xl text-slate-500 dark:text-slate-400 mb-8 flex items-center gap-2">
                  <span className="font-semibold">{lang === 'ar' ? 'المؤلف:' : 'Author:'}</span> 
                  <span className="text-blue-500 dark:text-blue-400">{book.author_name?.[0] || 'Unknown'}</span>
                </h2>

                <div className="prose dark:prose-invert mb-10 text-slate-600 dark:text-slate-300 leading-relaxed max-w-none text-lg bg-cyan-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-cyan-100 dark:border-slate-800 shadow-inner">
                  <p>
                    {lang === 'ar' ? 'هذا الكتاب متوفر الآن للطلاب والباحثين في أكاديمية GITM للابتكار. يمكنك تحميل نسخة PDF أو قراءته عبر المنصة.' : 'This book is now available for students and researchers at GITM Innovation Academy. You can download a PDF copy or read it on the platform.'}
                  </p>
                  {book.publisher && (
                    <p className="mt-4"><strong className="text-slate-800 dark:text-slate-200">{lang === 'ar' ? 'الناشر:' : 'Publisher:'}</strong> {book.publisher[0]}</p>
                  )}
                  {book.subject && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {book.subject.slice(0, 8).map(sub => (
                        <span key={sub} className="text-sm font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">#{sub}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button 
                    onClick={() => toast.info(lang === 'ar' ? 'جاري تحضير ملف PDF للتحميل...' : 'Preparing PDF file for download...')}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {lang === 'ar' ? 'تحميل الكتاب (PDF)' : 'Download PDF'}
                  </button>
                  
                  <button 
                    onClick={() => toggleSave('books', book)}
                    className="px-8 py-4 bg-white dark:bg-slate-800 text-[#1e3a5f] dark:text-white border-2 border-cyan-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-cyan-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Bookmark size={24} className={isSaved ? 'fill-blue-500 text-blue-500' : ''} />
                    {lang === 'ar' ? 'حفظ للمفضلة' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
