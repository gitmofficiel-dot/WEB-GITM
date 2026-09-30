import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 glass rounded-2xl mt-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-cyan-400">
        {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
      </h1>
      
      <div className="space-y-6 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '1. جمع البيانات' : '1. Data Collection'}
          </h2>
          <p>
            {lang === 'ar' 
              ? 'نقوم بجمع البيانات الشخصية التي تقدمها طواعية عند التسجيل أو استخدام نموذج الاتصال الخاص بنا (مثل الاسم، البريد الإلكتروني، الرسائل). هذه البيانات تُستخدم حصرياً لإدارة حسابك والرد على استفساراتك.' 
              : 'We collect personal data that you voluntarily provide when registering or using our contact form (e.g., name, email, messages). This data is strictly used to manage your account and respond to inquiries.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '2. استخدام البيانات' : '2. Data Usage'}
          </h2>
          <p>
            {lang === 'ar'
              ? 'تُستخدم بيانات التسجيل لمنحك الصلاحيات المناسبة داخل لوحات التحكم. لا نقوم ببيع أو مشاركة بياناتك مع أطراف ثالثة دون موافقتك الصريحة، باستثناء ما يفرضه القانون.'
              : 'Registration data is used to grant appropriate permissions within our dashboards. We do not sell or share your data with third parties without your explicit consent, unless required by law.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {lang === 'ar' ? '3. أمن البيانات' : '3. Data Security'}
          </h2>
          <p>
            {lang === 'ar'
              ? 'نتخذ تدابير أمنية صارمة، بما في ذلك التشفير وتحديد الصلاحيات، لحماية بياناتك من الوصول غير المصرح به.'
              : 'We implement strict security measures, including encryption and access controls, to protect your data from unauthorized access.'}
          </p>
        </section>
      </div>
    </div>
  );
}
