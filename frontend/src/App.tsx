import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Welcome = lazy(() => import('./pages/Welcome'));
const Language = lazy(() => import('./pages/Language'));
const Category = lazy(() => import('./pages/Category'));
const Login = lazy(() => import('./pages/Login'));
const Otp = lazy(() => import('./pages/Otp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Billing = lazy(() => import('./pages/Billing'));
const BillingHistory = lazy(() => import('./pages/BillingHistory'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const ExpiryAlerts = lazy(() => import('./pages/ExpiryAlerts'));
const Reports = lazy(() => import('./pages/Reports'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/language' element={<Language />} />
        <Route path='/category' element={<Category />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/billing' element={<Billing />} />
        <Route path='/billing-history' element={<BillingHistory />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/expiry-alerts' element={<ExpiryAlerts />} />
        <Route path='/ai-assistant' element={<AIAssistant />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/settings' element={<div className='p-4'>Settings</div>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
}
