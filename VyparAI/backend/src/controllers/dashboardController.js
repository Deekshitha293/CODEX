import { Bill } from '../models/Bill.js';
import { Product } from '../models/Product.js';

export const getDashboardSummary = async (req, res) => {
  const [salesCount, revenueAgg, lowStockProducts] = await Promise.all([
    Bill.countDocuments(),
    Bill.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
    Product.find({ quantity: { $lte: 5 } }).select('name quantity').sort({ quantity: 1 }),
  ]);

  res.json({
    totalSales: salesCount,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  });
};
