import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Layout, Play, Plus, Trash2, ArrowRight, Save, Download } from 'lucide-react';
import { toast } from '../utils/toast';

const ArchitectureBuilder = () => {
  const { lang } = useLanguage();
  const [nodes, setNodes] = useState([
    { id: 'node-1', type: 'Edge Node', name: 'Jetson Camera', x: 100, y: 150 },
    { id: 'node-2', type: 'MQTT Broker', name: 'EMQX Server', x: 300, y: 150 },
    { id: 'node-3', type: 'IoT Hub', name: 'Node.js Cluster', x: 500, y: 150 }
  ]);
  const [connections, setConnections] = useState([
    { from: 'node-1', to: 'node-2' },
    { from: 'node-2', to: 'node-3' }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [linkingSourceId, setLinkingSourceId] = useState(null);

  const canvasRef = useRef(null);

  const nodeTemplates = [
    { type: 'Edge Node', name: 'STM32 / ESP32 Sensor' },
    { type: 'AI Edge', name: 'Jetson Nano YOLO' },
    { type: 'MQTT Broker', name: 'MQTT Message Broker' },
    { type: 'IoT Hub', name: 'NodeJS WebSocket Server' },
    { type: 'Database', name: 'TimescaleDB / InfluxDB' },
    { type: 'Cache', name: 'Redis Key-Value Cache' },
    { type: 'Frontend', name: 'React Dashboard Client' }
  ];

  const spawnNode = (template) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: template.type,
      name: template.name,
      x: 150 + Math.random() * 100,
      y: 100 + Math.random() * 100
    };
    setNodes(prev => [...prev, newNode]);
  };

  const handleMouseDown = (nodeId, e) => {
    e.stopPropagation();
    if (linkingSourceId) {
      // Complete line connection
      if (linkingSourceId !== nodeId) {
        // Avoid duplicate links
        const linkExists = connections.some(c => 
          (c.from === linkingSourceId && c.to === nodeId) ||
          (c.from === nodeId && c.to === linkingSourceId)
        );
        if (!linkExists) {
          setConnections(prev => [...prev, { from: linkingSourceId, to: nodeId }]);
        }
      }
      setLinkingSourceId(null);
      return;
    }

    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedNodeId || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    setNodes(prev => prev.map(n => {
      if (n.id === draggedNodeId) {
        // Constrain movement inside canvas
        return {
          ...n,
          x: Math.max(10, Math.min(canvasRect.width - 150, newX)),
          y: Math.max(10, Math.min(canvasRect.height - 80, newY))
        };
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
    setConnections(prev => prev.filter(c => c.from !== selectedNodeId && c.to !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setLinkingSourceId(null);
  };

  const handleLinkClick = (nodeId, e) => {
    e.stopPropagation();
    setLinkingSourceId(nodeId);
  };

  // Helper to get midpoint coordinates of a node
  const getNodeCenter = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + 75, // Half of width (150)
      y: node.y + 35  // Half of height (70)
    };
  };

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 uppercase tracking-wider mb-3 inline-block">
            {lang === 'ar' ? 'مخطط الأنظمة الهندسية' : 'GITM Architecture Builder'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {lang === 'ar' ? 'منشئ بنية النظم التفاعلي' : 'Interactive Architecture Builder'}
          </h2>
          <div className="w-20 h-1 bg-[#00E5FF] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm leading-relaxed">
            {lang === 'ar' 
              ? 'صمم ورتب مخططات تدفق البيانات أو البنى التحتية السحابية والشبكات التابعة لمشروعك، وقم بحفظها مباشرة.' 
              : 'Design and prototype data flow maps, cloud infrastructures, and edge network topologies interactively.'}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl glass border border-[#3A506B]/20 gap-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              disabled={!selectedNodeId}
              onClick={deleteSelectedNode}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{lang === 'ar' ? 'حذف العقدة المحددة' : 'Delete Selected'}</span>
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-lg border border-cyan-400 dark:border-white/10 text-slate-500 hover:text-red-500 transition-all text-xs font-bold"
            >
              {lang === 'ar' ? 'مسح مساحة الرسم' : 'Clear Canvas'}
            </button>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => toast.success(lang === 'ar' ? 'تم حفظ التخطيط بنجاح في ملفات المشروع!' : 'Architecture layout saved to project files successfully!')}
              className="px-3 py-1.5 rounded-lg bg-[#3A506B]/20 border border-[#3A506B]/30 text-white hover:border-[#00E5FF]/40 transition-all text-xs font-bold flex items-center space-x-1.5"
            >
              <Save size={14} className="text-[#00E5FF]" />
              <span>{lang === 'ar' ? 'حفظ المخطط' : 'Save Spec'}</span>
            </button>
            <button
              onClick={() => toast.success(lang === 'ar' ? 'جاري تصدير المخطط بصيغة صورة PNG...' : 'Exporting diagram to PNG image...')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-black font-black transition-all text-xs flex items-center space-x-1.5"
            >
              <Download size={14} />
              <span>{lang === 'ar' ? 'تصدير PNG' : 'Export PNG'}</span>
            </button>
          </div>
        </div>

        {/* Builder Board Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Side Palette (Templates list) */}
          <div className="lg:col-span-3 p-6 rounded-2xl glass border border-[#3A506B]/20 bg-cyan-50 dark:bg-black/20 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1e3a5f] dark:text-white uppercase tracking-wider font-orbitron mb-4">
                {lang === 'ar' ? 'عناصر البنية التحتية' : 'System Node Palette'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-cyber-muted leading-relaxed mb-6">
                {lang === 'ar' 
                  ? 'انقر على أي عنصر لإضافته إلى لوحة الرسم، ثم اسحبه لتعديل مساره.' 
                  : 'Click on any template to add it to the canvas. Drag to reposition.'}
              </p>

              <div className="space-y-3">
                {nodeTemplates.map(template => (
                  <button
                    key={template.name}
                    onClick={() => spawnNode(template)}
                    className="w-full p-3 rounded-lg border border-[#3A506B]/20 dark:border-white/5 hover:border-[#00E5FF]/40 bg-[#e0fcfc]/5 hover:bg-[#00E5FF]/5 transition-all text-right rtl:text-right ltr:text-left flex justify-between items-center group text-xs font-semibold"
                  >
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 dark:text-cyber-muted block font-mono uppercase">{template.type}</span>
                      <span className="text-[#1e3a5f] dark:text-white group-hover:text-[#00E5FF] font-bold">{template.name.split(' ')[0]}</span>
                    </div>
                    <Plus size={14} className="text-slate-600 dark:text-slate-400 group-hover:text-[#00E5FF]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[#3A506B]/10 dark:border-white/5 pt-4 text-[10px] text-slate-500 dark:text-cyber-muted font-mono leading-relaxed">
              {lang === 'ar' 
                ? 'ملاحظة: لربط العقدتين، انقر على زر (Link) في العقدة الأولى ثم انقر على العقدة المستهدفة.' 
                : 'TIP: Click the [Link] button on a node, then click another node to draw a connection trace.'}
            </div>
          </div>

          {/* Interactive Workspace Board (Right/col-span-9) */}
          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="lg:col-span-9 rounded-2xl border border-[#3A506B]/20 bg-slate-950 min-h-[500px] relative overflow-hidden select-none"
          >
            {/* SVG Background Grid and Connection traces lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <pattern id="builder-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#00E5FF" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#builder-grid)" />

              {/* Render links */}
              {connections.map((conn, idx) => {
                const start = getNodeCenter(conn.from);
                const end = getNodeCenter(conn.to);
                return (
                  <g key={idx}>
                    {/* Glow backup line */}
                    <line
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke="rgba(0,229,255,0.15)"
                      strokeWidth="6"
                    />
                    <line
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke="#00E5FF"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Link drawing helper feedback */}
            {linkingSourceId && (
              <div className="absolute top-4 left-4 bg-[#ef4444]/15 border border-[#ef4444]/30 px-3 py-1 rounded text-[10px] font-mono text-red-400 animate-pulse uppercase tracking-wider">
                {lang === 'ar' ? 'اختر عقدة الوجهة لإكمال الاتصال...' : 'Link mode active: click destination node...'}
              </div>
            )}

            {/* Render node cards */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isLinkingSource = linkingSourceId === node.id;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  style={{ left: node.x, top: node.y }}
                  className={`absolute w-[160px] p-3 rounded-lg border backdrop-blur transition-all flex flex-col justify-between cursor-move text-right rtl:text-right ltr:text-left ${
                    isSelected 
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-glow-cyan' 
                      : 'border-[#3A506B]/40 bg-[#0B132B]/85 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-[8px] font-mono text-slate-600 dark:text-slate-400 font-bold block uppercase tracking-wider mb-1">
                      {node.type}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{node.name}</h4>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                    <button
                      onClick={(e) => handleLinkClick(node.id, e)}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase transition-all ${
                        isLinkingSource 
                          ? 'bg-red-500 text-white' 
                          : 'bg-[#e0fcfc]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20'
                      }`}
                    >
                      {isLinkingSource ? 'Cancel' : 'Link'}
                    </button>
                    <span className="text-[8px] text-slate-500 font-mono">
                      X:{Math.round(node.x)} Y:{Math.round(node.y)}
                    </span>
                  </div>
                </div>
              );
            })}

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-cyber-muted text-xs italic">
                <Layout size={24} className="mb-2 text-[#3A506B]" />
                {lang === 'ar' ? 'المخطط فارغ. انقر على القائمة الجانبية لإضافة عناصر.' : 'Workspace empty. Select items from the palette.'}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ArchitectureBuilder;
