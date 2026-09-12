const router = require("express").Router();

const {
  register,
  login,
  logout,
  me,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);
module.exports = router;