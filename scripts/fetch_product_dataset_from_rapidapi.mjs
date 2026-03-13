import fs from 'fs';
import path from 'path';
import axios from 'axios';

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'src', 'data', 'electronics_products.json');
const USD_TO_INR_RATE = 83;

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf('=');
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
};

const env = {
  ...parseEnvFile(path.join(rootDir, '.env')),
  ...parseEnvFile(path.join(rootDir, '.env.local')),
  ...process.env,
};

const rapidApiKey = env.RAPIDAPI_KEY || '';
const rapidApiHost = env.RAPIDAPI_HOST || '';
const defaultUrl = env.RAPIDAPI_URL || '';

const getArgValue = (flag, fallback = '') => {
  const arg = process.argv.find((entry) => entry.startsWith(`${flag}=`));
  return arg ? arg.slice(flag.length + 1) : fallback;
};

const requestUrl = getArgValue('--url', defaultUrl);
const searchQuery = getArgValue('--query', 'smartwatch');
const queryList = getArgValue(
  '--queries',
  'smartwatch,headphones,laptop,tablet,keyboard,mouse,camera,speaker'
)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const page = getArgValue('--page', '1');
const maxPages = Number.parseInt(getArgValue('--pages', '3'), 10);
const country = getArgValue('--country', 'US');
const outputPath = getArgValue('--output', outputFile);

const ensureConfig = () => {
  if (!rapidApiKey) {
    throw new Error('RAPIDAPI_KEY is missing. Add it to .env.local.');
  }
  if (!rapidApiHost) {
    throw new Error('RAPIDAPI_HOST is missing. Add it to .env.local.');
  }
  if (!requestUrl) {
    throw new Error('RAPIDAPI_URL is missing. Add it to .env.local or pass --url=...');
  }
};

const appendDefaultParams = (urlString, queryValue, pageValue) => {
  const url = new URL(urlString);
  url.searchParams.set('query', queryValue);
  url.searchParams.set('page', pageValue);
  if (!url.searchParams.has('country')) {
    url.searchParams.set('country', country);
  }
  return url.toString();
};

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const extractProducts = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data?.products,
    payload?.data?.items,
    payload?.products,
    payload?.items,
    payload?.results,
    payload?.data,
  ];

  return candidates.find(Array.isArray) || [];
};

const normalizeImages = (product) => {
  const imageGroups = [
    asArray(product.product_photos),
    asArray(product.images),
    asArray(product.imageUrls),
    asArray(product.gallery),
  ];

  const standalone = [
    product.product_photo,
    product.image,
    product.thumbnail,
    product.main_image,
  ].filter(Boolean);

  return [...new Set([...standalone, ...imageGroups.flat()])];
};

const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const numeric = value.replace(/[^0-9.]/g, '');
  return numeric ? Number.parseFloat(numeric) : 0;
};

const parseRating = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 4;
  const numeric = value.replace(/[^0-9.]/g, '');
  return numeric ? Number.parseFloat(numeric) : 4;
};

const parseCount = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const numeric = value.replace(/[^0-9]/g, '');
  return numeric ? Number.parseInt(numeric, 10) : 0;
};

const toInrAmount = (value) => Math.round(value * USD_TO_INR_RATE);

const normalizeProduct = (product, index) => {
  const images = normalizeImages(product);
  const basePrice = parsePrice(product.product_price ?? product.price);
  const baseOriginalPrice = parsePrice(product.product_original_price ?? product.originalPrice) || basePrice;
  const price = toInrAmount(basePrice);
  const originalPrice = toInrAmount(baseOriginalPrice);
  const rating = parseRating(product.product_star_rating ?? product.rating);
  const reviewsCount = parseCount(product.product_num_ratings ?? product.reviewsCount);

  return {
    id: product.asin || product.id || index + 1,
    name: product.product_title || product.title || product.name || `Product ${index + 1}`,
    category: 'Electronics',
    brand: product.brand || product.seller_name || 'Generic',
    price,
    originalPrice,
    rating,
    stock: product.stock || 0,
    reviewsCount,
    description: product.product_description || product.description || product.about_product || '',
    image: images[0] || '',
    images,
    featureImages: asArray(product.product_details?.images),
    isTrending: rating >= 4.5,
    isDeal: originalPrice > price,
    sizes: [],
    measurements: {},
  };
};

const dedupeProducts = (products) => {
  const seen = new Set();

  return products.filter((product) => {
    const key = product.id || `${product.name}-${product.brand}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const main = async () => {
  ensureConfig();

  const queriesToUse = queryList.length > 0 ? queryList : [searchQuery];
  const startPage = Number.parseInt(page, 10);
  const collectedProducts = [];

  for (const queryValue of queriesToUse) {
    for (let currentPage = startPage; currentPage < startPage + maxPages; currentPage += 1) {
      const finalUrl = appendDefaultParams(requestUrl, queryValue, String(currentPage));
      const response = await axios.get(finalUrl, {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
        },
        timeout: 30000,
      });

      const pageProducts = extractProducts(response.data);
      if (pageProducts.length === 0) {
        break;
      }

      collectedProducts.push(...pageProducts.map(normalizeProduct));
    }
  }

  const products = dedupeProducts(collectedProducts);

  if (products.length === 0) {
    throw new Error('No products were found in the RapidAPI response.');
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`Saved ${products.length} products to ${outputPath} in INR`);
};

main().catch((error) => {
  console.error('RapidAPI import failed:', error.message);
  process.exit(1);
});
