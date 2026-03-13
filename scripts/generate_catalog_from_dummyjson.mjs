import fs from 'fs';
import path from 'path';
import axios from 'axios';

const ROOT_DIR = process.cwd();
const DEFAULT_OUTPUT = path.join(ROOT_DIR, 'src', 'data', 'electronics_products.json');
const DUMMYJSON_URL = 'https://dummyjson.com/products';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

const args = process.argv.slice(2);

const getArgValue = (flag, fallback) => {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
};

const requestedCount = Number.parseInt(getArgValue('--count', '200'), 10);
const outputFile = getArgValue('--output', DEFAULT_OUTPUT);
const categoryFilter = getArgValue('--category', 'smartphones,laptops,tablets,mens-watches,womens-watches,mobile-accessories');
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || '';

const normalizeCategory = (category) => {
  const watches = new Set(['mens-watches', 'womens-watches']);
  if (watches.has(category)) return 'smartwatch';
  if (category === 'mobile-accessories') return 'headphones';
  if (category === 'smartphones') return 'smartphone';
  return category.replace(/-/g, ' ');
};

const normalizeBrand = (brand) => brand || 'Generic';

const buildQueryTerms = (product) => {
  const normalizedCategory = normalizeCategory(product.category);
  return [
    `${product.title} ${normalizedCategory}`,
    `${product.brand} ${normalizedCategory}`,
    normalizedCategory,
    'consumer electronics',
  ].filter(Boolean);
};

const fallbackImages = (product, variantSeed) => {
  const slug = `${product.title}-${variantSeed}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return [
    `https://picsum.photos/seed/${slug}-1/900/900`,
    `https://picsum.photos/seed/${slug}-2/900/900`,
    `https://picsum.photos/seed/${slug}-3/900/900`,
    `https://picsum.photos/seed/${slug}-4/900/900`,
  ];
};

const fetchUnsplashImages = async (product, variantSeed) => {
  if (!unsplashAccessKey) {
    return fallbackImages(product, variantSeed);
  }

  const queries = buildQueryTerms(product);
  const images = [];

  for (const query of queries) {
    if (images.length >= 4) break;

    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query,
        per_page: 4,
        orientation: 'squarish',
      },
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
      timeout: 20000,
    });

    const urls = response.data.results
      .map((item) => item.urls?.regular)
      .filter(Boolean);

    for (const url of urls) {
      if (!images.includes(url)) {
        images.push(url);
      }
      if (images.length >= 4) break;
    }
  }

  return images.length > 0 ? images.slice(0, 4) : fallbackImages(product, variantSeed);
};

const createVariants = (products, count) => {
  const variants = [];

  for (let index = 0; index < count; index += 1) {
    const baseProduct = products[index % products.length];
    const cycle = Math.floor(index / products.length) + 1;

    variants.push({
      ...baseProduct,
      id: index + 1,
      title: cycle === 1 ? baseProduct.title : `${baseProduct.title} Edition ${cycle}`,
      price: Math.round(baseProduct.price * (1 + cycle * 0.03)),
      rating: Math.min(5, Number((baseProduct.rating + cycle * 0.02).toFixed(1))),
      stock: Math.max(10, baseProduct.stock - cycle),
    });
  }

  return variants;
};

const normalizeProduct = async (product, index) => {
  const images = await fetchUnsplashImages(product, index + 1);

  return {
    id: product.id,
    name: product.title,
    category: normalizeCategory(product.category),
    brand: normalizeBrand(product.brand),
    price: product.price,
    originalPrice: Math.round(product.price * 1.15),
    rating: product.rating,
    stock: product.stock,
    reviewsCount: Math.max(25, Math.round(product.stock * 7)),
    description: product.description,
    image: images[0],
    images,
    isTrending: product.rating >= 4.5,
    isDeal: product.discountPercentage >= 10,
    sizes: [],
    measurements: {},
  };
};

const main = async () => {
  const categories = categoryFilter.split(',').map((item) => item.trim()).filter(Boolean);

  const response = await axios.get(DUMMYJSON_URL, {
    params: {
      limit: 0,
    },
    timeout: 20000,
  });

  const filteredProducts = response.data.products.filter((product) => categories.includes(product.category));

  if (filteredProducts.length === 0) {
    throw new Error(`No DummyJSON products matched categories: ${categories.join(', ')}`);
  }

  const variants = createVariants(filteredProducts, requestedCount);
  const normalizedProducts = [];

  for (let index = 0; index < variants.length; index += 1) {
    const normalized = await normalizeProduct(variants[index], index);
    normalizedProducts.push(normalized);
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(normalizedProducts, null, 2));

  console.log(`Generated ${normalizedProducts.length} products at ${outputFile}`);
  if (!unsplashAccessKey) {
    console.log('UNSPLASH_ACCESS_KEY not set. Fallback placeholder images were used.');
  }
};

main().catch((error) => {
  console.error('Failed to generate catalog:', error.message);
  process.exit(1);
});
