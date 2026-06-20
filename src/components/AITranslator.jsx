import React, { useState } from 'react';

const AITranslator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  // اللغات المدعومة في الأداة
  const languages = [
    { code: 'en', name: 'الإنجليزية' },
    { code: 'fr', name: 'الفرنسية' },
    { code: 'es', name: 'الإسبانية' },
    { code: 'de', name: 'الألمانية' },
    { code: 'ja', name: 'اليابانية' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      // الاتصال بواجهة MyMemory المجانية (من العربية إلى اللغة المحددة)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=ar|${targetLang}`
      );
      const data = await response.json();
      
      if (data.responseData) {
        setTranslatedText(data.responseData.translatedText);
      }
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslatedText("حدث خطأ أثناء الاتصال بخادم الترجمة.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-[#F0F6F6] shadow-lg max-w-2xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#00E5FF]">المترجم الهندسي</h3>
        <span className="text-2xl">🌍</span>
      </div>

      <div className="space-y-4">
        {/* حقل إدخال النص الأصلي */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">النص بالعربية:</label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#0B132B]/50 border border-[#3A506B] rounded-lg p-3 text-white focus:outline-none focus:border-[#00FF87] transition-colors"
            rows="3"
            placeholder="اكتب النص التقني هنا..."
          ></textarea>
        </div>

        {/* خيارات الترجمة */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full md:w-1/3 bg-[#0B132B] border border-[#3A506B] rounded-lg p-2 text-white focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <button 
            onClick={handleTranslate}
            disabled={isLoading || !inputText}
            className="w-full md:w-2/3 bg-[#3A506B] hover:bg-[#00E5FF] hover:text-[#0B132B] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-2 font-bold transition-all duration-300"
          >
            {isLoading ? 'جاري المعالجة...' : 'ترجم النص'}
          </button>
        </div>

        {/* حقل عرض النتيجة */}
        {translatedText && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <label className="block text-sm text-gray-400 mb-2">النتيجة:</label>
            <div className="w-full bg-[#0B132B]/80 border border-[#00E5FF]/30 rounded-lg p-4 text-[#00FF87] min-h-[50px]">
              {translatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITranslator;
