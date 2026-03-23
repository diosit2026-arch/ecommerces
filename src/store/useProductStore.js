import { create } from 'zustand';
import electronicsProductsSource from '../data/electronics_products.json';
import flipkartProductsSource from '../data/flipkart_products.json';
import manualFashionProductsSource from '../data/manualFashionProducts';
import {
  hasValidProductPrice,
  removeDuplicateProducts,
  withEnhancedProductImages,
} from '../utils/productImageCatalog';
import { storefrontCategoryNames } from '../utils/siteContent';

const USD_TO_INR_RATE = 83;

const inferFashionSubcategory = (product) => {
  const text = `${product.name || ''} ${product.description || ''}`.toLowerCase();

  if (text.includes('heel')) return 'Heels';
  if (text.includes('slipper') || text.includes('slide')) return 'Slippers';
  if (text.includes('sandal')) return 'Sandals';
  if (text.includes('dress') || text.includes('gown')) return 'Dresses';
  if (text.includes('kurta') || text.includes('kurti')) return 'Kurtas';
  if (text.includes('saree') || text.includes('sari')) return 'Sarees';
  if (text.includes('loafer')) return 'Loafers';
  if (text.includes('sneaker')) return 'Sneakers';
  if (text.includes('shoe') || text.includes('sports shoes') || text.includes('running shoes')) return 'Shoes';
  if (text.includes('clog')) return 'Clogs';

  return 'Fashion Picks';
};

const toInrAmount = (value) => {
  const numericValue = Number(value) || 0;
  if (numericValue >= 1000) {
    return Math.round(numericValue);
  }
  return Math.round(numericValue * USD_TO_INR_RATE);
};

const getReasonableOriginalPrice = (priceValue, originalValue) => {
  const price = toInrAmount(priceValue);
  const candidateOriginal = toInrAmount(originalValue || 0);

  if (!price) {
    return 0;
  }

  const fallbackMultiplier =
    price >= 50000 ? 1.08 : price >= 20000 ? 1.12 : price >= 10000 ? 1.15 : price >= 3000 ? 1.18 : 1.22;
  const capMultiplier =
    price >= 50000 ? 1.14 : price >= 20000 ? 1.18 : price >= 10000 ? 1.22 : price >= 3000 ? 1.26 : 1.32;

  const fallbackOriginal = Math.round(price * fallbackMultiplier);
  const maxReasonableOriginal = Math.round(price * capMultiplier);

  if (candidateOriginal <= price) {
    return fallbackOriginal;
  }

  return Math.min(candidateOriginal, maxReasonableOriginal);
};

const normalizeProduct = (product, index, category, baseId) => ({
  ...product,
  id: baseId + index + 1,
  category,
  fashionSubcategory: category === 'Fashion' ? inferFashionSubcategory(product) : '',
  price: toInrAmount(product.price),
  image: product.image || product.images?.[0] || '',
  images: Array.isArray(product.images) ? product.images : [],
  originalPrice: getReasonableOriginalPrice(product.price, product.originalPrice),
  reviewsCount: product.reviewsCount || product.stock || 0,
  isTrending: product.isTrending ?? false,
  isDeal: product.isDeal ?? false,
  sizes: Array.isArray(product.sizes) ? product.sizes : [],
  measurements: product.measurements || {},
});

const electronicsProducts = electronicsProductsSource
  .map((product, index) => normalizeProduct(product, index, 'Electronics', 1000))
  .map(withEnhancedProductImages);

const flipkartProducts = flipkartProductsSource
  .map((product, index) => normalizeProduct(product, index, product.category || 'Electronics', 9000))
  .map(withEnhancedProductImages);

const manualFashionProducts = manualFashionProductsSource
  .map((product, index) => normalizeProduct(product, index, 'Fashion', 30000))
  .map(withEnhancedProductImages);

const allProducts = removeDuplicateProducts(
  [...electronicsProducts, ...flipkartProducts, ...manualFashionProducts]
    .filter((product) => storefrontCategoryNames.includes(product.category))
    .filter(hasValidProductPrice),
);
const maxProductPrice = Math.max(...allProducts.map((product) => product.price), 1000);

export const useProductStore = create((set, get) => ({
  products: allProducts,
  isLoading: false,
  error: null,

  filters: {
    category: 'All',
    fashionSubcategory: 'All',
    priceRange: [0, maxProductPrice],
    rating: 0,
    searchQuery: '',
    brand: 'All'
  },

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({
    filters: {
      category: 'All',
      fashionSubcategory: 'All',
      priceRange: [0, maxProductPrice],
      rating: 0,
      searchQuery: '',
      brand: 'All'
    }
  }),

  getFilteredProducts: () => {
    const { products, filters } = get();
    return products.filter((product) => {
      if (filters.category !== 'All' && product.category !== filters.category) return false;
      if (
        filters.category === 'Fashion' &&
        filters.fashionSubcategory !== 'All' &&
        product.fashionSubcategory !== filters.fashionSubcategory
      ) return false;
      if (filters.brand !== 'All' && product.brand !== filters.brand) return false;
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
      if (product.rating < filters.rating) return false;
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;

      return true;
    });
  },

  getTrendingProducts: () => get().products.filter((product) => product.isTrending),
  getDealsOfDay: () => get().products.filter((product) => product.isDeal),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ products: allProducts, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
