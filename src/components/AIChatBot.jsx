import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Paperclip, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';
import { useAI } from '../hooks/useAI';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AIChatBot = () => {
  const { lang, t } = useLanguage();
  const { chatWithGitmai } = useAI();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  
  const GITM_MODELS = [
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'GITM Pro', desc: lang === 'ar' ? 'نموذج متطور جداً' : 'Advanced Model' },
    { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'GITM Fast', desc: lang === 'ar' ? 'سريع وعملي' : 'Fast & Efficient' },
    { id: 'qwen/qwen3-coder:free', name: 'GITM Coder', desc: lang === 'ar' ? 'مطور أكواد متخصص' : 'Specialized Coder' },
    { id: 'nvidia/nemotron-nano-12b-2-vl:free', name: 'GITM Vision', desc: lang === 'ar' ? 'تحليل الرؤية' : 'Vision Analysis' },
    { id: 'liquid/lfm2.5-1.2b-thinking:free', name: 'GITM Thinker', desc: lang === 'ar' ? 'تحليل عميق' : 'Deep Analysis' },
    { id: 'nousresearch/hermes-3-405b-instruct:free', name: 'GITM Ultra', desc: lang === 'ar' ? 'القدرات القصوى' : 'Maximum Capabilities' }
  ];

  const [selectedModel, setSelectedModel] = useState(GITM_MODELS[0].id);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadChat = async () => {
      let loaded = false;
      if (currentUser) {
        try {
          const docSnap = await getDoc(doc(db, 'userChats', currentUser.uid));
          if (docSnap.exists() && docSnap.data().messages?.length > 0) {
            setMessages(docSnap.data().messages.map(m => ({ ...m, time: new Date(m.time) })));
            loaded = true;
          }
        } catch(e) { console.error(e); }
      } else {
        const local = localStorage.getItem('gitm_chat');
        if (local) {
          setMessages(JSON.parse(local).map(m => ({ ...m, time: new Date(m.time) })));
          loaded = true;
        }
      }
      if (!loaded) {
        setMessages([ { id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً! أنا المساعد الذكي لـ GITM. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() } ]);
      }
    };
    loadChat();
  }, [currentUser, lang]);

  useEffect(() => {
    if (messages.length > 1) {
      const saveChat = async () => {
        const msgsToSave = messages.map(m => ({ ...m, time: m.time.toISOString() }));
        if (currentUser) {
          try {
            await setDoc(doc(db, 'userChats', currentUser.uid), { messages: msgsToSave }, { merge: true });
          } catch(e) {}
        } else {
          localStorage.setItem('gitm_chat', JSON.stringify(msgsToSave));
        }
      };
      saveChat();
    }
  }, [messages, currentUser]);

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
  }, [messages, isTyping, isOpen]);

  const clearChat = async () => {
    const defaultMsg = [ { id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً! أنا المساعد الذكي لـ GITM. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() } ];
    setMessages(defaultMsg);
    if (currentUser) {
      try { await setDoc(doc(db, 'userChats', currentUser.uid), { messages: [] }, { merge: true }); } catch(e){}
    } else {
      localStorage.removeItem('gitm_chat');
    }
    toast.success(lang === 'ar' ? 'تم تفريغ المحادثة' : 'Chat cleared');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();
    
    reader.onload = (ev) => {
      const content = ev.target.result;
      const newMsg = {
        id: Date.now(),
        sender: 'user',
        text: isImage ? (lang === 'ar' ? '[صورة مرفقة]' : '[Attached Image]') : `[File Content: ${file.name}]\n${content.substring(0, 5000)}`,
        image: isImage ? content : null,
        time: new Date()
      };
      
      const promptTxt = isImage ? (lang === 'ar' ? 'اشرح هذه الصورة' : 'Explain this image') : (lang === 'ar' ? `حلل هذا الملف: ${file.name}` : `Analyze this file: ${file.name}`);
      handleSend(promptTxt, newMsg);
    };
    
    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const suggestions = [
    { id: 'gitm', label: lang === 'ar' ? 'ما هي GITM؟' : 'What is GITM?' },
    { id: 'academy', label: lang === 'ar' ? 'دورات الأكاديمية' : 'Academy Courses' },
    { id: 'contact', label: lang === 'ar' ? 'معلومات الاتصال' : 'Contact Info' },
  ];

  const handleSend = async (text = input, attachmentMsg = null) => {
    if (!text.trim() && !attachmentMsg) return;

    const newUserMsg = attachmentMsg || { id: Date.now(), sender: 'user', text, time: new Date() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Hardcoded quick answers for specific triggers
      if (!attachmentMsg) {
        const lowerText = text.toLowerCase();
        let hardcodedResponse = null;
        if (lowerText.includes('dashboard') || lowerText.includes('لوحة')) {
          hardcodedResponse = lang === 'ar' ? 'جاري توجيهك إلى لوحة التحكم الخاصة بك...' : 'Redirecting you to your dashboard...';
          setTimeout(() => window.location.hash = '#dashboard', 1000);
        } else if (lowerText.includes('lab') || lowerText.includes('مختبر')) {
           hardcodedResponse = lang === 'ar' ? 'جاري توجيهك إلى المختبر الافتراضي 3D...' : 'Redirecting you to the 3D Virtual Lab...';
           setTimeout(() => window.location.hash = '#virtual-lab', 1000);
        }

        if (hardcodedResponse) {
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: hardcodedResponse, time: new Date() }]);
            setIsTyping(false);
          }, 1000);
          return;
        }
      }

      // Prepare history for AI
      const history = updatedMessages.map(m => {
        if (m.image) {
          return {
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: [
              { type: 'text', text: m.text },
              { type: 'image_url', image_url: { url: m.image } }
            ]
          };
        }
        return {
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        };
      });

      // Call GITM AI
      const responseText = await chatWithGitmai(history, selectedModel);
      
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: responseText, time: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: lang === 'ar' ? 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' : 'Sorry, an error occurred while connecting to the server.', time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
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
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm relative group">
                <Bot size={22} />
              </div>
              <div className="flex flex-col">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-white font-bold font-orbitron drop-shadow-md text-sm outline-none appearance-none cursor-pointer"
                >
                  {GITM_MODELS.map(m => (
                    <option key={m.id} value={m.id} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">{m.name}</option>
                  ))}
                </select>
                <span className="flex items-center gap-1.5 text-[10px] text-teal-100 font-bold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {GITM_MODELS.find(m => m.id === selectedModel)?.desc}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} title={lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'} className="text-teal-200 hover:text-white transition-colors p-1">
                <Trash2 size={18} />
              </button>
              <Sparkles className="text-teal-200" size={18} />
            </div>
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
                    {msg.image && (
                      <div className="mb-2">
                        <img src={msg.image} alt="Upload preview" className="rounded-xl max-w-full h-auto max-h-40 object-cover" />
                      </div>
                    )}
                    {msg.text && (
                      <div className="whitespace-pre-wrap">{msg.text.length > 500 && !msg.image ? `${msg.text.substring(0, 100)}... [File attached]` : msg.text}</div>
                    )}
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.txt,.pdf,.csv"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full transition-colors text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  <Paperclip size={18} />
                </button>
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
