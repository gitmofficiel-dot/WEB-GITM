import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, Github, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function AuthForms({ initialMode = 'login', setView }) {
  const { lang, loginUser, registerUser } = useLanguage();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      // Simulate checking credentials
      loginUser(email, 'member', '');
    } else {
      registerUser(email, name);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 dark:bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 mb-4 shadow-lg">
              {mode === 'login' ? <LogIn className="text-white w-8 h-8" /> : <UserPlus className="text-white w-8 h-8" />}
            </div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-800 dark:text-white mb-2">
              {mode === 'login' 
                ? txt(lang, 'Welcome Back', 'مرحباً بعودتك', 'Bon retour', '欢迎回来')
                : txt(lang, 'Create Account', 'إنشاء حساب جديد', 'Créer un compte', '创建账户')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === 'login' 
                ? txt(lang, 'Sign in to access your dashboard', 'سجل دخولك للوصول إلى لوحة التحكم', 'Connectez-vous pour accéder à votre tableau de bord', '登录以访问您的仪表板')
                : txt(lang, 'Join GITM to explore courses and projects', 'انضم إلى GITM لاستكشاف الدورات والمشاريع', 'Rejoignez le GITM pour explorer les cours et projets', '加入 GITM 以探索课程和项目')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {txt(lang, 'Full Name', 'الاسم الكامل', 'Nom complet', '全名')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {txt(lang, 'Email Address', 'البريد الإلكتروني', 'Adresse e-mail', '电子邮件地址')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                <span>{txt(lang, 'Password', 'كلمة المرور', 'Mot de passe', '密码')}</span>
                {mode === 'login' && (
                  <button type="button" onClick={() => setView('forgot-password')} className="text-teal-600 dark:text-cyan-400 hover:underline text-xs">
                    {txt(lang, 'Forgot Password?', 'نسيت كلمة المرور؟', 'Mot de passe oublié?', '忘记密码？')}
                  </button>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
            >
              {mode === 'login' 
                ? txt(lang, 'Sign In', 'تسجيل الدخول', 'Se connecter', '登录') 
                : txt(lang, 'Sign Up', 'تسجيل حساب', 'S\'inscrire', '注册')}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:rotate-180 w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' ? (
              <p>
                {txt(lang, 'Don\'t have an account?', 'ليس لديك حساب؟', 'Vous n\'avez pas de compte?', '没有账户？')}{' '}
                <button onClick={() => setMode('register')} type="button" className="font-bold text-teal-600 dark:text-cyan-400 hover:underline transition-colors">
                  {txt(lang, 'Sign up now', 'سجل الآن', 'Inscrivez-vous maintenant', '现在注册')}
                </button>
              </p>
            ) : (
              <p>
                {txt(lang, 'Already have an account?', 'لديك حساب بالفعل؟', 'Vous avez déjà un compte?', '已有账户？')}{' '}
                <button onClick={() => setMode('login')} type="button" className="font-bold text-teal-600 dark:text-cyan-400 hover:underline transition-colors">
                  {txt(lang, 'Sign in here', 'سجل دخولك هنا', 'Connectez-vous ici', '在此登录')}
                </button>
              </p>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <button onClick={() => setView('verify-certificate')} type="button" className="flex items-center justify-center w-full gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-cyan-400 transition">
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'التحقق من الشهادات' : 'Verify a Certificate'}</span>
              </button>

              <button type="button" className="flex items-center justify-center w-full gap-2 py-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-cyan-400 transition">
                <Github className="w-4 h-4" />
                <span>{lang === 'ar' ? 'المتابعة عبر GitHub' : 'Continue with GitHub'}</span>
              </button>

              <button 
                type="button" 
                onClick={() => alert('Web3 Wallet Connection simulated!')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 text-sm font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
              >
                <LinkIcon className="w-4 h-4" />
                {lang === 'ar' ? 'ربط المحفظة (Web3)' : 'Connect Wallet (Web3)'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
