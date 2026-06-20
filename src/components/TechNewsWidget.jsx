import React, { useState, useEffect } from 'react';
import { Newspaper, Loader, AlertCircle, ExternalLink, Bookmark, Globe, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TechNewsWidget = () => {
  const { lang, savedItems, toggleSave } = useLanguage();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
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
        setNews(stories);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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
    <div className="glass-card p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <h3 className="text-xl font-bold font-orbitron mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
        <Newspaper className="text-cyan-500" /> {title}
      </h3>
      <div className="space-y-4">
        {news.map((item, idx) => {
          const isSaved = savedItems?.news?.some(n => n.id === item.id);
          return (
          <div 
            key={item.id} 
            className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-slate-100 dark:border-slate-800 group relative"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-[10px] font-bold w-fit uppercase tracking-wider">
              <Globe size={10} /> {lang === 'ar' ? 'أخبار عالمية (API)' : 'Global News (API)'}
            </div>
            
            <button onClick={() => setSelectedNews(item)} className="text-left w-full">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                {item.title}
              </h4>
            </button>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.score} points • {item.by}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleSave('news', item)}
                  className={`p-1 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
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
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Globe className="text-cyan-500" size={24} />
                <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate pr-4">{selectedNews.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a href={selectedNews.url || `https://news.ycombinator.com/item?id=${selectedNews.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold" title="Open in new tab">
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'الرابط الأصلي' : 'Original URL'}</span>
                </a>
                <button onClick={() => setSelectedNews(null)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
              <iframe 
                src={selectedNews.url || `https://news.ycombinator.com/item?id=${selectedNews.id}`} 
                className="absolute inset-0 w-full h-full border-0 bg-white"
                title={selectedNews.title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechNewsWidget;
