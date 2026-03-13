import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input, TopBrand } from '../components/ui';
import { useState } from 'react';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await authService.login({ phone, password: password || '123456' });
    } catch {
      // fallback to allow demo navigation when backend is unavailable
    }
    navigate('/dashboard');
  };

  return (
    <main className='max-w-md mx-auto min-h-screen p-4 bg-brand-light'>
      <header className='flex justify-between items-center'>
        <span>←</span>
        <TopBrand />
        <span />
      </header>
      <Card className='p-5 mt-6 text-center'>
        <div className='h-14 w-14 rounded-2xl bg-brand-primary mx-auto text-white grid place-items-center text-2xl'>🏪</div>
        <h2 className='text-2xl font-bold mt-3'>Welcome back</h2>
        <p className='text-slate-500 text-sm'>Enter your phone number to access your business dashboard</p>
        <div className='flex mt-4 gap-2'>
          <div className='px-3 py-3 bg-slate-100 rounded-2xl'>+91</div>
          <Input placeholder='98765 43210' value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Input className='mt-2' placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className='my-4 text-xs text-slate-500'>VERIFICATION</div>
        <div className='flex justify-center gap-2'>
          {[1, 2, 3, 4].map((n) => (
            <Input key={n} className='w-12 text-center' maxLength={1} />
          ))}
        </div>
        <button className='text-brand-primary text-sm mt-3'>Resend OTP</button>
        <Button className='w-full mt-4' onClick={handleLogin}>
          Verify & Login
        </Button>
        <Link to='/otp'>
          <Button className='w-full mt-2 bg-white text-brand-primary border'>Create Business Account</Button>
        </Link>
        <p className='text-xs text-slate-500 mt-4'>🛡️ Secure AI-Powered Accounting</p>
      </Card>
    </main>
  );
}
