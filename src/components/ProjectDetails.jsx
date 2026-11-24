import {projectField, projectCategory} from '../utils/projectPresentation';
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Github, Facebook, Youtube, Lightbulb, Image as ImageIcon } from 'lucide-react';

const GalleryImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 shadow-sm hover:shadow-lg transition-shadow">
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover hover:scale-105 transition-all duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
          <ImageIcon size={28} />
        </div>
      )}
    </div>
  );
};

const toText = (value, keepBreaks) => {
  if (!value || typeof value !== 'string') return '';
  let text = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/[<&]/.test(text)) break;
    if (keepBreaks) text = text.replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, '\n');
    const d = new DOMParser().parseFromString(text, 'text/html');
    text = d.body.textContent || '';
  }
  text = text.replace(/\u00a0/g, ' ');
  return keepBreaks ? text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim() : text.replace(/\s+/g, ' ').trim();
};

export default function ProjectDetails() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setData(null);
    window.scrollTo(0, 0);
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', String(id)));
        if (!alive) return;
        if (snap.exists()) { setData({ id: snap.id, ...snap.data() }); setStatus('ok'); }
        else setStatus('missing');
      } catch (e) {
        console.error('Error loading project:', e);
        if (alive) setStatus('missing');
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const pick = (...vals) => vals.find(v => typeof v === 'string' && v.trim()) || '';
  const arr = (v) => Array.isArray(v) ? v.filter(Boolean) : (typeof v === 'string' && v.trim() ? v.split(',').map(x => x.trim()).filter(Boolean) : []);
  const d = data || {};
  const toEmbed = (u) => {
    const m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : '';
  };
  const project = {
    title: pick(d.titleAr, d.title, d.titleEn),
    titleEn: pick(d.titleEn, d.title, d.titleAr),
    subtitle: pick(d.subtitleAr, d.descriptionAr, d.description, d.desc),
    subtitleEn: pick(d.subtitleEn, d.descriptionEn, d.description, d.desc, d.descriptionAr),
    tags: arr(d.tags).length ? arr(d.tags) : arr(d.category),
    ideaExplanation: pick(d.ideaExplanationAr, d.ideaExplanation, d.contentAr, d.content, d.descriptionAr, d.description, d.desc),
    ideaExplanationEn: pick(d.ideaExplanationEn, d.contentEn, d.descriptionEn, d.ideaExplanation, d.content, d.description, d.desc, d.descriptionAr),
    ytVideo: toEmbed(d.ytVideo || d.videoUrl || d.youtubeUrl),
    githubUrl: pick(d.githubUrl, d.github, d.repoUrl),
    youtubeUrl: pick(d.youtubeUrl),
    facebookUrl: pick(d.facebookUrl),
    gallery: arr(d.gallery).length ? arr(d.gallery) : arr(d.coverImage),
    files: Array.isArray(d.files) ? d.files.filter(f => f && f.name) : []
  };

  const label = (ar,en,fr) => lang==='ar'?ar:lang==='fr'?fr:en;
  if (status !== 'ok') {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gitm-light dark:bg-gitm-dark flex items-center justify-center px-4">
        <div className="text-center text-slate-700 dark:text-slate-300">
          <p className="mb-4">{status === 'loading' ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : (lang === 'ar' ? 'هذا المشروع غير موجود.' : 'Project not found.')}</p>
          <button type="button" onClick={() => navigate('/projects')} className="px-4 min-h-[44px] rounded-xl bg-gitm-blue text-white">{label('العودة للمشاريع','Back to Projects','Retour aux projets')}</button>
        </div>
      </div>
    );
  }

  const currentTitle = projectField(d,'title',lang);
  const currentExplanation = toText(projectField(d,'ideaExplanation',lang) || projectField(d,'content',lang) || projectField(d,'description',lang) || d.desc,true);
  const explicitSubtitle = projectField(d,'subtitle',lang);
  const currentSubtitle = toText(explicitSubtitle).trim() === toText(currentExplanation).trim() ? '' : toText(explicitSubtitle).slice(0,300);


  return (
    <div className="pt-6 pb-4 md:pb-8 bg-gitm-light dark:bg-gitm-dark overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button (>=44px touch target) */}
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mb-4 md:mb-6 inline-flex items-center min-h-[44px] px-2 -mx-2 text-slate-700 dark:text-slate-300 hover:text-gitm-blue dark:hover:text-cyan-400 transition font-bold text-sm md:text-base"
        >
          <ArrowLeft className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180 shrink-0" />
          <span>{label('العودة للمشاريع','Back to Projects','Retour aux projets')}</span>
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-10 text-start">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gitm-textLight dark:text-white mb-3 md:mb-4 leading-tight break-words">
            {currentTitle}
          </h1>
          {currentSubtitle && <p className="text-sm sm:text-base md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mb-5 md:mb-6 leading-relaxed">
            {currentSubtitle}
          </p>}
          {/* Tags with LTR isolation so '#' never flips to the end in Arabic RTL */}
          <div className="filter-scroll md:flex-wrap pb-1">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                dir="ltr"
                className="inline-flex items-center px-3.5 py-1.5 bg-gitm-blue/10 dark:bg-gitm-blue/25 text-gitm-blue dark:text-cyan-300 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap"
              >
                #{projectCategory(tag,lang)}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Action Links (48x48 touch targets) */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-10 justify-start">
          {project.youtubeUrl && (
            <a href={project.youtubeUrl} target="_blank" rel="noreferrer" aria-label={lang === 'ar' ? 'يوتيوب' : 'YouTube'} title={lang === 'ar' ? 'يوتيوب' : 'YouTube'} className="flex items-center justify-center w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:-translate-y-1 active:scale-95 shadow-lg">
              <Youtube size={22} />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-black text-white rounded-full transition-transform hover:-translate-y-1 active:scale-95 shadow-lg">
              <Github size={22} />
            </a>
          )}
          {project.facebookUrl && (
            <a href={project.facebookUrl} target="_blank" rel="noreferrer" aria-label={lang === 'ar' ? 'فيسبوك' : 'Facebook'} title={lang === 'ar' ? 'فيسبوك' : 'Facebook'} className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform hover:-translate-y-1 active:scale-95 shadow-lg">
              <Facebook size={22} />
            </a>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          <div className="lg:col-span-2 space-y-6 md:space-y-8">

            {/* YouTube Embed */}
            {project.ytVideo && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={project.ytVideo}
                  title="Project Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}

            {/* Idea Explanation */}
            <div className="bg-white dark:bg-gitm-cardDark rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 dark:border-gitm-borderDark">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gitm-blue dark:text-cyan-400 flex items-center gap-2.5">
                <Lightbulb className="w-6 h-6 md:w-8 md:h-8 shrink-0" />
                <span>{label('شرح فكرة المشروع','Project Overview','Présentation du projet')}</span>
              </h2>
              <div className="whitespace-pre-line break-words prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line text-sm sm:text-base md:text-lg">
                {currentExplanation}
              </div>
            </div>

            {/* Gallery (16:9 with unified fallback & skeleton) */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="bg-white dark:bg-gitm-cardDark rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 dark:border-gitm-borderDark">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gitm-textLight dark:text-white flex items-center gap-2.5">
                  <ImageIcon className="w-6 h-6 md:w-7 md:h-7 text-gitm-green shrink-0" />
                  <span>{label('معرض الصور','Image Gallery','Galerie d’images')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <GalleryImage key={idx} src={img} alt={`${currentTitle} - ${idx + 1}`} />
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Attachments */}
            {project.files && project.files.length > 0 && (
              <div className="bg-white dark:bg-gitm-cardDark rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 dark:border-gitm-borderDark lg:sticky lg:top-28">
                <h2 className="text-lg font-bold mb-4 md:mb-6 flex items-center gap-2 text-gitm-textLight dark:text-white">
                  <Download className="w-5 h-5 md:w-6 md:h-6 text-gitm-red shrink-0" />
                  <span>{label('مرفقات المشروع','Project Attachments','Pièces jointes')}</span>
                </h2>
                <div className="space-y-3">
                  {project.files.map((f, i) => (
                    <button
                      type="button"
                      key={i}
                      className="w-full min-h-[56px] flex items-center justify-between p-3.5 md:p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] hover:bg-gitm-blue/5 dark:hover:bg-gitm-blue/10 transition-colors group border border-slate-200/70 dark:border-slate-800 hover:border-gitm-blue/30"
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gitm-blue/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Download className="w-5 h-5 md:w-6 md:h-6 text-gitm-blue dark:text-cyan-400" />
                        </div>
                        <div className="text-left rtl:text-right overflow-hidden">
                          <p className="text-sm font-bold text-gitm-textLight dark:text-white truncate group-hover:text-gitm-blue dark:group-hover:text-cyan-400 transition-colors">
                            {f.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{f.size}</p>
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
