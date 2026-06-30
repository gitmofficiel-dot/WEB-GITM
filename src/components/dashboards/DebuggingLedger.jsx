import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Tag, ThumbsUp, Code, Terminal, MessageSquare, Plus, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const MOCK_ENTRIES = [
  {
    id: 1,
    title: 'ESP32 Brownout Detector was triggered',
    category: 'Hardware',
    tags: ['ESP32', 'Power', 'Bootloop'],
    problem: 'My ESP32 keeps restarting constantly and the serial monitor prints "Brownout detector was triggered".',
    solution: 'This happens when the ESP32 doesn\'t get enough power (voltage drops below 2.4V). Solutions:\n1. Use a better USB cable (shorter/thicker).\n2. If using a breadboard, ensure power lines are stable.\n3. Add a 10uF capacitor between EN and GND.\n4. Supply 5V directly to VIN if USB power is weak.',
    author: 'Ahmed (Hardware Lead)',
    votes: 45,
    isResolved: true
  },
  {
    id: 2,
    title: 'React useEffect infinite loop',
    category: 'Software',
    tags: ['React', 'Hooks', 'JavaScript'],
    problem: 'My React component crashes the browser because useEffect runs continuously.',
    solution: 'You likely forgot to add the dependency array, or you are updating a state inside the useEffect that is also in the dependency array.\n\nFix: Ensure you pass `[]` if it should run once, or check if the state update condition is correct.',
    author: 'Yassine (Web Dev)',
    votes: 32,
    isResolved: true
  }
];

export default function DebuggingLedger() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredEntries = MOCK_ENTRIES.filter(entry => 
    entry.title.toLowerCase().includes(search.toLowerCase()) || 
    entry.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a0f1a] min-h-[600px] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 font-sans shadow-xl flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
         <div>
           <h2 className="text-3xl font-bold font-orbitron text-[#1e3a5f] dark:text-white flex items-center gap-3 mb-2">
             <BookOpen className="text-emerald-500" size={32} />
             {lang === 'ar' ? 'دفتر التصحيح الهندسي' : 'Debugging Ledger'}
           </h2>
           <p className="text-slate-500">
             {lang === 'ar' 
               ? 'قاعدة المعرفة الخاصة بأعضاء GITM لحل المشاكل التقنية والأخطاء الشائعة.' 
               : 'GITM internal knowledge base for solving common technical errors and bugs.'}
           </p>
         </div>
         <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 shrink-0">
           <Plus size={18} /> {lang === 'ar' ? 'توثيق خطأ جديد' : 'Document New Error'}
         </button>
      </div>

      <div className="relative mb-8 max-w-2xl mx-auto w-full">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" size={20} />
         <input 
           type="text" 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder={lang === 'ar' ? 'ابحث عن خطأ (مثال: ESP32, React, NullPointer)' : 'Search errors (e.g. ESP32, React, NullPointer)'}
           className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-colors shadow-sm"
         />
      </div>

      <div className="flex-1 space-y-4 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {filteredEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={entry.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-5 cursor-pointer flex gap-4 items-start"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="flex flex-col items-center gap-1 shrink-0 w-12 pt-1">
                    <button className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors"><ChevronUp size={24}/></button>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{entry.votes}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                       {entry.isResolved && <CheckCircle size={16} className="text-emerald-500 shrink-0"/>}
                       <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white truncate">{entry.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${entry.category === 'Hardware' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {entry.category}
                      </span>
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                          <Tag size={10}/> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30"
                    >
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-500 flex items-center gap-2 mb-2"><Terminal size={16}/> {lang === 'ar' ? 'وصف المشكلة' : 'Problem Description'}</h4>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{entry.problem}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2"><Code size={16}/> {lang === 'ar' ? 'الحل (الموثق)' : 'Solution (Documented)'}</h4>
                          <div className="bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-xl p-4">
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{entry.solution}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <span>Documented by: <strong className="text-slate-600 dark:text-slate-300">{entry.author}</strong></span>
                          <button className="flex items-center gap-1 hover:text-emerald-500 transition-colors"><MessageSquare size={14}/> Reply/Discuss</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredEntries.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">{lang === 'ar' ? 'لم يتم العثور على أخطاء مشابهة.' : 'No similar errors found.'}</p>
          </div>
        )}
      </div>

    </div>
  );
}
