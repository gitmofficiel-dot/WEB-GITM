// Shared by the Pages worker and Vite's development server. No browser API keys.
export const REFRESH_SECONDS = 900;
const NEWS_SOURCES = {
  morocco: { name: 'هسبريس', url: 'https://www.hespress.com/feed' },
  world: { name: 'BBC عربي', url: 'https://feeds.bbci.co.uk/arabic/rss.xml' },
};
let conferenceRequest;
let conferenceFetchedAt = 0;
const ORGANIZER_PAGES = ['https://devoxx.ma/', 'https://www.waxconf.fr/', 'https://www.volcamp.io/'];

async function addOrganizerImages(items, fetcher) {
  return Promise.all(items.map(async item => {
    if (item.image || !ORGANIZER_PAGES.includes(item.url)) return item;
    try {
      // Only fixed organizer URLs are fetched; catalogue/user URLs are never proxied.
      const response = await fetcher(item.url, { redirect: 'error', signal: AbortSignal.timeout(5000) });
      if (!response.ok) return item;
      const html = await response.text();
      if (html.length > 1_000_000) return item;
      const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).find(value => /(?:property|name)=["']og:image["']/i.test(value));
      const image = safeUrl(meta?.match(/\bcontent=["']([^"']+)["']/i)?.[1], item.url);
      return image ? { ...item, image } : item;
    } catch { return item; }
  }));
}

function conferenceData(fetcher) {
  const load = () => readSource('https://developers.events/all-events.json', fetcher, 8_000_000).then(JSON.parse);
  if (fetcher !== fetch) return load();
  if (!conferenceRequest || Date.now() - conferenceFetchedAt > REFRESH_SECONDS * 1000) {
    conferenceFetchedAt = Date.now();
    conferenceRequest = load().catch(error => { conferenceRequest = undefined; throw error; });
  }
  return conferenceRequest;
}

function decode(value = '') {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(value).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return entities[entity.toLowerCase()] || match;
    const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : '';
  });
}

export function plainText(value = '', limit = 500) {
  return decode(decode(value).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').replace(/The post .* appeared first on .*/i, '').trim().slice(0, limit);
}

export function safeUrl(value, base) {
  try {
    const url = new URL(decode(value || ''), base);
    if (!value || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
    if (url.protocol === 'http:') url.protocol = 'https:';
    return url.href;
  } catch { return ''; }
}

function tag(block, name) {
  return block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '';
}

export function parseNews(xml, source, scope) {
  if (!/<rss\b/i.test(xml)) throw new Error('Invalid RSS response');
  const seen = new Set();
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(([, block]) => {
    const url = safeUrl(tag(block, 'link').trim());
    const imageTag = block.match(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*\burl=["']([^"']+)["'][^>]*>/i);
    const embeddedImage = decode(tag(block, 'content:encoded') || tag(block, 'description')).match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
    const rawDate = Date.parse(tag(block, 'pubDate'));
    return {
      id: url, title: plainText(tag(block, 'title'), 240),
      summary: plainText(tag(block, 'description'), 450) || plainText(tag(block, 'content:encoded'), 450),
      image: safeUrl(imageTag?.[1] || embeddedImage?.[1]), url,
      date: Number.isFinite(rawDate) ? new Date(rawDate).toISOString() : null,
      source: source.name, sourceUrl: source.url, scope, kind: 'news',
    };
  }).filter(item => {
    if (!item.url || !item.title || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0)).slice(0, 30);
}

export function normalizeEvents(data, scope, now = new Date()) {
  if (!Array.isArray(data.events)) throw new Error('Invalid event response');
  const today = now.toISOString().slice(0, 10);
  const seen = new Set();
  return data.events.filter(event => {
    const date = Date.parse(event.date);
    return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) >= today &&
      !['past', 'cancelled', 'canceled'].includes(event.status) &&
      (scope !== 'morocco' || /^(morocco|maroc|ma|المغرب)$/i.test(String(event.country).trim()));
  }).map(event => ({
    id: `eventmedium-${event.id}`, title: plainText(event.name, 240),
    summary: plainText(event.description, 600), image: safeUrl(event.image),
    url: safeUrl(event.url), date: new Date(event.date).toISOString(),
    location: [event.city, event.country].filter(Boolean).map(v => plainText(v, 100)).join(' · '),
    source: 'EventMedium', sourceUrl: 'https://www.eventmedium.ai/feeds.html', scope, kind: 'events',
  })).filter(item => {
    if (!item.url || !item.title || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)).slice(0, 30);
}

export function normalizeDeveloperEvents(data, scope, now = new Date()) {
  if (!Array.isArray(data)) throw new Error('Invalid conference catalogue');
  const today = now.toISOString().slice(0, 10);
  const seen = new Set();
  return data.filter(event => Array.isArray(event.date) && Number.isFinite(event.date[0]) &&
    new Date(event.date[0]).toISOString().slice(0, 10) >= today &&
    !['cancelled', 'canceled'].includes(event.status) &&
    (scope !== 'morocco' || /^(morocco|maroc|ma)$/i.test(event.country || '')))
    .sort((a, b) => a.date[0] - b.date[0]).map(event => {
      const topics = (event.tags || []).filter(tag => ['tech', 'topic'].includes(tag.key)).map(tag => plainText(tag.value, 60)).join(' · ');
      const location = plainText(event.location || event.city || '', 150);
      const url = safeUrl(event.hyperlink);
      return {
        id: `${url}-${event.date[0]}`, title: plainText(event.name, 240), url,
        date: new Date(event.date[0]).toISOString(), location, image: '',
        summary: `Developer conference in ${location}.${topics ? ` Topics: ${topics}.` : ''} See the organizer's website for the programme and registration.`,
        summaryAr: `فعالية للمطورين في ${location}.${topics ? ` المحاور المدرجة: ${topics}.` : ''} البرنامج والتسجيل متاحان عبر موقع المنظم.`,
        source: 'developers.events contributors', sourceUrl: 'https://developers.events/',
        licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/', license: 'CC BY-NC 4.0',
        scope, kind: 'events',
      };
    }).filter(item => {
      if (!item.url || !item.title || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).slice(0, 30);
}

async function readSource(url, fetcher, maxLength = 2_000_000) {
  const response = await fetcher(url, { signal: AbortSignal.timeout(30000), headers: { Accept: 'application/rss+xml, application/json, text/xml' } });
  if (!response.ok) throw new Error(`Source returned ${response.status}`);
  const text = await response.text();
  if (text.length > maxLength) throw new Error('Source response too large');
  return text;
}

export async function handleContentFeed(request, { cache, fetcher = fetch } = {}) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET' } });
  const kind = url.searchParams.get('kind') || 'news';
  const scope = url.searchParams.get('scope') || 'morocco';
  if (!['news', 'events'].includes(kind) || !['morocco', 'world'].includes(scope)) {
    return Response.json({ error: 'Invalid kind or scope' }, { status: 400 });
  }
  // Canonical keys prevent arbitrary query strings from bypassing the source cache.
  const key = new Request(`${url.origin}/api/content?kind=${kind}&scope=${scope}`);
  const cached = cache && await cache.match(key);
  if (cached) return cached;
  try {
    let items;
    let partial = false;
    if (kind === 'news') {
      const sources = scope === 'morocco' ? [NEWS_SOURCES.morocco,
        { name: 'اليوم 24', url: 'https://alyaoum24.com/feed' },
        { name: 'الأيام 24', url: 'https://www.alayam24.com/feed' },
      ] : [NEWS_SOURCES.world];
      const results = await Promise.allSettled(sources.map(async source => parseNews(await readSource(source.url, fetcher), source, scope)));
      const seen = new Set();
      items = results.flatMap(result => result.status === 'fulfilled' ? result.value : []).filter(item => {
        if (seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      }).sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0)).slice(0, 30);
      if (!items.length) throw new Error('News feed has no usable items');
    } else {
      const endpoint = new URL('https://www.eventmedium.ai/api/events/feed.json');
      endpoint.searchParams.set('status', 'upcoming');
      endpoint.searchParams.set('limit', '100');
      if (scope === 'morocco') endpoint.searchParams.set('region', 'Morocco');
      const results = await Promise.allSettled([
        readSource(endpoint.href, fetcher).then(text => normalizeEvents(JSON.parse(text), scope)),
        conferenceData(fetcher).then(data => normalizeDeveloperEvents(data, scope)),
      ]);
      if (results.every(result => result.status === 'rejected')) throw new Error('Event sources unavailable');
      partial = results.some(result => result.status === 'rejected');
      const seen = new Set();
      items = results.flatMap(result => result.status === 'fulfilled' ? result.value : []).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)).filter(item => {
        const identity = `${item.url.replace(/\/$/, '')}-${item.date.slice(0, 10)}`;
        if (seen.has(identity)) return false;
        seen.add(identity);
        return true;
      }).slice(0, 30);
      items = await addOrganizerImages(items, fetcher);
    }
    const response = Response.json({ items, kind, scope, partial, updatedAt: new Date().toISOString(), refreshSeconds: REFRESH_SECONDS }, {
      headers: { 'Cache-Control': partial ? 'no-store' : `public, max-age=${REFRESH_SECONDS}`, 'X-Content-Type-Options': 'nosniff' },
    });
    if (cache && !partial) await cache.put(key, response.clone());
    return response;
  } catch {
    return Response.json({ error: 'Content source temporarily unavailable', items: [] }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
