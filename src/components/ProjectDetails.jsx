import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Download, PlayCircle, Code2, Users, FileText, CheckCircle2 } from 'lucide-react';

export default function ProjectDetails() {
  const { lang, setView, selectedProfileId } = useLanguage();
  // Using a mock project, in a real scenario we'd pass an ID via context or router.
  
  const project = {
    title: 'Edge AI YOLOv8 Autonomous Drone',
    subtitle: 'Real-time object detection on edge devices (Jetson Nano) for autonomous navigation',
    tags: ['AI', 'Computer Vision', 'Robotics', 'C++'],
    images: [
      'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
    ],
    video: 'https://example.com/video',
    files: [
      { name: 'Architecture_Diagram.pdf', size: '2.4 MB' },
      { name: 'Model_Weights_V1.onnx', size: '14.5 MB' }
    ]
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => setView('projects')} className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition font-medium">
          <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {lang === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">{project.title}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-6">{project.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Media */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl overflow-hidden shadow-xl aspect-video relative group cursor-pointer">
              <img src={project.images[0]} className="w-full h-full object-cover" alt="Project" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-20 h-20 text-white opacity-80" />
              </div>
            </motion.div>

            {/* Explanation & Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{lang === 'ar' ? 'ملخص المشروع' : 'Project Summary'}</h3>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>This project implements an ultra-efficient object detection pipeline running natively on a Jetson Nano. By converting YOLOv8 weights to TensorRT, we achieved 45 FPS.</p>
                <p>The drone uses this visual data to map its surroundings and avoid obstacles dynamically without needing a cloud connection.</p>
              </div>
            </div>

            {/* AI Insights Block */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2 relative z-10">
                <Cpu className="w-6 h-6" /> {lang === 'ar' ? 'تحليل الذكاء الاصطناعي' : 'AI Project Insights'}
              </h3>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-start text-purple-900 dark:text-purple-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 mr-2 rtl:ml-2 text-purple-500 shrink-0" />
                  <span><strong>Architecture:</strong> Highly optimized pipeline. Use of TensorRT provides a 300% boost over native PyTorch.</span>
                </li>
                <li className="flex items-start text-purple-900 dark:text-purple-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 mr-2 rtl:ml-2 text-purple-500 shrink-0" />
                  <span><strong>Scalability:</strong> Code modularity allows easy swap of YOLO versions. Consider upgrading to YOLOv9.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Files & Reports */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-500"/> {lang === 'ar' ? 'الملفات والتقارير' : 'Files & Reports'}</h3>
              <div className="space-y-3">
                {project.files.map((f, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-left rtl:text-right overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{f.name}</p>
                        <p className="text-xs text-slate-500">{f.size}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500"/> {lang === 'ar' ? 'فريق العمل' : 'Project Team'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">S</div>
                  <div>
                    <p className="font-bold text-sm">Soufiane El Alaoui</p>
                    <p className="text-xs text-slate-500">Lead AI Engineer</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
