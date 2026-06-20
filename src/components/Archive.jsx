import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Hammer, Cpu, Camera, Terminal, Layers, Globe, Eye } from 'lucide-react';

const Archive = () => {
  const { t } = useLanguage();

  const archiveItems = [
    {
      title: t('archive.labElectronics'),
      desc: t('archive.labElectronicsDesc'),
      icon: Cpu,
      meta: 'LAB_LOC_01 // PCB_ASSEMBLY',
      color: 'from-emerald-500/20 to-emerald-950/20',
      badge: 'Hardware Lab'
    },
    {
      title: t('archive.fieldRobotics'),
      desc: t('archive.fieldRoboticsDesc'),
      icon: Hammer,
      meta: 'FIELD_TEST // ROS2_SWARM',
      color: 'from-cyan-500/20 to-cyan-950/20',
      badge: 'Robotics Swarm'
    },
    {
      title: t('archive.smartCityDeploy'),
      desc: t('archive.smartCityDeployDesc'),
      icon: Camera,
      meta: 'STREET_DEPLOY // CASABLANCA_EDGE',
      color: 'from-indigo-500/20 to-indigo-950/20',
      badge: 'Edge AI Deployment'
    },
    {
      title: t('archive.cloudTelemetry'),
      desc: t('archive.cloudTelemetryDesc'),
      icon: Terminal,
      meta: 'CONTROL_ROOM // WEBSOCKET_INGEST',
      color: 'from-purple-500/20 to-purple-950/20',
      badge: 'Telemetry Command'
    },
    {
      title: t('archive.labAI'),
      desc: t('archive.labAIDesc'),
      icon: Layers,
      meta: 'AI_LAB // MODEL_TRAINING',
      color: 'from-blue-500/20 to-blue-950/20',
      badge: 'Supercomputing Suite'
    },
    {
      title: t('archive.communityExpo'),
      desc: t('archive.communityExpoDesc'),
      icon: Globe,
      meta: 'EXPO // PARTNERSHIPS',
      color: 'from-teal-500/20 to-teal-950/20',
      badge: 'Corporate Networking'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('archive.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm md:text-base">
            {t('archive.subtitle')}
          </p>
        </div>

        {/* Image / Graphic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archiveItems.map((item, idx) => {
            const ItemIcon = item.icon;

            return (
              <div 
                key={idx}
                className="group relative rounded-2xl glass border border-cyan-300 dark:border-white/5 overflow-hidden flex flex-col justify-between hover:scale-[1.02] hover:border-emerald-500/30 transition-all duration-500 hover:shadow-lg dark:hover:shadow-glow-emerald"
              >
                {/* Visual Backdrop (Abstract Technology Illustration instead of empty image) */}
                <div className={`h-48 bg-gradient-to-br ${item.color} relative flex items-center justify-center border-b border-cyan-300 dark:border-white/5`}>
                  
                  {/* Technology Overlay Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 dark:from-white/2 to-transparent opacity-40"></div>
                  
                  {/* Central Icon Illustration */}
                  <div className="p-4 rounded-full bg-slate-900/60 dark:bg-black/60 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <ItemIcon className="w-10 h-10 text-emerald-400 group-hover:animate-float" />
                  </div>

                  {/* Top-Right Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-orbitron">
                    {item.badge}
                  </span>

                  {/* Overlay telemetry logs */}
                  <span className="absolute bottom-2 left-3 font-mono text-[8px] text-cyber-muted tracking-widest">
                    {item.meta}
                  </span>
                </div>

                {/* Text Content */}
                <div className="p-6 text-right rtl:text-right ltr:text-left">
                  <h3 className="text-base md:text-lg font-bold text-[#1e3a5f] dark:text-white mb-2 group-hover:text-[#0d9488] dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-cyber-muted leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="flex justify-end pt-2 border-t border-cyan-200 dark:border-white/5">
                    <button className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyber-muted hover:text-[#0d9488] dark:hover:text-emerald-400 transition-colors flex items-center space-x-1 rtl:space-x-reverse">
                      <Eye size={12} />
                      <span>{lang === 'ar' ? 'عرض السجل الفني' : 'View Technical Record'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Archive;
