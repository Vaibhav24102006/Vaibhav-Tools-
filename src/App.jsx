import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { TranslationProvider } from './context/TranslationContext';
import { useT } from './components/TranslatableText';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import RefundPolicy from './pages/policies/RefundPolicy';
import ShippingInfo from './pages/policies/ShippingInfo';
import TermsOfService from './pages/policies/TermsOfService';
import TranslationButton from './components/TranslationButton';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminRequestReset from './pages/AdminRequestReset';
import AdminResetPassword from './pages/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminOrders from './pages/admin/AdminOrders';
import EmailTest from './pages/admin/EmailTest';
import PopulateData from './pages/PopulateData';
import DebugDB from './pages/DebugDB';
import NormalizeProducts from './pages/NormalizeProducts';
import ProtectedRoute from './components/ProtectedRoute';

// 404 Page Component
const NotFound = () => {
  const t = useT();
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl font-bold text-primary-red mb-4">{t('404 - Page Not Found')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('Sorry, the page you are looking for does not exist.')}</p>
      <a href="/" className="btn btn-primary">{t('Go to Home')}</a>
    </div>
  );
};

function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                {/* Public/User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                {/* Admin Routes - Protected */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminProducts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminCategories />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/brands" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminBrands />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminOrders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/email-test" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <EmailTest />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/legacy" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/admin/request-reset" element={<AdminRequestReset />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                {process.env.NODE_ENV !== 'production' && (
                  <Route path="/debug-db" element={<DebugDB />} />
                )}
                <Route path="/populate-data" element={<PopulateData />} />
                <Route path="/normalize-products" element={<NormalizeProducts />} />
                {/* 404 Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </Router>
          <TranslationButton />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}

export default App;
