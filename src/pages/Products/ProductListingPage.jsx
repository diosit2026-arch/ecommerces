import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter as FilterIcon } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ui/ProductCard';
import Seo from '../../components/seo/Seo';
import { siteName, siteUrl, storefrontCategories } from '../../utils/siteContent';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, fetchProducts, getFilteredProducts, setFilters } = useProductStore();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const fashionTypeParam = searchParams.get('fashionType') || 'All';

  useEffect(() => {
    fetchProducts();
    setFilters({
      category: categoryParam || 'All',
      fashionSubcategory: categoryParam === 'Fashion' ? fashionTypeParam : 'All',
      searchQuery: searchParam || '',
    });
    window.scrollTo(0, 0);
  }, [categoryParam, fashionTypeParam, searchParam, fetchProducts, setFilters]);

  const products = getFilteredProducts();
  const fashionSubcategories = useMemo(() => {
    const options = new Set();

    useProductStore.getState().products.forEach((product) => {
      if (product.category === 'Fashion' && product.fashionSubcategory) {
        options.add(product.fashionSubcategory);
      }
    });

    const preferredOrder = ['Shoes', 'Sneakers', 'Slippers', 'Heels', 'Sandals', 'Dresses', 'Kurtas', 'Sarees', 'Loafers', 'Clogs', 'Fashion Picks'];
    return preferredOrder.filter((item) => options.has(item));
  }, []);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];
    return nextProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.id - a.id;
        case 'trending':
          return Number(b.isTrending) - Number(a.isTrending);
        default:
          return Number(b.isDeal) - Number(a.isDeal);
      }
    });
  }, [products, sortBy]);

  const pageHeading = categoryParam
    ? `${categoryParam} Products`
    : searchParam
      ? `Search results for "${searchParam}"`
      : 'Curated Product Catalog';

  const pageDescription = categoryParam
    ? `Browse ${categoryParam.toLowerCase()} products on ${siteName}, including curated deals, trending picks, and secure online shopping.`
    : searchParam
      ? `Find products matching ${searchParam} on ${siteName} across mobiles, electronics, beauty, appliances, and fashion.`
      : `${siteName} brings together mobiles, electronics, beauty, appliances, fashion, and daily deals in one cleaner shopping destination.`;

  const handleCategorySelect = (categoryName) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      nextParams.delete('category');
      nextParams.delete('fashionType');
    } else {
      nextParams.set('category', categoryName);
      if (categoryName !== 'Fashion') {
        nextParams.delete('fashionType');
      }
    }
    setSearchParams(nextParams);
  };

  const handleFashionTypeSelect = (fashionType) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('category', 'Fashion');
    if (fashionType === 'All') {
      nextParams.delete('fashionType');
    } else {
      nextParams.set('fashionType', fashionType);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <Seo
        title={pageHeading}
        description={pageDescription}
        keywords={`Infinity Cart products, ${categoryParam || searchParam || 'online shopping'}, mobiles, electronics, beauty, appliances, fashion`}
        canonical={`${siteUrl}/products`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2.2rem] border border-[#17313a12] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,242,233,0.95),rgba(255,245,238,0.92))] p-7 shadow-[0_20px_70px_rgba(67,79,83,0.1)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Browse with focus</p>
              <h1 className="section-title mt-3 text-3xl font-bold text-textPrimary md:text-4xl">{pageHeading}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-textSecondary">{pageDescription}</p>
              <p className="mt-3 text-sm font-semibold text-textPrimary">Showing {sortedProducts.length} results</p>
            </div>

            <div className="relative group">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="appearance-none rounded-full border border-[#17313a12] bg-white py-3 pl-4 pr-10 text-textPrimary outline-none transition-colors hover:border-[#9cc63b66]"
              >
                <option value="featured">Featured</option>
                <option value="trending">Trending first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!categoryParam ? 'bg-textPrimary text-white' : 'border border-[#17313a12] bg-white text-textPrimary hover:bg-[#f6f2ea]'}`}
            >
              All
            </button>
            {storefrontCategories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  categoryParam === category.name
                    ? 'bg-textPrimary text-white'
                    : 'border border-[#17313a12] bg-white text-textPrimary hover:bg-[#f6f2ea]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {categoryParam === 'Fashion' && fashionSubcategories.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#7d9730]">Fashion filters</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleFashionTypeSelect('All')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    fashionTypeParam === 'All'
                      ? 'bg-textPrimary text-white'
                      : 'border border-[#17313a12] bg-white text-textPrimary hover:bg-[#f6f2ea]'
                  }`}
                >
                  All styles
                </button>
                {fashionSubcategories.map((fashionType) => (
                  <button
                    key={fashionType}
                    type="button"
                    onClick={() => handleFashionTypeSelect(fashionType)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      fashionTypeParam === fashionType
                        ? 'bg-textPrimary text-white'
                        : 'border border-[#17313a12] bg-white text-textPrimary hover:bg-[#f6f2ea]'
                    }`}
                  >
                    {fashionType}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="spot-grid animate-pulse rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="aspect-square rounded-[1.4rem] bg-surface" />
                <div className="mt-4 h-4 w-2/3 rounded bg-surface" />
                <div className="mt-3 h-4 w-1/2 rounded bg-surface" />
                <div className="mt-6 h-10 rounded-full bg-surface" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="spot-grid rounded-[2rem] border border-dashed border-white/12 bg-white/[0.03] py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#09161d]">
              <FilterIcon size={32} className="text-textSecondary" />
            </div>
            <h3 className="text-xl font-bold text-white">No products found</h3>
            <p className="mx-auto mt-3 max-w-md text-textSecondary">
              We could not find products that match this search or category. Try switching categories or clearing the search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
