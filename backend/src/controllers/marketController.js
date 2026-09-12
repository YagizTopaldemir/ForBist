const {
  getMarketSummary,
} = require("../services/marketService");

const getMarket = async (req, res) => {
  try {
    const data = await getMarketSummary();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Market error:", error);

    res.status(500).json({
      success: false,
      message: "Piyasa verileri alınamadı.",
    });
  }
};

module.exports = {
  getMarket,
};