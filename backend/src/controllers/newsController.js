const { getNews } = require("../services/newsService");

const getNewsHandler = async (req, res) => {
  try {
    const data = await getNews();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Haber error:", error);

    res.status(500).json({
      success: false,
      message: "Haberler alınamadı.",
    });
  }
};

module.exports = {
  getNewsHandler,
};
