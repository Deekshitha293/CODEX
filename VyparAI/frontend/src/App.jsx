import { Link, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import PredictPage from './pages/PredictPage.jsx';

const token = () => localStorage.getItem('token');

const ProtectedRoute = ({ children }) => (token() ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <div className="container">
      <h1>VyparAI</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Inventory</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/predict">Predict</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><PredictPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
