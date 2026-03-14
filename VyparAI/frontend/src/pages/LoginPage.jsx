import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post('/auth/login', form);
    localStorage.setItem('token', data.token);
    setMessage('Logged in');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
      <p>{message}</p>
      <Link to="/register">Create new account</Link>
    </form>
  );
}
