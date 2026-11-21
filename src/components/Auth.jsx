import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, KeyRound, ArrowRight } from 'lucide-react';
import { toast } from '../utils/toast';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const Auth = () => {
  const { t, lang, loginUser, registerUser } = useLanguage();
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    if (!formData.email || (mode !== 'forgot' && !formData.password)) {
      setError(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      registerUser(formData.email, formData.name);
    } else if (mode === 'login') {
      loginUser(formData.email, 'student', formData.email.split('@')[0]);
    } else {
      try {
        await sendPasswordResetEmail(auth, formData.email);
        toast.success(lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك المهني.' : 'Password reset link sent to your professional email.');
        setMode('login');
      } catch (err) {
        console.error(err);
        toast.error(lang === 'ar' ? 'حدث خطأ. تأكد من صحة البريد الإلكتروني.' : 'Error sending password reset link.');
      }
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
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 flex items-center justify-center grid-bg px-4 md:px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">

        {/* Core Form Card */}
        <div className="lg:col-span-6 p-5 sm:p-8 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#1e3a5f] dark:text-white mb-2 font-sans tracking-tight text-start">
              {mode === 'login' && t('auth.loginTitle')}
              {mode === 'register' && t('auth.registerTitle')}
              {mode === 'forgot' && t('auth.forgotPassword')}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mb-6 md:mb-8 rounded-full" />

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAction} className="space-y-4 text-start">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('auth.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full min-h-[48px] ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-emerald-400 text-[#0B132B] dark:text-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full min-h-[48px] ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-emerald-400 text-[#0B132B] dark:text-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full min-h-[48px] ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-emerald-400 text-[#0B132B] dark:text-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0d9488] to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 text-white dark:text-slate-950 text-sm font-bold tracking-wide transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? t('auth.loginBtn') : mode === 'register' ? t('auth.registerBtn') : t('auth.forgotPassword')}</span>
              </button>
            </form>
          </div>

          {/* Footer switches (>=44px touch targets) */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-sm space-y-1">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="min-h-[44px] px-3 text-[#0d9488] dark:text-emerald-400 font-bold hover:underline inline-flex items-center justify-center"
                >
                  {t('auth.dontHaveAccount')}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="min-h-[44px] px-3 text-slate-600 dark:text-slate-300 hover:text-[#0d9488] dark:hover:text-white transition-colors inline-flex items-center justify-center"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="min-h-[44px] px-3 text-[#0d9488] dark:text-emerald-400 font-bold hover:underline inline-flex items-center justify-center"
              >
                {t('auth.alreadyHaveAccount')}
              </button>
            )}
          </div>
        </div>

        {/* Instant Demo Accounts Roster */}
        <div className="lg:col-span-6 p-5 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <h2 className="text-lg md:text-xl font-bold text-white font-sans tracking-tight mb-2 flex items-center gap-2 text-start">
              <KeyRound size={20} className="text-cyan-400 animate-pulse shrink-0" />
              <span>معاينة فورية (Demo Logins)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 text-start">
              اضغط على أي حساب تجريبي أدناه لتسجيل الدخول الفوري والاطلاع المباشر على لوحات التحكم والوظائف المدمجة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  type="button"
                  key={account.role}
                  onClick={() => loginUser(account.email, account.role, account.name)}
                  className="min-h-[44px] p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-start flex flex-col justify-between active:scale-[0.99] group"
                >
                  <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors break-words">
                    {account.name}
                  </span>
                  <span className="text-xs text-slate-300 font-mono truncate mt-1 w-full" dir="ltr">
                    {account.email}
                  </span>
                  <span className="text-xs text-cyan-400 uppercase tracking-wider font-bold mt-2.5 flex items-center justify-between w-full">
                    <span>{account.role}</span>
                    <ArrowRight size={14} className="opacity-70 group-hover:opacity-100 transition-all rtl:rotate-180" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 mt-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 font-mono text-left" dir="ltr">
            [SYS] Local storage synced. Authentication token: DEMO_PERSISTENT_KEY.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
