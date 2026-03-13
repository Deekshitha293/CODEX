import { PropsWithChildren } from 'react';
import { Search, Store } from 'lucide-react';

export const Card = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <div className={`card ${className}`}>{children}</div>
);

export const Button = ({ children, className = '', variant = 'primary', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) => (
  <button
    className={`w-full rounded-card px-4 py-3 text-sm font-semibold transition ${
      variant === 'primary' ? 'bg-tealPrimary text-white hover:bg-tealDark' : 'border border-slate-200 bg-white text-tealDark'
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const InputField = ({ label, className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className={`block text-sm ${className}`}>
    <span className="mb-1 block text-textSecondary">{label}</span>
    <input className="w-full rounded-card border border-slate-200 px-4 py-3 outline-none focus:border-tealPrimary" {...rest} />
  </label>
);

export const OTPInput = () => <div className="grid grid-cols-4 gap-2">{Array.from({ length: 4 }).map((_, i) => <input key={i} maxLength={1} className="h-12 rounded-card border border-slate-200 text-center text-lg" />)}</div>;

export const SearchBar = ({ placeholder = 'Search...' }: { placeholder?: string }) => (
  <div className="flex items-center gap-2 rounded-card bg-white px-3 py-2 shadow-soft">
    <Search size={18} className="text-textSecondary" />
    <input className="w-full border-none bg-transparent outline-none" placeholder={placeholder} />
  </div>
);

export const ProductCard = ({ name, subtitle, price, qty = 1 }: { name: string; subtitle: string; price: number; qty?: number }) => (
  <Card>
    <p className="font-semibold">{name}</p>
    <p className="text-xs text-textSecondary">{subtitle}</p>
    <div className="mt-3 flex items-center justify-between">
      <p className="font-semibold">₹{price.toLocaleString()}</p>
      <div className="rounded-full border px-3 py-1 text-xs">[-] {String(qty).padStart(2, '0')} [+]</div>
    </div>
  </Card>
);

export const Navbar = ({ title }: { title: string }) => (
  <div className="sticky top-0 z-20 flex items-center justify-between bg-appBg px-4 py-3">
    <div className="flex items-center gap-2"><div className="rounded-xl bg-tealPrimary p-2 text-white"><Store size={18} /></div><span className="font-bold">{title}</span></div>
    <div className="h-8 w-8 rounded-full bg-slate-300" />
  </div>
);

export const BottomTabNavigation = () => (
  <div className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-md justify-around rounded-t-3xl bg-white p-3 shadow-soft md:max-w-3xl lg:max-w-6xl">
    {['Home', 'Billing', 'Inventory', 'Reports'].map((i) => <button key={i} className="text-xs text-textSecondary">{i}</button>)}
  </div>
);

export const ChatBubble = ({ message, role }: { message: string; role: 'user' | 'ai' }) => <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${role === 'user' ? 'ml-auto bg-tealPrimary text-white' : 'bg-white text-textPrimary shadow-soft'}`}>{message}</div>;

export const FloatingActionButton = ({ label }: { label: string }) => <button className="fixed bottom-20 right-4 rounded-full bg-tealPrimary px-4 py-3 text-sm font-semibold text-white shadow-soft">{label}</button>;

export const FilterPills = ({ items }: { items: string[] }) => <div className="flex gap-2 overflow-x-auto">{items.map((i, idx) => <button key={i} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${idx === 0 ? 'bg-tealPrimary text-white' : 'bg-white text-textSecondary'}`}>{i}</button>)}</div>;
