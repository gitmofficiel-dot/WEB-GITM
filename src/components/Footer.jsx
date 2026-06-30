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
    <footer className="relative mt-24 pt-16 pb-8 border-t border-cyan-500/20 bg-[#0B132B]/80 dark:bg-[#0B132B]/80 backdrop-blur-xl overflow-hidden z-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-orbitron font-bold text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                GITM
              </div>
              <h2 className="font-orbitron font-bold text-2xl text-white tracking-wider">GITM</h2>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              {lang === 'ar' ? 'نصنع أنظمة ذكية تعيد تعريف المستقبل. نعمل على تطوير حلول في الذكاء الاصطناعي، إنترنت الأشياء، والروبوتات المتقدمة.' : 'We engineer smart systems that redefine the future. Developing cutting-edge solutions in AI, IoT, and Advanced Robotics.'}
            </p>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@GIT-MAROC" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/50 hover:-translate-y-1">
                <Youtube size={20} />
              </a>
              <a href="https://x.com/GITMAROC" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 border border-transparent hover:border-slate-700">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.936H5.045z"></path></g></svg>
              </a>
              <a href="https://www.facebook.com/share/1EMk6JsB4H/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-600/50 hover:-translate-y-1">
                <Facebook size={20} />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white transition-all shadow-lg hover:shadow-pink-600/50 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">
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
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>GITM Innovation Lab, Casablanca, Morocco</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={18} className="text-cyan-400 shrink-0" />
                <span>contact@gitm.ma</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={18} className="text-cyan-400 shrink-0" />
                <span dir="ltr">+212 5XX XX XX XX</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">
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
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-500"
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
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} GITM. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <ShieldCheck size={14} /> {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
