import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  CreditCard,
  ShieldCheck,
  Truck,
  RefreshCw,
  Box,
  Image as ImageIcon,
  ImageOff,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import ProductCard from '../../components/ui/ProductCard';
import Seo from '../../components/seo/Seo';
import { siteUrl } from '../../utils/siteContent';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts, getTrendingProducts } = useProductStore();
  const { addToCart } = useCartStore();

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [viewerStyle, setViewerStyle] = useState({
    transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });
  const [isImmersiveActive, setIsImmersiveActive] = useState(false);

  const immersiveTimeoutRef = useRef(null);
  const relatedProducts = getTrendingProducts().slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => () => clearTimeout(immersiveTimeoutRef.current), []);

  const product = products.find((item) => item.id === parseInt(id, 10));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  const gallery = product.images && product.images.length > 0
    ? product.images.slice(0, product.category === 'Mobiles' ? 6 : 4)
    : (product.image ? [product.image] : []);
  const displayedImage = gallery.includes(activeImage) ? activeImage : (product.image || '');
  const immersiveTitle = product.category === 'Mobiles' ? '360 Mobile Preview' : '3D Product Preview';
  const immersiveHint = product.category === 'Mobiles'
    ? 'Move mouse to simulate a 360-degree product spin'
    : 'Move mouse to tilt';

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const specItems = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Rating', value: `${product.rating} / 5` },
    { label: 'Reviews', value: `${product.reviewsCount}` },
    { label: 'Gallery', value: `${gallery.length} product images` },
  ];
  const featureImages = Array.isArray(product.featureImages) ? product.featureImages : [];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const handleImmersiveMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relativeX - 0.5) * 24;
    const rotateX = (0.5 - relativeY) * 20;

    setIsImmersiveActive(true);
    setViewerStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`,
    });

    clearTimeout(immersiveTimeoutRef.current);
    immersiveTimeoutRef.current = setTimeout(() => {
      setIsImmersiveActive(false);
    }, 120);
  };

  const resetImmersiveView = () => {
    clearTimeout(immersiveTimeoutRef.current);
    setIsImmersiveActive(false);
    setViewerStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <Seo
        title={product ? `${product.name} by ${product.brand}` : 'Product Details'}
        description={product ? `${product.name} on NamshyCart. Shop ${product.category?.toLowerCase()} products with pricing, ratings, gallery images, secure checkout, and fast delivery.` : 'Explore product details on NamshyCart.'}
        keywords={product ? `${product.name}, ${product.brand}, ${product.category}, NamshyCart, online shopping, product details` : 'NamshyCart product details'}
        canonical={`${siteUrl}/products/${id}`}
        jsonLd={product ? {
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
        } : null}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="hover:text-primary">Home</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <a href="/products" className="hover:text-primary">Products</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <a href={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-white truncate max-w-xs">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="bg-surface rounded-2xl overflow-hidden aspect-square border border-gray-800 relative group">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 text-gray-400">
                  <ImageOff size={44} />
                  <span className="text-sm font-medium">No product image</span>
                </div>
              )}
              <button className="absolute top-4 right-4 p-3 rounded-full bg-black/40 text-gray-300 hover:text-secondary hover:bg-black/60 transition-colors backdrop-blur">
                <Heart size={24} />
              </button>
            </div>

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    displayedImage === img ? 'border-primary scale-95' : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
                ))}
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_rgba(15,23,42,0.95)_58%)] p-5 shadow-[0_20px_80px_rgba(20,184,166,0.12)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Immersive View</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{immersiveTitle}</h3>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-200">
                  <Box size={20} />
                </div>
              </div>

              <div
                className="relative h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 [perspective:1400px]"
                onMouseMove={handleImmersiveMove}
                onMouseLeave={resetImmersiveView}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.24),_transparent_55%)]" />
                <div className="absolute inset-x-10 bottom-6 h-8 rounded-full bg-cyan-400/20 blur-2xl" />
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out [transform-style:preserve-3d]"
                  style={viewerStyle}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.14),_transparent_40%,_rgba(45,212,191,0.08)_85%)]" />
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt={`${product.name} immersive preview`}
                      className="h-[80%] w-[80%] object-contain drop-shadow-[0_26px_60px_rgba(8,145,178,0.45)]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ImageOff size={40} />
                      <span className="text-sm font-medium">No preview image</span>
                    </div>
                  )}
                </div>
                <div className="absolute left-4 top-4 rounded-full border border-cyan-400/30 bg-slate-900/70 px-3 py-1 text-xs font-medium text-cyan-100 backdrop-blur">
                  {immersiveHint}
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur">
                  {gallery.length} angles
                </div>
              </div>

              {gallery.length > 0 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                  <button
                    key={`immersive-${idx}`}
                    onClick={() => setActiveImage(img)}
                    className={`flex min-w-[92px] items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      displayedImage === img
                        ? 'border-cyan-300 bg-cyan-400/10 text-white'
                        : 'border-white/10 bg-slate-900/60 text-gray-300 hover:border-cyan-400/30'
                    }`}
                  >
                    <ImageIcon size={15} className="text-cyan-200" />
                    <span className="text-xs font-semibold">View {idx + 1}</span>
                  </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                {product.brand}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-600'}
                      size={20}
                    />
                  ))}
                </div>
                <span className="ml-2 text-white font-bold text-lg">{product.rating}</span>
                <span className="ml-2 text-gray-400">({product.reviewsCount} reviews)</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <button className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Share2 size={18} className="mr-2" /> Share
              </button>
            </div>

            <div className="flex items-end mb-8 space-x-4">
              <span className="text-5xl font-extrabold text-white">Rs {product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through mb-1">Rs {product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md mb-2">
                    {discountPercentage}% off
                  </span>
                </>
              )}
            </div>

            <div className="mb-8 rounded-2xl border border-gray-800 bg-surface/60 p-6">
              <h2 className="mb-3 text-xl font-bold text-white">Product Description</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Shop {product.name} from {product.brand} on NamshyCart for a cleaner buying experience, secure checkout, trusted delivery messaging, and easy access to related {product.category?.toLowerCase()} products.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {specItems.map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-800 bg-background/60 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{item.value}</p>
                  </div>
                ))}
              </div>
              {isImmersiveActive && (
                <p className="mt-4 text-sm text-cyan-300">
                  Immersive mode active. Move across the preview to inspect the product from different angles.
                </p>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Select Size</h3>
                  <button className="text-primary text-sm hover:underline font-medium">Size Chart</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-gray-700 bg-surface text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && product.measurements && product.measurements[selectedSize] && (
                  <div className="mt-3 text-sm text-gray-400 bg-surface p-3 border border-gray-800 rounded-lg inline-block">
                    <span className="font-semibold text-gray-300">Measurements:</span> {product.measurements[selectedSize]}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-gray-700 rounded-xl bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-4 text-gray-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-4 text-gray-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center py-4 px-8 rounded-xl font-bold text-lg transition-all ${
                  isAdded
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-surface border border-gray-700 text-white hover:bg-gray-800'
                }`}
              >
                <ShoppingCart className="mr-3" />
                {isAdded ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-lg"
              >
                Buy It Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 border-t border-gray-800 pt-8">
              <div className="flex items-center"><RefreshCw className="mr-3 text-primary" size={20} /> 30-Day Returns</div>
              <div className="flex items-center"><CreditCard className="mr-3 text-primary" size={20} /> Secure Checkout</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-16 mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>
          <div className="bg-surface rounded-2xl p-8 border border-gray-800">
            <div className="md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-700 pb-8 md:pb-0 mb-8 md:mb-0">
              <h3 className="text-6xl font-extrabold text-white mb-4">{product.rating}</h3>
              <div className="flex text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-600'} size={24} />
                ))}
              </div>
              <p className="text-gray-400">Based on {product.reviewsCount} reviews</p>
            </div>
            <div className="text-center py-8 text-gray-400">
              Detailed reviews will be displayed here in production.
            </div>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Product Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {gallery.map((img, idx) => (
              <div key={`detail-gallery-${idx}`} className="overflow-hidden rounded-2xl border border-gray-800 bg-surface">
                <img src={img} alt={`${product.name} detail ${idx + 1}`} className="h-64 w-full object-cover" />
                <div className="border-t border-gray-800 px-4 py-3">
                  <p className="text-sm font-semibold text-white">Angle {idx + 1}</p>
                  <p className="text-xs text-gray-400">Detailed product image for closer inspection.</p>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {featureImages.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">More Product Details</h2>
            <div className="grid gap-6">
              {featureImages.map((img, idx) => (
                <div key={`feature-image-${idx}`} className="overflow-hidden rounded-3xl border border-gray-800 bg-white">
                  <img
                    src={img}
                    alt={`${product.name} feature ${idx + 1}`}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-white mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
