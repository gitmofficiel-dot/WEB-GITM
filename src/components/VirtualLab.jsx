import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Box, Activity, Cpu, Wifi } from 'lucide-react';

// A simple 3D component representing an IoT/Edge AI Node
function TechNode({ position, color, label, icon: Icon, testData }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={meshRef}
          scale={active ? 1.2 : 1}
          onClick={() => setActive(!active)}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={hovered ? '#06b6d4' : color} 
            metalness={0.8}
            roughness={0.2}
            emissive={active ? '#06b6d4' : '#000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* HTML Overlay attached to the 3D object */}
        {(hovered || active) && (
          <Html position={[0, 1.5, 0]} center>
              <div className="bg-white/ dark:bg-slate-900/ backdrop-blur-md border border-cyan-500/30 text-white p-3 rounded-xl shadow-2xl w-48 animate-fade-in-up pointer-events-none">
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <Icon size={16} />
                  <h4 className="font-bold text-sm font-orbitron">{label}</h4>
                </div>
                {active && testData ? (
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="text-emerald-400 font-bold mb-2">Status: Active & Streaming</p>
                    <div className="font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-[10px] break-words overflow-y-auto max-h-32 scrollbar-thin scrollbar-thumb-slate-600">
                      <span className="text-pink-400">ID:</span> {testData.id} <br/>
                      {testData.title && <><span className="text-purple-400">Title:</span> {testData.title}<br/></>}
                      {testData.name && <><span className="text-blue-400">Name:</span> {testData.name}<br/></>}
                      {testData.email && <><span className="text-amber-400">Email:</span> {testData.email}<br/></>}
                      {testData.body && <><span className="text-teal-400">Data:</span> {testData.body.substring(0, 50)}...<br/></>}
                      {testData.completed !== undefined && <><span className="text-orange-400">Status:</span> {testData.completed ? 'Pass' : 'Fail'}<br/></>}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Click to activate node and view data streams.
                  </p>
                )}
              </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function VirtualLab() {
  const { lang } = useLanguage();
  const [testDataItems, setTestDataItems] = useState([]);
  const [dataType, setDataType] = useState('posts');
  const [loading, setLoading] = useState(false);

  const fetchData = async (type) => {
    setLoading(true);
    setDataType(type);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${type}?_limit=3`);
      const data = await res.json();
      setTestDataItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData('posts');
  }, []);

  return (
    <div className="animate-fade-in-up w-full h-full flex flex-col pt-8">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
          {txt(lang, 'GITM 3D Virtual Lab', 'مختبر GITM الافتراضي 3D', 'Laboratoire Virtuel 3D', 'GITM 3D虚拟实验室')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {txt(
            lang, 
            'Interact with our Edge AI and IoT hardware nodes in real-time. Drag to rotate, scroll to zoom, click nodes to interact.', 
            'تفاعل مع عقد أجهزة الذكاء الاصطناعي وإنترنت الأشياء في الوقت الفعلي. اسحب للتدوير، قم بالتمرير للتكبير، انقر على العقد للتفاعل.',
            'Interagissez avec nos nœuds matériels. Faites glisser pour faire pivoter.',
            '实时与我们的硬件节点交互。'
          )}
        </p>
      </div>

      <div className="flex-1 min-h-[600px] w-full relative rounded-3xl overflow-hidden glass-card border-2 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 rounded-full text-xs font-bold uppercase backdrop-blur-md">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse mr-2 rtl:ml-2 rtl:mr-0"></span>
            Live Render
          </span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-500 border border-purple-500/30 rounded-full text-xs font-bold uppercase backdrop-blur-md">
            WebGL 2.0
          </span>
        </div>

        {/* 3D Canvas - Optimized for performance */}
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
          <color attach="background" args={['#0B132B']} />
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8b5cf6" />
          
          <Suspense fallback={null}>
            {/* Main Center Node */}
            <TechNode position={[0, 0, 0]} color="#1e293b" label="Core Processing Unit" icon={Cpu} testData={testDataItems[0]} />
            
            {/* Satellite Nodes */}
            <TechNode position={[-3, 1, -2]} color="#334155" label="Sensor Array Alpha" icon={Activity} testData={testDataItems[1]} />
            <TechNode position={[3, -1, 1]} color="#334155" label="Comms Module (5G)" icon={Wifi} testData={testDataItems[2]} />
          </Suspense>
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Bottom controls overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 bg-white/ dark:bg-slate-900/ backdrop-blur-md px-8 py-4 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="flex gap-2">
            <button 
              onClick={() => fetchData('posts')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dataType === 'posts' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
            >
              Fetch Sensor Data
            </button>
            <button 
              onClick={() => fetchData('users')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dataType === 'users' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
            >
              Fetch User Auth
            </button>
            <button 
              onClick={() => fetchData('todos')}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dataType === 'todos' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
            >
              Fetch System Logs
            </button>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Left Click Node: View Data | Drag: Rotate | Scroll: Zoom</p>
        </div>
      </div>
    </div>
  );
}
