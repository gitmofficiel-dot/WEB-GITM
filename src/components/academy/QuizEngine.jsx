import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft, RotateCcw, Award } from 'lucide-react';

const t = {
    en: {
        next: 'Next Question',
        prev: 'Previous',
        finish: 'Finish Quiz',
        results: 'Quiz Results',
        score: 'Your Score',
        correct: 'Correct',
        wrong: 'Wrong',
        timeUp: 'Time is up!',
        retake: 'Retake Quiz',
        continue: 'Continue to Lesson',
        question: 'Question',
        of: 'of'
    },
    ar: {
        next: 'السؤال التالي',
        prev: 'السابق',
        finish: 'إنهاء الاختبار',
        results: 'نتائج الاختبار',
        score: 'نتيجتك',
        correct: 'صحيح',
        wrong: 'خاطئ',
        timeUp: 'انتهى الوقت!',
        retake: 'إعادة الاختبار',
        continue: 'متابعة إلى الدرس',
        question: 'سؤال',
        of: 'من'
    },
    fr: {
        next: 'Question Suivante',
        prev: 'Précédent',
        finish: 'Terminer',
        results: 'Résultats',
        score: 'Votre Score',
        correct: 'Correct',
        wrong: 'Faux',
        timeUp: 'Temps écoulé!',
        retake: 'Refaire',
        continue: 'Continuer',
        question: 'Question',
        of: 'sur'
    },
    zh: {
        next: '下一题',
        prev: '上一题',
        finish: '完成',
        results: '结果',
        score: '你的分数',
        correct: '正确',
        wrong: '错误',
        timeUp: '时间到！',
        retake: '重新测试',
        continue: '继续课程',
        question: '问题',
        of: '/'
    }
};

const getLoc = (obj, field, lang) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || '';
};

export default function QuizEngine({ questions = [], onComplete, lang = 'en' }) {
    const texts = t[lang] || t['en'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleNext();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentIndex, isFinished]);

    const handleSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentIndex]: optionIndex });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setTimeLeft(30);
        } else {
            setIsFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setTimeLeft(30);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, i) => {
            if (answers[i] !== undefined && q.options[answers[i]]?.isCorrect) {
                correct++;
            }
        });
        return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
    };

    if (isFinished) {
        const score = calculateScore();
        return (
            <div className="bg-[#e0fcfc] dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-cyan-200 dark:border-slate-700 text-center relative z-10">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                    <Award className="w-24 h-24 text-emerald-500 mb-4" />
                    <h2 className="text-3xl font-bold mb-2 text-[#1e3a5f] dark:text-white">{texts.results}</h2>
                    <div className="text-6xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-6">
                        {score.percentage}%
                    </div>
                    <div className="flex space-x-6 rtl:space-x-reverse mb-8">
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-6 h-6 mr-2 rtl:ml-2" />
                            <span className="text-lg font-medium">{score.correct} {texts.correct}</span>
                        </div>
                        <div className="flex items-center text-red-500">
                            <XCircle className="w-6 h-6 mr-2 rtl:ml-2" />
                            <span className="text-lg font-medium">{score.total - score.correct} {texts.wrong}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={() => { setIsFinished(false); setCurrentIndex(0); setAnswers({}); setTimeLeft(30); }} className="px-6 py-3 rounded-xl font-semibold border-2 border-cyan-300 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700 text-[#2d507b] dark:text-slate-200 transition flex items-center justify-center">
                            <RotateCcw className="w-5 h-5 mr-2 rtl:ml-2" /> {texts.retake}
                        </button>
                        <button onClick={() => onComplete(score)} className="px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            {texts.continue} <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:rotate-180" />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return null;

    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="bg-[#e0fcfc] dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-xl max-w-3xl mx-auto border border-cyan-200 dark:border-slate-700 relative overflow-hidden z-10">
            <div className="absolute top-0 left-0 w-full h-2 bg-cyan-100 dark:bg-slate-700">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-8 mt-4">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {texts.question} {currentIndex + 1} {texts.of} {questions.length}
                </div>
                <div className={`flex items-center px-4 py-2 rounded-full font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-cyan-100 text-[#2d507b] dark:bg-slate-700 dark:text-slate-200'}`}>
                    <Clock className="w-5 h-5 mr-2 rtl:ml-2" />
                    00:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] dark:text-white mb-8 leading-tight">
                        {getLoc(currentQuestion, 'question', lang)}
                    </h3>

                    <div className="space-y-4 mb-10">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = answers[currentIndex] === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    className={`w-full text-start p-5 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-cyan-300 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-cyan-50 dark:hover:bg-slate-700'}`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 rtl:ml-4 flex-shrink-0 transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-cyan-400 dark:border-slate-500'}`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#e0fcfc]"></div>}
                                        </div>
                                        <span className={`text-lg ${isSelected ? 'font-semibold text-emerald-900 dark:text-emerald-100' : 'text-[#2d507b] dark:text-slate-200'}`}>
                                            {getLoc(option, 'text', lang)}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center pt-6 border-t border-cyan-200 dark:border-slate-700">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`px-5 py-2.5 rounded-xl font-medium flex items-center transition ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-cyan-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                >
                    <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:rotate-180" /> {texts.prev}
                </button>
                <button
                    onClick={handleNext}
                    disabled={answers[currentIndex] === undefined}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center transition shadow-md ${answers[currentIndex] === undefined ? 'bg-cyan-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500 shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'}`}
                >
                    {currentIndex === questions.length - 1 ? texts.finish : texts.next} 
                    {currentIndex !== questions.length - 1 && <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:rotate-180" />}
                </button>
            </div>
        </div>
    );
}
