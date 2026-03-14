const Product = require('../models/Product');
const { askGPT } = require('../agents/assistantAgent');
const {
  todaySales,
  topProduct,
  demand,
  inventorySummary,
  reorderRecommendations,
  weeklySales,
  expiryDiscounts,
  forecast
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

  const wrappers = {
    inventory: mockRes(),
    top: mockRes(),
    reorder: mockRes(),
    expiry: mockRes(),
    forecast: mockRes()
  };

  await Promise.all([
    inventorySummary(req, wrappers.inventory),
    topProduct(req, wrappers.top),
    reorderRecommendations(req, wrappers.reorder),
    expiryDiscounts(req, wrappers.expiry),
    forecast(req, wrappers.forecast)
  ]);

  const gptReply = await askGPT({
    query,
    context: {
      inventorySummary: wrappers.inventory.payload.value,
      topProduct: wrappers.top.payload.value,
      reorder: wrappers.reorder.payload.value,
      expiry: wrappers.expiry.payload.value,
      forecast: wrappers.forecast.payload.value
    }
  });

  if (gptReply) return res.json({ reply: gptReply, source: 'gpt' });

  if (q.includes('top') || q.includes('most sold')) {
    const top = wrappers.top.payload.value;
    const product = await Product.findOne({ name: top?.name });
    return res.json({
      reply: `${top.name} is top-selling with ${top.quantity} units. Remaining stock: ${product?.stock ?? 'N/A'} units.`,
      source: 'rules'
    });
  }

  if (q.includes('run out') || q.includes('reorder')) {
    const first = wrappers.reorder.payload.value?.[0];
    if (!first) return res.json({ reply: 'No immediate reorder recommendations.', source: 'rules' });
    return res.json({ reply: `${first.name} may run out in ${first.daysUntilEmpty} days. Reorder ${first.recommendedReorder} units.`, source: 'rules' });
  }

  if (q.includes('weekly revenue') || q.includes('weekly sales')) {
    const wrapper = mockRes();
    await weeklySales(req, wrapper);
    const total = wrapper.payload.value.reduce((s, d) => s + d.sales, 0);
    return res.json({ reply: `Your weekly revenue is ₹${total}.`, source: 'rules' });
  }

  if (q.includes('expiring')) {
    const first = wrappers.expiry.payload.value?.[0];
    if (!first) return res.json({ reply: 'No items are expiring soon.', source: 'rules' });
    return res.json({ reply: `${first.name} expires in ${first.daysLeft} days. Suggested discount ${first.discountPercentage}%.`, source: 'rules' });
  }

  if (q.includes('today') && q.includes('sales')) {
    const wrapper = mockRes();
    await todaySales(req, wrapper);
    return res.json({ reply: `Today's revenue is ₹${wrapper.payload.value.totalRevenue}. Invoices: ${wrapper.payload.value.totalInvoices}.`, source: 'rules' });
  }

  if (q.includes('demand')) {
    const wrapper = mockRes();
    await demand(req, wrapper);
    return res.json({ reply: `Predicted next-week demand is ₹${wrapper.payload.value.predictionNextWeek.toFixed(2)}.`, source: 'rules' });
  }

  return res.json({ reply: 'Ask about top product, reorder, weekly sales, expiring items, demand prediction, or business score.', source: 'rules' });
};

module.exports = { queryAssistant };
