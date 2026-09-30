import { handleContentFeed } from '../public/content-feed.js';
await Promise.all(['news', 'events'].flatMap(kind => ['morocco', 'world'].map(async scope => {
  const response = await handleContentFeed(new Request(`https://gitm.test/api/content?kind=${kind}&scope=${scope}`));
  const result = await response.json();
  console.log(JSON.stringify({ kind, scope, status: response.status, items: result.items?.length, images: result.items?.filter(item => item.image).length, summaries: result.items?.filter(item => item.summary).length }));
  if (!response.ok) process.exitCode = 1;
})));
