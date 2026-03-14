const { getExpiryDiscount } = require('../utils/expiryDiscount');
const { emitEvent } = require('./notificationAgent');

const monitorExpiry = ({ io, products }) => {
  const expiring = products
    .map((p) => ({ ...p.toObject?.() || p, ...getExpiryDiscount(p.expiryDate) }))
    .filter((p) => p.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  expiring.forEach((product) => {
    emitEvent(io, 'expiry-alert', {
      type: product.daysLeft <= 7 ? 'CRITICAL' : 'WARNING',
      productId: product._id,
      productName: product.name,
      daysLeft: product.daysLeft,
      discountPercentage: product.discountPercentage,
      message: `${product.name} expires in ${product.daysLeft} days`
    });
  });

  return expiring;
};

module.exports = { monitorExpiry };
