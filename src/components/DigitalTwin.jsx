import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, Activity, AlertCircle, Play, Pause, RefreshCw, BarChart2 } from 'lucide-react';

const DigitalTwin = () => {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [vehicleCount, setVehicleCount] = useState(34);
  const [intersectionDelay, setIntersectionDelay] = useState(12.4);
  const [gpuLoad, setGpuLoad] = useState(48);
  const [trafficLights, setTrafficLights] = useState({ northSouth: 'GREEN', eastWest: 'RED' });
  const [telemetryHistory, setTelemetryHistory] = useState([20, 24, 28, 30, 32, 28, 34]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      // Toggle traffic lights periodically
      setTrafficLights(prev => {
        if (prev.northSouth === 'GREEN') {
          return { northSouth: 'RED', eastWest: 'GREEN' };
        } else {
          return { northSouth: 'GREEN', eastWest: 'RED' };
        }
      });

      // Fluctuate statistics slightly
      setVehicleCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(60, prev + change));
      });

      setIntersectionDelay(prev => {
        const change = (Math.random() * 2 - 1).toFixed(1);
        return parseFloat(Math.max(5.0, Math.min(25.0, prev + parseFloat(change))).toFixed(1));
      });

      setGpuLoad(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(30, Math.min(95, prev + change));
      });

      // Update history
      setTelemetryHistory(prev => {
        const next = [...prev.slice(1)];
        const newVal = Math.floor(Math.random() * 20) + 15;
        next.push(newVal);
        return next;
      });

    }, 3000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 uppercase tracking-wider mb-3 inline-block">
            {lang === 'ar' ? 'التوأم الرقمي للمدينة الذكية' : 'Smart City Digital Twin Module'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {lang === 'ar' ? 'مراقبة تقاطع الدار البيضاء الذكي' : 'Casablanca Smart Intersection Node'}
          </h2>
          <div className="w-20 h-1 bg-[#00E5FF] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm leading-relaxed">
            {lang === 'ar' 
              ? 'بث مباشر تفاعلي ثلاثي الأبعاد يعكس حالة تشغيل النظام الفعلي، حركة المرور، وسرعة المعالجة بناءً على بيانات الـ IoT الواردة من الحافة.' 
              : 'Interactive real-time 3D twin simulating active hardware node operations, vehicle flows, and edge computing latencies.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 p-4 rounded-xl glass border border-[#3A506B]/20">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-lg border transition-all ${
                isPlaying 
                  ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' 
                  : 'border-[#00FF87]/20 text-[#00FF87] hover:bg-[#00FF87]/10'
              }`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <span className="text-xs font-mono text-slate-700 dark:text-cyber-muted">
              {lang === 'ar' 
                ? (isPlaying ? 'البث الحي: نشط' : 'البث الحي: متوقف مؤقتاً') 
                : (isPlaying ? 'LIVE STREAM: ACTIVE' : 'LIVE STREAM: PAUSED')}
            </span>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse font-mono text-[10px] text-slate-500 dark:text-cyber-muted">
            <span className="flex items-center gap-1.5"><Activity size={12} className="text-[#00FF87] animate-pulse" /> EDGE_RTT: 12ms</span>
            <span className="flex items-center gap-1.5"><Cpu size={12} className="text-[#00E5FF]" /> GPU_TEMP: 64°C</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Visual Twin Canvas Simulator (Left/col-span-8) */}
          <div className="lg:col-span-8 p-6 rounded-2xl glass border border-[#3A506B]/20 flex flex-col justify-between min-h-[450px] relative bg-black/40 overflow-hidden">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-[#00E5FF] tracking-widest uppercase">
              COORDINATE_GRID: CASA_BD_M1
            </div>

            {/* Custom Interactive SVG/Canvas Intersection representation */}
            <div className="flex-1 flex items-center justify-center my-6 relative min-h-[300px]">
              <svg viewBox="0 0 800 400" className="w-full max-w-2xl h-auto">
                {/* Background Roads */}
                {/* Horizontal Road */}
                <rect x="0" y="150" width="800" height="100" fill="#1e293b" />
                <line x1="0" y1="200" x2="800" y2="200" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="10,10" />

                {/* Vertical Road */}
                <rect x="350" y="0" width="100" height="400" fill="#1e293b" />
                <line x1="400" y1="0" x2="400" y2="400" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="10,10" />

                {/* Intersection box */}
                <rect x="350" y="150" width="100" height="100" fill="#334155" />

                {/* North-South Traffic Lights */}
                <circle cx="330" cy="130" r="10" fill={trafficLights.northSouth === 'GREEN' ? '#00FF87' : '#ef4444'} className="shadow-glow-emerald" />
                <circle cx="470" cy="270" r="10" fill={trafficLights.northSouth === 'GREEN' ? '#00FF87' : '#ef4444'} />

                {/* East-West Traffic Lights */}
                <circle cx="470" cy="130" r="10" fill={trafficLights.eastWest === 'GREEN' ? '#00FF87' : '#ef4444'} />
                <circle cx="330" cy="270" r="10" fill={trafficLights.eastWest === 'GREEN' ? '#00FF87' : '#ef4444'} />

                {/* Moving Vehicles representation */}
                {/* Vehicles on Horizontal Road (East-West) */}
                <rect x={trafficLights.eastWest === 'GREEN' ? '120' : '220'} y="165" width="30" height="15" rx="3" fill="#00E5FF" opacity="0.9" />
                <rect x={trafficLights.eastWest === 'GREEN' ? '480' : '420'} y="220" width="30" height="15" rx="3" fill="#6366f1" opacity="0.9" />

                {/* Vehicles on Vertical Road (North-South) */}
                <rect x="365" y={trafficLights.northSouth === 'GREEN' ? '80' : '100'} width="15" height="30" rx="3" fill="#f43f5e" opacity="0.9" />
                <rect x="420" y={trafficLights.northSouth === 'GREEN' ? '280' : '250'} width="15" height="30" rx="3" fill="#eab308" opacity="0.9" />

                {/* Central AI detection camera cone */}
                <polygon points="400,200 300,100 500,100" fill="rgba(0, 229, 255, 0.08)" />
                <circle cx="400" cy="200" r="6" fill="#00E5FF" />
              </svg>

              {/* Graphical Info Overlay */}
              <div className="absolute top-2 right-2 bg-slate-900/90 border border-[#3A506B]/30 p-3 rounded-lg text-[10px] font-mono text-left" style={{ direction: 'ltr' }}>
                <div className="text-[#00E5FF] font-bold mb-1">DETECTION RADAR:</div>
                <div className="text-white/80">CLASS: SEDAN_COUNT_5</div>
                <div className="text-white/80">SPEED: 42 KM/H</div>
                <div className="text-white/80">Consensus: STABLE</div>
              </div>
            </div>

            <div className="border-t border-[#3A506B]/20 pt-4 text-right rtl:text-right ltr:text-left text-xs text-slate-500 dark:text-cyber-muted">
              {lang === 'ar' 
                ? 'تقوم كاميرات YOLOv8 بمراقبة وتعديل إشارات المرور آلياً لتقليل زمن الانتظار.' 
                : 'YOLOv8 Edge cameras monitor vehicle grids and optimize signal timing adaptively.'}
            </div>
          </div>

          {/* Telemetry Stats Panel (Right/col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            
            {/* Box 1: KPI Statistics */}
            <div className="p-6 rounded-2xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-orbitron">
                {lang === 'ar' ? 'البيانات الحية الميدانية' : 'Live Intersection Telemetry'}
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#8A99AD] block uppercase tracking-wider">
                    {lang === 'ar' ? 'إجمالي المركبات المكتشفة' : 'Vehicles Detected'}
                  </span>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse mt-1">
                    <span className="text-3xl font-black text-slate-800 dark:text-white font-orbitron">{vehicleCount}</span>
                    <span className="text-xs text-slate-400 dark:text-cyber-muted">cars/min</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#8A99AD] block uppercase tracking-wider">
                    {lang === 'ar' ? 'تأخير الازدحام التقاطعي' : 'Intersection Delay'}
                  </span>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse mt-1">
                    <span className="text-3xl font-black text-[#00E5FF] font-orbitron">{intersectionDelay}</span>
                    <span className="text-xs text-slate-400 dark:text-cyber-muted">seconds</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#8A99AD] block uppercase tracking-wider">
                    {lang === 'ar' ? 'استهلاك معالج الرسوميات (Edge)' : 'Edge GPU Load'}
                  </span>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse mt-1">
                    <span className="text-3xl font-black text-[#00FF87] font-orbitron">{gpuLoad}%</span>
                    <span className="text-xs text-slate-400 dark:text-cyber-muted">Maxwell Core</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: SVG Chart */}
            <div className="p-6 rounded-2xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-orbitron mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-[#00E5FF]" />
                  <span>{lang === 'ar' ? 'مخطط كفاءة التدفق' : 'Flow Density Index'}</span>
                </h3>

                {/* SVG Line Graph */}
                <div className="w-full h-32 bg-black/40 rounded-lg p-2 border border-white/5 relative">
                  <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="2.5"
                      points={telemetryHistory.map((val, idx) => `${idx * 30 + 10}, ${100 - (val * 2)}`).join(' ')}
                    />
                    {telemetryHistory.map((val, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 30 + 10}
                        cy={100 - (val * 2)}
                        r="3.5"
                        fill="#00FF87"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-cyber-muted font-mono flex justify-between mt-4">
                <span>INDEX_SAMPLING: AUTO</span>
                <span className="text-[#00FF87]">SYS: STABLE</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DigitalTwin;
