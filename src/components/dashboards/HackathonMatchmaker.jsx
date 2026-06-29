import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Target, Zap, ChevronRight, UserPlus, Cpu, PenTool, Layout, CheckCircle, Code } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SKILLS = [
  { id: 'frontend', name: 'Frontend Dev', icon: Layout, category: 'Software' },
  { id: 'backend', name: 'Backend Dev', icon: Code, category: 'Software' },
  { id: 'embedded', name: 'Embedded C++', icon: Cpu, category: 'Hardware' },
  { id: 'pcb', name: 'PCB Design', icon: Zap, category: 'Hardware' },
  { id: 'uiux', name: 'UI/UX Design', icon: PenTool, category: 'Design' },
  { id: 'ai', name: 'Machine Learning', icon: Target, category: 'AI' },
];

const MOCK_USERS = [
  { id: 1, name: 'Ahmed Yassine', role: 'Full Stack Developer', skills: ['frontend', 'backend', 'ai'], matchScore: 0 },
  { id: 2, name: 'Sara Benali', role: 'Hardware Engineer', skills: ['embedded', 'pcb'], matchScore: 0 },
  { id: 3, name: 'Youssef Kamal', role: 'Product Designer', skills: ['uiux', 'frontend'], matchScore: 0 },
  { id: 4, name: 'Maha Idrissi', role: 'AI Researcher', skills: ['ai', 'backend'], matchScore: 0 },
  { id: 5, name: 'Omar Rami', role: 'IoT Specialist', skills: ['embedded', 'backend', 'pcb'], matchScore: 0 },
];

export default function HackathonMatchmaker() {
  const { lang } = useLanguage();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const findMatches = () => {
    if (selectedSkills.length === 0) return;
    
    setIsSearching(true);
    setMatches([]);
    
    setTimeout(() => {
      const calculatedMatches = MOCK_USERS.map(user => {
        const matchedSkills = user.skills.filter(s => selectedSkills.includes(s));
        const score = Math.round((matchedSkills.length / selectedSkills.length) * 100);
        return { ...user, matchScore: score, matchedSkills };
      }).filter(user => user.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
      
      setMatches(calculatedMatches);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a0f1a] min-h-[600px] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 font-sans shadow-xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
         <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
           <Users size={32} className="text-white" />
         </div>
         <h2 className="text-3xl font-bold font-orbitron text-[#1e3a5f] dark:text-white mb-4">
           {lang === 'ar' ? 'صانع التوافق للهاكاثون' : 'Hackathon Matchmaker'}
         </h2>
         <p className="text-slate-500">
           {lang === 'ar' 
             ? 'ابحث عن الأعضاء المناسبين لإكمال فريقك في الهاكاثونات ومشاريع التخرج. اختر المهارات التي تنقص فريقك.' 
             : 'Find the perfect teammates for your next hackathon or graduation project. Select the skills your team is missing.'}
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        
        {/* Left Column: Skill Selection */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
             <Target size={20} className="text-indigo-500"/>
             {lang === 'ar' ? 'المهارات المطلوبة (أقصى حد 4)' : 'Required Skills (Max 4)'}
           </h3>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             {SKILLS.map(skill => {
               const isSelected = selectedSkills.includes(skill.id);
               return (
                 <button
                   key={skill.id}
                   onClick={() => toggleSkill(skill.id)}
                   disabled={!isSelected && selectedSkills.length >= 4}
                   className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                     isSelected 
                       ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-md' 
                       : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 disabled:opacity-50'
                   }`}
                 >
                   <skill.icon size={20} className={isSelected ? 'text-indigo-500' : 'text-slate-400'} />
                   <span className="text-xs font-bold text-center">{skill.name}</span>
                 </button>
               );
             })}
           </div>

           <button 
             onClick={findMatches}
             disabled={selectedSkills.length === 0 || isSearching}
             className="w-full py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2a5288] dark:from-indigo-600 dark:to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 active:scale-95 mt-6"
           >
             {isSearching ? <Search size={20} className="animate-pulse" /> : <Search size={20} />}
             {isSearching ? (lang === 'ar' ? 'جاري البحث في قاعدة البيانات...' : 'Scanning database...') : (lang === 'ar' ? 'البحث عن زملاء فريق' : 'Find Teammates')}
           </button>
        </div>

        {/* Right Column: Results */}
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 h-[450px] flex flex-col">
           <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center justify-between">
             <span>{lang === 'ar' ? 'أفضل المرشحين' : 'Top Candidates'}</span>
             {matches.length > 0 && <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">{matches.length} Found</span>}
           </h3>

           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             <AnimatePresence>
               {!isSearching && matches.length === 0 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                    <Users size={48} />
                    <p className="font-bold">{lang === 'ar' ? 'حدد المهارات واضغط على بحث' : 'Select skills and click search'}</p>
                 </motion.div>
               )}

               {isSearching && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </motion.div>
               )}

               {!isSearching && matches.map((user, idx) => (
                 <motion.div 
                   key={user.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4 items-center group hover:border-indigo-500 transition-colors"
                 >
                   <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                     {user.name.split(' ').map(n=>n[0]).join('')}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-[#1e3a5f] dark:text-white truncate">{user.name}</h4>
                     <p className="text-xs text-slate-500 truncate mb-2">{user.role}</p>
                     <div className="flex flex-wrap gap-1">
                       {user.matchedSkills.map(s => {
                         const skillName = SKILLS.find(x => x.id === s)?.name;
                         return <span key={s} className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/> {skillName}</span>
                       })}
                     </div>
                   </div>

                   <div className="flex flex-col items-end gap-2 shrink-0">
                     <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-indigo-500">{user.matchScore}%</span>
                        <span className="text-[10px] text-slate-400 uppercase">Match</span>
                     </div>
                     <button className="p-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-500/20 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 rounded-lg transition-colors">
                       <UserPlus size={16} />
                     </button>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}
