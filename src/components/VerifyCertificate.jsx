import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

export default function VerifyCertificate() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [certId, setCertId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, valid, invalid
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setCertId(idFromUrl);
      verifyId(idFromUrl);
    }
  }, [location.search]);

  const verifyId = async (idToVerify) => {
    setStatus('loading');

    try {
      const { db } = await import('../config/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      const upperId = idToVerify.toUpperCase();
      const docRef = doc(db, 'certificates', upperId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCertData({
          ...docSnap.data(),
          id: upperId
        });
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setStatus('invalid');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    verifyId(certId);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen pt-20 md:pt-24 pb-24 md:pb-12 bg-cyan-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 overflow-x-hidden"
    >
      <div className="max-w-3xl mx-auto w-full mb-6 md:mb-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label={lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          className="min-h-[44px] px-2 -ms-2 inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 font-semibold text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5 shrink-0 rtl:rotate-180" aria-hidden="true" />
          <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl shadow-xl border border-cyan-300 dark:border-slate-700 p-5 sm:p-8 text-center relative overflow-hidden"
      >
        <div
          className="absolute top-0 end-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -me-10 -mt-10 pointer-events-none"
          aria-hidden="true"
        ></div>

        <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-teal-600 dark:text-teal-400 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] dark:text-white mb-2">
          {lang === 'ar' ? 'التحقق من الشهادة' : 'Certificate Verification'}
        </h1>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed">
          {lang === 'ar'
            ? 'أدخل الرمز التعريفي للشهادة للتحقق من صحتها عبر قاعدة بياناتنا الرسمية.'
            : 'Enter the certificate ID to verify its authenticity against our official database.'}
        </p>

        <form onSubmit={handleVerify} className="mb-6 sm:mb-8">
          <label htmlFor="certificate-id-input" className="sr-only">
            {lang === 'ar' ? 'الرمز التعريفي للشهادة' : 'Certificate ID'}
          </label>
          <div className="relative max-w-md mx-auto">
            <input
              id="certificate-id-input"
              type="text"
              dir="ltr"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. GITM-CERT-2026-001"
              className="w-full min-h-[48px] ps-4 pe-14 py-3 text-base bg-white dark:bg-slate-900 border border-cyan-400 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-[#1e3a5f] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 uppercase font-mono tracking-wider"
            />
            <button
              type="submit"
              aria-label={lang === 'ar' ? 'تحقق من الشهادة' : 'Verify certificate'}
              className="absolute end-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div role="status" aria-live="polite">
          {status === 'loading' && (
            <div className="flex flex-col items-center text-slate-700 dark:text-slate-300 py-4">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" aria-hidden="true"></div>
              <p className="text-sm font-semibold">{lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</p>
            </div>
          )}

          {status === 'valid' && certData && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-6 text-start"
            >
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 mb-4 border-b border-emerald-200 dark:border-emerald-800 pb-3">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" aria-hidden="true" />
                <h2 className="font-bold text-base sm:text-lg">
                  {lang === 'ar' ? 'شهادة صالحة وموثقة' : 'Valid & Verified Certificate'}
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4">
                  <span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'اسم الطالب:' : 'Student Name:'}</span>
                  <strong className="text-[#1e3a5f] dark:text-white break-words">{certData.name}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4">
                  <span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'المسار التدريبي:' : 'Course Track:'}</span>
                  <strong className="text-[#1e3a5f] dark:text-white break-words">{certData.course}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4">
                  <span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                  <strong className="text-[#1e3a5f] dark:text-white">{certData.date}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4">
                  <span className="text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'رمز التوثيق:' : 'Verification ID:'}</span>
                  <strong dir="ltr" className="font-mono text-teal-700 dark:text-teal-400 break-all">{certData.id}</strong>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'invalid' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800/50 rounded-2xl p-5 sm:p-6 text-center text-red-700 dark:text-red-400"
            >
              <h2 className="font-bold text-base sm:text-lg mb-2">
                {lang === 'ar' ? 'شهادة غير صالحة' : 'Invalid Certificate'}
              </h2>
              <p className="text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'لم نتمكن من العثور على هذا الرمز في سجلاتنا الرسمية. يرجى التأكد من الرمز المدخل.'
                  : 'We could not find this ID in our official records. Please verify the entered ID.'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
