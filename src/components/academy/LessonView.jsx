import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Download, ArrowLeft, ArrowRight, CheckCircle, Image as ImageIcon, Check, ExternalLink } from 'lucide-react';
import QuizEngine from './QuizEngine';
import { UploadCloud, Clock as ClockIcon } from 'lucide-react';

const t = {
    en: { back: 'Back to Courses', next: 'Next Lesson', prev: 'Previous Lesson', downloadPdf: 'Download PDF', gallery: 'Schematics & Diagrams', pretest: 'Pre-Lesson Quiz Required', passed: 'Passed', startLesson: 'Start Lesson', locked: 'Complete the quiz to unlock this lesson.' },
    ar: { back: 'العودة للدورات', next: 'الدرس التالي', prev: 'الدرس السابق', downloadPdf: 'تحميل PDF', gallery: 'مخططات ورسومات', pretest: 'اختبار تمهيدي مطلوب', passed: 'تم الاجتياز', startLesson: 'ابدأ الدرس', locked: 'أكمل الاختبار لفتح هذا الدرس.' },
    fr: { back: 'Retour aux cours', next: 'Leçon suivante', prev: 'Leçon précédente', downloadPdf: 'Télécharger le PDF', gallery: 'Schémas et Diagrammes', pretest: 'Test préalable requis', passed: 'Réussi', startLesson: 'Commencer la leçon', locked: 'Complétez le quiz pour débloquer cette leçon.' },
    zh: { back: '返回课程', next: '下一课', prev: '上一课', downloadPdf: '下载 PDF', gallery: '原理图和图表', pretest: '需要课前测试', passed: '通过', startLesson: '开始上课', locked: '完成测试以解锁本课程。' }
};

const getLoc = (obj, field, lang) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || '';
};

export default function LessonView({ lesson, onBack, onNext, onPrev, hasNext, hasPrev, lang = 'en', onCompleteQuiz, initialQuizScore }) {
    const texts = t[lang] || t['en'];
    const [quizPassed, setQuizPassed] = useState(!lesson.hasPreTest || (initialQuizScore && initialQuizScore.percentage >= 60));
    const [quizScore, setQuizScore] = useState(initialQuizScore || null);

    // Strict Tracking States
    const [videoWatched, setVideoWatched] = useState(!lesson.videoUrl);
    const [fileOpened, setFileOpened] = useState(!lesson.pdfUrl);
    
    // Assignment State
    const [assignmentStatus, setAssignmentStatus] = useState(lesson.assignment ? 'pending_upload' : 'none'); // none, pending_upload, pending_review, graded
    
    const [uploading, setUploading] = useState(false);

    const isLessonComplete = quizPassed && videoWatched && fileOpened && (assignmentStatus === 'none' || assignmentStatus === 'graded' || assignmentStatus === 'pending_review');

    const handleQuizComplete = (score) => {
        setQuizScore(score);
        if (score.percentage >= 60) {
            setQuizPassed(true);
            if (onCompleteQuiz) onCompleteQuiz(lesson.id, score);
        }
    };

    if (!quizPassed) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 w-full">
                <button onClick={onBack} className="mb-8 flex items-center text-slate-500 hover:text-emerald-600 transition font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {texts.back}
                </button>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#1e3a5f] dark:text-white mb-4">{getLoc(lesson, 'title', lang)}</h1>
                    <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-sm font-medium">
                        <FileText className="w-4 h-4 mr-2 rtl:ml-2" />
                        {texts.pretest}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto">{texts.locked}</p>
                </div>
                {quizScore && quizScore.percentage < 60 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center text-red-600 dark:text-red-400 font-medium">
                        You scored {quizScore.percentage}%. You need 60% to pass. Please try again.
                    </motion.div>
                )}
                <QuizEngine questions={lesson.preTestQuestions} onComplete={handleQuizComplete} lang={lang} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 w-full">
            <button onClick={onBack} className="mb-6 flex items-center text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium">
                <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {texts.back}
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl shadow-sm border border-cyan-300 dark:border-slate-700 overflow-hidden">
                {lesson.videoUrl ? (
                    <div 
                        className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer overflow-hidden"
                        onClick={() => {
                            // Simulate watching video
                            alert(lang === 'ar' ? 'جاري محاكاة مشاهدة الفيديو...' : 'Simulating video playback...');
                            setTimeout(() => setVideoWatched(true), 2000);
                        }}
                    >
                        <img src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80`} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {!videoWatched ? (
                            <PlayCircle className="w-24 h-24 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-10 drop-shadow-2xl" />
                        ) : (
                            <div className="z-10 flex flex-col items-center">
                                <CheckCircle className="w-20 h-20 text-emerald-500 mb-2 drop-shadow-lg" />
                                <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'تمت المشاهدة' : 'Watched'}</span>
                            </div>
                        )}
                        <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end">
                            <div>
                                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full mb-3 inline-block uppercase tracking-wider">Video Lesson</span>
                                <h2 className="text-white text-3xl md:text-4xl font-bold drop-shadow-md">{getLoc(lesson, 'title', lang)}</h2>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 pb-0">
                        <h1 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{getLoc(lesson, 'title', lang)}</h1>
                    </div>
                )}

                <div className="p-8 md:p-10">
                    {quizScore && (
                        <div className="mb-8 inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800/30">
                            <Check className="w-4 h-4 mr-2 rtl:ml-2" /> {texts.passed} Pre-Test with {quizScore.percentage}%
                        </div>
                    )}

                    <div className="prose dark:prose-invert max-w-none mb-12 text-slate-600 dark:text-slate-300 text-lg leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: getLoc(lesson, 'content', lang) }} />

                    {lesson.images && lesson.images.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center">
                                <ImageIcon className="w-6 h-6 mr-3 rtl:ml-3 text-emerald-500" /> {texts.gallery}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {lesson.images.map((img, idx) => (
                                    <div key={idx} className="rounded-2xl overflow-hidden border border-cyan-300 dark:border-slate-700 shadow-sm group">
                                        <img src={img} alt={`Diagram ${idx}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.pdfUrl && (
                        <div className="mb-12 p-6 bg-cyan-50 dark:bg-slate-800/50 rounded-2xl border border-cyan-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between transition hover:shadow-md">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mr-5 rtl:ml-5">
                                    <FileText className="w-7 h-7 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">Lesson Materials</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive guide and resources in PDF format</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    alert(lang === 'ar' ? 'جاري تحميل الملف...' : 'Downloading file...');
                                    setFileOpened(true);
                                }}
                                className={`px-6 py-3 border rounded-xl font-semibold transition flex items-center shadow-sm whitespace-nowrap ${fileOpened ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-[#e0fcfc] dark:bg-slate-700 border-cyan-300 dark:border-slate-600 text-[#2d507b] dark:text-slate-200 hover:bg-cyan-100 dark:hover:bg-slate-600'}`}
                            >
                                {fileOpened ? <Check className="w-5 h-5 mr-2 rtl:ml-2" /> : <Download className="w-5 h-5 mr-2 rtl:ml-2" />} 
                                {fileOpened ? (lang === 'ar' ? 'تم التحميل' : 'Downloaded') : texts.downloadPdf}
                            </button>
                        </div>
                    )}

                    {/* External Platforms / Simulators */}
                    {(lesson.platforms && lesson.platforms.length > 0) && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-6 flex items-center">
                                <ExternalLink className="w-6 h-6 mr-3 rtl:ml-3 text-cyan-500" /> {lang === 'ar' ? 'منصات ومحاكيات' : 'Platforms & Simulators'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {lesson.platforms.map((platform, idx) => (
                                    <a key={idx} href={platform.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-[#e0fcfc] dark:bg-slate-800 border border-cyan-300 dark:border-slate-700 rounded-xl hover:border-cyan-500 transition-colors group shadow-sm">
                                        <div>
                                            <h4 className="font-bold text-[#1e3a5f] dark:text-white group-hover:text-cyan-500 transition-colors">{platform.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{platform.description}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/30 transition-colors">
                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assignment Upload Section */}
                    {lesson.assignment && (
                        <div className="mb-12 p-6 bg-cyan-50 dark:bg-slate-800 border border-cyan-300 dark:border-slate-700 rounded-2xl">
                            <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2 flex items-center gap-2">
                                <FileText className="text-blue-500" /> {lang === 'ar' ? 'تمرين عملي / واجب' : 'Practical Assignment'}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">{lesson.assignment.description}</p>
                            
                            {assignmentStatus === 'pending_upload' && (
                                <div className="border-2 border-dashed border-cyan-400 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                    <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">{lang === 'ar' ? 'اسحب الكود أو الملف هنا للرفع' : 'Drag code or file here to upload'}</p>
                                    <button 
                                        onClick={() => {
                                            setUploading(true);
                                            setTimeout(() => {
                                                setUploading(false);
                                                setAssignmentStatus('pending_review');
                                            }, 2000);
                                        }}
                                        disabled={uploading}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                                    >
                                        {uploading ? (lang === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (lang === 'ar' ? 'رفع الملف' : 'Upload File')}
                                    </button>
                                </div>
                            )}

                            {assignmentStatus === 'pending_review' && (
                                <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl text-amber-700 dark:text-amber-400">
                                    <ClockIcon className="w-8 h-8 animate-pulse" />
                                    <div>
                                        <h4 className="font-bold">{lang === 'ar' ? 'تم الرفع بنجاح - قيد المراجعة' : 'Uploaded Successfully - Pending Review'}</h4>
                                        <p className="text-sm">{lang === 'ar' ? 'يستغرق التصحيح من قبل المعلم بعض الوقت.' : 'Grading by the instructor will take some time.'}</p>
                                    </div>
                                </div>
                            )}

                            {assignmentStatus === 'graded' && (
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle className="w-8 h-8" />
                                    <div>
                                        <h4 className="font-bold">{lang === 'ar' ? 'تم التصحيح والنجاح!' : 'Graded & Passed!'}</h4>
                                        <p className="text-sm">{lang === 'ar' ? 'عمل رائع.' : 'Great work.'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-8 border-t border-cyan-300 dark:border-slate-700 mt-12">
                        <button onClick={onPrev} disabled={!hasPrev} className={`px-6 py-3 rounded-xl font-medium flex items-center transition ${hasPrev ? 'text-slate-600 hover:bg-cyan-100 dark:text-slate-300 dark:hover:bg-slate-700' : 'opacity-0 pointer-events-none'}`}>
                            <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {texts.prev}
                        </button>
                        
                        {!isLessonComplete ? (
                             <div className="text-sm text-red-500 dark:text-red-400 flex items-center font-medium bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-lg">
                                 {lang === 'ar' ? 'الرجاء إكمال متطلبات الدرس أولاً (فتح ملفات/فيديو/تمرين)' : 'Please complete lesson requirements first (Files/Video/Assignment)'}
                             </div>
                        ) : null}

                        <button 
                            onClick={onNext} 
                            disabled={!hasNext || !isLessonComplete} 
                            className={`px-8 py-3 rounded-xl font-bold flex items-center transition ${hasNext && isLessonComplete ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20' : 'bg-cyan-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'}`}
                        >
                            {texts.next} {hasNext && <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:rotate-180" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
