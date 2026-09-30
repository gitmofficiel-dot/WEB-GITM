# Automatic news and events

The News and Events pages include a public Morocco / World feed, independently of existing GITM content in Firestore.

- News is limited to **technology and environment**. Morocco uses publisher feeds and subject searches (Hespress, Alyaoum24 and Alayam24), with a conservative headline/category filter and explicit Moroccan location/context matching. Election and cabinet-negotiation headlines are excluded. World news uses AITnews and BBC Technology, UN News Climate in Arabic, and filtered BBC Science & Environment. A passing keyword in the body of a political story does not qualify it. An empty relevant feed stays empty rather than falling back to general news. This rules-based filter favors precision over coverage and may omit loosely worded relevant headlines.
- Cards identify their topic; visitors can select All / Technology / Environment within Morocco or World. Sources are requested independently. Titles, publisher excerpts, images when provided, publication dates and original links are shown. Excerpts are not AI-generated explanations or translations.
- The news cache and browser request are versioned with `tech-environment-v1` to avoid displaying the previous general-news edition after deployment.
- Events: [EventMedium's public JSON catalogue](https://www.eventmedium.ai/feeds.html) and the [developers.events community catalogue](https://developers.events/), filtered to upcoming events and Morocco when selected. Event dates are distinct from article publication dates. Coverage is provider-dependent. EventMedium descriptions retain the provider's language; conference summaries are composed from the directory's location and topic fields, with an Arabic version. No event dates are inferred from news.
- The developers.events data is attributed to its contributors under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), with source/license links and a formatting/summarization notice on cards. This source is for noncommercial use; replace it with an appropriately licensed catalogue if the site becomes commercial.
- Missing or broken images receive a labeled placeholder, never an unrelated photograph.
- Sources are requested server-side through `/api/content?kind=news|events&scope=morocco|world`. No API key or Firebase write access is required.
- Cloudflare caches each of the four feeds for 15 minutes. Open pages re-fetch every 15 minutes. This is on-demand refresh, **not** a scheduled import into Firestore and not a background task when nobody visits.
- Failed refreshes retain already displayed content with an error and its original update time. A new visitor sees the error and a retry action. Failed requests are not cached.

## Run and deploy

`npm run dev` includes a Vite middleware for this API. `npm run build` copies the worker and its `content-feed.js` module into `dist`. Deploy the entire `dist` folder to the existing Cloudflare Pages project, including both files. Vite's static `preview` command does not emulate the Pages API.

The existing project uses [Cloudflare Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/): `public/_worker.js` handles the endpoint and forwards other requests to the existing asset/SEO flow. Files under `functions/` are not used by Pages in this mode.

Verification: `node --test scripts/content-feed.test.mjs`, `node scripts/check-content-live.mjs`, `npm run build`.

After deployment, `node scripts/check-content-live.mjs https://gitm.pages.dev` checks the four actual hosted API responses. A successful local publisher request does not guarantee that the publisher accepts requests from Cloudflare.

For broader Moroccan event coverage, add a verified event-directory adapter in `public/content-feed.js`; do not infer event dates from news publication dates. Publisher images and descriptions remain attributed to their sources.
