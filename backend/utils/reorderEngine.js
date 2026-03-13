const Sale = require('../models/Sale');

const buildReorderRecommendations = async (products) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sales = await Sale.aggregate([
    { $match: { date: { $gte: since } } },
    { $group: { _id: '$productId', qty: { $sum: '$quantity' } } }
  ]);

  const salesMap = new Map(sales.map((s) => [String(s._id), s.qty]));
  return products
    .map((product) => {
      const last7Qty = salesMap.get(String(product._id)) || 0;
      const dailySales = last7Qty / 7;
      const daysUntilEmpty = dailySales > 0 ? product.stock / dailySales : Infinity;
      if (daysUntilEmpty >= 5) return null;

      return {
        productId: product._id,
        name: product.name,
        currentStock: product.stock,
        averageDailySales: Number(dailySales.toFixed(2)),
        daysUntilEmpty: Number(daysUntilEmpty.toFixed(2)),
        recommendedReorder: Math.max(Math.ceil(dailySales * 7), 20)
      };
    })
    .filter(Boolean);
};

module.exports = { buildReorderRecommendations };
