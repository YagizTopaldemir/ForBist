const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.forbist_session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme gerekli.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Geçersiz veya süresi dolmuş oturum.",
    });
  }
};

module.exports = authMiddleware;