const router = require("express").Router();
const { getIpos } = require("../controllers/ipoController");

router.get("/", getIpos);

module.exports = router;