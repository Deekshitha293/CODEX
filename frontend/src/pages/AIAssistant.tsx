import { useMemo, useState } from 'react';
import { Card } from '../components/ui';
import { useData } from '../context/DataContext';
import { demandPrediction, lowStock, mostSoldProduct, todaySales } from '../utils/analytics';
import { aiService } from '../services/aiService';

type Msg = { from: 'ai' | 'user'; text: string; time: string };

export default function AIAssistant() {
  const { invoices, products } = useData();
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: 'ai',
      text: 'Hello! How can I help you with your business today? I can track sales, check inventory, or generate reports for you.',
      time: '9:41 AM'
    }
  ]);
  const suggest = ["Today's Sales", 'Low Stock Items', 'Monthly Report'];
  const dp = useMemo(() => demandPrediction(invoices), [invoices]);

  const localReply = (q: string) => {
    const query = q.toLowerCase();
    if (query.includes('most sold')) {
      const top = mostSoldProduct(invoices);
      return `${top.name} sold ${top.qty} units today.`;
    }
    if (query.includes('low stock')) return `Low stock items: ${lowStock(products).map((p) => p.name).join(', ')}`;
    if (query.includes('today') && query.includes('sales')) return `Today's total sales are ₹${todaySales(invoices)}.`;
    if (query.includes('monthly')) return 'Monthly report is ready. Weekly trend is positive.';
    return 'I can help with sales, stock, and reports.';
  };

  const ask = async (q: string) => {
    let reply = localReply(q);
    try {
      const result = await aiService.query(q);
      if (result?.reply) reply = result.reply;
    } catch {
      // fallback to local analytics
    }

    setMessages((m) => [
      ...m,
      { from: 'user', text: q, time: '9:42 AM' },
      {
        from: 'ai',
        text: `${reply}\nMilk demand next week expected: ${dp.predicted_demand_next_week.toFixed(0)} units. Recommended restock: ${dp.recommended_restock} units.`,
        time: '9:42 AM'
      }
    ]);
  };

  return (
    <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4'>
      <header className='flex justify-between'>
        <span>←</span>
        <div className='text-center'>
          <h1 className='font-bold'>Ask VyaparAI</h1>
          <p className='text-[11px] text-slate-500'>ONLINE ASSISTANT</p>
        </div>
        <span>⋮</span>
      </header>
      <div className='space-y-3 mt-4'>
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.from === 'user' ? 'ml-auto bg-brand-primary text-white' : 'bg-white shadow-soft'}`}>
            <p className='whitespace-pre-line'>{m.text}</p>
            <p className='text-[10px] mt-1 opacity-70'>{m.time}</p>
            {m.from === 'ai' && i > 0 && <button className='text-brand-primary text-xs mt-1'>View Details</button>}
          </div>
        ))}
      </div>
      <div className='flex gap-2 mt-3'>
        {suggest.map((s) => (
          <button key={s} onClick={() => ask(s)} className='px-3 py-2 rounded-full bg-white text-xs shadow-soft'>
            {s}
          </button>
        ))}
      </div>
      <Card className='fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3 rounded-none'>
        <div className='flex gap-2 items-center'>
          <input
            className='flex-1 border rounded-xl px-3 py-2 text-sm'
            placeholder='Type a business query...'
            onKeyDown={(e) => {
              if (e.key === 'Enter') ask((e.target as HTMLInputElement).value);
            }}
          />
          <button className='text-brand-primary'>➤</button>
          <button>🎤</button>
        </div>
        <p className='text-[10px] text-center text-slate-400 mt-2'>Powered by VyaparAI Analytics Engine</p>
      </Card>
    </main>
  );
}
