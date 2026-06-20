import React, { useRef, useState } from 'react';
import { Award, Mail, Share2, CheckCircle2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CertificateGenerator({ studentName, courseName, issueDate, onDownload }) {
  const certificateRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      if (onDownload) onDownload();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6"
    >
      <div className="flex items-center gap-3 text-emerald-500 mb-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Course Completed Successfully!</h2>
      </div>

      <div 
        ref={certificateRef}
        className="w-full aspect-[1.414/1] relative rounded-lg overflow-hidden shadow-2xl border-8 border-slate-800 dark:border-slate-100 bg-white dark:bg-slate-900 print:shadow-none print:border-none"
      >
        {/* Certificate Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        {/* Borders */}
        <div className="absolute inset-4 border-4 border-double border-emerald-600/30 dark:border-cyan-400/30"></div>
        <div className="absolute inset-6 border border-emerald-600/20 dark:border-cyan-400/20"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 mb-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-45">
            <Award className="w-10 h-10 text-white -rotate-45" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-orbitron text-slate-800 dark:text-white uppercase tracking-widest mb-2">
            Certificate
          </h1>
          <h2 className="text-xl md:text-2xl text-emerald-600 dark:text-cyan-400 tracking-wider mb-8 uppercase font-bold">
            of Completion
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mb-2 italic">This is to certify that</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-2 px-12">
            {studentName}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mb-2 italic">has successfully completed the course</p>
          <h4 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-10 max-w-lg">
            {courseName}
          </h4>

          <div className="flex justify-between w-full max-w-xl px-12 mt-auto">
            <div className="flex flex-col items-center">
              <span className="text-slate-800 dark:text-white font-bold border-b border-slate-400 pb-1 w-32">{issueDate}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider mt-2">Issue Date</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-slate-800 dark:text-white font-bold border-b border-slate-400 pb-1 w-32 font-signature text-xl">Dr. Youssef</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider mt-2">GITM President</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-xl">
        {!isSent ? (
          <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-4 w-full">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to receive the certificate" 
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
            />
            <button type="submit" disabled={isSending} className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50">
              {isSending ? <Loader className="animate-spin w-5 h-5" /> : <Mail size={18} />} 
              Send to Email
            </button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold">
            <CheckCircle2 size={20} /> Certificate successfully sent to your email!
          </div>
        )}
      </div>
      
      <div className="flex gap-4 mt-2">
        <button className="btn-glass px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-slate-700 dark:text-white">
          <Share2 size={18} /> Share to LinkedIn
        </button>
      </div>
    </motion.div>
  );
}
