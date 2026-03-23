import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import Seo from '../../components/seo/Seo';
import { siteUrl } from '../../utils/siteContent';

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
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <Seo
          title="Shopping Cart"
          description="Review your Infinity Cart shopping cart, discover recommended products, and continue to secure checkout."
          keywords="Infinity Cart cart, shopping cart, checkout, online shopping"
          canonical={`${siteUrl}/cart`}
        />
        <div className="w-full max-w-md rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.95))] p-8 text-center shadow-[0_24px_70px_rgba(67,79,83,0.12)]">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#f4efe4] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <ShoppingBag size={40} className="text-textPrimary" />
          </div>
          <h2 className="section-title text-3xl font-bold text-textPrimary">Your cart is empty</h2>
          <p className="mx-auto mb-8 mt-4 max-w-sm text-textSecondary">
            Add a few products and come back here to review totals, delivery charges, and checkout.
          </p>
          <Link
            to="/products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-textPrimary px-8 py-4 font-bold text-white transition-colors hover:bg-[#244752]"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <Seo
        title="Shopping Cart"
        description="Review items in your Infinity Cart cart, update quantities, unlock free shipping, and proceed to secure checkout."
        keywords="Infinity Cart cart, shopping cart, secure checkout, free shipping"
        canonical={`${siteUrl}/cart`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Review before checkout</p>
            <h1 className="section-title text-3xl font-bold text-textPrimary md:text-4xl">Your shopping cart</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-textSecondary">
              Review your InfinityCart items, adjust quantity, and continue to checkout with clearer totals.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 text-sm font-medium text-textSecondary transition-colors hover:text-textPrimary"
          >
            <Trash2 size={16} /> Clear all
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <AnimatePresence>
              {items.map((item) => (
                <MotionDiv
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="rounded-[1.8rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,233,0.96))] p-5 shadow-[0_18px_50px_rgba(67,79,83,0.1)]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link to={`/products/${item.id}`} className="block h-32 w-full overflow-hidden rounded-[1.3rem] border border-[#17313a0f] bg-white sm:w-32">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d9730]">{item.brand}</div>
                          <Link to={`/products/${item.id}`}>
                            <h3 className="mt-2 line-clamp-3 text-xl font-semibold leading-8 text-textPrimary">{item.name}</h3>
                          </Link>
                          <p className="mt-2 text-lg font-bold text-textPrimary">{formatInr(item.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="self-start rounded-full border border-[#17313a12] bg-white p-2 text-textSecondary transition-colors hover:text-[#c85d30]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center rounded-full border border-[#17313a12] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-textPrimary">-</button>
                          <span className="w-12 text-center font-bold text-textPrimary">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-textPrimary">+</button>
                        </div>
                        <div className="text-sm text-textSecondary">
                          Total <span className="ml-2 text-lg font-bold text-textPrimary">{formatInr(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>

          <div>
            <div className="sticky top-24 rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(246,241,232,0.96))] p-7 shadow-[0_20px_60px_rgba(67,79,83,0.12)]">
              <h2 className="section-title text-2xl font-bold text-textPrimary">Order summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-textSecondary">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-textPrimary">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-textSecondary">
                  <span>Estimated shipping</span>
                  <span className="font-semibold text-textPrimary">{shipping === 0 ? 'Free' : formatInr(shipping)}</span>
                </div>
                <div className="border-t border-[#17313a12] pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-textPrimary">Total</span>
                    <span className="text-2xl font-black text-textPrimary">{formatInr(total)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-6 rounded-[1.3rem] border border-[#ef845533] bg-[#ef845510] p-4 text-sm text-[#8a5a49]">
                  Add <span className="font-bold text-textPrimary">{formatInr(FREE_SHIPPING_THRESHOLD - subtotal)}</span> more to unlock free shipping.
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-textPrimary px-6 py-4 font-bold text-white transition-colors hover:bg-[#244752]"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <p className="mt-4 text-center text-sm text-textSecondary">
                Secure checkout with card and cash on delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
