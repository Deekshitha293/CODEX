import { invoices, products, sales7Days } from '../data/mockData';

export const todaysSales = () => invoices.filter((i) => i.date === new Date().toISOString().slice(0, 10)).reduce((a, c) => a + c.total, 0);

export const mostSoldProduct = () => {
  const grouped = invoices.flatMap((i) => i.items).reduce<Record<string, number>>((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.qty;
    return acc;
  }, {});
  return Object.entries(grouped).sort((a, b) => b[1] - a[1])[0];
};

export const lowStockProducts = () => products.filter((p) => p.stock < 20);

export const demandPrediction = () => {
  const last7 = sales7Days.reduce((a, c) => a + c, 0);
  const average_daily_sales = last7 / 7;
  const predicted_next_week = average_daily_sales * 7;
  return { average_daily_sales, predicted_next_week };
};
