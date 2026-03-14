export type Product = {
  id: number;
  mongoId?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiry_date: string;
  barcode: string;
};

export type BillItem = {
  productId: number;
  mongoId?: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
};

export type Invoice = { id: string; date: string; total: number; customer: string; items: BillItem[] };
