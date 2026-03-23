import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Seo from '../../components/seo/Seo';
import { siteUrl } from '../../utils/siteContent';

const OrderConfirmedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderConfirmation = location.state?.orderConfirmation || null;

  if (!orderConfirmation) {
    navigate('/products');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <Seo
        title="Order Confirmed"
        description="Your Infinity Cart order has been placed successfully and saved to your account."
        canonical={`${siteUrl}/order-confirmed`}
      />
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <div className="aurora-panel rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(10,24,31,0.95))] p-12 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <div className="pulse-ring mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#63f5d21a]">
            <CheckCircle size={50} className="text-accent" />
          </div>

          <h1 className="section-title mb-4 text-4xl font-bold text-white">
            {orderConfirmation.paymentMethod === 'cod' ? 'Order Placed Successfully' : 'Payment Successful'}
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-lg text-textSecondary">
            {orderConfirmation.paymentMethod === 'cod'
              ? 'Your cash on delivery order has been placed and saved in your account history.'
              : 'Thanks for your purchase. Your order has been saved in your account history.'}
          </p>

          <div className="spot-grid mb-10 rounded-[1.5rem] border border-white/10 bg-[#09161d] p-6 text-left">
            <p className="mb-1 text-sm text-textSecondary">Order number</p>
            <p className="mb-4 text-lg font-bold text-white">{orderConfirmation.id}</p>
            <p className="mb-1 text-sm text-textSecondary">Estimated delivery</p>
            <p className="font-medium text-white">Within 5 to 7 business days</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="shimmer-line rounded-full bg-white px-8 py-4 font-bold text-slate-950 transition-colors hover:bg-[#f2ffc8]"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate('/products')}
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-white transition-colors hover:bg-white/[0.05]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;
