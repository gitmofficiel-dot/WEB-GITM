import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InspirationCard({ lang = 'en' }) {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://numbersapi.com/random/math?json');
      const data = await response.json();
      setFact(data.text);
    } catch (error) {
      console.error('Failed to fetch from Numbers API:', error);
      setFact(lang === 'ar' ? 'الرياضيات هي لغة الكون.' : 'Mathematics is the language of the universe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#11111b] rounded-2xl p-6 text-white border border-slate-700/50 shadow-xl"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-400/20 rounded-lg">
            <Lightbulb size={20} className="text-yellow-400" />
          </div>
          <h3 className="font-bold text-lg font-orbitron">
            {lang === 'ar' ? 'إلهام اليوم' : 'Daily Inspiration'}
          </h3>
        </div>
        <button 
          onClick={fetchFact} 
          disabled={loading}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
        >
          <motion.div animate={{ rotate: loading ? 360 : 0 }} transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: "linear" }}>
            <RefreshCw size={16} />
          </motion.div>
        </button>
      </div>

      <div className="relative z-10 min-h-[60px] flex items-center">
        {loading ? (
          <div className="w-full space-y-2 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        ) : (
          <p className="text-slate-300 leading-relaxed italic text-sm md:text-base">
            "{fact}"
          </p>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-4 text-right">Powered by Numbers API</p>
    </motion.div>
  );
}
