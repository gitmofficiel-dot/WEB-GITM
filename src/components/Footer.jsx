import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Facebook, Twitter, Youtube, MapPin, Mail, Phone, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        subscribedAt: serverTimestamp()
      });
      toast.success(lang === 'ar' ? 'تم الاشتراك بنجاح! شكراً لك.' : 'Subscribed successfully! Thank you.');
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الاشتراك.' : 'Subscription failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="hidden md:block relative mt-12 md:mt-24 pt-10 md:pt-16 pb-28 md:pb-8 border-t border-cyan-500/20 bg-[#0B132B]/80 dark:bg-[#0B132B]/80 backdrop-blur-xl overflow-hidden z-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GITM Logo" className="w-12 h-12 object-contain" />
              <h2 className="font-sans font-bold tracking-tight font-bold text-2xl text-white tracking-wider">GITM</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              {lang === 'ar' ? 'نصنع أنظمة ذكية تعيد تعريف المستقبل. نعمل على تطوير حلول في الذكاء الاصطناعي، إنترنت الأشياء، والروبوتات المتقدمة.' : 'We engineer smart systems that redefine the future. Developing cutting-edge solutions in AI, IoT, and Advanced Robotics.'}
            </p>
            <div className="flex gap-3">
              <a href="https://www.youtube.com/@GIT-MAROC" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/50 hover:-translate-y-1 active:scale-95">
                <Youtube size={20} />
              </a>
              <a href="https://x.com/GITMAROC" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 border border-transparent hover:border-slate-700 active:scale-95">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.936H5.045z"></path></g></svg>
              </a>
              <a href="https://www.facebook.com/share/1EMk6JsB4H/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-600/50 hover:-translate-y-1">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'home', path: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
                { key: 'news', path: '/news', label: lang === 'ar' ? 'الأخبار' : 'News' },
                { key: 'events', path: '/events', label: lang === 'ar' ? 'الفعاليات' : 'Events' },
                { key: 'academy', path: '/academy', label: lang === 'ar' ? 'الأكاديمية' : 'Academy' },
                { key: 'projects', path: '/projects-hub', label: lang === 'ar' ? 'المشاريع' : 'Projects' }
              ].map(link => (
                <li key={link.key}>
                  <button onClick={() => navigate(link.path)} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all rtl:rotate-180" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>GITM Innovation Lab, OUED ZEM, Morocco</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail size={18} className="text-cyan-400 shrink-0" />
                <span>gitm.officiel@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Phone size={18} className="text-cyan-400 shrink-0" />
                <span dir="ltr">+212 618941409</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'النشرة البريدية' : 'Newsletter'}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {lang === 'ar' ? 'اشترك ليصلك أحدث مشاريعنا وابتكاراتنا.' : 'Subscribe to receive our latest projects and innovations.'}
            </p>
            <form className="relative" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/ dark:bg-slate-800/ border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-500"
                required
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 rtl:right-auto rtl:left-1 top-1 bottom-1 bg-cyan-500 hover:bg-cyan-400 text-[#0B132B] px-4 rounded-md font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : (lang === 'ar' ? 'اشترك' : 'Subscribe')}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} GITM. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <ShieldCheck size={14} /> {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <button onClick={() => navigate('/terms-of-service')} className="hover:text-cyan-400 transition-colors">
              {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
