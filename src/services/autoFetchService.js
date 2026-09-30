import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

export const autoFetchNewsAndEvents = async () => {
  if (!GNEWS_API_KEY) {
    console.warn("Missing GNEWS API KEY");
    return { success: false, message: 'Missing API Key' };
  }

  try {
    let addedNews = 0;
    let addedEvents = 0;

    // 1. Fetch Global Tech News
    const globalRes = await fetch(`https://gnews.io/api/v4/search?q="Artificial Intelligence" OR "IoT" OR "Tech"&lang=ar&max=5&apikey=${GNEWS_API_KEY}`);
    const globalData = await globalRes.json();
    
    // 2. Fetch National (Morocco) News & Events
    const nationalRes = await fetch(`https://gnews.io/api/v4/search?q="المغرب" AND ("تكنولوجيا" OR "هاكاثون" OR "ابتكار" OR "فعالية" OR "ذكاء اصطناعي")&lang=ar&country=ma&max=5&apikey=${GNEWS_API_KEY}`);
    const nationalData = await nationalRes.json();

    const processArticles = async (articles, isEvent = false) => {
      if (!articles || !Array.isArray(articles)) return 0;
      let count = 0;
      
      const collectionName = isEvent ? 'events' : 'news';
      const colRef = collection(db, collectionName);
      
      // Get existing titles to prevent duplicates
      const existingSnap = await getDocs(colRef);
      const existingTitles = existingSnap.docs.map(d => d.data().titleAr || d.data().title || '');

      for (const article of articles) {
        if (existingTitles.includes(article.title)) continue;

        const docData = {
          titleAr: article.title,
          titleEn: article.title,
          descriptionAr: article.description || '',
          descriptionEn: article.description || '',
          image: article.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          source: article.source?.name || 'GNews',
          url: article.url,
          date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          createdAt: Timestamp.now()
        };

        if (isEvent) {
          docData.startDate = docData.date;
          docData.location = 'Morocco / Online';
          docData.type = article.title.includes('هاكاثون') ? 'Hackathon' : 'Conference';
        }

        await addDoc(colRef, docData);
        count++;
      }
      return count;
    };

    if (globalData.articles) {
      addedNews += await processArticles(globalData.articles, false);
    }

    if (nationalData.articles) {
      // Split national data into news and events based on keywords
      const events = nationalData.articles.filter(a => a.title.includes('فعالية') || a.title.includes('هاكاثون') || a.title.includes('مسابقة'));
      const news = nationalData.articles.filter(a => !events.includes(a));
      
      addedEvents += await processArticles(events, true);
      addedNews += await processArticles(news, false);
    }

    // Also fetch from RSS for fallback national news (Hespress Tech)
    try {
      const rssRes = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.hespress.com/feed');
      const rssData = await rssRes.json();
      if (rssData.items) {
        // Filter tech related if possible, or just take top 3
        const rssArticles = rssData.items.slice(0, 3).map(item => ({
          title: item.title,
          description: item.description.replace(/<[^>]+>/g, ''),
          image: item.thumbnail || item.enclosure?.link,
          source: 'Hespress',
          url: item.link,
          publishedAt: item.pubDate
        }));
        addedNews += await processArticles(rssArticles, false);
      }
    } catch (e) {
      console.error('RSS Fetch error:', e);
    }

    return { success: true, addedNews, addedEvents };
  } catch (error) {
    console.error('Error auto-fetching:', error);
    return { success: false, message: error.message };
  }
};
