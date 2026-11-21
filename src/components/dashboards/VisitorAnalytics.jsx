import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Users, MousePointerClick, Clock, Monitor } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function VisitorAnalytics() {
  const { lang } = useLanguage();
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalProjects: 0,
    totalArticles: 0
  });
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMetrics = async () => {
      setLoading(true);
      try {
        const [usersSnap, eventsSnap, projectsSnap, articlesSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'events')),
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'articles'))
        ]);

        const eventsList = eventsSnap.docs.map(doc => ({
          name: doc.data().title_en || doc.data().title_ar || doc.data().title || 'Event',
          views: doc.data().views || 0,
          clicks: doc.data().attendees || 0
        }));

        setStats({
          totalMembers: usersSnap.size || 0,
          totalEvents: eventsSnap.size || 0,
          totalProjects: projectsSnap.size || 0,
          totalArticles: articlesSnap.size || 0
        });
        setEventData(eventsList.slice(0, 5));
      } catch (err) {
        console.warn('Error fetching live metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMetrics();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } })
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181825] border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-white font-bold text-xs sm:text-sm mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs sm:text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 md:space-y-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
            <Activity className="text-rose-500 shrink-0" size={22} />
            <span>{lang === 'ar' ? 'تحليلات المنصة وحركة الزوار' : 'Live Platform & Visitor Analytics'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {lang === 'ar' ? 'تتبع تفاعل المستخدمين والطلاب في الوقت الفعلي مع السحابة' : 'Real-time analytics and engagement metrics across GITM platform'}
          </p>
        </div>
        <select
          aria-label={lang === 'ar' ? 'الفترة الزمنية' : 'Time range'}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full sm:w-auto min-h-[44px] bg-white dark:bg-[#181825] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-base sm:text-sm font-medium focus:outline-none focus:border-rose-500"
        >
          <option value="24h">{lang === 'ar' ? 'آخر 24 ساعة' : 'Last 24 Hours'}</option>
          <option value="7d">{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</option>
          <option value="30d">{lang === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days'}</option>
        </select>
      </div>

      {/* KPI Cards — Single column on 375px mobile, 2 on sm, 4 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === 'ar' ? 'الأعضاء المسجلين' : 'Registered Members', value: stats.totalMembers, color: 'from-blue-500 to-cyan-500' },
          { icon: MousePointerClick, label: lang === 'ar' ? 'المشاريع المنشورة' : 'Active Projects', value: stats.totalProjects, color: 'from-emerald-500 to-teal-500' },
          { icon: Clock, label: lang === 'ar' ? 'الفعاليات والمعارض' : 'Events & Exhibitions', value: stats.totalEvents, color: 'from-purple-500 to-indigo-500' },
          { icon: Monitor, label: lang === 'ar' ? 'المقالات والأخبار' : 'Published Articles', value: stats.totalArticles, color: 'from-orange-500 to-rose-500' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} text-white`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] dark:text-white mb-1">
                {loading ? '...' : kpi.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-Width Responsive Chart Card */}
      <div className="grid grid-cols-1 gap-6 w-full min-w-0">
        <motion.div
          variants={cardVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 w-full min-w-0"
        >
          <h4 className="font-bold text-base sm:text-lg text-[#1e3a5f] dark:text-white mb-5 flex items-center gap-2">
            <Activity className="text-rose-500 shrink-0" size={18} />
            <span>{lang === 'ar' ? 'تفاعل الفعاليات والمشاركات' : 'Events & Workshops Engagement'}</span>
          </h4>

          {loading ? (
            <div className="h-[240px] sm:h-[300px] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ) : eventData.length === 0 ? (
            <div className="h-[180px] w-full flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 text-center px-4">
              {lang === 'ar' ? 'لا توجد بيانات تفاعل للفعاليات حالياً.' : 'No event engagement data available yet.'}
            </div>
          ) : (
            <div className="h-[240px] sm:h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventData} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} opacity={0.2} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={88} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="views" name={lang === 'ar' ? 'مشاهدات' : 'Views'} fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="clicks" name={lang === 'ar' ? 'تسجيلات' : 'Registrations'} fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-4">
            {lang === 'ar' ? 'مزامنة حية مع قاعدة بيانات الفعاليات' : 'Live synchronized event participation metrics'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
