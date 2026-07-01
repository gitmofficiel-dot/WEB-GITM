import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Save, X, ArrowLeft, GripVertical, Video, FileText, Activity
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Module Component ---
const SortableModule = ({ module, onRemove, onAddLesson, onUpdateModule, onRemoveLesson, onUpdateLesson, onAddAxis, onUpdateAxis, onRemoveAxis }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl mb-4 overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 p-4 flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-600 dark:text-slate-400 hover:text-slate-600">
          <GripVertical size={20} />
        </div>
        <input 
          type="text" 
          value={module.title} 
          onChange={(e) => onUpdateModule(module.id, 'title', e.target.value)}
          placeholder="Module Title (e.g. Unit 1: Introduction)" 
          className="flex-1 bg-transparent border-none outline-none font-bold text-[#1e3a5f] dark:text-white text-lg"
        />
        <button onClick={() => onRemove(module.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
      </div>
      
      <div className="p-4 space-y-3">
        {module.lessons.map((lesson, index) => (
          <div key={lesson.id} className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl relative group">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Lesson {index + 1}</span>
                <button onClick={() => onRemoveLesson(module.id, lesson.id)} className="text-slate-600 dark:text-slate-400 hover:text-red-500"><X size={16}/></button>
             </div>
             <input 
                type="text" 
                value={lesson.title} 
                onChange={(e) => onUpdateLesson(module.id, lesson.id, 'title', e.target.value)}
                placeholder="Lesson Title" 
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500 mb-2"
             />

             {/* Axes Builder */}
             <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Lesson Axes (المحاور)</h4>
               {(lesson.axes || []).map((axis, axisIndex) => (
                 <div key={axis.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-400">Axis {axisIndex + 1}</span>
                     <button onClick={() => onRemoveAxis(module.id, lesson.id, axis.id)} className="text-red-400 hover:text-red-500"><X size={14}/></button>
                   </div>
                   
                   <input 
                     type="text" 
                     value={axis.title} 
                     onChange={(e) => onUpdateAxis(module.id, lesson.id, axis.id, 'title', e.target.value)}
                     placeholder="Axis Title (e.g. Introduction)" 
                     className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500"
                   />
                   
                   <div className="flex gap-2">
                     <select 
                       value={axis.type} 
                       onChange={(e) => onUpdateAxis(module.id, lesson.id, axis.id, 'type', e.target.value)}
                       className="p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500 w-1/3"
                     >
                       <option value="video">Video</option>
                       <option value="article">Article/Text</option>
                       <option value="code">Coding Challenge</option>
                     </select>
                     
                     {axis.type === 'video' && (
                       <input 
                         type="text" 
                         value={axis.videoUrl || ''} 
                         onChange={(e) => onUpdateAxis(module.id, lesson.id, axis.id, 'videoUrl', e.target.value)}
                         placeholder="YouTube/Facebook Video URL" 
                         className="flex-1 p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500"
                         dir="ltr"
                       />
                     )}
                   </div>

                   {axis.type === 'code' && (
                     <textarea 
                       value={axis.instructions || ''} 
                       onChange={(e) => onUpdateAxis(module.id, lesson.id, axis.id, 'instructions', e.target.value)}
                       placeholder="Coding instructions..." 
                       className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500 h-16 resize-none"
                     />
                   )}
                   
                   {axis.type === 'article' && (
                     <textarea 
                       value={axis.content || ''} 
                       onChange={(e) => onUpdateAxis(module.id, lesson.id, axis.id, 'content', e.target.value)}
                       placeholder="Article HTML content..." 
                       className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500 h-20 resize-none font-mono"
                       dir="ltr"
                     />
                   )}
                 </div>
               ))}
               <button 
                 onClick={() => onAddAxis(module.id, lesson.id)}
                 className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                 <Plus size={14} /> Add Axis (إضافة محور)
               </button>
             </div>
          </div>
        ))}
        
        <button 
          onClick={() => onAddLesson(module.id)}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-slate-800 hover:border-teal-500 hover:text-teal-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Lesson
        </button>
      </div>
    </div>
  );
};

// --- Main Editor ---
export default function SmartCourseBuilder({ initialData, onCancel, onSave }) {
  const { lang } = useLanguage();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [track, setTrack] = useState(initialData?.track || 'Edge AI'); // Edge AI, Robotics, IoT Cloud
  const [level, setLevel] = useState(initialData?.level || 'Beginner');
  const [description, setDescription] = useState(initialData?.description || '');
  const [courseIntroVideo, setCourseIntroVideo] = useState(initialData?.courseIntroVideo || '');
  const [courseIntroText, setCourseIntroText] = useState(initialData?.courseIntroText || '');
  
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [fbVideo, setFbVideo] = useState(initialData?.fbVideo || '');
  const [ytVideo, setYtVideo] = useState(initialData?.ytVideo || '');
  const [attachments, setAttachments] = useState(initialData?.attachments || []);
  const fileInputRef = React.useRef(null);
  
  const [modules, setModules] = useState(initialData?.modules || [
    { id: 'mod-1', title: 'Module 1', lessons: [] }
  ]);
  
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addModule = () => {
    setModules([...modules, { id: `mod-${Date.now()}`, title: '', lessons: [] }]);
  };

  const removeModule = (id) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const updateModule = (id, field, value) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addLesson = (moduleId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        if (m.lessons.length >= 30) {
          alert(lang === 'ar' ? 'الحد الأقصى هو 30 درساً في الوحدة' : 'Maximum is 30 lessons per module');
          return m;
        }
        return {
          ...m,
          lessons: [...m.lessons, { id: `les-${Date.now()}`, title: '', axes: [] }]
        };
      }
      return m;
    }));
  };

  const addAxis = (moduleId, lessonId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              if ((l.axes || []).length >= 12) {
                alert(lang === 'ar' ? 'الحد الأقصى هو 12 محوراً للدرس' : 'Maximum is 12 axes per lesson');
                return l;
              }
              return {
                ...l,
                axes: [...(l.axes || []), { id: `axis-${Date.now()}`, title: '', type: 'video', content: '', videoUrl: '' }]
              };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const updateAxis = (moduleId, lessonId, axisId, field, value) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              return {
                ...l,
                axes: l.axes.map(a => a.id === axisId ? { ...a, [field]: value } : a)
              };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const removeAxis = (moduleId, lessonId, axisId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              return {
                ...l,
                axes: l.axes.filter(a => a.id !== axisId)
              };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
        };
      }
      return m;
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleSubmit = () => {
    setIsSaving(true);
    const courseData = {
      title, track, level, description, modules,
      coverImage, fbVideo, ytVideo, attachments,
      courseIntroVideo, courseIntroText,
      status: 'Published',
      enrolledCount: 0
    };
    onSave(courseData);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pb-12">
      {/* Topbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded-xl transition-colors">
             <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300"/>
          </button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
              <BookOpen className="text-teal-500" size={24}/> 
              {lang === 'ar' ? 'منشئ المسارات الذكي' : 'Smart Course Builder'}
            </h2>
            <p className="text-xs text-slate-500">{lang === 'ar' ? 'سحب وإفلات، بناء هيكلي، وتكامل يوتيوب' : 'Drag & drop, structural building, YouTube integration'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} disabled={isSaving || !title}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? <Activity size={18} className="animate-spin"/> : <Save size={18}/>} 
          {lang === 'ar' ? 'نشر المسار' : 'Publish Course'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-1 gap-6">
        
        {/* Course Meta */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'عنوان الدورة' : 'Course Title'}</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-lg font-bold" dir="auto" />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'المسار الأكاديمي' : 'Academic Track'}</label>
              <select value={track} onChange={e=>setTrack(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500">
                <option value="Edge AI">Edge AI & Computer Vision</option>
                <option value="Robotics">Robotics & ROS2</option>
                <option value="IoT Cloud">IoT & Cloud Architectures</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'المستوى' : 'Level'}</label>
              <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500">
                <option value="Beginner">Beginner (مبتدئ)</option>
                <option value="Intermediate">Intermediate (متوسط)</option>
                <option value="Advanced">Advanced (متقدم)</option>
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'نظرة عامة على الدورة' : 'Course Overview'}</label>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-32 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Media */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
           <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'الوسائط المتعددة والمرفقات' : 'Rich Media & Attachments'}</h3>
           
           <div className="space-y-4">
              <div>
                 <label className="text-sm font-bold text-slate-500 mb-1 block">Cover Image URL</label>
                 <input type="text" value={coverImage} onChange={e=>setCoverImage(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-sm" placeholder="https://..." dir="ltr" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'تضمين فيديو فيسبوك (رابط)' : 'Facebook Promo Video URL'}</label>
                   <input type="text" value={fbVideo} onChange={e=>setFbVideo(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-sm" placeholder="https://facebook.com/..." dir="ltr" />
                </div>
                <div>
                   <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'تضمين فيديو يوتيوب (رابط)' : 'YouTube Promo Video URL'}</label>
                   <input type="text" value={ytVideo} onChange={e=>setYtVideo(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-sm" placeholder="https://youtube.com/watch?v=..." dir="ltr" />
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3 mt-4">
                 <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'ملفات الدورة (PDF, ZIP)' : 'Course Files (PDF, ZIP)'}</label>
                 {attachments.map((file, i) => (
                   <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                     <div className="flex items-center gap-2 overflow-hidden">
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                     </div>
                     <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-slate-600 dark:text-slate-400 hover:text-red-500 shrink-0 p-1">
                       <X size={14}/>
                     </button>
                   </div>
                 ))}
                 
                 <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                 <button 
                   onClick={() => fileInputRef.current.click()}
                   className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-slate-500 font-bold text-sm flex items-center justify-center gap-2"
                 >
                   <Plus size={16}/> {lang === 'ar' ? 'رفع ملفات / صور متعددة' : 'Upload Files / Multiple Images'}
                 </button>
              </div>
           </div>
        </div>

         {/* Course Intro */}
         <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-6">
           <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'مقدمة التدريب (لا تحتسب كدرس)' : 'Course Introduction (Not counted as a lesson)'}</h3>
           <div className="space-y-4">
             <div>
               <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'فيديو المقدمة (رابط يوتيوب أو فيسبوك)' : 'Intro Video URL'}</label>
               <input type="text" value={courseIntroVideo} onChange={e=>setCourseIntroVideo(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-sm" placeholder="https://..." dir="ltr" />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'نص المقدمة' : 'Intro Text'}</label>
               <textarea value={courseIntroText} onChange={e=>setCourseIntroText(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-teal-500 text-sm h-24 resize-none" placeholder={lang === 'ar' ? 'ماذا سيتعلم الطالب في هذا التدريب؟...' : 'What will the student learn?...'} />
             </div>
           </div>
         </div>

        {/* Modules Builder (Drag & Drop) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-teal-500"/> {lang === 'ar' ? 'هيكلة المنهج (Curriculum Builder)' : 'Curriculum Builder'}
            </h3>
            <div className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              {lang === 'ar' ? 'الحد الأقصى: 30 درساً، 12 محوراً للدرس' : 'Max limits: 30 lessons, 12 axes per lesson'}
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
              {modules.map((mod) => (
                <SortableModule 
                  key={mod.id} 
                  module={mod} 
                  onRemove={removeModule}
                  onUpdateModule={updateModule}
                  onAddLesson={addLesson}
                  onRemoveLesson={removeLesson}
                  onUpdateLesson={updateLesson}
                  onAddAxis={addAxis}
                  onUpdateAxis={updateAxis}
                  onRemoveAxis={removeAxis}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button 
            onClick={addModule}
            className="w-full py-4 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold rounded-2xl border-2 border-dashed border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={20}/> {lang === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Module'}
          </button>
        </div>

      </div>
    </div>
  );
}
