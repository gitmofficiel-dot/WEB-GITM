import React, { useState, useEffect } from 'react';
import { Microscope, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ScienceFactWidget = () => {
  const { lang } = useLanguage();
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFact = async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch a random math/science fact from Numbers API
      const res = await fetch('http://numbersapi.com/random/math?json');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFact(data.text);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  const title = lang === 'ar' ? 'معلومة رياضية اليوم' : 'Math Fact of the Day';

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Microscope size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-xl font-bold font-orbitron flex items-center gap-2 text-[#1e3a5f] dark:text-white">
          <Microscope className="text-emerald-500" /> {title}
        </h3>
        <button 
          onClick={fetchFact} 
          disabled={loading}
          className="p-2 bg-cyan-100 dark:bg-slate-800 hover:bg-cyan-200 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-10 min-h-[100px] flex items-center justify-center">
        {loading && !fact ? (
          <Loader className="animate-spin text-emerald-500" />
        ) : error ? (
          <p className="text-red-500 flex items-center gap-2">
            <AlertCircle size={16} /> {lang === 'ar' ? 'خطأ في جلب المعلومة' : 'Error loading fact'}
          </p>
        ) : (
          <p className="text-lg text-[#2d507b] dark:text-slate-300 italic font-medium">
            "{fact}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ScienceFactWidget;
