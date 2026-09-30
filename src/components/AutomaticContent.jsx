import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const labels = {
  ar: { morocco: 'المغرب', world: 'العالم', news: 'أخبار وطنية وعالمية', events: 'فعاليات وطنية وعالمية', intro: 'تحديث تلقائي كل 15 دقيقة أثناء التصفح · مقتطفات من المصادر الأصلية', loading: 'جارٍ جلب المحتوى…', error: 'تعذّر تحديث المحتوى. حاول مجددًا.', retry: 'إعادة المحاولة', empty: 'لا توجد نتائج متاحة من المصدر حاليًا.', search: 'ابحث بالعنوان أو المكان…', read: 'التفاصيل لدى المصدر', updated: 'آخر تحديث', image: 'لم يوفّر المصدر صورة', noSummary: 'لم يوفّر المصدر ملخصًا. يمكنك قراءة التفاصيل عبر الرابط.', eventNote: 'المواعيد حسب دليل الفعاليات؛ تحقق لدى المنظم قبل التسجيل. قد تكون تغطية المغرب محدودة.', source: 'المصدر', more: 'عرض المزيد' },
  en: { morocco: 'Morocco', world: 'World', news: 'National & world news', events: 'National & world events', intro: 'Automatically refreshes every 15 minutes while browsing · Source excerpts', loading: 'Loading content…', error: 'Could not refresh content. Please try again.', retry: 'Retry', empty: 'No results currently available from the source.', search: 'Search titles or locations…', read: 'Details at source', updated: 'Last updated', image: 'No image provided', noSummary: 'No summary provided. Read the details at the source.', eventNote: 'Dates are supplied by the event directory; confirm with the organizer before registering. Morocco coverage may be limited.', source: 'Source', more: 'Show more' },
  fr: { morocco: 'Maroc', world: 'Monde', news: 'Actualités nationales et mondiales', events: 'Événements nationaux et mondiaux', intro: 'Actualisation automatique toutes les 15 minutes pendant la consultation · Extraits des sources', loading: 'Chargement…', error: 'Actualisation impossible. Réessayez.', retry: 'Réessayer', empty: 'Aucun résultat disponible auprès de la source.', search: 'Rechercher un titre ou un lieu…', read: 'Détails à la source', updated: 'Dernière mise à jour', image: 'Aucune image fournie', noSummary: 'Aucun résumé fourni. Consultez la source.', eventNote: 'Dates fournies par l’annuaire : vérifiez auprès de l’organisateur avant toute inscription. La couverture du Maroc peut être limitée.', source: 'Source', more: 'Afficher plus' },
};

function SourceImage({ src, title, fallback }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <img src={src} alt={title} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="w-full aspect-video object-cover" /> :
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 text-slate-500 text-sm">{fallback}</div>;
}

export default function AutomaticContent({ kind }) {
  const { lang } = useLanguage();
  const t = labels[lang] || labels.en;
  const [scope, setScope] = useState('morocco');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(9);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ key: '', items: [], loading: true, error: false, updatedAt: null });
  const key = `${kind}:${scope}`;

  useEffect(() => {
    let disposed = false;
    let activeController;
    async function refresh() {
      activeController?.abort();
      activeController = new AbortController();
      const timeout = setTimeout(() => activeController.abort(), 40000);
      try {
        const response = await fetch(`/api/content?kind=${kind}&scope=${scope}`, { signal: activeController.signal });
        if (!response.ok) throw new Error('Feed unavailable');
        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error('Invalid feed');
        if (!disposed) setState({ key, items: data.items, updatedAt: data.updatedAt, loading: false, error: Boolean(data.partial) });
      } catch {
        if (!disposed) setState(previous => ({ key, items: previous.key === key ? previous.items : [], updatedAt: previous.key === key ? previous.updatedAt : null, loading: false, error: true }));
      } finally { clearTimeout(timeout); }
    }
    refresh();
    const interval = setInterval(refresh, 15 * 60 * 1000);
    return () => { disposed = true; activeController?.abort(); clearInterval(interval); };
  }, [kind, scope, key, attempt]);

  const current = state.key === key;
  const items = current ? state.items.filter(item => `${item.title} ${item.summary} ${item.location || ''}`.toLowerCase().includes(query.toLowerCase())) : [];
  const date = value => new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB');

  return <section className="mb-14 rounded-3xl border border-cyan-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 p-4 md:p-7" dir={lang === 'ar' ? 'rtl' : 'ltr'} aria-label={t[kind]}>
    <h2 className="text-2xl font-bold mb-2">{t[kind]}</h2>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t.intro}</p>
    <div className="flex flex-wrap gap-3 items-center mb-5">
      {['morocco', 'world'].map(value => <button key={value} type="button" aria-pressed={scope === value} onClick={() => { setScope(value); setLimit(9); setQuery(''); }} className={`px-5 py-2 rounded-xl font-bold ${scope === value ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{t[value]}</button>)}
      <input type="search" aria-label={t.search} placeholder={t.search} value={query} onChange={event => { setQuery(event.target.value); setLimit(9); }} className="min-w-0 flex-1 basis-56 p-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800" />
    </div>
    {kind === 'events' && <p className="text-sm text-slate-500 mb-4">{t.eventNote}</p>}
    {current && state.updatedAt && <p className="text-xs text-slate-500 mb-4">{t.updated}: {new Date(state.updatedAt).toLocaleString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB')}</p>}
    {current && state.error && <div role="alert" className="p-4 mb-4 rounded-xl bg-amber-50 text-amber-900">{t.error} <button className="underline font-bold px-2" onClick={() => setAttempt(value => value + 1)}>{t.retry}</button></div>}
    {!current || state.loading ? <p role="status" className="py-8 text-center">{t.loading}</p> : <>
      {!items.length && !state.error && <p role="status" className="py-8 text-center text-slate-500">{t.empty}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.slice(0, limit).map(item => <article key={item.id} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col shadow-sm">
          <SourceImage key={item.image} src={item.image} title={item.title} fallback={t.image} />
          <div className="p-5 flex flex-col flex-1 gap-3">
            <p className="text-xs text-teal-700 dark:text-teal-300">{t.source}: <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{item.source}</a>{item.date && <> · <time dateTime={item.date}>{date(item.date)}</time></>}</p>
            <h3 className="text-lg font-bold" dir="auto">{item.title}</h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300" dir="auto">{(lang === 'ar' && item.summaryAr) || item.summary || t.noSummary}</p>
            {item.license && <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 underline">{item.license} · {lang === 'ar' ? 'بيانات منسقة ومختصرة' : 'Formatted and summarized data'}</a>}
            {item.location && <p className="text-sm text-slate-500" dir="auto">{item.location}</p>}
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-3 font-bold text-teal-700 dark:text-teal-300 underline underline-offset-4">{t.read}<span className="sr-only">: {item.title}</span></a>
          </div>
        </article>)}
      </div>
      {items.length > limit && <button className="block mx-auto mt-6 px-6 py-2 rounded-xl bg-teal-600 text-white" onClick={() => setLimit(value => value + 9)}>{t.more}</button>}
    </>}
  </section>;
}
