import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, Server, Radio, Database, Info, GitBranch } from 'lucide-react';
import ThreeDViewer from './ThreeDViewer';

const Showcase = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('smartCity');
  const [rightPanelTab, setRightPanelTab] = useState('3d');

  const categories = [
    { id: 'smartCity', label: t('showcase.categories.smartCity'), icon: Cpu, color: 'emerald' },
    { id: 'robotics', label: t('showcase.categories.robotics'), icon: GitBranch, color: 'cyan' },
    { id: 'platforms', label: t('showcase.categories.platforms'), icon: Database, color: 'indigo' },
  ];

  const projectData = {
    smartCity: t('showcase.projects.smartCity'),
    robotics: t('showcase.projects.robotics'),
    platforms: t('showcase.projects.platforms'),
  };

  const currentProject = projectData[activeCategory];
  const ActiveIcon = categories.find(c => c.id === activeCategory)?.icon || Cpu;
  const activeColor = categories.find(c => c.id === activeCategory)?.color || 'emerald';

  const getColorClasses = (col) => {
    switch (col) {
      case 'cyan': return {
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-500/10',
        glow: 'shadow-glow-cyan',
        glass: 'glass-cyan'
      };
      case 'indigo': return {
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        bg: 'bg-indigo-500/10',
        glow: 'shadow-glow-indigo',
        glass: 'glass-indigo'
      };
      default: return {
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        glow: 'shadow-glow-emerald',
        glass: 'glass-emerald'
      };
    }
  };

  const style = getColorClasses(activeColor);

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-black/30 border-y border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('showcase.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-muted text-sm md:text-base">
            {t('showcase.subtitle')}
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const catStyle = getColorClasses(cat.color);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full md:w-auto flex items-center justify-center space-x-3 rtl:space-x-reverse px-6 py-4 rounded-xl border text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? `${catStyle.text} ${catStyle.border} ${catStyle.bg} ${catStyle.glow} scale-105`
                    : 'text-cyber-muted border-white/5 bg-white/5 hover:border-white/10 hover:text-white'
                }`}
              >
                <CatIcon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Case Study Details Panel */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch transition-all duration-500`}>
          
          {/* Card Left: Core Case Study Info */}
          <div className={`lg:col-span-7 flex flex-col justify-between p-8 rounded-2xl ${style.glass} ${style.border} relative overflow-hidden transition-all duration-300`}>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
                  <ActiveIcon size={20} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {currentProject.title}
                </h3>
              </div>

              <p className="text-cyber-muted text-sm md:text-base leading-relaxed mb-6">
                {currentProject.description}
              </p>

              {/* Problem/Solution Area */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="mt-1 text-emerald-400">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-orbitron">
                      {t('showcase.problem')}
                    </h4>
                    <p className="text-xs md:text-sm text-cyber-muted">
                      {currentProject.problemSolved}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Badges */}
            <div className="border-t border-white/5 pt-4 mt-6">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5 font-orbitron">
                {t('showcase.techUsed')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.tech.split(', ').map((techItem) => (
                  <span 
                    key={techItem} 
                    className={`px-3 py-1 rounded-md text-[10px] md:text-xs font-mono font-bold bg-white/5 border border-white/10 ${style.text}`}
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card Right: Interactive Architecture & 3D Viewer */}
          <div className={`lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden`}>
            
            {/* Tab Swapper */}
            <div className="flex border-b border-white/5 pb-2 mb-4 justify-between items-center">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setRightPanelTab('3d')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    rightPanelTab === '3d'
                      ? 'bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-black font-black'
                      : 'text-cyber-muted hover:text-white bg-white/5'
                  }`}
                >
                  {t('lang') === 'ar' || true ? 'لوحة ثلاثية الأبعاد (3D Model)' : '3D Model'}
                </button>
                <button
                  onClick={() => setRightPanelTab('arch')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    rightPanelTab === 'arch'
                      ? 'bg-gradient-to-r from-[#00FF87] to-emerald-500 text-black font-black'
                      : 'text-cyber-muted hover:text-white bg-white/5'
                  }`}
                >
                  {t('lang') === 'ar' || true ? 'مخطط البنية (Architecture)' : 'Architecture'}
                </button>
              </div>
              <div className="font-mono text-[9px] text-cyber-muted">
                SYS_VIS_v2.0
              </div>
            </div>

            {rightPanelTab === '3d' ? (
              <div className="w-full">
                <ThreeDViewer type={activeCategory === 'smartCity' ? 'jetson' : 'drone'} />
              </div>
            ) : (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-orbitron flex items-center space-x-2 rtl:space-x-reverse">
                  <Server size={14} className={style.text} />
                  <span>{t('showcase.archDiagram')}</span>
                </h4>

                {/* Graphical representation of the architecture */}
                <div className="space-y-4 my-6 font-mono text-xs">
                  {activeCategory === 'smartCity' && (
                    <div className="relative border-l border-emerald-500/30 pl-4 py-2 space-y-4 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-emerald-400 font-bold">EDGE CAPTURE</span>
                        <p className="text-white/70 text-[11px]">Local Video Pipeline (Jetson Nano)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-cyan-400 font-bold">TELEMETRY INGESTION</span>
                        <p className="text-white/70 text-[11px]">MQTT payload {"->"} broker.gitm.ma</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">OPTIMIZATION MODEL</span>
                        <p className="text-white/70 text-[11px]">Wait Time Minimization Algorithm</p>
                      </div>
                    </div>
                  )}

                  {activeCategory === 'robotics' && (
                    <div className="relative border-l border-cyan-500/30 pl-4 py-2 space-y-4 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-cyan-400 font-bold">ROBOT NAVIGATION</span>
                        <p className="text-white/70 text-[11px]">LiDAR + Depth SLAM Mapping</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">SWARM DDS (ROS2)</span>
                        <p className="text-white/70 text-[11px]">Consensus coordinates exchange</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-emerald-400 font-bold">TASK EXECUTION</span>
                        <p className="text-white/70 text-[11px]">Decentralized mission split</p>
                      </div>
                    </div>
                  )}

                  {activeCategory === 'platforms' && (
                    <div className="relative border-l border-indigo-500/30 pl-4 py-2 space-y-4 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-indigo-400 font-bold">CLIENT DASHBOARD</span>
                        <p className="text-white/70 text-[11px]">React Web Socket Listeners</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-emerald-400 font-bold">INGESTION ENGINE</span>
                        <p className="text-white/70 text-[11px]">Node.js Cluster {"->"} TimescaleDB</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 rtl:-right-[21px] rtl:left-auto"></div>
                        <span className="text-[10px] text-cyan-400 font-bold">ANOMALY WARNING</span>
                        <p className="text-white/70 text-[11px]">AI trigger predicting component failures</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Technical Specifications */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <span className="text-white font-bold block border-b border-white/5 pb-1.5 uppercase tracking-wider font-orbitron text-[10px]">
                System Topology Specs
              </span>
              <div className="space-y-1.5 text-[10px] text-cyber-muted font-mono">
                <div>
                  <span className="text-white/40 block">PIPELINE ARCHITECTURE:</span>
                  <span className="text-white/80">{currentProject.architecture}</span>
                </div>
                <div>
                  <span className="text-white/40">INTEGRATION STATUS: </span>
                  <span className="text-[#00FF87] font-bold">OPERATIONAL</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Showcase;
