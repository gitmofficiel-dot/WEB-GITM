import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Save, X, ArrowLeft, GripVertical, Video, FileText, Activity, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from '../../utils/toast';
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

// --- Axis Editor Component ---
const AxisEditor = ({ axis, moduleId, lessonId, axisIndex, onUpdateAxis, onRemoveAxis }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('content'); // content, media, quiz

  const handleUpdate = (field, value) => {
    onUpdateAxis(moduleId, lessonId, axis.id, field, value);
  };

  const addQuizQuestion = () => {
    const newQuestions = [...(axis.quiz || []), { id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], correctIndex: 0 }];
    handleUpdate('quiz', newQuestions);
  };

  const updateQuizQuestion = (qId, field, value) => {
    const updated = (axis.quiz || []).map(q => q.id === qId ? { ...q, [field]: value } : q);
    handleUpdate('quiz', updated);
  };

  const removeQuizQuestion = (qId) => {
    handleUpdate('quiz', (axis.quiz || []).filter(q => q.id !== qId));
  };

  const updateQuizOption = (qId, optIndex, value) => {
    const updated = (axis.quiz || []).map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    handleUpdate('quiz', updated);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type
    }));
    handleUpdate('attachments', [...(axis.attachments || []), ...newAttachments]);
  };

  const removeAttachment = (fileId) => {
    handleUpdate('attachments', (axis.attachments || []).filter(a => a.id !== fileId));
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl relative flex flex-col gap-4 shadow-sm mb-3">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <span className="font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
          <Activity size={16} className="text-teal-500"/> 
          {lang === 'ar' ? `المحور ${axisIndex + 1}` : `Axis ${axisIndex + 1}`}
        </span>
        <button onClick={() => onRemoveAxis(moduleId, lessonId, axis.id)} className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors">
          <Trash2 size={16}/>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          {lang === 'ar' ? 'المحتوى الأساسي' : 'Basic Content'}
        </button>
        <button onClick={() => setActiveTab('media')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'media' ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          {lang === 'ar' ? 'الوسائط والمرفقات' : 'Media & Files'}
        </button>
        <button onClick={() => setActiveTab('quiz')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          {lang === 'ar' ? 'الاختبار (Quiz)' : 'Quiz'}
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{lang === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</label>
              <input type="text" value={axis.title || ''} onChange={(e) => handleUpdate('title', e.target.value)} placeholder={lang === 'ar' ? 'مثال: مقدمة في الذكاء الاصطناعي' : 'e.g. Introduction to AI'} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{lang === 'ar' ? 'العنوان الفرعي' : 'Subtitle'}</label>
              <input type="text" value={axis.subtitle || ''} onChange={(e) => handleUpdate('subtitle', e.target.value)} placeholder={lang === 'ar' ? 'مثال: نظرة عامة وتاريخ' : 'e.g. Overview & History'} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">{lang === 'ar' ? 'الشرح النصي (الفقرات)' : 'Text Explanation'}</label>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <ReactQuill theme="snow" value={axis.content || ''} onChange={(val) => handleUpdate('content', val)} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-40 pb-10" placeholder={lang === 'ar' ? 'اكتب تفاصيل الدرس هنا...' : 'Write lesson details here...'}/>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">{lang === 'ar' ? 'رابط الفيديو (YouTube / Facebook)' : 'Video URL'}</label>
            <div className="flex gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 flex items-center justify-center shrink-0"><Video size={18}/></div>
              <input type="text" value={axis.videoUrl || ''} onChange={(e) => handleUpdate('videoUrl', e.target.value)} placeholder="https://..." className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-teal-500" dir="ltr" />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="text-xs font-bold text-slate-500 block mb-2">{lang === 'ar' ? 'مرفقات المحور (صور، ملفات)' : 'Axis Attachments'}</label>
            <div className="space-y-2 mb-3">
              {(axis.attachments || []).map((file) => (
                <div key={file.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-medium flex items-center gap-2"><FileText size={14} className="text-blue-500"/> {file.name} <span className="text-slate-400">({file.size})</span></span>
                  <button onClick={() => removeAttachment(file.id)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                </div>
              ))}
            </div>
            <label className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Plus size={14} /> {lang === 'ar' ? 'رفع ملفات أو صور' : 'Upload Files or Images'}
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-fade-in">
          <label className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl cursor-pointer">
            <input type="checkbox" checked={axis.hasQuiz || false} onChange={(e) => handleUpdate('hasQuiz', e.target.checked)} className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500" />
            <span className="text-sm font-bold text-amber-800 dark:text-amber-400">{lang === 'ar' ? 'تضمين اختبار في هذا المحور؟' : 'Include a quiz in this axis?'}</span>
          </label>

          {axis.hasQuiz && (
            <div className="space-y-6 mt-4">
              {(axis.quiz || []).map((q, qIndex) => (
                <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {qIndex + 1}</span>
                    <button onClick={() => removeQuizQuestion(q.id)} className="text-red-400 hover:text-red-500"><X size={16}/></button>
                  </div>
                  <input type="text" value={q.question} onChange={(e) => updateQuizQuestion(q.id, 'question', e.target.value)} placeholder={lang === 'ar' ? 'نص السؤال...' : 'Question text...'} className="w-full p-2 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-amber-500 font-bold" />
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 block">{lang === 'ar' ? 'الخيارات (حدد الإجابة الصحيحة)' : 'Options (Select correct answer)'}</span>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex gap-2 items-center">
                        <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === optIndex} onChange={() => updateQuizQuestion(q.id, 'correctIndex', optIndex)} className="w-4 h-4 text-amber-500" />
                        <input type="text" value={opt} onChange={(e) => updateQuizOption(q.id, optIndex, e.target.value)} placeholder={`Option ${optIndex + 1}`} className={`flex-1 p-2 rounded-lg border text-sm outline-none ${q.correctIndex === optIndex ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addQuizQuestion} className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg transition-colors flex justify-center items-center gap-2 text-sm">
                <Plus size={16}/> {lang === 'ar' ? 'إضافة سؤال' : 'Add Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
                 <AxisEditor 
                   key={axis.id} 
                   axis={axis} 
                   moduleId={module.id} 
                   lessonId={lesson.id} 
                   axisIndex={axisIndex} 
                   onUpdateAxis={onUpdateAxis} 
                   onRemoveAxis={onRemoveAxis} 
                 />
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
export default function SmartCourseBuilder({ initialData, onCancel, onSave, standalone }) {
  const { lang, user } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isLoading, setIsLoading] = useState(standalone && !!id);
  
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

  // --- Auto-Save Drafts & Standalone Load ---
  useEffect(() => {
    if (standalone && id) {
      const fetchCourse = async () => {
        try {
          const docRef = doc(db, 'courses', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setTrack(data.track || 'Edge AI');
            setLevel(data.level || 'Beginner');
            setDescription(data.description || '');
            setCourseIntroVideo(data.courseIntroVideo || '');
            setCourseIntroText(data.courseIntroText || '');
            setCoverImage(data.coverImage || data.imageUrl || '');
            setFbVideo(data.fbVideo || '');
            setYtVideo(data.ytVideo || '');
            setAttachments(data.attachments || []);
            setModules(data.modules || []);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          toast.error(lang === 'ar' ? 'فشل جلب المسار' : 'Failed to fetch course');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourse();
    } else if (!initialData) {
      const savedDraft = localStorage.getItem('gitm_course_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.title) setTitle(draft.title);
          if (draft.track) setTrack(draft.track);
          if (draft.level) setLevel(draft.level);
          if (draft.description) setDescription(draft.description);
          if (draft.modules) setModules(draft.modules);
        } catch (e) {
          console.error('Failed to parse draft', e);
        }
      }
      setIsLoading(false);
    }
  }, [standalone, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description || modules.length > 1) {
        localStorage.setItem('gitm_course_draft', JSON.stringify({ 
          title, track, level, description, modules 
        }));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, track, level, description, modules]);

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
                axes: [...(l.axes || []), { 
                  id: `axis-${Date.now()}`, 
                  title: '', 
                  subtitle: '', 
                  content: '', 
                  videoUrl: '', 
                  attachments: [], 
                  hasQuiz: false, 
                  quiz: [] 
                }]
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

  const handleCancelClick = () => {
    if (standalone) {
      setShowDraftModal(true);
    } else {
      if (onCancel) onCancel();
    }
  };

  const handleConfirmDraft = async (saveAsDraft) => {
    if (saveAsDraft) {
      setIsSaving(true);
      try {
        const courseData = {
          title, track, level, description, modules,
          coverImage, imageUrl: coverImage, fbVideo, ytVideo, attachments,
          courseIntroVideo, courseIntroText,
          author: user?.displayName || 'Admin',
          status: 'draft',
          updatedAt: serverTimestamp(),
        };

        if (id) {
          await updateDoc(doc(db, 'courses', id), courseData);
        } else {
          courseData.createdAt = serverTimestamp();
          courseData.enrolledCount = 0;
          await addDoc(collection(db, 'courses'), courseData);
        }
        toast.success(lang === 'ar' ? 'تم الحفظ كمسودة بنجاح' : 'Draft saved successfully');
      } catch (error) {
        console.error(error);
        toast.error(lang === 'ar' ? 'فشل حفظ المسودة' : 'Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    }
    
    if (standalone && !id) localStorage.removeItem('gitm_course_draft');
    window.close();
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const courseData = {
      title, track, level, description, modules,
      coverImage, imageUrl: coverImage, fbVideo, ytVideo, attachments,
      courseIntroVideo, courseIntroText,
      status: 'Published',
      enrolledCount: 0
    };
    
    localStorage.removeItem('gitm_course_draft');

    if (standalone) {
      try {
        const dataToSave = {
          ...courseData,
          author: user?.displayName || 'Admin',
          updatedAt: serverTimestamp(),
        };

        if (id) {
          await updateDoc(doc(db, 'courses', id), dataToSave);
          toast.success(lang === 'ar' ? 'تم تحديث المسار بنجاح' : 'Course updated successfully');
        } else {
          dataToSave.createdAt = serverTimestamp();
          await addDoc(collection(db, 'courses'), dataToSave);
          toast.success(lang === 'ar' ? 'تم نشر المسار بنجاح' : 'Course published successfully');
        }
        window.close();
      } catch (error) {
        console.error(error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء النشر' : 'Error publishing course');
        setIsSaving(false);
      }
    } else {
      onSave(courseData);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Activity className="animate-spin text-teal-500" size={32}/></div>;
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pb-12">
      
      {/* Draft Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">
              {lang === 'ar' ? 'حفظ كمسودة؟' : 'Save as Draft?'}
            </h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">
              {lang === 'ar' ? 'لديك تغييرات غير محفوظة. هل تريد حفظها كمسودة قبل المغادرة؟' : 'You have unsaved changes. Do you want to save as draft before leaving?'}
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleConfirmDraft(true)} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors">
                {lang === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
              </button>
              <button onClick={() => handleConfirmDraft(false)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold transition-colors">
                {lang === 'ar' ? 'الخروج بدون حفظ' : 'Discard & Leave'}
              </button>
              <button onClick={() => setShowDraftModal(false)} className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold transition-colors">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Topbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {(standalone || onCancel) && (
            <button onClick={handleCancelClick} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded-xl transition-colors">
               <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300"/>
            </button>
          )}
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
