const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { predictDemand } = require('../utils/demandPrediction');
const { buildReorderRecommendations } = require('../utils/reorderEngine');
const { getExpiryDiscount } = require('../utils/expiryDiscount');
const { linearRegressionForecast } = require('../utils/forecastModel');
const { calculateBusinessScore } = require('../utils/businessScore');

const todaySales = async (_req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const invoices = await Invoice.find({ createdAt: { $gte: start } });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const customers = [...new Set(invoices.map((i) => i.customerName).filter(Boolean))].length;
  res.json({ totalRevenue, totalInvoices: invoices.length, customers });
};

const topProduct = async (_req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await Sale.aggregate([
    { $match: { date: { $gte: since } } },
    { $group: { _id: '$productId', quantity: { $sum: '$quantity' }, revenue: { $sum: '$revenue' } } },
    { $sort: { quantity: -1 } },
    { $limit: 1 },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
  ]);

  if (!result.length) return res.json({ name: 'N/A', quantity: 0, revenue: 0 });
  res.json({ name: result[0].product?.name || 'Unknown', quantity: result[0].quantity, revenue: result[0].revenue });
};

const demand = async (_req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const salesRows = await Sale.find({ date: { $gte: since } });
  const prediction = predictDemand(salesRows);
  res.json(prediction);
};

const inventorySummary = async (_req, res) => {
  const [count, lowStockCount] = await Promise.all([Product.countDocuments(), Product.countDocuments({ stock: { $lt: 20 } })]);
  res.json({ totalProducts: count, lowStockItems: lowStockCount });
};

const reorderRecommendations = async (_req, res) => {
  const products = await Product.find();
  const recommendations = await buildReorderRecommendations(products);
  res.json(recommendations);
};

const expiryDiscounts = async (_req, res) => {
  const products = await Product.find();
  const data = products
    .map((p) => ({ ...p.toObject(), ...getExpiryDiscount(p.expiryDate) }))
    .filter((p) => p.discountPercentage > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  res.json(data);
};

const weeklySales = async (_req, res) => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);

  const invoices = await Invoice.find({ createdAt: { $gte: start } });
  const map = new Map();
  invoices.forEach((inv) => {
    const day = labels[new Date(inv.createdAt).getDay()];
    map.set(day, (map.get(day) || 0) + inv.total);
  });

  const series = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    const label = labels[date.getDay()];
    return { day: label, sales: map.get(label) || 0 };
  });

  res.json(series);
};

const customerInsights = async (_req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: 1 });
  const customerMap = new Map();
  let repeatCustomers = 0;
  let newCustomers = 0;

  invoices.forEach((inv) => {
    const key = inv.customerName || 'Walk-in Customer';
    const count = customerMap.get(key) || 0;
    if (count === 0) newCustomers += 1;
    if (count === 1) repeatCustomers += 1;
    customerMap.set(key, count + 1);
  });

  const avgBillValue = invoices.length ? invoices.reduce((sum, i) => sum + i.total, 0) / invoices.length : 0;
  res.json({ repeatCustomers, newCustomers, avgBillValue: Number(avgBillValue.toFixed(2)) });
};

const forecast = async (_req, res) => {
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const invoices = await Invoice.find({ createdAt: { $gte: start } });
  const daily = new Array(30).fill(0);
  invoices.forEach((inv) => {
    const diff = Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    const idx = 29 - diff;
    if (idx >= 0 && idx < 30) daily[idx] += inv.total;
  });
  const predictedNext7Days = await linearRegressionForecast(daily);
  res.json({ last30daysSales: daily, predictedNext7Days });
};

const businessScore = async (_req, res) => {
  const now = Date.now();
  const last7Start = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const prev7Start = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [last7, prev7, products, insights] = await Promise.all([
    Invoice.find({ createdAt: { $gte: last7Start } }),
    Invoice.find({ createdAt: { $gte: prev7Start, $lt: last7Start } }),
    Product.find(),
    Invoice.find().select('customerName total')
  ]);

  const salesLast = last7.reduce((s, i) => s + i.total, 0);
  const salesPrev = prev7.reduce((s, i) => s + i.total, 0) || 1;
  const salesGrowth = Math.max(0, Math.min(100, ((salesLast - salesPrev) / salesPrev) * 100 + 50));

  const soldQty = await Sale.aggregate([{ $match: { date: { $gte: last7Start } } }, { $group: { _id: null, total: { $sum: '$quantity' } } }]);
  const totalStock = products.reduce((s, p) => s + p.stock, 0) || 1;
  const inventoryTurnover = Math.min(100, (((soldQty[0]?.total || 0) / totalStock) * 100));
  const stockAvailability = Math.max(0, 100 - (products.filter((p) => p.stock < 20).length / Math.max(products.length, 1)) * 100);

  const customerCounts = insights.reduce((map, inv) => map.set(inv.customerName || 'Walk-in', (map.get(inv.customerName || 'Walk-in') || 0) + 1), new Map());
  const repeat = Array.from(customerCounts.values()).filter((v) => v > 1).length;
  const customerGrowth = Math.min(100, repeat * 10 + 40);

  res.json(calculateBusinessScore({ salesGrowth, inventoryTurnover, stockAvailability, customerGrowth }));
};

const adminSummary = async (_req, res) => {
  const [totalUsers, totalSalesRows, totalRevenueRows] = await Promise.all([
    require('../models/User').countDocuments(),
    Sale.aggregate([{ $group: { _id: null, totalQty: { $sum: '$quantity' } } }]),
    Invoice.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }])
  ]);

  res.json({
    totalUsers,
    totalSalesQuantity: totalSalesRows[0]?.totalQty || 0,
    totalRevenue: totalRevenueRows[0]?.totalRevenue || 0,
    systemHealth: 'Healthy'
  });
};

module.exports = {
  todaySales,
  topProduct,
  demand,
  inventorySummary,
  reorderRecommendations,
  expiryDiscounts,
  weeklySales,
  customerInsights,
  forecast,
  businessScore,
  adminSummary
};
