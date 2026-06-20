import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, MapPin, MonitorPlay, Code, Award, ChevronRight, PlayCircle, Star, Users, Clock, ArrowLeft, ArrowRight, Terminal } from 'lucide-react';
import LessonView from './academy/LessonView';
import CourseProgress from './academy/CourseProgress';
import MapWidget from './MapWidget';
import LibraryWidget from './LibraryWidget';
import ScienceFactWidget from './ScienceFactWidget';

// Translations
const t = {
    en: { title: 'GITM Academy', subtitle: 'Advanced Tech Education & Certifications', back: 'Back to Catalog', overview: 'Overview', lessons: 'Lessons', lab: 'Interactive Lab', certificates: 'Certificates', start: 'Start Learning', enroll: 'Enroll Now', remote: 'Remote Online', inPerson: 'In-Person (Casablanca)' },
    ar: { title: 'أكاديمية GITM', subtitle: 'تعليم تقني متقدم وشهادات', back: 'العودة للكتالوج', overview: 'نظرة عامة', lessons: 'الدروس', lab: 'المختبر التفاعلي', certificates: 'الشهادات', start: 'ابدأ التعلم', enroll: 'سجل الآن', remote: 'عن بعد', inPerson: 'حضوري (الدار البيضاء)' },
    fr: { title: 'Académie GITM', subtitle: 'Formation Technologique Avancée & Certifications', back: 'Retour au Catalogue', overview: 'Aperçu', lessons: 'Leçons', lab: 'Laboratoire Interactif', certificates: 'Certificats', start: 'Commencer', enroll: 'S\'inscrire', remote: 'En Ligne', inPerson: 'En Personne (Casablanca)' },
    zh: { title: 'GITM 学院', subtitle: '高级技术教育和认证', back: '返回目录', overview: '概述', lessons: '课程', lab: '互动实验室', certificates: '证书', start: '开始学习', enroll: '立即报名', remote: '远程在线', inPerson: '面授 (卡萨布兰卡)' }
};

const getLoc = (obj, field, lang) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || '';
};

// Mock Data
const MOCK_COURSES = [
    {
        id: 'c1',
        title_en: 'Edge AI Architecture', title_ar: 'هندسة الذكاء الاصطناعي الطرفي', title_fr: 'Architecture Edge AI', title_zh: '边缘人工智能架构',
        description_en: 'Learn to deploy LLMs and computer vision models on edge devices with extreme efficiency.',
        mode: 'remote',
        color: 'from-emerald-400 to-teal-600',
        icon: <MonitorPlay className="w-8 h-8 text-white" />,
        lessons: [
            {
                id: 'l1', title_en: 'Introduction to Edge Computing', title_ar: 'مقدمة في الحوسبة الطرفية',
                content_en: '<p>Edge computing brings computation and data storage closer to the location where it is needed, to improve response times and save bandwidth.</p><p>In this lesson, we will cover the foundational concepts...</p>',
                hasPreTest: true,
                pdfUrl: 'https://example.com/edge-ai-basics.pdf',
                videoUrl: 'https://example.com/video1',
                preTestQuestions: [
                    { question_en: 'What is Edge Computing?', options: [{ text_en: 'Cloud hosting', isCorrect: false }, { text_en: 'Processing data near the source', isCorrect: true }, { text_en: 'A type of database', isCorrect: false }] },
                    { question_en: 'Which is a primary benefit of Edge AI?', options: [{ text_en: 'Higher latency', isCorrect: false }, { text_en: 'Lower bandwidth usage', isCorrect: true }, { text_en: 'Requires more cloud servers', isCorrect: false }] }
                ],
                images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80']
            },
            {
                id: 'l2', title_en: 'Model Quantization', title_ar: 'تكميم النماذج',
                content_en: '<p>Quantization techniques reduce the precision of the numbers used to represent a model\'s parameters, which shrinks the model size and speeds up inference.</p>',
                hasPreTest: true,
                preTestQuestions: [
                    { question_en: 'What does quantization do?', options: [{ text_en: 'Increases model size', isCorrect: false }, { text_en: 'Reduces precision to save memory', isCorrect: true }] }
                ],
                assignment: {
                    description: 'Upload your quantized ONNX model file (.onnx) for the object detection assignment.',
                    type: 'file'
                }
            }
        ]
    },
    {
        id: 'c2',
        title_en: 'Industrial Robotics', title_ar: 'الروبوتات الصناعية', title_fr: 'Robotique Industrielle', title_zh: '工业机器人',
        description_en: 'Hands-on training with physical robotic arms and automated manufacturing lines.',
        mode: 'in-person',
        location: 'Casablanca Innovation Lab, Tech Park',
        color: 'from-blue-500 to-indigo-600',
        icon: <Users className="w-8 h-8 text-white" />,
        lessons: [
            { id: 'l1', title_en: 'Safety Protocols in Labs', content_en: 'Safety first...', hasPreTest: false }
        ]
    },
    {
        id: 'c3',
        title_en: 'IoT Cloud Integration', title_ar: 'تكامل إنترنت الأشياء السحابي', title_fr: 'Intégration Cloud IoT', title_zh: '物联网云集成',
        description_en: 'Connect millions of devices using MQTT and process data streams in real-time.',
        mode: 'remote',
        color: 'from-amber-400 to-orange-500',
        icon: <MonitorPlay className="w-8 h-8 text-white" />,
        lessons: [
            { id: 'l1', title_en: 'MQTT Protocol Basics', content_en: 'MQTT is a lightweight pub-sub messaging protocol...', hasPreTest: false }
        ]
    }
];

export default function Academy() {
    const { lang, user } = useLanguage();
    const texts = t[lang] || t['en'];
    
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    
    // User progress state (mock)
    const [completedLessons, setCompletedLessons] = useState({}); // { courseId: [lessonIds] }
    const [quizScores, setQuizScores] = useState({}); // { lessonId: { percentage, correct, total } }

    const selectedCourse = MOCK_COURSES.find(c => c.id === selectedCourseId);

    const handleLessonSelect = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    const handleLessonComplete = (lessonId) => {
        setCompletedLessons(prev => {
            const courseCompleted = prev[selectedCourseId] || [];
            if (!courseCompleted.includes(lessonId)) {
                return { ...prev, [selectedCourseId]: [...courseCompleted, lessonId] };
            }
            return prev;
        });
    };

    const handleQuizComplete = (lessonId, score) => {
        setQuizScores(prev => ({ ...prev, [lessonId]: score }));
        handleLessonComplete(lessonId);
    };

    const goBack = () => {
        if (selectedLessonId) {
            setSelectedLessonId(null);
        } else {
            setSelectedCourseId(null);
            setActiveTab('overview');
        }
    };

    // Render Lesson View
    if (selectedCourse && selectedLessonId) {
        const lessonIndex = selectedCourse.lessons.findIndex(l => l.id === selectedLessonId);
        const lesson = selectedCourse.lessons[lessonIndex];
        const hasNext = lessonIndex < selectedCourse.lessons.length - 1;
        const hasPrev = lessonIndex > 0;

        return (
            <div className="min-h-screen bg-cyan-50 dark:bg-slate-900 pt-20">
                <LessonView 
                    lesson={lesson}
                    lang={lang}
                    onBack={() => setSelectedLessonId(null)}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    onNext={() => {
                        handleLessonComplete(lesson.id);
                        setSelectedLessonId(selectedCourse.lessons[lessonIndex + 1].id);
                    }}
                    onPrev={() => setSelectedLessonId(selectedCourse.lessons[lessonIndex - 1].id)}
                    onCompleteQuiz={handleQuizComplete}
                    initialQuizScore={quizScores[lesson.id]}
                />
            </div>
        );
    }

    // Render Course Details
    if (selectedCourse) {
        const courseCompleted = completedLessons[selectedCourse.id] || [];

        return (
            <div className="min-h-screen bg-cyan-50 dark:bg-slate-900 pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button onClick={goBack} className="mb-8 flex items-center text-slate-500 hover:text-emerald-600 transition font-medium bg-[#e0fcfc] dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                        <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {texts.back}
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl shadow-sm border border-cyan-300 dark:border-slate-700 p-8 mb-8 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedCourse.color} opacity-10 rounded-full blur-3xl -mr-20 -mt-20`}></div>
                                
                                <div className="flex items-center mb-6 relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCourse.color} flex items-center justify-center mr-6 rtl:ml-6 shadow-lg`}>
                                        {selectedCourse.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                                            <span className="px-3 py-1 bg-cyan-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {selectedCourse.mode === 'remote' ? texts.remote : texts.inPerson}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white">
                                            {getLoc(selectedCourse, 'title', lang)}
                                        </h1>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed relative z-10">
                                    {getLoc(selectedCourse, 'description', lang)}
                                </p>
                            </motion.div>

                            {/* Tabs */}
                            <div className="flex space-x-2 rtl:space-x-reverse mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                {['overview', 'lessons', 'lab'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 rounded-xl font-semibold capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'bg-[#e0fcfc] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-700 border border-cyan-300 dark:border-slate-700'}`}
                                    >
                                        {texts[tab]}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    {activeTab === 'overview' && (
                                        <div className="bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-cyan-300 dark:border-slate-700">
                                            <h3 className="text-2xl font-bold mb-6 text-[#1e3a5f] dark:text-white">Course Overview</h3>
                                            
                                            {selectedCourse.mode === 'in-person' && (
                                                <div className="mb-8 p-6 bg-cyan-50 dark:bg-slate-900/50 rounded-2xl border border-cyan-300 dark:border-slate-700 flex items-start">
                                                    <MapPin className="w-8 h-8 text-emerald-500 mr-4 rtl:ml-4 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg mb-1">Location Details</h4>
                                                        <p className="text-slate-600 dark:text-slate-400">{selectedCourse.location}</p>
                                                        <div className="mt-4 w-full rounded-xl flex items-center justify-center">
                                                            <MapWidget />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                                <p>Join this comprehensive track to master the skills needed for modern tech environments.</p>
                                                <ul>
                                                    <li>Hands-on projects and assignments</li>
                                                    <li>Industry-recognized certification upon completion</li>
                                                    <li>Expert mentorship and code reviews</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'lessons' && (
                                        <div className="space-y-4">
                                            {selectedCourse.lessons.map((lesson, idx) => {
                                                const isCompleted = courseCompleted.includes(lesson.id);
                                                return (
                                                    <div key={lesson.id} onClick={() => handleLessonSelect(lesson.id)} className="bg-[#e0fcfc] dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-cyan-300 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition group">
                                                        <div className="flex items-center">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-5 rtl:ml-5 font-bold text-lg ${isCompleted ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-cyan-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                                                                    {getLoc(lesson, 'title', lang)}
                                                                </h4>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                                                                    <PlayCircle className="w-4 h-4 mr-1 rtl:ml-1" /> Video Lesson
                                                                    {lesson.hasPreTest && <span className="ml-3 rtl:mr-3 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded">Quiz</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 rtl:rotate-180 transition" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {activeTab === 'lab' && (
                                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 overflow-hidden">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                                                <div className="flex items-center text-slate-300 font-mono text-sm">
                                                    <Terminal className="w-5 h-5 mr-2 rtl:ml-2 text-emerald-400" />
                                                    interactive_lab.sh
                                                </div>
                                                <div className="flex space-x-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                            </div>
                                            <div className="font-mono text-emerald-400 text-sm md:text-base leading-relaxed p-4 h-64 bg-black/50 rounded-xl">
                                                <p className="text-slate-500"># GITM Interactive Code Sandbox</p>
                                                <p className="mt-2">$ gitm-cli start-env --course "{getLoc(selectedCourse, 'title', 'en')}"</p>
                                                <p className="text-amber-300 mt-1">Initializing secure sandbox container...</p>
                                                <p className="text-green-400 mt-1">✓ Environment ready.</p>
                                                <p className="mt-4"><span className="text-blue-400">guest@gitm-lab</span>:<span className="text-purple-400">~</span>$ <span className="animate-pulse">_</span></p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="lg:col-span-1">
                            <CourseProgress 
                                course={selectedCourse} 
                                lessons={selectedCourse.lessons} 
                                completedLessonIds={courseCompleted} 
                                quizScores={quizScores} 
                                lang={lang}
                                onLessonSelect={handleLessonSelect}
                                studentName={user?.name || 'Student Name'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Catalog
    return (
        <div className="min-h-screen bg-cyan-50 dark:bg-slate-900 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-6">
                        <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-[#0B132B] dark:text-white mb-4 tracking-tight">
                        {texts.title}
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {texts.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2 lg:col-span-3 mb-4">
                        <ScienceFactWidget />
                    </div>
                    {MOCK_COURSES.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-[#e0fcfc] dark:bg-slate-800 rounded-3xl shadow-sm border border-cyan-300 dark:border-slate-700 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            <div className={`h-32 bg-gradient-to-r ${course.color} p-6 relative overflow-hidden flex items-center justify-center`}>
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                                    {course.icon}
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.mode === 'remote' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                        {course.mode === 'remote' ? texts.remote : texts.inPerson}
                                    </span>
                                    <span className="px-3 py-1 bg-cyan-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {course.lessons.length} {texts.lessons}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-3 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {getLoc(course, 'title', lang)}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                                    {getLoc(course, 'description', lang)}
                                </p>
                                <button 
                                    onClick={() => setSelectedCourseId(course.id)}
                                    className="w-full py-3.5 rounded-xl font-bold bg-cyan-100 hover:bg-emerald-600 text-[#1e3a5f] hover:text-white dark:bg-slate-700 dark:text-white dark:hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center group/btn"
                                >
                                    {texts.start} <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:rotate-180 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16">
                    <LibraryWidget />
                </div>
            </div>
        </div>
    );
}
