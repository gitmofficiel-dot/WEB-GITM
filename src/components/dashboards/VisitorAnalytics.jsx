import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Users, MousePointerClick, Clock, TrendingUp, Monitor } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const visitorsData = [
  { name: 'Mon', active: 400, new: 240 },
  { name: 'Tue', active: 300, new: 139 },
  { name: 'Wed', active: 200, new: 980 },
  { name: 'Thu', active: 278, new: 390 },
  { name: 'Fri', active: 189, new: 480 },
  { name: 'Sat', active: 239, new: 380 },
  { name: 'Sun', active: 349, new: 430 },
];

const eventEngagementData = [
  { name: 'Hackathon', views: 4000, clicks: 2400 },
  { name: 'AI Workshop', views: 3000, clicks: 1398 },
  { name: 'Bootcamp', views: 2000, clicks: 9800 },
  { name: 'Tech Talk', views: 2780, clicks: 3908 },
];

export default function VisitorAnalytics() {
  const { lang } = useLanguage();
  const [timeRange, setTimeRange] = useState('7d');

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181825] border border-slate-200/ dark:border-slate-700/ p-3 rounded-xl shadow-xl">
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
            {lang === 'ar' ? 'تحليلات الزوار (PostHog)' : 'Visitor Analytics (PostHog)'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'ar' ? 'تتبع تفاعل المستخدمين والطلاب بشكل حي' : 'Track user and student engagement in real-time'}
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
          { icon: Users, label: lang === 'ar' ? 'إجمالي الزوار' : 'Total Visitors', value: '12,450', trend: '+14%', color: 'from-blue-500 to-cyan-500' },
          { icon: MousePointerClick, label: lang === 'ar' ? 'نقرات التفاعل' : 'Interaction Clicks', value: '45.2K', trend: '+22%', color: 'from-emerald-500 to-teal-500' },
          { icon: Clock, label: lang === 'ar' ? 'متوسط البقاء' : 'Avg. Session', value: '4m 32s', trend: '+5%', color: 'from-purple-500 to-indigo-500' },
          { icon: Monitor, label: lang === 'ar' ? 'الأجهزة المحمولة' : 'Mobile Users', value: '68%', trend: '-2%', color: 'from-orange-500 to-rose-500' },
        ].map((kpi, i) => (
          <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
            className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} text-white`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${kpi.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1e3a5f] dark:text-white mb-1">{kpi.value}</p>
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={cardVariants} custom={4} initial="hidden" animate="visible" className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-cyan-500" size={18} />
            {lang === 'ar' ? 'حركة مرور المنصة' : 'Platform Traffic'}
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" name={lang === 'ar' ? 'أعضاء نشطين' : 'Active Members'} dataKey="active" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" name={lang === 'ar' ? 'زوار جدد' : 'New Visitors'} dataKey="new" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div variants={cardVariants} custom={5} initial="hidden" animate="visible" className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <h4 className="font-bold text-lg text-[#1e3a5f] dark:text-white mb-6 flex items-center gap-2">
            <Activity className="text-rose-500" size={18} />
            {lang === 'ar' ? 'تفاعل الفعاليات' : 'Events Engagement'}
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventEngagementData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} opacity={0.2} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="views" name={lang === 'ar' ? 'مشاهدات' : 'Views'} fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="clicks" name={lang === 'ar' ? 'نقرات' : 'Clicks'} fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            {lang === 'ar' ? 'نسبة التحويل من مشاهدة إلى نقرة' : 'Conversion rate from view to click'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
