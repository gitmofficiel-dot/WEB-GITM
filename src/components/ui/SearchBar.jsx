import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { shouldEmitSearch, syncExternalSearchValue } from '../../utils/searchBarSync';

const SearchBar = ({ onSearch, placeholder, isSearching, debounceTime = 500, value }) => {
  const isControlled = value !== undefined;
  const initialSync = isControlled ? syncExternalSearchValue(value) : { nextInput: '', nextLastEmitted: '' };
  const [prevExternalValue, setPrevExternalValue] = useState(initialSync.nextInput);
  const [query, setQuery] = useState(initialSync.nextInput);
  const onSearchRef = useRef(onSearch);
  const lastEmittedRef = useRef(initialSync.nextLastEmitted);
  const { t, language } = useLanguage();

  if (isControlled && initialSync.nextInput !== prevExternalValue) {
    setPrevExternalValue(initialSync.nextInput);
    setQuery(initialSync.nextInput);
  }

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!isControlled) return;
    lastEmittedRef.current = syncExternalSearchValue(value).nextLastEmitted;
  }, [isControlled, value]);

  useEffect(() => {
    const { shouldEmit, next } = shouldEmitSearch(query, lastEmittedRef.current);
    if (!shouldEmit) return undefined;

    const timer = setTimeout(() => {
      if (next !== lastEmittedRef.current) {
        lastEmittedRef.current = next;
        onSearchRef.current?.(next);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, debounceTime]);

  const clearSearch = () => {
    setQuery('');
    if (lastEmittedRef.current !== '') {
      lastEmittedRef.current = '';
      onSearchRef.current?.('');
    }
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
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center rtl:right-auto rtl:left-0 rtl:pl-3 rtl:pr-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
