import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Play, Clipboard, Code, ShieldCheck, ChevronRight, Layers } from 'lucide-react';

const Methodology = () => {
  const { t, lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const stepsData = t('methodology.steps');
  
  const stepIcons = [Clipboard, Code, ShieldCheck, Layers];

  return (
    <section id="methodology" className="py-24 relative overflow-hidden bg-black/20 border-y border-white/5">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('methodology.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-muted text-sm md:text-base">
            {t('methodology.subtitle')}
          </p>
        </div>

        {/* Interactive Step-by-Step Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Vertical Selector List */}
          <div className="lg:col-span-5 space-y-4">
            {stepsData.map((step, idx) => {
              const StepIcon = stepIcons[idx];
              const isActive = activeStep === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-right rtl:text-right ltr:text-left flex items-center space-x-4 rtl:space-x-reverse p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'glass-emerald border-emerald-500/30 shadow-glow-emerald bg-emerald-500/10'
                      : 'border-white/5 bg-black/20 text-cyber-muted hover:border-white/10 hover:text-white'
                  }`}
                >
                  {/* Step Number */}
                  <span className={`font-mono text-2xl font-black ${
                    isActive ? 'text-emerald-400' : 'text-cyber-muted/40'
                  }`}>
                    {step.num}
                  </span>
                  
                  {/* Divider */}
                  <div className={`w-[1px] h-8 ${isActive ? 'bg-emerald-500/30' : 'bg-white/5'}`}></div>
                  
                  {/* Icon & Title */}
                  <div className="flex-1 flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-white/5 text-cyber-muted'}`}>
                      <StepIcon size={16} />
                    </div>
                    <span className="font-bold text-xs md:text-sm truncate text-white">
                      {step.title}
                    </span>
                  </div>

                  <ChevronRight size={16} className={`text-cyber-muted/40 transition-transform ${
                    isActive ? 'rotate-90 text-emerald-400' : ''
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Viewport */}
          <div className="lg:col-span-7 p-8 rounded-2xl glass border border-white/5 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Background scanner line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-emerald-500/20 shadow-[0_0_15px_#10b981] animate-float opacity-30"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Phase {stepsData[activeStep].num}
                </span>
                <span className="font-mono text-[10px] text-cyber-muted">
                  PROCESS_ENGINEERING_RUNNING
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white mb-4">
                {stepsData[activeStep].title}
              </h3>
              
              <p className="text-cyber-muted text-sm md:text-base leading-relaxed mb-6">
                {stepsData[activeStep].desc}
              </p>
            </div>

            {/* Phase Core Deliverables Specifications */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <span className="text-white font-bold block border-b border-white/5 pb-1.5 uppercase tracking-wider font-orbitron text-[10px]">
                {lang === 'ar' ? 'المخرجات الأساسية لهذه المرحلة الهندسية' : 'Core Phase Deliverables'}
              </span>
              <ul className="space-y-1.5 text-[11px] text-cyber-muted font-sans list-disc list-inside">
                {activeStep === 0 && (
                  <>
                    <li>{lang === 'ar' ? 'تقرير التصميم المعماري المتكامل للنظام' : 'Integrated System Architectural Design Report'}</li>
                    <li>{lang === 'ar' ? 'مخطط تدفق البيانات ونمذجة الشبكة' : 'Data Flow Network Topology Mapping'}</li>
                    <li>{lang === 'ar' ? 'تحديد مواصفات العتاد وتقدير الميزانية التقنية' : 'Hardware Component BOM & Power Budget Calculation'}</li>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <li>{lang === 'ar' ? 'ملفات تصنيع الدوائر المطبوعة (Gerber Files)' : 'Multi-layer PCB Design Fabrication Files (Gerber)'}</li>
                    <li>{lang === 'ar' ? 'مستودعات الشيفرة البرمجية للمتحكمات الدقيقة' : 'Microcontroller Firmware Code Repositories'}</li>
                    <li>{lang === 'ar' ? 'أوزان ونماذج الذكاء الاصطناعي المهيأة للعمل محلياً' : 'Optimized Neural Net Models for Local Inference'}</li>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <li>{lang === 'ar' ? 'تقارير اختبار الجهد والمحاكاة البيئية' : 'Physical Stress & Environment Simulation Logs'}</li>
                    <li>{lang === 'ar' ? 'مصفوفات معايرة الحساسات الميدانية' : 'Field Sensor Calibration Matrices'}</li>
                    <li>{lang === 'ar' ? 'شهادة ضمان الجودة وتكامل البرمجيات والعتاد' : 'QA Quality Integration & Compliance Sheet'}</li>
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    <li>{lang === 'ar' ? 'النشر الفعلي في البيئة التشغيلية' : 'Production-Ready System Launch'}</li>
                    <li>{lang === 'ar' ? 'قنوات التحديث اللاسلكي الآمن (OTA Update Paths)' : 'Secure OTA Wireless Firmware Update Channels'}</li>
                    <li>{lang === 'ar' ? 'تفعيل رابط المراقبة الحية وبث المؤشرات السحابي' : 'Live telemetry Dashboard Cloud Connections'}</li>
                  </>
                )}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Methodology;
