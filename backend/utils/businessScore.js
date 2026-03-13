const calculateBusinessScore = ({ salesGrowth = 0, inventoryTurnover = 0, stockAvailability = 0, customerGrowth = 0 }) => {
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const score =
    clamp(salesGrowth) * 0.3 +
    clamp(inventoryTurnover) * 0.25 +
    clamp(stockAvailability) * 0.2 +
    clamp(customerGrowth) * 0.25;

  const rounded = Math.round(score);
  const status = rounded >= 80 ? 'Strong' : rounded >= 60 ? 'Stable' : 'Needs Attention';
  return { score: rounded, status };
};

module.exports = { calculateBusinessScore };
