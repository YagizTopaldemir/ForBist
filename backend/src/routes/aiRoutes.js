const express = require("express");

const {
  chatWithAI,
} = require("../services/aiService");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/chat",
  authMiddleware,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Mesaj boş olamaz.",
        });
      }

      const response = await chatWithAI(
        message.trim(),
        req.user.id
      );

      res.json({
        success: true,
        data: {
          message: response,
        },
      });
    } catch (error) {
      console.error("AI route error:", error);

      res.status(500).json({
        success: false,
        message: "AI yanıtı alınamadı.",
      });
    }
  }
);

module.exports = router;