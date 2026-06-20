import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Briefcase, GraduationCap, Search, Star, ExternalLink, Mail } from 'lucide-react';

const TalentHub = () => {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    {
      id: 1,
      name: lang === 'ar' ? 'عمر بنجلون' : 'Omar Benjelloun',
      track: 'edge',
      trackLabel: lang === 'ar' ? ' Edge AI مهندس' : 'Edge AI Specialist',
      gpa: '3.95 / 4.00',
      skills: ['C/C++', 'STM32 Cube', 'TinyML', 'YOLOv8', 'RTOS'],
      completedLabs: 14,
      email: 'omar.b@gitm.ma',
      bio: lang === 'ar' ? 'متخصص في برمجة المتحكمات الدقيقة وتحسين الشبكات العصبية لتشغيلها على المعالجات صغيرة الحجم.' : 'Focused on microcontrollers firmware and quantizing neural network parameters for embedded systems.',
      certHash: 'SHA256-EF204A9B'
    },
    {
      id: 2,
      name: lang === 'ar' ? 'فاطمة الزهراء الإدريسي' : 'Fatima-Zahra Idrissi',
      track: 'robotics',
      trackLabel: lang === 'ar' ? 'مهندس روبوتات مستقلة' : 'Autonomous Robotics Architect',
      gpa: '3.88 / 4.00',
      skills: ['ROS2 Humble', 'Python', 'LiDAR SLAM', 'C++', 'Pathfinding'],
      completedLabs: 18,
      email: 'fatima.idrissi@gitm.ma',
      bio: lang === 'ar' ? 'شغوفة بتصميم خوارزميات الملاحة وتنسيق المهام الجماعية لأسراب الدرونز المستقلة.' : 'Passionate about path planning algorithms and coordinating decentralised drone swarms in search-and-rescue.',
      certHash: 'SHA256-42C0A5F9'
    },
    {
      id: 3,
      name: lang === 'ar' ? 'كريم الفاسي' : 'Karim El Fassi',
      track: 'iotCloud',
      trackLabel: lang === 'ar' ? 'معماري أنظمة سحابية' : 'IoT Cloud Platform Architect',
      gpa: '3.91 / 4.00',
      skills: ['Node.js', 'React', 'WebSockets', 'Docker', 'TimescaleDB', 'gRPC'],
      completedLabs: 16,
      email: 'karim.fassi@gitm.ma',
      bio: lang === 'ar' ? 'متخصص في بناء وتصميم بوابات بث البيانات الحية للمستشعرات مع استجابة بالمللي ثانية.' : 'Specialist in low-latency WebSocket data streams, container clustering, and managing large-scale database grids.',
      certHash: 'SHA256-8809AA3C'
    }
  ];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrack = trackFilter === 'all' || s.track === trackFilter;
    return matchesSearch && matchesTrack;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 uppercase tracking-wider mb-3 inline-block">
            {lang === 'ar' ? 'بوابة المواهب والتوظيف' : 'GITM Talent Placement Hub'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {lang === 'ar' ? 'خريجو الأكاديمية المتميزون' : 'Academy Graduate Portfolios'}
          </h2>
          <div className="w-20 h-1 bg-[#00E5FF] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm leading-relaxed">
            {lang === 'ar' 
              ? 'تتيح هذه البوابة للشركات والشركاء الاستراتيجيين استعراض السير الذاتية، ومستوى الأداء، والشهادات الموثقة لأفضل طلاب الأكاديمية.' 
              : 'Enables corporate sponsors and strategic partners to discover top-performing students, explore their lab outputs, and verify certificates.'}
          </p>
        </div>

        {/* Filters Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 items-center">
          <div className="md:col-span-6 p-3 rounded-xl glass border border-[#3A506B]/20 flex items-center space-x-2 rtl:space-x-reverse bg-cyan-50 dark:bg-black/20">
            <Search className="text-slate-400 dark:text-cyber-muted" size={16} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث بالاسم أو المهارات (مثال: C++, ROS2)...' : 'Search by name or skills (e.g. C++, ROS2)...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs flex-1 text-[#1e3a5f] dark:text-white"
            />
          </div>

          <div className="md:col-span-6 flex flex-wrap gap-2 justify-end">
            {['all', 'edge', 'robotics', 'iotCloud'].map(track => (
              <button
                key={track}
                onClick={() => setTrackFilter(track)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border duration-150 ${
                  trackFilter === track
                    ? 'bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-black border-cyan-500'
                    : 'bg-[#e0fcfc]/5 dark:bg-black/20 text-slate-600 dark:text-cyber-muted border-[#3A506B]/20 dark:border-white/5 hover:border-cyan-400'
                }`}
              >
                {track === 'all' && (lang === 'ar' ? 'الكل' : 'All Candidates')}
                {track === 'edge' && (lang === 'ar' ? 'Edge AI' : 'Edge AI')}
                {track === 'robotics' && (lang === 'ar' ? 'روبوتات' : 'Robotics')}
                {track === 'iotCloud' && (lang === 'ar' ? 'سحابيات' : 'IoT Cloud')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Candidates List (Left/col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`p-6 rounded-xl border transition-spring cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  selectedStudent?.id === student.id
                    ? 'border-[#00E5FF] bg-[#00E5FF]/5'
                    : 'border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/20 hover:border-[#3A506B]/40'
                }`}
              >
                <div className="text-right rtl:text-right ltr:text-left">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-[#1e3a5f] dark:text-white">{student.name}</h3>
                    <span className="text-[9px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded border border-[#00E5FF]/20 uppercase">
                      {student.trackLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-cyber-muted line-clamp-1 mb-3">{student.bio}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-[#e0fcfc]/5 border border-cyan-300 dark:border-white/5 text-[9px] font-mono text-slate-500 dark:text-cyber-muted">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <GraduationCap size={18} className="text-slate-400 dark:text-cyber-muted" />
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-cyber-muted">
                    GPA: {student.gpa.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Resume Portfolio (Right/col-span-5) */}
          <div className="lg:col-span-5 p-6 rounded-2xl glass border border-[#3A506B]/20 bg-[#0b132b]/30 space-y-6">
            {selectedStudent ? (
              <div className="space-y-6 text-right rtl:text-right ltr:text-left">
                
                {/* Header */}
                <div className="border-b border-[#3A506B]/20 pb-4">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] font-bold flex items-center justify-center text-xl font-orbitron mb-3">
                    {selectedStudent.name[0]}
                  </div>
                  <h3 className="text-lg font-black text-[#1e3a5f] dark:text-white font-orbitron">{selectedStudent.name}</h3>
                  <span className="text-xs font-mono text-[#00E5FF]">{selectedStudent.trackLabel}</span>
                </div>

                {/* Bio / Email */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-[#8A99AD] block uppercase text-[9px] tracking-wider mb-0.5">{lang === 'ar' ? 'نبذة تعريفية' : 'About Candidate'}</span>
                    <p className="text-[#2d507b] dark:text-cyber-text leading-relaxed">{selectedStudent.bio}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-cyber-muted">
                    <Mail size={14} className="text-[#00E5FF]" />
                    <span className="font-mono">{selectedStudent.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-left" style={{ direction: 'ltr' }}>
                  <div>
                    <span className="text-white/40 block text-[9px]">ACADEMIC GPA:</span>
                    <span className="text-white font-bold">{selectedStudent.gpa}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">COMPLETED LABS:</span>
                    <span className="text-[#00FF87] font-bold">{selectedStudent.completedLabs} Units</span>
                  </div>
                </div>

                {/* Verifiable Credentials */}
                <div className="p-4 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF]">
                    <Award size={16} />
                    <span>{lang === 'ar' ? 'شهادة التخرج الإلكترونية الموثقة' : 'Verifiable Digital Credential'}</span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 dark:text-cyber-muted space-y-1 text-left" style={{ direction: 'ltr' }}>
                    <div>ISSUER: GROUPE INNOVATION TECHNOLOGIQUE MAROC</div>
                    <div className="truncate">BLOCKCHAIN_HASH: {selectedStudent.certHash}</div>
                    <div className="text-emerald-400 font-bold">STATUS: SIGNED & VALID</div>
                  </div>

                  <button
                    onClick={() => alert(lang === 'ar' ? `فتح الشهادة الرقمية للمترشح... الرمز: ${selectedStudent.certHash}` : `Opening verifiable document for student... ID: ${selectedStudent.certHash}`)}
                    className="w-full py-2 bg-slate-900 border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all"
                  >
                    <ExternalLink size={12} className="text-[#00E5FF]" />
                    <span>{lang === 'ar' ? 'استعراض مستند الشهادة الموثقة' : 'View Verified Certificate'}</span>
                  </button>
                </div>

                {/* Contact button */}
                <button
                  onClick={() => alert(lang === 'ar' ? `تم إرسال طلب تواصل للمترشح ${selectedStudent.name}.` : `Interview request sent to ${selectedStudent.name}.`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-black font-black uppercase tracking-wider hover:shadow-glow-cyan transition-all text-center text-xs"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Briefcase size={14} />
                    {lang === 'ar' ? 'طلب إجراء مقابلة عمل' : 'Request Hiring Interview'}
                  </span>
                </button>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 dark:text-cyber-muted italic text-xs">
                {lang === 'ar'
                  ? 'اختر خريجاً من القائمة الجانبية لاستعراض ملفه الفني، وشهادته الموثقة، والتواصل معه مباشرة.'
                  : 'Select a graduate candidate from the list to view their detailed technical profile.'}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default TalentHub;
