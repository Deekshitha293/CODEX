import { useEffect, useState } from 'react';
import client from '../api/client.js';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', description: '' });

  const load = () => client.get('/products').then((res) => setProducts(res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/products', { ...form, price: Number(form.price), quantity: Number(form.quantity) });
    setForm({ name: '', price: '', quantity: '', description: '' });
    load();
  };

  return (
    <div className="card">
      <h2>Inventory</h2>
      <form onSubmit={submit}>
        <input value={form.name} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input value={form.price} placeholder="Price" type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input value={form.quantity} placeholder="Quantity" type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input value={form.description} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button>Add product</button>
      </form>
      <ul>
        {products.map((p) => <li key={p._id}>{p.name} - ${p.price} - Qty {p.quantity}</li>)}
      </ul>
    </div>
  );
}
