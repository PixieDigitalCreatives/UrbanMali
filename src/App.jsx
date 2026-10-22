import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PlansPage } from './pages/PlansPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CheckAreaPage } from './pages/CheckAreaPage';
import { BookingPage } from './pages/BookingPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:id" element={<OrderConfirmationPage />} />
              <Route path="/check-area" element={<CheckAreaPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />

              {/* Shared On-Brand Coming Soon routes */}
              <Route path="/portfolio" element={<ComingSoonPage />} />
              <Route path="/about" element={<ComingSoonPage />} />
              <Route path="/partner" element={<ComingSoonPage />} />
              <Route path="/contact" element={<ComingSoonPage />} />
              <Route path="/privacy-policy" element={<ComingSoonPage />} />
              <Route path="/terms" element={<ComingSoonPage />} />
              <Route path="/cancellation-refund" element={<ComingSoonPage />} />
              <Route path="/service-terms" element={<ComingSoonPage />} />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
