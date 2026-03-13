const unique = (items) => [...new Set(items.filter(Boolean))];

export const withRealProductImages = (product) => {
  const images = unique([
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ]);

  return {
    ...product,
    image: images[0] || '',
    images,
  };
};
