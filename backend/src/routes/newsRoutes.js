const router = require("express").Router();

const { getNewsHandler } = require("../controllers/newsController");

router.get("/", getNewsHandler);

module.exports = router;
