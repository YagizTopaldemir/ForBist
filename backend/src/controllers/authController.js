const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const db = require("../config/db");

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "İsim en az 2 karakter olmalı.")
      .max(100, "İsim çok uzun."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Geçerli bir email girin.")
      .max(255),

    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .max(128, "Şifre çok uzun."),
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Geçerli bir email girin."),

    password: z
      .string()
      .min(1, "Şifre gerekli."),
  })
  .strict();


  const logout = (req, res) => {
  res.clearCookie("forbist_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.json({
    success: true,
    message: "Çıkış başarılı.",
  });
};

const register = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz bilgiler.",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = result.data;

    // Parameterized query -> SQL injection'a karşı güvenli
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bu email zaten kayıtlı.",
      });
    }

    // Şifreyi plain text olarak ASLA database'e kaydetme
    const passwordHash = await bcrypt.hash(password, 12);

    const [resultDb] = await db.query(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı.",
      user: {
        id: resultDb.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Kayıt sırasında bir hata oluştu.",
    });
  }
};

const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
  return res.status(400).json({
    success: false,
    message: "Gönderilen bilgiler geçersiz.",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

    const { email, password } = result.data;

    const [users] = await db.query(
      `SELECT id, name, email, password
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET tanımlanmamış.");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.cookie("forbist_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

res.json({
  success: true,
  message: "Giriş başarılı.",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Giriş sırasında bir hata oluştu.",
    });
  }
};

const me = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    res.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Me error:", error);

    res.status(500).json({
      success: false,
      message: "Kullanıcı bilgileri alınamadı.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, notifications, marketAlerts } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Geçerli bir ad giriniz.",
      });
    }

    if (
      typeof notifications !== "boolean" ||
      typeof marketAlerts !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz bildirim ayarı.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        notifications_enabled = ?,
        market_alerts_enabled = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        notifications,
        marketAlerts,
        userId,
      ]
    );

    res.json({
      success: true,
      message: "Profil ayarları güncellendi.",
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Profil güncellenemedi.",
    });
  }
};

module.exports = {
  register,
  login,
  me,
  logout,
  updateProfile 
};