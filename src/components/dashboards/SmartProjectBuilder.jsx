import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Save, X, ArrowLeft, Image as ImageIcon, Github, Users, Activity, Plus, Trash2, Percent
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function SmartProjectBuilder({ initialData, onCancel, onSave }) {
  const { lang } = useLanguage();
  
  const [formData, setFormData] = useState({
    titleAr: initialData?.titleAr || initialData?.title || '',
    titleEn: initialData?.titleEn || '',
    descriptionAr: initialData?.descriptionAr || initialData?.description || '',
    descriptionEn: initialData?.descriptionEn || '',
    status: initialData?.status || 'in-progress',
    category: initialData?.category || 'Robotics',
    githubUrl: initialData?.githubUrl || '',
    progress: initialData?.progress || 0,
    coverImage: initialData?.coverImage || '',
  });

  const [teamMembers, setTeamMembers] = useState(initialData?.teamMembers || []);
  const [techStack, setTechStack] = useState(initialData?.techStack?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now(), name: '', role: '', initials: '' }]);
  };

  const handleUpdateMember = (id, field, value) => {
    setTeamMembers(teamMembers.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        if (field === 'name' && value.length > 0) {
          // Auto generate initials
          updated.initials = value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        return updated;
      }
      return m;
    }));
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleSubmit = () => {
    setIsSaving(true);
    const projectData = {
      ...formData,
      teamMembers,
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(projectData);
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
              <Rocket className="text-indigo-500" size={24}/> 
              {lang === 'ar' ? 'إدارة المشاريع الهندسية' : 'Engineering Project Manager'}
            </h2>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} disabled={isSaving || !formData.titleAr}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? <Activity size={18} className="animate-spin"/> : <Save size={18}/>} 
          {lang === 'ar' ? 'حفظ المشروع' : 'Save Project'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Title (Arabic)</label>
                <input type="text" value={formData.titleAr} onChange={e=>setFormData({...formData, titleAr: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500" dir="rtl" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Title (English)</label>
                <input type="text" value={formData.titleEn} onChange={e=>setFormData({...formData, titleEn: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500" dir="ltr" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Description (Arabic)</label>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <ReactQuill theme="snow" value={formData.descriptionAr} onChange={v => setFormData({...formData, descriptionAr: v})} className="h-32 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200" />
                </div>
              </div>
              <div className="mt-10">
                <label className="text-sm font-bold text-slate-500 mb-1 block">Description (English)</label>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <ReactQuill theme="snow" value={formData.descriptionEn} onChange={v => setFormData({...formData, descriptionEn: v})} className="h-32 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-10">
             <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4 flex items-center gap-2"><Users size={20} className="text-indigo-500"/> {lang === 'ar' ? 'فريق العمل' : 'Team Members'}</h3>
             
             <div className="space-y-3">
               {teamMembers.map((member, index) => (
                 <div key={member.id} className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                     {member.initials || '?'}
                   </div>
                   <input type="text" placeholder="Name" value={member.name} onChange={e=>handleUpdateMember(member.id, 'name', e.target.value)} className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm"/>
                   <input type="text" placeholder="Role (e.g. Lead Dev)" value={member.role} onChange={e=>handleUpdateMember(member.id, 'role', e.target.value)} className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm"/>
                   <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               ))}
               <button onClick={handleAddMember} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-white dark:bg-slate-900 transition-colors flex justify-center items-center gap-2">
                 <Plus size={18}/> Add Member
               </button>
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'حالة المشروع' : 'Project Status'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Status</label>
                <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500">
                  <option value="planning">Planning (في مرحلة التخطيط)</option>
                  <option value="in-progress">In Progress (قيد التطوير)</option>
                  <option value="completed">Completed (مكتمل)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 flex justify-between">
                  <span>Progress</span>
                  <span className="text-indigo-500">{formData.progress}%</span>
                </label>
                <input type="range" min="0" max="100" value={formData.progress} onChange={e=>setFormData({...formData, progress: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Category</label>
                <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500">
                  <option value="Robotics">Robotics & AI</option>
                  <option value="Web">Web & Mobile</option>
                  <option value="IoT">IoT & Hardware</option>
                  <option value="Cloud">Cloud & Infrastructure</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-4">{lang === 'ar' ? 'الروابط والتقنيات' : 'Links & Tech'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><Github size={16}/> GitHub Repository</label>
                <input type="text" value={formData.githubUrl} onChange={e=>setFormData({...formData, githubUrl: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-sm" placeholder="https://github.com/gitm/..." dir="ltr" />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-500 mb-1 block">Tech Stack (Comma separated)</label>
                <textarea value={techStack} onChange={e=>setTechStack(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-sm h-24" placeholder="React, Node.js, Python, OpenCV..." dir="ltr" />
              </div>

              <div>
                 <label className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><ImageIcon size={16}/> Cover Image URL</label>
                 <input type="text" value={formData.coverImage} onChange={e=>setFormData({...formData, coverImage: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-sm" placeholder="https://..." dir="ltr" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
