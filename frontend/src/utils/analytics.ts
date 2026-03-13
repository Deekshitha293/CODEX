import { Invoice, Product } from '../data/types';

export const todaySales = (invoices: Invoice[]) => invoices.filter(i => new Date(i.date).toDateString()===new Date().toDateString()).reduce((s,i)=>s+i.total,0);
export const mostSoldProduct = (invoices: Invoice[]) => {
  const map = new Map<string, number>();
  invoices.flatMap(i=>i.items).forEach(item => map.set(item.title, (map.get(item.title) ?? 0) + item.quantity));
  const [name, qty] = [...map.entries()].sort((a,b)=>b[1]-a[1])[0] ?? ['N/A', 0];
  return { name, qty };
};
export const lowStock = (products: Product[]) => products.filter(p=>p.stock<20);
export const expiringInDays = (products: Product[], days:number) => products.filter(p=>((new Date(p.expiry_date).getTime()-Date.now())/86400000)<=days);
export const demandPrediction = (invoices: Invoice[]) => {
  const total7 = invoices.filter(i => Date.now() - new Date(i.date).getTime() <= 7*86400000).reduce((s,i)=>s+i.total,0);
  const avg = total7/7;
  return { average_daily_sales: avg, predicted_demand_next_week: avg*7, recommended_restock: Math.round(avg*7*0.7) };
};
