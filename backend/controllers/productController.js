const Product = require('../models/Product');
const { monitorInventory } = require('../agents/inventoryAgent');
const { monitorExpiry } = require('../agents/expiryAgent');

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
  await monitorInventory({ io: req.app.locals.io, products: [product] });
  monitorExpiry({ io: req.app.locals.io, products: [product] });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, req.body);
  await product.save();
  await monitorInventory({ io: req.app.locals.io, products: [product] });
  monitorExpiry({ io: req.app.locals.io, products: [product] });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

const expiryAlerts = async (_req, res) => {
  const products = await Product.find();
  const alerts = monitorExpiry({ io: null, products }).filter((p) => p.daysLeft <= 30);
  res.json(
    alerts.map((p) => ({
      ...p,
      severity: p.daysLeft < 7 ? 'CRITICAL' : 'WARNING'
    }))
  );
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, expiryAlerts };
