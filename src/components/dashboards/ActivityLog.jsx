import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Activity, Clock, FileText, Calendar, Rocket, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityLog() {
  const { lang } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Since we don't have a dedicated "activity_logs" collection yet, we can simulate it by fetching the latest from different collections.
  // In a real app, you'd add an entry to "activity_logs" whenever a CRUD operation happens.
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const fetchLatest = async (colName, type, icon, color) => {
          const q = query(collection(db, colName), orderBy('createdAt', 'desc'), limit(3));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              type,
              icon,
              color,
              title: data.title || data.titleEn || data.name || data.nameLatin || 'New Entry',
              date: data.createdAt?.toDate() || new Date(),
              timestamp: data.createdAt?.toMillis() || Date.now(),
            };
          });
        };

        const [news, events, projects, users] = await Promise.all([
          fetchLatest('news', 'article', FileText, 'text-rose-500'),
          fetchLatest('events', 'event', Calendar, 'text-blue-500'),
          fetchLatest('projects', 'project', Rocket, 'text-indigo-500'),
          fetchLatest('users', 'user', Users, 'text-emerald-500')
        ]);

        const allActivities = [...news, ...events, ...projects, ...users]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activity log:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 } })
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
          <Activity className="text-cyan-500" /> {lang === 'ar' ? 'التحديثات الأخيرة' : 'Recent Activity Log'}
        </h3>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-cyan-500" size={32}/></div>
        ) : activities.length > 0 ? (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 rtl:ml-0 rtl:mr-4 rtl:border-r-2 rtl:border-l-0 space-y-6 pb-4">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.div key={`${act.type}-${act.id}`} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="relative pl-6 rtl:pl-0 rtl:pr-6">
                  <div className={`absolute -left-[17px] rtl:-left-auto rtl:-right-[17px] top-1 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm`}>
                    <Icon size={14} className={act.color} />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all">
                    <p className="font-bold text-[#1e3a5f] dark:text-white text-sm">
                      {lang === 'ar' ? `تم إضافة ${act.type} جديد:` : `New ${act.type} added:`} 
                      <span className="text-cyan-600 dark:text-cyan-400 ml-2 rtl:mr-2 rtl:ml-0">{act.title}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      <Clock size={12} />
                      <span>{act.date.toLocaleString(lang === 'ar' ? 'ar-MA' : 'en-US')}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500 font-bold py-8">{lang === 'ar' ? 'لا توجد تحديثات أخيرة' : 'No recent activities found'}</p>
        )}
      </div>
    </div>
  );
}
