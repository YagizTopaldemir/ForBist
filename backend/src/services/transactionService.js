const db = require("../config/db");

const getTransactions = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      symbol,
      type,
      quantity,
      price,
      transaction_date AS transactionDate,
      created_at AS createdAt
    FROM transactions
    WHERE user_id = ?
    ORDER BY transaction_date DESC, id DESC
    `,
    [userId]
  );

  return rows;
};

module.exports = {
  getTransactions,
};