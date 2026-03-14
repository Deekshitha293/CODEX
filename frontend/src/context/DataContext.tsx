import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BillItem, Invoice, Product } from '../data/types';
import { productService } from '../services/productService';
import { invoiceService } from '../services/invoiceService';

type Notification = { event?: string; message?: string; [k: string]: any };

type Ctx = {
  products: Product[];
  invoices: Invoice[];
  billItems: BillItem[];
  notifications: Notification[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  setBillQty: (id: number, qty: number) => void;
  addBillItem: (item: BillItem) => void;
  totals: { subtotal: number; gst: number; discount: number; grandTotal: number };
  refreshData: () => Promise<void>;
};
const DataContext = createContext<Ctx | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshData = async () => {
    const [productResp, invoiceResp] = await Promise.all([productService.list({ limit: 100 }), invoiceService.list()]);
    if (productResp?.data) {
      const mapped = productResp.data.map((p: any) => ({
        id: Number(String(p._id).slice(-6)),
        mongoId: String(p._id),
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        expiry_date: p.expiryDate,
        barcode: p.barcode || ''
      }));
      setProducts(mapped);
      if (!billItems.length) {
        setBillItems(
          mapped.slice(0, 5).map((p: Product) => ({
            productId: p.id,
            mongoId: p.mongoId,
            title: p.name,
            subtitle: p.category,
            price: p.price,
            quantity: 1
          }))
        );
      }
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
            mongoId: String(it.productId),
            title: it.name,
            subtitle: 'Invoice Item',
            price: it.price,
            quantity: it.quantity
          }))
        }))
      );
    }
  };

  useEffect(() => {
    refreshData().catch(() => undefined);

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    import('socket.io-client').then(({ io }) => {
      const socket = io(socketUrl, { transports: ['websocket'] });
      ['low-stock', 'expiry-alert', 'new-invoice', 'sales-milestone', 'notification'].forEach((event) => {
        socket.on(event, (payload: Notification) => setNotifications((prev) => [payload, ...prev].slice(0, 20)));
      });
      socket.on('new-invoice', () => refreshData().catch(() => undefined));
    });
  }, []);

  const addProduct = async (p: Omit<Product, 'id'>) => {
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
  };

  const addInvoice = async (invoice: Invoice) => {
    await invoiceService.create({
      customerName: invoice.customer,
      items: invoice.items.map((it) => ({ productId: it.mongoId, quantity: it.quantity, gstRate: 18, name: it.title })),
      discount: 0
    });
    await refreshData();
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
    const discount = 0;
    const grandTotal = subtotal + gst - discount;
    return { subtotal, gst, discount, grandTotal };
  }, [billItems]);

  return (
    <DataContext.Provider value={{ products, addProduct, invoices, addInvoice, billItems, setBillQty, addBillItem, totals, refreshData, notifications }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within provider');
  return ctx;
};
