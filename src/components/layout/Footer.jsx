import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Truck, BadgePercent } from 'lucide-react';
import { siteName } from '../../utils/siteContent';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.96),rgba(5,8,22,1))] pt-14 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] lg:grid-cols-3">
          <div className="flex items-start gap-4 rounded-[1.6rem] border border-white/8 bg-slate-950/55 p-5">
            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Fast delivery across India</h3>
              <p className="mt-1 text-sm text-slate-400">Reliable dispatch, smooth checkout, and order updates designed for a better shopping experience.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-[1.6rem] border border-white/8 bg-slate-950/55 p-5">
            <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Secure payments and trusted support</h3>
              <p className="mt-1 text-sm text-slate-400">NamshyCart focuses on safe transactions, transparent policies, and customer-first service.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-[1.6rem] border border-white/8 bg-slate-950/55 p-5">
            <div className="rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-300">
              <BadgePercent size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Daily deals and trending collections</h3>
              <p className="mt-1 text-sm text-slate-400">Explore electronics, fashion, beauty, home decor, toys, and seasonal offers in one place.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white">{siteName}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              NamshyCart is an online shopping destination for premium electronics, fashion, beauty, home essentials, appliances, furniture, toys, and curated daily offers.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Shop Categories</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/products?category=Electronics" className="transition-colors hover:text-white">Electronics and gadgets</Link></li>
              <li><Link to="/products?category=Fashion" className="transition-colors hover:text-white">Fashion and accessories</Link></li>
              <li><Link to="/products?category=Beauty" className="transition-colors hover:text-white">Beauty and self-care</Link></li>
              <li><Link to="/products?category=Home" className="transition-colors hover:text-white">Home decor and essentials</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-white">Top offers and all products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Customer Help</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/account" className="transition-colors hover:text-white">My account</Link></li>
              <li><Link to="/cart" className="transition-colors hover:text-white">Shopping cart</Link></li>
              <li><Link to="/checkout" className="transition-colors hover:text-white">Secure checkout</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">Shipping and delivery info</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Returns, refunds and privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Contact NamshyCart</h4>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-cyan-300" />
                <span>NamshyCart Commerce Hub, Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-300" />
                <span>+91 90000 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-300" />
                <span>support@namshycart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
