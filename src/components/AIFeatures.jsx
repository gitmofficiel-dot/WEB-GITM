import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Languages, FileText, Search, Sparkles, 
  BarChart, LineChart, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AITranslator from './AITranslator';

const AIFeatures = () => {
  const { language, isRTL } = useLanguage();
  const [demoInput, setDemoInput] = useState('');
  const [demoOutput, setDemoOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const features = [
    {
      id: 'translation',
      icon: <Languages className="w-8 h-8 text-blue-500" />,
      title: language === 'ar' ? 'ترجمة ذكية' : language === 'fr' ? 'Traduction Intelligente' : language === 'zh' ? '智能翻译' : 'Smart Translation',
      description: language === 'ar' ? 'ترجمة فورية مع الكشف التلقائي عن اللغة.' : language === 'fr' ? 'Traduction en temps réel avec détection automatique.' : language === 'zh' ? '具有自动语言检测功能的实时翻译。' : 'Real-time translation with auto language detection.'
    },
    {
      id: 'summarization',
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      title: language === 'ar' ? 'تلخيص المحتوى' : language === 'fr' ? 'Résumé de Contenu' : language === 'zh' ? '内容摘要' : 'Content Summarization',
      description: language === 'ar' ? 'تحويل المقالات الطويلة إلى ملخصات سريعة القراءة.' : language === 'fr' ? 'Transformez de longs articles en résumés rapides.' : language === 'zh' ? '将长篇文章转化为快速阅读的摘要。' : 'Turn long articles into quick-read summaries.'
    },
    {
      id: 'search',
      icon: <Search className="w-8 h-8 text-indigo-500" />,
      title: language === 'ar' ? 'بحث ذكي' : language === 'fr' ? 'Recherche Intelligente' : language === 'zh' ? '智能搜索' : 'Intelligent Search',
      description: language === 'ar' ? 'نتائج بحث دقيقة تفهم السياق والنية.' : language === 'fr' ? 'Résultats précis comprenant le contexte et l\'intention.' : language === 'zh' ? '理解上下文和意图的精准搜索结果。' : 'Accurate results that understand context and intent.'
    },
    {
      id: 'recommendations',
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: language === 'ar' ? 'توصيات مخصصة' : language === 'fr' ? 'Recommandations Personnalisées' : language === 'zh' ? '个性化推荐' : 'Personalized Recommendations',
      description: language === 'ar' ? 'اقتراحات تعتمد على الذكاء الاصطناعي مخصصة لتفضيلاتك.' : language === 'fr' ? 'Suggestions basées sur l\'IA adaptées à vos préférences.' : language === 'zh' ? '根据您的偏好量身定制的基于人工智能的建议。' : 'AI-driven suggestions tailored to your preferences.'
    },
    {
      id: 'reports',
      icon: <BarChart className="w-8 h-8 text-emerald-500" />,
      title: language === 'ar' ? 'تقارير آلية' : language === 'fr' ? 'Rapports Automatisés' : language === 'zh' ? '自动报告' : 'Automated Reports',
      description: language === 'ar' ? 'توليد تقارير شاملة بضغطة زر واحدة.' : language === 'fr' ? 'Générez des rapports complets en un seul clic.' : language === 'zh' ? '一键生成综合报告。' : 'Generate comprehensive reports with a single click.'
    },
    {
      id: 'analytics',
      icon: <LineChart className="w-8 h-8 text-rose-500" />,
      title: language === 'ar' ? 'تحليلات تنبؤية' : language === 'fr' ? 'Analyses Prédictives' : language === 'zh' ? '预测分析' : 'Predictive Analytics',
      description: language === 'ar' ? 'توقع الاتجاهات المستقبلية باستخدام نماذج البيانات المتقدمة.' : language === 'fr' ? 'Prévoyez les tendances futures avec des modèles avancés.' : language === 'zh' ? '使用高级数据模型预测未来趋势。' : 'Forecast future trends with advanced data models.'
    }
  ];

  const handleDemo = (action) => {
    if (!demoInput.trim()) return;
    setIsProcessing(true);
    setActiveAction(action);
    setDemoOutput('');
    
    setTimeout(() => {
      setIsProcessing(false);
      if (action === 'summarize') {
        setDemoOutput(
          language === 'ar' ? 'الملخص: يوفر الذكاء الاصطناعي حلولاً متقدمة للتحليل والترجمة لتعزيز الإنتاجية.' :
          language === 'fr' ? 'Résumé: L\'IA fournit des solutions d\'analyse et de traduction avancées pour booster la productivité.' :
          language === 'zh' ? '摘要：人工智能提供高级分析和翻译解决方案以提高生产力。' :
          'Summary: AI provides advanced analysis and translation solutions to boost productivity.'
        );
      } else if (action === 'translate') {
        setDemoOutput(
          language === 'ar' ? 'الترجمة المكتشفة (العربية): ' + demoInput :
          language === 'fr' ? 'Traduction détectée (Français): ' + demoInput :
          language === 'zh' ? '检测到的翻译（中文）：' + demoInput :
          'Detected Translation (French): Bonjour le monde'
        );
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      
      {/* Floating 3D CSS Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 opacity-20 blur-sm animate-[orbit_15s_linear_infinite]"></div>
        <div className="absolute top-[60%] right-[10%] w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 blur-md animate-[orbit_20s_linear_infinite_reverse]"></div>
        <div className="absolute bottom-[20%] left-[40%] w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 opacity-20 blur-sm animate-[orbit_12s_linear_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm font-medium mb-6 text-blue-600 dark:text-blue-400"
          >
            <Bot size={18} />
            <span>GITM AI Engine 2.0</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-[#0B132B] dark:text-white"
          >
            {language === 'ar' ? 'مستقبل الأعمال ' : language === 'fr' ? 'L\'avenir des Affaires ' : language === 'zh' ? '未来的商业 ' : 'The Future of Business '}
            <span className="gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
              {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : language === 'fr' ? 'Propulsé par l\'IA' : language === 'zh' ? '由人工智能驱动' : 'Powered by AI'}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400"
          >
            {language === 'ar' ? 'اكتشف كيف يغير الذكاء الاصطناعي طريقتنا في العمل والتعلم.' : language === 'fr' ? 'Découvrez comment l\'IA transforme notre façon de travailler et d\'apprendre.' : language === 'zh' ? '探索人工智能如何改变我们的工作和学习方式。' : 'Discover how Artificial Intelligence is transforming the way we work, learn, and innovate.'}
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card card-3d p-8 rounded-2xl border border-white/20 dark:border-white/5 bg-[#e0fcfc]/50 dark:bg-gray-900/50 backdrop-blur-xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mb-6 p-4 bg-[#e0fcfc] dark:bg-gray-800 rounded-xl inline-block shadow-lg border border-gray-100 dark:border-gray-700 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B132B] dark:text-white relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 relative z-10">
                {feature.description}
              </p>
              <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all relative z-10">
                {language === 'ar' ? 'جرب الآن' : language === 'fr' ? 'Essayer' : language === 'zh' ? '立即尝试' : 'Try it'} 
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 bg-[#e0fcfc]/60 dark:bg-gray-900/60 backdrop-blur-2xl shadow-2xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-[#0B132B] dark:text-white">
              {language === 'ar' ? 'جرب الذكاء الاصطناعي' : language === 'fr' ? 'Démo Interactive' : language === 'zh' ? '互动演示' : 'Interactive Demo'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'أدخل نصاً وشاهد السحر.' : language === 'fr' ? 'Entrez du texte et voyez la magie opérer.' : language === 'zh' ? '输入文本，见证奇迹。' : 'Enter some text and watch the magic happen in real-time.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ar' ? 'نص الإدخال' : language === 'fr' ? 'Texte d\'entrée' : language === 'zh' ? '输入文本' : 'Input Text'}
              </label>
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب أو انسخ نصاً هنا...' : language === 'fr' ? 'Tapez ou collez du texte ici...' : language === 'zh' ? '在此处输入或粘贴文本...' : 'Type or paste some text here...'}
                className="w-full h-40 p-4 bg-[#e0fcfc]/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all dark:text-white"
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDemo('summarize')}
                  disabled={!demoInput.trim() || isProcessing}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing && activeAction === 'summarize' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Bot size={18} />
                    </motion.div>
                  ) : (
                    <FileText size={18} />
                  )}
                  {language === 'ar' ? 'تلخيص' : language === 'fr' ? 'Résumer' : language === 'zh' ? '总结' : 'Summarize'}
                </button>
                <button
                  onClick={() => handleDemo('translate')}
                  disabled={!demoInput.trim() || isProcessing}
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing && activeAction === 'translate' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Bot size={18} />
                    </motion.div>
                  ) : (
                    <Languages size={18} />
                  )}
                  {language === 'ar' ? 'ترجمة' : language === 'fr' ? 'Traduire' : language === 'zh' ? '翻译' : 'Translate'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ar' ? 'النتيجة المدعومة بالذكاء الاصطناعي' : language === 'fr' ? 'Résultat IA' : language === 'zh' ? '人工智能结果' : 'AI Output'}
              </label>
              <div className={`w-full h-40 p-4 bg-cyan-50/80 dark:bg-gray-900/80 border ${demoOutput ? 'border-green-400 dark:border-green-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl transition-all relative overflow-hidden flex flex-col`}>
                {isProcessing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-blue-500 gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Sparkles size={24} />
                    </motion.div>
                    <p className="text-sm font-medium animate-pulse">
                      {language === 'ar' ? 'يعالج الذكاء الاصطناعي...' : language === 'fr' ? 'Traitement par l\'IA...' : language === 'zh' ? '人工智能处理中...' : 'AI is processing...'}
                    </p>
                  </div>
                ) : demoOutput ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2 font-medium text-sm">
                      <CheckCircle2 size={16} />
                      <span>{language === 'ar' ? 'اكتمل بنجاح' : language === 'fr' ? 'Terminé' : language === 'zh' ? '完成' : 'Success'}</span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      {demoOutput}
                    </p>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <p className="text-center text-sm">
                      {language === 'ar' ? 'النتيجة ستظهر هنا' : language === 'fr' ? 'Le résultat apparaîtra ici' : language === 'zh' ? '结果将显示在此处' : 'Output will appear here'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real Translator Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <AITranslator />
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        .animate-\\[orbit_15s_linear_infinite\\] {
          animation: orbit 15s linear infinite;
        }
        .animate-\\[orbit_20s_linear_infinite_reverse\\] {
          animation: orbit 20s linear infinite reverse;
        }
        .animate-\\[orbit_12s_linear_infinite\\] {
          animation: orbit 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIFeatures;
