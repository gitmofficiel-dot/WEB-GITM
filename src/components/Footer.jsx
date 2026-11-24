import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Facebook, Youtube, MapPin, Mail, Phone, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        subscribedAt: serverTimestamp()
      });
      toast.success(lang === 'ar' ? 'تم الاشتراك بنجاح! شكراً لك.' : lang === 'fr' ? 'Inscription réussie ! Merci.' : 'Subscribed successfully! Thank you.');
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الاشتراك.' : lang === 'fr' ? "Échec de l'inscription." : 'Subscription failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="block relative mt-6 md:mt-24 pt-2 md:pt-16 pb-2 md:pb-8 border-t border-cyan-500/20 bg-[#0B132B]/95 dark:bg-[#0B132B]/90 backdrop-blur-xl overflow-hidden z-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop 4-column Grid (Unchanged) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-6 md:mb-16">

          {/* Brand & About */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-white rounded-xl p-1.5 shadow-sm shrink-0">
                <img
                  src="/logo.png"
                  alt="GITM Logo"
                  className="w-9 h-9 md:w-10 md:h-10 object-contain"
                />
              </span>
              <h2 className="font-sans font-bold text-2xl text-white tracking-wider">GITM</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              {lang === 'ar'
                ? 'نصنع أنظمة ذكية تعيد تعريف المستقبل. نعمل على تطوير حلول في الذكاء الاصطناعي، إنترنت الأشياء، والروبوتات المتقدمة.'
                : lang === 'fr' ? "Nous concevons des systèmes intelligents qui redéfinissent l'avenir. Nous développons des solutions en IA, IoT et robotique avancée." : 'We engineer smart systems that redefine the future. Developing cutting-edge solutions in AI, IoT, and Advanced Robotics.'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@GIT-MAROC"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/50 hover:-translate-y-1 active:scale-95"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://x.com/GITMAROC"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 border border-transparent hover:border-slate-700 active:scale-95"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5">
                  <g>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.936H5.045z" />
                  </g>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1EMk6JsB4H/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 md:mb-6 border-b border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'روابط سريعة' : lang === 'fr' ? 'Liens rapides' : 'Quick Links'}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0 md:space-y-2.5">
              {[
                { key: 'home', path: '/', label: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home' },
                { key: 'news', path: '/news', label: lang === 'ar' ? 'الأخبار' : lang === 'fr' ? 'Actualités' : 'News' },
                { key: 'events', path: '/events', label: lang === 'ar' ? 'الفعاليات' : lang === 'fr' ? 'Événements' : 'Events' },
                { key: 'academy', path: '/academy', label: lang === 'ar' ? 'الأكاديمية' : lang === 'fr' ? 'Académie' : 'Academy' },
                { key: 'projects', path: '/projects-hub', label: lang === 'ar' ? 'المشاريع' : lang === 'fr' ? 'Projets' : 'Projects' }
              ].map(link => (
                <li key={link.key}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="min-h-[40px] md:min-h-0 text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight size={14} className="hidden md:block opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all rtl:rotate-180" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 md:mb-6 border-b border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{lang === 'fr' ? "Laboratoire d'innovation GITM, OUED ZEM, Maroc" : lang === 'ar' ? 'مختبر الابتكار GITM، وادي زم، المغرب' : 'GITM Innovation Lab, OUED ZEM, Morocco'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail size={18} className="text-cyan-400 shrink-0" />
                <span className="break-all">gitm.officiel@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Phone size={18} className="text-cyan-400 shrink-0" />
                <span dir="ltr">+212 618941409</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 md:mb-6 border-b border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'النشرة البريدية' : lang === 'fr' ? "Lettre d'information" : 'Newsletter'}
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              {lang === 'ar' ? 'اشترك ليصلك أحدث مشاريعنا وابتكاراتنا.' : lang === 'fr' ? 'Abonnez-vous pour recevoir nos derniers projets et innovations.' : 'Subscribe to receive our latest projects and innovations.'}
            </p>
            <form className="flex flex-col sm:block sm:relative gap-2.5" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : lang === 'fr' ? 'Votre e-mail' : 'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] md:min-h-0 bg-slate-800/80 border border-slate-700 rounded-xl md:rounded-lg py-2.5 px-4 text-white text-base md:text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-400"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-h-[48px] sm:min-h-0 sm:absolute sm:right-1 sm:rtl:right-auto sm:rtl:left-1 sm:top-1 sm:bottom-1 bg-cyan-500 hover:bg-cyan-400 text-[#0B132B] px-4 rounded-xl sm:rounded-md font-bold text-sm sm:text-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : (lang === 'ar' ? 'اشترك' : lang === 'fr' ? "S'abonner" : 'Subscribe')}
              </button>
            </form>
          </div>

        </div>

        {/* Mobile Compact View (< md, <=211px closed height on 390x844 incl. bottom-nav clearance) */}
        <div className="md:hidden space-y-1.5 mb-3">
          {/* Row 1: Brand & Compact Socials */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center bg-white rounded-md p-0.5 shadow-sm shrink-0">
                <img src="/logo.png" alt="GITM Logo" className="w-5 h-5 object-contain" />
              </span>
              <span className="font-sans font-bold text-sm text-white tracking-wider">GITM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <a href="https://www.youtube.com/@GIT-MAROC" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:text-white">
                <Youtube size={14} />
              </a>
              <a href="https://x.com/GITMAROC" target="_blank" rel="noopener noreferrer" aria-label="X" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:text-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-3 h-3">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.936H5.045z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1EMk6JsB4H/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:text-white">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Row 2: Accessible Expandable Controls for Contact & Newsletter */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                type="button"
                aria-expanded={expandedSection === 'contact'}
                aria-controls="mobile-contact-details"
                onClick={() => setExpandedSection(prev => prev === 'contact' ? null : 'contact')}
                className="w-full min-h-[34px] px-2.5 py-1 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-cyan-400"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin size={13} className="text-cyan-400 shrink-0" />
                  <span>{lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contact' : 'Contact'}</span>
                </span>
                <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${expandedSection === 'contact' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                type="button"
                aria-expanded={expandedSection === 'newsletter'}
                aria-controls="mobile-newsletter-details"
                onClick={() => setExpandedSection(prev => prev === 'newsletter' ? null : 'newsletter')}
                className="w-full min-h-[34px] px-2.5 py-1 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-cyan-400"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Mail size={13} className="text-cyan-400 shrink-0" />
                  <span>{lang === 'ar' ? 'النشرة' : lang === 'fr' ? 'Bulletin' : 'Newsletter'}</span>
                </span>
                <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${expandedSection === 'newsletter' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expanded Content Drawers */}
          {expandedSection === 'contact' && (
            <div id="mobile-contact-details" className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-cyan-400 shrink-0" />
                <span>{lang === 'fr' ? "Laboratoire d'innovation GITM, OUED ZEM, Maroc" : lang === 'ar' ? 'مختبر الابتكار GITM، وادي زم، المغرب' : 'GITM Innovation Lab, OUED ZEM, Morocco'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-cyan-400 shrink-0" />
                <a href="mailto:gitm.officiel@gmail.com" className="text-cyan-400 break-all">gitm.officiel@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-cyan-400 shrink-0" />
                <a href="tel:+212618941409" dir="ltr" className="hover:text-cyan-400">+212 618941409</a>
              </p>
            </div>
          )}

          {expandedSection === 'newsletter' && (
            <form id="mobile-newsletter-details" onSubmit={handleSubscribe} className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
              <input
                type="email"
                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : lang === 'fr' ? 'Votre e-mail' : 'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[38px] bg-slate-800 border border-slate-700 rounded-lg py-1 px-3 text-white text-xs focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[36px] bg-cyan-500 hover:bg-cyan-400 text-[#0B132B] px-3 rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : (lang === 'ar' ? 'اشترك في النشرة' : lang === 'fr' ? "S'abonner" : 'Subscribe')}
              </button>
            </form>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-1.5 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-0.5 md:gap-4 pe-16 md:pe-40 text-start">
          <p className="text-slate-300 text-[11px] leading-4 md:text-sm">
            &copy; {new Date().getFullYear()} GITM. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-0.5 md:gap-6 text-[11px] md:text-sm text-slate-300">
            <button
              type="button"
              onClick={() => navigate('/privacy-policy')}
              className="min-h-[28px] md:min-h-0 px-1.5 md:px-2 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={13} /> {lang === 'ar' ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy Policy'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/terms-of-service')}
              className="min-h-[28px] md:min-h-0 px-1.5 md:px-2 hover:text-cyan-400 transition-colors"
            >
              {lang === 'ar' ? 'شروط الاستخدام' : lang === 'fr' ? "Conditions d'utilisation" : 'Terms of Service'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
