const { buildReorderRecommendations } = require('../utils/reorderEngine');
const { emitEvent } = require('./notificationAgent');

const monitorInventory = async ({ io, products }) => {
  const lowStock = products.filter((p) => p.stock < 20);
  lowStock.forEach((product) => {
    emitEvent(io, 'low-stock', {
      type: 'low_stock',
      productId: product._id,
      productName: product.name,
      stock: product.stock,
      message: `Low stock: ${product.name} has ${product.stock} units left`
    });
  });

  const reorderRecommendations = await buildReorderRecommendations(products);
  return { lowStockCount: lowStock.length, reorderRecommendations };
};

module.exports = { monitorInventory };
