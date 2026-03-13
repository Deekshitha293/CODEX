export type Invoice = { id: string; customer: string; total: number; date: string; items: { name: string; qty: number }[] };
export type Product = { name: string; category: string; stock: number; expiry: string; price: number };

export const invoices: Invoice[] = [
  { id: 'INV-20240601', customer: 'Rahul', total: 3300, date: new Date().toISOString().slice(0, 10), items: [{ name: 'Milk', qty: 12 }, { name: 'Wireless Logitech Mouse', qty: 2 }] },
  { id: 'INV-20240602', customer: 'Sneha', total: 2200, date: new Date().toISOString().slice(0, 10), items: [{ name: 'Milk', qty: 20 }] },
];

export const products: Product[] = [
  { name: 'Whole Wheat Flour', category: 'Grocery', stock: 12, expiry: '2026-12-15', price: 50 },
  { name: 'Extra Virgin Olive Oil', category: 'Essentials', stock: 85, expiry: '2027-05-02', price: 1200 },
  { name: 'Organic Whole Milk 1L', category: 'Dairy', stock: 24, expiry: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10), price: 60 },
];

export const sales7Days = [6400, 7200, 10800, 9300, 12450, 11500, 12650];
