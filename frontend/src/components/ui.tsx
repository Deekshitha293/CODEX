import { Link, NavLink } from 'react-router-dom';
import { Home, ReceiptText, Boxes, BarChart3, Settings } from 'lucide-react';
import React from 'react';

export const Card = ({ className = '', children }: React.PropsWithChildren<{ className?: string }>) => <div className={`bg-white rounded-card shadow-soft ${className}`}>{children}</div>;
export const Button = ({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button className={`bg-brand-primary text-white rounded-2xl px-4 py-3 font-semibold ${className}`} {...props} />;
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-primary ${props.className ?? ''}`} />;
export const SearchBar = ({ placeholder = 'Search...', rightIcon }: { placeholder?: string; rightIcon?: React.ReactNode }) => <div className='flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-soft'><span>🔍</span><input className='w-full text-sm outline-none' placeholder={placeholder}/>{rightIcon}</div>;

const tabs = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/billing', label: 'Bills', icon: ReceiptText },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export const BottomNav = () => <nav className='fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white border-t border-slate-200 px-2 py-2 flex justify-between'>
  {tabs.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({isActive})=>`flex flex-col items-center text-xs ${isActive ? 'text-brand-primary' : 'text-slate-500'}`}><Icon size={18}/>{label}</NavLink>)}
</nav>;

export const TopBrand = () => <Link to='/' className='flex items-center gap-2 font-bold'><div className='h-8 w-8 rounded-xl bg-brand-primary grid place-items-center text-white'>🏪</div>VyaparAI</Link>;
