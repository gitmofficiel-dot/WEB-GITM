import React, { useState, useEffect } from 'react';
import { Newspaper, Loader, AlertCircle, ExternalLink, Bookmark, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TechNewsWidget = () => {
  const { lang, savedItems, toggleSave } = useLanguage();
  const [news, setNews] = useState([]);
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
            
            <a href={item.url || `https://news.ycombinator.com/item?id=${item.id}`} target="_blank" rel="noopener noreferrer">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                {item.title}
              </h4>
            </a>
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
                <a href={item.url || `https://news.ycombinator.com/item?id=${item.id}`} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-cyan-500">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default TechNewsWidget;
