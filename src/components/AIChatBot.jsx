import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
      alert(lang === 'ar' ? 'متصفحك لا يدعم التعرف على الصوت.' : 'Your browser does not support speech recognition.');
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
      } else if (lowerText.includes('academy') || lowerText.includes('أكاديمية') || lowerText.includes('course')) {
        aiResponse = lang === 'ar' ? 'نقدم 3 مسارات رئيسية: الذكاء الاصطناعي على الحافة، الروبوتات المستقلة، وأنظمة السحابة لإنترنت الأشياء.' : 'We offer 3 main tracks: Edge AI, Autonomous Robotics, and IoT Cloud Systems.';
      } else if (lowerText.includes('contact') || lowerText.includes('اتصال')) {
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
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-glow-cyan transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:shadow-glow-emerald'}`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle className="text-white" size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 rtl:left-0 rtl:right-auto w-80 sm:w-96 h-[500px] glass-card flex flex-col overflow-hidden animate-fade-in-up shadow-2xl border border-white/10 origin-bottom-right rtl:origin-bottom-left">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <Bot className="text-cyan-400" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e3a5f] dark:text-white font-orbitron">{lang === 'ar' ? 'المساعد الذكي لـ GITM' : 'GITM AI Assistant'}</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="status-online w-1.5 h-1.5" />
                  {lang === 'ar' ? 'متصل الآن' : 'Online'}
                </span>
              </div>
            </div>
            <Sparkles className="text-cyan-400/50" size={18} />
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-none">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}>
                  {msg.sender === 'user' ? <User className="text-emerald-400" size={12} /> : <Bot className="text-cyan-400" size={12} />}
                </div>
                <div className="flex flex-col gap-1">
                  <div className={`p-3 text-xs leading-relaxed text-[#1e3a5f] dark:text-slate-200 ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-slate-600 dark:text-slate-500 ${msg.sender === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 bg-cyan-500/20">
                  <Bot className="text-cyan-400" size={12} />
                </div>
                <div className="p-3 chat-bubble-ai flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 3 && !isTyping && (
            <div className="px-5 py-2 flex flex-wrap gap-2 border-t border-white/5">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.label)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-[#e0fcfc]/5 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-cyan-100/50 dark:bg-black/20 border-t border-cyan-300 dark:border-white/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب أو تحدث...' : 'Type or speak...'}
                className="w-full bg-white dark:bg-[#e0fcfc]/5 border border-cyan-300 dark:border-white/10 rounded-xl py-3 pl-4 pr-20 rtl:pr-4 rtl:pl-20 text-sm text-[#1e3a5f] dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <div className="absolute right-2 rtl:left-2 rtl:right-auto flex items-center">
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors mr-1 rtl:mr-0 rtl:ml-1 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-cyan-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-[#e0fcfc]/5'}`}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:hover:text-cyan-400 transition-colors"
                >
                  <Send size={18} className="rtl:rotate-180" />
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
