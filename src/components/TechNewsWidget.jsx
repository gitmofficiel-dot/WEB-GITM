import React, { useState, useEffect } from 'react';
import { Newspaper, Loader, AlertCircle, ExternalLink, Bookmark, Globe, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TechNewsWidget = () => {
  const { lang, news: localNews, savedItems, toggleSave } = useLanguage();
  const [newsLang, setNewsLang] = useState(lang === 'ar' ? 'ar' : 'en');
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        if (newsLang === 'en') {
          // Fetch top stories from Hacker News API (Public API)
          const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
          if (!topStoriesRes.ok) throw new Error('Failed to fetch');
          const storyIds = await topStoriesRes.json();
          
          // Fetch details for top 5 stories
          const storyPromises = storyIds.slice(0, 5).map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
          );
          const stories = await Promise.all(storyPromises);
          setNews(stories.map(s => ({
            id: s.id,
            title: s.title,
            score: s.score,
            by: s.by,
            url: s.url,
            isApi: true
          })));
        } else {
          // Use local localized news for other languages
          setNews(localNews.slice(0, 5).map(s => ({
            id: s.id,
            title: s[`title_${newsLang}`] || s.title_en || s.title_ar,
            score: 'GITM',
            by: s.author,
            url: s.url || '',
            isApi: false
          })));
        }
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchNews();
  }, [newsLang, localNews]);

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
          <option value="en">{lang === 'ar' ? 'الإنجليزية (Live)' : 'English (Live)'}</option>
          <option value="fr">{lang === 'ar' ? 'الفرنسية' : 'French'}</option>
        </select>
      </div>
      <div className="space-y-4">
        {news.map((item, idx) => {
          const isSaved = savedItems?.news?.some(n => n.id === item.id);
          return (
          <div 
            key={item.id} 
            className="block p-4 rounded-xl bg-cyan-50 dark:bg-slate-900/50 hover:bg-cyan-100 dark:hover:bg-slate-800/80 transition-colors border border-cyan-200 dark:border-slate-800 group relative"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-[10px] font-bold w-fit uppercase tracking-wider">
              <Globe size={10} /> {item.isApi ? (lang === 'ar' ? 'أخبار عالمية (API)' : 'Global News (API)') : (lang === 'ar' ? 'أخبار محلية' : 'Local News')}
            </div>
            
            <button onClick={() => setSelectedNews(item)} className="text-left w-full">
              <h4 className="font-semibold text-sm text-[#1e3a5f] dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                {item.title}
              </h4>
            </button>
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
                <button onClick={() => setSelectedNews(item)} className="p-1 text-slate-400 hover:text-cyan-500">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* News Viewer Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedNews(null)}>
          <div className="bg-[#e0fcfc] dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-cyan-300 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-cyan-300 dark:border-slate-800 bg-cyan-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Globe className="text-cyan-500" size={24} />
                <h3 className="font-bold text-lg text-[#1e3a5f] dark:text-white truncate pr-4">{selectedNews.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a href={selectedNews.url || `https://news.ycombinator.com/item?id=${selectedNews.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-cyan-200 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold" title="Open in new tab">
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'الرابط الأصلي' : 'Original URL'}</span>
                </a>
                <button onClick={() => setSelectedNews(null)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-cyan-100 dark:bg-slate-950 relative flex items-center justify-center p-4">
              {selectedNews.isApi ? (
                <iframe 
                  src={selectedNews.url || `https://news.ycombinator.com/item?id=${selectedNews.id}`} 
                  className="absolute inset-0 w-full h-full border-0 bg-[#e0fcfc]"
                  title={selectedNews.title}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                <div className="max-w-2xl text-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl">
                  <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">{selectedNews.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {localNews.find(n => n.id === selectedNews.id)?.[`summary_${newsLang}`] || 
                     localNews.find(n => n.id === selectedNews.id)?.summary_en}
                  </p>
                  <p className="mt-8 text-sm text-slate-400 font-bold">Author: {selectedNews.by}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechNewsWidget;
