import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Card } from '../components/ui';

export function WelcomeScreen() {
  return (
    <main className="screen-shell">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
          <Store size={30} />
        </div>
      </div>
      <h1 className="mb-6 text-center text-heading">VyaparAI</h1>
      <Card className="relative mb-8 overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary-dark/10" />
        <div className="relative z-10">
          <div className="mb-4 rounded-2xl bg-white/70 p-4">
            <p className="text-sm">🏪 📱 Shop owner using smartphone in store</p>
          </div>
          <h2 className="text-subheading">Run Your Shop Smarter with AI</h2>
          <p className="mt-2 text-body text-text-secondary">Select your preferred language</p>
        </div>
      </Card>
      <Link to="/language">
        <Button icon>Get Started</Button>
      </Link>
      <BottomTabBar />
    </main>
  );
}
