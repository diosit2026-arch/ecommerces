import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ui/ProductCard';
import Seo from '../../components/seo/Seo';
import {
  organizationJsonLd,
  siteName,
  siteUrl,
  storefrontCategories,
} from '../../utils/siteContent';

const MotionDiv = motion.div;

const heroStats = [
  { value: '5', label: 'high-energy category worlds' },
  { value: '24h', label: 'fast dispatch promise' },
  { value: '4.9/5', label: 'shopper delight score' },
];

const features = [
  {
    icon: Sparkles,
    title: 'Infinity Cart Search',
    desc: 'Search mobiles, fashion, beauty, appliances, and daily deals from one faster discovery bar.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Shopping Flow',
    desc: 'Infinity Cart keeps product discovery, pricing, and checkout steps clearer and easier to trust.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery Focus',
    desc: 'From quick offers to smooth order flow, Infinity Cart is designed around faster everyday shopping.',
  },
];

const revealUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const HomePage = () => {
  const { fetchProducts, getTrendingProducts, getDealsOfDay } = useProductStore();
  const trending = getTrendingProducts().slice(0, 4);
  const deals = getDealsOfDay().slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-textPrimary">
      <Seo
        title="Online Shopping for Mobiles, Electronics, Beauty and More"
        description="Explore Infinity Cart for mobiles, electronics, beauty, appliances, fashion, and daily deals with a cleaner shopping experience."
        keywords="Infinity Cart home, mobiles store, electronics shopping India, beauty products, appliances, fashion, daily deals"
        canonical={siteUrl}
        jsonLd={organizationJsonLd}
      />

      <section className="aurora-panel relative isolate overflow-hidden border-b border-white/10">
        <div className="floating-orb left-[-3rem] top-24 h-44 w-44 bg-[#c7ff6b22]" />
        <div className="floating-orb right-[-2rem] top-14 h-52 w-52 bg-[#ff7a5120]" style={{ animationDelay: '1.2s' }} />
        <div className="floating-orb bottom-14 right-[18%] h-28 w-28 bg-[#63f5d220]" style={{ animationDelay: '2.4s' }} />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dfff9b33] bg-[#c7ff6b18] px-4 py-2 text-sm text-[#f3ffd1]">
                <Sparkles size={16} className="text-primary" />
                Full-spectrum storefront remix
              </div>
              <h1 className="section-title mt-6 max-w-4xl text-5xl font-bold leading-[0.95] text-textPrimary sm:text-6xl lg:text-7xl">
                Infinity Cart brings premium motion, floating depth, and a cleaner shopping mood.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-textSecondary">
                {siteName} now feels like a more polished brand experience, with richer animation, brighter contrast, deeper 3D layering, and more intentional page rhythm.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="shimmer-line inline-flex items-center justify-center gap-2 rounded-full bg-textPrimary px-7 py-4 font-semibold text-white transition-transform duration-300 hover:-translate-y-1"
                >
                  Enter the new experience
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products?sort=trending"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17313a14] bg-white/70 px-7 py-4 font-semibold text-textPrimary transition-transform duration-300 hover:-translate-y-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  View the live drops
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="spot-grid rounded-[1.6rem] border border-[#17313a14] bg-white/80 p-5 backdrop-blur-xl">
                    <div className="font-['Sora'] text-3xl font-bold text-textPrimary">{item.value}</div>
                    <div className="mt-2 text-sm text-textSecondary">{item.label}</div>
                  </div>
                ))}
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="tilt-shell grid gap-4"
            >
              <div className="aurora-panel spot-grid rounded-[2rem] border border-[#17313a14] bg-[linear-gradient(135deg,rgba(156,198,59,0.12),rgba(255,255,255,0.95),rgba(248,244,237,0.96),rgba(239,132,85,0.1))] p-6 shadow-[0_24px_80px_rgba(86,98,105,0.12)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="eyebrow">Control center</p>
                    <h2 className="section-title mt-3 text-3xl font-bold text-textPrimary">Discovery now feels staged, layered, and alive.</h2>
                  </div>
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-slate-950">Live</div>
                </div>
                <div className="spot-grid rounded-[1.6rem] border border-[#17313a14] bg-white/80 p-5">
                  <div className="shimmer-line rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-textSecondary">
                    Search InfinityCart for mobiles, fashion, beauty, appliances, accessories, and fast-moving deals
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {['Top mobile launches', 'Trend-led fashion picks', 'Beauty and self-care', 'Appliances with offers'].map((item, index) => (
                      <div key={item} className="rounded-2xl border border-[#17313a12] bg-[#fbfaf6] px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.22em] text-[#dbffa0]">0{index + 1}</div>
                        <div className="mt-2 text-sm font-medium text-textPrimary">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="immersive-card rounded-[1.7rem] bg-white p-5">
                  <p className="eyebrow">InfinityCart promise</p>
                  <h3 className="section-title mt-3 text-2xl font-bold text-textPrimary">One destination for everyday shopping momentum.</h3>
                  <p className="mt-3 text-sm leading-7 text-textSecondary">
                    InfinityCart brings together daily essentials, standout electronics, fashion upgrades, and beauty finds in one smoother storefront.
                  </p>
                </div>
                <div className="immersive-card rounded-[1.7rem] bg-white p-5">
                  <p className="eyebrow">Shopping advantage</p>
                  <h3 className="section-title mt-3 text-2xl font-bold text-textPrimary">Faster discovery, clearer value, better flow.</h3>
                  <p className="mt-3 text-sm leading-7 text-textSecondary">
                    From trending products to deal-driven browsing, InfinityCart is shaped to help shoppers compare quickly and check out with confidence.
                  </p>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              {...revealUp}
              transition={{ duration: 0.7, delay: index * 0.06 }}
              className="immersive-card aurora-panel rounded-[1.8rem] border border-[#17313a1f] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,238,230,0.92))] p-6 shadow-[0_18px_40px_rgba(86,98,105,0.14)]"
            >
              <div className="pulse-ring mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#17313a14] bg-white text-primary shadow-[0_8px_24px_rgba(86,98,105,0.1)]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#17313a]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#4d6470]">{feature.desc}</p>
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <MotionDiv {...revealUp} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Shop by world</p>
            <h2 className="section-title mt-3 text-4xl font-bold text-textPrimary">
              Every category gets a clearer identity.
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-textPrimary md:inline-flex">
            Browse the full catalog
          </Link>
        </MotionDiv>

        <div className="grid gap-5 lg:grid-cols-5">
          {storefrontCategories.map((category, index) => (
            <MotionDiv
              key={category.name}
              {...revealUp}
              transition={{ duration: 0.7, delay: index * 0.05 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="category-panel spot-grid block overflow-hidden rounded-[1.9rem] border border-[#17313a14] bg-white p-5"
              >
                <div className="overflow-hidden rounded-[1.4rem] border border-[#17313a12] bg-[#f6f3eb] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <img src={category.image} alt={category.name} className="h-32 w-full object-cover" />
                </div>
                <div className="mt-5">
                  <h3 className="text-xl font-semibold text-textPrimary">{category.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-textSecondary">{category.blurb}</p>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionDiv {...revealUp} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Deals in motion</p>
            <h2 className="section-title mt-3 flex items-center gap-3 text-4xl font-bold text-textPrimary">
              <Zap className="h-8 w-8 text-secondary" />
              Deals of the Day
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-textPrimary md:inline-flex">
            View all deals
          </Link>
        </MotionDiv>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product, index) => (
            <MotionDiv key={product.id} {...revealUp} transition={{ duration: 0.7, delay: index * 0.05 }}>
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <MotionDiv
          {...revealUp}
          className="mb-10 rounded-[2.2rem] border border-[#17313a14] bg-[linear-gradient(135deg,#fffdfa_0%,#f7f2e8_52%,#fff8f2_100%)] p-8 shadow-[0_22px_70px_rgba(86,98,105,0.12)]"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[1.8rem] border border-[#17313a12] bg-[linear-gradient(145deg,#17313a_0%,#27444d_45%,#33555e_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="eyebrow">Why Infinity Cart stands out</p>
              <h2 className="section-title mt-3 text-4xl font-bold text-white">
                Infinity Cart brings mobiles, fashion, beauty, appliances, and daily deals into one sharper shopping destination.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#b9d0d4]">
                From high-visibility offers to cleaner product discovery, Infinity Cart is built to help shoppers move faster, compare better, and find more value across every category.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Smart category discovery', 'Fast-moving daily deals', 'Premium product presentation', 'Cleaner checkout journey'].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-[#17313a14] bg-white px-5 py-5 text-sm font-semibold text-textPrimary shadow-[0_10px_24px_rgba(86,98,105,0.08)]">
                  <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>

        <MotionDiv {...revealUp} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Popular picks</p>
            <h2 className="section-title mt-3 flex items-center gap-3 text-4xl font-bold text-textPrimary">
              <TrendingUp className="h-8 w-8 text-primary" />
              Trending Now
            </h2>
          </div>
          <Link to="/products?sort=trending" className="hidden text-sm font-medium text-textPrimary md:inline-flex">
            Explore the top movers
          </Link>
        </MotionDiv>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product, index) => (
            <MotionDiv key={product.id} {...revealUp} transition={{ duration: 0.7, delay: index * 0.05 }}>
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
