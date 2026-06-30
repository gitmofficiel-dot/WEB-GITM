import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, Cpu, Camera, Settings, AlertTriangle, 
  CheckCircle, Zap, RefreshCw, Maximize2, Minimize2 
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useLanguage } from '../../context/LanguageContext';

const AIReviewer = ({ code, onReviewComplete }) => {
  const { lang } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setReport(null);
    // Simulate AI latency
    setTimeout(() => {
      const hasPython = code.includes('import') || code.includes('def ');
      const hasCpp = code.includes('#include') || code.includes('void setup()');
      
      const newReport = {
        score: Math.floor(Math.random() * 20) + 80,
        issues: [],
        optimizations: []
      };

      if (hasCpp) {
        if (!code.includes('delay(')) {
          newReport.optimizations.push(lang === 'ar' ? 'يمكن إضافة delay(10) في الـ loop لتقليل استهلاك الـ CPU' : 'Consider adding delay(10) in the loop to reduce CPU load.');
        }
        if (!code.includes('Serial.begin')) {
          newReport.issues.push(lang === 'ar' ? 'لم يتم تهيئة Serial للإرسال والاستقبال.' : 'Serial communication is not initialized.');
        }
      } else if (hasPython) {
        if (!code.includes('try:')) {
          newReport.issues.push(lang === 'ar' ? 'احذر من غياب معالجة الاستثناءات (try/except) مما قد يوقف تشغيل الروبوت.' : 'Lack of try/except blocks might crash the robot script unexpectedly.');
        }
      }

      if (newReport.issues.length === 0 && newReport.optimizations.length === 0) {
         newReport.optimizations.push(lang === 'ar' ? 'الكود يبدو ممتازاً وجاهزاً للرفع!' : 'Code looks excellent and ready to deploy!');
      }

      setReport(newReport);
      setIsAnalyzing(false);
      onReviewComplete(newReport);
    }, 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold flex items-center gap-2 text-indigo-400">
          <Zap size={18} /> {lang === 'ar' ? 'المراجع الآلي (AI Reviewer)' : 'AI Code Reviewer'}
        </h4>
        <button 
          onClick={triggerAnalysis} 
          disabled={isAnalyzing || !code}
          className="px-4 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
          {lang === 'ar' ? 'تحليل الكود' : 'Analyze Code'}
        </button>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-4">
             <div className="w-full h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-indigo-500"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
             </div>
             <p className="text-xs text-slate-500 animate-pulse">{lang === 'ar' ? 'جاري الفحص المعماري...' : 'Analyzing architecture...'}</p>
          </motion.div>
        )}

        {report && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
             <div className="flex items-center justify-between bg-slate-50/ dark:bg-slate-800/ p-2 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-300">{lang === 'ar' ? 'تقييم الجودة:' : 'Quality Score:'}</span>
                <span className={`font-bold ${report.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{report.score}/100</span>
             </div>
             
             {report.issues.length > 0 && (
               <div className="space-y-1">
                 <span className="text-xs font-bold text-red-400 flex items-center gap-1"><AlertTriangle size={12}/> {lang === 'ar' ? 'ملاحظات هامة:' : 'Critical Issues:'}</span>
                 {report.issues.map((iss, i) => <p key={i} className="text-xs text-slate-600 dark:text-slate-300 bg-red-500/10 p-2 rounded border border-red-500/20">{iss}</p>)}
               </div>
             )}

             {report.optimizations.length > 0 && (
               <div className="space-y-1">
                 <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle size={12}/> {lang === 'ar' ? 'تحسينات مقترحة:' : 'Optimizations:'}</span>
                 {report.optimizations.map((opt, i) => <p key={i} className="text-xs text-slate-600 dark:text-slate-300 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">{opt}</p>)}
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HardwareLab() {
  const { lang } = useLanguage();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('void setup() {\n  // Initialize pins\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  // Your code here\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}');
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'Hardware Lab Initialized.' },
    { type: 'info', text: 'Connected to GITM Remote Rack #4 (ESP32 Node).' }
  ]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (newLang === 'python') {
      setCode('import machine\nimport time\n\nled = machine.Pin(2, machine.Pin.OUT)\n\nwhile True:\n    led.value(1)\n    time.sleep(1)\n    led.value(0)\n    time.sleep(1)');
    } else {
      setCode('void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}');
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTerminalOutput(prev => [...prev, { type: 'system', text: '> Compiling code...' }]);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, { type: 'success', text: '✓ Compilation successful.' }]);
      setTerminalOutput(prev => [...prev, { type: 'system', text: '> Connecting to remote board...' }]);
      
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, { type: 'success', text: '✓ Upload complete (Took 1.2s).' }]);
        setTerminalOutput(prev => [...prev, { type: 'info', text: '--- Streaming Serial Output ---' }]);
        setIsDeploying(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className={`w-full bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col font-sans transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : 'h-[800px]'}`}>
      
      {/* Header */}
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Cpu className="text-teal-400" size={20} />
          <h2 className="text-white font-bold font-orbitron">{lang === 'ar' ? 'مختبر العتاد السحابي' : 'Remote Hardware Lab'}</h2>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-teal-500"
          >
            <option value="cpp">C++ (Arduino/ESP)</option>
            <option value="python">MicroPython</option>
          </select>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
            {isFullscreen ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Code & Terminal */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
            
            {/* Deploy Action */}
            <div className="absolute bottom-4 right-4 z-10">
               <button 
                 onClick={handleDeploy}
                 disabled={isDeploying}
                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
               >
                 {isDeploying ? <RefreshCw size={18} className="animate-spin"/> : <Play size={18} className="fill-white"/>} 
                 {lang === 'ar' ? 'رفع الكود للعتاد' : 'Compile & Deploy'}
               </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="h-48 bg-[#0d1117] border-t border-slate-800 flex flex-col shrink-0">
            <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Terminal size={14} /> Terminal Output
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
              {terminalOutput.map((log, i) => (
                <div key={i} className={`
                  ${log.type === 'system' ? 'text-slate-600 dark:text-slate-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'info' ? 'text-cyan-400' : ''}
                `}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video Feed & AI Reviewer */}
        <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 flex flex-col p-4 gap-4 overflow-y-auto">
          
          {/* Webcam Feed Mockup */}
          <div className="bg-black rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative aspect-video flex items-center justify-center group">
             <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
               <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> REC
               </span>
               <span className="text-white/50 text-[10px] font-mono drop-shadow-md">CAM_ESP32_LAB</span>
             </div>
             
             {/* Fake Video Content */}
             <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center">
                <Camera size={32} className="text-slate-600 mb-2"/>
                <span className="text-xs text-slate-500 font-orbitron text-center px-4">
                  Hardware Stream Active<br/>Waiting for deployment...
                </span>
             </div>
             
             {/* Fake scanline effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'ar' 
              ? 'مرحباً بك في مختبر GITM السحابي! يمكنك كتابة الكود هنا ورفعه مباشرة إلى اللوحات الإلكترونية (ESP32/Arduino) الموجودة فعلياً في المختبر لتشاهد النتيجة عبر البث المباشر.'
              : 'Welcome to GITM Cloud Lab! Write code and deploy it directly to real physical boards (ESP32/Arduino) located in our lab, and watch the results via live stream.'}
          </div>

          {/* AI Code Reviewer */}
          <AIReviewer code={code} onReviewComplete={(res) => {}} />

          {/* Board Settings Mockup */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Settings size={12}/> {lang === 'ar' ? 'إعدادات اللوحة' : 'Board Config'}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-0.5">Board</span>
                <span className="text-slate-200 font-mono">ESP32 Dev</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-0.5">Port</span>
                <span className="text-slate-200 font-mono">/dev/ttyUSB0</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
