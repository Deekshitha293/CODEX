import { ShieldCheck, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Card, InputField, TopNav } from '../components/ui';

export function LoginScreen() {
  return (
    <main className="screen-shell">
      <TopNav title="VyaparAI" />
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
          <Store size={30} />
        </div>
      </div>
      <h1 className="text-heading">Welcome back</h1>
      <p className="mb-6 mt-2 text-body text-text-secondary">Enter your phone number to access your business dashboard</p>
      <InputField label="Phone Number" prefix="+91" placeholder="98765 43210" />
      <div className="my-6 flex items-center gap-3 text-small font-medium text-text-secondary">
        <span className="h-px flex-1 bg-slate-300" />
        VERIFICATION
        <span className="h-px flex-1 bg-slate-300" />
      </div>
      <Card className="space-y-4 p-4">
        <Link to="/otp">
          <Button>Verify & Login</Button>
        </Link>
        <Button variant="secondary">Create Business Account</Button>
      </Card>
      <p className="mt-4 flex items-center justify-center gap-2 text-small text-text-secondary">
        <ShieldCheck size={14} className="text-success" />
        Secure AI-Powered Accounting
      </p>
      <BottomTabBar />
    </main>
  );
}
