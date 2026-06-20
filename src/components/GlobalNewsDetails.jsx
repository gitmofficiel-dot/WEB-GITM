import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ExternalLink, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function GlobalNewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, news: localNews } = useLanguage();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      // Check if it's local first
      const local = localNews.find(n => n.id.toString() === id);
      if (local) {
        setNewsItem({ ...local, isApi: false });
        setLoading(false);
        return;
      }
      
      // If not local, fetch from Hacker News
      try {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const data = await res.json();
        
        let translatedTitle = data.title;
        // Basic translation if requested lang is ar or fr
        if (lang === 'ar' || lang === 'fr') {
          try {
            const trRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(data.title)}&langpair=en|${lang}`);
            const trData = await trRes.json();
            if (trData.responseData && trData.responseData.translatedText) {
              translatedTitle = trData.responseData.translatedText;
            }
          } catch(e) {}
        }
        
        setNewsItem({
          id: data.id,
          title: translatedTitle,
          by: data.by,
          url: data.url,
          isApi: true
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, lang, localNews]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="animate-spin text-cyan-500 w-12 h-12" />
      </div>
    );
  }

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
              <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-cyan-200 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap" title="Open Original">
                <ExternalLink size={18} />
                <span className="hidden sm:inline">{txt(lang, 'Original URL', 'الرابط الأصلي', 'Lien original', '原链接')}</span>
              </a>
            )}
          </div>
          <div className="flex-1 bg-white dark:bg-slate-950 relative flex items-center justify-center">
            {newsItem.isApi && newsItem.url ? (
              <iframe 
                src={newsItem.url} 
                className="absolute inset-0 w-full h-full border-0 bg-white"
                title={newsItem.title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            ) : (
              <div className="max-w-2xl text-center p-8">
                <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">{newsItem.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {newsItem.isApi ? 'No readable content provided by the API.' : (lang === 'ar' ? newsItem.summary_ar : newsItem.summary_en)}
                </p>
                <p className="mt-8 text-sm text-slate-400 font-bold">Source: {newsItem.by || newsItem.author}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
