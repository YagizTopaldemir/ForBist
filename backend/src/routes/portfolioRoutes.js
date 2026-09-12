const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPortfolio,
  getPortfolioSummaryController,
  getPortfolioHistoryController,
} = require("../controllers/portfolioController");

router.get(
  "/",
  authMiddleware,
  getPortfolio
);


router.get(
  "/history",
  authMiddleware,
  getPortfolioHistoryController
);

router.get(
  "/summary",
  authMiddleware,
  getPortfolioSummaryController
);

module.exports = router;