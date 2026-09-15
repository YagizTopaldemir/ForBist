const db = require("../config/db");

const {
  getPortfolioSummary,
  getPortfolioHistory,
} = require("../services/portfolioService");

const {
  getStockPrices,
} = require("../services/marketService");


 
const getPortfolio = async (req, res) => {
     try {
      console.log("YENI GET PORTFOLIO CALISTI");
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        id,
        symbol,
        quantity,
        average_price,
        created_at,
        updated_at
      FROM portfolios
      WHERE user_id = ?
      ORDER BY symbol ASC
      `,
      [userId]
    );

    const symbols = rows.map(
      (stock) => stock.symbol
    );

    const prices = await getStockPrices(symbols);

    const summary = await getPortfolioSummary(
      db,
      userId,
      prices
    );

    res.json({
      success: true,
      data: summary,
    });

  } catch (error) {
    console.error(
      "Portfolio error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Portföy alınamadı.",
    });
  }
};


const getPortfolioSummaryController = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        symbol
      FROM portfolios
      WHERE user_id = ?
      `,
      [userId]
    );

    const symbols = rows.map(
      (stock) => stock.symbol
    );

    const prices = await getStockPrices(symbols);

    const summary = await getPortfolioSummary(
      db,
      userId,
      prices
    );

    res.json({
      success: true,
      data: summary,
    });

  } catch (error) {
    console.error(
      "Portfolio summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Portföy özeti alınamadı.",
    });
  }
};


const getPortfolioHistoryController = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const history = await getPortfolioHistory(
      db,
      userId
    );

    res.json({
      success: true,
      data: history,
    });

  } catch (error) {
    console.error(
      "Portfolio history error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Portföy geçmişi alınamadı.",
    });
  }
};


module.exports = {
  getPortfolio,
  getPortfolioSummaryController,
  getPortfolioHistoryController,
};