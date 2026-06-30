import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SearchBar = ({ onSearch, placeholder, isSearching, debounceTime = 500 }) => {
  const [query, setQuery] = useState('');
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== '') {
        onSearch(query);
      } else {
        onSearch('');
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, debounceTime, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3 rtl:pl-0">
        {isSearching ? (
          <Loader2 className="h-5 w-5 text-cyan-500 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-cyan-500/30 rounded-full leading-5 bg-white/5 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all glass rtl:pr-10 rtl:pl-10"
        placeholder={placeholder || t('searchPlaceholder', 'Search...')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center rtl:right-auto rtl:left-0 rtl:pl-3 rtl:pr-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
