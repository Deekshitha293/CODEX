import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function Welcome() {
  return <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4 pb-24'>
    <div className='text-center mt-8'><div className='h-16 w-16 bg-brand-primary rounded-2xl mx-auto grid place-items-center text-white text-2xl'>🏪</div><h1 className='text-[28px] font-extrabold mt-3'>VyaparAI</h1></div>
    <Card className='p-6 mt-6 bg-gradient-to-br from-teal-100 to-white'>
      <div className='h-44 rounded-2xl bg-teal-50 grid place-items-center text-6xl'>🧑‍💼📱</div>
      <h2 className='text-2xl font-bold mt-4'>Run Your Shop Smarter with AI</h2>
      <p className='text-slate-500 mt-1'>Select your preferred language</p>
    </Card>
    <Link to='/language'><Button className='w-full mt-6'>Get Started →</Button></Link>
  </main>;
}
