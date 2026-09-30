import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsOfService() {
  const { lang } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 glass rounded-2xl mt-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-cyan-400">
        {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
      </h1>
      
      <div className="space-y-6 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '1. القبول' : '1. Acceptance'}
          </h2>
          <p>
            {lang === 'ar' 
              ? 'باستخدامك لموقع GITM، فإنك توافق على الامتثال لهذه الشروط. إذا كنت لا توافق على أي منها، يُرجى عدم استخدام خدماتنا.'
              : 'By using the GITM website, you agree to comply with these terms. If you do not agree, please do not use our services.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '2. السلوك' : '2. Conduct'}
          </h2>
          <p>
            {lang === 'ar'
              ? 'يُتوقع من جميع الأعضاء والمستخدمين التصرف باحترام. لا يُسمح بإرسال رسائل آلية (سبام) عبر نماذج التواصل أو إساءة استخدام المنصة بأي شكل.'
              : 'All members and users are expected to behave respectfully. Sending automated messages (spam) via contact forms or abusing the platform in any way is strictly prohibited.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '3. الحسابات' : '3. Accounts'}
          </h2>
          <p>
            {lang === 'ar'
              ? 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك. نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.'
              : 'You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend or terminate accounts that violate these terms.'}
          </p>
        </section>
      </div>
    </div>
  );
}
