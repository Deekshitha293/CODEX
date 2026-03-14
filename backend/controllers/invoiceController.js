const Invoice = require('../models/Invoice');
const { processInvoice } = require('../agents/billingAgent');

const createInvoice = async (req, res) => {
  const { customerName, items = [], discount = 0 } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required' });
  }

  try {
    const invoice = await processInvoice({ req, customerName, items, discount });
    return res.status(201).json(invoice);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getInvoices = async (_req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
};

module.exports = { createInvoice, getInvoices };
