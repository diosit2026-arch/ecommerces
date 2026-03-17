import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import { AnimatePresence } from 'framer-motion';

// Lazy loading pages for better performance
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ProductListingPage = lazy(() => import('./pages/Products/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('./pages/Products/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage'));
const OrderConfirmedPage = lazy(() => import('./pages/Checkout/OrderConfirmedPage'));
const AccountPage = lazy(() => import('./pages/User/AccountPage'));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow flex flex-col pt-16 mt-0">
          <Suspense fallback={<Loader fullScreen={true} />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
                <Route path="/account" element={<AccountPage />} />
                
                {/* 404 Fallback */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">The page you are looking for may have moved, been renamed, or is not available on NamshyCart right now.</p>
                    <a href="/" className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      Return to NamshyCart
                    </a>
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
