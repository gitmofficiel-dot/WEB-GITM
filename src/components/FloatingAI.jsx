import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { streamChatCompletion, systemPrompt } from '../services/aiService';

export default function FloatingAI() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: lang === 'ar' ? 'مرحباً! أنا مساعدك الذكي GITM AI. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am your GITM AI assistant. How can I help you today?' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    const apiMessages = [
      { role: 'system', content: lang === 'ar' ? systemPrompt.ar : systemPrompt.en },
      ...messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      })),
      { role: 'user', content: userText }
    ];

    try {
      const aiMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);
      
      await streamChatCompletion(apiMessages, (accumulatedText) => {
        setIsTyping(false);
        setMessages(prev => 
          prev.map(msg => msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg)
        );
      });
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 2, 
        sender: 'ai', 
        text: lang === 'ar' ? 'عذراً، حدث خطأ أثناء الاتصال. يرجى التأكد من إضافة VITE_OPENROUTER_API_KEY.' : 'Sorry, a connection error occurred. Please ensure VITE_OPENROUTER_API_KEY is set.' 
      }]);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-[100]">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-0 rtl:left-0 rtl:right-auto w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] glass-card rounded-2xl shadow-2xl border border-teal-500/20 dark:border-cyan-500/20 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="h-16 bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-between px-4 text-white shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#e0fcfc]/20 flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">GITM AI <Sparkles className="w-3 h-3 text-amber-300" /></h3>
                    <p className="text-xs text-teal-100 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-[#e0fcfc]/10 hover:bg-[#e0fcfc]/20 flex items-center justify-center transition-colors relative z-10">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyan-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
                {messages.map(msg => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-cyan-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white'}`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-cyan-200 dark:bg-slate-700 text-[#1e3a5f] dark:text-white rounded-tr-none rtl:rounded-tl-none rtl:rounded-tr-2xl' 
                          : 'bg-[#e0fcfc] dark:bg-slate-800 text-[#2d507b] dark:text-slate-300 border border-cyan-300 dark:border-slate-700 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%] flex-row">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-4 rounded-2xl bg-[#e0fcfc] dark:bg-slate-800 border border-cyan-300 dark:border-slate-700 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl shadow-sm flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-[#e0fcfc] dark:bg-slate-800 border-t border-cyan-300 dark:border-slate-700 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                    className="w-full bg-cyan-100 dark:bg-slate-900 border border-cyan-300 dark:border-slate-700 rounded-full py-2.5 pl-4 pr-12 rtl:pr-4 rtl:pl-12 text-sm focus:outline-none focus:border-teal-500 text-[#1e3a5f] dark:text-white"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 rtl:left-1.5 rtl:right-auto w-8 h-8 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4 rtl:-scale-x-100" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'bg-slate-700 hover:bg-slate-50 dark:bg-slate-800 rotate-90' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-50 dark:border-slate-900 rounded-full animate-pulse"></span>
          )}
        </motion.button>
      </div>
    </>
  );
}
