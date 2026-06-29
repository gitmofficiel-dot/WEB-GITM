import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../utils/toast';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500 shrink-0" />;
      case 'error': return <AlertCircle className="text-red-500 shrink-0" />;
      case 'warning': return <AlertTriangle className="text-amber-500 shrink-0" />;
      case 'info':
      default: return <Info className="text-cyan-500 shrink-0" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100';
      case 'error': return 'border-red-500/20 bg-red-50/90 dark:bg-red-950/40 text-red-900 dark:text-red-100';
      case 'warning': return 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100';
      case 'info':
      default: return 'border-cyan-500/20 bg-cyan-50/90 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-100';
    }
  };

  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto rounded-xl p-4 shadow-xl backdrop-blur-md border flex items-start justify-between gap-3 ${getBgClass(t.type)}`}
          >
            <div className="flex items-start gap-3 mt-0.5">
              {getIcon(t.type)}
              <p className="text-sm font-medium leading-tight">{t.message}</p>
            </div>
            <button 
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
