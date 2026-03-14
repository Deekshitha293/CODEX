import { Bell, UserCircle2 } from 'lucide-react';
import { BottomNav, Button, Card, TopBrand } from '../components/ui';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const { invoices, products, notifications } = useData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayInvoices = invoices.filter((i) => new Date(i.date) >= today);
  const todaySales = todayInvoices.reduce((s, i) => s + i.total, 0);
  const lowStockCount = products.filter((p) => p.stock < 20).length;
  const acts = ['Create Bill', 'Inventory', 'Sales Analytics', 'Billing History', 'Expiry Alerts', 'Admin'];

  return (
    <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4 pb-24'>
      <header className='flex justify-between items-center'><TopBrand /><div className='flex gap-3'><Bell size={18} /><UserCircle2 size={20} /></div></header>
      <section className='mt-5'><h1 className='text-2xl font-bold'>Good day 👋</h1><p className='text-sm text-slate-500'>Real-time insight for your business.</p></section>
      <div className='space-y-3 mt-4'>
        <Card className='p-4 flex justify-between'><div><p className='text-sm text-slate-500'>Today's Sales</p><p className='text-xl font-bold'>₹{todaySales.toFixed(0)}</p></div><p className='text-xs text-green-600'>Live</p></Card>
        <Card className='p-4 flex justify-between'><div><p className='text-sm text-slate-500'>Invoices Today</p><p className='text-xl font-bold'>{todayInvoices.length}</p></div><p className='text-xs text-green-600'>Live</p></Card>
        <Card className='p-4 flex justify-between'><div><p className='text-sm text-slate-500'>Low Stock Items</p><p className='text-xl font-bold'>{lowStockCount}</p></div><p className='text-xs text-red-500'>Alert</p></Card>
      </div>
      {notifications[0] && <Card className='mt-4 p-3 border border-teal-100'><p className='text-xs text-slate-500'>Latest alert</p><p className='text-sm'>{notifications[0].message || notifications[0].event}</p></Card>}
      <Card className='mt-4 p-4 bg-gradient-to-br from-brand-primary to-brand-dark text-white flex justify-between'><div><h3 className='font-bold'>Ask VyaparAI</h3><p className='text-xs opacity-90'>AI + analytics copilot</p><Link to='/ai-assistant'><Button className='mt-3 bg-white text-brand-primary text-sm py-2'>Ask Now</Button></Link></div><div className='text-5xl'>🤖</div></Card>
      <h3 className='mt-4 font-bold'>Quick Actions</h3>
      <div className='grid grid-cols-2 gap-3 mt-2'>
        {acts.map((a) => <Link key={a} to={a === 'Create Bill' ? '/billing' : a === 'Inventory' ? '/inventory' : a === 'Sales Analytics' ? '/reports' : a === 'Billing History' ? '/billing-history' : a === 'Expiry Alerts' ? '/expiry-alerts' : '/admin'}><Card className='p-4 text-center'><p className='text-sm'>{a}</p></Card></Link>)}
      </div>
      <BottomNav />
    </main>
  );
}
