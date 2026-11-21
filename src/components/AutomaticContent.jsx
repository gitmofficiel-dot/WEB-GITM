import { useEffect, useState } from 'react';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const labels = {
  ar: { morocco: 'المغرب', world: 'العالم', news: 'أخبار وطنية وعالمية', events: 'فعاليات وطنية وعالمية', intro: 'تحديث تلقائي كل 15 دقيقة أثناء التصفح · مقتطفات من المصادر الأصلية', loading: 'جارٍ جلب المحتوى…', error: 'تعذّر تحديث المحتوى. حاول مجددًا.', retry: 'إعادة المحاولة', empty: 'لا توجد نتائج متاحة من المصدر حاليًا.', search: 'ابحث بالعنوان أو المكان…', read: 'التفاصيل لدى المصدر', updated: 'آخر تحديث', image: 'لم يوفّر المصدر صورة', noSummary: 'لم يوفّر المصدر ملخصًا. يمكنك قراءة التفاصيل عبر الرابط.', eventNote: 'المواعيد حسب دليل الفعاليات؛ تحقق لدى المنظم قبل التسجيل. قد تكون تغطية المغرب محدودة.', source: 'المصدر', more: 'عرض المزيد' },
  en: { morocco: 'Morocco', world: 'World', news: 'National & world news', events: 'National & world events', intro: 'Automatically refreshes every 15 minutes while browsing · Source excerpts', loading: 'Loading content…', error: 'Could not refresh content. Please try again.', retry: 'Retry', empty: 'No results currently available from the source.', search: 'Search titles or locations…', read: 'Details at source', updated: 'Last updated', image: 'No image provided', noSummary: 'No summary provided. Read the details at the source.', eventNote: 'Dates are supplied by the event directory; confirm with the organizer before registering. Morocco coverage may be limited.', source: 'Source', more: 'Show more' },
  fr: { morocco: 'Maroc', world: 'Monde', news: 'Actualités nationales et mondiales', events: 'Événements nationaux et mondiaux', intro: 'Actualisation automatique toutes les 15 minutes pendant la consultation · Extraits des sources', loading: 'Chargement…', error: 'Actualisation impossible. Réessayez.', retry: 'Réessayer', empty: 'Aucun résultat disponible auprès de la source.', search: 'Rechercher un titre ou un lieu…', read: 'Détails à la source', updated: 'Dernière mise à jour', image: 'Aucune image fournie', noSummary: 'Aucun résumé fourni. Consultez la source.', eventNote: 'Dates fournies par l’annuaire : vérifiez auprès de l’organisateur avant toute inscription. La couverture du Maroc peut être limitée.', source: 'Source', more: 'Afficher plus' },
};

function SourceImage({ src, title, fallback, kind }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const Icon = kind === 'events' ? Calendar : Newspaper;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/20 dark:from-teal-950/60 dark:via-slate-800 dark:to-cyan-950/50">
      {!loaded && !failed && src && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      {src && !failed ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-teal-700 dark:text-cyan-300" title={fallback}>
          <div className="w-12 h-12 rounded-2xl bg-white/85 dark:bg-slate-900/80 flex items-center justify-center shadow-sm border border-teal-200/70 dark:border-cyan-500/30">
            <Icon size={26} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AutomaticContent({ kind }) {
  const { lang } = useLanguage();
  const t = labels[lang] || labels.en;
  const heading = kind === 'news'
    ? ({ ar: 'أخبار التكنولوجيا والبيئة', fr: 'Actualités technologie et environnement', en: 'Technology & environment news' }[lang] || 'Technology & environment news')
    : t[kind];
  const topicLabels = {
    ar: { technology: 'تكنولوجيا', environment: 'بيئة' },
    fr: { technology: 'Technologie', environment: 'Environnement' },
    en: { technology: 'Technology', environment: 'Environment' }
  };
  const [scope, setScope] = useState('morocco');
  const [topic, setTopic] = useState('all');
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
        const response = await fetch(`/api/content?kind=${kind}&scope=${scope}${kind === 'news' ? '&edition=tech-environment-v1' : ''}`, { signal: activeController.signal });
        if (!response.ok) throw new Error('Feed unavailable');
        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error('Invalid feed');
        const relevantItems = kind === 'news' ? data.items.filter(item => ['technology', 'environment'].includes(item.topic)) : data.items;
        if (!disposed) setState({ key, items: relevantItems, updatedAt: data.updatedAt, loading: false, error: Boolean(data.partial) });
      } catch {
        if (!disposed) setState(previous => ({ key, items: previous.key === key ? previous.items : [], updatedAt: previous.key === key ? previous.updatedAt : null, loading: false, error: true }));
      } finally { clearTimeout(timeout); }
    }
    refresh();
    const interval = setInterval(refresh, 15 * 60 * 1000);
    return () => { disposed = true; activeController?.abort(); clearInterval(interval); };
  }, [kind, scope, key, attempt]);

  const current = state.key === key;
  const items = current
    ? state.items.filter(item => (kind !== 'news' || topic === 'all' || item.topic === topic) && `${item.title} ${item.summary} ${item.location || ''}`.toLowerCase().includes(query.toLowerCase()))
    : [];
  const date = value => new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB');

  return (
    <section
      className="mb-10 md:mb-14 rounded-2xl md:rounded-3xl border border-cyan-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 p-4 md:p-7"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      aria-label={heading}
    >
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{heading}</h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{t.intro}</p>

      {/* Scope Tabs (Equal width on mobile) + Search */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch sm:items-center mb-4 md:mb-5">
        <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
          {['morocco', 'world'].map(value => (
            <button
              key={value}
              type="button"
              aria-pressed={scope === value}
              onClick={() => { setScope(value); setLimit(9); setQuery(''); }}
              className={`min-h-[44px] px-4 md:px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                scope === value
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t[value]}
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label={t.search}
          placeholder={t.search}
          value={query}
          onChange={event => { setQuery(event.target.value); setLimit(9); }}
          className="min-w-0 w-full sm:w-auto sm:flex-1 sm:basis-56 min-h-[48px] sm:min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </div>

      {/* Scrollable Topic Filter Chips for News */}
      {kind === 'news' && (
        <div className="filter-scroll md:flex-wrap pb-1 mb-4 md:mb-5" role="group" aria-label={heading}>
          {['all', 'technology', 'environment'].map(value => (
            <button
              type="button"
              key={value}
              aria-pressed={topic === value}
              onClick={() => { setTopic(value); setLimit(9); }}
              className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold border whitespace-nowrap transition-colors ${
                topic === value
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              {value === 'all' ? (lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tout' : 'All') : (topicLabels[lang] || topicLabels.en)[value]}
            </button>
          ))}
        </div>
      )}

      {kind === 'events' && <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{t.eventNote}</p>}
      {current && state.updatedAt && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          {t.updated}: {new Date(state.updatedAt).toLocaleString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB')}
        </p>
      )}
      {current && state.error && (
        <div role="alert" className="p-4 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex flex-wrap items-center gap-2">
          <span>{t.error}</span>
          <button
            type="button"
            className="min-h-[44px] sm:min-h-0 px-3 py-1 rounded-lg bg-amber-200/70 dark:bg-amber-900/60 underline font-bold"
            onClick={() => setAttempt(value => value + 1)}
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* 16:9 Skeleton Loading Cards */}
      {!current || state.loading ? (
        <div role="status" aria-label={t.loading} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3].map(n => (
            <div key={n} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!items.length && !state.error && (
            <p role="status" className="py-8 text-center text-sm text-slate-600 dark:text-slate-300">
              {t.empty}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.slice(0, limit).map(item => (
              <article key={item.id} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <SourceImage key={item.image} src={item.image} title={item.title} fallback={t.image} kind={kind} />
                <div className="p-4 md:p-5 flex flex-col flex-1 gap-2.5">
                  {/* Topic Badge on its own row */}
                  {kind === 'news' && item.topic && (
                    <div>
                      <span className="inline-block rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-3 py-1 text-xs font-bold">
                        {(topicLabels[lang] || topicLabels.en)[item.topic]}
                      </span>
                    </div>
                  )}

                  {/* Source + Date */}
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                    {t.source}:{' '}
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {item.source}
                    </a>
                    {item.date && (
                      <>
                        {' · '}
                        <time dateTime={item.date}>{date(item.date)}</time>
                      </>
                    )}
                  </p>

                  {/* Single Clean Title */}
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug break-words" dir="auto">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3" dir="auto">
                    {(lang === 'ar' && item.summaryAr) || item.summary || t.noSummary}
                  </p>

                  {item.license && (
                    <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 dark:text-slate-400 underline">
                      {item.license} · {lang === 'ar' ? 'بيانات منسقة ومختصرة' : 'Formatted and summarized data'}
                    </a>
                  )}

                  {item.location && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium" dir="auto">
                      {item.location}
                    </p>
                  )}

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto min-h-[44px] inline-flex items-center gap-1.5 pt-2 font-bold text-sm text-teal-700 dark:text-teal-300 underline underline-offset-4 hover:text-teal-800 dark:hover:text-teal-200"
                  >
                    <span>{t.read}</span>
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {items.length > limit && (
            <button
              type="button"
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] block mx-auto mt-6 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
              onClick={() => setLimit(value => value + 9)}
            >
              {t.more}
            </button>
          )}
        </>
      )}
    </section>
  );
}
