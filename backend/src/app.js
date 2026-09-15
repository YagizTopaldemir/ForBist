const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const OpenAI = require("openai");

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
const ipoRoutes = require("./routes/ipoRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const marketRoutes = require("./routes/marketRoutes");
const newsRoutes = require("./routes/newsRoutes");
const app = express();

// Reverse proxy'nin arkasında çalışırken gerçek istemci IP'sini
// ve HTTPS durumunu doğru okumak için (rate limit + secure cookie).
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.use(cookieParser());

app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 35,
  standardHeaders: true,
  legacyHeaders: false,
});

// AI sohbeti her istekte OpenAI çağrısı yapıyor (maliyetli),
// bu yüzden genel limitten daha sıkı bir limit uygulanıyor.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/ai", aiLimiter);
app.use("/api", apiLimiter);
app.use("/api/market", marketRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ipos", ipoRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);


module.exports = app;