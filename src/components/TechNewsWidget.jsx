import React, { useState, useEffect } from 'react';
import { Newspaper, Loader, AlertCircle, ExternalLink, Bookmark, Globe, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const TechNewsWidget = () => {
  const navigate = useNavigate();
  const { lang, news: localNews, savedItems, toggleSave } = useLanguage();
  const [newsLang, setNewsLang] = useState(lang === 'ar' ? 'ar' : 'en');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch top stories from Hacker News API (Public API)
        const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!topStoriesRes.ok) throw new Error('Failed to fetch');
        const storyIds = await topStoriesRes.json();
        
        // Fetch details for top 5 stories
        const storyPromises = storyIds.slice(0, 5).map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        const stories = await Promise.all(storyPromises);

        // Translate titles if needed
        const translatedStories = await Promise.all(stories.map(async (s) => {
          let translatedTitle = s.title;
          if (newsLang !== 'en') {
            try {
              const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(s.title)}&langpair=en|${newsLang}`);
              const data = await res.json();
              if (data.responseData && data.responseData.translatedText) {
                translatedTitle = data.responseData.translatedText;
              }
            } catch (e) {
              console.error('Translation failed', e);
            }
          }
          return {
            id: s.id,
            title: translatedTitle,
            score: s.score,
            by: s.by,
            url: s.url,
            isApi: true
          };
        }));

        setNews(translatedStories);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchNews();
  }, [newsLang]);

  const title = lang === 'ar' ? 'أخبار التقنية العالمية' : 'Global Tech News';

  if (loading) return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-center min-h-[300px] border border-white/20 dark:border-gray-700/50">
      <Loader className="animate-spin text-purple-500" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-center min-h-[300px] border border-red-200 dark:border-red-800 text-red-500">
      <AlertCircle className="mr-2" /> {lang === 'ar' ? 'خطأ في جلب الأخبار' : 'Error loading news'}
    </div>
  );

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-cyan-200 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-orbitron flex items-center gap-2 text-[#1e3a5f] dark:text-white">
          <Newspaper className="text-cyan-500" /> {title}
        </h3>
        <select
          value={newsLang}
          onChange={(e) => setNewsLang(e.target.value)}
          className="px-3 py-1 rounded-lg border border-cyan-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-blue-500 text-[#1e3a5f] dark:text-white"
        >
          <option value="ar">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
          <option value="en">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
          <option value="fr">{lang === 'ar' ? 'الفرنسية' : 'French'}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {news.map((item, idx) => {
          const isSaved = savedItems?.news?.some(n => n.id === item.id);
          return (
          <div 
            key={item.id} 
            className="card-3d glass-card block p-4 rounded-xl bg-cyan-50 dark:bg-slate-900/50 hover:bg-cyan-100 dark:hover:bg-slate-800/80 transition-colors border border-cyan-200 dark:border-slate-800 group relative flex flex-col justify-between min-h-[150px]"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-[10px] font-bold w-fit uppercase tracking-wider">
                <Globe size={10} /> {item.isApi ? (lang === 'ar' ? 'أخبار عالمية' : 'Global News') : (lang === 'ar' ? 'أخبار محلية' : 'Local News')}
              </div>
              
              <button onClick={() => navigate(`/news/global/${item.id}`)} className="text-left w-full">
                <h4 className="font-semibold text-sm text-[#1e3a5f] dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-3 leading-snug">
                  {item.title}
                </h4>
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.isApi ? `${item.score} points • ${item.by}` : `GITM Official • ${item.by}`}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleSave('news', item)}
                  className={`p-1 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-cyan-200 dark:hover:bg-slate-700'}`}
                  title={isSaved ? 'Unsave' : 'Save'}
                >
                  <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                </button>
                <button onClick={() => navigate(`/news/global/${item.id}`)} className="p-1 text-slate-400 hover:text-cyan-500">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      </div>
    </div>
  );
};

export default TechNewsWidget;
