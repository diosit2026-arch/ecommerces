import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
  MapPin,
  Bell,
  LogOut,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { siteName } from '../../utils/siteContent';
import brandLogo from '../../assets/Namshycart.png';

const categories = [
  { name: 'Mobiles', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
  { name: 'Electronics', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
  { name: 'Fashion', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100' },
  { name: 'Beauty', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
  { name: 'Appliances', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  { name: 'Toys', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
  { name: 'Furniture', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
];

const accountLinks = [
  { label: 'Account Details', to: '/account?tab=profile', icon: User },
  { label: 'Order History', to: '/account?tab=orders', icon: Package },
  { label: 'Saved Address', to: '/account?tab=addresses', icon: MapPin },
  { label: 'Notifications', to: '/account?tab=notifications', icon: Bell },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-[90] border-b border-white/10 bg-slate-950/82 text-textPrimary shadow-[0_12px_40px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[72px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Link to="/" className="group flex items-center gap-3">
                <img
                  src={brandLogo}
                  alt={`${siteName} logo`}
                  className="h-24 w-24 rounded-2xl object-cover shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold leading-none text-white">
                    {siteName}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-[0.28em] text-cyan-300">
                    Smart shopping, styled better
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden max-w-[820px] flex-1 md:flex">
              <form onSubmit={handleSearch} className="relative flex w-full items-center">
                <div className="absolute left-4 text-slate-500">
                  <Search size={20} className="stroke-[2.2px]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search electronics, fashion, home decor, beauty and more"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-12 pr-4 text-[15px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  aria-label="Search products on NamshyCart"
                />
              </form>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950">
                      <User size={16} />
                    </span>
                    <span>Account</span>
                    <ChevronDown size={15} className="text-slate-500" />
                  </button>

                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[120] w-80 overflow-hidden rounded-[1.6rem] border border-slate-700/80 bg-[linear-gradient(180deg,rgba(8,15,30,0.995),rgba(5,10,22,0.995))] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
                      <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/95 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <div className="text-sm font-semibold text-white">{user?.name}</div>
                        <div className="mt-1 text-xs text-slate-400">{user?.email}</div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {accountLinks.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-3 rounded-[1rem] border border-transparent bg-slate-900/80 px-3.5 py-3.5 text-sm text-slate-100 transition-all hover:border-cyan-300/20 hover:bg-slate-800/95"
                          >
                            <item.icon size={16} className="text-cyan-300" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-[1rem] border border-red-400/10 bg-red-500/5 px-3.5 py-3.5 text-sm text-red-300 transition-all hover:border-red-400/20 hover:bg-red-500/10"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/account"
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <User size={18} className="text-slate-300" />
                  <span>Login</span>
                </Link>
              )}

              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <ShoppingCart size={18} className="text-slate-300" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-1 text-[10px] font-bold text-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link to="/cart" className="relative rounded-xl border border-white/8 bg-white/5 p-3 text-slate-200">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-1 text-[10px] font-bold text-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-xl border border-white/8 bg-white/5 p-3 text-slate-200"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950/96 shadow-2xl md:hidden">
            <div className="space-y-5 px-4 py-5">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories and offers"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 pl-4 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
                </button>
              </form>

              {isAuthenticated ? (
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-white">{user?.name}</div>
                    <div className="mt-1 text-xs text-slate-400">{user?.email}</div>
                  </div>
                  <div className="space-y-2">
                    {accountLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-3 text-sm text-slate-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon size={16} className="text-cyan-300" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-3 py-3 text-sm text-red-300"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                  <Link to="/account" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-2 font-medium text-white">
                    <User size={16} />
                    Login or create your account
                  </Link>
                </div>
              )}

              <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                Shop curated electronics, fashion, beauty, home essentials, and toys on NamshyCart.
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 p-1">
                      <img src={cat.icon} alt={cat.name} className="h-8 w-8 object-contain" />
                    </div>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="hidden border-b border-white/8 bg-slate-950/72 backdrop-blur-xl md:block">
        <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-7">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex min-h-[118px] flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] px-2 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.07]"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-[0_10px_24px_rgba(255,255,255,0.08)]">
                  <img src={cat.icon} alt={cat.name} className="h-full w-full object-contain" />
                </div>
                <span className="text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
