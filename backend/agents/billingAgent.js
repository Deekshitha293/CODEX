const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Sale = require('../models/Sale');
const { calculateGST } = require('../utils/gstCalculator');
const { emitEvent } = require('./notificationAgent');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments();
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
};

const resolveProduct = async (item) => {
  if (item.productId && typeof item.productId === 'string' && item.productId.length >= 12) {
    return Product.findById(item.productId);
  }
  if (item.barcode) return Product.findOne({ barcode: item.barcode });
  if (item.name) return Product.findOne({ name: item.name });
  return null;
};

const processInvoice = async ({ req, customerName, items = [], discount = 0 }) => {
  const normalized = [];
  let subtotal = 0;
  let gst = 0;

  for (const item of items) {
    const product = await resolveProduct(item);
    if (!product) throw new Error(`Product not found for line item: ${item.productId || item.name || item.barcode}`);

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

  emitEvent(req.app.locals.io, 'new-invoice', {
    invoiceNumber: invoice.invoiceNumber,
    total,
    customerName: invoice.customerName,
    encryptedTotal: req.app.locals.encryptSensitive?.(String(total))
  });

  if (total >= 10000) {
    emitEvent(req.app.locals.io, 'sales-milestone', {
      invoiceNumber: invoice.invoiceNumber,
      total,
      message: `Sales milestone reached with ${invoice.invoiceNumber}`
    });
  }

  return invoice;
};

module.exports = { processInvoice };
