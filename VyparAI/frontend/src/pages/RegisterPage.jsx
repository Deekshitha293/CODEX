import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post('/auth/register', form);
    localStorage.setItem('token', data.token);
    setMessage('Registered');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Create account</button>
      <p>{message}</p>
      <Link to="/login">Already have an account?</Link>
    </form>
  );
}
