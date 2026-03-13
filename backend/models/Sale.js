const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true },
    revenue: { type: Number, required: true }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Sale', saleSchema);
