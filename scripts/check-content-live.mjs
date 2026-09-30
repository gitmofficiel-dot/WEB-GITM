import { handleContentFeed } from '../public/content-feed.js';
const origin = process.argv[2];
await Promise.all(['news', 'events'].flatMap(kind => ['morocco', 'world'].map(async scope => {
  const request = new Request(`${origin || 'https://gitm.test'}/api/content?kind=${kind}&scope=${scope}`);
  const response = origin ? await fetch(request, { signal: AbortSignal.timeout(45000) }) : await handleContentFeed(request);
  const result = await response.json();
  console.log(JSON.stringify({ kind, scope, status: response.status, items: result.items?.length, images: result.items?.filter(item => item.image).length, summaries: result.items?.filter(item => item.summary).length }));
  if (!response.ok) process.exitCode = 1;
})));
