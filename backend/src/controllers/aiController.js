const { chatWithAI } = require("../services/aiService");

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mesaj boş olamaz.",
      });
    }

    const response = await chatWithAI(
      message.trim(),
      userId
    );

    return res.status(200).json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI yanıtı alınamadı.",
    });
  }
};

module.exports = {
  chat,
};