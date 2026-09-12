const axios = require("axios");
const cheerio = require("cheerio");

const CACHE_DURATION = 60 * 1000;

// --------------------------------------------------
// CACHE
// --------------------------------------------------

let marketCache = null;
let cacheTimestamp = 0;
let marketRequest = null;

const stockCache = new Map();

// --------------------------------------------------
// HEADERS
// --------------------------------------------------

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
  "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const parseTurkishNumber = (value) => {
  if (!value) return null;

  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );
};

// --------------------------------------------------
// BIST 100
// --------------------------------------------------

const getBist100 = async () => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/XU100.IS?range=1d&interval=1d",
      {
        headers: HEADERS,
        timeout: 10000,
      }
    );

    const result = response.data?.chart?.result?.[0];

    if (!result) {
      throw new Error("Yahoo Finance BIST verisi bulunamadı.");
    }

    const meta = result.meta;

    const value = Number(meta.regularMarketPrice);

    const previousClose = Number(
      meta.chartPreviousClose ?? meta.previousClose
    );

    if (!Number.isFinite(value)) {
      throw new Error("BIST 100 değeri geçersiz.");
    }

    let change = 0;

    if (
      Number.isFinite(previousClose) &&
      previousClose !== 0
    ) {
      change =
        ((value - previousClose) / previousClose) * 100;
    }

    const data = {
      value,
      change: Number(change.toFixed(2)),
    };

    console.log("BIST 100:", {
      value,
      previousClose,
      changePercent: data.change,
    });

    return data;
  } catch (error) {
    console.error(
      "BIST 100 alınamadı:",
      error.response?.status || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// GRAM ALTIN
// --------------------------------------------------

const getGold = async () => {
  try {
    const response = await axios.get(
      "https://bigpara.hurriyet.com.tr/altin/gram-altin-fiyati/",
      {
        headers: HEADERS,
        timeout: 10000,
      }
    );

    console.log("Gold Bigpara status:", response.status);

    const $ = cheerio.load(response.data);

    /*
      Bigpara'da doğrudan gram altın bölümünü
      bulmaya çalışıyoruz.
    */

    let value = null;
    let change = 0;

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    /*
      ALTIN (TL/GR) bölümünden sonraki kısmı al.
    */

    const goldIndex = bodyText.search(
      /ALTIN\s*\(TL\/GR\)/i
    );

    if (goldIndex !== -1) {
      const goldSection = bodyText.slice(
        goldIndex,
        goldIndex + 1000
      );

      console.log(
        "Gold section:",
        goldSection.slice(0, 500)
      );

      /*
        Alış ve satış değerlerini bul.
      */

      const numberRegex =
        /\d{1,3}(?:\.\d{3})*,\d{2}/g;

      const matches =
        goldSection.match(numberRegex) || [];

      const values = matches
        .map(parseTurkishNumber)
        .filter(
          (number) =>
            Number.isFinite(number) &&
            number >= 1000 &&
            number <= 20000
        );

      /*
        Genellikle:
        ilk  = alış
        ikinci = satış
      */

      if (values.length >= 2) {
        value = values[1];
      } else if (values.length === 1) {
        value = values[0];
      }

      /*
        Yüzde değişimi sadece % işaretinin
        hemen önündeki değerden al.
      */

      const percentageMatch =
        goldSection.match(
          /([+-]?\d+(?:[.,]\d+)?)\s*%/
        );

      if (percentageMatch) {
        change = Number(
          percentageMatch[1].replace(",", ".")
        );
      }
    }

    if (!Number.isFinite(value)) {
      throw new Error(
        "Gram altın değeri bulunamadı."
      );
    }

    const data = {
      value,
      change: Number(change.toFixed(2)),
    };

    console.log("Gold:", data);

    return data;
  } catch (error) {
    console.error(
      "Gram altın alınamadı:",
      error.response?.status || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// MARKET SUMMARY
// --------------------------------------------------

const getMarketSummary = async () => {
  const now = Date.now();

  if (
    marketCache &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    console.log("Market data: cache kullanıldı");
    return marketCache;
  }

  if (marketRequest) {
    console.log(
      "Market data: devam eden istek bekleniyor"
    );

    return marketRequest;
  }

  marketRequest = (async () => {
    try {
      console.log(
        "Market data: API'den çekiliyor"
      );

      const [bist100, gold] = await Promise.all([
        getBist100(),
        getGold(),
      ]);

      const data = {
        bist100,
        gold,
      };

      marketCache = data;
      cacheTimestamp = Date.now();

      return data;
    } finally {
      marketRequest = null;
    }
  })();

  return marketRequest;
};

// --------------------------------------------------
// STOCK PRICES
// --------------------------------------------------

const BIST_BASE_URL =
  "https://api.oanor.com/borsaistanbul-api";

const getStockPrices = async (symbols) => {
  const headers = {
    "x-oanor-key": process.env.MARKET_API_KEY,
  };

  const uniqueSymbols = [
    ...new Set(symbols),
  ];

  const prices = {};

  const requests = uniqueSymbols.map(
    async (symbol) => {
      try {
        const cached =
          stockCache.get(symbol);

        if (
          cached &&
          Date.now() - cached.timestamp <
            CACHE_DURATION
        ) {
          prices[symbol] = cached.data;
          return;
        }

        const response = await fetch(
          `${BIST_BASE_URL}/v1/quote?hisse=${encodeURIComponent(
            symbol
          )}`,
          {
            headers,
          }
        );

        const responseText =
          await response.text();

        console.log(
          `${symbol} Oanor status:`,
          response.status
        );

        if (!response.ok) {
          console.error(
            `${symbol} fiyat alınamadı:`,
            response.status
          );

          return;
        }

        const result =
          JSON.parse(responseText);

        const price = {
          currentPrice: Number(
            result.data.close
          ),
          changePercent: Number(
            result.data.change_pct || 0
          ),
        };

        stockCache.set(symbol, {
          data: price,
          timestamp: Date.now(),
        });

        prices[symbol] = price;
      } catch (error) {
        console.error(
          `${symbol} fiyat hatası:`,
          error.message
        );
      }
    }
  );

  await Promise.all(requests);

  return prices;
};

// --------------------------------------------------
// EXPORT
// --------------------------------------------------

module.exports = {
  getMarketSummary,
  getStockPrices,
};