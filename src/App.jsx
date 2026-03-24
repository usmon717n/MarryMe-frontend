import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import GlobalBackground from './components/common/GlobalBackground';
import AnimatedPage from './components/common/AnimatedPage';
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
  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

// Har bir sahifani AnimatedPage bilan o'raymiz
// key={location.pathname} — route o'zgarganda yangi mount → animatsiya qayta ishlaydi
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/"               element={<AnimatedPage><HomePage /></AnimatedPage>} />
      <Route path="/services"       element={<AnimatedPage><ServicesPage /></AnimatedPage>} />
      <Route path="/services/:slug" element={<AnimatedPage><ServiceDetailPage /></AnimatedPage>} />
      <Route path="/portfolio"      element={<AnimatedPage><PortfolioPage /></AnimatedPage>} />
      <Route path="/contact"        element={<AnimatedPage><ContactPage /></AnimatedPage>} />
      <Route path="/login"          element={<AnimatedPage><LoginPage /></AnimatedPage>} />
      <Route path="/register"       element={<AnimatedPage><RegisterPage /></AnimatedPage>} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AnimatedPage><DashboardPage /></AnimatedPage>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index            element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
        <Route path="orders"    element={<AnimatedPage><AdminOrders /></AnimatedPage>} />
        <Route path="contacts"  element={<AnimatedPage><AdminContacts /></AnimatedPage>} />
        <Route path="services"  element={<AnimatedPage><AdminServices /></AnimatedPage>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      <Navbar />
      <main className="flex-1 pt-4">{children}</main>
      <Footer />
    </div>
  );
}

function AppInner() {
  const { isDark } = useTheme();

  // Toast liquid glass style
  const toastStyle = {
    borderRadius: '16px',
    background: isDark
      ? 'rgba(35, 0, 45, 0.78)'
      : 'rgba(255, 255, 255, 0.78)',
    backdropFilter: 'blur(32px) saturate(200%)',
    WebkitBackdropFilter: 'blur(32px) saturate(200%)',
    color: isDark ? 'rgba(240,210,238,0.95)' : 'rgba(40,10,30,0.88)',
    boxShadow: isDark
      ? '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,150,220,0.10), 0 0 0 1px rgba(180,0,160,0.18)'
      : '0 8px 32px rgba(180,0,120,0.10), inset 0 1px 0 rgba(255,255,255,0.95), 0 0 0 1px rgba(255,200,220,0.60)',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    padding: '12px 16px',
  };

  return (
    <BrowserRouter>
      <GlobalBackground />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: toastStyle,
          success: {
            iconTheme: { primary: '#f43f5e', secondary: isDark ? 'rgba(14,10,18,0.75)' : '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: isDark ? 'rgba(14,10,18,0.75)' : '#fff' },
          },
        }}
      />

      {/* PublicLayout wrapper — routes ichida ishlaydi */}
      <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
        <Navbar />
        <main className="flex-1 pt-4">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
