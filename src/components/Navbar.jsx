import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu, X, Sun, Moon, Globe, ChevronDown, User, LogIn,
  LayoutDashboard, Home, Newspaper, Image, Calendar, Code2,
  Users, BookOpen, Sparkles, FolderGit2, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from './ui/NotificationBell';

const Navbar = () => {
  const {
    lang, changeLanguage, t, languages, theme, toggleTheme,
    user, logoutUser
  } = useLanguage();

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeDropdowns = useCallback(() => {
    setLangDropdown(false);
    setProfileDropdown(false);
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: { ar: 'الالرئيسية', en: 'Home', fr: 'Accueil', zh: '首页' } },
    { id: 'news', icon: Newspaper, label: { ar: 'الأخبار', en: 'News', fr: 'Actualités', zh: '新闻' } },
    { id: 'academy', icon: BookOpen, label: { ar: 'الأكاديمية', en: 'Academy', fr: 'Académie', zh: '学院' } },
    { id: 'projects-hub', path: '/projects-hub', icon: FolderGit2, label: { ar: 'المشاريع', en: 'Projects', fr: 'Projets', zh: '项目' } },
    { id: 'gallery', path: '/gallery', icon: Image, label: { ar: 'المعرض', en: 'Gallery', fr: 'Galerie', zh: '画廊' } },
    { id: 'events', path: '/events', icon: Calendar, label: { ar: 'الفعاليات', en: 'Events', fr: 'Événements', zh: '活动' } },
    { id: 'about-us', path: '/about-us', icon: Users, label: { ar: 'من نحن', en: 'About Us', fr: 'À propos', zh: '关于我们' } }
  ];

  const langLabels = { ar: 'العربية', en: 'English', fr: 'Français', zh: '中文' };

  const isRTL = lang === 'ar';

  // --- Animation Variants ---
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, y: -10 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
    exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <>
      {/* ─── Top Navbar ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none'
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">

            {/* ─── Logo ─── */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-400 dark:group-hover:ring-indigo-500 transition-all duration-300 group-hover:scale-105">
                <img src="/logo.png" alt="GITM Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
                  GITM
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase leading-none mt-0.5">
                  Innovation Tech
                </span>
              </div>
            </button>

            {/* ─── Desktop Navigation ─── */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const itemPath = item.path || `/${item.id}`;
                const isActive = currentPath === itemPath || (item.id === 'home' && currentPath === '/');
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(itemPath)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label[lang] || item.label.en}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute inset-x-2 -bottom-[1px] h-0.5 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── Right Controls ─── */}
            <div className="flex items-center gap-1 sm:gap-1.5">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => { setLangDropdown(!langDropdown); setProfileDropdown(false); }}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                  title="Change Language"
                >
                  <Globe size={18} />
                  <span className="hidden sm:inline-block text-xs font-semibold uppercase">{lang}</span>
                </button>

                <AnimatePresence>
                  {langDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setLangDropdown(false)} />
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/30 z-20 overflow-hidden`}
                      >
                        {Object.entries(langLabels).map(([code, label]) => (
                          <button
                            key={code}
                            onClick={() => { changeLanguage(code); setLangDropdown(false); }}
                            className={`w-full px-4 py-2.5 text-sm font-medium text-left rtl:text-right transition-colors flex items-center justify-between ${
                              lang === code
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{label}</span>
                            {lang === code && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Notification Bell */}
              {user && <NotificationBell />}

              {/* Auth / Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setProfileDropdown(!profileDropdown); setLangDropdown(false); }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-slate-900">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] font-bold text-white">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)} />
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/30 z-20 overflow-hidden`}
                        >
                          {/* Profile Header */}
                          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                            <span className="inline-block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10">
                              {user.role}
                            </span>
                          </div>

                          {/* Dashboard Link */}
                          <button
                            onClick={() => {
                              const secureHash = Math.random().toString(36).substring(2, 10);
                              navigate(`/dashboard/${secureHash}`);
                              setProfileDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-medium text-left rtl:text-right text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                          >
                            <LayoutDashboard size={15} className="text-slate-400 dark:text-slate-500" />
                            <span>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                          </button>

                          {/* Logout */}
                          <button
                            onClick={() => { logoutUser(); setProfileDropdown(false); }}
                            className="w-full px-4 py-2.5 text-sm font-medium text-left rtl:text-right text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                          >
                            <LogIn size={15} />
                            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                >
                  <LogIn size={15} />
                  <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Full-Screen Overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Full-screen panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white dark:bg-slate-950"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { navigate('/'); setMobileOpen(false); }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img src="/logo.png" alt="GITM Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
                    GITM
                  </span>
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={22} className="text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Mobile nav links (centered) */}
              <motion.nav
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col items-center justify-center gap-2 px-6"
              >
                {navItems.map(item => {
                  const Icon = item.icon;
                  const itemPath = item.path || `/${item.id}`;
                  const isActive = currentPath === itemPath || (item.id === 'home' && currentPath === '/');
                  return (
                    <motion.button
                      key={item.id}
                      variants={mobileItemVariants}
                      onClick={() => { navigate(itemPath); setMobileOpen(false); }}
                      className={`w-full max-w-xs flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'} />
                      <span>{item.label[lang] || item.label.en}</span>
                    </motion.button>
                  );
                })}

                {/* Login CTA for unauthenticated users in mobile */}
                {!user && (
                  <motion.button
                    variants={mobileItemVariants}
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="w-full max-w-xs mt-4 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25"
                  >
                    <LogIn size={18} />
                    <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
                  </motion.button>
                )}
              </motion.nav>

              {/* Mobile footer */}
              <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                  © {new Date().getFullYear()} GITM — Innovation Tech
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
