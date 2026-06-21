import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Award, Clock, Star, PlayCircle, FileText, CheckCircle, Lightbulb, Compass, Loader, Bookmark, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateArticle } from '../../config/openrouter';
import { useNavigate } from 'react-router-dom';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function StudentDashboard() {
  const { lang, user, setView, savedItems, toggleSave, eventRegistrations } = useLanguage();
  const navigate = useNavigate();
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeText = async () => {
    if (!textToAnalyze) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze and summarize the following text for a student. Provide key takeaways in bullet points. The text is: "${textToAnalyze}"`;
      const result = await generateArticle(prompt);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult(lang === 'ar' ? 'حدث خطأ أثناء تحليل النص.' : 'Error analyzing text.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const enrolledCourses = [
    { id: 1, title: 'Edge AI Architecture', progress: 100, status: 'completed', rating: 4.8 },
    { id: 2, title: 'IoT Cloud Systems', progress: 60, status: 'in-progress', rating: 4.5 }
  ];

  const recentGrades = [
    { course: 'Edge AI Architecture', assignment: 'Final Project', score: 95 },
    { course: 'IoT Cloud Systems', assignment: 'Quiz 2', score: 88 }
  ];

  const myRegistrations = eventRegistrations?.filter(r => r.userId === user?.email) || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-orbitron">{txt(lang, 'Student Dashboard', 'لوحة الطالب', 'Tableau de bord étudiant', '学生仪表板')}</h2>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-500 rounded-full text-sm font-bold uppercase tracking-wider">
          Student
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: txt(lang, 'Enrolled Courses', 'الدورات المسجلة', 'Cours Inscrits', '已注册课程'), val: '2', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: txt(lang, 'Completed', 'مكتمل', 'Terminé', '已完成'), val: '1', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: txt(lang, 'Study Hours', 'ساعات الدراسة', 'Heures', '学习时间'), val: '45h', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: txt(lang, 'Earned Certs', 'الشهادات', 'Certificats', '获得的证书'), val: '1', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
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

      {/* AI Learning Path Recommendation */}
      <div className="glass-card rounded-2xl p-6 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-gradient-to-r from-purple-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Compass size={120} />
        </div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-purple-500">
          <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" /> 
          {txt(lang, 'AI Smart Guide', 'الموجه الذكي AI', 'Guide Intelligent IA', 'AI智能指南')}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed max-w-3xl">
          {txt(lang, 
            "Based on your recent 95% score in Edge AI, our AI suggests you apply for the 'Smart Drone Vision' project to strengthen your practical skills. You are currently in the top 5% of your cohort.", 
            "بناءً على نتيجتك (95%) في الذكاء الاصطناعي على الحافة، يقترح الذكاء الاصطناعي الانضمام لمشروع 'رؤية الدرون الذكية' لتعزيز مهاراتك العملية. أنت حالياً ضمن أفضل 5% من دفعتك.", 
            "Basé sur votre score récent...", 
            "根据您最近的成绩..."
          )}
        </p>
        <button onClick={() => setView('projects')} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
          {txt(lang, 'View Recommended Project', 'عرض المشروع المقترح', 'Voir le projet recommandé', '查看推荐项目')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PlayCircle className="text-teal-500" size={20} />
              {txt(lang, 'My Learning Path', 'مساري التعليمي', 'Mon parcours', '我的学习路径')}
            </h3>
            <button onClick={() => setView('academy')} className="text-sm text-teal-500 hover:underline font-medium">
              {txt(lang, 'Browse Catalog', 'تصفح الفهرس', 'Parcourir', '浏览目录')}
            </button>
          </div>
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="p-4 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#1e3a5f] dark:text-white">{course.title}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${course.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> {course.rating}</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-cyan-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${course.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${course.progress}%` }}></div>
                </div>
                {course.status !== 'completed' && (
                  <button className="mt-4 w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-bold transition-colors">
                    {txt(lang, 'Continue Learning', 'متابعة التعلم', 'Continuer', '继续学习')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <FileText className="text-blue-500" size={20} />
            {txt(lang, 'Recent Grades & Feedback', 'الدرجات والتقييمات الأخيرة', 'Notes récentes', '最近成绩')}
          </h3>
          <div className="space-y-4">
            {recentGrades.map((grade, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700 hover:border-blue-500/50 transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-[#1e3a5f] dark:text-white mb-1">{grade.assignment}</h4>
                  <p className="text-xs text-slate-500">{grade.course}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-orbitron font-bold text-blue-500">{grade.score}%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{txt(lang, 'Score', 'الدرجة', 'Score', '分数')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event & Project Registrations */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Award className="text-purple-500" size={20} />
            {txt(lang, 'My Projects & Event Registrations', 'مشاريعي وتسجيلات الفعاليات', 'Mes Projets et Inscriptions', '我的项目和活动注册')}
          </h3>
          {myRegistrations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {txt(lang, 'You have not registered for any events yet.', 'لم تقم بالتسجيل في أي فعالية بعد.', 'Aucune inscription.', '您尚未注册任何活动。')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white truncate pr-4">{reg.eventTitle}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase shrink-0 ${reg.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : reg.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {reg.status}
                    </span>
                  </div>
                  {reg.projectName && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      <span className="font-bold">{txt(lang, 'Project:', 'المشروع:', 'Projet:', '项目：')}</span> {reg.projectName}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(reg.dateSubmitted).toLocaleDateString()}</span>
                    {reg.hasFile && <span className="flex items-center gap-1 text-emerald-500"><FileText size={12} /> {txt(lang, 'Files Attached', 'يوجد ملف', 'Fichiers', '文件')}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Text Analyzer */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <FileText size={120} />
          </div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-emerald-500">
            <Lightbulb className="w-5 h-5" /> 
            {txt(lang, 'AI Text Analyzer (OpenRouter)', 'محلل النصوص بالذكاء الاصطناعي', 'Analyseur de texte IA', 'AI文本分析器')}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed max-w-3xl">
            {txt(lang, 
              "Paste your study notes or a complex article here. Our AI will analyze it, summarize it, and extract the key takeaways for you.", 
              "قم بلصق ملاحظاتك الدراسية أو مقال معقد هنا. سيقوم الذكاء الاصطناعي بتحليله وتلخيصه واستخراج النقاط الرئيسية لك.", 
              "Collez vos notes ici...", 
              "在此粘贴您的笔记..."
            )}
          </p>

          <div className="bg-cyan-50 dark:bg-slate-900/50 rounded-xl p-4 border border-emerald-500/20">
            <textarea 
              value={textToAnalyze}
              onChange={(e) => setTextToAnalyze(e.target.value)}
              placeholder={txt(lang, 'Paste text here...', 'الصق النص هنا...', 'Collez le texte ici...', '在此处粘贴文本...')}
              className="w-full h-24 bg-transparent border border-cyan-400 dark:border-slate-700 rounded-lg p-3 outline-none text-sm resize-none focus:border-emerald-500 mb-3 text-[#0B132B] dark:text-white"
            ></textarea>
            
            <div className="flex justify-end gap-2 mb-4">
              <button 
                onClick={handleAnalyzeText}
                disabled={isAnalyzing}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {isAnalyzing ? <Loader className="animate-spin w-4 h-4" /> : <Lightbulb size={16} />}
                {txt(lang, 'Analyze & Summarize', 'تحليل وتلخيص', 'Analyser', '分析与总结')}
              </button>
            </div>

            {analysisResult && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 mb-2">
                  {txt(lang, 'Analysis Result:', 'نتيجة التحليل:', 'Résultat:', '分析结果：')}
                </h4>
                <div className="text-sm text-[#2d507b] dark:text-slate-300 whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Items */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Bookmark className="text-amber-500 fill-amber-500" size={20} />
          {txt(lang, 'My Saved Items', 'عناصري المحفوظة', 'Mes éléments sauvegardés', '我保存的项目')}
        </h3>
        
        {(!savedItems?.books?.length && !savedItems?.news?.length) ? (
          <div className="text-center py-8 text-slate-500">
            {txt(lang, 'You haven\'t saved any items yet.', 'لم تقم بحفظ أي عناصر بعد.', 'Vous n\'avez encore rien sauvegardé.', '您还没有保存任何项目。')}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Saved Books */}
            {savedItems?.books?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-[#2d507b] dark:text-slate-300 mb-3 flex items-center gap-2">
                  <BookOpen size={16} /> {txt(lang, 'Books', 'الكتب', 'Livres', '图书')}
                </h4>
                <div className="space-y-3">
                  {savedItems.books.map(book => (
                    <div key={book.key} className="flex justify-between items-center p-3 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                      <div className="flex-1 min-w-0 pr-4">
                        <h5 className="font-semibold text-sm truncate">{book.title}</h5>
                        <p className="text-xs text-slate-500">{book.author_name?.[0]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/library/book', { state: { book } })} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full">
                          <ExternalLink size={14} />
                        </button>
                        <button onClick={() => toggleSave('books', book)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-full">
                          <Bookmark size={14} className="fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved News */}
            {savedItems?.news?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-[#2d507b] dark:text-slate-300 mb-3 flex items-center gap-2">
                  <FileText size={16} /> {txt(lang, 'News', 'الأخبار', 'Nouvelles', '新闻')}
                </h4>
                <div className="space-y-3">
                  {savedItems.news.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-cyan-50 dark:bg-slate-800/50 border border-cyan-300 dark:border-slate-700">
                      <div className="flex-1 min-w-0 pr-4">
                        <h5 className="font-semibold text-sm truncate">{item.title_ar || item.title || item.title_en}</h5>
                        <p className="text-xs text-slate-500">{item.date || 'API News'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.url && (
                          <button onClick={() => {
                            if (item.isApi) {
                              navigate('/news/global/article', { state: { newsItem: item } });
                            } else {
                              navigate(`/news/${item.id}`);
                            }
                          }} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full">
                            <ExternalLink size={14} />
                          </button>
                        )}
                        <button onClick={() => toggleSave('news', item)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-full">
                          <Bookmark size={14} className="fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>



    </div>
  );
}