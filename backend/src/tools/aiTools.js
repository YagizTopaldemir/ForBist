const {
  getPortfolioSummary,
} = require("../services/portfolioService");

const {
  getMarketSummary,
  getStockPrices,
} = require("../services/marketService");

const db = require("../config/db");

const getPortfolio = async (userId) => {
  const [rows] = await db.query(
    `
      SELECT
        symbol,
        quantity,
        average_price
      FROM portfolios
      WHERE user_id = ?
      ORDER BY symbol ASC
    `,
    [userId]
  );

  if (!rows.length) {
    return {
      holdings: [],
      message: "Kullanıcının portföyünde hisse bulunmuyor.",
    };
  }

  const symbols = rows.map((stock) => stock.symbol);

  const prices = await getStockPrices(symbols);

  const portfolio = rows.map((stock) => {
    const priceData = prices[stock.symbol] || {};

    const quantity = Number(stock.quantity);
    const averagePrice = Number(stock.average_price);
    const currentPrice = Number(priceData.price || 0);

    const cost = quantity * averagePrice;
    const value = quantity * currentPrice;
    const profitLoss = value - cost;

    return {
      symbol: stock.symbol,
      quantity,
      averagePrice,
      currentPrice,
      value,
      profitLoss,
      profitLossPercent:
        cost > 0 ? (profitLoss / cost) * 100 : 0,
    };
  });

  return {
    holdings: portfolio,
  };
};

const getMarket = async () => {
  return await getMarketSummary();
};

const getStockPrice = async (symbol) => {
  const prices = await getStockPrices([symbol]);

  return {
    symbol,
    data: prices[symbol] || null,
  };
};

const getStockAnalysis = async (symbol) => {
  const prices = await getStockPrices([symbol]);

  const stock = prices[symbol];

  if (!stock) {
    return {
      symbol,
      error: "Hisse verisi bulunamadı.",
    };
  }

  return {
    symbol,
    price: stock.price,
    previousClose: stock.previousClose,
    change: stock.change,
    changePercent: stock.changePercent,
  };
};

const axios = require("axios");
const cheerio = require("cheerio");

const INVESTING_SEARCH_URL =
  "https://api.investing.com/api/search/v2/search";

const INVESTING_BASE_URL = "https://tr.investing.com";

const getInvestingStockUrl = async (symbol) => {
  const response = await axios.get(INVESTING_SEARCH_URL, {
    params: {
      q: symbol,
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
      Accept: "application/json",
      "domain-id": "tr",
      dnt: "1",
    },
    timeout: 10000,
  });

  const quotes = response.data?.quotes || [];

  const result = quotes.find(
    (item) =>
      String(item.symbol || "").toUpperCase() === symbol &&
      item.type === "Equities" &&
      (item.flag === "TR" || item.exchange === "Istanbul")
  );

  if (!result?.url) {
    throw new Error(
      `Investing.com üzerinde ${symbol} için hisse bulunamadı.`
    );
  }

  return `${INVESTING_BASE_URL}${result.url}`;
};

const getInvestingFundamentals = async (symbol) => {
  const cleanSymbol = String(symbol || "")
    .trim()
    .toUpperCase();

  if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
    return {
      symbol: cleanSymbol,
      error: "Geçersiz hisse sembolü.",
    };
  }

  try {
    const stockUrl = await getInvestingStockUrl(cleanSymbol);

    const ratiosUrl = `${stockUrl}-ratios`;

    const response = await axios.get(ratiosUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    const text = $("body").text().replace(/\s+/g, " ").trim();

    const extractRatio = (label) => {
      const regex = new RegExp(
        `${label}[^0-9-]*(-?[0-9]+(?:[.,][0-9]+)?)`,
        "i"
      );

      const match = text.match(regex);

      if (!match) return null;

      return Number(match[1].replace(",", "."));
    };

    const extractFAQRatio = (label) => {
      const regex = new RegExp(
        `${label}[^0-9-]*(-?[0-9]+(?:[.,][0-9]+)?)`,
        "i"
      );

      const match = text.match(regex);

      if (!match) return null;

      return Number(match[1].replace(",", "."));
    };

    const priceEarnings =
      extractFAQRatio("Fiyat/Kazanç") ??
      extractRatio("Fiyat/Gelir Oranı");

    const priceBook =
      extractFAQRatio("Piyasa Değeri/Defter Değeri") ??
      extractRatio("Fiyat/Defter Değeri");

    const priceSales = extractRatio("Fiyat/Satışlar");
    const priceCashFlow = extractRatio("Fiyat/Nakit Akışı");

    const result = {
      symbol: cleanSymbol,
      source: "Investing.com",
      url: ratiosUrl,

      fundamentals: {
        peRatio: priceEarnings,
        pbRatio: priceBook,
        psRatio: priceSales,
        priceToCashFlow: priceCashFlow,
      },
    };

    return result;
  } catch (error) {
    console.error(
      `Investing fundamentals error (${cleanSymbol}):`,
      error.message
    );

    return {
      symbol: cleanSymbol,
      source: "Investing.com",
      error: "Investing.com temel finansal verileri alınamadı.",
    };
  }
};

module.exports = {
  getPortfolio,
  getMarket,
  getStockPrice,
  getInvestingFundamentals,
  getStockAnalysis,
};