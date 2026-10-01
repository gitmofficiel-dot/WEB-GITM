import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Mic, MicOff, Paperclip, Trash2, BrainCircuit } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';
import { useAI } from '../hooks/useAI';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AIChatBot = () => {
  const { lang, users, courses, news, events } = useLanguage();
  const { chatWithGitmai } = useAI();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  
  const defaultModels = [
    { id: 'openrouter/free', name: 'GITM AI', desc: lang === 'ar' ? 'مساعد الابتكار والتكنولوجيا' : 'Innovation & technology assistant' }
  ];

  const [gitmModels, setGitmModels] = useState(defaultModels);
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].id);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch Dynamic Models from Firebase
    const fetchModels = async () => {
      try {
        const modelsDoc = await getDoc(doc(db, 'settings', 'ai_models'));
        if (modelsDoc.exists() && modelsDoc.data().models?.length > 0) {
          setGitmModels(modelsDoc.data().models);
          setSelectedModel(modelsDoc.data().models[0].id);
        }
      } catch (err) {
        console.error('Error fetching dynamic models:', err);
      }
    };
    fetchModels();

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
        try {
        const local = localStorage.getItem('gitm_chat');
        if (local) {
          setMessages(JSON.parse(local).map(m => ({ ...m, time: new Date(m.time) })));
          loaded = true;
        }
        } catch { /* Ignore corrupt or unavailable storage. */ }
      }
      if (!loaded) {
        setMessages([ { id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً بك! أنا الذكاء الاصطناعي الخاص بمجموعة الابتكار التكنولوجي المغرب (GITM). كيف يمكنني مساعدتك؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() } ]);
      }
    };
    loadChat();
  }, [currentUser, lang]);

  useEffect(() => {
    if (messages.length > 1 && !isTyping) {
      const saveChat = async () => {
        const msgsToSave = messages.map(m => ({ ...m, time: m.time.toISOString() }));
        if (currentUser) {
          try {
            await setDoc(doc(db, 'userChats', currentUser.uid), { messages: msgsToSave }, { merge: true });
          } catch { /* Saving is best effort. */ }
        } else {
          try { localStorage.setItem('gitm_chat', JSON.stringify(msgsToSave)); } catch { /* Storage may be full. */ }
        }
      };
      saveChat();
    }
  }, [messages, currentUser, isTyping]);

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
      try { await setDoc(doc(db, 'userChats', currentUser.uid), { messages: [] }, { merge: true }); } catch { /* Saving is best effort. */ }
    } else {
      localStorage.removeItem('gitm_chat');
    }
    toast.success(lang === 'ar' ? 'تم تفريغ المحادثة' : 'Chat cleared');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || isTyping) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(lang === 'ar' ? 'الحد الأقصى للملف 2 ميغابايت' : 'Maximum file size: 2 MB');
      return;
    }

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
    if (isTyping || (!text.trim() && !attachmentMsg)) return;

    const newUserMsg = attachmentMsg || { id: crypto.randomUUID(), sender: 'user', text, time: new Date() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for AI
      const history = updatedMessages.filter(m => m.text || m.image).slice(-20).map(m => {
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

      // Compile global context for AI
      const globalContext = `
      Team Members: ${users?.filter(u => u.isTeamMember)?.map(u => `${u.name || u.firstName} (${u.role}) - ${u.bio || ''}`)?.join(' | ') || 'None'}
      Courses: ${courses?.map(c => `${c.title?.en || c.title_en || c.title_ar || c.title} (Instructor: ${typeof c.instructor === 'object' ? (c.instructor.en || c.instructor.ar) : c.instructor})`)?.join(' | ') || 'None'}
      News: ${news?.map(n => n.title?.en || n.title_en || n.title_ar)?.join(' | ') || 'None'}
      Events: ${events?.map(e => e.title?.en || e.title_en || e.title_ar)?.join(' | ') || 'None'}
      `;

      // Setup empty AI message first
      const aiMsgId = crypto.randomUUID();
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '', time: new Date() }]);

      // Call GITM AI with streaming callback
      const responseText = await chatWithGitmai(history, selectedModel, globalContext, (currentText) => {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
      });

      if (!responseText?.trim()) throw new Error('Empty response');
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: responseText } : m));
    } catch {
      setMessages(prev => [...prev.filter(m => m.text || m.image), { id: Date.now(), sender: 'ai', text: lang === 'ar' ? 'عذراً، المساعد الذكي غير متاح حالياً للتحديث. يرجى المحاولة لاحقاً.' : 'Sorry, the AI Assistant is currently offline for updates. Please try again later.', time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 rtl:left-4 md:rtl:left-6 rtl:right-auto z-[60]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === 'ar' ? 'مساعد GITM الذكي' : 'GITM AI assistant'}
        aria-expanded={isOpen}
        aria-controls="gitm-ai-panel"
        className="h-12 md:h-14 px-4 rounded-2xl flex items-center justify-center gap-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700 dark:border-white shadow-lg transition-colors hover:bg-slate-800 dark:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        {isOpen ? <X size={20} /> : <BrainCircuit size={20} strokeWidth={2} />}
        <span className="text-sm font-semibold tracking-wide" dir="ltr">GITM AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div id="gitm-ai-panel" role="dialog" aria-label={lang === 'ar' ? 'مساعد GITM' : 'GITM assistant'} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="fixed inset-0 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:rtl:left-0 sm:rtl:right-auto sm:w-96 sm:h-[500px] sm:min-h-[400px] sm:max-h-[calc(100dvh-120px)] w-full h-full sm:rounded-3xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-2xl border-0 sm:border sm:border-slate-200 sm:dark:border-slate-800 z-[70] sm:origin-bottom-right sm:rtl:origin-bottom-left animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm relative group">
                <Sparkles size={22} strokeWidth={1.7} />
              </div>
              <div className="flex flex-col">
                <select 
                  aria-label={lang === 'ar' ? 'نموذج المساعد' : 'Assistant model'}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-white font-bold font-sans font-bold tracking-tight drop-shadow-md text-sm outline-none appearance-none cursor-pointer"
                >
                  {gitmModels.map(m => (
                    <option key={m.id} value={m.id} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">{m.name}</option>
                  ))}
                </select>
                <span className="flex items-center gap-1.5 text-[10px] text-teal-100 font-bold">

                  {gitmModels.find(m => m.id === selectedModel)?.desc}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={isTyping} onClick={clearChat} title={lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'} className="text-teal-200 hover:text-white transition-colors p-1">
                <Trash2 size={18} />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label={lang === 'ar' ? 'إغلاق المساعد' : 'Close assistant'} className="p-2 rounded-lg hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"><X size={20} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-none bg-slate-50 dark:bg-[#0f172a]">
            {messages.filter(msg => msg.text || msg.image).map((msg) => (
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
                      <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.text}</div>
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
                aria-label={lang === 'ar' ? 'رسالتك' : 'Your message'}
                maxLength={8000}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-4 pr-32 rtl:pr-4 rtl:pl-32 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
              />
              <div className="absolute right-2 rtl:left-2 rtl:right-auto flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.txt,.csv"
                />
                <button
                  type="button"
                  disabled={isTyping}
                  aria-label={lang === 'ar' ? 'إرفاق صورة أو نص' : 'Attach image or text'}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full transition-colors text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="button"
                  disabled={isTyping || isListening}
                  aria-label={lang === 'ar' ? 'الإدخال الصوتي' : 'Voice input'}
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors mr-1 rtl:mr-0 rtl:ml-1 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'}`}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  aria-label={lang === 'ar' ? 'إرسال' : 'Send'}
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
