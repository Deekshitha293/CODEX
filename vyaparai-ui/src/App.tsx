import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoryScreen } from './screens/CategoryScreen';
import { LanguageScreen } from './screens/LanguageScreen';
import { LoginScreen } from './screens/LoginScreen';
import { OtpScreen } from './screens/OtpScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/language" element={<LanguageScreen />} />
      <Route path="/category" element={<CategoryScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/otp" element={<OtpScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
