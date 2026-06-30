import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';
const AIChatBot = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً! أنا المساعد الذكي لـ GITM. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error(lang === 'ar' ? 'متصفحك لا يدعم التعرف على الصوت.' : 'Your browser does not support speech recognition.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => handleSend(transcript), 500);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestions = [
    { id: 'gitm', label: lang === 'ar' ? 'ما هي GITM؟' : 'What is GITM?' },
    { id: 'academy', label: lang === 'ar' ? 'دورات الأكاديمية' : 'Academy Courses' },
    { id: 'contact', label: lang === 'ar' ? 'معلومات الاتصال' : 'Contact Info' },
  ];

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text, time: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = lang === 'ar' ? 'يمكنني مساعدتك في معلومات حول GITM وأكاديميتنا ومشاريعنا والمزيد!' : 'I can help with info about GITM, our academy, projects, and more!';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('gitm') || lowerText.includes('ما هي')) {
        aiResponse = lang === 'ar' ? 'GITM هي مجموعة الابتكار التكنولوجي المغربية، نركز على الأنظمة المدمجة، الذكاء الاصطناعي، وإنترنت الأشياء.' : 'GITM is the Moroccan Technology Innovation Group, focusing on embedded systems, AI, and IoT.';
      } else if (lowerText.includes('مرحبا') || lowerText.includes('سلام') || lowerText.includes('hello') || lowerText.includes('hi')) {
        aiResponse = lang === 'ar' ? 'أهلاً بك! وعليكم السلام. كيف يمكنني إفادتك اليوم؟' : 'Hello there! How can I help you today?';
      } else if (lowerText.includes('مؤسس') || lowerText.includes('founder')) {
        aiResponse = lang === 'ar' ? 'مؤسس GITM هو المهندس محمد غزاوني (Mohammed Rhzaouni)، ويهدف من خلال المجموعة إلى دفع عجلة الابتكار التكنولوجي في المغرب.' : 'The founder of GITM is engineer Mohammed Rhzaouni, aiming to drive technological innovation in Morocco.';
      } else if (lowerText.includes('academy') || lowerText.includes('أكاديمية') || lowerText.includes('course')) {
        aiResponse = lang === 'ar' ? 'نقدم 3 مسارات رئيسية: الذكاء الاصطناعي على الحافة، الروبوتات المستقلة، وأنظمة السحابة لإنترنت الأشياء.' : 'We offer 3 main tracks: Edge AI, Autonomous Robotics, and IoT Cloud Systems.';
      } else if (lowerText.includes('contact') || lowerText.includes('اتصال') || lowerText.includes('تواصل')) {
        aiResponse = lang === 'ar' ? 'يمكنك التواصل معنا عبر contact@gitm.ma أو زيارة مختبرنا في الدار البيضاء.' : 'You can reach us at contact@gitm.ma or visit our lab in Casablanca.';
      } else if (lowerText.includes('dashboard') || lowerText.includes('لوحة')) {
        aiResponse = lang === 'ar' ? 'جاري توجيهك إلى لوحة التحكم الخاصة بك...' : 'Redirecting you to your dashboard...';
        setTimeout(() => window.location.hash = '#dashboard', 1000); // Trigger mock navigation
      } else if (lowerText.includes('lab') || lowerText.includes('مختبر')) {
         aiResponse = lang === 'ar' ? 'جاري توجيهك إلى المختبر الافتراضي 3D...' : 'Redirecting you to the 3D Virtual Lab...';
         setTimeout(() => window.location.hash = '#virtual-lab', 1000);
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: aiResponse, time: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl ${isOpen ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-teal-500/30'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 rtl:left-0 rtl:right-auto w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl origin-bottom-right rtl:origin-bottom-left animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-orbitron drop-shadow-md">{lang === 'ar' ? 'المساعد الذكي لـ GITM' : 'GITM AI Assistant'}</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-teal-100 font-bold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {lang === 'ar' ? 'متصل الآن' : 'Online'}
                </span>
              </div>
            </div>
            <Sparkles className="text-teal-200" size={18} />
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-none bg-slate-50 dark:bg-[#0f172a]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-teal-500 text-white'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className={`p-3 text-sm leading-relaxed shadow-sm rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-slate-500 dark:text-slate-400 ${msg.sender === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 self-start">
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-teal-500 text-white">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 3 && !isTyping && (
            <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.label)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-900/30 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-4 pr-20 rtl:pr-4 rtl:pl-20 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
              />
              <div className="absolute right-2 rtl:left-2 rtl:right-auto flex items-center">
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors mr-1 rtl:mr-0 rtl:ml-1 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'}`}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={20} className="rtl:rotate-180" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
