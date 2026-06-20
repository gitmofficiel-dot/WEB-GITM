import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Loader, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CurrencyWidget = () => {
  const { lang } = useLanguage();
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fetch EUR and USD to MAD (Moroccan Dirham) using Frankfurter (free, no API key)
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRates(data.rates);
        setLoading(false);
      } catch (err) {
        // Fallback or error
        setError(true);
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const title = lang === 'ar' ? 'أسعار العملات (USD)' : 'Currency Rates (USD)';

  if (loading) return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-center h-24 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700">
      <Loader className="animate-spin text-purple-500" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-center h-24 bg-red-100/30 dark:bg-red-900/30 backdrop-blur-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
      <AlertCircle className="mr-2" /> {lang === 'ar' ? 'خطأ في جلب العملات' : 'Error loading rates'}
    </div>
  );

  return (
    <div className="glass-card p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
        <DollarSign size={14} className="text-emerald-500" /> {title}
      </h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-700 dark:text-gray-200">EUR</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-gray-800 dark:text-white">{rates?.EUR?.toFixed(2)}</span>
            <ArrowDownRight size={14} className="text-red-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-700 dark:text-gray-200">GBP</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-gray-800 dark:text-white">{rates?.GBP?.toFixed(2)}</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyWidget;
