import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ShieldCheck, ChevronLeft, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import CommentsSection from './ui/CommentsSection';
import { Languages, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, news } = useLanguage();
  const { currentUser: user } = useAuth();
  const [translatedTitle, setTranslatedTitle] = React.useState(null);
  const [translatedSummary, setTranslatedSummary] = React.useState(null);
  const [translatedContent, setTranslatedContent] = React.useState(null);
  const [isTranslating, setIsTranslating] = React.useState(false);

  const article = news.find(n => n.id.toString() === id);

  const handleTranslate = async () => {
    if (isTranslating) return;
    setIsTranslating(true);
    try {
      const targetLang = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : lang === 'zh' ? 'zh' : 'en';

      const translateText = async (text) => {
        if (!text) return '';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetLang}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.responseData.translatedText;
      };

      const tTitle = await translateText(lang === 'ar' ? (article.titleEn || article.title_en || article.title) : (article.titleAr || article.title_ar || article.title));
      const tSummary = await translateText(lang === 'ar' ? (article.summaryEn || article.summary_en) : (article.summaryAr || article.summary_ar));
      const tContent = await translateText(article.content || (lang === 'ar' ? article.content_en : article.content_ar));

      if (tTitle) setTranslatedTitle(tTitle);
      if (tSummary) setTranslatedSummary(tSummary);
      if (tContent) setTranslatedContent(tContent);

      toast.success(lang === 'ar' ? 'تمت الترجمة بنجاح' : 'Translated successfully');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(lang === 'ar' ? 'فشل الترجمة' : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  if (!article) {
    return (
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="min-h-[60vh] flex flex-col items-center justify-center p-6 pb-24 text-center overflow-x-hidden"
      >
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {txt(lang, 'Article not found', 'المقال غير موجود', 'Article non trouvé', '文章未找到')}
        </h2>
        <button
          type="button"
          onClick={() => navigate('/news')}
          className="btn-primary min-h-[44px] px-6 py-2.5 rounded-full flex items-center gap-2 font-bold"
        >
          <ChevronLeft className={lang === 'ar' ? 'rotate-180' : ''} aria-hidden="true" />
          <span>{txt(lang, 'Back to News', 'العودة للأخبار', 'Retour', '返回新闻')}</span>
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="min-h-screen pt-20 md:pt-32 pb-24 md:pb-20 px-4 flex flex-col items-center justify-center grid-bg text-[#1e3a5f] dark:text-slate-200 overflow-x-hidden"
      >
        <div className="max-w-md w-full glass-card p-6 sm:p-10 rounded-3xl text-center shadow-2xl border border-cyan-200 dark:border-slate-800 animate-fade-in-up">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-cyan-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner" aria-hidden="true">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight mb-4">
            {txt(lang, 'Members Only', 'محتوى حصري للأعضاء', 'Membres Uniquement', '仅限会员')}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
            {txt(lang, 'You must create a free account or log in to read full articles and access the library.', 'يجب عليك تسجيل الدخول أو إنشاء حساب مجاني لتتمكن من قراءة المقالات وتصفح المكتبة.', 'Vous devez créer un compte gratuit ou vous connecter pour lire.', '您必须创建一个免费帐户或登录。')}
          </p>
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-primary min-h-[48px] py-3.5 sm:py-4 rounded-xl font-bold w-full text-base sm:text-lg shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              {txt(lang, 'Log In', 'تسجيل الدخول', 'Connexion', '登录')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="min-h-[48px] bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border-2 border-cyan-300 dark:border-slate-700 py-3.5 sm:py-4 rounded-xl font-bold w-full hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all text-base sm:text-lg"
            >
              {txt(lang, 'Create Free Account', 'إنشاء حساب مجاني', 'Créer un compte', '创建免费帐户')}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="min-h-[44px] mt-2 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm font-semibold transition-colors"
            >
              {txt(lang, 'Go Back', 'العودة', 'Retour', '返回')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = translatedTitle || (lang === 'ar' ? (article.titleAr || article.title_ar || article.title) : (article.titleEn || article.title_en || article.title));

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen py-6 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-x-hidden text-[#1e3a5f] dark:text-slate-200 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">

        <button
          type="button"
          onClick={() => navigate('/news')}
          aria-label={txt(lang, 'Back to News', 'العودة للأخبار', 'Retour aux actualités', '返回新闻')}
          className="mb-4 sm:mb-6 min-h-[44px] px-2 -ms-2 inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 font-semibold transition-colors w-fit"
        >
          <ChevronLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} aria-hidden="true" />
          <span>{txt(lang, 'Back to News', 'العودة للأخبار', 'Retour aux actualités', '返回新闻')}</span>
        </button>

        <article className="bg-[#e0fcfc] dark:bg-slate-900 w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-cyan-300 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-cyan-300 dark:border-slate-800 bg-cyan-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="text-teal-600 dark:text-teal-400 shrink-0" size={22} aria-hidden="true" />
              <span className="font-bold text-sm sm:text-base text-[#1e3a5f] dark:text-slate-200 truncate">
                {txt(lang, 'Official News', 'خبر رسمي', 'Nouvelles officielles', '官方新闻')}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating}
                aria-label={txt(lang, 'Translate article', 'ترجمة المقال', 'Traduire l’article', '翻译文章')}
                className="min-h-[44px] min-w-[44px] px-3 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 rounded-xl transition-colors bg-cyan-100 dark:bg-slate-800 flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-60"
              >
                {isTranslating ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Languages size={20} aria-hidden="true" />}
                <span className="hidden sm:inline">{txt(lang, 'Translate', 'ترجمة فورية', 'Traduire', '翻译')}</span>
              </button>
              <button
                type="button"
                aria-label={txt(lang, 'Copy article link', 'نسخ رابط المقال', 'Copier le lien', '复制链接')}
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success(lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied'))}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 rounded-xl transition-colors bg-cyan-100 dark:bg-slate-800"
              >
                <Share2 size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-12 text-[#1e3a5f] dark:text-slate-200">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold mb-5 sm:mb-6">
              {article.date && (
                <span className="flex items-center gap-1.5 bg-teal-100/80 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full">
                  <Calendar size={15} aria-hidden="true" /> {article.date}
                </span>
              )}
              {article.category && (
                <span className="flex items-center gap-1.5 bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                  <Tag size={15} aria-hidden="true" /> {article.category}
                </span>
              )}
              {article.author && (
                <span className="flex items-center gap-1.5 bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">
                  <User size={15} aria-hidden="true" /> {article.author}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold tracking-tight mb-6 sm:mb-8 text-[#0B132B] dark:text-white leading-tight break-words">
              {displayTitle}
            </h1>

            {(article.mainImage || article.imageUrl) && (
              <img
                src={article.mainImage || article.imageUrl}
                alt={displayTitle || 'Article cover'}
                className="w-full aspect-video md:aspect-auto md:h-[400px] object-cover rounded-2xl md:rounded-3xl mb-6 sm:mb-8 shadow-xl"
              />
            )}

            <div className="w-full h-px bg-cyan-200 dark:bg-slate-800 mb-6 sm:mb-8" aria-hidden="true"></div>

            <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed space-y-6 quill-content ql-editor break-words overflow-x-auto">
              {(translatedSummary || article.summary_ar || article.summary_en) && (
                <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 border-s-4 border-cyan-600 ps-4">
                  {translatedSummary || (lang === 'ar' ? article.summary_ar : article.summary_en)}
                </p>
              )}

              <div className="mt-6 sm:mt-8">
                {translatedContent ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translatedContent) }} />
                ) : (
                  article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((lang === 'ar' ? article.content_ar : article.content_en) || '<p>المحتوى غير متوفر</p>') }} />
                  )
                )}
              </div>
            </div>

            {(article.updates || article.additions) && (
              <div className="mt-10 sm:mt-12 p-5 sm:p-8 bg-slate-100 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 break-words">
                {article.updates && (
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                      <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0" aria-hidden="true"><Calendar size={18} /></span>
                      <span>{lang === 'ar' ? 'تحديثات للمقال' : 'Article Updates'}</span>
                    </h2>
                    <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{article.updates}</div>
                  </div>
                )}
                {article.additions && (
                  <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h2 className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                      <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0" aria-hidden="true"><ShieldCheck size={18} /></span>
                      <span>{lang === 'ar' ? 'إضافات وملاحظات' : 'Additions & Highlights'}</span>
                    </h2>
                    <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{article.additions}</div>
                  </div>
                )}
              </div>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors hover:bg-cyan-50 hover:text-cyan-700 dark:hover:text-cyan-400 break-words"
                  >
                    <Tag size={15} aria-hidden="true" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <CommentsSection targetId={article.id} targetType="news" />
          </div>
        </article>
      </div>
    </div>
  );
}
