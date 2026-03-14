import { useEffect, useState } from 'react';
import client from '../api/client.js';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    client.get('/dashboard/summary').then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Total sales: {summary.totalSales}</p>
      <p>Total revenue: ${summary.totalRevenue.toFixed(2)}</p>
      <p>Low stock products: {summary.lowStockCount}</p>
      <ul>
        {summary.lowStockProducts.map((p) => (
          <li key={p._id}>{p.name} - {p.quantity} left</li>
        ))}
      </ul>
    </div>
  );
}
