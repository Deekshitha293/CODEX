const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { calculateGST } = require('../utils/gstCalculator');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments();
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
};

const createInvoice = async (req, res) => {
  const { customerName, items = [], discount = 0 } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required' });
  }

  const normalized = [];
  let subtotal = 0;
  let gst = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
    const quantity = Number(item.quantity || 1);
    const lineTotal = product.price * quantity;
    const lineGst = calculateGST(lineTotal, item.gstRate || product.gstRate || 18);

    subtotal += lineTotal;
    gst += lineGst;

    normalized.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      gstRate: item.gstRate || product.gstRate || 18
    });

    product.stock = Math.max(0, product.stock - quantity);
    await product.save();
    await Sale.create({ productId: product._id, quantity, revenue: lineTotal, date: new Date() });
  }

  const total = subtotal + gst - Number(discount || 0);
  const invoice = await Invoice.create({
    invoiceNumber: await generateInvoiceNumber(),
    customerName,
    items: normalized,
    subtotal,
    gst,
    discount,
    total
  });

  if (total >= 10000) {
    req.app.locals.io?.emit('notification', { type: 'sales_milestone', message: `🎉 Sales milestone reached: invoice ${invoice.invoiceNumber} worth ₹${Math.round(total)}` });
  }

  res.status(201).json(invoice);
};

const getInvoices = async (_req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
};

module.exports = { createInvoice, getInvoices };
