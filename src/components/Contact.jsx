import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Calendar, Mail, MapPin, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { submitContactForm } from '../utils/contactSubmit';

const contactMemoryFallback = { lastSubmit: null };

const Contact = () => {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitContactForm({
      formData,
      isSubmittingRef,
      getStorage: () => globalThis.localStorage,
      memoryFallback: contactMemoryFallback,
      now: Date.now,
      sendMessage: (payload) =>
        addDoc(collection(db, 'contact_messages'), {
          ...payload,
          submittedAt: serverTimestamp()
        }),
      onRateLimit: () => {
        toast.error(t('contact.rateLimit') || 'Please wait a minute before sending another message.');
      },
      onSending: () => {
        setStatus('sending');
      },
      onSuccess: () => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      },
      onError: (error) => {
        console.error('Error submitting contact form:', error);
        toast.error(t('contact.error') || 'Failed to send message. Please try again later.');
        setStatus('idle');
      }
    });
  };

  return (
    <section
      id="contact"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-14 md:py-24 pb-24 md:pb-24 bg-gitm-light dark:bg-gitm-dark relative overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gitm-textLight dark:text-white mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-20 h-1 bg-gitm-red mx-auto mb-5 md:mb-6" aria-hidden="true"></div>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg font-medium">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-stretch">

          {/* Info Column */}
          <div className="lg:col-span-5 bg-white dark:bg-gitm-cardDark p-5 sm:p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col justify-between overflow-hidden min-w-0">
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gitm-textLight dark:text-white">
                {t('contact.infoTitle')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                {t('contact.infoDesc')}
              </p>

              <div className="space-y-5 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3.5 sm:gap-4 text-gitm-textLight dark:text-white min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gitm-red/10 flex items-center justify-center text-gitm-red shrink-0" aria-hidden="true">
                    <Mail size={22} />
                  </div>
                  <span className="font-bold text-sm sm:text-base md:text-lg break-all min-w-0">
                    {t('contact.officialEmail')}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 sm:gap-4 text-gitm-textLight dark:text-white min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gitm-green/10 flex items-center justify-center text-gitm-green shrink-0" aria-hidden="true">
                    <MapPin size={22} />
                  </div>
                  <span className="font-bold text-sm sm:text-base md:text-lg break-words min-w-0">
                    {t('contact.location')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                aria-label={t('contact.scheduleBtn')}
                onClick={() => {
                  toast.info(lang === 'ar' ? 'جاري التحويل لصفحة المواعيد...' : 'Redirecting to scheduling portal...');
                  window.open('https://cal.com', '_blank');
                }}
                className="w-full min-h-[48px] py-3.5 sm:py-4 px-4 rounded-xl border-2 border-gitm-red text-gitm-red hover:bg-gitm-red hover:text-white font-bold text-base sm:text-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gitm-red focus-visible:ring-offset-2"
              >
                <Calendar size={20} aria-hidden="true" />
                <span>{t('contact.scheduleBtn')}</span>
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-gitm-cardDark p-5 sm:p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gitm-textLight dark:text-white mb-6 sm:mb-8">
              {t('contact.formTitle')}
            </h3>

            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="min-h-[16rem] py-8 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-gitm-green/10 flex items-center justify-center text-gitm-green" aria-hidden="true">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gitm-textLight dark:text-white">
                  {lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-md">
                  {t('contact.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    disabled={status === 'sending'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-3 text-base rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 focus:border-gitm-red focus:ring-2 focus:ring-gitm-red/30 text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={status === 'sending'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-3 text-base rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 focus:border-gitm-red focus:ring-2 focus:ring-gitm-red/30 text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-subject" className="block text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.subject')}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    disabled={status === 'sending'}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-3 text-base rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 focus:border-gitm-red focus:ring-2 focus:ring-gitm-red/30 text-gitm-textLight dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-sm font-bold text-gitm-textLight dark:text-white">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    disabled={status === 'sending'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-base rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 focus:border-gitm-red focus:ring-2 focus:ring-gitm-red/30 text-gitm-textLight dark:text-white transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full min-h-[48px] py-3.5 sm:py-4 px-5 rounded-xl bg-gitm-red hover:bg-red-700 disabled:opacity-70 text-white font-bold text-base sm:text-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gitm-red focus-visible:ring-offset-2"
                >
                  {status === 'sending' ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" aria-hidden="true" />
                      <span>{t('contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} aria-hidden="true" />
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
