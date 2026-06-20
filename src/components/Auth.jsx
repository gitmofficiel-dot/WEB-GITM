import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, Key, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';

const Auth = () => {
  const { t, loginUser, registerUser, view, setView } = useLanguage();
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleAction = (e) => {
    e.preventDefault();
    if (!formData.email || (mode !== 'forgot' && !formData.password)) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (mode === 'register') {
      registerUser(formData.email, formData.name);
    } else if (mode === 'login') {
      // Find default role based on email keyword or just use student as default,
      // but they can choose from demo button below easily.
      loginUser(formData.email, 'student', formData.email.split('@')[0]);
    } else {
      alert('Password reset link sent to your professional email.');
      setMode('login');
    }
  };

  const demoAccounts = [
    { name: 'Dr. Yassine (President)', email: 'president@gitm.ma', role: 'president' },
    { name: 'Prof. Amine (Instructor)', email: 'teacher@gitm.ma', role: 'teacher' },
    { name: 'Eng. Sara (Team Member)', email: 'engineer@gitm.ma', role: 'member' },
    { name: 'Adam Alami (Student)', email: 'student@gitm.ma', role: 'student' },
    { name: 'UM6P University Delegate', email: 'partner.uni@um6p.ma', role: 'university' },
    { name: 'CNRST Funding Sponsor', email: 'sponsor@cnrst.ma', role: 'partner' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center grid-bg px-6">
      <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Core Form */}
        <div className="lg:col-span-6 p-8 rounded-2xl glass border border-cyan-300 dark:border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] dark:text-white mb-2 font-orbitron tracking-wide text-center lg:text-right rtl:text-right ltr:text-left">
              {mode === 'login' && t('auth.loginTitle')}
              {mode === 'register' && t('auth.registerTitle')}
              {mode === 'forgot' && t('auth.forgotPassword')}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8 mx-auto lg:mx-0"></div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAction} className="space-y-4 text-right rtl:text-right ltr:text-left">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-muted uppercase tracking-wider">{t('auth.name')}</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 rtl:left-3 rtl:right-auto" />
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 rtl:pl-10 rtl:pr-4 rounded-lg bg-cyan-100 dark:bg-black/40 border border-cyan-300 dark:border-white/5 focus:border-[#0d9488] dark:focus:border-emerald-500/40 text-[#0B132B] dark:text-white text-xs md:text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-muted uppercase tracking-wider">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 rtl:left-3 rtl:right-auto" />
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 rtl:pl-10 rtl:pr-4 rounded-lg bg-cyan-100 dark:bg-black/40 border border-cyan-300 dark:border-white/5 focus:border-[#0d9488] dark:focus:border-emerald-500/40 text-[#0B132B] dark:text-white text-xs md:text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-muted uppercase tracking-wider">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 rtl:left-3 rtl:right-auto" />
                    <input 
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 rtl:pl-10 rtl:pr-4 rounded-lg bg-cyan-100 dark:bg-black/40 border border-cyan-300 dark:border-white/5 focus:border-[#0d9488] dark:focus:border-emerald-500/40 text-[#0B132B] dark:text-white text-xs md:text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}



              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0d9488] to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 text-white dark:text-black text-xs font-bold uppercase tracking-wider transition-all hover:shadow-lg dark:hover:shadow-glow-emerald flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <span>{mode === 'login' ? t('auth.loginBtn') : mode === 'register' ? t('auth.registerBtn') : t('auth.forgotPassword')}</span>
              </button>
            </form>
          </div>

          {/* Footer switches */}
          <div className="mt-8 pt-4 border-t border-cyan-300 dark:border-white/5 text-center text-xs space-y-2">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('register')} className="text-[#0d9488] dark:text-emerald-400 font-semibold hover:underline block mx-auto">
                  {t('auth.dontHaveAccount')}
                </button>
                <button onClick={() => setMode('forgot')} className="text-slate-500 dark:text-cyber-muted hover:text-[#0d9488] dark:hover:text-white transition-colors block mx-auto">
                  {t('auth.forgotPassword')}
                </button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="text-[#0d9488] dark:text-emerald-400 font-semibold hover:underline block mx-auto">
                {t('auth.alreadyHaveAccount')}
              </button>
            )}
          </div>
        </div>

        {/* Right Card: Instant Demo Accounts Roster */}
        <div className="lg:col-span-6 p-8 rounded-2xl bg-black/40 border border-cyan-300 dark:border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white font-orbitron tracking-wide mb-2 flex items-center space-x-2 rtl:space-x-reverse text-right rtl:text-right ltr:text-left">
              <KeyRound size={20} className="text-cyan-400 animate-pulse" />
              <span>معاينة فورية (Demo Logins)</span>
            </h3>
            <p className="text-xs text-cyber-muted leading-relaxed mb-6 text-right rtl:text-right ltr:text-left">
              اضغط على أي حساب تجريبي أدناه لتسجيل الدخول الفوري والاطلاع المباشر على لوحات التحكم والوظائف المدمجة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => loginUser(account.email, account.role, account.name)}
                  className="p-4 rounded-xl bg-[#e0fcfc]/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-right rtl:text-right ltr:text-left flex flex-col justify-between hover:scale-[1.02] group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {account.name}
                  </span>
                  <span className="text-[10px] text-cyber-muted font-mono truncate mt-1">
                    {account.email}
                  </span>
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold font-orbitron mt-2.5 flex items-center justify-between">
                    <span>{account.role}</span>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 rtl:rotate-180" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 mt-6 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-[10px] text-cyber-muted font-mono text-left">
            [SYS] Local storage synced. Authentication token: DEMO_PERSISTENT_KEY.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
