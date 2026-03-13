import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';

const MotionDiv = motion.div;
const FREE_SHIPPING_THRESHOLD = 4000;
const SHIPPING_CHARGE = 199;
const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const InputGroup = ({ label, type = 'text', required = false, placeholder = '' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
    />
  </div>
);

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center justify-center gap-4 sm:gap-12">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${step >= 1 ? 'bg-primary text-white' : 'bg-surface text-gray-500'}`}>1</div>
              <span className="font-semibold hidden sm:inline">Shipping details</span>
            </div>
            <div className="w-12 sm:w-24 h-px bg-gray-700"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${step >= 2 ? 'bg-primary text-white' : 'bg-surface text-gray-500'}`}>2</div>
              <span className="font-semibold hidden sm:inline">Payment options</span>
            </div>
            <div className="w-12 sm:w-24 h-px bg-gray-700"></div>
            <div className={`flex items-center ${step === 3 ? 'text-accent' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${step === 3 ? 'bg-accent text-white' : 'bg-surface text-gray-500'}`}>3</div>
              <span className="font-semibold hidden sm:inline">Order complete</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <MotionDiv
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col lg:flex-row gap-10"
            >
              <div className="lg:w-2/3 max-w-2xl">
                <div className="bg-surface rounded-2xl border border-gray-800 p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-6">Contact & Shipping setup</h2>

                  {!isAuthenticated && (
                    <div className="mb-8 p-4 border border-gray-700 rounded-xl bg-gray-800 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium mb-1">Already have an account?</p>
                        <p className="text-sm text-gray-400">Log in for a faster checkout process.</p>
                      </div>
                      <button onClick={() => navigate('/account')} className="px-4 py-2 bg-background border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors">
                        Log in
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleInfoSubmit}>
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-white mb-4">Contact info</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="First name" required />
                        <InputGroup label="Last name" required />
                      </div>
                      <InputGroup label="Email address" type="email" required />
                      <InputGroup label="Phone number (optional)" type="tel" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Shipping address</h3>
                      <InputGroup label="Street address" required />
                      <InputGroup label="Apartment, suite, etc. (optional)" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="City" required />
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">State / Province</label>
                          <select className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>Maharashtra</option>
                            <option>Telangana</option>
                            <option>Karnataka</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="PIN code" required />
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                          <select className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>India</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                      <button
                        type="submit"
                        className="px-8 py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center"
                      >
                        Continue to Payment <ArrowRight size={20} className="ml-2" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-surface rounded-2xl border border-gray-800 p-8 sticky top-24 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                  <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-4 border-b border-gray-800 pb-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-900">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-white whitespace-nowrap">{formatInr(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Subtotal</span>
                      <span className="font-medium text-white">{formatInr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Shipping</span>
                      <span className="font-medium text-white">{shipping === 0 ? 'Free' : formatInr(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Taxes</span>
                      <span className="font-medium text-white">Calculated next step</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-white">Total due</span>
                    <span className="text-xl font-extrabold text-white">{formatInr(total)}</span>
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}

          {step === 2 && (
            <MotionDiv
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-surface rounded-2xl border border-gray-800 p-8 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white underline">Edit Shipping step</button>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-8 space-y-4">
                    <label className="relative flex cursor-pointer rounded-xl border border-primary bg-gray-800/50 p-4 focus:outline-none">
                      <input type="radio" name="payment_method" value="card" checked className="hidden" readOnly />
                      <span className="flex flex-1 items-center">
                        <span className="flex flex-col">
                          <span className="block text-sm font-bold text-white flex items-center">
                            <CreditCard className="mr-2 text-primary" size={20} /> Credit or Debit Card
                          </span>
                        </span>
                      </span>
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </label>
                  </div>

                  <div className="mb-8 p-6 border border-gray-700 rounded-xl bg-background">
                    <InputGroup label="Card number" placeholder="0000 0000 0000 0000" required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Expiration date (MM/YY)" required />
                      <InputGroup label="Security code (CVC)" required />
                    </div>
                    <InputGroup label="Name on card" required />
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 mb-8 flex items-start space-x-4">
                    <Lock className="text-green-500 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="text-white font-bold mb-1">Secure payment processing</h4>
                      <p className="text-sm text-gray-400">All transactions are encrypted and secured. We never store your full card details.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-opacity"
                  >
                    Pay {formatInr(total)} Now
                  </button>
                </form>
              </div>
            </MotionDiv>
          )}

          {step === 3 && (
            <MotionDiv
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="bg-surface rounded-3xl border border-gray-800 p-12 shadow-2xl">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle size={50} className="text-accent" />
                  </MotionDiv>
                </div>

                <h2 className="text-4xl font-extrabold text-white mb-4">Payment Successful!</h2>
                <p className="text-lg text-gray-400 mb-8 max-w-sm mx-auto">
                  Thank you for your purchase. We've sent an order confirmation email to you.
                </p>

                <div className="bg-background rounded-xl p-6 mb-10 text-left border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Order number</p>
                  <p className="text-white font-mono font-bold text-lg mb-4">#ORD-927361-FL</p>
                  <p className="text-sm text-gray-400 mb-1">Estimated delivery</p>
                  <p className="text-white font-medium">Thursday, March 19, 2026</p>
                </div>

                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 bg-primary hover:bg-indigo-600 text-white rounded-full font-bold transition-colors inline-block"
                >
                  Continue Shopping
                </button>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;
