import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialInvoices, initialProducts } from '../data/seed';
import { BillItem, Invoice, Product } from '../data/types';
import { productService } from '../services/productService';
import { invoiceService } from '../services/invoiceService';

type Ctx = {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => Promise<void>;
  billItems: BillItem[];
  setBillQty: (id: number, qty: number) => void;
  addBillItem: (item: BillItem) => void;
  totals: { subtotal: number; gst: number; discount: number; grandTotal: number };
  refreshData: () => Promise<void>;
};
const DataContext = createContext<Ctx | null>(null);

const baseBill: BillItem[] = [
  { productId: 101, title: 'Wireless Logitech Mouse', subtitle: 'M331 Silent Plus', price: 850, quantity: 2 },
  { productId: 102, title: 'USB-C Fast Charger', subtitle: '20W Power Adapter', price: 1200, quantity: 1 }
];

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState(initialProducts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [billItems, setBillItems] = useState(baseBill);

  const refreshData = async () => {
    try {
      const [productResp, invoiceResp] = await Promise.all([productService.list({ limit: 100 }), invoiceService.list()]);
      if (productResp?.data) {
        setProducts(
          productResp.data.map((p: any) => ({
            id: Number(String(p._id).slice(-6)),
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            expiry_date: p.expiryDate,
            barcode: p.barcode
          }))
        );
      }
      if (Array.isArray(invoiceResp)) {
        setInvoices(
          invoiceResp.map((i: any) => ({
            id: i.invoiceNumber,
            date: i.createdAt,
            total: i.total,
            customer: i.customerName,
            items: i.items.map((it: any) => ({
              productId: Number(String(it.productId).slice(-6)) || 0,
              title: it.name,
              subtitle: 'Invoice Item',
              price: it.price,
              quantity: it.quantity
            }))
          }))
        );
      }
    } catch (_error) {
      // backend may be unavailable in local UI-only mode
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      await productService.create({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        barcode: p.barcode,
        expiryDate: p.expiry_date,
        gstRate: 18
      });
      await refreshData();
    } catch {
      setProducts((prev) => [...prev, { ...p, id: Date.now() }]);
    }
  };

  const addInvoice = async (invoice: Invoice) => {
    try {
      await invoiceService.create({
        customerName: invoice.customer,
        items: invoice.items.map((it) => ({ productId: it.productId, quantity: it.quantity, gstRate: 18 })),
        discount: 122
      });
      await refreshData();
    } catch {
      setInvoices((prev) => [invoice, ...prev]);
    }
  };

  const setBillQty = (id: number, qty: number) =>
    setBillItems((prev) => prev.map((x) => (x.productId === id ? { ...x, quantity: Math.max(1, qty) } : x)));

  const addBillItem = (item: BillItem) => {
    setBillItems((prev) => {
      const existing = prev.find((x) => x.productId === item.productId);
      if (existing) {
        return prev.map((x) => (x.productId === item.productId ? { ...x, quantity: x.quantity + item.quantity } : x));
      }
      return [...prev, item];
    });
  };

  const totals = useMemo(() => {
    const subtotal = billItems.reduce((s, x) => s + x.price * x.quantity, 0);
    const gst = subtotal * 0.18;
    const discount = 122;
    const grandTotal = subtotal + gst - discount;
    return { subtotal, gst, discount, grandTotal };
  }, [billItems]);

  return (
    <DataContext.Provider value={{ products, addProduct, invoices, addInvoice, billItems, setBillQty, addBillItem, totals, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within provider');
  return ctx;
};
