import { useEffect, useState } from 'react';
import { Card, BottomNav } from '../components/ui';
import { analyticsService } from '../services/analyticsService';

export default function Admin() {
  const [summary, setSummary] = useState({ totalUsers: 0, totalRevenue: 0, totalSalesQuantity: 0, systemHealth: 'Healthy' });

  useEffect(() => {
    analyticsService.adminSummary().then(setSummary).catch(() => undefined);
  }, []);

  return (
    <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4 pb-24'>
      <h1 className='text-xl font-bold'>Admin Dashboard</h1>
      <div className='grid grid-cols-2 gap-3 mt-4'>
        <Card className='p-4'><p className='text-xs text-slate-500'>Total Users</p><p className='font-bold text-xl'>{summary.totalUsers}</p></Card>
        <Card className='p-4'><p className='text-xs text-slate-500'>Total Sales</p><p className='font-bold text-xl'>{summary.totalSalesQuantity}</p></Card>
        <Card className='p-4'><p className='text-xs text-slate-500'>Total Revenue</p><p className='font-bold text-xl'>₹{summary.totalRevenue}</p></Card>
        <Card className='p-4'><p className='text-xs text-slate-500'>System Health</p><p className='font-bold text-xl'>{summary.systemHealth}</p></Card>
      </div>
      <BottomNav />
    </main>
  );
}
