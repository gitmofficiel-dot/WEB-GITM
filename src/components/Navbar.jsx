import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, ChevronDown, Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="pointer-events-auto floating-pill flex items-center justify-between px-6 py-3 rounded-full w-full max-w-5xl"
        >
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-full font-bold text-xs tracking-tighter transition-transform group-hover:scale-105">
              GT
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden sm:block">
              GITM
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 mx-8">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-black dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="navPill"
                      className="absolute inset-0 bg-slate-100 dark:bg-white/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-black dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => { setLangDropdown(!langDropdown); setProfileDropdown(false); }}
                className="p-2 text-slate-500 hover:text-black dark:hover:text-white transition-colors text-xs font-bold uppercase flex items-center gap-1"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{lang}</span>
              </button>
              {langDropdown && (
                <>
                  <div className="fixed inset-0" onClick={() => setLangDropdown(false)} />
                  <div className="absolute top-full mt-4 right-0 w-32 bg-white dark:bg-[#111] border-minimal rounded-xl shadow-xl overflow-hidden py-1 z-50">
                    <button onClick={() => {changeLanguage('ar'); setLangDropdown(false)}} className="w-full text-left rtl:text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">العربية</button>
                    <button onClick={() => {changeLanguage('en'); setLangDropdown(false)}} className="w-full text-left rtl:text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">English</button>
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => { setProfileDropdown(!profileDropdown); setLangDropdown(false); }}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border-minimal hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs font-bold truncate max-w-[80px] hidden sm:block">{user.name}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                {profileDropdown && (
                  <>
                    <div className="fixed inset-0" onClick={() => setProfileDropdown(false)} />
                    <div className="absolute top-full mt-4 right-0 w-48 bg-white dark:bg-[#111] border-minimal rounded-xl shadow-xl overflow-hidden py-1 z-50">
                      <button onClick={() => {navigate('/dashboard/user'); setProfileDropdown(false)}} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"><LayoutDashboard size={14}/> Dashboard</button>
                      <button onClick={() => {logoutUser(); setProfileDropdown(false)}} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><LogOut size={14}/> Logout</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="btn-primary px-4 py-1.5 rounded-full text-xs font-bold ml-2"
              >
                {lang === 'ar' ? 'دخول' : 'Log In'}
              </button>
            )}

            <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-black p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold">GITM</span>
              <button onClick={() => setMobileOpen(false)} className="p-2"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <button onClick={() => navigate('/')} className="text-left rtl:text-right">{lang === 'ar' ? 'الرئيسية' : 'Home'}</button>
              {navItems.map(item => (
                <button key={item.id} onClick={() => navigate(item.path)} className="text-left rtl:text-right">
                  {lang === 'ar' ? item.label.ar : item.label.en}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
