import { Card, SearchBar, Button, BottomNav } from '../components/ui';
import { useData } from '../context/DataContext';
import { Receipt, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { productService } from '../services/productService';

type SpeechRecognitionType = {
  lang: string;
  start: () => void;
  onresult: ((event: any) => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

export default function Billing() {
  const { billItems, setBillQty, totals, addInvoice, addBillItem } = useData();
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState('Add 5 units of Wireless Mouse');
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const indexed = useMemo(
    () => billItems.reduce<Record<string, (typeof billItems)[number]>>((acc, item) => ({ ...acc, [item.title.toLowerCase()]: item }), {}),
    [billItems]
  );

  const addByBarcode = async (barcode: string) => {
    try {
      const result = await productService.list({ barcode, limit: 1 });
      const product = result?.data?.[0];
      if (!product) return;
      addBillItem({
        productId: Number(String(product._id).slice(-6)),
        mongoId: String(product._id),
        title: product.name,
        subtitle: product.category,
        price: product.price,
        quantity: 1
      });
      setLastCommand(`Scanned: ${barcode}`);
    } catch {
      // no-op fallback
    }
  };

  const startBarcodeScanner = async () => {
    setScannerOpen(true);
    const Quagga = (await import('quagga')).default;
    if (!scannerRef.current) return;

    Quagga.init(
      {
        inputStream: { type: 'LiveStream', target: scannerRef.current, constraints: { facingMode: 'environment' } },
        decoder: { readers: ['ean_reader', 'code_128_reader', 'upc_reader'] }
      },
      (err: any) => {
        if (err) return;
        Quagga.start();
      }
    );

    Quagga.onDetected(async (data: any) => {
      const code = data?.codeResult?.code;
      if (!code) return;
      await addByBarcode(code);
      Quagga.stop();
      Quagga.offDetected();
      setScannerOpen(false);
    });
  };

  const stopBarcodeScanner = async () => {
    const Quagga = (await import('quagga')).default;
    Quagga.stop();
    Quagga.offDetected();
    setScannerOpen(false);
  };

  const applyVoiceCommand = (command: string) => {
    const text = command.toLowerCase().trim();
    if (!text) return;
    setLastCommand(command);

    if (text.includes('clear bill')) {
      billItems.forEach((item) => setBillQty(item.productId, 1));
      return;
    }

    const addMatch = text.match(/add\s+(\d+)\s+(.+)/i);
    if (addMatch) {
      const qty = Number(addMatch[1]);
      const productName = addMatch[2].replace('units of', '').trim();
      const target = Object.values(indexed).find((it) => productName.includes(it.title.toLowerCase().split(' ')[0]));
      if (target) setBillQty(target.productId, target.quantity + qty);
      return;
    }

    const removeMatch = text.match(/remove\s+(.+)/i);
    if (removeMatch) {
      const productName = removeMatch[1].trim();
      const target = Object.values(indexed).find((it) => productName.includes(it.title.toLowerCase().split(' ')[0]));
      if (target) setBillQty(target.productId, 1);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      applyVoiceCommand(transcript);
    };
    recognition.start();
  };

  const makeInvoice = async () => {
    await addInvoice({ id: `INV-${Date.now()}`, date: new Date().toISOString(), customer: 'Walk-in', total: Math.round(totals.grandTotal), items: billItems });
    setOpen(true);
  };

  return (
    <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4 pb-28'>
      <header className='flex justify-between'>
        <span>←</span>
        <h1 className='font-bold'>Create New Bill</h1>
        <span>⋮</span>
      </header>
      <Card className='mt-4 p-5 text-center'>
        <button onClick={startListening} className='h-16 w-16 rounded-full bg-brand-primary text-white text-2xl'>🎤</button>
        <p className='font-bold mt-2'>TAP TO SPEAK BILL</p>
        <p className='text-xs text-slate-500'>{lastCommand}</p>
      </Card>
      <div className='mt-3'>
        <SearchBar placeholder='Search products or scan barcode' rightIcon={<button onClick={startBarcodeScanner}>📷</button>} />
      </div>
      <div className='flex gap-2 mt-3'>{['All Categories', 'Electronics', 'Groceries'].map((p, i) => <button key={p} className={`px-3 py-2 rounded-full text-xs ${i === 0 ? 'bg-brand-primary text-white' : 'bg-slate-200'}`}>{p}</button>)}</div>
      <div className='flex justify-between mt-4'><h3 className='font-bold'>Items in Bill</h3><span className='text-xs bg-slate-200 px-2 py-1 rounded-full'>{billItems.length} Items</span></div>
      <div className='space-y-3 mt-2'>{billItems.map((it) => <Card key={it.productId} className='p-3 flex justify-between gap-2'><div className='flex gap-2'><div className='h-12 w-12 rounded-xl bg-slate-100' /><div><p className='font-semibold text-sm'>{it.title}</p><p className='text-xs text-slate-500'>{it.subtitle}</p><p className='font-bold'>₹{it.price}</p></div></div><div className='text-right'><div className='flex items-center gap-1'><button onClick={() => setBillQty(it.productId, it.quantity - 1)} className='px-2 bg-slate-200 rounded'>-</button><span>{String(it.quantity).padStart(2, '0')}</span><button onClick={() => setBillQty(it.productId, it.quantity + 1)} className='px-2 bg-slate-200 rounded'>+</button></div><Trash2 size={14} className='ml-auto mt-2' /></div></Card>)}</div>
      <button className='w-full border-2 border-dashed border-brand-primary rounded-card p-3 mt-3 text-brand-primary'>+ Add New Product</button>
      <Card className='mt-4 p-4 bg-brand-dark text-white'><div className='text-sm space-y-1'><div className='flex justify-between'><span>Subtotal</span><span>₹{totals.subtotal.toFixed(0)}</span></div><div className='flex justify-between'><span>GST (18%)</span><span>₹{totals.gst.toFixed(0)}</span></div><div className='flex justify-between'><span>Discount</span><span>-₹{totals.discount.toFixed(0)}</span></div></div><hr className='my-2 border-white/30' /><div className='flex justify-between text-xl font-bold'><span>Grand Total</span><span>₹{totals.grandTotal.toFixed(0)}</span></div></Card>
      <Button className='w-full mt-4 flex items-center justify-center gap-2' onClick={makeInvoice}><Receipt size={16} />Generate Invoice</Button>

      {scannerOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 p-4 grid place-items-center'>
          <Card className='w-full p-4'>
            <h3 className='font-semibold'>Scan Barcode</h3>
            <div ref={scannerRef} className='mt-3 h-64 rounded-xl bg-slate-200 overflow-hidden' />
            <Button className='w-full mt-3' onClick={stopBarcodeScanner}>Close Scanner</Button>
          </Card>
        </div>
      )}

      {open && <div className='fixed inset-0 bg-black/30 grid place-items-center p-4'><Card className='p-5 text-center'><h4 className='font-bold'>Invoice Generated Successfully</h4><p className='text-sm mt-2'>Invoice number: INV-{Date.now().toString().slice(-6)}</p><p className='text-sm'>Date: {new Date().toLocaleDateString()}</p><p className='text-sm'>Total amount: ₹{totals.grandTotal.toFixed(0)}</p><Button className='mt-4 w-full'>Download Invoice</Button></Card></div>}
      <BottomNav />
    </main>
  );
}
