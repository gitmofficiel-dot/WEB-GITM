console.log('Loading Workbox');
const { generateSW } = await import('workbox-build');
console.log('Generating service worker');
const result = await generateSW({ globDirectory: 'dist', globPatterns: ['**/*.{js,css,html,svg,png,ico}'], globIgnores: ['**/_worker.js', '**/content-feed.js'], swDest: 'dist/sw.js', inlineWorkboxRuntime: true, skipWaiting: true, clientsClaim: true, navigateFallback: 'index.html', navigateFallbackDenylist: [/^\/api\//] });
console.log(result);
