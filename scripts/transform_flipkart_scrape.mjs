import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const defaultInput = path.join(rootDir, 'scapper', 'flipkart_products_full.json');
const defaultOutput = path.join(rootDir, 'src', 'data', 'flipkart_products.json');

const getArgValue = (flag, fallback = '') => {
  const arg = process.argv.find((entry) => entry.startsWith(`${flag}=`));
  return arg ? arg.slice(flag.length + 1) : fallback;
};

const inputPath = path.resolve(rootDir, getArgValue('--input', defaultInput));
const outputPath = path.resolve(rootDir, getArgValue('--output', defaultOutput));

const categoryMatchers = [
  { category: 'Mobiles', keywords: ['mobile', 'phone', 'smartphone', 'iphone', 'galaxy', 'redmi', 'realme', 'vivo', 'oppo', 'nothing phone'] },
  { category: 'Electronics', keywords: ['laptop', 'notebook', 'chromebook', 'tablet', 'smartwatch', 'watch', 'headphone', 'earbud', 'speaker', 'camera', 'printer', 'monitor', 'keyboard', 'mouse', 'power bank', 'tv', 'television', 'trimmer'] },
  { category: 'Fashion', keywords: ['shirt', 'tshirt', 't-shirt', 'jeans', 'saree', 'kurti', 'hoodie', 'jacket', 'shoes', 'sneakers', 'sandals', 'handbag', 'backpack', 'dress', 'frock', 'top', 'leggings', 'women', 'woman', 'girls', 'boys', 'kids', 'baby clothing'] },
  { category: 'Beauty', keywords: ['skincare', 'makeup', 'perfume', 'face wash', 'lipstick', 'serum', 'moisturizer', 'cleanser'] },
  { category: 'Appliances', keywords: ['refrigerator', 'washing machine', 'air conditioner', 'microwave', 'mixer grinder', 'induction stove', 'blender'] },
  { category: 'Toys', keywords: ['toy', 'teddy', 'doll', 'action figure', 'lego', 'puzzle', 'remote car'] },
  { category: 'Furniture', keywords: ['sofa', 'chair', 'table', 'study table', 'office chair', 'bed', 'mattress', 'curtains', 'wall clock', 'bedsheet', 'blanket', 'pillow'] },
];

const dedupe = (products) => {
  const seen = new Set();

  return products.filter((product) => {
    const key = product.link || product.name;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const toNumber = (value) => {
  const numeric = String(value ?? '').replace(/[^\d.]/g, '');
  return numeric ? Number.parseFloat(numeric) : 0;
};

const normalizeSizes = (sizes) => {
  if (!Array.isArray(sizes)) return [];

  const normalized = [];
  for (const rawSize of sizes) {
    const value = String(rawSize || '').trim();
    if (!value) continue;

    const upper = value.toUpperCase();
    if (['XXXS','XXS','XS','S','M','L','XL','XXL','XXXL','3XL','4XL','5XL'].includes(upper)) {
      if (!normalized.includes(upper)) normalized.push(upper);
      continue;
    }

    if (/^\d{1,2}-\d{1,2}\s*(YEARS|YRS)$/i.test(value) || /^\d{1,2}\s*(YEARS|YRS)$/i.test(value)) {
      const clean = value.replace(/\s+/g, ' ').replace(/yrs/i, 'Years');
      if (!normalized.includes(clean)) normalized.push(clean);
      continue;
    }

    if (/^\d{2,3}$/.test(value)) {
      const num = Number(value);
      if (num >= 18 && num <= 60) {
        const clean = String(num);
        if (!normalized.includes(clean)) normalized.push(clean);
      }
    }
  }

  return normalized;
};

const inferCategory = (product) => {
  const haystack = `${product.title || ''} ${product.link || ''}`.toLowerCase();
  const source = String(product.link || '').toLowerCase();

  if (source.includes('/mobile/') || source.includes('pid=mob')) return 'Mobiles';
  if (source.includes('/washing-machine/') || source.includes('/refrigerator/') || source.includes('/air-conditioner/') || source.includes('/microwave-oven/') || source.includes('/mixerjuicergrinder/')) return 'Appliances';
  if (source.includes('/sofa/') || source.includes('/chair/') || source.includes('/bed/') || source.includes('/mattress/') || source.includes('/table/')) return 'Furniture';
  if (source.includes('/toys/')) return 'Toys';

  for (const rule of categoryMatchers) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return rule.category;
    }
  }

  return 'Electronics';
};

const inferBrand = (title) => {
  const cleaned = String(title || '').trim();
  return cleaned ? cleaned.split(/\s+/)[0] : 'Generic';
};

const normalizeImages = (images, mainImage) => {
  const combined = [mainImage, ...(Array.isArray(images) ? images : [])].filter(Boolean);
  return [...new Set(combined)];
};

const transformProduct = (product, index) => {
  const price = Math.round(toNumber(product.price));
  const rating = toNumber(product.rating) || 0;
  const category = inferCategory(product);
  const images = normalizeImages(product.images, product.main_image);
  const originalPrice = price > 0 ? Math.round(price * 1.12) : 0;
  const cleanedSizes = normalizeSizes(product.sizes);

  return {
    id: `flipkart-${index + 1}`,
    name: product.title || `Flipkart Product ${index + 1}`,
    category,
    brand: inferBrand(product.title),
    price,
    originalPrice,
    rating,
    stock: 0,
    reviewsCount: 0,
    description: product.description || '',
    image: images[0] || '',
    images,
    featureImages: images.slice(1, 5),
    isTrending: rating >= 4,
    isDeal: originalPrice > price,
    sizes: cleanedSizes,
    measurements: { ...(product.specifications || {}), ...(cleanedSizes.length ? { 'Size Chart': cleanedSizes.join(', ') } : {}) },
    source: product.link || '',
  };
};

const main = () => {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const rawProducts = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const products = dedupe(rawProducts)
    .map(transformProduct)
    .filter((product) => product.name && product.price > 0 && product.image);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`Saved ${products.length} categorized Flipkart products to ${outputPath}`);
};

main();
