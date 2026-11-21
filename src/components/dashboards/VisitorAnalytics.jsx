import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Users, MousePointerClick, Clock, TrendingUp, Monitor, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const baseTrafficData = [
  { name: 'Mon', active: 420, new: 240 },
  { name: 'Tue', active: 510, new: 320 },
  { name: 'Wed', active: 680, new: 450 },
  { name: 'Thu', active: 590, new: 390 },
  { name: 'Fri', active: 780, new: 520 },
  { name: 'Sat', active: 890, new: 610 },
  { name: 'Sun', active: 940, new: 730 },
];

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
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181825] border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
            <Activity className="text-rose-500" /> 
            {lang === 'ar' ? 'تحليلات المنصة وحركة الزوار' : 'Live Platform & Visitor Analytics'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'ar' ? 'تتبع تفاعل المستخدمين والطلاب في الوقت الفعلي مع السحابة' : 'Real-time analytics and engagement metrics across GITM platform'}
          </p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white dark:bg-[#181825] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:border-rose-500"
        >
          <option value="24h">{lang === 'ar' ? 'آخر 24 ساعة' : 'Last 24 Hours'}</option>
          <option value="7d">{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</option>
          <option value="30d">{lang === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days'}</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === 'ar' ? 'الأعضاء المسجلين' : 'Registered Members', value: stats.totalMembers, trend: '+18%', color: 'from-blue-500 to-cyan-500' },
          { icon: MousePointerClick, label: lang === 'ar' ? 'المشاريع المنشورة' : 'Active Projects', value: stats.totalProjects, trend: '+25%', color: 'from-emerald-500 to-teal-500' },
          { icon: Clock, label: lang === 'ar' ? 'الفعاليات والمعارض' : 'Events & Exhibitions', value: stats.totalEvents, trend: '+12%', color: 'from-purple-500 to-indigo-500' },
          { icon: Monitor, label: lang === 'ar' ? 'المقالات والأخبار' : 'Published Articles', value: stats.totalArticles, trend: '+30%', color: 'from-orange-500 to-rose-500' },
        ].map((kpi, i) => (
          <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
            className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 relative overflow-hidden"
          >
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} text-white`}>
                <kpi.icon size={20} />
              </div>
      
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1e3a5f] dark:text-white mb-1">{kpi.value}</p>
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      

        {/* Secondary Chart */}
        <motion.div variants={cardVariants} custom={5} initial="hidden" animate="visible" className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2">
            <Activity className="text-rose-500" size={18} />
            {lang === 'ar' ? 'تفاعل الفعاليات والمشاركات' : 'Events & Workshops Engagement'}
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} opacity={0.2} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="views" name={lang === 'ar' ? 'مشاهدات' : 'Views'} fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="clicks" name={lang === 'ar' ? 'تسجيلات' : 'Registrations'} fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            {lang === 'ar' ? 'مزامنة حية مع قاعدة بيانات الفعاليات' : 'Live synchronized event participation metrics'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
