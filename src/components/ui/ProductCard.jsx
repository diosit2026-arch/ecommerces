import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const hasImage = Boolean(product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-surface rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col h-full group relative"
    >
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {product.isDeal && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            DEAL
          </span>
        )}
        {product.isTrending && (
          <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            TRENDING
          </span>
        )}
      </div>

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-gray-300 hover:text-secondary hover:bg-black/60 transition-colors backdrop-blur-sm"
      >
        <Heart size={18} />
      </button>

      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-900 flex-shrink-0">
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 text-gray-400">
            <ImageOff size={36} />
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold shadow-xl transform transition-transform duration-300 ${
              isAdded
                ? 'bg-accent text-white scale-105'
                : 'bg-primary text-white hover:bg-indigo-600 scale-100'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{isAdded ? 'Added to Cart' : 'Quick Add'}</span>
          </button>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">
            {product.brand}
          </div>
          <Link to={`/products/${product.id}`} className="block block group-hover:text-primary transition-colors">
            <h3 className="font-semibold text-white leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center space-x-1 mb-3">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300 font-medium">{product.rating}</span>
            <span className="text-xs text-textSecondary">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-white">{formatInr(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-textSecondary line-through">
                {formatInr(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
