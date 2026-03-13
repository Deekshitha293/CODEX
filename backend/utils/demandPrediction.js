const predictDemand = (salesRows) => {
  const last7DaysRevenue = salesRows.reduce((sum, row) => sum + row.revenue, 0);
  const avgDailySales = last7DaysRevenue / 7;
  const predictionNextWeek = avgDailySales * 7;
  return { avgDailySales, predictionNextWeek };
};

module.exports = { predictDemand };
