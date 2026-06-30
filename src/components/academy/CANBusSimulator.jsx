import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, ShieldAlert, Send, Plus, Settings, Terminal as TerminalIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const INITIAL_NODES = [
  { id: 'engine', name: 'Engine Control Unit (ECU)', status: 'online', hexId: '0x1A4', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { id: 'abs', name: 'Anti-lock Braking (ABS)', status: 'online', hexId: '0x2B0', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  { id: 'dashboard', name: 'Instrument Cluster', status: 'online', hexId: '0x3C8', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
];

export default function CANBusSimulator() {
  const { lang } = useLanguage();
  const [frames, setFrames] = useState([]);
  const [isCapturing, setIsCapturing] = useState(true);
  const [injectData, setInjectData] = useState({ id: '0x7DF', dlc: '8', data: '02 01 0C 00 00 00 00 00' });
  const scrollRef = useRef(null);

  // Generate random CAN traffic
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      const sourceNode = INITIAL_NODES[Math.floor(Math.random() * INITIAL_NODES.length)];
      const dataBytes = Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ');
      
      const newFrame = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString().substring(11, 23),
        canId: sourceNode.hexId,
        dlc: 8,
        data: dataBytes,
        source: sourceNode.name,
        type: 'rx'
      };

      setFrames(prev => {
        const next = [...prev, newFrame];
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isCapturing]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current && isCapturing) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [frames, isCapturing]);

  const handleInject = () => {
    const newFrame = {
      id: Date.now(),
      timestamp: new Date().toISOString().substring(11, 23),
      canId: injectData.id,
      dlc: parseInt(injectData.dlc),
      data: injectData.data,
      source: 'Diagnostic Tool (TX)',
      type: 'tx'
    };
    
    setFrames(prev => [...prev, newFrame]);
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    }
  };

  return (
    <div className="w-full bg-[#0a0f1a] border border-slate-200/ dark:border-slate-700/ rounded-2xl overflow-hidden flex flex-col lg:flex-row h-[700px] font-sans">
      
      {/* Left Panel: Nodes & Injector */}
      <div className="w-full lg:w-80 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#1e293b]/50">
           <h2 className="text-white font-bold font-orbitron flex items-center gap-2">
             <Activity size={18} className="text-cyan-400" />
             {lang === 'ar' ? 'محاكي CAN Bus' : 'CAN Bus Simulator'}
           </h2>
           <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Automotive Network Analysis</p>
        </div>

        {/* Network Nodes */}
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">{lang === 'ar' ? 'العقد النشطة (ECUs)' : 'Active Nodes (ECUs)'}</h3>
          <div className="space-y-2">
            {INITIAL_NODES.map(node => (
              <div key={node.id} className={`flex items-center justify-between p-2 rounded-lg border ${node.bg} ${node.border}`}>
                 <div className="flex items-center gap-2">
                   <node.icon size={16} className={node.color} />
                   <div>
                     <span className="text-sm font-bold text-slate-200 block leading-none mb-1">{node.name}</span>
                     <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">ID: {node.hexId}</span>
                   </div>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Injector Panel */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
             <Send size={12}/> {lang === 'ar' ? 'حقن إطار (Frame Injection)' : 'Frame Injection'}
          </h3>
          
          <div className="space-y-3 flex-1">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">CAN ID (Hex)</label>
              <input type="text" value={injectData.id} onChange={e=>setInjectData({...injectData, id: e.target.value})} className="w-full bg-[#0a0f1a] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500 uppercase" />
            </div>
            
            <div className="flex gap-2">
              <div className="w-16">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">DLC</label>
                <input type="number" min="0" max="8" value={injectData.dlc} onChange={e=>setInjectData({...injectData, dlc: e.target.value})} className="w-full bg-[#0a0f1a] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-cyan-500" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Data (Hex space separated)</label>
                <input type="text" value={injectData.data} onChange={e=>setInjectData({...injectData, data: e.target.value})} className="w-full bg-[#0a0f1a] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 outline-none focus:border-cyan-500 uppercase" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleInject}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={16} /> {lang === 'ar' ? 'إرسال الإطار' : 'Inject Frame'}
          </button>
        </div>
      </div>

      {/* Right Panel: Traffic Monitor */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0f1a]">
        
        {/* Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-[#111827] flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsCapturing(!isCapturing)}
               className={`text-xs font-bold px-3 py-1 rounded-md border transition-colors ${isCapturing ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'}`}
             >
               {isCapturing ? '■ STOP' : '▶ START'}
             </button>
             <button onClick={() => setFrames([])} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-white transition-colors">CLEAR</button>
           </div>
           
           <div className="flex items-center gap-2">
             <TerminalIcon size={14} className="text-slate-500" />
             <span className="text-xs font-mono text-slate-500">Baudrate: 500 kbps</span>
           </div>
        </div>

        {/* Traffic Table */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 p-2 border-b border-slate-800 bg-[#1e293b]/30 text-[10px] font-bold text-slate-500 uppercase sticky top-0">
             <div className="col-span-2 pl-2">Timestamp</div>
             <div className="col-span-1">Dir</div>
             <div className="col-span-2">ID</div>
             <div className="col-span-1">DLC</div>
             <div className="col-span-4">Data</div>
             <div className="col-span-2">Source</div>
          </div>
          
          {/* Table Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            <AnimatePresence initial={false}>
              {frames.map((frame) => (
                <motion.div 
                  key={frame.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`grid grid-cols-12 gap-2 p-1.5 rounded text-xs font-mono border-l-2 items-center ${
                    frame.type === 'tx' 
                      ? 'bg-blue-500/10 border-blue-500 text-blue-200' 
                      : 'bg-slate-50/ dark:bg-slate-800/ border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50/ dark:bg-slate-800/'
                  }`}
                >
                   <div className="col-span-2 text-slate-500">{frame.timestamp}</div>
                   <div className="col-span-1">
                     <span className={`px-1 rounded text-[10px] font-bold ${frame.type === 'tx' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                       {frame.type.toUpperCase()}
                     </span>
                   </div>
                   <div className={`col-span-2 font-bold ${frame.type === 'tx' ? 'text-blue-400' : 'text-cyan-400'}`}>{frame.canId}</div>
                   <div className="col-span-1 text-slate-500">{frame.dlc}</div>
                   <div className={`col-span-4 ${frame.type === 'tx' ? 'text-emerald-300' : 'text-emerald-400/70'}`}>{frame.data}</div>
                   <div className="col-span-2 text-[10px] text-slate-500 truncate" title={frame.source}>{frame.source}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {frames.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-600 font-mono text-sm">
                Waiting for CAN traffic...
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
