export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // Check if it's a bot/crawler
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|whatsapp|facebook|twitter|linkedin|skype|viber|slack/i.test(userAgent);

    if (isBot) {
      // 1. Handle News Details
      if (url.pathname.startsWith('/news/') && url.pathname.length > 6) {
        const id = url.pathname.split('/').pop();
        return await handleDynamicSeo(request, env, 'gitm_data', 'news', id);
      }
      // 2. Handle Event Details
      if (url.pathname.startsWith('/events/') && url.pathname.length > 8) {
        const id = url.pathname.split('/').pop();
        return await handleDynamicSeo(request, env, 'gitm_data', 'events', id);
      }
      // 3. Handle Course Details
      if (url.pathname.startsWith('/academy/') && url.pathname.length > 9) {
        const id = url.pathname.split('/').pop();
        return await handleDynamicSeo(request, env, 'gitm_data', 'courses', id);
      }
      // 4. Handle Partner Details
      if (url.pathname.startsWith('/partners/') && url.pathname.length > 10) {
        const id = url.pathname.split('/').pop();
        return await handleDynamicSeo(request, env, 'gitm_data', 'partners', id);
      }
    }

    // Pass through for normal users or static assets
    return env.ASSETS.fetch(request);
  }
};

async function handleDynamicSeo(request, env, collection, subCollection, id) {
  // Fetch the default index.html from Cloudflare Pages assets
  const url = new URL(request.url);
  const indexUrl = new URL('/', url.origin);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  
  if (!indexResponse.ok) {
    return env.ASSETS.fetch(request);
  }

  try {
    const projectId = "gitm-1b637";
    // For doc(db, 'gitm_data', 'news'), the REST URL is:
    let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${subCollection}`;
    
    const dbResponse = await fetch(firestoreUrl);
    if (!dbResponse.ok) {
      return indexResponse;
    }
    
    const data = await dbResponse.json();
    let item = null;

    // Check if the document has an "items" array
    if (data.fields && data.fields.items && data.fields.items.arrayValue && data.fields.items.arrayValue.values) {
      const items = data.fields.items.arrayValue.values;
      for (const val of items) {
        const map = val.mapValue.fields;
        if (map && map.id && (map.id.stringValue === id || map.id.integerValue === id || map.id.integerValue === parseInt(id))) {
          item = map;
          break;
        }
      }
    }

    if (!item) {
      return indexResponse; // return default if not found
    }

    // Extract fields (Firestore REST API format)
    const getFieldStr = (fieldObj, fallback = '') => {
      if (!fieldObj) return fallback;
      return fieldObj.stringValue || fallback;
    };

    const titleEn = item.titleEn ? getFieldStr(item.titleEn) : getFieldStr(item.title);
    const titleAr = item.titleAr ? getFieldStr(item.titleAr) : getFieldStr(item.title);
    const descEn = item.descriptionEn ? getFieldStr(item.descriptionEn) : (item.summaryEn ? getFieldStr(item.summaryEn) : getFieldStr(item.description));
    const descAr = item.descriptionAr ? getFieldStr(item.descriptionAr) : (item.summaryAr ? getFieldStr(item.summaryAr) : getFieldStr(item.description));
    const imageUrl = item.image ? getFieldStr(item.image) : (item.imageUrl ? getFieldStr(item.imageUrl) : 'https://gitm.pages.dev/gitmlogo.png');

    // Combine titles for SEO
    const title = `${titleAr} | ${titleEn} - GITM`;
    const description = `${descAr} - ${descEn}`;

    // Use HTMLRewriter to inject meta tags
    return new HTMLRewriter()
      .on('title', {
        element(e) {
          e.setInnerContent(title);
        }
      })
      .on('head', {
        element(e) {
          e.append(`<meta name="description" content="${description}">`, { html: true });
          e.append(`<meta property="og:title" content="${title}">`, { html: true });
          e.append(`<meta property="og:description" content="${description}">`, { html: true });
          e.append(`<meta property="og:image" content="${imageUrl}">`, { html: true });
          e.append(`<meta property="og:url" content="${url.href}">`, { html: true });
          e.append(`<meta name="twitter:card" content="summary_large_image">`, { html: true });
          e.append(`<meta name="twitter:title" content="${title}">`, { html: true });
          e.append(`<meta name="twitter:description" content="${description}">`, { html: true });
          e.append(`<meta name="twitter:image" content="${imageUrl}">`, { html: true });
        }
      })
      .transform(indexResponse);

  } catch (error) {
    console.error("Worker Error:", error);
    return indexResponse;
  }
}
