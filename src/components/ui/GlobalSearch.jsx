import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Newspaper, Calendar, FolderGit2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // Mock Database for Algolia-style search
  const searchableData = [
    { id: 1, type: 'course', title: 'Edge AI Development', path: '/academy', icon: BookOpen },
    { id: 2, type: 'course', title: 'Python for Robotics', path: '/academy', icon: BookOpen },
    { id: 3, type: 'news', title: 'GITM Launches New Tech Hub', path: '/news/1', icon: Newspaper },
    { id: 4, type: 'event', title: 'React 19 Workshop', path: '/events/1', icon: Calendar },
    { id: 5, type: 'project', title: 'Smart Irrigation System', path: '/project-details/1', icon: FolderGit2 },
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
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    // Simulate Algolia fast search
    const filtered = searchableData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white dark:bg-[#11111b] border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl z-[101] overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3 bg-slate-50/50 dark:bg-[#181825]">
                <Search className="text-cyan-500" size={24} />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث عن الكورسات، الأخبار، المشاريع...' : 'Search courses, news, projects...'}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-slate-400"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query.length > 0 && results.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Search className="mx-auto mb-3 opacity-20" size={48} />
                    <p>{lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results found'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((result, idx) => (
                      <button 
                        key={result.id}
                        onClick={() => handleSelect(result.path)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                            <result.icon size={20} />
                          </div>
                          <div className="text-left rtl:text-right">
                            <h4 className="font-bold text-slate-800 dark:text-white">{result.title}</h4>
                            <p className="text-xs text-slate-500 capitalize">{result.type}</p>
                          </div>
                        </div>
                        <ArrowRight className="text-slate-600 dark:text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors rtl:rotate-180" size={18} />
                      </button>
                    ))}
                  </div>
                )}
                
                {query.length === 0 && (
                  <div className="p-8 text-center text-slate-600 dark:text-slate-400 text-sm">
                    {lang === 'ar' ? 'اكتب ما تبحث عنه للبدء' : 'Type to start searching'}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-[#181825] flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>{lang === 'ar' ? 'التنقل' : 'Navigate'}</span>
                  <span className="px-1 py-0.5 border rounded border-slate-300 dark:border-slate-600">↑↓</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  Powered by <span className="text-blue-500 font-bold">Algolia</span> (Mock)
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
