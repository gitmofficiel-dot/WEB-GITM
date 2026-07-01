import React, { useState } from 'react';
import { Play, Upload, Code2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function CodeWorkspace({ axis, onComplete }) {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';
  
  const [code, setCode] = useState(axis.initialCode || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCode(event.target.result);
      reader.readAsText(file);
    }
  };

  const evaluateCode = () => {
    setIsEvaluating(true);
    // Simulate AI / Backend Code Evaluation
    setTimeout(() => {
      setIsEvaluating(false);
      setResult({
        status: 'success',
        message: lang === 'ar' ? 'تم اجتياز جميع الاختبارات بنجاح!' : 'All test cases passed successfully!',
        output: '> Executing...\n> Test 1: PASS\n> Test 2: PASS\n> Build finished.'
      });
    }, 2000);
  };

  return (
    <div className="w-full bg-[#0d1117] text-[#c9d1d9] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col font-mono">
      <div className="bg-[#161b22] px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code2 className="text-cyan-400" size={20} />
          <span className="font-semibold">{lang === 'ar' ? 'بيئة التطوير (HackerRank Style)' : 'Code Environment'}</span>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-sm transition-colors flex items-center gap-2">
            <Upload size={14} /> {lang === 'ar' ? 'رفع ملف' : 'Upload File'}
            <input type="file" className="hidden" accept=".js,.py,.cpp,.java,.txt" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Editor Area */}
        <div className="flex-1 border-r border-slate-700/50 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent text-[#c9d1d9] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            spellCheck="false"
            placeholder={lang === 'ar' ? 'اكتب كودك هنا أو قم برفع ملف...' : 'Write your code here or upload a file...'}
          />
        </div>
        
        {/* Output & Instructions Area */}
        <div className="w-full md:w-1/3 bg-[#0d1117] flex flex-col">
          <div className="p-4 border-b border-slate-700/50 flex-1 overflow-y-auto">
            <h3 className="font-bold mb-2 text-white">{lang === 'ar' ? 'المطلوب' : 'Instructions'}</h3>
            <p className="text-sm text-slate-400 mb-4">{axis.instructions || (lang === 'ar' ? 'قم بكتابة دالة لحل المشكلة المذكورة في المحور.' : 'Write a function to solve the problem described.')}</p>
            
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg ${result.status === 'success' ? 'bg-green-900/20 border border-green-500/30 text-green-400' : 'bg-red-900/20 border border-red-500/30 text-red-400'}`}>
                <div className="flex items-center gap-2 mb-2 font-bold">
                  {result.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {result.message}
                </div>
                <pre className="text-xs text-slate-300 bg-black/30 p-2 rounded">{result.output}</pre>
              </motion.div>
            )}
          </div>
          
          <div className="p-4 bg-[#161b22]">
            <button 
              onClick={evaluateCode}
              disabled={isEvaluating || !code.trim()}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-colors"
            >
              {isEvaluating ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
              {lang === 'ar' ? 'تشغيل الكود' : 'Run Code'}
            </button>
            {result?.status === 'success' && (
              <button 
                onClick={onComplete}
                className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-colors"
              >
                <CheckCircle2 size={18} />
                {lang === 'ar' ? 'المتابعة' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
