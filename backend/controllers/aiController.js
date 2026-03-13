const Product = require('../models/Product');
const {
  todaySales,
  topProduct,
  demand,
  inventorySummary,
  reorderRecommendations,
  weeklySales,
  expiryDiscounts
} = require('./analyticsController');

const mockRes = () => {
  const payload = { value: null };
  return {
    json: (v) => {
      payload.value = v;
      return v;
    },
    payload
  };
};

const queryAssistant = async (req, res) => {
  const { query = '' } = req.body;
  const q = query.toLowerCase();

  if (q.includes('top') || q.includes('most sold') || q.includes('sold the most this week')) {
    const wrapper = mockRes();
    await topProduct(req, wrapper);
    const top = wrapper.payload.value;
    const product = await Product.findOne({ name: top?.name });
    return res.json({
      reply: `${top.name} is your top product this week with ${top.quantity} units sold. Stock remaining is ${product?.stock ?? 'N/A'} units.`
    });
  }

  if (q.includes('run out') || q.includes('reorder')) {
    const wrapper = mockRes();
    await reorderRecommendations(req, wrapper);
    const first = wrapper.payload.value?.[0];
    if (!first) return res.json({ reply: 'No immediate reorder recommendations.' });
    return res.json({ reply: `${first.name} may run out in ${first.daysUntilEmpty} days. Recommended reorder: ${first.recommendedReorder} units.` });
  }

  if (q.includes('weekly revenue') || q.includes('weekly sales')) {
    const wrapper = mockRes();
    await weeklySales(req, wrapper);
    const total = wrapper.payload.value.reduce((s, d) => s + d.sales, 0);
    return res.json({ reply: `Your weekly revenue is ₹${total}.` });
  }

  if (q.includes('expiring')) {
    const wrapper = mockRes();
    await expiryDiscounts(req, wrapper);
    const first = wrapper.payload.value?.[0];
    if (!first) return res.json({ reply: 'No items are expiring soon.' });
    return res.json({ reply: `${first.name} is expiring in ${first.daysLeft} days. Suggested discount is ${first.discountPercentage}%.` });
  }

  if (q.includes('low stock')) {
    const items = await Product.find({ stock: { $lt: 20 } }).select('name stock');
    return res.json({ reply: `Low stock items: ${items.map((i) => `${i.name} (${i.stock})`).join(', ') || 'None'}` });
  }

  if (q.includes('today') && q.includes('sales')) {
    const wrapper = mockRes();
    await todaySales(req, wrapper);
    return res.json({ reply: `Today's revenue is ₹${wrapper.payload.value.totalRevenue}. Total invoices: ${wrapper.payload.value.totalInvoices}.` });
  }

  if (q.includes('inventory')) {
    const wrapper = mockRes();
    await inventorySummary(req, wrapper);
    return res.json({ reply: `Inventory has ${wrapper.payload.value.totalProducts} products and ${wrapper.payload.value.lowStockItems} low stock items.` });
  }

  if (q.includes('demand')) {
    const wrapper = mockRes();
    await demand(req, wrapper);
    return res.json({ reply: `Predicted demand next week is ₹${wrapper.payload.value.predictionNextWeek.toFixed(2)} based on average daily sales ₹${wrapper.payload.value.avgDailySales.toFixed(2)}.` });
  }

  return res.json({ reply: 'Ask me about top product, reorder advice, weekly revenue, expiring items, low stock, or demand prediction.' });
};

module.exports = { queryAssistant };
