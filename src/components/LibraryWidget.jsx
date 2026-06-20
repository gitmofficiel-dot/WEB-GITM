import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, AlertCircle, ExternalLink, Bookmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LibraryWidget = () => {
  const { lang, savedItems, toggleSave } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('programming');

  const fetchBooks = async (query) => {
    setLoading(true);
    setError(false);
    try {
      // Add User-Agent as per Open Library guidelines
      const headers = {
        'User-Agent': 'GITM-Academy-App (gitm.officiel@gmail.com)'
      };
      
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=4`, { headers });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBooks(data.docs || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, []);

  const title = lang === 'ar' ? 'مكتبة البرمجة' : 'Programming Library';

  if (loading) return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-center min-h-[300px] border border-white/20 dark:border-gray-700/50">
      <Loader className="animate-spin text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-center min-h-[300px] border border-red-200 dark:border-red-800 text-red-500">
      <AlertCircle className="mr-2" /> {lang === 'ar' ? 'خطأ في جلب الكتب' : 'Error loading books'}
    </div>
  );

  return (
    <div className="glass-card p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-orbitron flex items-center gap-2 text-slate-800 dark:text-white">
          <BookOpen className="text-blue-500" /> {title}
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks(searchQuery)}
            placeholder={lang === 'ar' ? 'ابحث عن كتاب...' : 'Search books...'}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-blue-500 text-slate-800 dark:text-white w-32 sm:w-48"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10 flex items-center justify-center gap-2">
          <AlertCircle /> {lang === 'ar' ? 'خطأ في جلب الكتب' : 'Error loading books'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {books.map((book) => {
            const isSaved = savedItems?.books?.some(b => b.key === book.key);
            return (
            <div 
              key={book.key} 
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-slate-100 dark:border-slate-800 group relative"
            >
              <a href={`https://openlibrary.org${book.key}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                {book.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} 
                    alt={book.title} 
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                ) : (
                <div className="w-12 h-16 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center shadow-sm">
                  <BookOpen size={20} className="text-slate-400" />
                </div>
                )}
              </a>
              <div className="flex-1 min-w-0 pr-6">
                <a href={`https://openlibrary.org${book.key}`} target="_blank" rel="noopener noreferrer" className="block">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {book.title}
                  </h4>
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {book.author_name?.[0] || 'Unknown Author'}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <button 
                    onClick={() => toggleSave('books', book)}
                    className={`p-1 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    title={isSaved ? 'Unsave' : 'Save'}
                  >
                    <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                  </button>
                  <a href={`https://openlibrary.org${book.key}`} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-blue-500">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default LibraryWidget;
