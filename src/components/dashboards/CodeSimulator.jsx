import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle, XCircle, Code2, Terminal, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAI } from '../../hooks/useAI';

const defaultCode = {
  javascript: `// Write your JavaScript algorithm here
function calculatePoints(courses) {
  return courses * 100;
}

console.log(calculatePoints(5));`,
  python: `# Write your Python algorithm here
def calculate_points(courses):
    return courses * 100

print(calculate_points(5))`,
  cpp: `// Write your C++ algorithm here
#include <iostream>
using namespace std;

int calculatePoints(int courses) {
    return courses * 100;
}

int main() {
    cout << calculatePoints(5) << endl;
    return 0;
}`
};

export default function CodeSimulator({ lang = 'en' }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setCode(defaultCode[langId]);
    setOutput('');
    setStatus(null);
  };

  const { simulateCodeExecution, loading: aiLoading } = useAI();

  const executeWithJudge0 = async (sourceCode, langId) => {
    // Judge0 language IDs: JS=93 (Node), Python=71, C++=54 (GCC 9.2.0)
    const idMap = { javascript: 93, python: 71, cpp: 54 };
    const language_id = idMap[langId] || 93;

    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
    if (!apiKey) {
      console.warn("No Judge0 API Key found, falling back to AI Simulator");
      return await simulateCodeExecution(sourceCode, langId);
    }

    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: language_id,
          source_code: sourceCode,
          stdin: ""
        })
      });

      if (!response.ok) throw new Error('Judge0 API request failed');
      const data = await response.json();
      
      if (data.stderr || data.compile_output) {
        return { status: 'error', output: data.stderr || data.compile_output };
      }
      return { status: 'success', output: data.stdout || 'Execution finished (no output)' };
    } catch (err) {
      console.error(err);
      return { status: 'error', output: err.message };
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setStatus(null);
    setOutput(lang === 'ar' ? 'جاري التنفيذ عبر Judge0...' : 'Running code via Judge0...');

    try {
      const result = await executeWithJudge0(code, language);
      if (result && result.output) {
        setOutput(result.output);
        setStatus(result.status === 'success' ? 'success' : 'error');
      } else {
        setOutput('Execution finished (no output)');
        setStatus('success');
      }
    } catch (err) {
      setOutput(err.toString());
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1e1e2e] rounded-2xl overflow-hidden border border-slate-200/ dark:border-slate-700/ shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Code2 className="text-cyan-400" size={20} />
          <h3 className="font-orbitron font-bold text-white text-sm">
            {lang === 'ar' ? 'محاكي البرمجة (HackerRank Engine)' : 'Code Simulator (HackerRank Engine)'}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#313244] text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3.10</option>
            <option value="cpp">C++ (GCC 9.4)</option>
          </select>

          <button 
            onClick={() => setCode(defaultCode[language])}
            className="text-slate-600 dark:text-slate-400 hover:text-white transition-colors"
            title={lang === 'ar' ? 'إعادة التعيين' : 'Reset Code'}
          >
            <RotateCcw size={16} />
          </button>

          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isRunning 
                ? 'bg-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Terminal size={16} />
              </motion.div>
            ) : (
              <Play size={16} />
            )}
            {lang === 'ar' ? (isRunning ? 'جاري...' : 'تشغيل الكود') : (isRunning ? 'Running...' : 'Run Code')}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'Consolas, "Courier New", monospace',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
            }}
          />
        </div>

        {/* Terminal/Output Area */}
        <div className="w-full h-1/3 md:h-auto md:w-1/3 bg-[#11111b] md:border-l border-t md:border-t-0 border-slate-200/ dark:border-slate-700/ flex flex-col">
          <div className="px-4 py-2 bg-[#181825] border-b border-slate-200/ dark:border-slate-700/ flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Terminal size={14} /> {lang === 'ar' ? 'المخرجات (Console)' : 'Output Console'}
            </span>
            {status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
            {status === 'error' && <XCircle size={14} className="text-rose-500" />}
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {output ? (
              <pre className={`font-mono text-sm whitespace-pre-wrap ${status === 'error' ? 'text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <Terminal size={48} className="mb-2" />
                <p className="text-sm font-semibold">
                  {lang === 'ar' ? 'اضغط تشغيل لرؤية المخرجات' : 'Run code to see output'}
                </p>
              </div>
            )}
          </div>
          {/* Mock Validation Panel */}
          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="m-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <h4 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-2">
                <CheckCircle size={14} /> {lang === 'ar' ? 'اجتزت جميع الاختبارات!' : 'All test cases passed!'}
              </h4>
              <p className="text-emerald-500/80 text-xs">
                {lang === 'ar' ? 'تم إضافة 100 نقطة لرصيدك.' : '+100 XP added to your profile.'}
              </p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="m-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <h4 className="text-rose-400 font-bold text-sm mb-1 flex items-center gap-2">
                <AlertTriangle size={14} /> {lang === 'ar' ? 'فشل الاختبار' : 'Test failed'}
              </h4>
              <p className="text-rose-500/80 text-xs">
                {lang === 'ar' ? 'راجع السطر المذكور أعلاه وأعد المحاولة.' : 'Check the error message and try again.'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
