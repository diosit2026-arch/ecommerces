import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp, Zap, ShieldCheck, Truck } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ui/ProductCard';

const MotionDiv = motion.div;
const MotionImg = motion.img;

const HeroBanners = [
  {
    id: 1,
    title: 'Next-Gen Electronics',
    subtitle: 'Discover the future of technology with our exclusive collection. Up to 40% off on selected items.',
    image: 'https://images.unsplash.com/photo-1550009158-9fff9f613111?auto=format&fit=crop&q=80',
    color: 'from-blue-600/90 to-purple-700/80'
  },
  {
    id: 2,
    title: 'Spring Fashion 2026',
    subtitle: 'Vibrant colors and bold designs. Redefine your wardrobe today.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80',
    color: 'from-pink-500/90 to-orange-500/80'
  },
  {
    id: 3,
    title: 'Modern Living',
    subtitle: 'Elevate your space with premium home decor.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    color: 'from-emerald-600/90 to-teal-800/80'
  }
];

const Features = [
  { icon: ShieldCheck, title: 'Secure Checkouts', desc: '100% Protected Payments' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs 4,000' },
  { icon: TrendingUp, title: 'Premium Quality', desc: 'Top-tier branded products' },
  { icon: Zap, title: 'Fast Delivery', desc: 'Next-day delivery available' }
];

const CategoryImages = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80',
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80',
  Home: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80',
  Beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { fetchProducts, getTrendingProducts, getDealsOfDay } = useProductStore();
  const trending = getTrendingProducts().slice(0, 4);
  const deals = getDealsOfDay().slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HeroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HeroBanners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HeroBanners.length) % HeroBanners.length);

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Slider */}
      <div className="relative h-[600px] w-full overflow-hidden group">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${HeroBanners[currentSlide].color} mix-blend-multiply z-10`} />
            <img 
              src={HeroBanners[currentSlide].image} 
              alt="Hero banner" 
              className="w-full h-full object-cover object-center"
            />
          </MotionDiv>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-12 lg:px-24">
          <MotionDiv
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              {HeroBanners[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
              {HeroBanners[currentSlide].subtitle}
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center px-8 py-4 text-lg font-bold bg-white text-gray-900 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Shop Now <ArrowRight className="ml-2" />
            </Link>
          </MotionDiv>
        </div>

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={30} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={30} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {HeroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 border-b border-gray-800 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Features.map((feat, i) => (
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-gray-800 rounded-full text-primary">
                <feat.icon size={26} />
              </div>
              <div>
                <h4 className="font-bold text-white">{feat.title}</h4>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* Shop by Category */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Shop by Category</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(CategoryImages).map(([name, url]) => (
            <Link to={`/products?category=${name}`} key={name}>
              <MotionDiv 
                whileHover={{ scale: 1.03 }}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 transition-opacity group-hover:opacity-80"/>
                <img src={url} alt={name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{name}</h3>
                  <span className="text-sm font-medium text-gray-300 flex items-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Explore <ArrowRight size={14} className="ml-1"/>
                  </span>
                </div>
              </MotionDiv>
            </Link>
          ))}
        </div>
      </div>

      {/* Deals of the Day */}
      <div className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Zap className="mr-3 text-red-500 fill-current" /> Deals of the Day
              </h2>
              <div className="h-1 w-20 bg-red-500 rounded-full"></div>
            </div>
            <Link to="/products" className="text-primary hover:text-white font-medium flex items-center transition-colors">
              View All <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 shadow-2xl">
          <div className="absolute inset-0 pattern-dots text-white/5 opacity-50"></div>
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-widest mb-4">Limited Offer</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Enhance your setup with Pro Accessories
              </h2>
              <p className="text-lg text-blue-200 mb-8">Save up to 50% on selected premium gear this weekend.</p>
              <Link to="/products" className="px-8 py-4 bg-primary hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all inline-block">
                Start Shopping
              </Link>
            </div>
            <div className="md:w-5/12 relative">
               <MotionImg 
                 initial={{ y: 20, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80" 
                 alt="Promo" 
                 className="rounded-2xl shadow-2xl origin-bottom transform rotate-3 hover:rotate-0 transition-transform duration-500" 
               />
               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <TrendingUp className="mr-3 text-secondary" /> Trending Now
            </h2>
            <div className="h-1 w-20 bg-secondary rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;

