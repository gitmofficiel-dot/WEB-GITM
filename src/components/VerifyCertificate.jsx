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

  const verifyId = (idToVerify) => {
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      const upperId = idToVerify.toUpperCase();
      if (upperId.startsWith('GITM-CERT-') || upperId.startsWith('CERT-GITM-')) {
        // Parse mock data based on ID
        const parts = upperId.split('-');
        const year = parts[2] || '2026';
        
        let course = 'Technology & Innovation';
        if (upperId.includes('0042')) course = 'Python for Robotics';
        else if (upperId.includes('0089')) course = 'Data Structures & Algorithms';
        else if (upperId.includes('0312')) course = 'Introduction to AI';
        else if (upperId.includes('001')) course = 'Edge AI Architecture';

        setCertData({
          name: 'Soufiane El Alaoui', // Mock student name
          course: course,
          date: `15 June ${year}`,
          id: upperId
        });
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    }, 1500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    verifyId(certId);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-cyan-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4">
      <button onClick={() => navigate('/')} className="mb-8 flex items-center text-slate-500 hover:text-teal-600 transition self-start max-w-3xl mx-auto w-full">
        <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl shadow-xl border border-cyan-300 dark:border-slate-700 p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <ShieldCheck className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#1e3a5f] dark:text-white mb-2">
          {lang === 'ar' ? 'التحقق من الشهادة' : 'Certificate Verification'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {lang === 'ar' 
            ? 'أدخل الرمز التعريفي للشهادة للتحقق من صحتها عبر قاعدة بياناتنا الرسمية.' 
            : 'Enter the certificate ID to verify its authenticity against our official database.'}
        </p>

        <form onSubmit={handleVerify} className="mb-8">
          <div className="relative max-w-sm mx-auto">
            <input 
              type="text" 
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. GITM-CERT-2026-001"
              className="w-full pl-4 pr-12 rtl:pr-4 rtl:pl-12 py-3 bg-cyan-100 dark:bg-slate-900 border border-cyan-400 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-[#1e3a5f] dark:text-white uppercase font-mono tracking-wider"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 rtl:left-2 rtl:right-auto p-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {status === 'loading' && (
          <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>{lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</p>
          </div>
        )}

        {status === 'valid' && certData && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 text-left rtl:text-right">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4 border-b border-emerald-200 dark:border-emerald-800 pb-3">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <h3 className="font-bold text-lg">{lang === 'ar' ? 'شهادة صالحة وموثقة' : 'Valid & Verified Certificate'}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'اسم الطالب:' : 'Student Name:'}</span><strong className="text-[#1e3a5f] dark:text-white">{certData.name}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'المسار التدريبي:' : 'Course Track:'}</span><strong className="text-[#1e3a5f] dark:text-white">{certData.course}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'تاريخ الإصدار:' : 'Issue Date:'}</span><strong className="text-[#1e3a5f] dark:text-white">{certData.date}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'رمز التوثيق:' : 'Verification ID:'}</span><strong className="font-mono text-teal-600 dark:text-teal-400">{certData.id}</strong></div>
            </div>
          </motion.div>
        )}

        {status === 'invalid' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 text-center text-red-600 dark:text-red-400">
            <h3 className="font-bold mb-2">{lang === 'ar' ? 'شهادة غير صالحة' : 'Invalid Certificate'}</h3>
            <p className="text-sm">{lang === 'ar' ? 'لم نتمكن من العثور على هذا الرمز في سجلاتنا الرسمية. يرجى التأكد من الرمز المدخل.' : 'We could not find this ID in our official records. Please verify the entered ID.'}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
