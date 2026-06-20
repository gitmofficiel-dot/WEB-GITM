import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FileEdit, Image as ImageIcon, MessageSquare, Plus, Edit2, Trash2, Bot, Sparkles, Video, FileText, Loader } from 'lucide-react';
import CloudinaryUploader from '../CloudinaryUploader';
import { generateArticle } from '../../config/openrouter';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function ContentManagerDashboard() {
  const { lang, news, setNews, gallery, setGallery, user } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [articlePrompt, setArticlePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUploadSuccess = (info) => {
    // info contains { secure_url, public_id, format, width, height, bytes, resource_type }
    setUploadedFiles(prev => [info, ...prev]);
    
    // Add to global gallery which syncs to Firestore
    setGallery(prev => [{
      id: Date.now(),
      title_ar: info.original_filename || 'صورة جديدة',
      title_en: info.original_filename || 'New Image',
      category: 'projects',
      date: new Date().toISOString().split('T')[0],
      type: info.resource_type === 'video' ? 'video' : 'image',
      url: info.secure_url,
      color: '#0d9488'
    }, ...prev]);
    
    alert(lang === 'ar' ? 'تم الرفع والحفظ في المعرض!' : 'Uploaded and saved to Gallery!');
  };

  const generateAIArticle = async () => {
    if (!articlePrompt) return;
    setIsGenerating(true);
    try {
      const generatedContent = await generateArticle(articlePrompt);
      const newArticle = {
        id: Date.now(),
        title_ar: articlePrompt.slice(0, 50) + '...',
        title_en: articlePrompt.slice(0, 50) + '...',
        summary_ar: generatedContent,
        summary_en: generatedContent,
        category: 'technology',
        date: new Date().toISOString().split('T')[0],
        author: user?.name || 'AI Assistant',
        pinned: false
      };
      setNews(prev => [newArticle, ...prev]);
      setArticlePrompt('');
      alert(lang === 'ar' ? 'تم توليد المقال ونشره بنجاح!' : 'Article generated and published successfully!');
    } catch (error) {
      alert(lang === 'ar' ? 'حدث خطأ أثناء توليد المقال.' : 'Error generating article.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteNews = (id) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-orbitron">{txt(lang, 'Content Manager Dashboard', 'لوحة مدير المحتوى', 'Tableau de bord Gestionnaire de contenu', '内容管理器仪表板')}</h2>
        <button className="btn-primary px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold">
          <Plus size={16} /> {txt(lang, 'Create New Post', 'إنشاء منشور جديد', 'Nouveau poste', '创建新帖子')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Published News', val: news.length.toString(), icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Gallery Items', val: gallery.length.toString(), icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Pending Comments', val: '12', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold font-orbitron">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Recent Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-300 dark:border-slate-700 text-sm font-bold text-slate-500">
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-b border-cyan-200 dark:border-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-medium text-[#1e3a5f] dark:text-white max-w-[200px] truncate">
                    {lang === 'ar' ? item.title_ar : item.title_en}
                  </td>
                  <td className="p-3 text-sm text-slate-500">{item.category}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-[10px] uppercase font-bold rounded bg-emerald-100 text-emerald-600">Published</span>
                  </td>
                  <td className="p-3 text-sm text-slate-500">{item.date}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit2 size={14}/></button>
                      <button onClick={() => deleteNews(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Content Writer */}
      <div className="glass-card rounded-2xl p-6 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <FileEdit size={120} />
        </div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-purple-500">
          <Bot className="w-5 h-5 text-purple-400" />
          {txt(lang, 'AI Article Writer', 'الكاتب الذكي للمقالات AI', 'Rédacteur IA', 'AI文章撰写器')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-2xl">
          {txt(lang, 'Enter a brief sentence about an event, and the AI will draft a complete, professional news article ready for publishing.', 'أدخل جملة قصيرة عن حدث، وسيقوم الذكاء الاصطناعي بصياغة مقال إخباري احترافي كامل وجاهز للنشر.', 'Entrez une brève phrase...', '输入关于事件的简短句子...')}
        </p>
        
        <div className="bg-cyan-50 dark:bg-slate-900/50 rounded-xl p-4 border border-purple-500/20">
          <textarea 
            value={articlePrompt}
            onChange={(e) => setArticlePrompt(e.target.value)}
            placeholder={txt(lang, 'e.g., "GITM team won 1st place in the national robotics hackathon yesterday."', 'مثال: "فريق GITM فاز بالمركز الأول في الهاكاثون الوطني للروبوتات أمس."', 'Ex: "L\'équipe GITM a gagné..."', '例如：“GITM团队昨天在全国机器人黑客马拉松中获得了第一名。”')}
            className="w-full h-20 bg-transparent border border-cyan-400 dark:border-slate-700 rounded-lg p-3 outline-none text-sm resize-none focus:border-purple-500 mb-3 text-[#0B132B] dark:text-white"
          ></textarea>
          <div className="flex justify-end gap-2">
            <button 
              onClick={generateAIArticle}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : <Sparkles size={16} />}
              {txt(lang, 'Generate Article', 'توليد المقال', 'Générer', '生成文章')}
            </button>
          </div>
        </div>
      </div>
    </div>
      
    {/* Sidebar Area */}
      <div className="space-y-6">
        {/* Cloudinary Media Management */}
        <div className="glass-card rounded-2xl p-6 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <ImageIcon size={120} />
          </div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-cyan-500">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {txt(lang, 'Media Upload (Cloudinary)', 'رفع الوسائط (Cloudinary)', 'Médias Cloudinary', '媒体上传')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {txt(lang, 'Upload images, videos, or PDFs. AI will automatically optimize size and format.', 'ارفع الصور، الفيديوهات، أو الملفات. سيقوم الذكاء الاصطناعي بضغطها وتحسينها أوتوماتيكياً.', 'Téléchargez des images...', '上传图片...')}
          </p>

          <CloudinaryUploader onUploadSuccess={handleUploadSuccess} buttonText={txt(lang, 'Upload File', 'رفع ملف', 'Télécharger', '上传文件')} />

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-bold text-slate-400">{txt(lang, 'Recently Uploaded:', 'المرفوعات الأخيرة:', 'Récemment:', '最近上传：')}</h4>
              {uploadedFiles.slice(0, 3).map((file, idx) => (
                <div key={idx} className="bg-cyan-50 dark:bg-slate-900/50 p-3 rounded-lg border border-cyan-500/20 flex items-center gap-3">
                  {file.resource_type === 'image' ? <ImageIcon size={16} className="text-cyan-500"/> : 
                   file.resource_type === 'video' ? <Video size={16} className="text-purple-500"/> : 
                   <FileText size={16} className="text-amber-500"/>}
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-[#1e3a5f] dark:text-white truncate">{file.original_filename}</p>
                    <p className="text-[10px] text-slate-500">{(file.bytes / 1024).toFixed(1)} KB • {file.format}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}