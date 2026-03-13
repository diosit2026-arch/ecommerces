import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter as FilterIcon, ChevronDown } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ui/ProductCard';
import Loader from '../../components/ui/Loader';

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const { 
    isLoading, 
    fetchProducts, 
    getFilteredProducts, 
    setFilters 
  } = useProductStore();
  
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, newest

  useEffect(() => {
    fetchProducts();
    
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    // Keep store filters in sync with the URL so old searches/categories do not stick around.
    setFilters({
      category: categoryParam || 'All',
      searchQuery: searchParam || '',
    });
    
    window.scrollTo(0, 0);
  }, [searchParams, fetchProducts, setFilters]);

  // Apply sorting to filtered products
  const products = getFilteredProducts();
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return b.id - a.id; // Mock logic, assuming higher ID is newer
      default: return 0; // featured/default
    }
  });

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shop All Products</h1>
            <p className="text-gray-400">Showing {sortedProducts.length} results</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-surface text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8">
          {/* Product Grid */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="bg-surface lg:h-64 h-48 rounded-xl w-full"></div>
                    <div className="h-4 bg-surface rounded w-3/4"></div>
                    <div className="h-4 bg-surface rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-surface/30 rounded-2xl border border-gray-800 border-dashed">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FilterIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria or resetting filters.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductListingPage;
