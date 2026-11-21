import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, KeyRound, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] pt-24 pb-16 bg-cyan-50/70 dark:bg-slate-900 flex flex-col items-center justify-center px-4"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 dark:bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-4 inline-flex items-center min-h-[44px] px-2 -mx-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition text-sm font-bold relative z-10"
        >
          <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180 shrink-0" />
          <span>{lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}</span>
        </button>

        <div className="relative z-10 text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
            {submitted ? <CheckCircle className="text-white w-7 h-7 sm:w-8 sm:h-8" /> : <KeyRound className="text-white w-7 h-7 sm:w-8 sm:h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
            {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {submitted
              ? (lang === 'ar' ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.')
              : (lang === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.' : 'Enter your email and we will send you a reset link.')}
          </p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] dark:text-slate-200 mb-1.5 text-start">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full min-h-[48px] ps-11 pe-4 py-3 text-base border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-[#0B132B] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all"
            >
              {lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
