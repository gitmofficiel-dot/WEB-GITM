import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Clock, Users, Code, Award, Send } from 'lucide-react';

const HackathonArena = () => {
  const { lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(86400 - 3600); // ~23 hours
  const [activeTab, setActiveTab] = useState('challenges'); // 'challenges' | 'leaderboard' | 'register'
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState('');
  const [codeSolution, setCodeSolution] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const challenges = [
    {
      id: 'ch-01',
      title: lang === 'ar' ? 'تحسين استهلاك معالج YOLOv8 الحافيّ' : 'Optimize YOLOv8 Edge Inference',
      points: 400,
      difficulty: lang === 'ar' ? 'صعب' : 'Hard',
      desc: lang === 'ar' 
        ? 'قم بتقليل حجم نموذج YOLOv8 وتحويله لصيغة TensorRT لتشغيله بمعدل إطارات أعلى من 30fps على Jetson Nano.'
        : 'Compress and optimize YOLOv8 weights into a TensorRT engine. Must achieve >30fps on Jetson Nano with minimal accuracy loss.'
    },
    {
      id: 'ch-02',
      title: lang === 'ar' ? 'بناء نظام جدولة المهام RTOS' : 'Custom RTOS Task Scheduler',
      points: 250,
      difficulty: lang === 'ar' ? 'متوسط' : 'Medium',
      desc: lang === 'ar'
        ? 'اكتب خوارزمية جدولة المهام بنمط الأسبقية الدورية (Preemptive Round-Robin) لميكروكنترولر STM32.'
        : 'Write a custom preemptive round-robin priority task scheduler in C/C++ running on STM32 microchips.'
    },
    {
      id: 'ch-03',
      title: lang === 'ar' ? 'تأمين تدفق WebSockets ضد هجمات DDoS' : 'Secure WebSocket Ingestion Gateway',
      points: 300,
      difficulty: lang === 'ar' ? 'متقدم' : 'Advanced',
      desc: lang === 'ar'
        ? 'صمم بوابة IoT Hub لتصفية حزم البيانات الفورية وفحص التوثيق للمستشعرات بمعدل تأخير أقل من 5ms.'
        : 'Build a secure token-based WebSocket handshake validator. Must withstand high traffic load with latency <5ms.'
    }
  ];

  const scoreboard = [
    { rank: 1, team: 'Atlas Swarmers', score: 980, solved: 3, members: 'Omar, Fatima, Anass' },
    { rank: 2, team: 'Casablanca Edge AI', score: 850, solved: 2, members: 'Mohamed, Leila' },
    { rank: 3, team: 'Rabat Tech Hub', score: 600, solved: 2, members: 'Hamza, Youssef, Sara' },
    { rank: 4, team: 'STM32 Hackers', score: 550, solved: 1, members: 'Khalid, Amine' }
  ];

  const handleRegisterTeam = (e) => {
    e.preventDefault();
    if (!teamName || !members) {
      alert(lang === 'ar' ? 'يرجى ملء جميع الحقول لتسجيل الفريق!' : 'Please fill all fields to register your team!');
      return;
    }
    alert(lang === 'ar' ? `تم تسجيل فريق "${teamName}" بنجاح في تحدي هاكاثون الابتكار!` : `Team "${teamName}" registered successfully for the innovation hackathon!`);
    setTeamName('');
    setMembers('');
  };

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    if (!selectedChallenge || !codeSolution) {
      alert(lang === 'ar' ? 'الرجاء اختيار التحدي وكتابة كود الحل أولاً.' : 'Please select a challenge and input your solution code.');
      return;
    }
    alert(lang === 'ar' ? 'تم إرسال الكود لخوادم التقييم التلقائي (Auto-Grader)... النتيجة ستظهر في لوحة الصدارة بعد ثوانٍ.' : 'Solution pushed to Auto-Grader. Scoreboard ranks will refresh upon validation.');
    setCodeSolution('');
    setSelectedChallenge(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider mb-3 inline-block animate-pulse">
            {lang === 'ar' ? 'البطولة الوطنية للابتكار الهندسي' : 'National Hardware Hackathon Arena'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {lang === 'ar' ? 'حلبة هاكاثون GITM للبرمجة' : 'GITM Hackathon Arena'}
          </h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm leading-relaxed">
            {lang === 'ar' 
              ? 'تحديات برمجية وهندسية مكثفة. تسابق مع الزمن لحل مشاكل العتاد والذكاء الاصطناعي والصعود في قائمة الصدارة.' 
              : 'Competitive engineering challenge. Solve complex hardware, AI, and cloud coding issues within the time limit.'}
          </p>
        </div>

        {/* Info Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-5 rounded-xl glass border border-red-500/20 bg-red-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-red-400 block uppercase tracking-wider">{lang === 'ar' ? 'الوقت المتبقي للهاكاثون' : 'Time Remaining'}</span>
              <span className="text-2xl font-black font-mono text-white tracking-widest">{formatTime(timeLeft)}</span>
            </div>
            <Clock className="text-red-400 animate-spin-slow" size={24} />
          </div>

          <div className="p-5 rounded-xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-cyber-muted block uppercase tracking-wider">{lang === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}</span>
              <span className="text-2xl font-black font-orbitron text-slate-800 dark:text-white">{challenges.length} Tasks</span>
            </div>
            <Code className="text-[#00E5FF]" size={24} />
          </div>

          <div className="p-5 rounded-xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-cyber-muted block uppercase tracking-wider">{lang === 'ar' ? 'الفرق المسجلة' : 'Teams Registered'}</span>
              <span className="text-2xl font-black font-orbitron text-slate-800 dark:text-white">{scoreboard.length} Swarms</span>
            </div>
            <Users className="text-[#00FF87]" size={24} />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#3A506B]/20 mb-8 overflow-x-auto">
          {['challenges', 'leaderboard', 'register'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-red-500 text-red-500' 
                  : 'border-transparent text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab === 'challenges' && (lang === 'ar' ? 'قائمة التحديات' : 'Coding Challenges')}
              {tab === 'leaderboard' && (lang === 'ar' ? 'لوحة الصدارة الحية' : 'Live Scoreboard')}
              {tab === 'register' && (lang === 'ar' ? 'تسجيل فريق جديد' : 'Team Registration')}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Challenges list */}
              <div className="lg:col-span-7 space-y-4">
                {challenges.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setSelectedChallenge(ch);
                    }}
                    className={`p-5 rounded-xl border transition-spring cursor-pointer ${
                      selectedChallenge?.id === ch.id
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-[#3A506B]/20 dark:border-white/5 bg-white dark:bg-black/20 hover:border-red-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                        {ch.difficulty}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#00E5FF]">
                        +{ch.points} PTS
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{ch.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-cyber-muted leading-relaxed">{ch.desc}</p>
                  </div>
                ))}
              </div>

              {/* Submission Area */}
              <div className="lg:col-span-5 p-6 rounded-2xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-orbitron">
                  {lang === 'ar' ? 'تقديم الكود المصدري للحل' : 'Submit Challenge Solution'}
                </h3>

                {selectedChallenge ? (
                  <form onSubmit={handleSubmitSolution} className="space-y-4 text-right rtl:text-right ltr:text-left text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-cyber-muted block uppercase mb-1">
                        {lang === 'ar' ? 'التحدي المختار:' : 'Selected Challenge:'}
                      </span>
                      <span className="text-xs font-bold text-white bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded inline-block">
                        {selectedChallenge.title}
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'محرر الشفرة البرمجية' : 'Code Solution Editor'}</label>
                      <textarea
                        required
                        placeholder={lang === 'ar' ? '// اكتب الحل البرمجي بلغة C++ أو Python هنا...' : '// Write solution code in C++ or Python here...'}
                        value={codeSolution}
                        onChange={(e) => setCodeSolution(e.target.value)}
                        className="w-full h-64 p-3 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-white dark:bg-black/40 text-slate-100 outline-none font-mono text-xs resize-none"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                    >
                      <Send size={14} />
                      <span>{lang === 'ar' ? 'إرسال الشفرة للاختبار' : 'Upload Solution'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="py-12 text-center text-slate-500 dark:text-cyber-muted italic text-xs">
                    {lang === 'ar' ? 'اختر تحدياً من القائمة الجانبية لبدء تحرير وإرسال الكود.' : 'Select a coding challenge from the list to modify and submit your solution.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="p-6 rounded-2xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-orbitron mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={16} />
                <span>{lang === 'ar' ? 'لوحة الصدارة الحية للهاكاثون' : 'Live Scoreboard Leaderboard'}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#3A506B]/20 text-slate-400 dark:text-cyber-muted uppercase tracking-wider text-[10px]">
                      <th className="pb-3">{lang === 'ar' ? 'الترتيب' : 'Rank'}</th>
                      <th className="pb-3">{lang === 'ar' ? 'اسم الفريق' : 'Team'}</th>
                      <th className="pb-3">{lang === 'ar' ? 'الأعضاء' : 'Members'}</th>
                      <th className="pb-3">{lang === 'ar' ? 'المسائل المحلولة' : 'Solved'}</th>
                      <th className="pb-3 text-red-400 font-bold">{lang === 'ar' ? 'النقاط' : 'Score'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A506B]/10 dark:divide-white/5">
                    {scoreboard.map(row => (
                      <tr key={row.rank} className="text-slate-700 dark:text-cyber-text hover:bg-white/5 transition-all">
                        <td className="py-3 font-bold text-center">
                          {row.rank === 1 ? '🥇 1' : row.rank === 2 ? '🥈 2' : row.rank === 3 ? '🥉 3' : row.rank}
                        </td>
                        <td className="py-3 font-bold">{row.team}</td>
                        <td className="py-3 text-[#8A99AD]">{row.members}</td>
                        <td className="py-3">{row.solved}</td>
                        <td className="py-3 text-red-400 font-black text-sm">{row.score} PTS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="max-w-md mx-auto p-6 rounded-2xl glass border border-[#3A506B]/20 bg-slate-50 dark:bg-black/20 space-y-6">
              <div className="text-center">
                <Users size={32} className="text-red-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider font-orbitron">
                  {lang === 'ar' ? 'تسجيل فريق الهاكاثون' : 'Join Hackathon Team'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-cyber-muted mt-1">
                  {lang === 'ar' ? 'قم بتسجيل أعضاء فريقك (2-4 أفراد) للمشاركة في التقييم.' : 'Register a team name and invite members to cooperate.'}
                </p>
              </div>

              <form onSubmit={handleRegisterTeam} className="space-y-4 text-right rtl:text-right ltr:text-left text-xs">
                <div>
                  <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'اسم الفريق المقترح' : 'Team Name'}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'مثال: Atlas-Hackers' : 'e.g. Atlas-Hackers'}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-white dark:bg-black/45 text-slate-100 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'أسماء ومسارات الأعضاء (مفصولة بفواصل)' : 'Invited Members (comma separated)'}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'مثال: عمر بنجلون، فاطمة الزهراء الإدريسي' : 'e.g. Omar, Fatima, Anass'}
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-white dark:bg-black/45 text-slate-100 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-black uppercase tracking-wider hover:shadow-lg transition-all text-center"
                >
                  {lang === 'ar' ? 'تأكيد التسجيل والمشاركة' : 'Register Swarm Team'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HackathonArena;
