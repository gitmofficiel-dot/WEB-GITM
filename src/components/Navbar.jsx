import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, Menu, X, LayoutDashboard, LogOut, ChevronDown, Search, Bell, Home, BookOpen, Calendar, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { algoliasearch } from 'algoliasearch';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { lang, changeLanguage, t, languages, theme, toggleTheme, users } = useLanguage();
  const { currentUser: user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const fetchSearchResults = async () => {
      try {
        const apiKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
        if (apiKey) {
          const client = algoliasearch('53BOZ8TCA9', apiKey);
          const { results } = await client.search([{ indexName: 'gitm_users', query: searchQuery }]);
          
          if (results && results[0] && results[0].hits) {
            setSearchResults(results[0].hits.map(h => ({
              id: h.objectID || h.id,
              name: h.name,
              memberId: h.memberId,
              role: h.role
            })));
          }
        } else {
          // Fallback to local array
          const q = searchQuery.toLowerCase();
          const results = (users || []).filter(u => 
            u.name.toLowerCase().includes(q) || 
            (u.memberId && u.memberId.toLowerCase().includes(q))
          );
          setSearchResults(results);
        }
      } catch (err) {
        console.warn("Algolia search failed (using fallback):", err);
        const q = searchQuery.toLowerCase();
        const results = (users || []).filter(u => 
          u.name.toLowerCase().includes(q) || 
          (u.memberId && u.memberId.toLowerCase().includes(q))
        );
        setSearchResults(results);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery, users]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  // Navigation items using translation keys
  const navItems = [
    { id: 'home', path: '/', tKey: 'nav.home' },
    { id: 'news', path: '/news', tKey: 'nav.news' },
    { id: 'academy', path: '/academy', tKey: 'nav.academy' },
    { id: 'projects-hub', path: '/projects-hub', tKey: 'nav.projects' },
    { id: 'events', path: '/events', tKey: 'nav.events' },
    { id: 'gallery', path: '/gallery', tKey: 'nav.gallery' },
    { id: 'about-us', path: '/about-us', tKey: 'nav.about' }
  ];

  const toolItems = [
    { id: 'verify', path: '/verify-certificate', tKey: 'nav.verifyCertificate', icon: '\uD83C\uDF93' },
    { id: 'contact', path: '/contact', tKey: 'nav.contactUs', icon: '\u2709\uFE0F' }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-soft' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="GITM Logo" 
              className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform" 
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative px-2 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'text-gitm-blue dark:text-gitm-cyan bg-blue-50/50 dark:bg-blue-900/20' 
                      : 'text-gitm-textLight dark:text-gitm-textDark hover:text-gitm-blue dark:hover:text-gitm-cyan hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {t(item.tKey)}
                </button>
              );
            })}

            {/* Innovation Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdown(!toolsDropdown)}
                className={`flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  toolsDropdown 
                    ? 'text-gitm-blue dark:text-gitm-cyan bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'text-gitm-textLight dark:text-gitm-textDark hover:text-gitm-blue dark:hover:text-gitm-cyan hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span>{t('nav.innovationHub')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${toolsDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {toolsDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setToolsDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-72 bg-white/95 dark:bg-[#0d1527]/95 backdrop-blur-xl border border-gray-200 dark:border-cyan-500/20 rounded-2xl shadow-2xl z-50 p-2 grid grid-cols-1 gap-1"
                    >
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 dark:text-cyan-400/80 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                        {t('nav.innovationHubDesc')}
                      </div>
                      {toolItems.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => { navigate(tool.path); setToolsDropdown(false); }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:text-gitm-blue dark:hover:text-cyan-300 transition-all text-left rtl:text-right"
                        >
                          <span className="text-base">{tool.icon}</span>
                          <span>{t(tool.tKey)}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2 relative">
            
            {/* Search Bar */}
            <div className="relative hidden sm:flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: 200, opacity: 1 }} 
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input 
                      type="text" 
                      placeholder={t('nav.searchFull')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-800 border-none outline-none rounded-lg text-gitm-textLight dark:text-gitm-textDark focus:ring-2 focus:ring-gitm-blue"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); }} 
                className="p-2.5 rounded-lg text-gitm-mutedLight dark:text-gitm-mutedDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchOpen && searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 right-0 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 py-2"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map(res => (
                        <button 
                          key={res.id} 
                          onClick={() => { navigate(`/profile/${res.id}`); setSearchOpen(false); setSearchQuery(''); }}
                          className="w-full text-left rtl:text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-col border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="font-bold text-sm text-gitm-textLight dark:text-gitm-textDark">{res.name}</span>
                          <span className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark">{res.memberId || 'N/A'} - {res.role}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-center text-gitm-mutedLight dark:text-gitm-mutedDark">
                        {t('nav.noResults')}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={toggleTheme} className="p-2.5 rounded-lg text-gitm-mutedLight dark:text-gitm-mutedDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <div className="relative">
                <button 
                  onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileDropdown(false); setLangDropdown(false); }} 
                  className="p-2.5 rounded-lg text-gitm-mutedLight dark:text-gitm-mutedDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-80 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <h4 className="font-bold text-sm text-gitm-textLight dark:text-gitm-textDark">{t('nav.notifications')}</h4>
                          <div className="flex gap-2 items-center">
                            {unreadCount > 0 && (
                              <button onClick={() => markAllAsRead()} className="text-xs text-gitm-blue hover:underline">
                                {t('nav.markAllRead')}
                              </button>
                            )}
                            <span className="text-xs bg-gitm-blue text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                          </div>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              {t('nav.noNotifications')}
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => { markAsRead(n.id); if(n.link) { navigate(n.link); setNotificationsOpen(false); } }}
                                className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                              >
                                <h5 className="font-bold text-sm text-gitm-textLight dark:text-gitm-textDark mb-1">{n.title}</h5>
                                <p className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark mb-1">{n.message}</p>
                                <span className="text-[10px] text-gray-400">
                                  {n.createdAt && typeof n.createdAt.toDate === 'function' ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(n.createdAt.toDate()) : 'Recently'}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            
            <div className="relative hidden sm:block">
              <button 
                onClick={() => { setLangDropdown(!langDropdown); setProfileDropdown(false); }}
                className="flex items-center gap-1 p-2.5 rounded-lg text-sm font-semibold text-gitm-mutedLight dark:text-gitm-mutedDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe size={18} />
                <span className="uppercase ml-1">{lang}</span>
                <ChevronDown size={14} className="ml-1 opacity-50" />
              </button>
              
              <AnimatePresence>
                {langDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden py-1"
                    >
                      {Object.entries(languages).map(([code, langInfo]) => (
                        <button 
                          key={code}
                          onClick={() => {changeLanguage(code); setLangDropdown(false)}} 
                          className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${lang === code ? 'text-gitm-blue font-bold' : ''}`}
                        >
                          <span>{langInfo.flag}</span>
                          <span>{langInfo.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => { setProfileDropdown(!profileDropdown); setLangDropdown(false); }}
                  className="flex items-center gap-2 pl-3 pr-1 py-1.5 ml-2 rounded-full border border-gray-200 dark:border-gitm-borderDark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gitm-blue text-white flex items-center justify-center text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {profileDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 right-0 rtl:left-0 rtl:right-auto w-56 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gitm-borderDark mb-2 flex items-center gap-3">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gitm-blue text-white flex items-center justify-center text-sm font-bold">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate">{user.name}</p>
                            <p className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark truncate">{user.email}</p>
                          </div>
                        </div>
                        <button onClick={() => {navigate('/dashboard'); setProfileDropdown(false)}} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                          <LayoutDashboard size={16} className="text-gitm-blue"/> {t('nav.dashboard')}
                        </button>
                        <button onClick={async () => { await logout(); navigate('/'); setProfileDropdown(false); }} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1">
                          <LogOut size={16}/> {t('nav.logout')}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-gitm-blue hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold ml-1 sm:ml-2 transition-colors"
              >
                {t('nav.login')}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 ml-1 text-gitm-textLight dark:text-gitm-textDark" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-gitm-light dark:bg-gitm-dark flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gitm-borderDark">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="GITM" className="h-8 object-contain" />
                <span className="font-bold text-xl">GITM</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-full active:scale-95 transition-transform">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 scroll-container">
              {/* Search Bar in Mobile Menu */}
              <div className="relative mb-2">
                <Search size={18} className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rtl:pr-10 rtl:pl-3 text-sm bg-gray-100 dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl text-gitm-textLight dark:text-gitm-textDark focus:ring-2 focus:ring-gitm-blue outline-none"
                />
              </div>

              {navItems.map(item => {
                const isActive = currentPath === item.path;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => { navigate(item.path); setMobileOpen(false); }} 
                    className={`text-base font-bold text-left rtl:text-right p-4 rounded-xl transition-colors active:scale-[0.98] ${
                      isActive 
                        ? 'bg-gitm-blue/10 dark:bg-gitm-blue/20 text-gitm-blue dark:text-gitm-cyan border border-gitm-blue/20' 
                        : 'bg-gray-50 dark:bg-gitm-cardDark hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {t(item.tKey)}
                  </button>
                );
              })}

              {/* Innovation Tools in Mobile Menu */}
              <div className="mt-2 pt-4 border-t border-gray-200 dark:border-gitm-borderDark">
                <h4 className="text-xs font-bold text-gray-500 dark:text-cyan-400 uppercase tracking-wider mb-2 px-1">
                  {t('nav.innovationHub')}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {toolItems.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => { navigate(tool.path); setMobileOpen(false); }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gitm-cardDark hover:bg-cyan-500/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors text-left rtl:text-right"
                    >
                      <span>{tool.icon}</span>
                      <span className="truncate">{t(tool.tKey)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Theme Toggle in Mobile Menu */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gitm-borderDark">
                <button 
                  onClick={toggleTheme} 
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gitm-cardDark"
                >
                  <span className="font-bold text-sm">{t('nav.darkMode')}</span>
                  <div className={`w-12 h-7 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-gitm-blue' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'}`} />
                  </div>
                </button>
              </div>

              {/* Language Selection */}
              <div className="mt-2 pt-4 border-t border-gray-200 dark:border-gitm-borderDark">
                <h4 className="text-xs font-bold text-gitm-mutedLight dark:text-gitm-mutedDark uppercase tracking-wider mb-3 px-1">
                  {t('nav.chooseLanguage')}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(languages).map(([code, langInfo]) => (
                    <button 
                      key={code}
                      onClick={() => changeLanguage(code)} 
                      className={`py-2.5 text-center rounded-lg text-sm font-bold transition-colors active:scale-95 ${lang === code ? 'bg-gitm-blue text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                      {langInfo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App-like Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-gitm-borderDark mobile-bottom-nav px-2 sm:px-4 pt-2 pb-3 flex justify-between items-center shadow-[0_-4px_30px_rgba(0,0,0,0.12)]">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center justify-center gap-1 w-[20%] py-1 rounded-xl transition-colors active:scale-95 ${currentPath === '/' ? 'text-gitm-blue' : 'text-gray-400 dark:text-gray-500'}`}>
          <Home size={20} strokeWidth={currentPath === '/' ? 2.5 : 1.5} />
          <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{t('nav.home')}</span>
          {currentPath === '/' && <span className="mobile-nav-active-dot" />}
        </button>
        <button onClick={() => navigate('/news')} className={`flex flex-col items-center justify-center gap-1 w-[20%] py-1 rounded-xl transition-colors active:scale-95 ${currentPath.startsWith('/news') ? 'text-gitm-blue' : 'text-gray-400 dark:text-gray-500'}`}>
          <Compass size={20} strokeWidth={currentPath.startsWith('/news') ? 2.5 : 1.5} />
          <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{t('nav.explore')}</span>
          {currentPath.startsWith('/news') && <span className="mobile-nav-active-dot" />}
        </button>
        <button onClick={() => navigate('/academy')} className={`flex flex-col items-center justify-center gap-1 w-[20%] py-1 rounded-xl transition-colors active:scale-95 ${currentPath === '/academy' ? 'text-gitm-blue' : 'text-gray-400 dark:text-gray-500'}`}>
          <BookOpen size={20} strokeWidth={currentPath === '/academy' ? 2.5 : 1.5} />
          <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{t('nav.academy')}</span>
          {currentPath === '/academy' && <span className="mobile-nav-active-dot" />}
        </button>
        <button onClick={() => navigate('/events')} className={`flex flex-col items-center justify-center gap-1 w-[20%] py-1 rounded-xl transition-colors active:scale-95 ${currentPath.startsWith('/events') ? 'text-gitm-blue' : 'text-gray-400 dark:text-gray-500'}`}>
          <Calendar size={20} strokeWidth={currentPath.startsWith('/events') ? 2.5 : 1.5} />
          <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{t('nav.events')}</span>
          {currentPath.startsWith('/events') && <span className="mobile-nav-active-dot" />}
        </button>
        <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center justify-center gap-1 w-[20%] py-1 rounded-xl text-gray-400 dark:text-gray-500 active:scale-95 transition-transform">
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{t('nav.more')}</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
