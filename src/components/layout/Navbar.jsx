import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { siteName, storefrontCategories } from '../../utils/siteContent';
import brandLogo from '../../assets/infinity.jpeg';

const accountLinks = [
  { label: 'Account Details', to: '/account?tab=profile', icon: User },
  { label: 'Order History', to: '/account?tab=orders', icon: Package },
  { label: 'Saved Address', to: '/account?tab=addresses', icon: MapPin },
  { label: 'Notifications', to: '/account?tab=notifications', icon: Bell },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user, logout } = useUserStore();
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

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="aurora-panel sticky top-0 z-[90] border-b border-[#17313a14] bg-[#fbfaf6]/88 text-textPrimary shadow-[0_12px_40px_rgba(86,98,105,0.12)] backdrop-blur-2xl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[80px] items-center gap-4">
            <Link to="/" className="group flex min-w-0 items-center gap-3">
              <img
                src={brandLogo}
                alt={`${siteName} logo`}
                className="pulse-ring h-16 w-16 rounded-[1.4rem] object-cover shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
              />
              <div className="min-w-0">
                <span className="block font-['Sora'] text-[1.35rem] font-bold tracking-[-0.04em] text-[#17313a] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
                  {siteName}
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.28em] text-[#7a9a16]">
                  Infinite deals, styled better
                </span>
              </div>
            </Link>

            <div className="hidden flex-1 md:flex">
              <form onSubmit={handleSearch} className="mx-auto w-full max-w-[760px]">
                <div className="spot-grid flex items-center gap-3 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <Search size={18} className="text-textSecondary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search mobiles, beauty, fashion, appliances and more"
                    className="h-8 w-full bg-transparent text-[15px] text-textPrimary outline-none placeholder:text-textSecondary"
                    aria-label={`Search products on ${siteName}`}
                  />
                  <button
                    type="submit"
                    className="shimmer-line rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="ml-auto hidden items-center gap-3 md:flex">
              <Link
                to="/products?sort=trending"
                className="inline-flex items-center gap-2 rounded-full border border-[#9cc63b33] bg-[#9cc63b14] px-4 py-2.5 text-sm font-medium text-textPrimary"
              >
                <Sparkles size={16} className="text-primary" />
                Live picks
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((value) => !value)}
                    className="flex items-center gap-3 rounded-full border border-[#17313a14] bg-white/70 px-3 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:bg-white"
                  >
                    <span className="pulse-ring flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-slate-950">
                      <User size={16} />
                    </span>
                    <span className="max-w-[110px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={15} className="text-textSecondary" />
                  </button>

                  {isAccountMenuOpen && (
                    <div className="aurora-panel absolute right-0 top-[calc(100%+0.85rem)] z-[120] w-80 overflow-hidden rounded-[1.8rem] border border-[#17313a14] bg-[#fffdf8]/96 p-3 shadow-[0_24px_70px_rgba(86,98,105,0.16)] backdrop-blur-2xl">
                      <div className="rounded-[1.2rem] border border-[#17313a14] bg-white/75 px-4 py-4">
                        <div className="text-sm font-semibold text-textPrimary">{user?.name}</div>
                        <div className="mt-1 text-xs text-textSecondary">{user?.email}</div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {accountLinks.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-3 rounded-[1rem] px-3.5 py-3 text-sm text-textPrimary transition-all hover:bg-[#f5f0e8]"
                          >
                            <item.icon size={16} className="text-primary" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-[1rem] bg-[#ff7a5118] px-3.5 py-3 text-sm text-[#ffd0c3] transition-all hover:bg-[#ff7a5124]"
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
                  className="rounded-full border border-[#17313a14] bg-white/70 px-4 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:bg-white"
                >
                  Login
                </Link>
              )}

              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-full border border-[#17313a14] bg-white/70 px-4 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:bg-white"
              >
                <ShoppingCart size={18} className="text-textPrimary" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-3 md:hidden">
              <Link to="/cart" className="relative rounded-full border border-[#17313a14] bg-white/70 p-3 text-textPrimary">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen((value) => !value)}
                className="rounded-full border border-[#17313a14] bg-white/70 p-3 text-textPrimary"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-[#17313a14] bg-[#fbfaf6]/96 shadow-2xl md:hidden">
            <div className="space-y-5 px-4 py-5">
              <form onSubmit={handleSearch} className="rounded-[1.4rem] border border-[#17313a14] bg-white/80 p-3">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-textSecondary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search the catalog"
                    className="h-10 w-full bg-transparent text-textPrimary outline-none placeholder:text-textSecondary"
                  />
                </div>
              </form>

              <div className="rounded-[1.6rem] border border-[#17313a14] bg-white/80 p-4 text-sm text-textSecondary">
                Faster discovery for mobiles, electronics, beauty, appliances, and fashion.
              </div>

              {isAuthenticated ? (
                <div className="rounded-[1.6rem] border border-[#17313a14] bg-white/80 p-4">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-textPrimary">{user?.name}</div>
                    <div className="mt-1 text-xs text-textSecondary">{user?.email}</div>
                  </div>
                  <div className="space-y-2">
                    {accountLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-center gap-3 rounded-xl bg-[#f3eee6] px-3 py-3 text-sm text-textPrimary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon size={16} className="text-primary" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl bg-[#ff875f14] px-3 py-3 text-sm text-[#ffc9b5]"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-[1.6rem] border border-[#17313a14] bg-white/80 p-4 text-sm font-medium text-textPrimary"
                >
                  Login or create your account
                </Link>
              )}

              <div className="grid grid-cols-2 gap-2">
                {storefrontCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="rounded-[1.2rem] border border-[#17313a14] bg-white px-3 py-4 text-sm text-textPrimary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="mb-3 flex h-14 w-full items-center justify-center overflow-hidden rounded-[1rem] bg-[#f6f3eb]">
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="font-semibold">{category.name}</div>
                    <div className="mt-1 text-xs text-textSecondary">{category.blurb}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="hidden border-b border-[#17313a14] bg-[#fbfaf6]/72 backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {storefrontCategories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group spot-grid flex min-w-[170px] flex-1 items-center gap-3 rounded-full border border-[#17313a12] bg-white/80 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#9cc63b55] hover:bg-white"
            >
              <div className="h-12 w-12 overflow-hidden rounded-full border border-[#17313a12] bg-[#f6f3eb] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-textPrimary">{category.name}</div>
                <div className="truncate text-xs text-textSecondary">{category.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
