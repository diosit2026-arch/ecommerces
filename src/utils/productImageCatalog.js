const normalizeName = (value = '') => value.toLowerCase().replace(/\s+/g, ' ').trim();

const canonicalizeImageUrl = (url = '') => {
  if (!url) return '';

  return url
    .trim()
    .replace(/https?:\/\/rukmini\d*\.flipcart\.com/i, 'https://rukminim.flipkart.com')
    .replace(/https?:\/\/rukminim\d*\.flipcart\.com/i, 'https://rukminim.flipkart.com')
    .replace(/\/image\/\d+\/\d+\//, '/image/ORIGINAL/ORIGINAL/')
    .replace(/([?&])q=\d+/g, '$1')
    .replace(/([?&])frame=\d+/g, '$1')
    .replace(/[?&]+$/, '');
};

const uniqueImages = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    if (!item) return false;
    const key = canonicalizeImageUrl(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const withEnhancedProductImages = (product) => {
  const images = uniqueImages([
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ]);
  const featureImages = uniqueImages([
    ...(Array.isArray(product.featureImages) ? product.featureImages : []),
  ]);

  return {
    ...product,
    image: images[0] || '',
    images,
    featureImages,
  };
};

const scoreProduct = (product) => {
  const imageCount = Array.isArray(product.images) ? product.images.length : 0;
  const featureCount = Array.isArray(product.featureImages) ? product.featureImages.length : 0;

  return (
    imageCount * 100 +
    featureCount * 20 +
    (Number(product.reviewsCount) || 0) +
    (Number(product.rating) || 0) * 10
  );
};

const mergeProductGroup = (products) => {
  const sorted = [...products].sort((left, right) => scoreProduct(right) - scoreProduct(left));
  const primary = sorted[0];
  const lowestPrice = Math.min(...sorted.map((product) => Number(product.price) || 0).filter((price) => price > 0));
  const highestOriginalPrice = Math.max(...sorted.map((product) => Number(product.originalPrice) || 0), Number(primary.originalPrice) || 0);
  const images = uniqueImages(sorted.flatMap((product) => product.images || []));
  const featureImages = uniqueImages(sorted.flatMap((product) => product.featureImages || []));
  const sources = [...new Set(sorted.map((product) => product.source).filter(Boolean))];

  return {
    ...primary,
    price: lowestPrice || Number(primary.price) || 0,
    originalPrice: highestOriginalPrice || Number(primary.originalPrice) || Number(primary.price) || 0,
    image: images[0] || primary.image || '',
    images,
    featureImages,
    source: sources[0] || primary.source,
  };
};

export const removeDuplicateProducts = (products) => {
  const groupedProducts = products.reduce((groups, product) => {
    const key = [
      normalizeName(product.category),
      normalizeName(product.brand),
      normalizeName(product.name),
    ].join('|');

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(product);
    return groups;
  }, new Map());

  return [...groupedProducts.values()].map(mergeProductGroup);
};

const hasUsableProductImage = (product) => {
  const primaryImage = typeof product.image === 'string' ? product.image.trim() : '';
  const galleryImages = Array.isArray(product.images)
    ? product.images.filter((image) => typeof image === 'string' && image.trim())
    : [];

  return Boolean(primaryImage || galleryImages.length > 0);
};

export const hasValidProductPrice = (product) => Number(product.price) > 0 && hasUsableProductImage(product);
