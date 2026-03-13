const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const { page = 1, limit = 10, category, search, barcode } = req.query;
  const query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (barcode) query.barcode = barcode;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(query)
  ]);

  res.json({ page: Number(page), limit: Number(limit), total, data: products });
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  if (product.stock < 20) req.app.locals.io?.emit('notification', { type: 'low_stock', message: `⚠️ ${product.name} stock low: ${product.stock} units remaining` });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, req.body);
  await product.save();
  if (product.stock < 20) req.app.locals.io?.emit('notification', { type: 'low_stock', message: `⚠️ ${product.name} stock low: ${product.stock} units remaining` });
  const daysRemaining = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysRemaining <= 7) req.app.locals.io?.emit('notification', { type: 'expiry_alert', message: `⚠️ ${product.name} expiring in ${daysRemaining} days` });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

const expiryAlerts = async (_req, res) => {
  const products = await Product.find();
  const now = Date.now();
  const alerts = products
    .map((p) => {
      const daysRemaining = Math.ceil((new Date(p.expiryDate).getTime() - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining < 7 ? 'CRITICAL' : daysRemaining < 30 ? 'WARNING' : 'NORMAL';
      return { ...p.toObject(), daysRemaining, severity };
    })
    .filter((p) => p.severity !== 'NORMAL');

  res.json(alerts);
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, expiryAlerts };
