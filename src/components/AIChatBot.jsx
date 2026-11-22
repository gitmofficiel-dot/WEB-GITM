import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Mic, MicOff, Paperclip, Trash2, BrainCircuit } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';
import { useAI } from '../hooks/useAI';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Minimal, safe markdown for bot replies: **bold**, *italic*, `code`. No HTML is ever injected.
const renderRichText = (text) => {
  const parts = String(text || '').split(/(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\s][^*\n]*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(part)) return <code key={i} className="px-1 rounded bg-slate-100 dark:bg-slate-700 text-[0.9em]">{part.slice(1, -1)}</code>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    return part.replace(/\*\*/g, '');
  });
};

// Plain text from possibly-HTML / double-encoded descriptions.
const plain = (value, max = 220) => {
  if (!value || typeof value !== 'string') return '';
  let t = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/[<&]/.test(t)) break;
    t = new DOMParser().parseFromString(t, 'text/html').body.textContent || '';
  }
  t = t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max)}...` : t;
};

// Pick a localized string from a field that may be a string, {ar,en,fr}, or sibling fields (titleAr/titleEn).
const loc = (obj, field, lang) => {
  const v = obj?.[field];
  const cap = field.charAt(0).toUpperCase() + field.slice(1);
  const pick = (x) => (typeof x === 'string' ? x : x && typeof x === 'object' ? (x[lang] || x.ar || x.en || '') : '');
  return pick(lang === 'ar' ? (obj?.[`${field}Ar`] || obj?.[`${field}_ar`] || v) : (obj?.[`${field}${lang === 'en' ? 'En' : 'Fr'}`] || obj?.[`${field}_${lang}`] || v)) || pick(obj?.[`${field}Ar`]) || pick(obj?.[`${field}En`]) || pick(v);
};

// Real site content for the bot, from live Firestore data already loaded by the app.
const buildSiteContext = ({ courses, news, events, users }, lang) => {
  const origin = 'https://gitm.pages.dev';
  const c = (courses || []).slice(0, 25).map((x) => {
    const lessons = Array.isArray(x.lessons) ? x.lessons.map((l) => loc(l, 'title', lang)).filter(Boolean).slice(0, 8).join('، ') : '';
    return `- دورة: ${loc(x, 'title', lang)} | المدرّب: ${loc(x, 'instructor', lang) || 'غير محدد'} | المستوى: ${x.level || '-'} | المدة: ${x.duration || '-'} | المجال: ${x.category || '-'} | الوصف: ${plain(loc(x, 'description', lang))}${lessons ? ` | الدروس: ${lessons}` : ''}`;
  }).join('\n');
  const n = (news || []).slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 12).map((x) => `- خبر: ${loc(x, 'title', lang)} | التاريخ: ${x.date || '-'} | المصدر: ${x.source || '-'} | ${plain(loc(x, 'description', lang), 180)} | الرابط: ${origin}/news/${x.id}`).join('\n');
  const e = (events || []).slice(0, 15).map((x) => `- فعالية: ${loc(x, 'title', lang)} | التاريخ: ${x.date || x.startDate || '-'} | المكان: ${loc(x, 'location', lang) || x.location || '-'} | ${plain(loc(x, 'description', lang), 160)} | الرابط: ${origin}/events/${x.id}`).join('\n');
  const t = (users || []).filter((u) => u.isTeamMember).slice(0, 12).map((u) => `- ${u.name || u.firstName || ''} (${u.role || ''})`).join('\n');
  return `الدورات (الأكاديمية، ${origin}/academy):\n${c || 'لا توجد دورات منشورة حالياً.'}\n\nآخر الأخبار (${origin}/news):\n${n || 'لا توجد أخبار حالياً.'}\n\nالفعاليات (${origin}/events):\n${e || 'لا توجد فعاليات منشورة حالياً.'}\n\nفريق GITM:\n${t || 'غير متوفر.'}`;
};

const COMPLAINT_RE = /(شكوى|شكاية|شكايه|اشتكي|أشتكي|تظلم|مشكل[ةه]? في|complain|complaint|réclamation|reclamation|plainte|contact (you|us|the team)|تواصل معكم|اريد التواصل|أريد التواصل|بغيت نتواصل|راسل)/i;

const AIChatBot = () => {
  const { lang, users, courses, news, events } = useLanguage();
  const { chatWithGitmai } = useAI();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: 'complaint', message: '' });
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  const defaultModels = [
    { id: 'openrouter/free', name: 'GITM AI', desc: lang === 'ar' ? 'مساعد الابتكار والتكنولوجيا' : 'Innovation & technology assistant' }
  ];

  const [gitmModels, setGitmModels] = useState(defaultModels);
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].id);
  const messagesEndRef = useRef(null);

  useEffect(() => {
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
        } catch (e) { console.error(e); }
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
        setMessages([{ id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً بك! أنا الذكاء الاصطناعي الخاص بمجموعة الابتكار التكنولوجي المغرب (GITM). كيف يمكنني مساعدتك؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() }]);
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
    const defaultMsg = [{ id: 1, sender: 'ai', text: lang === 'ar' ? 'مرحباً! أنا المساعد الذكي لـ GITM. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am the GITM AI Assistant. How can I help you today?', time: new Date() }];
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
    { id: 'complaint', label: lang === 'ar' ? 'تقديم شكوى' : 'Submit a complaint', form: 'complaint' },
  ];

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (sending) return;
    const name = form.name.trim(); const email = form.email.trim(); const message = form.message.trim();
    if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(lang === 'ar' ? 'المرجو إدخال الاسم، بريد إلكتروني صحيح، والرسالة.' : 'Please enter your name, a valid email and a message.');
      return;
    }
    const last = parseInt(localStorage.getItem('gitm_ai_last_msg') || '0', 10);
    if (Date.now() - last < 60000) {
      toast.error(lang === 'ar' ? 'المرجو الانتظار دقيقة قبل إرسال رسالة أخرى.' : 'Please wait a minute before sending another message.');
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name, email,
        subject: form.type === 'complaint' ? 'شكوى (عبر GITM AI)' : 'رسالة تواصل (عبر GITM AI)',
        message,
        type: form.type,
        source: 'ai_chat',
        lang,
        submittedAt: serverTimestamp()
      });
      localStorage.setItem('gitm_ai_last_msg', String(Date.now()));
      setShowForm(false);
      setForm({ name: '', email: '', type: 'complaint', message: '' });
      setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: lang === 'ar' ? `شكراً ${name}، وصلتنا رسالتك وسيراجعها فريق GITM ويتواصل معك عبر ${email}.` : `Thank you ${name}, your message reached the GITM team. They will reply to ${email}.`, time: new Date() }]);
    } catch (err) {
      console.error('Complaint submit failed:', err);
      toast.error(lang === 'ar' ? 'تعذر إرسال الرسالة الآن. حاول لاحقاً أو استعمل صفحة التواصل.' : 'Could not send right now. Try again later or use the contact page.');
    } finally {
      setSending(false);
    }
  };

  const openForm = (type) => {
    setForm(f => ({ ...f, type }));
    setShowForm(true);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (text = input, attachmentMsg = null) => {
    if (isTyping || (!text.trim() && !attachmentMsg)) return;

    const newUserMsg = attachmentMsg || { id: crypto.randomUUID(), sender: 'user', text, time: new Date() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
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

      const globalContext = buildSiteContext({ courses, news, events, users }, lang);

      const aiMsgId = crypto.randomUUID();
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '', time: new Date() }]);

      const responseText = await chatWithGitmai(history, selectedModel, globalContext, (currentText) => {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
      });

      if (!responseText?.trim()) throw new Error('Empty response');
      if (COMPLAINT_RE.test(newUserMsg.text || '')) setShowForm(true);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: responseText } : m));
    } catch {
      setMessages(prev => [...prev.filter(m => m.text || m.image), { id: Date.now(), sender: 'ai', text: lang === 'ar' ? 'عذراً، المساعد الذكي غير متاح حالياً للتحديث. يرجى المحاولة لاحقاً.' : 'Sorry, the AI Assistant is currently offline for updates. Please try again later.', time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="gitm-ai-fab fixed bottom-[88px] md:bottom-6 right-4 md:right-6 rtl:left-4 md:rtl:left-6 rtl:right-auto z-[60] transition-all duration-200">
      {/* Toggle Button (48x48 circular above bottom nav on mobile, pill on desktop) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === 'ar' ? 'مساعد GITM الذكي' : 'GITM AI assistant'}
        aria-expanded={isOpen}
        aria-controls="gitm-ai-panel"
        className="w-12 h-12 md:h-14 p-0 md:px-4 rounded-full md:rounded-2xl md:w-auto flex items-center justify-center gap-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700 dark:border-white shadow-lg transition-colors hover:bg-slate-800 dark:hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        {isOpen ? (
          <X size={20} className="text-white dark:text-slate-900 shrink-0" />
        ) : (
          <BrainCircuit size={20} className="text-white dark:text-slate-900 shrink-0" strokeWidth={2} />
        )}
        <span className="hidden md:inline text-white dark:text-slate-900 text-sm font-semibold tracking-wide" dir="ltr">
          GITM AI
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          id="gitm-ai-panel"
          role="dialog"
          aria-label={lang === 'ar' ? 'مساعد GITM' : 'GITM assistant'}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="fixed inset-0 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:rtl:left-0 sm:rtl:right-auto sm:w-96 sm:h-[500px] sm:min-h-[400px] sm:max-h-[calc(100dvh-120px)] w-full h-full sm:rounded-3xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-2xl border-0 sm:border sm:border-slate-200 sm:dark:border-slate-800 z-[70] sm:origin-bottom-right sm:rtl:origin-bottom-left animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Sparkles size={20} strokeWidth={1.7} />
              </div>
              <div className="flex flex-col min-w-0">
                <select
                  aria-label={lang === 'ar' ? 'نموذج المساعد' : 'Assistant model'}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-white font-sans font-bold tracking-tight drop-shadow-md text-sm outline-none appearance-none cursor-pointer truncate"
                >
                  {gitmModels.map(m => (
                    <option key={m.id} value={m.id} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">
                      {m.name}
                    </option>
                  ))}
                </select>
                <span className="flex items-center gap-1.5 text-xs text-teal-100 font-semibold truncate">
                  {gitmModels.find(m => m.id === selectedModel)?.desc}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={isTyping}
                onClick={clearChat}
                title={lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'}
                aria-label={lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'}
                className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-teal-200 hover:text-white rounded-xl transition-colors sm:p-2"
              >
                <Trash2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={lang === 'ar' ? 'إغلاق المساعد' : 'Close assistant'}
                className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-xl hover:bg-white/10 sm:p-2 focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 scrollbar-none bg-slate-50 dark:bg-[#0f172a]">
            {messages.filter(msg => msg.text || msg.image).map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-teal-500 text-white'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className={`p-3 text-sm leading-relaxed shadow-sm rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                    {msg.image && (
                      <div className="mb-2">
                        <img src={msg.image} alt="Upload preview" className="rounded-xl max-w-full h-auto max-h-40 object-cover" />
                      </div>
                    )}
                    {msg.text && (
                      <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.sender === 'ai' ? renderRichText(msg.text) : msg.text}</div>
                    )}
                  </div>
                  <span className={`text-xs text-slate-500 dark:text-slate-400 ${msg.sender === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {showForm && (
              <form onSubmit={submitComplaint} className="self-stretch bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm">
                <div className="flex gap-2">
                  {['complaint', 'contact'].map(tp => (
                    <button key={tp} type="button" onClick={() => setForm(f => ({ ...f, type: tp }))} className={`flex-1 min-h-[40px] rounded-xl text-xs font-bold ${form.type === tp ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                      {tp === 'complaint' ? (lang === 'ar' ? 'شكوى' : 'Complaint') : (lang === 'ar' ? 'تواصل' : 'Contact')}
                    </button>
                  ))}
                </div>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={80} placeholder={lang === 'ar' ? 'الاسم' : 'Name'} className="min-h-[44px] px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white" />
                <input type="email" dir="ltr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} maxLength={120} placeholder="email@example.com" className="min-h-[44px] px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white" />
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} maxLength={1500} rows={3} placeholder={lang === 'ar' ? 'اكتب رسالتك أو شكواك' : 'Your message'} className="px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white resize-none" />
                <div className="flex gap-2">
                  <button type="submit" disabled={sending} className="flex-1 min-h-[44px] rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold disabled:opacity-60">{sending ? '...' : (lang === 'ar' ? 'إرسال' : 'Send')}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                </div>
              </form>
            )}

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
            <div className="px-4 py-3 filter-scroll border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => (s.form ? openForm(s.form) : handleSend(s.label))}
                  className="min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-900/30 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
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
                className="w-full min-h-[48px] bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-4 pr-36 rtl:pr-4 rtl:pl-36 text-base sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
              />
              <div className="absolute right-1 rtl:left-1 rtl:right-auto flex items-center">
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
                  className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center sm:p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="button"
                  disabled={isTyping || isListening}
                  aria-label={lang === 'ar' ? 'الإدخال الصوتي' : 'Voice input'}
                  onClick={startListening}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center sm:p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'}`}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  aria-label={lang === 'ar' ? 'إرسال' : 'Send'}
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center sm:p-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 disabled:opacity-50 transition-colors"
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

