import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Banknote, CheckCircle, Lock } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import Seo from '../../components/seo/Seo';
import { siteUrl } from '../../utils/siteContent';

const MotionDiv = motion.div;
const FREE_SHIPPING_THRESHOLD = 4000;
const SHIPPING_CHARGE = 199;
const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;
const pinCodePattern = /^\d{6}$/;
const defaultShippingAddress = {
  phone: '9047770806',
  addressLine1: 'Arihant Technopolis, 131 Rajiv Gandhi Salai',
  addressLine2: 'Kandhanchavadi, Perungudi',
  city: 'Chennai',
  state: 'Tamil Nadu',
  postalCode: '600096',
  country: 'India',
};

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user, placeOrder } = useUserStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasSubmittedOrder, setHasSubmittedOrder] = useState(false);
  const [shippingErrors, setShippingErrors] = useState({});
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || defaultShippingAddress.phone,
    addressLine1: defaultShippingAddress.addressLine1,
    addressLine2: defaultShippingAddress.addressLine2,
    city: defaultShippingAddress.city,
    state: defaultShippingAddress.state,
    postalCode: defaultShippingAddress.postalCode,
    country: defaultShippingAddress.country,
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0 && step !== 3 && !hasSubmittedOrder) {
      navigate('/cart');
    }
  }, [hasSubmittedOrder, items.length, navigate, step]);

  const updateField = (field, value) => {
    setCheckoutForm((state) => ({ ...state, [field]: value }));
    setShippingErrors((state) => ({ ...state, [field]: '' }));
  };

  const validateShippingForm = () => {
    const errors = {};
    if (!checkoutForm.firstName.trim()) errors.firstName = 'First name is required.';
    if (!checkoutForm.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!emailPattern.test(checkoutForm.email.trim())) errors.email = 'Enter a valid email address.';
    if (!phonePattern.test(checkoutForm.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.';
    if (!checkoutForm.addressLine1.trim()) errors.addressLine1 = 'Street address is required.';
    if (!checkoutForm.city.trim()) errors.city = 'City is required.';
    if (!checkoutForm.state.trim()) errors.state = 'State is required.';
    if (!pinCodePattern.test(checkoutForm.postalCode.trim())) errors.postalCode = 'Enter a valid 6-digit PIN code.';
    if (!checkoutForm.country.trim()) errors.country = 'Country is required.';
    return errors;
  };

  const submitPayment = () => {
    const shippingAddress = {
      title: 'Delivery Address',
      fullName: `${checkoutForm.firstName} ${checkoutForm.lastName}`.trim(),
      phone: checkoutForm.phone,
      line1: checkoutForm.addressLine1,
      line2: checkoutForm.addressLine2,
      city: checkoutForm.city,
      state: checkoutForm.state,
      postalCode: checkoutForm.postalCode,
      country: checkoutForm.country,
    };

    const orderResult = isAuthenticated
      ? placeOrder({ items, totals: { subtotal, shipping, total }, shippingAddress })
      : { success: false, order: null };

    const nextOrderConfirmation = orderResult.order
      ? { ...orderResult.order, paymentMethod: 'cod' }
      : {
          id: `#ORD-${Date.now().toString().slice(-6)}`,
          address: shippingAddress,
          paymentMethod: 'cod',
        };

    setHasSubmittedOrder(true);
    clearCart();
    navigate('/order-confirmed', { state: { orderConfirmation: nextOrderConfirmation } });
    window.scrollTo(0, 0);
  };

  if (items.length === 0 && step !== 3 && !hasSubmittedOrder) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <Seo
        title="Secure Checkout"
        description="Complete your order on Infinity Cart with secure checkout, shipping details, payment confirmation, and a simple purchase flow."
        keywords="Infinity Cart checkout, secure payment, shipping details, online order"
        canonical={`${siteUrl}/checkout`}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,242,233,0.95),rgba(255,245,238,0.92))] p-7 shadow-[0_18px_50px_rgba(67,79,83,0.1)]">
          <div className="text-center">
            <p className="eyebrow">Secure order flow</p>
            <h1 className="section-title mt-3 text-3xl font-bold text-textPrimary md:text-4xl">Checkout with confidence</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-textSecondary">
              Complete shipping details, confirm cash on delivery, and place the order with a cleaner checkout flow.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-8">
            {[
              { id: 1, label: 'Shipping' },
              { id: 2, label: 'Payment' },
              { id: 3, label: 'Complete' },
            ].map((item, index, array) => (
              <React.Fragment key={item.id}>
                <div className={`flex items-center gap-3 ${step >= item.id ? 'text-textPrimary' : 'text-textSecondary'}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${step >= item.id ? 'bg-primary text-slate-950' : 'bg-white text-textSecondary border border-[#17313a12]'}`}>
                    {item.id}
                  </div>
                  <span className="hidden font-medium sm:inline">{item.label}</span>
                </div>
                {index < array.length - 1 && <div className="h-px w-10 bg-[#17313a12] sm:w-24" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <MotionDiv
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(246,241,232,0.96))] p-7 shadow-[0_18px_50px_rgba(67,79,83,0.08)]">
                <h2 className="section-title text-2xl font-bold text-textPrimary">Contact and shipping</h2>

                {!isAuthenticated && (
                  <div className="mt-6 rounded-[1.4rem] border border-[#17313a12] bg-white p-4">
                    <p className="font-medium text-textPrimary">Already have an account?</p>
                    <p className="mt-1 text-sm text-textSecondary">Log in to reuse saved order history and addresses.</p>
                    <button onClick={() => navigate('/account')} className="mt-3 rounded-full border border-[#17313a12] bg-[#f8f4ec] px-4 py-2 text-sm text-textPrimary">
                      Log in
                    </button>
                  </div>
                )}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const errors = validateShippingForm();
                    setShippingErrors(errors);
                    if (Object.keys(errors).length === 0) {
                      setStep(2);
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="mt-7"
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ['firstName', 'First name'],
                      ['lastName', 'Last name'],
                      ['email', 'Email address', 'email'],
                      ['phone', 'Phone number', 'tel'],
                    ].map(([field, label, type = 'text']) => (
                      <div key={field}>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">{label}</label>
                        <input
                          type={type}
                          value={checkoutForm[field]}
                          onChange={(event) => updateField(field, event.target.value)}
                          className="h-14 w-full rounded-[1rem] border border-[#17313a12] bg-white px-4 text-textPrimary outline-none focus:border-[#9cc63b66]"
                        />
                        {shippingErrors[field] && <p className="mt-2 text-xs text-red-400">{shippingErrors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-textPrimary">Street address</label>
                    <input
                      value={checkoutForm.addressLine1}
                      onChange={(event) => updateField('addressLine1', event.target.value)}
                      className="h-14 w-full rounded-[1rem] border border-[#17313a12] bg-white px-4 text-textPrimary outline-none focus:border-[#9cc63b66]"
                    />
                    {shippingErrors.addressLine1 && <p className="mt-2 text-xs text-red-400">{shippingErrors.addressLine1}</p>}
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-textPrimary">Apartment, suite, landmark</label>
                    <input
                      value={checkoutForm.addressLine2}
                      onChange={(event) => updateField('addressLine2', event.target.value)}
                      className="h-14 w-full rounded-[1rem] border border-[#17313a12] bg-white px-4 text-textPrimary outline-none focus:border-[#9cc63b66]"
                    />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ['city', 'City'],
                      ['state', 'State'],
                      ['postalCode', 'PIN code'],
                      ['country', 'Country'],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">{label}</label>
                        <input
                          value={checkoutForm[field]}
                          onChange={(event) => updateField(field, event.target.value)}
                          className="h-14 w-full rounded-[1rem] border border-[#17313a12] bg-white px-4 text-textPrimary outline-none focus:border-[#9cc63b66]"
                        />
                        {shippingErrors[field] && <p className="mt-2 text-xs text-red-400">{shippingErrors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-textPrimary px-6 py-4 font-semibold text-white transition-colors hover:bg-[#244752]"
                    >
                      Continue to Payment
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(246,241,232,0.96))] p-7 shadow-[0_18px_50px_rgba(67,79,83,0.08)]">
                <h3 className="section-title text-2xl font-bold text-textPrimary">Order summary</h3>
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-[1.2rem] border border-[#17313a12] bg-white p-3">
                      <div className="h-16 w-16 overflow-hidden rounded-[1rem] border border-[#17313a12] bg-[#f8f4ec]">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-textPrimary">{item.name}</p>
                        <p className="mt-1 text-xs text-textSecondary">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-textPrimary">{formatInr(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-textSecondary"><span>Subtotal</span><span className="text-textPrimary">{formatInr(subtotal)}</span></div>
                  <div className="flex justify-between text-textSecondary"><span>Shipping</span><span className="text-textPrimary">{shipping === 0 ? 'Free' : formatInr(shipping)}</span></div>
                  <div className="flex justify-between border-t border-[#17313a12] pt-3 text-textPrimary"><span className="font-semibold">Total due</span><span className="text-xl font-bold">{formatInr(total)}</span></div>
                </div>
              </div>
            </MotionDiv>
          )}

          {step === 2 && (
            <MotionDiv
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-auto max-w-3xl rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(246,241,232,0.96))] p-7 shadow-[0_20px_60px_rgba(67,79,83,0.12)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="section-title text-2xl font-bold text-textPrimary">Payment method</h2>
                <button onClick={() => setStep(1)} className="text-sm text-textSecondary underline">
                  Edit shipping details
                </button>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between rounded-[1.3rem] border border-[#9cc63b66] bg-[#f4fae6] p-5">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-textPrimary"><Banknote size={18} className="text-primary" /> Cash on Delivery</div>
                    <div className="mt-1 text-sm text-textSecondary">Place the order now and pay when your delivery arrives.</div>
                  </div>
                  <CheckCircle className="text-primary" size={20} />
                </div>
              </div>

              <div className="mt-7 rounded-[1.4rem] border border-[#17313a12] bg-white p-5 text-sm leading-7 text-textSecondary">
                Your order will be confirmed now and payment will be collected only at the time of delivery.
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-[1.4rem] border border-[#17313a12] bg-white p-5 text-sm leading-7 text-textSecondary">
                <Lock size={18} className="mt-1 text-accent" />
                <p>
                  Cash on delivery keeps the order flow simple while still saving the order in your account and confirming your shipping details.
                </p>
              </div>

              <button
                type="button"
                onClick={submitPayment}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-textPrimary px-6 py-4 font-semibold text-white transition-colors hover:bg-[#244752]"
              >
                {`Place COD Order for ${formatInr(total)}`}
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;
