const db = require("../config/db");
const { z } = require("zod");

const transactionSchema = z.object({
  symbol: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{1,10}$/, "Geçersiz hisse sembolü."),

  type: z.enum(["BUY", "SELL"]),

  quantity: z
    .number()
    .positive("Miktar 0'dan büyük olmalı."),

  price: z
    .number()
    .positive("Fiyat 0'dan büyük olmalı."),

  transactionDate: z
    .string()
    .datetime()
    .optional(),
});

const {
  getTransactions: getTransactionsService,
} = require("../services/transactionService");


const createTransaction = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz işlem bilgileri.",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const {
      symbol,
      type,
      quantity,
      price,
      transactionDate,
    } = result.data;

    const userId = req.user.id;

    await connection.beginTransaction();

    /*
      İşlemi kaydet
    */
    await connection.query(
      `
      INSERT INTO transactions
      (
        user_id,
        symbol,
        type,
        quantity,
        price,
        transaction_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        symbol,
        type,
        quantity,
        price,
        transactionDate
          ? new Date(transactionDate)
          : new Date(),
      ]
    );

    /*
      Mevcut portföyü kilitleyerek al.
      Aynı anda iki işlem gelirse race condition
      riskini azaltıyoruz.
    */
    const [portfolioRows] = await connection.query(
      `
      SELECT id, quantity, average_price
      FROM portfolios
      WHERE user_id = ?
        AND symbol = ?
      FOR UPDATE
      `,
      [userId, symbol]
    );

    const existing = portfolioRows[0];

    if (type === "BUY") {
      if (!existing) {
        await connection.query(
          `
          INSERT INTO portfolios
          (
            user_id,
            symbol,
            quantity,
            average_price
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            userId,
            symbol,
            quantity,
            price,
          ]
        );
      } else {
        const oldQuantity = Number(existing.quantity);
        const oldAverage = Number(existing.average_price);

        const newQuantity = oldQuantity + quantity;

        const newAverage =
          (
            oldQuantity * oldAverage +
            quantity * price
          ) / newQuantity;

        await connection.query(
          `
          UPDATE portfolios
          SET
            quantity = ?,
            average_price = ?
          WHERE id = ?
          `,
          [
            newQuantity,
            newAverage,
            existing.id,
          ]
        );
      }
    }

    if (type === "SELL") {
      if (!existing) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "Bu hisseden portföyünüzde bulunmuyor.",
        });
      }

      const currentQuantity = Number(existing.quantity);

      if (quantity > currentQuantity) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "Yetersiz hisse miktarı.",
        });
      }

      const newQuantity =
        currentQuantity - quantity;

      if (newQuantity === 0) {
        await connection.query(
          `
          DELETE FROM portfolios
          WHERE id = ?
          `,
          [existing.id]
        );
      } else {
        await connection.query(
          `
          UPDATE portfolios
          SET quantity = ?
          WHERE id = ?
          `,
          [
            newQuantity,
            existing.id,
          ]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "İşlem başarıyla kaydedildi.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Transaction error:", error);

    res.status(500).json({
      success: false,
      message: "İşlem kaydedilemedi.",
    });
  } finally {
    connection.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const data = await getTransactionsService(req.user.id);

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Transaction Error:", error);

    res.status(500).json({
      success: false,
      message: "İşlemler alınamadı.",
    });
  }
};

module.exports = {
  createTransaction,
   getTransactions,
};