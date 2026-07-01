import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, Menu, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { lang, changeLanguage, theme, toggleTheme, user, logoutUser } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const navItems = [
    { id: 'news', path: '/news', label: { ar: 'الأخبار', en: 'News' } },
    { id: 'academy', path: '/academy', label: { ar: 'الأكاديمية', en: 'Academy' } },
    { id: 'projects-hub', path: '/projects-hub', label: { ar: 'المشاريع', en: 'Projects' } },
    { id: 'events', path: '/events', label: { ar: 'الفعاليات', en: 'Events' } },
    { id: 'about-us', path: '/about-us', label: { ar: 'من نحن', en: 'About Us' } }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-soft' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gitm-red to-gitm-green text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-gitm-red/30 group-hover:scale-105 transition-transform">
              GT
            </div>
            <span className="font-bold text-xl tracking-tight text-gitm-textLight dark:text-gitm-textDark">
              GITM
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'text-gitm-red dark:text-gitm-green' 
                      : 'text-gitm-mutedLight dark:text-gitm-mutedDark hover:text-gitm-textLight dark:hover:text-gitm-textDark hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gitm-red to-gitm-green text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                <AnimatePresence>
                  {profileDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gitm-cardDark border border-gray-200 dark:border-gitm-borderDark rounded-xl shadow-xl z-50 overflow-hidden py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gitm-borderDark mb-2">
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark truncate">{user.email}</p>
                        </div>
                        <button onClick={() => {navigate('/dashboard/user'); setProfileDropdown(false)}} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                          <LayoutDashboard size={16} className="text-gitm-red"/> {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                        </button>
                        <button onClick={() => {logoutUser(); setProfileDropdown(false)}} className="w-full text-left rtl:text-right flex items-center gap-3 px-4 py-2 text-sm font-medium text-gitm-red hover:bg-red-50 dark:hover:bg-red-900/20 mt-1">
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
                className="bg-gitm-red hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-bold ml-2 transition-colors"
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 ml-1 text-gitm-textLight dark:text-gitm-textDark" onClick={() => setMobileOpen(true)}>
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
              <button onClick={() => navigate('/')} className="text-lg font-bold text-left rtl:text-right p-4 rounded-xl bg-gray-50 dark:bg-gitm-cardDark">
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => navigate(item.path)} 
                  className="text-lg font-bold text-left rtl:text-right p-4 rounded-xl bg-gray-50 dark:bg-gitm-cardDark"
                >
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              ))}
              
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gitm-borderDark flex justify-between">
                <button onClick={() => changeLanguage('ar')} className={`flex-1 py-3 text-center rounded-lg ${lang === 'ar' ? 'bg-gitm-red text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>العربية</button>
                <div className="w-4"></div>
                <button onClick={() => changeLanguage('en')} className={`flex-1 py-3 text-center rounded-lg ${lang === 'en' ? 'bg-gitm-red text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>English</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
