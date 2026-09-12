const { fetchIpos } = require("../services/ipoService");

const getIpos = async (req, res) => {
  try {
    const result = await fetchIpos();

    res.json({
      success: true,
      count: result.ipos.length,
      stats: result.stats,
      data: result.ipos,
    });
  } catch (error) {
    console.error("IPO Error:", error);

    res.status(500).json({
      success: false,
      message: "Halka arz verileri alınamadı.",
    });
  }
};

module.exports = {
  getIpos,
};