const axios = require("axios");
const cheerio = require("cheerio");

const CACHE_DURATION = 5 * 60 * 1000;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
};

let newsCache = null;
let cacheTimestamp = 0;
let newsRequest = null;

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const isWithinTodayOrYesterday = (pubDate) => {
  const date = new Date(pubDate);

  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  return date >= startOfYesterday && date <= now;
};

const isSafeHttpUrl = (value) => {
  if (!value) return false;

  try {
    const parsed = new URL(value);

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const cleanText = (raw) => {
  if (!raw) return "";

  return cheerio
    .load(`<div>${raw}</div>`)
    .text()
    .replace(/\s+/g, " ")
    .trim();
};

const findByTagName = (item, tagName) => {
  let found = null;

  item.find("*").each((index, element) => {
    if (found) return;

    if (
      element.tagName &&
      element.tagName.toLowerCase() === tagName.toLowerCase()
    ) {
      found = element;
    }
  });

  return found;
};

const extractImage = ($, item) => {
  const directImage = item.find("image").first().text().trim();

  if (directImage) return directImage;

  const mediaContent = findByTagName(item, "media:content");

  if (mediaContent?.attribs?.url) {
    return mediaContent.attribs.url;
  }

  const enclosure = item.find("enclosure").first();

  if (enclosure.attr("url")) {
    return enclosure.attr("url");
  }

  return null;
};

// --------------------------------------------------
// FEED PARSING
// --------------------------------------------------

const parseFeed = (xml, source) => {
  const $ = cheerio.load(xml, { xmlMode: true });

  const items = [];

  $("item").each((index, element) => {
    const item = $(element);

    const title = item.find("title").first().text().trim();
    const link = item.find("link").first().text().trim();
    const pubDate = item.find("pubDate").first().text().trim();
    const description = cleanText(
      item.find("description").first().text()
    );

    if (!title || !link || !pubDate) return;

    // RSS kaynağı bozuk/kötü niyetli bir link verirse
    // (ör. javascript:) bunu asla frontend'e taşımıyoruz.
    if (!isSafeHttpUrl(link)) return;

    if (!isWithinTodayOrYesterday(pubDate)) return;

    const image = extractImage($, item);

    items.push({
      title,
      link,
      summary: description.slice(0, 200),
      source,
      publishedAt: new Date(pubDate).toISOString(),
      image: isSafeHttpUrl(image) ? image : null,
    });
  });

  return items;
};

const fetchFeed = async (url, source) => {
  const response = await axios.get(url, {
    headers: HEADERS,
    timeout: 10000,
  });

  return parseFeed(response.data, source);
};

// --------------------------------------------------
// SOURCES
// --------------------------------------------------

const getTurkeyNews = () =>
  fetchFeed(
    "https://www.aa.com.tr/tr/rss/default?cat=ekonomi",
    "Anadolu Ajansı"
  );

const getUsNews = () =>
  fetchFeed(
    "https://feeds.content.dowjones.io/public/rss/mw_topstories",
    "MarketWatch"
  );

const sortByDateDesc = (a, b) =>
  new Date(b.publishedAt) - new Date(a.publishedAt);

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------

const getNews = async () => {
  const now = Date.now();

  if (newsCache && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Haberler: cache kullanıldı");
    return newsCache;
  }

  if (newsRequest) {
    console.log("Haberler: devam eden istek bekleniyor");
    return newsRequest;
  }

  newsRequest = (async () => {
    try {
      console.log("Haberler: kaynaklardan çekiliyor");

      const [turkey, us] = await Promise.all([
        getTurkeyNews().catch((error) => {
          console.error(
            "Türkiye haberleri alınamadı:",
            error.response?.status || error.message
          );

          return [];
        }),
        getUsNews().catch((error) => {
          console.error(
            "ABD haberleri alınamadı:",
            error.response?.status || error.message
          );

          return [];
        }),
      ]);

      const data = {
        turkey: turkey.sort(sortByDateDesc),
        us: us.sort(sortByDateDesc),
      };

      newsCache = data;
      cacheTimestamp = Date.now();

      return data;
    } finally {
      newsRequest = null;
    }
  })();

  return newsRequest;
};

module.exports = {
  getNews,
};
