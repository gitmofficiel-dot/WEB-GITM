import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Award, Clock, Activity, FileText, PlayCircle } from 'lucide-react';
import CertificateGenerator from './CertificateGenerator';

const t = {
    en: { progress: 'Your Progress', completed: 'Completed', remaining: 'Remaining', certificate: 'Certificate of Completion', downloadCert: 'Download Certificate', lessons: 'Lessons', score: 'Avg. Score' },
    ar: { progress: 'تقدمك', completed: 'مكتمل', remaining: 'متبقي', certificate: 'شهادة إتمام', downloadCert: 'تحميل الشهادة', lessons: 'الدروس', score: 'متوسط الدرجات' },
    fr: { progress: 'Votre Progression', completed: 'Terminé', remaining: 'Restant', certificate: 'Certificat de Réussite', downloadCert: 'Télécharger le Certificat', lessons: 'Leçons', score: 'Score Moyen' },
    zh: { progress: '你的进度', completed: '已完成', remaining: '剩余', certificate: '结业证书', downloadCert: '下载证书', lessons: '课程', score: '平均分' }
};

const getLoc = (obj, field, lang) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || '';
};

export default function CourseProgress({ course, lessons = [], completedLessonIds = [], quizScores = {}, lang = 'en', onLessonSelect, studentName = 'Student Name' }) {
    const texts = t[lang] || t['en'];
    
    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.length;
    const percentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
    
    const scores = Object.values(quizScores).map(s => s.percentage);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 rtl:ml-3 text-emerald-500" />
                {texts.progress}
            </h3>

            <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{percentage}%</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{completedCount} / {totalLessons} {texts.completed}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5" /> {texts.score}
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{avgScore}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5" /> Est. Time
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalLessons * 45}m</div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">{texts.lessons}</h4>
                {lessons.map((lesson, idx) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const score = quizScores[lesson.id];
                    return (
                        <div 
                            key={lesson.id} 
                            onClick={() => onLessonSelect(lesson.id)}
                            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'}`}
                        >
                            <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
                                {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                )}
                                <span className={`font-medium text-sm md:text-base truncate ${isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {idx + 1}. {getLoc(lesson, 'title', lang)}
                                </span>
                            </div>
                            {score && (
                                <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-2 rtl:mr-2">
                                    {score.percentage}%
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

                <div className="mt-8">
                    <CertificateGenerator 
                        studentName={studentName} 
                        courseName={course.title} 
                        issueDate={new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    />
                </div>
        </div>
    );
}
