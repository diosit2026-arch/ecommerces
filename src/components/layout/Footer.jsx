import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { siteName, storefrontCategories } from '../../utils/siteContent';
import brandLogo from '../../assets/infinity.jpeg';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#17313a14] bg-[linear-gradient(180deg,rgba(253,251,246,0.94),rgba(245,239,231,1))] pt-14 text-textSecondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 rounded-[2rem] border border-[#17313a14] bg-white/70 p-6 shadow-[0_20px_60px_rgba(86,98,105,0.12)] lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#17313a14] bg-white p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4fd1c51a] text-primary">
              <Truck size={20} />
            </div>
            <h3 className="font-semibold text-textPrimary">Fast delivery across India</h3>
            <p className="mt-2 text-sm leading-6 text-textSecondary">
              Checkout, dispatch, and delivery updates designed to feel quick and clear.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#17313a14] bg-white p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7ee2a81a] text-accent">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-semibold text-textPrimary">Protected payments</h3>
            <p className="mt-2 text-sm leading-6 text-textSecondary">
              Reassuring payment messaging, transparent totals, and a cleaner order flow.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#17313a14] bg-white p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff875f1a] text-secondary">
              <Sparkles size={20} />
            </div>
            <h3 className="font-semibold text-textPrimary">Focused catalog</h3>
            <p className="mt-2 text-sm leading-6 text-textSecondary">
              Infinity Cart spotlights mobiles, electronics, beauty, appliances, and fashion.
            </p>
          </div>
        </div>

        <div className="grid gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={brandLogo} alt={`${siteName} logo`} className="h-14 w-14 rounded-[1.2rem] object-cover shadow-[0_10px_24px_rgba(86,98,105,0.16)]" />
              <h3 className="font-['Sora'] text-2xl font-bold text-textPrimary">{siteName}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-textSecondary">
              Infinity Cart brings together bold design, everyday tech, beauty, fashion, and cleaner shopping across every major page.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-textPrimary">Shop Categories</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {storefrontCategories.map((category) => (
                <li key={category.name}>
                  <Link to={`/products?category=${category.name}`} className="transition-colors hover:text-textPrimary">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-textPrimary">Customer Help</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/account" className="transition-colors hover:text-textPrimary">My account</Link></li>
              <li><Link to="/cart" className="transition-colors hover:text-textPrimary">Shopping cart</Link></li>
              <li><Link to="/checkout" className="transition-colors hover:text-textPrimary">Secure checkout</Link></li>
              <li><Link to="/products?sort=trending" className="transition-colors hover:text-textPrimary">Trending drops</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-textPrimary">Browse all products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-textPrimary">Contact Infinity Cart</h4>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-primary" />
                <span>Arihant Technopolis, 131 Rajiv Gandhi Salai, Kandhanchavadi, Perungudi, Chennai, Tamil Nadu 600096</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span>+91 9047770806</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>support@infinitycart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#17313a14] py-6 text-sm text-textSecondary md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Built for a cleaner electronics-first storefront experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
