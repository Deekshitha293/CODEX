const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    barcode: { type: String, index: true },
    expiryDate: { type: Date, required: true },
    gstRate: { type: Number, default: 18 },
    status: { type: String, enum: ['NORMAL', 'LOW_STOCK'], default: 'NORMAL' }
  },
  { timestamps: true }
);

productSchema.pre('save', function stockStatus(next) {
  this.status = this.stock < 20 ? 'LOW_STOCK' : 'NORMAL';
  next();
});

module.exports = mongoose.model('Product', productSchema);
