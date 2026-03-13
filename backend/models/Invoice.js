const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    gstRate: { type: Number, default: 18 }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, default: 'Walk-in Customer' },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
