import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  CreditCard,
  Heart,
  Image as ImageIcon,
  ImageOff,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import ProductCard from '../../components/ui/ProductCard';
import Seo from '../../components/seo/Seo';
import { siteUrl } from '../../utils/siteContent';

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts, getTrendingProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [viewerStyle, setViewerStyle] = useState({ transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const immersiveTimeoutRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => () => clearTimeout(immersiveTimeoutRef.current), []);

  const product = products.find((item) => item.id === parseInt(id, 10));
  const relatedProducts = getTrendingProducts()
    .filter((item) => item.id !== parseInt(id, 10))
    .slice(0, 4);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-10 py-8 text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-textSecondary">Loading product details...</p>
        </div>
      </div>
    );
  }

  const gallery = product.images && product.images.length > 0 ? product.images.slice(0, 6) : product.image ? [product.image] : [];
  const displayedImage = gallery.includes(activeImage) ? activeImage : product.image || gallery[0] || '';
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const featureImages = Array.isArray(product.featureImages) ? product.featureImages : [];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const handleImmersiveMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relativeX - 0.5) * 18;
    const rotateX = (0.5 - relativeY) * 14;

    setViewerStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
    });

    clearTimeout(immersiveTimeoutRef.current);
    immersiveTimeoutRef.current = setTimeout(() => {
      setViewerStyle({ transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <Seo
        title={`${product.name} by ${product.brand}`}
        description={`${product.name} on Infinity Cart. Shop ${product.category?.toLowerCase()} products with pricing, ratings, gallery images, secure checkout, and fast delivery.`}
        keywords={`${product.name}, ${product.brand}, ${product.category}, Infinity Cart, online shopping, product details`}
        canonical={`${siteUrl}/products/${id}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          brand: product.brand,
          description: product.description,
          image: gallery,
          category: product.category,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price,
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          },
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-textSecondary" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-white">{product.category}</Link>
          <span>/</span>
          <span className="truncate text-white">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(11,32,49,0.94))]">
              <div
                className="relative aspect-square overflow-hidden bg-[#081a29] [perspective:1200px]"
                onMouseMove={handleImmersiveMove}
                onMouseLeave={() => setViewerStyle({ transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' })}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,209,197,0.2),transparent_35%)]" />
                <div className="absolute right-4 top-4 z-10 flex gap-2">
                  <button type="button" className="rounded-full border border-white/10 bg-black/25 p-3 text-gray-200 backdrop-blur">
                    <Heart size={18} />
                  </button>
                  <button type="button" className="rounded-full border border-white/10 bg-black/25 p-3 text-gray-200 backdrop-blur">
                    <Share2 size={18} />
                  </button>
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out [transform-style:preserve-3d]"
                  style={viewerStyle}
                >
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt={product.name}
                      className="h-[78%] w-[78%] object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-textSecondary">
                      <ImageOff size={44} />
                      <span>No product image</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#07131f]/70 px-3 py-1 text-xs text-[#d7edf9]">
                  Move your cursor to tilt the preview
                </div>
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`overflow-hidden rounded-[1.2rem] border transition-all ${
                      displayedImage === image ? 'border-primary shadow-[0_0_0_1px_rgba(79,209,197,0.28)]' : 'border-white/10'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="aspect-square h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-[1.6rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,241,232,0.96))] p-5 shadow-[0_18px_40px_rgba(67,79,83,0.1)]">
              <div className="mb-4 flex items-center gap-3">
                <ImageIcon size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-textPrimary">Product highlights</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Brand', value: product.brand },
                  { label: 'Rating', value: `${product.rating} / 5` },
                  { label: 'Reviews', value: `${product.reviewsCount}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] border border-[#17313a12] bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#7d9730]">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-textPrimary">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(246,241,232,0.96))] p-6 shadow-[0_20px_60px_rgba(67,79,83,0.12)] sm:p-7">
              <div className="mb-3 inline-flex rounded-full bg-[#e7f4cf] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7d9730]">
                {product.brand}
              </div>
              <h1 className="section-title max-w-4xl text-3xl font-bold leading-[1.02] text-textPrimary sm:text-4xl lg:text-[3.2rem]">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-[#17313a12] pb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e8] px-3 py-1 text-sm text-textPrimary">
                  <Star size={14} className="fill-current text-[#ffb36b]" />
                  {product.rating}
                </span>
                <span className="text-sm text-textSecondary">{product.reviewsCount} reviews</span>
                <span className="rounded-full border border-[#17313a12] bg-white px-3 py-1 text-sm text-textSecondary">{product.category}</span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <span className="text-4xl font-extrabold text-textPrimary sm:text-5xl">{formatInr(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="mb-1 text-xl text-textSecondary line-through">{formatInr(product.originalPrice)}</span>
                    <span className="mb-2 rounded-full bg-[#e8f6ee] px-3 py-1 text-sm font-bold text-[#2b8f74]">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-[#17313a12] bg-white p-5">
                <h2 className="text-lg font-semibold text-textPrimary">Description</h2>
                <p className="mt-3 text-sm leading-7 text-textSecondary sm:text-base">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-textPrimary">Choose size</h3>
                    <span className="text-sm text-textSecondary">Optional</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 min-w-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                          selectedSize === size
                            ? 'border-primary bg-[#eef8d8] text-textPrimary'
                            : 'border-[#17313a12] bg-white text-textSecondary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && product.measurements && product.measurements[selectedSize] && (
                    <div className="mt-3 rounded-[1rem] border border-[#17313a12] bg-white px-4 py-3 text-sm text-textSecondary">
                      <span className="font-semibold text-textPrimary">Measurements:</span> {product.measurements[selectedSize]}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center rounded-full border border-[#17313a12] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-textPrimary">-</button>
                  <span className="w-12 text-center text-lg font-bold text-textPrimary">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-textPrimary">+</button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-colors ${
                    isAdded ? 'bg-accent text-slate-950' : 'border border-[#17313a12] bg-white text-textPrimary hover:bg-[#f6f2ea]'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {isAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#ffe2d8]"
                >
                  Buy Now
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.2rem] border border-[#17313a12] bg-white p-4 text-sm leading-7 text-textSecondary">
                  <Truck className="mb-2 text-primary" size={18} />
                  Fast dispatch on eligible orders.
                </div>
                <div className="rounded-[1.2rem] border border-[#17313a12] bg-white p-4 text-sm leading-7 text-textSecondary">
                  <CreditCard className="mb-2 text-primary" size={18} />
                  Cleaner checkout with card and COD support.
                </div>
                <div className="rounded-[1.2rem] border border-[#17313a12] bg-white p-4 text-sm leading-7 text-textSecondary">
                  <ShieldCheck className="mb-2 text-primary" size={18} />
                  Protected payment messaging and returns info.
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-[#0b2031] p-6">
              <h2 className="text-xl font-semibold text-white">Customer reviews</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-[0.34fr_0.66fr]">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-center">
                  <div className="text-5xl font-bold text-white">{product.rating}</div>
                  <div className="mt-3 flex justify-center gap-1 text-[#ffb36b]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={18} className={star <= Math.round(product.rating) ? 'fill-current' : ''} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-textSecondary">Based on {product.reviewsCount} reviews</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-textSecondary">
                  Detailed written reviews are not part of this demo yet, but the redesigned page keeps ratings, trust signals, and buying actions much easier to scan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {featureImages.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8 text-3xl font-bold text-white">More product details</h2>
            <div className="grid gap-6">
              {featureImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="rounded-[2rem] border border-white/10 bg-white p-6 shadow-[0_16px_40px_rgba(86,98,105,0.08)]"
                >
                  <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f6f2ea] p-4 md:min-h-[420px]">
                    <img
                      src={image}
                      alt={`${product.name} feature ${index + 1}`}
                      className="max-h-[260px] w-auto max-w-full object-contain md:max-h-[360px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="section-title mb-8 text-3xl font-bold text-white">You might also like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-[1.6rem] border border-[#17313a12] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,241,232,0.96))] p-5 shadow-[0_16px_40px_rgba(67,79,83,0.08)]">
          <div className="flex items-center gap-3 text-sm font-medium text-textPrimary">
            <RefreshCw size={18} className="text-primary" />
            30-day return messaging is available on eligible products.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
