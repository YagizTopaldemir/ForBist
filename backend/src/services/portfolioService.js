const getPortfolioSummary = async (
  db,
  userId,
  prices
) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      symbol,
      quantity,
      average_price
    FROM portfolios
    WHERE user_id = ?
    ORDER BY symbol ASC
    `,
    [userId]
  );

  let totalValue = 0;
  let totalCost = 0;

  const holdings = rows.map((stock) => {
    const quantity = Number(stock.quantity);
    const averagePrice = Number(stock.average_price);

    const marketData = prices[stock.symbol];

    const currentPrice =
      marketData?.currentPrice || 0;

    const dailyChangePercent =
      marketData?.changePercent || 0;

    const value = quantity * currentPrice;
    const cost = quantity * averagePrice;
    const profitLoss = value - cost;

    const profitLossPercent =
      cost > 0
        ? (profitLoss / cost) * 100
        : 0;

    totalValue += value;
    totalCost += cost;

    return {
      id: stock.id,
      symbol: stock.symbol,
      quantity,
      averagePrice,
      currentPrice,
      value,
      profitLoss,
      profitLossPercent,
      dailyChangePercent,
    };
  });

  const profitLoss =
    totalValue - totalCost;

  const profitLossPercent =
    totalCost > 0
      ? (profitLoss / totalCost) * 100
      : 0;

  return {
    totalValue,
    totalCost,
    profitLoss,
    profitLossPercent,
    holdings,
  };
};


const getPortfolioHistory = async (db, userId) => {
  const [rows] = await db.query(
    `
    SELECT
      DATE(transaction_date) AS date,
      type,
      quantity,
      price
    FROM transactions
    WHERE user_id = ?
    ORDER BY transaction_date ASC
    `,
    [userId]
  );

  let total = 0;

  const history = [];

  for (const transaction of rows) {
    const quantity = Number(transaction.quantity);
    const price = Number(transaction.price);

    const amount = quantity * price;

    if (transaction.type === "BUY") {
      total += amount;
    }

    if (transaction.type === "SELL") {
      total -= amount;
    }

    history.push({
      name: new Date(transaction.date).toLocaleDateString(
        "tr-TR",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      value: total,
    });
  }

  return history;
};

module.exports = {
  getPortfolioSummary,
  getPortfolioHistory,
};