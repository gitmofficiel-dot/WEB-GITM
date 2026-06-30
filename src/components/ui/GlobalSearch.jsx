import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Newspaper, Calendar, FolderGit2, ArrowRight, Sun, Moon, Globe, LayoutDashboard, Home, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { lang, changeLanguage, theme, toggleTheme } = useLanguage();

  // Robust Searchable Data mapping
  const searchableData = [
    // Navigation
    { id: 'nav-home', type: 'page', title: { ar: 'الرئيسية', en: 'Home' }, path: '/', icon: Home },
    { id: 'nav-academy', type: 'page', title: { ar: 'الأكاديمية', en: 'Academy' }, path: '/academy', icon: BookOpen },
    { id: 'nav-news', type: 'page', title: { ar: 'الأخبار', en: 'News' }, path: '/news', icon: Newspaper },
    { id: 'nav-events', type: 'page', title: { ar: 'الفعاليات', en: 'Events' }, path: '/events', icon: Calendar },
    { id: 'nav-projects', type: 'page', title: { ar: 'المشاريع', en: 'Projects' }, path: '/projects-hub', icon: FolderGit2 },
    { id: 'nav-about', type: 'page', title: { ar: 'من نحن', en: 'About Us' }, path: '/about-us', icon: Users },
    { id: 'nav-dashboard', type: 'page', title: { ar: 'لوحة التحكم', en: 'Dashboard' }, path: '/dashboard', icon: LayoutDashboard },
    
    // Quick Actions
    { id: 'action-theme', type: 'action', title: { ar: 'تبديل المظهر (Dark/Light)', en: 'Toggle Theme (Dark/Light)' }, action: toggleTheme, icon: theme === 'dark' ? Sun : Moon },
    { id: 'action-lang-en', type: 'action', title: { ar: 'تغيير اللغة إلى الإنجليزية', en: 'Switch Language to English' }, action: () => changeLanguage('en'), icon: Globe },
    { id: 'action-lang-ar', type: 'action', title: { ar: 'تغيير اللغة إلى العربية', en: 'Switch Language to Arabic' }, action: () => changeLanguage('ar'), icon: Globe },
  ];

  // Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
    if (query.trim().length === 0) {
      // Show default suggestions when empty
      setResults(searchableData.slice(0, 5));
      return;
    }
    
    const searchString = query.toLowerCase();
    const filtered = searchableData.filter(item => {
      const titleAr = item.title.ar.toLowerCase();
      const titleEn = item.title.en.toLowerCase();
      return titleAr.includes(searchString) || titleEn.includes(searchString);
    });
    setResults(filtered);
  }, [query, lang, theme]);

  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, results, activeIndex]);

  const handleSelect = (item) => {
    if (item.type === 'page') {
      navigate(item.path);
    } else if (item.type === 'action') {
      item.action();
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-[90] flex items-center justify-center w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 group"
      >
        <Search size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white/90 dark:bg-[#11111b]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl z-[101] overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-4 bg-transparent">
                <Search className="text-cyan-500" size={24} />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث أو اكتب أمراً...' : 'Search or type a command...'}
                  className="flex-1 bg-transparent border-none outline-none text-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {results.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Search className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="text-lg font-medium">{lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results found'}</p>
                    <p className="text-sm mt-2 opacity-70">{lang === 'ar' ? 'حاول استخدام كلمات مفتاحية أخرى' : 'Try using different keywords'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((result, idx) => (
                      <button 
                        key={result.id}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelect(result)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          activeIndex === idx 
                            ? 'bg-cyan-50 dark:bg-cyan-500/10' 
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${
                            activeIndex === idx 
                              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            <result.icon size={20} />
                          </div>
                          <div className="text-left rtl:text-right">
                            <h4 className={`font-semibold text-lg ${activeIndex === idx ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-800 dark:text-white'}`}>
                              {result.title[lang] || result.title.en}
                            </h4>
                            <p className="text-xs text-slate-500 capitalize tracking-wide font-medium">{result.type === 'page' ? (lang === 'ar' ? 'صفحة' : 'Page') : (lang === 'ar' ? 'إجراء سريع' : 'Quick Action')}</p>
                          </div>
                        </div>
                        <ArrowRight className={`${activeIndex === idx ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-300 dark:text-slate-600'} transition-colors rtl:rotate-180`} size={20} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-black/20 flex justify-between items-center text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">↑</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">↓</span>
                    <span className="ml-1">{lang === 'ar' ? 'للتنقل' : 'to navigate'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">↵</span>
                    <span className="ml-1">{lang === 'ar' ? 'للاختيار' : 'to select'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-cyan-600 dark:text-cyan-500 font-bold">GITM</span> Spotlight
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
