import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Calendar, Mail, MapPin, CheckCircle, RefreshCw } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-black/30 border-t border-white/5">
      {/* Background glow orbs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse-glow -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('contact.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-muted text-sm md:text-base">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Column 1: Info & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl glass-cyan border border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-white font-orbitron">
                {t('contact.infoTitle')}
              </h3>
              <p className="text-sm text-cyber-muted leading-relaxed">
                {t('contact.infoDesc')}
              </p>

              {/* Direct Info list */}
              <div className="space-y-4 pt-4 text-xs md:text-sm font-semibold">
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse text-white">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Mail size={16} />
                  </div>
                  <span>{t('contact.officialEmail')}</span>
                </div>
                
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse text-white">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MapPin size={16} />
                  </div>
                  <span>{t('contact.location')}</span>
                </div>
              </div>
            </div>

            {/* Direct Meeting Scheduler CTA */}
            <div className="border-t border-white/5 pt-6 mt-8">
              <button 
                onClick={() => alert('Redirecting to secure scheduling portal (Cal.com/GITM)...')}
                className="w-full py-4 px-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-3 rtl:space-x-reverse hover:shadow-glow-cyan"
              >
                <Calendar size={16} className="animate-float" />
                <span>{t('contact.scheduleBtn')}</span>
              </button>
            </div>

          </div>

          {/* Column 2: Interactive Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-2xl glass border border-white/5 relative">
            <h3 className="text-lg md:text-xl font-bold text-white mb-6 font-orbitron">
              {t('contact.formTitle')}
            </h3>

            {status === 'success' ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 shadow-glow-emerald">
                  <CheckCircle size={40} className="animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                  TRANSMISSION COMPLETE
                </h4>
                <p className="text-xs md:text-sm text-cyber-muted max-w-sm">
                  {t('contact.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
                  <label className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider">
                    {t('contact.name')}
                  </label>
                  <input 
                    type="text"
                    required
                    disabled={status === 'sending'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/5 focus:border-emerald-500/40 text-white text-xs md:text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
                  <label className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider">
                    {t('contact.email')}
                  </label>
                  <input 
                    type="email"
                    required
                    disabled={status === 'sending'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/5 focus:border-emerald-500/40 text-white text-xs md:text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
                  <label className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider">
                    {t('contact.subject')}
                  </label>
                  <input 
                    type="text"
                    disabled={status === 'sending'}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/5 focus:border-emerald-500/40 text-white text-xs md:text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
                  <label className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider">
                    {t('contact.message')}
                  </label>
                  <textarea 
                    rows={4}
                    required
                    disabled={status === 'sending'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/5 focus:border-emerald-500/40 text-white text-xs md:text-sm transition-all focus:outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-glow-emerald text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 rtl:space-x-reverse"
                >
                  {status === 'sending' ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{t('contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
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
