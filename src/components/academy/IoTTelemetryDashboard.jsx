import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Gauge, Thermometer, Zap, AlertOctagon, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function IoTTelemetryDashboard() {
  const { lang } = useLanguage();
  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [anomalyActive, setAnomalyActive] = useState(false);

  // Initialize data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      speed: 0,
      temperature: 25,
      voltage: 12.0
    }));
    setData(initialData);
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        
        let newSpeed = last.speed;
        let newTemp = last.temperature;
        let newVoltage = last.voltage;

        if (anomalyActive) {
           newSpeed = Math.max(0, newSpeed - 5);
           newTemp = Math.min(120, newTemp + 8 + Math.random() * 5);
           newVoltage = Math.max(8.0, newVoltage - 0.5 - Math.random() * 0.5);
        } else {
           // Normal cruise simulation
           newSpeed = Math.min(120, Math.max(40, newSpeed + (Math.random() - 0.4) * 10));
           newTemp = Math.max(80, Math.min(95, newTemp + (Math.random() - 0.5) * 2));
           newVoltage = Math.max(13.5, Math.min(14.4, newVoltage + (Math.random() - 0.5) * 0.1));
        }

        const newDataPoint = {
          time: last.time + 1,
          speed: Math.round(newSpeed),
          temperature: parseFloat(newTemp.toFixed(1)),
          voltage: parseFloat(newVoltage.toFixed(2))
        };

        const next = [...prev, newDataPoint];
        if (next.length > 20) return next.slice(next.length - 20);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, anomalyActive]);

  const triggerAnomaly = () => {
    setAnomalyActive(true);
    setTimeout(() => {
      setAnomalyActive(false);
    }, 5000);
  };

  const latest = data[data.length - 1] || { speed: 0, temperature: 0, voltage: 0 };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-slate-400 mb-1">T+{payload[0].payload.time}s</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#0B132B] border border-slate-700/50 rounded-2xl overflow-hidden font-sans flex flex-col h-[700px]">
      
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-[#111827] flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-white font-bold font-orbitron text-lg flex items-center gap-2">
            <Activity className="text-cyan-400" />
            {lang === 'ar' ? 'لوحة القياسات عن بعد (IoT Telemetry)' : 'IoT Telemetry Dashboard'}
          </h2>
          <p className="text-xs text-slate-400">Live NABD-X Engine Data Stream</p>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsSimulating(!isSimulating)}
             className={`p-2 rounded-lg border transition-colors ${isSimulating ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
           >
             <RefreshCw size={18} className={isSimulating ? 'animate-spin' : ''} />
           </button>
           
           <button 
             onClick={triggerAnomaly}
             disabled={anomalyActive || !isSimulating}
             className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
           >
             <AlertOctagon size={16} />
             {lang === 'ar' ? 'حقن خطأ (Anomaly)' : 'Inject Anomaly'}
           </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2"><Gauge size={16} className="text-cyan-400"/> {lang === 'ar' ? 'السرعة' : 'Speed'}</p>
               <h3 className="text-3xl font-bold font-mono text-white">{latest.speed} <span className="text-sm text-slate-500">km/h</span></h3>
             </div>
             <Gauge size={64} className="text-cyan-500/10 absolute -right-4 -bottom-4" />
          </div>

          <div className={`bg-slate-900 border rounded-xl p-4 flex items-center justify-between relative overflow-hidden transition-colors ${anomalyActive ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800'}`}>
             <div className="relative z-10">
               <p className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2"><Thermometer size={16} className={anomalyActive ? 'text-rose-400 animate-pulse' : 'text-amber-400'}/> {lang === 'ar' ? 'حرارة المحرك' : 'Engine Temp'}</p>
               <h3 className={`text-3xl font-bold font-mono ${anomalyActive ? 'text-rose-400' : 'text-white'}`}>{latest.temperature} <span className="text-sm text-slate-500">°C</span></h3>
             </div>
             <Thermometer size={64} className={`${anomalyActive ? 'text-rose-500/20' : 'text-amber-500/10'} absolute -right-4 -bottom-4`} />
          </div>

          <div className={`bg-slate-900 border rounded-xl p-4 flex items-center justify-between relative overflow-hidden transition-colors ${anomalyActive ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800'}`}>
             <div className="relative z-10">
               <p className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2"><Zap size={16} className={anomalyActive ? 'text-rose-400 animate-pulse' : 'text-purple-400'}/> {lang === 'ar' ? 'جهد البطارية' : 'Battery Volts'}</p>
               <h3 className={`text-3xl font-bold font-mono ${anomalyActive ? 'text-rose-400' : 'text-white'}`}>{latest.voltage} <span className="text-sm text-slate-500">V</span></h3>
             </div>
             <Zap size={64} className={`${anomalyActive ? 'text-rose-500/20' : 'text-purple-500/10'} absolute -right-4 -bottom-4`} />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
           {/* Speed & Temp Dual Chart */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
              <h3 className="text-sm font-bold text-slate-300 mb-4">{lang === 'ar' ? 'السرعة و الحرارة' : 'Speed & Temperature Profile'}</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#475569" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="speed" name="Speed" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" isAnimationActive={false} />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temp" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Voltage Chart */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
              <h3 className="text-sm font-bold text-slate-300 mb-4">{lang === 'ar' ? 'استقرار الجهد الكهربائي' : 'Voltage Stability'}</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis domain={[8, 16]} stroke="#475569" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="stepAfter" dataKey="voltage" name="Voltage" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
