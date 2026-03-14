import { useEffect, useMemo, useState } from 'react';
import { BottomNav, Card } from '../components/ui';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsService } from '../services/analyticsService';

export default function Reports() {
  const { invoices, products } = useData();
  const [weeklySeries, setWeeklySeries] = useState<{ day: string; sales: number }[]>([]);
  const [forecast, setForecast] = useState<number[]>([]);
  const [score, setScore] = useState({ score: 0, status: 'N/A' });

  useEffect(() => {
    analyticsService.weeklySales().then(setWeeklySeries).catch(() => undefined);
    analyticsService.forecast().then((d) => setForecast(d.predictedNext7Days || [])).catch(() => undefined);
    analyticsService.businessScore().then(setScore).catch(() => undefined);
  }, []);

  const weeklyTotal = weeklySeries.reduce((s, x) => s + x.sales, 0);
  const lowStockCount = products.filter((p) => p.stock < 20).length;
  const chartData = useMemo(() => weeklySeries.map((d) => ({ name: d.day, sales: d.sales })), [weeklySeries]);
  const forecastData = useMemo(() => forecast.map((v, i) => ({ day: `D+${i + 1}`, sales: v })), [forecast]);

  return (
    <main className='max-w-md mx-auto min-h-screen p-4 bg-brand-light pb-24'>
      <h1 className='font-bold text-xl'>Sales & BI Reports</h1>
      <div className='grid grid-cols-2 gap-3 mt-3'>
        <Card className='p-3'><p className='text-xs'>Invoices</p><p className='font-bold'>{invoices.length}</p></Card>
        <Card className='p-3'><p className='text-xs'>Weekly Sales</p><p className='font-bold'>₹{weeklyTotal.toFixed(0)}</p></Card>
        <Card className='p-3'><p className='text-xs'>Low Stock Items</p><p className='font-bold'>{lowStockCount}</p></Card>
        <Card className='p-3'><p className='text-xs'>Business Score</p><p className='font-bold'>{score.score} ({score.status})</p></Card>
      </div>
      <Card className='mt-4 p-3 h-52'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={chartData}><XAxis dataKey='name' /><Tooltip /><Line type='monotone' dataKey='sales' stroke='#14B8A6' strokeWidth={2} dot={false} /></LineChart>
        </ResponsiveContainer>
      </Card>
      <Card className='mt-4 p-3 h-52'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={forecastData}><XAxis dataKey='day' /><Tooltip /><Bar dataKey='sales' fill='#0d9488' /></BarChart>
        </ResponsiveContainer>
      </Card>
      <BottomNav />
    </main>
  );
}
