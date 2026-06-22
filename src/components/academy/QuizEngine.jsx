import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

const QuizEngine = ({ questions = [], onComplete, onFail, lang = 'en' }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const isRtl = lang === 'ar';
  const t = {
    next: isRtl ? 'التالي' : 'Next',
    prev: isRtl ? 'السابق' : 'Previous',
    submit: isRtl ? 'إرسال' : 'Submit',
    question: isRtl ? 'سؤال' : 'Question',
    of: isRtl ? 'من' : 'of',
    passed: isRtl ? 'نجاح!' : 'Passed!',
    failed: isRtl ? 'فشل' : 'Failed',
    score: isRtl ? 'النتيجة' : 'Score',
    retry: isRtl ? 'إعادة المحاولة' : 'Retry',
    continue: isRtl ? 'متابعة' : 'Continue'
  };

  const handleSelect = (optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setIsFinished(true);
    
    if (finalScore >= 70) {
      if (onComplete) onComplete(finalScore);
    } else {
      if (onFail) onFail();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setScore(0);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isFinished) {
    const passed = score >= 70;
    return (
      <div className={`p-8 rounded-2xl glass-card text-center max-w-lg mx-auto ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          {passed ? (
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
          ) : (
            <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
          )}
          <h2 className="text-3xl font-bold dark:text-white text-gray-900">
            {passed ? t.passed : t.failed}
          </h2>
          <p className="text-xl dark:text-gray-300 text-gray-600">
            {t.score}: <span className={`font-bold ${passed ? 'text-emerald-500' : 'text-red-500'}`}>{score}%</span>
          </p>
          {!passed && (
            <button 
              onClick={handleRetry}
              className="mt-6 flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors btn-primary"
            >
              <RefreshCw className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              {t.retry}
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`w-full max-w-3xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium dark:text-gray-400 text-gray-500 mb-2">
          <span>{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden quiz-progress">
          <motion.div 
            className="h-full bg-emerald-500 quiz-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-2xl dark:bg-gray-800/50 bg-white/50 backdrop-blur-md shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <h3 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mb-6">
            {currentQuestion?.question}
          </h3>

          <div className="space-y-4">
            {currentQuestion?.options?.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              return (
                <label 
                  key={index}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => handleSelect(index)}
                    className="hidden"
                  />
                  <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 ${isRtl ? 'ml-4' : 'mr-4'}
                    ${isSelected ? 'border-emerald-500' : 'border-gray-400 dark:border-gray-500'}`}
                  >
                    {isSelected && <motion.div layoutId="radio" className="w-3 h-3 rounded-full bg-emerald-500" />}
                  </div>
                  <span className="text-lg dark:text-gray-200 text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
                ${currentQuestionIndex === 0 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {isRtl ? <ChevronRight className="w-5 h-5 ml-1" /> : <ChevronLeft className="w-5 h-5 mr-1" />}
              {t.prev}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all
                ${selectedAnswers[currentQuestionIndex] === undefined
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30'}`}
            >
              {currentQuestionIndex === questions.length - 1 ? t.submit : t.next}
              {isRtl ? <ChevronLeft className="w-5 h-5 mr-1" /> : <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizEngine;
