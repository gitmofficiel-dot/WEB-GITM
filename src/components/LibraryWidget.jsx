import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, AlertCircle, ExternalLink, Bookmark, X, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LibraryWidget = () => {
  const navigate = useNavigate();
  const { lang, savedItems, toggleSave } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('programming');
  const [searchLang, setSearchLang] = useState('');

  const fetchBooks = async (query, langFilter = '') => {
    setLoading(true);
    setError(false);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      
      let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=4&key=${apiKey}`;
      if (langFilter && langFilter !== 'all') {
        url += `&langRestrict=${langFilter}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      const formattedBooks = (data.items || []).map(item => ({
        key: item.id,
        title: item.volumeInfo.title,
        author_name: item.volumeInfo.authors || ['Unknown Author'],
        cover_i: item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : null,
        first_publish_year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.substring(0, 4) : 'Unknown Year',
        publisher: item.volumeInfo.publisher ? [item.volumeInfo.publisher] : null,
        subject: item.volumeInfo.categories || null,
        previewLink: item.volumeInfo.previewLink
      }));
      
      setBooks(formattedBooks);
      setLoading(false);
    } catch (err) {
      console.error("Google Books Error:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery, searchLang);
  }, []);

  const title = lang === 'ar' ? 'مكتبة البرمجة' : 'Programming Library';

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-orbitron flex items-center gap-2 text-[#1e3a5f] dark:text-white">
          <BookOpen className="text-blue-500" /> {title}
        </h3>
        <div className="flex flex-wrap gap-2 justify-end">
          <select
            value={searchLang}
            onChange={(e) => {
              setSearchLang(e.target.value);
              fetchBooks(searchQuery, e.target.value);
            }}
            className="px-3 py-1 rounded-lg border border-cyan-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-blue-500 text-[#1e3a5f] dark:text-white"
          >
            <option value="">{lang === 'ar' ? 'كل اللغات' : 'All Langs'}</option>
            <option value="ar">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
            <option value="en">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
            <option value="fr">{lang === 'ar' ? 'الفرنسية' : 'French'}</option>
            <option value="zh">{lang === 'ar' ? 'الصينية' : 'Chinese'}</option>
            <option value="es">{lang === 'ar' ? 'الإسبانية' : 'Spanish'}</option>
          </select>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks(searchQuery, searchLang)}
            placeholder={lang === 'ar' ? 'ابحث عن كتاب...' : 'Search books...'}
            className="px-3 py-1 rounded-lg border border-cyan-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-blue-500 text-[#1e3a5f] dark:text-white w-28 sm:w-48"
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
            const coverUrl = book.cover_i || null;
            return (
            <div 
              key={book.key} 
              className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-slate-900/50 hover:bg-cyan-100 dark:hover:bg-slate-800/80 transition-colors border border-cyan-200 dark:border-slate-800 group relative"
            >
              <button onClick={() => navigate('/library/book', { state: { book } })} className="shrink-0 text-left">
                {coverUrl ? (
                  <img src={coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                ) : (
                  <div className="w-12 h-16 bg-cyan-200 dark:bg-slate-700 rounded flex items-center justify-center shadow-sm">
                    <Book size={20} className="text-slate-400" />
                  </div>
                )}
              </button>
              <div className="flex-1 min-w-0 pr-6">
                <button onClick={() => navigate('/library/book', { state: { book } })} className="block text-left">
                  <h4 className="font-semibold text-sm text-[#1e3a5f] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {book.title}
                  </h4>
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {book.author_name?.[0] || 'Unknown Author'}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <button 
                    onClick={() => toggleSave('books', book)}
                    className={`p-1 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-cyan-200 dark:hover:bg-slate-700'}`}
                    title={isSaved ? 'Unsave' : 'Save'}
                  >
                    <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                  </button>
                  <button onClick={() => navigate('/library/book', { state: { book } })} className="p-1 text-slate-400 hover:text-blue-500">
                    <ExternalLink size={14} />
                  </button>
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
