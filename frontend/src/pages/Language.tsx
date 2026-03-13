import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
const langs=['English','Hindi','Kannada'];
export default function Language(){return <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4'><h2 className='text-xl font-bold mt-12'>Choose language</h2><div className='flex gap-2 mt-4'>{langs.map(l=><button key={l} className={`px-4 py-2 rounded-full ${l==='English'?'bg-white text-brand-primary':'bg-slate-200 text-slate-700'}`}>{l}</button>)}</div><Link to='/category'><Button className='w-full mt-8'>Continue →</Button></Link></main>}
