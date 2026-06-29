import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Eye, Maximize, Minimize, Bot, CheckCircle, Upload, 
  Tag, X, Sparkles, FileText, Activity, Layers, ArrowLeft, Edit3, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PREDEFINED_CATEGORIES = ['مشاريع الأنظمة المدمجة', 'أخبار الروبوت علي', 'تغطيات الهاكاثون', 'تحديثات NABD-X', 'ورشات عمل', 'أكاديمية GITM'];

export default function SmartArticleEditor({ initialData, onCancel, onSave }) {
  const { lang } = useLanguage();
  
  // States
  const [title, setTitle] = useState(initialData?.title || initialData?.titleEn || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', ''
  const [lastSaved, setLastSaved] = useState(null);
  
  // Categories & Tags
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState(initialData?.attachments || []);
  const fileInputRef = useRef(null);

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(''); // 'intro', 'proofread', 'seo'
  const [seoScore, setSeoScore] = useState(null);

  // --- Auto-Save Drafts ---
  useEffect(() => {
    const savedDraft = localStorage.getItem('gitm_article_draft');
    if (savedDraft && !initialData) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.title) setTitle(draft.title);
        if (draft.content) setContent(draft.content);
        if (draft.tags) setTags(draft.tags);
        if (draft.category) setSelectedCategory(draft.category);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        setSaveStatus('saving');
        localStorage.setItem('gitm_article_draft', JSON.stringify({ title, content, tags, category: selectedCategory }));
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSaved(new Date());
          setTimeout(() => setSaveStatus(''), 2000);
        }, 800);
      }
    }, 3000); // Auto-save 3 seconds after last keystroke

    return () => clearTimeout(timer);
  }, [title, content, tags, selectedCategory]);

  // --- Quill Modules ---
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'font': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size', 'color', 'background',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  // --- Helpers ---
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Mock upload
    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  // --- Mock AI Functions ---
  const handleGenerateIntro = () => {
    if (!title) return alert(lang === 'ar' ? 'الرجاء إدخال العنوان أولاً' : 'Please enter a title first');
    setAiLoading('intro');
    setTimeout(() => {
      const generatedIntro = lang === 'ar' 
        ? `<p><strong>مقدمة تلقائية:</strong> يعكس هذا المقال بعنوان "${title}" رؤية حديثة وتطوراً ملحوظاً في مسيرتنا التكنولوجية. من خلال هذه الأسطر، سنستكشف التفاصيل التقنية والإنجازات التي تم تحقيقها بفضل جهود فريقنا المتميز.</p><br/>`
        : `<p><strong>Auto Intro:</strong> This article titled "${title}" reflects a modern vision and remarkable progress in our tech journey. Through these lines, we explore the technical details and achievements realized by our outstanding team.</p><br/>`;
      setContent(generatedIntro + content);
      setAiLoading('');
    }, 2000);
  };

  const handleProofread = () => {
    if (!content) return;
    setAiLoading('proofread');
    setTimeout(() => {
      // Mock proofread: Just format the content slightly or show a success message
      setAiLoading('');
      alert(lang === 'ar' ? '✅ التدقيق اللغوي والهندسي اكتمل. لا توجد أخطاء!' : '✅ Proofreading complete. No errors found!');
    }, 2500);
  };

  const handleSEO = () => {
    setAiLoading('seo');
    setTimeout(() => {
      setSeoScore(85);
      const newTags = ['ابتكار', 'تكنولوجيا مغربية', 'هندسة'];
      const uniqueTags = [...new Set([...tags, ...newTags])];
      setTags(uniqueTags);
      setAiLoading('');
    }, 3000);
  };

  // --- Render ---
  if (isPreviewMode) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl overflow-hidden">
        {/* Glassmorphism Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        
        <button 
          onClick={() => setIsPreviewMode(false)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:bg-slate-50 border border-slate-200 dark:border-slate-700 font-bold transition-colors text-slate-800 dark:text-white"
        >
          <ArrowLeft size={20} /> {lang === 'ar' ? 'العودة للمحرر' : 'Back to Editor'}
        </button>

        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-8 right-8 flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-bold">
              {selectedCategory || (lang === 'ar' ? 'بدون تصنيف' : 'Uncategorized')}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#1e3a5f] dark:text-white mb-6 leading-tight">{title || (lang === 'ar' ? 'عنوان المقال...' : 'Article Title...')}</h1>
          
          <div 
            className="prose dark:prose-invert max-w-none prose-img:rounded-2xl prose-img:shadow-xl prose-pre:bg-slate-900 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content || (lang === 'ar' ? '<p>محتوى المقال...</p>' : '<p>Article content...</p>') }}
          />

          {tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold flex items-center gap-1">
                  <Tag size={14}/> {tag}
                </span>
              ))}
            </div>
          )}

          {attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" /> {lang === 'ar' ? 'المرفقات' : 'Attachments'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><FileText size={20}/></div>
                      <div>
                        <p className="font-bold text-sm text-[#1e3a5f] dark:text-white truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-500 ${isZenMode ? 'fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 overflow-y-auto' : 'w-full'}`}>
      {/* Topbar */}
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 ${isZenMode ? 'max-w-5xl mx-auto' : ''}`}>
        <div className="flex items-center gap-4">
          {!isZenMode && onCancel && (
             <button onClick={onCancel} className="p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors">
               <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300"/>
             </button>
          )}
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
            <Edit3 className="text-blue-500" size={28}/> 
            {lang === 'ar' ? 'المحرر الذكي' : 'Smart Editor'}
          </h2>
          {saveStatus === 'saving' && <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Activity size={14} className="animate-spin"/> {lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>}
          {saveStatus === 'saved' && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={14}/> {lang === 'ar' ? 'تم حفظ المسودة' : 'Draft saved'}</span>}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
          >
            <Eye size={18}/> {lang === 'ar' ? 'معاينة حية' : 'Live Preview'}
          </button>
          <button 
            onClick={() => setIsZenMode(!isZenMode)}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
            title="Zen Mode"
          >
            {isZenMode ? <Minimize size={20}/> : <Maximize size={20}/>}
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('gitm_article_draft');
              onSave && onSave({ title, content, tags, category: selectedCategory, attachments });
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            <Save size={18}/> {lang === 'ar' ? 'نشر المقال' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-6 ${isZenMode ? 'max-w-5xl mx-auto' : ''}`}>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'أدخل عنوان المقال المعبر...' : 'Enter an expressive title...'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-extrabold p-4 bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-[#1e3a5f] dark:text-white transition-colors"
            dir="auto"
          />
          
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              formats={formats}
              className="h-[60vh] text-slate-800 dark:text-slate-200 font-cairo"
              placeholder={lang === 'ar' ? 'ابدأ في صياغة مقالك الإبداعي هنا...' : 'Start drafting your creative article here...'}
            />
          </div>
        </div>

        {/* Sidebar (Hidden in Zen Mode) */}
        {!isZenMode && (
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            
            {/* AI Assistant Panel */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><Bot size={64} /></div>
              <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2 relative z-10">
                <Sparkles size={20} className="animate-pulse" /> {lang === 'ar' ? 'المساعد التحريري' : 'AI Assistant'}
              </h3>
              
              <div className="space-y-3 relative z-10">
                <button 
                  onClick={handleGenerateIntro}
                  disabled={aiLoading !== ''}
                  className="w-full flex justify-between items-center px-4 py-3 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl font-bold text-sm text-indigo-700 dark:text-indigo-300 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  {lang === 'ar' ? 'صياغة مقدمة جذابة' : 'Generate Catchy Intro'}
                  {aiLoading === 'intro' ? <Activity size={16} className="animate-spin" /> : <Bot size={16} />}
                </button>
                
                <button 
                  onClick={handleProofread}
                  disabled={aiLoading !== ''}
                  className="w-full flex justify-between items-center px-4 py-3 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl font-bold text-sm text-indigo-700 dark:text-indigo-300 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  {lang === 'ar' ? 'تدقيق لغوي وهندسي' : 'Technical Proofread'}
                  {aiLoading === 'proofread' ? <Activity size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                </button>

                <button 
                  onClick={handleSEO}
                  disabled={aiLoading !== ''}
                  className="w-full flex justify-between items-center px-4 py-3 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl font-bold text-sm text-indigo-700 dark:text-indigo-300 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  {lang === 'ar' ? 'تحسين الـ SEO' : 'Optimize SEO'}
                  {aiLoading === 'seo' ? <Activity size={16} className="animate-spin" /> : <Globe size={16} />}
                </button>

                <AnimatePresence>
                  {seoScore && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="pt-3">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">SEO Score</span>
                        <span className="text-emerald-500">{seoScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div initial={{width:0}} animate={{width:`${seoScore}%`}} className="h-full bg-emerald-500 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Classification */}
            <div className="glass-card rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                <Layers size={18} className="text-blue-500" /> {lang === 'ar' ? 'التصنيف والوسوم' : 'Category & Tags'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'القسم الرئيسي' : 'Main Category'}</label>
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">{lang === 'ar' ? 'اختر القسم...' : 'Select category...'}</option>
                    {PREDEFINED_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">{lang === 'ar' ? 'الوسوم (Tags)' : 'Tags'}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <AnimatePresence>
                      {tags.map(tag => (
                        <motion.span key={tag} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1">
                          {tag}
                          <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setTags(tags.filter(t => t !== tag))} />
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <Tag size={16} className="absolute right-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={lang === 'ar' ? 'أضف وسماً واضغط Enter' : 'Add tag & press Enter'}
                      className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-sm"
                      dir="auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="glass-card rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2">
                <FileText size={18} className="text-rose-500" /> {lang === 'ar' ? 'الملفات والمستندات' : 'Attachments'}
              </h3>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {attachments.map((file, i) => (
                    <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className="text-blue-500 shrink-0"/>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      </div>
                      <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 shrink-0 p-1">
                        <X size={14}/>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-slate-500 font-bold text-sm"
                >
                  <Upload size={16}/> {lang === 'ar' ? 'إرفاق ملفات (PDF, الصور...)' : 'Attach files (PDF, Images...)'}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <style jsx global>{`
        .quill {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
          background: rgba(248, 250, 252, 0.5) !important;
          padding: 12px 16px !important;
          border-radius: 1rem 1rem 0 0;
        }
        .dark .ql-toolbar {
          background: rgba(15, 23, 42, 0.5) !important;
          border-bottom-color: rgba(30, 41, 59, 1) !important;
        }
        .ql-container {
          border: none !important;
          flex: 1;
          font-family: 'Cairo', sans-serif !important;
          font-size: 1.1rem;
        }
        .ql-editor {
          padding: 24px;
        }
        .ql-editor img {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .ql-editor iframe {
          width: 100%;
          height: 400px;
          border-radius: 12px;
          margin: 16px 0;
        }
        /* Dark mode overrides for quill */
        .dark .ql-picker { color: #cbd5e1; }
        .dark .ql-stroke { stroke: #cbd5e1; }
        .dark .ql-fill { fill: #cbd5e1; }
        .dark .ql-picker-options { background-color: #1e293b; border-color: #334155; }
      `}</style>
    </div>
  );
}
