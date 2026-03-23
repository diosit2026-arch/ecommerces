import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ImageOff, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const [tiltStyle, setTiltStyle] = React.useState({});
  const hasImage = Boolean(product.image);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTiltStyle({});
      }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        setTiltStyle({
          transform: `perspective(1400px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px)`,
        });
      }}
      style={tiltStyle}
      className="group tilt-shell aurora-panel flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-[#17313a14] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.98))] shadow-[0_18px_50px_rgba(86,98,105,0.12)] transition-all duration-300 hover:border-[#9cc63b55]"
    >
      <div className="relative tilt-layer">
        <div className="floating-orb left-6 top-8 h-14 w-14 bg-[#9cc63b24]" />
        <div className="floating-orb right-7 top-16 h-10 w-10 bg-[#ef845524]" style={{ animationDelay: '1.2s' }} />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {product.isDeal && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
              Deal
            </span>
          )}
          {product.isTrending && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
              Trending
            </span>
          )}
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full border border-[#17313a14] bg-white/80 p-2 text-textSecondary backdrop-blur-sm transition-colors hover:text-textPrimary"
        >
          <Heart size={17} />
        </button>

        <Link to={`/products/${product.id}`} className="spot-grid block aspect-[1.02] overflow-hidden bg-[#f0ece4]">
          {hasImage ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.11) rotate(-1deg)' : 'scale(1)' }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f3eee6] to-[#fbfaf6] text-textSecondary">
              <ImageOff size={36} />
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}
          <div className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(156,198,59,0.06),transparent_40%,rgba(23,49,58,0.16))] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7d9730]">
            {product.brand || product.category}
          </div>
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-textPrimary transition-colors group-hover:text-[#4e6a1d]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-3 flex items-center gap-2 text-sm text-textPrimary">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f0e8] px-2.5 py-1">
              <Star size={13} className="fill-current text-primary" />
              {product.rating}
            </span>
            <span className="text-textSecondary">({product.reviewsCount})</span>
            <span className="rounded-full border border-white/8 px-2.5 py-1 text-xs text-textSecondary">
              {product.category}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-textPrimary">{formatInr(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-textSecondary line-through">
                  {formatInr(product.originalPrice)}
                </span>
              )}
            </div>
            <Link
              to={`/products/${product.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#dffef8] transition-transform hover:translate-x-0.5"
            >
              View
              <ArrowRight size={15} />
            </Link>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
              isAdded
                ? 'bg-accent text-slate-950'
                : 'shimmer-line bg-white text-slate-950 hover:bg-[#f2ffc8]'
            }`}
          >
            <ShoppingCart size={17} />
            {isAdded ? 'Added to Cart' : 'Quick Add'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
