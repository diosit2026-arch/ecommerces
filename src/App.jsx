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
      <div className="app-shell flex min-h-screen flex-col">
        <Navbar />
        
        <main className="mt-0 flex flex-grow flex-col pt-16">
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
                  <div className="mx-4 flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] px-4 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                    <h1 className="section-title mb-4 text-6xl font-bold text-primary">404</h1>
                    <h2 className="mb-6 text-2xl font-semibold text-white">Page Not Found</h2>
                    <p className="mx-auto mb-8 max-w-md text-textSecondary">The page you are looking for may have moved, been renamed, or is not available on Infinity Cart right now.</p>
                    <a href="/" className="rounded-full bg-white px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-orange-100">
                      Return to Infinity Cart
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
