import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Calendar, Mail, MapPin, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    const lastSubmit = localStorage.getItem('lastContactSubmit');
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
      toast.error(t('contact.rateLimit') || 'Please wait a minute before sending another message.');
      return;
    }

    try {
      setStatus('sending');
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        submittedAt: serverTimestamp()
      });
      localStorage.setItem('lastContactSubmit', Date.now().toString());
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(t('contact.error') || 'Failed to send message. Please try again later.');
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-24 bg-gitm-light dark:bg-gitm-dark relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gitm-textLight dark:text-white mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-20 h-1 bg-gitm-red mx-auto mb-6"></div>
          <p className="text-gitm-mutedLight dark:text-gitm-mutedDark text-lg font-medium">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Info Column */}
          <div className="lg:col-span-5 bg-white dark:bg-gitm-cardDark p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white">
                {t('contact.infoTitle')}
              </h3>
              <p className="text-gitm-mutedLight dark:text-gitm-mutedDark font-medium">
                {t('contact.infoDesc')}
              </p>

              <div className="space-y-6 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-gitm-textLight dark:text-white">
                  <div className="w-12 h-12 rounded-xl bg-gitm-red/10 flex items-center justify-center text-gitm-red shrink-0">
                    <Mail size={24} />
                  </div>
                  <span className="font-bold text-base md:text-lg">{t('contact.officialEmail')}</span>
                </div>
                
                <div className="flex items-center gap-4 text-gitm-textLight dark:text-white">
                  <div className="w-12 h-12 rounded-xl bg-gitm-green/10 flex items-center justify-center text-gitm-green shrink-0">
                    <MapPin size={24} />
                  </div>
                  <span className="font-bold text-base md:text-lg">{t('contact.location')}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={() => {
                  toast.info(lang === 'ar' ? 'جاري التحويل لصفحة المواعيد...' : 'Redirecting to scheduling portal...');
                  window.open('https://cal.com', '_blank');
                }}
                className="w-full py-4 rounded-xl border-2 border-gitm-red text-gitm-red hover:bg-gitm-red hover:text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                <span>{t('contact.scheduleBtn')}</span>
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-gitm-cardDark p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gitm-textLight dark:text-white mb-8">
              {t('contact.formTitle')}
            </h3>

            {status === 'success' ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gitm-green/10 flex items-center justify-center text-gitm-green">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-2xl font-bold text-gitm-textLight dark:text-white">
                  {lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully'}
                </h4>
                <p className="text-gitm-mutedLight dark:text-gitm-mutedDark">
                  {t('contact.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.name')}
                  </label>
                  <input 
                    type="text" required disabled={status === 'sending'}
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-gitm-red focus:ring-1 focus:ring-gitm-red text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.email')}
                  </label>
                  <input 
                    type="email" required disabled={status === 'sending'}
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-gitm-red focus:ring-1 focus:ring-gitm-red text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.subject')}
                  </label>
                  <input 
                    type="text" disabled={status === 'sending'}
                    value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-gitm-red focus:ring-1 focus:ring-gitm-red text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.message')}
                  </label>
                  <textarea 
                    rows={4} required disabled={status === 'sending'}
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-gitm-red focus:ring-1 focus:ring-gitm-red text-gitm-textLight dark:text-white transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={status === 'sending'}
                  className="w-full py-4 rounded-xl bg-gitm-red hover:bg-red-700 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      <span>{t('contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>{t('contact.submit')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
