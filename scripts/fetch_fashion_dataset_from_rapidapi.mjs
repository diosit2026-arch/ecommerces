import fs from 'fs';
import path from 'path';
import axios from 'axios';

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'src', 'data', 'fashion_products.json');
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
const rapidApiHost = env.RAPIDAPI_FASHION_HOST || '';
const defaultUrl = env.RAPIDAPI_FASHION_URL || '';

const getArgValue = (flag, fallback = '') => {
  const arg = process.argv.find((entry) => entry.startsWith(`${flag}=`));
  return arg ? arg.slice(flag.length + 1) : fallback;
};

const requestUrl = getArgValue('--url', defaultUrl);
const queryList = getArgValue(
  '--queries',
  'dress,shirt,jeans,jacket,sneakers,kurta,hoodie,handbag'
)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const page = Number.parseInt(getArgValue('--page', '1'), 10);
const maxPages = Number.parseInt(getArgValue('--pages', '3'), 10);
const store = getArgValue('--store', 'IN');
const country = getArgValue('--country', 'IN');
const currency = getArgValue('--currency', 'INR');
const lang = getArgValue('--lang', 'en-IN');
const sizeSchema = getArgValue('--sizeSchema', 'IN');
const limit = Number.parseInt(getArgValue('--limit', '48'), 10);
const sort = getArgValue('--sort', 'freshness');
const outputPath = getArgValue('--output', outputFile);
const debug = getArgValue('--debug', 'false') === 'true';

const ensureConfig = () => {
  if (!rapidApiKey) {
    throw new Error('RAPIDAPI_KEY is missing. Add it to .env.local.');
  }
  if (!rapidApiHost) {
    throw new Error('RAPIDAPI_FASHION_HOST is missing. Add it to .env.local.');
  }
  if (!requestUrl) {
    throw new Error('RAPIDAPI_FASHION_URL is missing. Add it to .env.local or pass --url=...');
  }
};

const appendParams = (urlString, queryValue, pageValue) => {
  const url = new URL(urlString);
  const pageNumber = Number.parseInt(pageValue, 10);
  const offset = Math.max(pageNumber - 1, 0) * limit;
  const queryKeys = ['searchTerm', 'searchterm', 'query', 'term', 'keyword'];

  if (!queryKeys.some((key) => url.searchParams.has(key))) {
    url.searchParams.set('searchTerm', queryValue);
  }

  for (const key of queryKeys) {
    if (url.searchParams.has(key)) {
      url.searchParams.set(key, queryValue);
    }
  }

  url.searchParams.set('store', url.searchParams.get('store') || store);
  url.searchParams.set('country', url.searchParams.get('country') || country);
  url.searchParams.set('currency', url.searchParams.get('currency') || currency);
  url.searchParams.set('lang', url.searchParams.get('lang') || lang);
  url.searchParams.set('sizeSchema', url.searchParams.get('sizeSchema') || sizeSchema);
  url.searchParams.set('limit', url.searchParams.get('limit') || String(limit));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('page', String(pageNumber));
  url.searchParams.set('sort', url.searchParams.get('sort') || sort);

  return url.toString();
};

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const findFirstArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== 'object') {
    return [];
  }

  for (const nestedValue of Object.values(value)) {
    if (Array.isArray(nestedValue) && nestedValue.length > 0) {
      return nestedValue;
    }
  }

  return [];
};

const extractProducts = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data?.products,
    payload?.data?.items,
    payload?.data?.productList?.products,
    payload?.data?.productList?.items,
    payload?.data?.searchResults,
    payload?.data?.productsWithCatIds,
    payload?.products,
    payload?.items,
    payload?.response?.products,
    payload?.response?.items,
    findFirstArray(payload?.data),
    findFirstArray(payload),
  ];

  return candidates.find((candidate) => Array.isArray(candidate) && candidate.length > 0) || [];
};

const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const numeric = value.replace(/[^0-9.]/g, '');
  return numeric ? Number.parseFloat(numeric) : 0;
};

const toInrAmount = (value) => {
  const numericValue = Number(value) || 0;
  if (numericValue >= 1000) {
    return Math.round(numericValue);
  }
  return Math.round(numericValue * USD_TO_INR_RATE);
};

const pickImages = (product) => {
  const images = [
    ...asArray(product.additionalImageUrls),
    ...asArray(product.images),
    ...asArray(product.imageUrls),
    ...asArray(product.media?.images),
    product.imageUrl,
    product.image,
    product.thumbnail,
  ].filter(Boolean);

  return [...new Set(images)];
};

const normalizeProduct = (product, index) => {
  const images = pickImages(product);
  const basePrice = parseNumber(
    product.price?.current?.value
      ?? product.price?.value
      ?? product.price?.amount
      ?? product.currentPrice
      ?? product.price
  );
  const baseOriginalPrice = parseNumber(
    product.price?.previous?.value
      ?? product.previousPrice
      ?? product.originalPrice
      ?? basePrice
  ) || basePrice;
  const rating = parseNumber(product.rating ?? product.averageRating ?? 4);
  const reviewsCount = parseNumber(product.reviewsCount ?? product.reviewCount ?? 0);

  return {
    id: product.id || product.productCode || product.sku || product.asin || index + 1,
    name: product.name || product.title || `Fashion Product ${index + 1}`,
    category: 'Fashion',
    brand: product.brandName || product.brand || 'Fashion',
    price: toInrAmount(basePrice),
    originalPrice: toInrAmount(baseOriginalPrice),
    rating: rating || 4,
    stock: product.stock || 0,
    reviewsCount,
    description: product.description || product.subtitle || '',
    image: images[0] || '',
    images,
    featureImages: [],
    isTrending: (rating || 0) >= 4.3,
    isDeal: baseOriginalPrice > basePrice,
    sizes: asArray(product.availableSizes).map((size) => size?.size || size).filter(Boolean),
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

const logDebugPayload = (queryValue, finalUrl, payload) => {
  const previewPath = path.join(rootDir, 'src', 'data', 'fashion_api_preview.json');
  fs.writeFileSync(previewPath, JSON.stringify(payload, null, 2));
  console.log(`No products found for query "${queryValue}".`);
  console.log(`Checked URL: ${finalUrl}`);
  console.log(`Saved response preview to ${previewPath}`);
  console.log(`Top-level keys: ${Object.keys(payload || {}).join(', ') || 'none'}`);
};

const main = async () => {
  ensureConfig();

  const collectedProducts = [];

  for (const queryValue of queryList) {
    for (let currentPage = page; currentPage < page + maxPages; currentPage += 1) {
      const finalUrl = appendParams(requestUrl, queryValue, String(currentPage));
      const response = await axios.get(finalUrl, {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
        },
        timeout: 30000,
      });

      const pageProducts = extractProducts(response.data);
      if (pageProducts.length === 0) {
        if (debug || collectedProducts.length === 0) {
          logDebugPayload(queryValue, finalUrl, response.data);
        }
        break;
      }

      collectedProducts.push(...pageProducts.map(normalizeProduct));
    }
  }

  const products = dedupeProducts(collectedProducts);

  if (products.length === 0) {
    throw new Error('No fashion products were found in the RapidAPI response. Run with --debug=true and inspect src/data/fashion_api_preview.json.');
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`Saved ${products.length} fashion products to ${outputPath}`);
};

main().catch((error) => {
  if (error.response) {
    console.error('RapidAPI fashion import failed:', error.response.status, JSON.stringify(error.response.data, null, 2));
  } else {
    console.error('RapidAPI fashion import failed:', error.message);
  }
  process.exit(1);
});
