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
    const globalApiUrl = `https://gnews.io/api/v4/search?q="Artificial Intelligence" OR "IoT" OR "Tech"&lang=ar&max=5&apikey=${GNEWS_API_KEY}`;
    const globalRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(globalApiUrl)}`);
    const globalRaw = await globalRes.json();
    const globalData = globalRaw.contents ? JSON.parse(globalRaw.contents) : globalRaw;
    
    // 2. Fetch National (Morocco) News & Events
    const nationalQuery = '"\u0627\u0644\u0645\u063A\u0631\u0628" AND ("\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627" OR "\u0647\u0627\u0643\u0627\u062B\u0648\u0646" OR "\u0627\u0628\u062A\u0643\u0627\u0631" OR "\u0641\u0639\u0627\u0644\u064A\u0629" OR "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A")';
    const nationalApiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(nationalQuery)}&lang=ar&country=ma&max=5&apikey=${GNEWS_API_KEY}`;
    const nationalRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(nationalApiUrl)}`);
    const nationalRaw = await nationalRes.json();
    const nationalData = nationalRaw.contents ? JSON.parse(nationalRaw.contents) : nationalRaw;

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
          docData.type = article.title.includes('\u0647\u0627\u0643\u0627\u062B\u0648\u0646') ? 'Hackathon' : 'Conference';
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
      const events = nationalData.articles.filter(a => a.title.includes('\u0641\u0639\u0627\u0644\u064A\u0629') || a.title.includes('\u0647\u0627\u0643\u0627\u062B\u0648\u0646') || a.title.includes('\u0645\u0633\u0627\u0628\u0642\u0629'));
      const news = nationalData.articles.filter(a => !events.includes(a));
      
      addedEvents += await processArticles(events, true);
      addedNews += await processArticles(news, false);
    }

    // Also fetch from RSS for fallback national news (AlJazeera Tech or Hespress Tech)
    // Using a more tech-oriented RSS or generic if none found. Hespress Science & Nature:
    try {
      const rssRes = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://ar.hespress.com/sciences-nature/feed');
      const rssData = await rssRes.json();
      if (rssData.items) {
        // Filter tech related if possible, or just take top 3
        const rssArticles = rssData.items.slice(0, 3).map(item => ({
          title: item.title,
          description: item.description.replace(/<[^>]+>/g, ''),
          image: item.thumbnail || item.enclosure?.link,
          source: 'Hespress Tech',
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
