import { handleContentFeed, NEWS_EDITION } from '../public/content-feed.js';
const origin = process.argv.slice(2).find(arg => arg !== '--headlines');
await Promise.all(['news', 'events'].flatMap(kind => ['morocco', 'world'].map(async scope => {
  const request = new Request(`${origin || 'https://gitm.test'}/api/content?kind=${kind}&scope=${scope}${kind === 'news' ? `&edition=${NEWS_EDITION}` : ''}`);
  const response = origin ? await fetch(request, { signal: AbortSignal.timeout(45000) }) : await handleContentFeed(request);
  const result = await response.json();
  console.log(JSON.stringify({ kind, scope, status: response.status, items: result.items?.length, images: result.items?.filter(item => item.image).length, summaries: result.items?.filter(item => item.summary).length, ...(kind === 'news' ? { technology: result.items?.filter(item => item.topic === 'technology').length, environment: result.items?.filter(item => item.topic === 'environment').length } : {}) }));
  if (!response.ok) process.exitCode = 1;
  if (kind === 'news' && result.items?.some(item => !['technology', 'environment'].includes(item.topic))) process.exitCode = 1;
  if (kind === 'news' && process.argv.includes('--headlines')) console.log(JSON.stringify({ scope, headlines: result.items?.map(({ title, topic, date }) => ({ title, topic, date })) }));
})));
