import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, Github, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, googleProvider, githubProvider } from '../config/firebaseAuth';
import { signInWithPopup, updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function AuthForms({ initialMode = 'login', setView }) {
  const { lang, loginUser, registerUser } = useLanguage();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAuthError = (err) => {
    const code = err.code || err.message;
    if (code.includes('auth/unauthorized-domain')) {
      return txt(lang, 
        'This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.',
        'هذا النطاق (Domain) غير مصرح له بتسجيل الدخول في مشروع Firebase الخاص بك. يرجى الذهاب إلى لوحة تحكم Firebase > Authentication > Settings > Authorized domains وإضافة النطاق الحالي.',
        'Ce domaine n\'est pas autorisé pour les opérations OAuth. Modifiez la liste dans la console Firebase.',
        '此域未获授权进行 OAuth 操作。请从 Firebase 控制台编辑授权域列表。'
      );
    }
    if (code.includes('auth/invalid-credential')) {
      return txt(lang, 'Invalid email or password.', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'Email ou mot de passe invalide.', '无效的电子邮件或密码。');
    }
    if (code.includes('auth/email-already-in-use')) {
      return txt(lang, 'Email already in use.', 'هذا البريد الإلكتروني مستخدم بالفعل.', 'Cet e-mail est déjà utilisé.', '电子邮件已被使用。');
    }
    return err.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        // User logged in, context handles the state
      } else {
        await signup(email, password, name);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider) => {
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      loginUser(result.user.email, 'member', result.user.displayName || '');
    } catch (err) {
      setError(formatAuthError(err));
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
            <h2 className="text-3xl font-orbitron font-bold text-[#1e3a5f] dark:text-white mb-2">
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center">
                {error}
              </div>
            )}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-[#2d507b] dark:text-slate-300 mb-2">
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
                    className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-50 dark:bg-slate-800/50 text-[#0B132B] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2d507b] dark:text-slate-300 mb-2">
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
                  className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-50 dark:bg-slate-800/50 text-[#0B132B] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d507b] dark:text-slate-300 mb-2 flex justify-between">
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
                  className="block w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-50 dark:bg-slate-800/50 text-[#0B132B] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '...' : (mode === 'login' 
                ? txt(lang, 'Sign In', 'تسجيل الدخول', 'Se connecter', '登录') 
                : txt(lang, 'Sign Up', 'تسجيل حساب', 'S\'inscrire', '注册'))}
              {!loading && <ArrowRight className="ml-2 rtl:mr-2 rtl:rotate-180 w-4 h-4" />}
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
            
            <div className="mt-6 pt-6 border-t border-cyan-300 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  type="button" 
                  onClick={() => handleProviderSignIn(googleProvider)}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl border border-cyan-300 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-800 transition"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                  <span className="text-sm font-bold">Google</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => handleProviderSignIn(githubProvider)}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl border border-cyan-300 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-800 transition"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-bold">GitHub</span>
                </button>
              </div>

              <button onClick={() => setView('verify-certificate')} type="button" className="flex items-center justify-center w-full gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-cyan-400 transition">
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'التحقق من الشهادات' : 'Verify a Certificate'}</span>
              </button>

              <button 
                onClick={() => {
                  import('../utils/toast').then(({ toast }) => {
                    toast.info(lang === 'ar' ? 'ميزة ربط المحفظة ستتوفر قريباً!' : 'Web3 Wallet Connection coming soon!');
                  });
                }}
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
