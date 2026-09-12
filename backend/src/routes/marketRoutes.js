const router = require("express").Router();

const {
  getMarket,
} = require("../controllers/marketController");

router.get("/", getMarket);

module.exports = router;