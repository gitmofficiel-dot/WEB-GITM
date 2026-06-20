import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MousePointer2, Type, Square, Circle, Share2, Save, Users, Plus } from 'lucide-react';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function CollaborationBoard() {
  const { lang, user } = useLanguage();
  const [activeTool, setActiveTool] = useState('cursor');
  const [elements, setElements] = useState([]);
  const boardRef = useRef(null);

  // Mock multiplayer cursors
  const [cursors, setCursors] = useState([
    { id: 1, name: 'Youssef M.', color: '#06b6d4', x: 200, y: 150 },
    { id: 2, name: 'Amina H.', color: '#8b5cf6', x: 500, y: 300 }
  ]);

  useEffect(() => {
    // Simulate other users moving their cursors
    const interval = setInterval(() => {
      setCursors(prev => prev.map(c => ({
        ...c,
        x: c.x + (Math.random() - 0.5) * 50,
        y: c.y + (Math.random() - 0.5) * 50
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBoardClick = (e) => {
    if (activeTool === 'cursor') return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = {
      id: Date.now(),
      type: activeTool,
      x, y,
      width: 100, height: 100,
      text: activeTool === 'text' ? 'New Text' : '',
      color: '#06b6d4'
    };

    setElements([...elements, newElement]);
    setActiveTool('cursor');
  };

  return (
    <div className="flex flex-col h-[85vh] animate-fade-in-up">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-orbitron flex items-center gap-3">
            {txt(lang, 'Live Architecture Board', 'لوحة المعمارية المباشرة', 'Tableau interactif', '实时协作板')}
            <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] uppercase font-bold rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
            </span>
          </h2>
          <p className="text-sm text-slate-500">Project: Edge AI Health Diagnostic</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4">
            {cursors.map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-white z-10" style={{ backgroundColor: c.color }}>
                {c.name.charAt(0)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 dark:border-slate-700 bg-cyan-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 z-0">
              <Plus size={14} />
            </div>
          </div>
          <button className="btn-glass px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Share2 size={16} /> Share
          </button>
          <button className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Save size={16} /> Save Snapshot
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Toolbar */}
        <div className="w-16 glass-card rounded-2xl flex flex-col items-center py-4 gap-4">
          {[
            { id: 'cursor', icon: MousePointer2 },
            { id: 'text', icon: Type },
            { id: 'square', icon: Square },
            { id: 'circle', icon: Circle },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-3 rounded-xl transition-colors ${activeTool === tool.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-500 hover:bg-cyan-100 dark:hover:bg-slate-800'}`}
            >
              <tool.icon size={20} />
            </button>
          ))}
        </div>

        {/* Board Canvas */}
        <div 
          ref={boardRef}
          onClick={handleBoardClick}
          className="flex-1 glass-card rounded-2xl bg-grid-slate-200 dark:bg-grid-white/[0.02] bg-[size:20px_20px] relative overflow-hidden cursor-crosshair"
        >
          {/* Render Elements */}
          {elements.map(el => (
            <motion.div
              key={el.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center
                ${el.type === 'circle' ? 'rounded-full' : 'rounded-lg'}
              `}
              style={{
                left: el.x - el.width/2,
                top: el.y - el.height/2,
                width: el.width,
                height: el.height
              }}
            >
              {el.type === 'text' && <span className="font-bold text-[#1e3a5f] dark:text-white p-2 outline-none" contentEditable>{el.text}</span>}
            </motion.div>
          ))}

          {/* Render Other Users Cursors */}
          {cursors.map(c => (
            <motion.div
              key={c.id}
              animate={{ x: c.x, y: c.y }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute pointer-events-none z-50 flex flex-col items-start"
            >
              <MousePointer2 size={24} color={c.color} className="drop-shadow-lg -ml-1 -mt-1" />
              <div className="px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-lg mt-1" style={{ backgroundColor: c.color }}>
                {c.name}
              </div>
            </motion.div>
          ))}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
              <p className="font-medium bg-[#e0fcfc]/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                {txt(lang, 'Select a tool to start drawing architecture.', 'اختر أداة لبدء رسم المخطط المعماري.', 'Sélectionnez un outil', '选择一个工具')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
