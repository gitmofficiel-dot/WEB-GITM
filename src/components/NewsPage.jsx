import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ChevronRight, User, Hash } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MOCK_NEWS = [
  {
    id: 1,
    title: { en: 'GITM Partners with OCP for AI Solutions', fr: 'GITM en partenariat avec OCP pour des solutions IA', ar: 'GITM تتعاون مع OCP لحلول الذكاء الاصطناعي' },
    summary: { 
      en: 'Groupe Innovation Technologique Maroc signs a strategic MOU with OCP Group to develop sustainable AI models for agriculture.', 
      fr: 'Le Groupe Innovation Technologique Maroc signe un protocole d\'accord stratégique avec le Groupe OCP pour développer des modèles d\'IA durables pour l\'agriculture.', 
      ar: 'مجموعة الابتكار التكنولوجي المغرب توقع مذكرة تفاهم استراتيجية مع مجموعة OCP لتطوير نماذج ذكاء اصطناعي مستدامة للزراعة.' 
    },
    date: '2026-06-15',
    author: 'Amine B.',
    category: 'Partnership',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  },
  {
    id: 2,
    title: { en: 'UM5 Hackathon Winners Announced', fr: 'Annonce des gagnants du Hackathon UM5', ar: 'الإعلان عن الفائزين في هاكاثون جامعة محمد الخامس' },
    summary: { 
      en: 'Our GITM members successfully secured the first prize at the recent UM5 AI & Web3 Hackathon with their decentralized voting app.', 
      fr: 'Nos membres GITM ont remporté le premier prix lors du récent Hackathon IA & Web3 de l\'UM5 avec leur application de vote décentralisée.', 
      ar: 'نجح أعضاء GITM في الحصول على الجائزة الأولى في هاكاثون الذكاء الاصطناعي و Web3 الأخير لجامعة محمد الخامس من خلال تطبيق التصويت اللامركزي.' 
    },
    date: '2026-05-28',
    author: 'Sara M.',
    category: 'Achievement',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'
  },
  {
    id: 3,
    title: { en: 'Launch of Darija NLP Model', fr: 'Lancement du modèle NLP Darija', ar: 'إطلاق نموذج NLP للدارجة' },
    summary: { 
      en: 'GITM unveils a new open-source NLP model trained specifically on Moroccan Darija, achieving state-of-the-art accuracy.', 
      fr: 'Le GITM dévoile un nouveau modèle NLP open-source formé spécifiquement sur la Darija marocaine, atteignant une précision de pointe.', 
      ar: 'GITM تكشف عن نموذج NLP جديد مفتوح المصدر مدرب خصيصًا على الدارجة المغربية، محققًا دقة غير مسبوقة.' 
    },
    date: '2026-04-10',
    author: 'Youssef K.',
    category: 'Release',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'
  }
];

export default function NewsPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen grid-bg py-24 px-6 md:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-teal-500/30 mb-6"
          >
            <Newspaper className="w-5 h-5 text-teal-400" />
            <span className="font-orbitron text-teal-300 font-medium tracking-wide">
              {lang === 'ar' ? 'الأخبار والتحديثات' : lang === 'fr' ? 'Actualités' : 'News & Updates'}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-orbitron gradient-text"
          >
            {lang === 'ar' ? 'أحدث الإعلانات' : lang === 'fr' ? 'Dernières Annonces' : 'Latest Announcements'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {lang === 'ar' ? 'ابق على اطلاع بآخر أخبار التكنولوجيا والشراكات وإنجازات فريقنا في المغرب.' : 
             lang === 'fr' ? 'Restez informé de nos dernières actualités technologiques, partenariats et réalisations au Maroc.' : 
             'Stay updated with our latest tech news, partnerships, and achievements in Morocco.'}
          </motion.p>
        </div>

        {/* News Feed */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {MOCK_NEWS.map((news, index) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover-lift card-3d p-1 rounded-2xl overflow-hidden group border border-slate-700/50 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-slate-900/50">
                <div className="w-full md:w-1/3 h-48 md:h-auto rounded-xl overflow-hidden relative">
                  <img src={news.image} alt="news" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-teal-500/30 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-teal-400" />
                    <span className="text-xs font-medium text-teal-300">{news.category}</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3 font-orbitron group-hover:text-teal-300 transition-colors">
                      {news.title[lang] || news.title.en}
                    </h2>
                    <p className="text-slate-400 mb-6 line-clamp-3">
                      {news.summary[lang] || news.summary.en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-slate-700/50 pt-4">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-teal-500"/> {news.date}</span>
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-teal-500"/> {news.author}</span>
                    </div>
                    <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
                      {lang === 'ar' ? 'اقرأ المزيد' : lang === 'fr' ? 'Lire la suite' : 'Read Article'}
                      <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
