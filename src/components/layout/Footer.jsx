import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface text-textSecondary pt-12 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
              FlipShop
            </h3>
            <p className="mb-4 text-sm leading-relaxed">
              Your one-stop destination for modern, vibrant, and premium products. We bring the marketplace to your fingertips.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>123 Market Street, Suite 400<br/>San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>support@flipshop.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} FlipShop. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="w-10 h-6 bg-gray-700 rounded-sm"></div>
            <div className="w-10 h-6 bg-gray-700 rounded-sm"></div>
            <div className="w-10 h-6 bg-gray-700 rounded-sm"></div>
            <div className="w-10 h-6 bg-gray-700 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
