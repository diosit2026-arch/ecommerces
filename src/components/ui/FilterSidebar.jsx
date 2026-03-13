import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';

const MotionDiv = motion.div;
const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const FilterSidebar = ({ isOpen, onClose, isMobile }) => {
  const { filters, products, setFilters, resetFilters } = useProductStore();
  const maxPrice = Math.max(...products.map((product) => product.price), 1000);

  const categories = ['All', ...new Set(products.map((product) => product.category).filter(Boolean))];
  const brands = ['All', ...new Set(products.map((product) => product.brand).filter(Boolean))];
  const ratings = [0, 4, 3, 2];

  const SidebarContent = (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Filter size={20} className="mr-2 text-primary" /> Filters
        </h2>
        {isMobile && (
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-gray-800">
            <X size={20} />
          </button>
        )}
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors mb-6"
      >
        Reset All Filters
      </button>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => setFilters({ category: cat })}
                className="form-radio h-4 w-4 text-primary bg-gray-800 border-gray-600 focus:ring-primary focus:ring-opacity-50"
              />
              <span className={`text-sm ${filters.category === cat ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === brand}
                onChange={() => setFilters({ brand })}
                className="form-radio h-4 w-4 text-secondary bg-gray-800 border-gray-600 focus:ring-secondary focus:ring-opacity-50"
              />
              <span className={`text-sm ${filters.brand === brand ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Price Range</h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ priceRange: [0, Number.parseInt(e.target.value, 10)] })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatInr(0)}</span>
            <span className="text-white font-medium">{formatInr(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer Rating</h3>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => setFilters({ rating })}
                className="form-radio h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 focus:ring-yellow-500 focus:ring-opacity-50"
              />
              <span className={`text-sm flex items-center ${filters.rating === rating ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                {rating === 0 ? 'Any Rating' : `${rating} Stars & Up`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
            <MotionDiv
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-80 bg-surface border-r border-gray-800 z-50 shadow-2xl"
            >
              {SidebarContent}
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-800 bg-surface rounded-xl hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
      {SidebarContent}
    </div>
  );
};

export default FilterSidebar;
