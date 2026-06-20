import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';

const ThreeDViewer = ({ type = 'drone' }) => {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [clickedHotspot, setClickedHotspot] = useState(null);

  // Hotspots definitions
  const hotspotsData = {
    drone: [
      { 
        id: 1, 
        name: lang === 'ar' ? 'المعالج الرئيسي STM32F4' : 'STM32F4 Core MCU', 
        desc: lang === 'ar' ? 'متحكم 32-بت بتردد 168 ميجاهرتز يدير خوارزميات الاتزان والاستقرار للدرون.' : '32-bit Cortex-M4 MCU running at 168MHz. Manages real-time flight stabilization loops.',
        pos: { x: 0, y: 0.15, z: 0 },
        screenPos: { x: 50, y: 50 } 
      },
      { 
        id: 2, 
        name: lang === 'ar' ? 'مستشعر الحركة IMU' : 'IMU Gyro/Accel Sensor', 
        desc: lang === 'ar' ? 'حساس MPU6050 لقياس زوايا الدوران والتسارع بالمللي ثانية.' : 'MPU6050 6-axis gyro/accelerometer. Tracks flight dynamics and orientation telemetry.',
        pos: { x: -1.2, y: 0.15, z: -0.8 },
        screenPos: { x: 25, y: 30 }
      },
      { 
        id: 3, 
        name: lang === 'ar' ? 'شريحة اتصال LoRaWAN' : 'LoRaWAN RF Transceiver', 
        desc: lang === 'ar' ? 'شريحة SX1276 للاتصالات طويلة المدى وإرسال القياسات الحية للمحطة الأرضية.' : 'SX1276 transceiver. Transmits telemetry data over long-range wireless networks.',
        pos: { x: 1.2, y: 0.15, z: 0.8 },
        screenPos: { x: 75, y: 70 }
      }
    ],
    jetson: [
      { 
        id: 1, 
        name: lang === 'ar' ? 'معالج رسوميات NVIDIA Maxwell' : 'NVIDIA GPU (128 Cores)', 
        desc: lang === 'ar' ? 'معالج الرسوميات القوي لتسريع تشغيل نماذج YOLOv8 للرؤية الحاسوبية بالحافة.' : 'Maxwell architecture GPU. Performs hardware-accelerated YOLOv8 object detection on edge feeds.',
        pos: { x: 0, y: 0.2, z: 0 },
        screenPos: { x: 50, y: 45 }
      },
      { 
        id: 2, 
        name: lang === 'ar' ? 'ذاكرة عشوائية 4GB LPDDR4' : '4GB LPDDR4 Memory', 
        desc: lang === 'ar' ? 'ذاكرة عشوائية موحدة ذات نطاق عريض لتبادل البيانات فورا بين المعالج والـ GPU.' : 'High-speed shared memory. Delivers zero-copy data exchange for real-time video inference.',
        pos: { x: -1.4, y: 0.15, z: 0.5 },
        screenPos: { x: 20, y: 60 }
      },
      { 
        id: 3, 
        name: lang === 'ar' ? 'موصل الكاميرا MIPI CSI' : 'MIPI CSI Camera Port', 
        desc: lang === 'ar' ? 'موصل مباشر لدفق كاميرات الفيديو عالي الدقة بدون تأخير.' : 'MIPI CSI interface. Connects high-definition camera sensors with zero frame delay.',
        pos: { x: 1.3, y: 0.15, z: -1.2 },
        screenPos: { x: 80, y: 25 }
      }
    ]
  };

  const activeHotspots = hotspotsData[type] || hotspotsData.drone;

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth || 400;
    const height = 300;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811); // Match dark theme

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00E5FF, 1.2); // Cyan glow directional
    dirLight1.position.set(5, 5, 2);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00FF87, 0.8); // Green glow directional
    dirLight2.position.set(-5, 3, -2);
    scene.add(dirLight2);

    // Create PCB Board Group
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    // Main board plate
    const boardGeometry = new THREE.BoxGeometry(4, 0.1, 3);
    const boardMaterial = new THREE.MeshStandardMaterial({ 
      color: type === 'drone' ? 0x0B132B : 0x111e38, // Tech navy green/blue
      roughness: 0.4,
      metalness: 0.2
    });
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardGroup.add(boardMesh);

    // Add visual details (lines / chips)
    // Tracks on PCB (Circuit traces)
    const traceMaterial = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 0.3 });
    for (let i = 0; i < 6; i++) {
      const traceGeom = new THREE.BoxGeometry(0.04, 0.11, 2.5);
      const traceMesh = new THREE.Mesh(traceGeom, traceMaterial);
      traceMesh.position.set(-1.5 + i * 0.6, 0, 0);
      traceMesh.rotation.y = (Math.random() - 0.5) * 0.3;
      boardGroup.add(traceMesh);
    }

    // Chips
    // 1. STM32 / GPU (Center chip)
    const centerChipGeom = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
    const centerChip = new THREE.Mesh(centerChipGeom, chipMaterial);
    centerChip.position.set(0, 0.1, 0);
    boardGroup.add(centerChip);

    // Sub chip 1
    const subChip1Geom = new THREE.BoxGeometry(0.5, 0.15, 0.5);
    const subChip1 = new THREE.Mesh(subChip1Geom, chipMaterial);
    subChip1.position.set(-1.2, 0.08, -0.8);
    boardGroup.add(subChip1);

    // Sub chip 2
    const subChip2Geom = new THREE.BoxGeometry(0.6, 0.15, 0.4);
    const subChip2 = new THREE.Mesh(subChip2Geom, chipMaterial);
    subChip2.position.set(1.2, 0.08, 0.8);
    boardGroup.add(subChip2);

    // Connector pins
    const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    for (let x = -1.8; x <= 1.8; x += 0.2) {
      const pinGeom = new THREE.BoxGeometry(0.05, 0.15, 0.05);
      const pin1 = new THREE.Mesh(pinGeom, pinMaterial);
      pin1.position.set(x, 0.1, -1.4);
      const pin2 = new THREE.Mesh(pinGeom, pinMaterial);
      pin2.position.set(x, 0.1, 1.4);
      boardGroup.add(pin1);
      boardGroup.add(pin2);
    }

    // 3D Hotspot helpers (visual spheres)
    const hotspotMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00E5FF, 
      transparent: true, 
      opacity: 0.8 
    });
    const hotspotGeom = new THREE.SphereGeometry(0.12, 16, 16);

    const hotspotMeshes = activeHotspots.map(hs => {
      const mesh = new THREE.Mesh(hotspotGeom, hotspotMaterial);
      mesh.position.set(hs.pos.x, hs.pos.y + 0.1, hs.pos.z);
      boardGroup.add(mesh);
      return { mesh, id: hs.id };
    });

    // Rotation controls interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      if (isDragging) {
        boardGroup.rotation.y += deltaMove.x * 0.01;
        boardGroup.rotation.x += deltaMove.y * 0.01;
        
        // Clamp X rotation to avoid flipping upside down
        boardGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 3, boardGroup.rotation.x));
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Attach mouse event listeners to the canvas
    const canvasElement = renderer.domElement;
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial rotation of board for cool startup angle
    boardGroup.rotation.x = 0.4;
    boardGroup.rotation.y = -0.5;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation when not dragging
      if (!isDragging) {
        boardGroup.rotation.y += 0.003;
      }

      // Pulse hotspot meshes
      const time = Date.now() * 0.003;
      hotspotMeshes.forEach(hm => {
        hm.mesh.scale.setScalar(1 + Math.sin(time) * 0.15);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [type, lang]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#3A506B]/20 dark:border-white/5 bg-[#050811] shadow-2xl flex flex-col items-center">
      {/* 3D Container Canvas target */}
      <div ref={containerRef} className="w-full h-[300px] cursor-grab active:cursor-grabbing"></div>

      {/* Hotspots clickable triggers overlay (2D absolute positioned relative to container) */}
      <div className="absolute inset-0 pointer-events-none">
        {activeHotspots.map(hs => (
          <button
            key={hs.id}
            onClick={() => setClickedHotspot(clickedHotspot?.id === hs.id ? null : hs)}
            onMouseEnter={() => setHoveredHotspot(hs)}
            onMouseLeave={() => setHoveredHotspot(null)}
            style={{ left: `${hs.screenPos.x}%`, top: `${hs.screenPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-[#00E5FF] bg-black/60 text-white font-mono text-[10px] flex items-center justify-center pointer-events-auto hover:bg-[#00E5FF] hover:text-black transition-all cursor-pointer shadow-glow-cyan"
          >
            {hs.id}
          </button>
        ))}
      </div>

      {/* Hotspot details panel */}
      <div className="w-full p-4 border-t border-[#3A506B]/20 dark:border-white/5 bg-[#0b132b]/80 backdrop-blur text-right rtl:text-right ltr:text-left text-xs min-h-[90px] flex flex-col justify-center">
        {clickedHotspot || hoveredHotspot ? (
          <div>
            <h5 className="font-bold text-[#00E5FF] text-sm mb-1">
              {(clickedHotspot || hoveredHotspot).name}
            </h5>
            <p className="text-[#8A99AD] leading-relaxed">
              {(clickedHotspot || hoveredHotspot).desc}
            </p>
          </div>
        ) : (
          <p className="text-[#8A99AD] italic text-center">
            {lang === 'ar' 
              ? 'انقر على النقاط الرقمية (1-3) أو اسحب لتدوير اللوحة ثلاثية الأبعاد.' 
              : 'Click on digital hotspots (1-3) or drag/swipe to rotate the 3D model.'}
          </p>
        )}
      </div>

      {/* Drag helper label */}
      <span className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0b132b]/85 border border-[#3A506B]/30 text-[9px] font-mono text-[#00E5FF] select-none tracking-wider">
        3D_WEBGL: ROTATABLE
      </span>
    </div>
  );
};

export default ThreeDViewer;
