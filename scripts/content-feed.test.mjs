import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContentFeed, normalizeEvents, normalizeDeveloperEvents, parseNews, safeUrl } from '../public/content-feed.js';

test('RSS extracts safe source links, image and plain-text excerpt, deduplicating articles', () => {
  const item = `<item><title><![CDATA[News &amp; updates]]></title><link>https://example.org/a</link><description><![CDATA[<p>A summary.</p><script>alert(1)</script>]]></description><content:encoded><![CDATA[<img src="https://example.org/photo.jpg">]]></content:encoded><pubDate>Wed, 30 Sep 2026 10:00:00 GMT</pubDate></item>`;
  const items = parseNews(`<rss><channel>${item}${item}<item><title>Bad</title><link>javascript:alert(1)</link></item></channel></rss>`, { name: 'Source', url: 'https://example.org/feed' }, 'morocco');
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'News & updates');
  assert.equal(items[0].summary, 'A summary.');
  assert.equal(items[0].image, 'https://example.org/photo.jpg');
  assert.equal(items[0].date, '2026-09-30T10:00:00.000Z');
  assert.equal(safeUrl('data:text/html,hello'), '');
  assert.throws(() => parseNews('<html>Blocked</html>', {}, 'world'));
});

test('event dates are genuine future dates; Morocco scope excludes other countries and cancellations', () => {
  const event = { id: 1, name: 'Conference', date: '2026-10-02', country: 'Morocco', url: 'https://example.org/event', status: 'upcoming' };
  const events = [event, event, { ...event, id: 2, date: '2026-09-01' }, { ...event, id: 3, country: 'France' }, { ...event, id: 4, status: 'cancelled' }, { ...event, id: 5, date: 'invalid' }];
  assert.equal(normalizeEvents({ events }, 'morocco', new Date('2026-09-30')).length, 1);
});

test('API validates parameters and methods before network requests', async () => {
  const fetcher = () => { throw new Error('Unexpected request'); };
  assert.equal((await handleContentFeed(new Request('https://gitm.test/api/content?scope=bad'), { fetcher })).status, 400);
  assert.equal((await handleContentFeed(new Request('https://gitm.test/api/content', { method: 'POST' }), { fetcher })).status, 405);
});

test('API caches successful content with canonical keys and leaves failures uncached', async () => {
  const entries = new Map();
  const cache = { match: async request => entries.get(request.url)?.clone(), put: async (request, response) => entries.set(request.url, response) };
  let calls = 0;
  const fetcher = async () => { calls++; return new Response('<rss><channel><item><title>Example</title><link>https://example.org/news</link></item></channel></rss>'); };
  const first = await handleContentFeed(new Request('https://gitm.test/api/content?scope=world&ignored=a'), { cache, fetcher });
  assert.equal(first.status, 200);
  await handleContentFeed(new Request('https://gitm.test/api/content?scope=world&ignored=b'), { cache, fetcher });
  assert.equal(calls, 1);
  const failed = await handleContentFeed(new Request('https://gitm.test/api/content?scope=morocco'), { cache, fetcher: async () => new Response('Unavailable', { status: 503 }) });
  assert.equal(failed.status, 502);
  assert.equal(entries.size, 1);
});

test('empty event coverage is a successful empty feed, not fabricated content', async () => {
  const response = await handleContentFeed(new Request('https://gitm.test/api/content?kind=events&scope=morocco'), { fetcher: async () => Response.json({ events: [] }) });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).items, []);
});

test('conference fallback retains upcoming Moroccan events and their source attribution', () => {
  const event = { name: 'Devoxx', date: [Date.parse('2026-11-04')], country: 'Morocco', location: 'Casablanca (Morocco)', hyperlink: 'https://devoxx.ma', tags: [{ key: 'tech', value: 'java' }] };
  const items = normalizeDeveloperEvents([event, event, { ...event, country: 'France' }, { ...event, date: [0] }], 'morocco', new Date('2026-09-30'));
  assert.equal(items.length, 1);
  assert.match(items[0].summaryAr, /java/);
  assert.equal(items[0].license, 'CC BY-NC 4.0');
});

test('Morocco news remains available when the primary publisher rejects server requests', async () => {
  const fetcher = async url => url.includes('hespress') ? new Response('Blocked', { status: 403 }) :
    new Response('<rss><channel><item><title>Morocco news</title><link>https://alyaoum24.com/news</link><description>A source excerpt</description></item></channel></rss>');
  const response = await handleContentFeed(new Request('https://gitm.test/api/content?scope=morocco'), { fetcher });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.items.length, 1);
  assert.equal(data.items[0].source, 'اليوم 24');
});
