import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, Github, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, googleProvider, githubProvider } from '../config/firebaseAuth';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.65z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.07.72-2.45 1.15-4.05 1.15-3.12 0-5.76-2.11-6.7-4.95H1.29v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.29a12 12 0 0 0 0 10.8l4.01-3.1z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4.01 3.1c.94-2.84 3.58-4.95 6.7-4.95z" />
  </svg>
);

export default function AuthForms({ initialMode = 'login' }) {
  const { lang } = useLanguage();
  const { login, signup, currentUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  React.useEffect(() => {
    if (currentUser) {
      const secureHash = Math.random().toString(36).substring(2, 10);
      navigate(`/dashboard/${secureHash}`);
    }
  }, [currentUser, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAuthError = (err) => {
    const code = err.code || err.message;
    if (code.includes('auth/unauthorized-domain')) {
      return txt(
        lang,
        'This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.',
        'هذا النطاق (Domain) غير مصرح له بتسجيل الدخول في مشروع Firebase الخاص بك. يرجى الذهاب إلى لوحة تحكم Firebase > Authentication > Settings > Authorized domains وإضافة النطاق الحالي.',
        "Ce domaine n'est pas autorisé pour les opérations OAuth. Modifiez la liste dans la console Firebase.",
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
        import('../utils/toast').then(({ toast }) => {
          toast.success(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Successfully logged in!');
        });
      } else {
        await signup(email, password, name);
        import('../utils/toast').then(({ toast }) => {
          toast.success(lang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account successfully created!');
        });
      }
    } catch (err) {
      const errorMsg = formatAuthError(err);
      setError(errorMsg);
      import('../utils/toast').then(({ toast }) => {
        toast.error(errorMsg);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider) => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
      import('../utils/toast').then(({ toast }) => {
        toast.success(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Successfully logged in!');
      });
    } catch (err) {
      const errorMsg = formatAuthError(err);
      setError(errorMsg);
      import('../utils/toast').then(({ toast }) => {
        toast.error(errorMsg);
      });
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/15 dark:bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 mb-3 sm:mb-4 shadow-lg">
              {mode === 'login' ? <LogIn className="text-white w-7 h-7 sm:w-8 sm:h-8" /> : <UserPlus className="text-white w-7 h-7 sm:w-8 sm:h-8" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-[#1e3a5f] dark:text-white mb-1.5">
              {mode === 'login'
                ? txt(lang, 'Welcome Back', 'مرحباً بعودتك', 'Bon retour', '欢迎回来')
                : txt(lang, 'Create Account', 'إنشاء حساب جديد', 'Créer un compte', '创建账户')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {mode === 'login'
                ? txt(lang, 'Sign in to access your dashboard', 'سجل دخولك للوصول إلى لوحة التحكم', 'Connectez-vous pour accéder à votre tableau de bord', '登录以访问您的仪表板')
                : txt(lang, 'Join GITM to explore courses and projects', 'انضم إلى GITM لاستكشاف الدورات والمشاريع', 'Rejoignez le GITM pour explorer les cours et projets', '加入 GITM 以探索课程和项目')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] dark:text-slate-200 mb-1.5">
                  {txt(lang, 'Full Name', 'الاسم الكامل', 'Nom complet', '全名')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full min-h-[48px] ps-11 pe-4 py-3 text-base border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-[#0B132B] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder={txt(lang, 'Enter your full name', 'أدخل اسمك الكامل', 'Entrez votre nom complet', '输入您的全名')}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] dark:text-slate-200 mb-1.5">
                {txt(lang, 'Email Address', 'البريد الإلكتروني', 'Adresse e-mail', '电子邮件地址')}
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
                  className="block w-full min-h-[48px] ps-11 pe-4 py-3 text-base border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-[#0B132B] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder={txt(lang, 'you@example.com', 'name@example.com', 'vous@exemple.com', 'you@example.com')}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="block text-sm font-bold text-[#1e3a5f] dark:text-slate-200">
                  {txt(lang, 'Password', 'كلمة المرور', 'Mot de passe', '密码')}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="min-h-[44px] sm:min-h-0 px-1 text-teal-700 dark:text-cyan-400 hover:underline text-xs font-bold inline-flex items-center"
                  >
                    {txt(lang, 'Forgot Password?', 'نسيت كلمة المرور؟', 'Mot de passe oublié ?', '忘记密码？')}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full min-h-[48px] ps-11 pe-4 py-3 text-base border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-[#0B132B] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm sm:text-base font-bold text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              <span>
                {loading
                  ? '...'
                  : mode === 'login'
                    ? txt(lang, 'Sign In', 'تسجيل الدخول', 'Se connecter', '登录')
                    : txt(lang, 'Sign Up', 'تسجيل حساب', "S'inscrire", '注册')}
              </span>
              {!loading && <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {mode === 'login' ? (
              <p className="flex flex-wrap items-center justify-center gap-1">
                <span>{txt(lang, "Don't have an account?", 'ليس لديك حساب؟', "Vous n'avez pas de compte ?", '没有账户？')}</span>
                <button
                  onClick={() => setMode('register')}
                  type="button"
                  className="min-h-[44px] sm:min-h-0 px-1.5 font-bold text-teal-700 dark:text-cyan-400 hover:underline transition-colors inline-flex items-center"
                >
                  {txt(lang, 'Sign up now', 'سجل الآن', 'Inscrivez-vous maintenant', '现在注册')}
                </button>
              </p>
            ) : (
              <p className="flex flex-wrap items-center justify-center gap-1">
                <span>{txt(lang, 'Already have an account?', 'لديك حساب بالفعل؟', 'Vous avez déjà un compte ?', '已有账户？')}</span>
                <button
                  onClick={() => setMode('login')}
                  type="button"
                  className="min-h-[44px] sm:min-h-0 px-1.5 font-bold text-teal-700 dark:text-cyan-400 hover:underline transition-colors inline-flex items-center"
                >
                  {txt(lang, 'Sign in here', 'سجل دخولك هنا', 'Connectez-vous ici', '在此登录')}
                </button>
              </p>
            )}

            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleProviderSignIn(googleProvider)}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition active:scale-[0.98]"
                >
                  <GoogleIcon />
                  <span className="text-sm font-bold">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderSignIn(githubProvider)}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition active:scale-[0.98]"
                >
                  <Github className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">GitHub</span>
                </button>
              </div>

              <button
                onClick={() => navigate('/verify-certificate')}
                type="button"
                className="min-h-[44px] flex items-center justify-center w-full gap-2 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-cyan-400 font-medium transition"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'التحقق من الشهادات' : 'Verify a Certificate'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  import('../utils/toast').then(({ toast }) => {
                    toast.info(lang === 'ar' ? 'ميزة ربط المحفظة ستتوفر قريباً!' : 'Web3 Wallet Connection coming soon!');
                  });
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-purple-500/30 text-purple-700 dark:text-purple-400 text-sm font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
              >
                <LinkIcon className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'ربط المحفظة (Web3)' : 'Connect Wallet (Web3)'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
