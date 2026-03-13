import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Card, PillSelector } from '../components/ui';

export function LanguageScreen() {
  return (
    <main className="screen-shell">
      <h1 className="text-heading">Language</h1>
      <p className="mb-6 mt-2 text-body text-text-secondary">Choose your preferred app language.</p>
      <Card className="p-4">
        <PillSelector items={['English', 'Hindi', 'Kannada']} active="English" />
      </Card>
      <div className="mt-8">
        <Link to="/category">
          <Button icon>Continue</Button>
        </Link>
      </div>
      <BottomTabBar />
    </main>
  );
}
