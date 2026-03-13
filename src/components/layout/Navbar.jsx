import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const categories = [
    { name: 'Top Offers', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100' },
    { name: 'Mobiles', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
    { name: 'Electronics', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
    { name: 'Fashion', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100' },
    { name: 'Beauty', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
    { name: 'Appliances', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
    { name: 'Toys', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
    { name: 'Furniture', icon: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
  ];

  return (
    <>
      {/* Main Top Navbar */}
      <nav className="bg-surface text-textPrimary sticky top-0 z-50 border-b border-gray-800 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-4">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center h-full">
              <Link to="/" className="text-[22px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary italic flex items-center pr-4">
                FlipShop
                <span className="text-secondary text-sm font-bold ml-1"><em>Plus</em></span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 justify-start ml-4 max-w-[800px]">
              <form onSubmit={handleSearch} className="w-full relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <Search size={22} className="stroke-[2px]"/>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Products, Brands and More"
                  className="w-full bg-background text-textPrimary rounded-lg py-[10px] pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-colors border border-gray-700 focus:border-primary placeholder-gray-500"
                />
              </form>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-6 text-white">
              
              {/* Login / User */}
              <div className="group relative">
                {isAuthenticated ? (
                  <Link to="/account" className="flex items-center space-x-2 hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors">
                    <User size={20} className="text-gray-300" />
                    <span className="text-[15px] font-medium">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={16} className="text-gray-400 group-hover:rotate-180 transition-transform"/>
                  </Link>
                ) : (
                  <Link to="/account" className="flex items-center space-x-2 hover:bg-gray-800 py-2 px-4 border border-transparent hover:border-gray-700 rounded-lg transition-colors">
                    <User size={20} className="text-gray-300" />
                    <span className="text-[15px] font-medium">Login</span>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="flex items-center space-x-2 hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors relative">
                <div className="relative">
                  <ShoppingCart size={22} className="text-gray-300 group-hover:text-primary transition-colors" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] text-white font-bold border border-surface">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-[15px] font-medium hidden lg:block">Cart</span>
              </Link>
              
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-300 hover:text-primary transition-colors">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white font-bold border border-surface">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 p-2 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-t border-gray-800 shadow-lg absolute w-full left-0 z-50">
            <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
               {isAuthenticated ? (
                 <div className="flex items-center space-x-3 text-white">
                   <User size={24} className="text-primary" />
                   <span className="font-medium text-lg">Hi, {user?.name?.split(' ')[0]}</span>
                 </div>
               ) : (
                 <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-white font-medium text-lg">
                   <User size={24} className="text-primary" />
                   <span>Login / Register</span>
                 </Link>
               )}
            </div>
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-background border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-primary"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary">
                  <Search size={20} />
                </button>
              </form>
              
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.name === 'Top Offers' ? '/products' : `/products?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center justify-center p-3 border border-gray-800 rounded-lg bg-background hover:border-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="bg-white/90 rounded-md p-1 mb-2">
                       <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-xs font-medium text-gray-300">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Categories Sub-nav (Desktop Only) */}
      <div className="hidden md:block bg-surface border-b border-gray-800 shadow-sm relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-end justify-between px-2">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                to={cat.name === 'Top Offers' ? '/products' : `/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center group cursor-pointer px-1 w-[80px]"
              >
                <div className="w-[64px] h-[64px] mb-2 relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                   <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[14px] font-medium text-gray-300 whitespace-nowrap group-hover:text-primary transition-colors flex items-center">
                  {cat.name}
                  {['Fashion', 'Electronics', 'Beauty'].includes(cat.name) && (
                    <ChevronDown size={14} className="ml-1 text-gray-500 group-hover:text-primary group-hover:rotate-180 transition-transform"/>
                  )}
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
