import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, PlayCircle, Github, Facebook, Youtube, Lightbulb, Image as ImageIcon } from 'lucide-react';

export default function ProjectDetails() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock Idea Data - In real app, fetch from Firestore using ID
  const project = {
    title: 'نظام إدارة المرور الذكية عبر الدرونز',
    titleEn: 'Smart Traffic via Drones',
    subtitle: 'استخدام أسراب الطائرات بدون طيار المجهزة بالذكاء الاصطناعي لحل أزمات المرور',
    subtitleEn: 'Using AI-equipped drone swarms to solve traffic congestion',
    tags: ['Robotics', 'Computer Vision', 'AI', 'Smart City'],
    ideaExplanation: `تعتمد فكرة هذا المشروع على الاستغناء عن كاميرات المراقبة الثابتة واستبدالها بسرب من الطائرات بدون طيار (الدرونز) التي تتواصل مع بعضها البعض. 
    الفكرة تكمن في قدرة الدرون على التحليق فوق التقاطعات المزدحمة، وجمع البيانات المرورية الحية، ومن ثم إرسالها إلى خادم مركزي. الخادم يقوم بتحليل البيانات وتوجيه إشارات المرور أو إرسال تنبيهات لتغيير المسارات بشكل ديناميكي.
    هذه الفكرة لا توفر الكود بحد ذاته، بل تطرح معمارية نظام (Architecture) يمكن لمهندسي المدن الذكية البناء عليها لتقليل الازدحام بنسبة 40%.`,
    ideaExplanationEn: `The core idea of this project replaces static surveillance cameras with a communicating swarm of drones. 
    The concept lies in the drone's ability to hover over congested intersections, collect live traffic data, and send it to a central server. The server analyzes the data and dynamically controls traffic lights or routes. 
    This idea presents a system architecture that smart city engineers can build upon to reduce congestion by 40%.`,
    ytVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Embed link
    githubUrl: 'https://github.com/gitmofficiel-dot',
    youtubeUrl: 'https://youtube.com',
    facebookUrl: 'https://facebook.com/gitmofficiel',
    gallery: [
      'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80',
      'https://images.unsplash.com/photo-1531297172867-4f50fcc2cb26?w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    ],
    files: [
      { name: 'Architecture_Diagram.pdf', size: '2.4 MB' },
      { name: 'Concept_Presentation.pptx', size: '14.5 MB' }
    ]
  };

  const currentTitle = lang === 'ar' ? project.title : project.titleEn;
  const currentSubtitle = lang === 'ar' ? project.subtitle : project.subtitleEn;
  const currentExplanation = lang === 'ar' ? project.ideaExplanation : project.ideaExplanationEn;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gitm-light dark:bg-gitm-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => navigate('/projects-hub')} className="mb-6 flex items-center text-gitm-mutedLight dark:text-gitm-mutedDark hover:text-gitm-blue transition font-bold">
          <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> 
          {lang === 'ar' ? 'العودة لمعرض الأفكار' : 'Back to Ideas Gallery'}
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-start">
          <h1 className="text-3xl md:text-5xl font-black text-gitm-textLight dark:text-white mb-4 leading-tight">{currentTitle}</h1>
          <p className="text-lg md:text-xl text-gitm-mutedLight dark:text-gitm-mutedDark max-w-3xl mb-6">{currentSubtitle}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-4 py-1.5 bg-gitm-blue/10 dark:bg-gitm-blue/20 text-gitm-blue rounded-full text-sm font-bold">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Action Links */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
          {project.youtubeUrl && (
            <a href={project.youtubeUrl} target="_blank" rel="noreferrer" title={lang === 'ar' ? 'يوتيوب' : 'YouTube'} className="flex items-center justify-center w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:-translate-y-1 shadow-lg">
              <Youtube size={24} />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" title="GitHub" className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-black text-white rounded-full transition-transform hover:-translate-y-1 shadow-lg">
              <Github size={24} />
            </a>
          )}
          {project.facebookUrl && (
            <a href={project.facebookUrl} target="_blank" rel="noreferrer" title={lang === 'ar' ? 'فيسبوك' : 'Facebook'} className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform hover:-translate-y-1 shadow-lg">
              <Facebook size={24} />
            </a>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* YouTube Embed */}
            {project.ytVideo && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={project.ytVideo} 
                  title="Project Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </motion.div>
            )}

            {/* Idea Explanation */}
            <div className="bg-white dark:bg-gitm-cardDark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gitm-borderDark">
              <h3 className="text-2xl font-bold mb-6 text-gitm-blue flex items-center gap-3">
                <Lightbulb className="w-8 h-8" /> 
                {lang === 'ar' ? 'شرح فكرة المشروع' : 'Project Idea Explanation'}
              </h3>
              <div className="prose dark:prose-invert max-w-none text-gitm-mutedLight dark:text-gray-300 leading-relaxed font-medium whitespace-pre-line text-lg">
                {currentExplanation}
              </div>
            </div>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="bg-gray-50 dark:bg-gitm-cardDark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gitm-borderDark">
                <h3 className="text-2xl font-bold mb-6 text-gitm-textLight dark:text-white flex items-center gap-3">
                  <ImageIcon className="w-7 h-7 text-gitm-green" /> 
                  {lang === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Attachments */}
            {project.files && project.files.length > 0 && (
              <div className="bg-white dark:bg-gitm-cardDark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gitm-borderDark sticky top-28">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gitm-textLight dark:text-white">
                  <Download className="w-6 h-6 text-gitm-red"/> 
                  {lang === 'ar' ? 'مرفقات الفكرة' : 'Idea Attachments'}
                </h3>
                <div className="space-y-4">
                  {project.files.map((f, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gitm-blue/5 dark:hover:bg-gitm-blue/10 transition-colors group border border-transparent hover:border-gitm-blue/20">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-gitm-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Download className="w-6 h-6 text-gitm-blue" />
                        </div>
                        <div className="text-left rtl:text-right overflow-hidden">
                          <p className="text-sm font-bold text-gitm-textLight dark:text-white truncate group-hover:text-gitm-blue transition-colors">{f.name}</p>
                          <p className="text-xs text-gitm-mutedLight dark:text-gitm-mutedDark mt-1">{f.size}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
