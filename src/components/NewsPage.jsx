import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, Tag, ChevronRight, Pin, Bookmark, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TechNewsWidget from './TechNewsWidget';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

const MOCK_NEWS = [
  {
    id: 1,
    title: { en: 'GITM Launches New Tech Hub in Casablanca', ar: 'المجموعة تطلق مركزاً تقنياً جديداً في الدار البيضاء', fr: 'Le GITM lance un nouveau hub technologique à Casablanca', zh: 'GITM在卡萨布兰卡启动新科技中心' },
    summary: { en: 'A state-of-the-art facility to foster innovation and support local startups in the heart of Morocco.', ar: 'منشأة حديثة لتعزيز الابتكار ودعم الشركات الناشئة المحلية في قلب المغرب.', fr: 'Une installation ultramoderne pour favoriser l\'innovation.', zh: '在摩洛哥中心培育创新并支持本地初创企业的最先进设施。' },
    date: '2026-06-18', category: 'Technology', author: 'Dr. Youssef', featured: true, color: 'from-teal-500 to-emerald-600 dark:from-cyan-500 dark:to-blue-600'
  },
  {
    id: 2,
    title: { en: 'Annual Hackathon Winners Announced', ar: 'الإعلان عن الفائزين في الهاكاثون السنوي', fr: 'Annonce des gagnants du Hackathon annuel', zh: '年度黑客马拉松获奖者揭晓' },
    summary: { en: 'Over 500 developers competed in the 48-hour coding marathon. Meet the teams that built the future.', ar: 'تنافس أكثر من 500 مطور في ماراثون البرمجة. تعرف على الفرق.', fr: 'Plus de 500 développeurs ont concouru. Découvrez les équipes.', zh: '超过500名开发者参加了48小时的编程马拉松。' },
    date: '2026-06-10', category: 'Events', author: 'Amina', featured: false, color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 3,
    title: { en: 'AI Academy Fall Intake Opens', ar: 'افتتاح التسجيل الخريفي لأكاديمية الذكاء الاصطناعي', fr: 'Ouverture des inscriptions d\'automne pour l\'Académie IA', zh: 'AI学院秋季招生开始' },
    summary: { en: 'Join our comprehensive 12-week AI training program. Scholarships available for exceptional talents.', ar: 'انضم إلى برنامجنا التدريبي الشامل لمدة 12 أسبوعًا.', fr: 'Rejoignez notre programme de formation complet de 12 semaines en IA.', zh: '加入我们全面的12周人工智能培训计划。' },
    date: '2026-06-05', category: 'Academy', author: 'Prof. Hassan', featured: false, color: 'from-orange-500 to-red-600'
  },
  {
    id: 4,
    title: { en: 'Partnership with Global Tech Giants', ar: 'شراكة مع عمالقة التكنولوجيا العالميين', fr: 'Partenariat avec les géants mondiaux de la technologie', zh: '与全球科技巨头的合作伙伴关系' },
    summary: { en: 'GITM secures strategic partnerships to provide advanced cloud infrastructure to our members.', ar: 'المجموعة تبرم شراكات استراتيجية لتوفير بنية تحتية سحابية متقدمة.', fr: 'Le GITM sécurise des partenariats stratégiques.', zh: 'GITM确保战略合作伙伴关系，为我们的成员提供先进的云基础设施。' },
    date: '2026-05-28', category: 'Partners', author: 'Admin', featured: false, color: 'from-pink-500 to-rose-600'
  },
  {
    id: 5,
    title: { en: 'Web3 and Blockchain Seminar Highlights', ar: 'أبرز محطات ندوة الويب 3 والبلوكتشين', fr: 'Faits saillants du séminaire Web3 et Blockchain', zh: 'Web3和区块链研讨会亮点' },
    summary: { en: 'Key takeaways from our latest seminar on decentralized applications and the future of finance.', ar: 'أهم النقاط المستخلصة من ندوتنا الأخيرة حول التطبيقات اللامركزية.', fr: 'Principaux points à retenir de notre dernier séminaire.', zh: '我们最新关于去中心化应用研讨会的主要收获。' },
    date: '2026-05-20', category: 'Events', author: 'Omar', featured: false, color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 6,
    title: { en: 'New Open Source Contribution Guidelines', ar: 'إرشادات جديدة للمساهمة في المصادر المفتوحة', fr: 'Nouvelles directives de contribution Open Source', zh: '新开源贡献指南' },
    summary: { en: 'We have updated our guidelines to make it easier for developers to contribute to GITM projects.', ar: 'لقد قمنا بتحديث إرشاداتنا لتسهيل مساهمة المطورين.', fr: 'Nous avons mis à jour nos directives pour faciliter les contributions.', zh: '我们更新了指南，使开发者更容易参与GITM项目。' },
    date: '2026-05-15', category: 'Technology', author: 'Dev Team', featured: false, color: 'from-emerald-500 to-green-600'
  },
  {
    id: 7,
    title: { en: 'Empowering Women in Tech Initiative', ar: 'مبادرة تمكين المرأة في مجال التكنولوجيا', fr: 'Initiative pour l\'autonomisation des femmes dans la tech', zh: '赋能科技女性倡议' },
    summary: { en: 'Announcing a new mentorship program aimed at supporting women developers and engineers.', ar: 'الإعلان عن برنامج توجيهي جديد يهدف إلى دعم المطورات والمهندسات.', fr: 'Annonce d\'un nouveau programme de mentorat pour les femmes.', zh: '宣布一项旨在支持女性开发者和工程师的新指导计划。' },
    date: '2026-05-10', category: 'Academy', author: 'Sara', featured: false, color: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 8,
    title: { en: 'Cloud Computing Workshop Success', ar: 'نجاح ورشة عمل الحوسبة السحابية', fr: 'Succès de l\'atelier sur le Cloud Computing', zh: '云计算研讨会取得成功' },
    summary: { en: 'A huge thank you to all participants who made our recent cloud computing workshop a massive success.', ar: 'شكر كبير لجميع المشاركين الذين جعلوا ورشة العمل نجاحاً هائلاً.', fr: 'Un grand merci à tous les participants de notre récent atelier.', zh: '非常感谢所有参与者，是你们让我们最近的研讨会取得了巨大成功。' },
    date: '2026-05-02', category: 'Events', author: 'Dr. Youssef', featured: false, color: 'from-cyan-500 to-sky-600'
  }
];

const CATEGORIES = ['All', 'Technology', 'Events', 'Academy', 'Partners'];

export default function NewsPage() {
  const { lang, news, savedItems, toggleSave } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredNews = news.filter(item => {
    const matchCat = category === 'All' || item.category === category || item.category.toLowerCase() === category.toLowerCase();
    const matchSearch = 
      (item.title_en && item.title_en.toLowerCase().includes(search.toLowerCase())) || 
      (item.title_ar && item.title_ar.includes(search)) ||
      (item.summary_en && item.summary_en.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featuredNews = filteredNews.find(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured).slice(0, visibleCount);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            {txt(lang, 'Latest News', 'آخر الأخبار', 'Dernières Nouvelles', '最新新闻')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {txt(lang, 'Stay updated with the latest innovations, events, and milestones from GITM.', 'ابق على اطلاع بأحدث الابتكارات والأحداث والإنجازات من المجموعة.', 'Restez au courant des dernières innovations, événements et étapes du GITM.', '随时了解GITM的最新创新、活动和里程碑。')}
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCategory(cat); setVisibleCount(5); }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${category === cat ? 'bg-teal-600 dark:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'glass-card hover-lift'}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={txt(lang, 'Search news...', 'ابحث في الأخبار...', 'Rechercher...', '搜索新闻...')}
              className="w-full glass-card py-3 px-12 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-500 text-slate-800 dark:text-white"
            />
            <Search className={`absolute top-3 ${lang === 'ar' ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
          </div>
        </div>

        {/* Global Tech News Widget */}
        <div className="mb-12">
          <TechNewsWidget />
        </div>

        {/* Featured News */}
        <AnimatePresence mode="wait">
          {featuredNews && category === 'All' && !search && (() => {
            const isSaved = savedItems?.news?.some(n => n.id === featuredNews.id);
            return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-16 card-3d glass-card rounded-3xl overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row h-full">
                <div className={`lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-teal-500 to-emerald-600 relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <Pin className="text-white w-20 h-20 opacity-50 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 glass px-4 py-1 rounded-full text-white font-bold text-sm flex items-center gap-2">
                    <Pin size={14} /> {txt(lang, 'Featured', 'مميز', 'En vedette', '精选')}
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-teal-600 dark:text-cyan-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={16}/> {featuredNews.date}</span>
                      <span className="flex items-center gap-1"><Tag size={16}/> {featuredNews.category}</span>
                    </div>
                    <button 
                      onClick={() => toggleSave('news', featuredNews)}
                      className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                    >
                      <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold w-fit">
                    <ShieldCheck size={14} /> {txt(lang, 'Official GITM News', 'خبر رسمي - فريق GITM', 'Officiel GITM', '官方GITM新闻')}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">
                    {lang === 'ar' ? featuredNews.title_ar : featuredNews.title_en}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 line-clamp-3">
                    {lang === 'ar' ? featuredNews.summary_ar : featuredNews.summary_en}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="font-medium">{featuredNews.author}</span>
                    </div>
                    <button className="btn-primary rounded-full px-6 py-2 flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(13,148,136,0.6)] dark:group-hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all">
                      {txt(lang, 'Read More', 'اقرأ المزيد', 'Lire la suite', '阅读更多')} <ChevronRight size={18} className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )})}
        </AnimatePresence>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {regularNews.map((item, idx) => {
              const isSaved = savedItems?.news?.some(n => n.id === item.id);
              return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-3d glass-card rounded-2xl overflow-hidden flex flex-col group relative"
              >
                <div className={`h-32 bg-gradient-to-tr from-blue-500 to-cyan-600 relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500" />
                  <div className="glass px-3 py-1 rounded-full absolute top-4 right-4 text-white text-xs font-bold tracking-wider">
                    {item.category}
                  </div>
                  <div className="glass px-3 py-1 rounded-full absolute top-4 left-4 text-white text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> {txt(lang, 'Official', 'رسمي', 'Officiel', '官方')}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                      <span className="flex items-center gap-1"><User size={14}/> {item.author}</span>
                    </div>
                    <button 
                      onClick={() => toggleSave('news', item)}
                      className={`p-1.5 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-3 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {lang === 'ar' ? item.title_ar : item.title_en}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow line-clamp-3">
                    {lang === 'ar' ? item.summary_ar : item.summary_en}
                  </p>
                  <button className="text-teal-600 dark:text-cyan-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto self-start">
                    {txt(lang, 'Read Article', 'اقرأ المقال', 'Lire l\'article', '阅读文章')} <ChevronRight size={16} className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {regularNews.length < filteredNews.filter(n => !n.featured).length && (
          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="btn-glass px-8 py-3 rounded-full font-orbitron tracking-widest text-sm uppercase"
            >
              {txt(lang, 'Load More', 'تحميل المزيد', 'Charger plus', '加载更多')}
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
}
