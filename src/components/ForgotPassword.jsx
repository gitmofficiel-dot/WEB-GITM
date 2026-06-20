import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, KeyRound, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { lang, setView } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-cyan-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 dark:bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <button onClick={() => setView('login')} className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition text-sm font-medium relative z-10">
          <ArrowLeft className="w-4 h-4 mr-1 rtl:ml-1 rtl:rotate-180" /> {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </button>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 mb-4 shadow-lg">
            {submitted ? <CheckCircle className="text-white w-8 h-8" /> : <KeyRound className="text-white w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
            {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {submitted 
              ? (lang === 'ar' ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.')
              : (lang === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.' : 'Enter your email and we will send you a reset link.')}
          </p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-50 dark:bg-slate-800/50 text-[#0B132B] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              {lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
