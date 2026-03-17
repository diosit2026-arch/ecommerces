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
    <div className="min-h-screen bg-background pt-10 pb-20">
      <Seo
        title="Order Confirmed"
        description="Your NamshyCart order has been placed successfully and saved to your account."
        canonical={`${siteUrl}/order-confirmed`}
      />
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-800 bg-surface p-12 shadow-2xl">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle size={50} className="text-accent" />
          </div>

          <h1 className="mb-4 text-4xl font-extrabold text-white">
            {orderConfirmation.paymentMethod === 'cod'
              ? 'Order Placed Successfully!'
              : 'Payment Successful!'}
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-lg text-gray-400">
            {orderConfirmation.paymentMethod === 'cod'
              ? 'Your cash on delivery order has been placed and saved to your account history.'
              : 'Thank you for your purchase. Your order has been saved to your account history.'}
          </p>

          <div className="mb-10 rounded-xl border border-gray-800 bg-background p-6 text-left">
            <p className="mb-1 text-sm text-gray-400">Order number</p>
            <p className="mb-4 text-lg font-bold text-white">{orderConfirmation.id}</p>
            <p className="mb-1 text-sm text-gray-400">Estimated delivery</p>
            <p className="text-white font-medium">Thursday, March 19, 2026</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="inline-block rounded-full bg-primary px-8 py-4 font-bold text-white transition-colors hover:bg-indigo-600"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate('/products')}
              className="rounded-full border border-gray-700 px-8 py-4 font-bold text-white transition-colors hover:bg-gray-800"
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
