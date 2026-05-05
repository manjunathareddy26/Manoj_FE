import React, { useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store
import useAuthStore from './context/authStore';

// Context
import { AuthProvider } from './context/AuthContext';

// Services
import { authService } from './services';

// Pages (will create these)
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import RoleSelectionPage from './pages/RoleSelectionPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentReturnPage from './pages/PaymentReturnPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';

// Styles
import './styles/globals.css';

// Protected Route component
const ProtectedRoute = ({ children, role }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/signin" replace />;

  // If the user's actual role doesn't match the required role for this route,
  // send them to their correct dashboard instead of a blank redirect.
  if (role && user?.role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();
  const { user, token, setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in
    if (token && !user) {
      setLoading(true);
      authService
        .getCurrentUser()
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          localStorage.removeItem('token');
        });
    }
  }, [token, user, setUser, setLoading, setError]);

  // Set language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  return (
    <GoogleOAuthProvider clientId="359668655054-b29im1acm1n9te8vnfsbitkk71vmg98r.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<Navigate to="/signin" replace />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<ContactUs />} />

          {/* Farmer Routes */}
          <Route
            path="/farmer/*"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Consumer Routes */}
          <Route
            path="/consumer/*"
            element={
              <ProtectedRoute role="consumer">
                <ConsumerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/return/:appOrderId"
            element={
              <ProtectedRoute>
                <PaymentReturnPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
