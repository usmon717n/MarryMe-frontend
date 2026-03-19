import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ServicesPage from './components/pages/ServicesPage';
import ServiceDetailPage from './components/pages/ServiceDetailPage';
import PortfolioPage from './components/pages/PortfolioPage';
import ContactPage from './components/pages/ContactPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/DashboardPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminOrders from './components/admin/AdminOrders';
import AdminContacts from './components/admin/AdminContacts';
import AdminServices from './components/admin/AdminServices';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '16px',
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/"          element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services"  element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
          <Route path="/contact"   element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/login"     element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register"  element={<PublicLayout><RegisterPage /></PublicLayout>} />

          <Route path="/dashboard" element={
            <ProtectedRoute><PublicLayout><DashboardPage /></PublicLayout></ProtectedRoute>
          } />

          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index       element={<AdminDashboard />} />
            <Route path="orders"   element={<AdminOrders />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="services" element={<AdminServices />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
