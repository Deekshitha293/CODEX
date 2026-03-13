import { ArrowRight, Search } from 'lucide-react';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  icon?: boolean;
};

export function Button({ children, className = '', variant = 'primary', icon }: ButtonProps) {
  const base = 'w-full rounded-card px-5 py-4 text-body font-semibold transition-transform active:scale-[0.99]';
  const styles =
    variant === 'primary'
      ? 'bg-primary text-white shadow-soft'
      : 'bg-white text-primary border border-primary/30';

  return (
    <button type="button" className={`${base} ${styles} ${className}`}>
      <span className="inline-flex items-center justify-center gap-2">
        {children}
        {icon && <ArrowRight size={18} />}
      </span>
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card-surface ${className}`}>{children}</section>;
}

export function InputField({
  label,
  prefix,
  placeholder,
}: {
  label: string;
  prefix?: string;
  placeholder: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-small font-medium uppercase tracking-wide text-text-secondary">{label}</span>
      <div className="flex items-center rounded-card border border-slate-200 bg-white px-4 py-3 shadow-soft">
        {prefix ? <span className="mr-3 font-semibold text-text-primary">{prefix}</span> : null}
        <input className="w-full bg-transparent text-body outline-none placeholder:text-text-secondary" placeholder={placeholder} />
      </div>
    </label>
  );
}

export function SearchBar() {
  return (
    <div className="flex items-center gap-3 rounded-card border border-slate-200 bg-white px-4 py-3 shadow-soft">
      <Search size={18} className="text-text-secondary" />
      <input placeholder="Search" className="w-full bg-transparent outline-none placeholder:text-text-secondary" />
    </div>
  );
}

export function PillSelector({
  items,
  active,
}: {
  items: string[];
  active: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-card bg-slate-100 p-2">
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            type="button"
            key={item}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              isActive ? 'bg-white text-primary shadow-sm' : 'bg-slate-100 text-text-primary'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export function OtpInput() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <input
          key={idx}
          maxLength={1}
          className="h-14 w-full rounded-xl border border-slate-300 bg-white text-center text-subheading font-semibold shadow-soft outline-primary"
        />
      ))}
    </div>
  );
}

const tabItems = [
  { label: 'Home', path: '/' },
  { label: 'Bills', path: '/language' },
  { label: 'Inventory', path: '/category' },
  { label: 'Reports', path: '/login' },
  { label: 'Settings', path: '/otp' },
];

export function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-3 py-2 md:mx-auto md:max-w-md md:rounded-t-2xl">
      <div className="grid grid-cols-5 gap-2">
        {tabItems.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg py-1 text-small ${isActive ? 'text-primary' : 'text-text-secondary'}`
            }
          >
            <span className="h-5 w-5 rounded-full bg-current/20" />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function TopNav({ title }: { title: string }) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <button type="button" className="text-lg text-text-primary">←</button>
      <h1 className="text-subheading">{title}</h1>
      <span className="w-6" />
    </header>
  );
}
