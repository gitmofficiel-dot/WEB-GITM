import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, Menu, X, LayoutDashboard, LogOut, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { lang, changeLanguage, theme, toggleTheme, user, logoutUser, users } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = (users || []).filter(u => 
      u.name.toLowerCase().includes(q) || 
      (u.memberId && u.memberId.toLowerCase().includes(q))
    );
    setSearchResults(results);
  }, [searchQuery, users]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  // Restored full navigation items as requested
  const navItems = [
    { id: 'home', path: '/', label: { ar: 'الرئيسية', en: 'Home' } },
    { id: 'news', path: '/news', label: { ar: 'الأخبار', en: 'News' } },
    { id: 'academy', path: '/academy', label: { ar: 'الأكاديمية', en: 'Academy' } },
    { id: 'projects-hub', path: '/projects-hub', label: { ar: 'المشاريع', en: 'Projects' } },
    { id: 'events', path: '/events', label: { ar: 'الفعاليات', en: 'Events' } },
    { id: 'gallery', path: '/gallery', label: { ar: 'المعرض', en: 'Gallery' } },
    { id: 'about-us', path: '/about-us', label: { ar: 'من نحن', en: 'About Us' } }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-soft' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Restored Clean Logo */}
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
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 relative">
            
            {/* Search Bar */}
            <div className="relative flex items-center">
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
                      placeholder={lang === 'ar' ? 'الاسم أو رقم العضوية...' : 'Name or Member ID...'}
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
                        {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={toggleTheme} className="p-2.5 rounded-lg text-gitm-mutedLight dark:text-gitm-mutedDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
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
                      className="absolute top-full mt-2 right-0 w-32 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden py-1"
                    >
                      <button onClick={() => {changeLanguage('ar'); setLangDropdown(false)}} className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">العربية</button>
                      <button onClick={() => {changeLanguage('en'); setLangDropdown(false)}} className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">English</button>
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
                        className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden py-2"
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
                        <button onClick={() => {navigate('/dashboard/user'); setProfileDropdown(false)}} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                          <LayoutDashboard size={16} className="text-gitm-blue"/> {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                        </button>
                        <button onClick={() => {logoutUser(); setProfileDropdown(false)}} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1">
                          <LogOut size={16}/> {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-gitm-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold ml-2 transition-colors"
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 ml-1 text-gitm-textLight dark:text-gitm-textDark" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
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
              <span className="font-bold text-xl">GITM Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { navigate(item.path); setMobileOpen(false); }} 
                  className="text-lg font-bold text-left rtl:text-right p-4 rounded-xl bg-gray-50 dark:bg-gitm-cardDark"
                >
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              ))}
              
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gitm-borderDark flex justify-between">
                <button onClick={() => changeLanguage('ar')} className={`flex-1 py-3 text-center rounded-lg ${lang === 'ar' ? 'bg-gitm-blue text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>العربية</button>
                <div className="w-4"></div>
                <button onClick={() => changeLanguage('en')} className={`flex-1 py-3 text-center rounded-lg ${lang === 'en' ? 'bg-gitm-blue text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>English</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
