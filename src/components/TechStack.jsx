import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Cpu, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';

const TechStack = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'software',
      title: t('tech.categories.software'),
      icon: Globe,
      color: 'from-blue-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/20',
      textColor: 'text-indigo-400',
      items: t('tech.items.software')
    },
    {
      id: 'hardware',
      title: t('tech.categories.hardware'),
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
      items: t('tech.items.hardware')
    },
    {
      id: 'ai',
      title: t('tech.categories.ai'),
      icon: Brain,
      color: 'from-cyan-500/20 to-sky-500/5',
      borderColor: 'border-cyan-500/20',
      textColor: 'text-cyan-400',
      items: t('tech.items.ai')
    }
  ];

  return (
    <section id="tech" className="py-24 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('tech.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-muted text-sm md:text-base">
            {t('tech.subtitle')}
          </p>
        </div>

        {/* Tech Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div 
                key={cat.id}
                className={`p-8 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.borderColor} hover:border-white/10 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                    <div className={`p-2.5 rounded-xl bg-[#e0fcfc]/5 ${cat.textColor}`}>
                      <CatIcon size={22} className="animate-float" />
                    </div>
                    <h3 className="text-md md:text-lg font-bold text-white tracking-wide">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-4 text-xs md:text-sm text-cyber-muted">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 rtl:space-x-reverse">
                        <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${cat.textColor}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exclusions & Scope Boundary Box */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl glass border border-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.03)] relative overflow-hidden">
          {/* Subtle warning glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-5 rtl:space-x-reverse">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 flex-shrink-0">
              <ShieldAlert size={24} className="animate-pulse" />
            </div>
            <div className="text-center md:text-right rtl:text-right ltr:text-left">
              <h4 className="text-sm font-bold text-white font-orbitron tracking-wider uppercase mb-1.5 flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                <span className="text-red-400">⛔</span>
                <span>{t('tech.boundaryTitle')}</span>
              </h4>
              <p className="text-xs md:text-sm text-cyber-muted leading-relaxed">
                {t('tech.boundaryDesc')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechStack;
