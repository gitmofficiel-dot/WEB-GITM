import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Menu, X, Sun, Moon, Globe, ChevronDown, User, LogIn, 
  LayoutDashboard, Home, Newspaper, Image, Calendar, Code2,
  Users, BookOpen, Sparkles, FolderGit2, Activity, Search
} from 'lucide-react';
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

  const navItems = [
    { id: 'home', icon: Home, label: { ar: 'الالرئيسية', en: 'Home', fr: 'Accueil', zh: '首页' } },
    { id: 'news', icon: Newspaper, label: { ar: 'الأخبار', en: 'News', fr: 'Actualités', zh: '新闻' } },
    { id: 'academy', icon: BookOpen, label: { ar: 'الأكاديمية', en: 'Academy', fr: 'Académie', zh: '学院' } },
    { id: 'projects-hub', path: '/projects-hub', icon: FolderGit2, label: { ar: 'المشاريع', en: 'Projects', fr: 'Projets', zh: '项目' } },
    { id: 'gallery', path: '/gallery', icon: Image, label: { ar: 'المعرض', en: 'Gallery', fr: 'Galerie', zh: '画廊' } },
    { id: 'events', path: '/events', icon: Calendar, label: { ar: 'الفعاليات', en: 'Events', fr: 'Événements', zh: '活动' } },
    { id: 'about-us', path: '/about-us', icon: Users, label: { ar: 'من نحن', en: 'About Us', fr: 'À propos', zh: '关于我们' } },
    { id: 'ai-features', path: '/ai-features', icon: Sparkles, label: { ar: 'الذكاء الاصطناعي', en: 'AI Features', fr: 'IA', zh: 'AI功能' } },
  ];

  const langLabels = { ar: 'العربية', en: 'English', fr: 'Français', zh: '中文' };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2 bg-[#e0fcfc]/80 dark:bg-cyber-bg/90 backdrop-blur-xl border-b border-cyan-300/50 dark:border-white/5 shadow-lg dark:shadow-none' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 rtl:space-x-reverse group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-glow-cyan group-hover:scale-110 transition-transform duration-300 bg-black/50 backdrop-blur-sm border border-cyan-500/20">
                <img src="/logo.png" alt="GITM Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-black text-[#1e3a5f] dark:text-white font-orbitron tracking-wider">GITM</span>
                <span className="text-[8px] text-slate-400 dark:text-cyber-muted block font-mono tracking-widest uppercase">
                  Innovation Tech
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
              {navItems.map(item => {
                const Icon = item.icon;
                const itemPath = item.path || `/${item.id}`;
                const isActive = currentPath === itemPath || (item.id === 'home' && currentPath === '/');
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(itemPath)}
                    className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-teal-500/10 dark:bg-[#00E5FF]/10 text-teal-600 dark:text-[#00E5FF] border border-teal-500/20 dark:border-[#00E5FF]/20'
                        : 'text-slate-600 dark:text-cyber-muted hover:text-[#1e3a5f] dark:hover:text-white hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label[lang] || item.label.en}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/5 text-slate-500 dark:text-cyber-muted hover:text-[#1e3a5f] dark:hover:text-white transition-all"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => { setLangDropdown(!langDropdown); setProfileDropdown(false); }}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-2 rounded-xl hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/5 text-slate-500 dark:text-cyber-muted hover:text-[#1e3a5f] dark:hover:text-white transition-all text-xs font-semibold"
                >
                  <Globe size={14} />
                  <span className="hidden sm:inline">{langLabels[lang]}</span>
                  <ChevronDown size={12} className={`transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {langDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLangDropdown(false)} />
                    <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-40 rounded-xl glass-strong border border-cyan-300 dark:border-white/10 shadow-xl z-20 overflow-hidden animate-fade-in-down">
                      {Object.entries(langLabels).map(([code, label]) => (
                        <button
                          key={code}
                          onClick={() => { changeLanguage(code); setLangDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-xs font-semibold text-left rtl:text-right transition-colors flex items-center justify-between ${
                            lang === code 
                              ? 'bg-teal-500/10 dark:bg-[#00E5FF]/10 text-teal-600 dark:text-[#00E5FF]' 
                              : 'text-slate-600 dark:text-cyber-muted hover:bg-cyan-50 dark:hover:bg-[#e0fcfc]/5'
                          }`}
                        >
                          <span>{label}</span>
                          {lang === code && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#00E5FF]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {user && <NotificationBell />}

              {/* Auth / Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setProfileDropdown(!profileDropdown); setLangDropdown(false); }}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-[#00E5FF]/10 border border-teal-500/20 dark:border-[#00E5FF]/20 hover:border-teal-500/40 dark:hover:border-[#00E5FF]/40 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 dark:from-[#00E5FF] dark:to-[#00FF87] flex items-center justify-center overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-white dark:text-black">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#2d507b] dark:text-white hidden sm:inline max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown size={12} className="text-slate-400 dark:text-cyber-muted" />
                  </button>

                  {profileDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)} />
                      <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-52 rounded-xl glass-strong border border-cyan-300 dark:border-white/10 shadow-xl z-20 overflow-hidden animate-fade-in-down">
                        <div className="px-4 py-3 border-b border-cyan-200 dark:border-white/5">
                          <p className="text-xs font-bold text-[#1e3a5f] dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-cyber-muted truncate">{user.email}</p>
                          <span className="text-[9px] font-mono text-teal-500 dark:text-[#00E5FF] uppercase font-bold mt-1 block">{user.role}</span>
                        </div>
                        <button
                          onClick={() => { 
                            const secureHash = Math.random().toString(36).substring(2, 10);
                            navigate(`/dashboard/${secureHash}`); 
                            setProfileDropdown(false); 
                          }}
                          className="w-full px-4 py-2.5 text-xs font-semibold text-left rtl:text-right text-slate-600 dark:text-cyber-muted hover:bg-cyan-50 dark:hover:bg-[#e0fcfc]/5 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <LayoutDashboard size={14} />
                          <span>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                        </button>
                        <button
                          onClick={() => { logoutUser(); setProfileDropdown(false); }}
                          className="w-full px-4 py-2.5 text-xs font-semibold text-left rtl:text-right text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <LogIn size={14} />
                          <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00E5FF] dark:to-[#00FF87] text-white dark:text-black hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <LogIn size={14} />
                  <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/5 text-slate-600 dark:text-cyber-muted"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 rtl:right-auto rtl:left-0 w-72 h-full bg-[#e0fcfc] dark:bg-cyber-bg border-l rtl:border-l-0 rtl:border-r border-cyan-300 dark:border-white/5 z-50 p-6 overflow-y-auto animate-slide-in-right lg:hidden">
            <div className="flex justify-between items-center mb-8">
              <span className="font-orbitron font-black text-lg text-[#1e3a5f] dark:text-white">GITM</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-cyan-100 dark:hover:bg-[#e0fcfc]/5">
                <X size={20} className="text-slate-500 dark:text-cyber-muted" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const itemPath = item.path || `/${item.id}`;
                const isActive = currentPath === itemPath || (item.id === 'home' && currentPath === '/');
                return (
                  <button
                    key={item.id}
                    onClick={() => { navigate(itemPath); setMobileOpen(false); }}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-500/10 dark:bg-[#00E5FF]/10 text-teal-600 dark:text-[#00E5FF] border border-teal-500/20 dark:border-[#00E5FF]/20'
                        : 'text-slate-600 dark:text-cyber-muted hover:bg-cyan-50 dark:hover:bg-[#e0fcfc]/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label[lang] || item.label.en}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
