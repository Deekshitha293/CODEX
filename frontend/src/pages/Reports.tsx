import { useEffect, useMemo, useState } from 'react';
import { BottomNav, Card } from '../components/ui';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { lowStock, mostSoldProduct, todaySales } from '../utils/analytics';
import { analyticsService } from '../services/analyticsService';

export default function Reports() {
  const { invoices, products } = useData();
  const top = mostSoldProduct(invoices);
  const [weeklySeries, setWeeklySeries] = useState<{ day: string; sales: number }[]>([]);
  const [insights, setInsights] = useState({ repeatCustomers: 0, newCustomers: 0, avgBillValue: 0 });

  useEffect(() => {
    analyticsService.weeklySales().then(setWeeklySeries).catch(() => undefined);
    analyticsService.customerInsights().then(setInsights).catch(() => undefined);
  }, []);

  const chartData = useMemo(
    () =>
      weeklySeries.length
        ? weeklySeries.map((d) => ({ name: d.day, sales: d.sales }))
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ name: d, sales: 7000 + i * 800 })),
    [weeklySeries]
  );

  return (
    <main className='max-w-md mx-auto min-h-screen p-4 bg-brand-light pb-24'>
      <h1 className='font-bold text-xl'>Sales Report</h1>
      <div className='grid grid-cols-2 gap-3 mt-3'>
        <Card className='p-3'><p className='text-xs'>Today's Sales</p><p className='font-bold'>₹{todaySales(invoices)}</p></Card>
        <Card className='p-3'><p className='text-xs'>Weekly Sales</p><p className='font-bold'>₹{chartData.reduce((s, x) => s + x.sales, 0)}</p></Card>
        <Card className='p-3'><p className='text-xs'>Top Product</p><p className='font-bold'>{top.name}</p></Card>
        <Card className='p-3'><p className='text-xs'>Low Stock Items</p><p className='font-bold'>{lowStock(products).length}</p></Card>
      </div>
      <div className='grid grid-cols-3 gap-2 mt-3'>
        <Card className='p-2 text-center'><p className='text-[10px]'>Repeat</p><p className='font-semibold'>{insights.repeatCustomers}</p></Card>
        <Card className='p-2 text-center'><p className='text-[10px]'>New</p><p className='font-semibold'>{insights.newCustomers}</p></Card>
        <Card className='p-2 text-center'><p className='text-[10px]'>Avg Bill</p><p className='font-semibold'>₹{insights.avgBillValue}</p></Card>
      </div>
      <Card className='mt-4 p-3 h-52'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={chartData}><XAxis dataKey='name' /><Tooltip /><Line type='monotone' dataKey='sales' stroke='#14B8A6' strokeWidth={2} dot={false} /></LineChart>
        </ResponsiveContainer>
      </Card>
      <BottomNav />
    </main>
  );
}
