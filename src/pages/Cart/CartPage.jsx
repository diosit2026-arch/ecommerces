import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const MotionDiv = motion.div;
const FREE_SHIPPING_THRESHOLD = 4000;
const SHIPPING_CHARGE = 199;
const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center p-8 bg-surface rounded-2xl border border-gray-800 shadow-xl max-w-md w-full">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Discover your next favorite item now.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold transition-all w-full md:w-auto"
          >
            Start Shopping <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Your Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" /> Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <MotionDiv
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-surface rounded-2xl border border-gray-800 shadow-md relative group"
                >
                  <Link to={`/products/${item.id}`} className="block w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between w-full h-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs text-primary uppercase font-bold tracking-wider mb-1">
                          {item.brand}
                        </div>
                        <Link to={`/products/${item.id}`} className="hover:text-primary transition-colors">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                        </Link>
                        <p className="text-xl font-extrabold text-white">{formatInr(item.price)}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-full transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center mt-4 sm:mt-0">
                      <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800 mr-6 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors bg-surface"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-white bg-surface">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors bg-surface"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right flex-1">
                        <span className="text-sm text-gray-400">Total: </span>
                        <span className="text-lg font-bold text-primary">{formatInr(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-surface rounded-2xl border border-gray-800 p-8 sticky top-24 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-white">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-white">
                    {shipping === 0 ? <span className="text-green-400">Free</span> : formatInr(shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {formatInr(total)}
                  </span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-blue-300 flex items-center">
                    <span className="bg-blue-500 rounded-full w-2 h-2 mr-2"></span>
                    Add <span className="font-bold text-white mx-1">{formatInr(FREE_SHIPPING_THRESHOLD - subtotal)}</span> more to get free shipping!
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-opacity"
              >
                Proceed to Checkout <ArrowRight size={20} className="ml-2" />
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 flex items-center justify-center">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
