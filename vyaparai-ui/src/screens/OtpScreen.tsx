import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Card, OtpInput, TopNav } from '../components/ui';

export function OtpScreen() {
  return (
    <main className="screen-shell">
      <TopNav title="VyaparAI" />
      <h1 className="text-heading">OTP Verification</h1>
      <p className="mb-6 mt-2 text-body text-text-secondary">Enter the 4-digit code sent to your phone number.</p>
      <Card className="space-y-4 p-4">
        <OtpInput />
        <button type="button" className="text-small font-semibold text-primary">
          Resend OTP
        </button>
      </Card>
      <div className="mt-8 space-y-3">
        <Button>Verify & Login</Button>
        <Link to="/login">
          <Button variant="secondary">Back to Login</Button>
        </Link>
      </div>
      <BottomTabBar />
    </main>
  );
}
