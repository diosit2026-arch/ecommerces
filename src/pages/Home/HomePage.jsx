import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
  Boxes,
  Play,
  Star,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  BarChart3,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ui/ProductCard';
import Seo from '../../components/seo/Seo';
import { organizationJsonLd, siteName, siteUrl } from '../../utils/siteContent';

const MotionDiv = motion.div;

const heroSlides = [
  {
    id: 1,
    eyebrow: 'Future-ready marketplace',
    title: 'A storefront with motion, depth, and premium energy.',
    subtitle:
      'Shop trending tech, fresh fashion, and statement pieces in a home screen built to feel cinematic from the first scroll.',
    accent: 'from-cyan-400 via-sky-500 to-blue-600',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    eyebrow: 'Scroll into discovery',
    title: 'Editorial product moments with immersive 3D styling.',
    subtitle:
      'Layered glass cards, floating highlights, and animated sections create a richer shopping experience on every device.',
    accent: 'from-fuchsia-500 via-pink-500 to-orange-400',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    eyebrow: 'Built for conversion',
    title: 'Deals, categories, and trends presented like a launch event.',
    subtitle:
      'Fast loading sections, bold storytelling, and motion-led product discovery help the homepage feel alive without losing usability.',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Protected Checkout',
    desc: 'Trusted payments with smooth purchase flow.',
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    desc: 'Fast dispatch for your most wanted items.',
  },
  {
    icon: Sparkles,
    title: 'Curated Selection',
    desc: 'Premium picks across style and electronics.',
  },
  {
    icon: Zap,
    title: 'Daily Drops',
    desc: 'Limited deals that keep the homepage fresh.',
  },
];

const categories = [
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80',
    blurb: 'Cameras, laptops, audio, and devices with a sleek presentation.',
  },
  {
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80',
    blurb: 'Seasonal statements, clean silhouettes, and standout looks.',
  },
  {
    name: 'Home',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80',
    blurb: 'Modern pieces that make rooms feel intentional and elevated.',
  },
  {
    name: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80',
    blurb: 'Glow-focused essentials and premium self-care favorites.',
  },
];

const stats = [
  { value: '25K+', label: 'Products styled for discovery' },
  { value: '4.9/5', label: 'Average shopper delight score' },
  { value: '24h', label: 'Fast delivery promise in top cities' },
];

const floatingCards = [
  {
    title: 'Motion-led hero',
    detail: 'Layered gradients + hover depth',
    position: 'top-8 right-2 sm:right-6',
  },
  {
    title: 'Scroll reveal',
    detail: 'Every section enters with presence',
    position: 'bottom-16 left-0 sm:left-4',
  },
  {
    title: 'Glass surfaces',
    detail: 'Premium UI with soft reflections',
    position: 'bottom-3 right-10 sm:right-20',
  },
];

const revealUp = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const { fetchProducts, getTrendingProducts, getDealsOfDay } = useProductStore();
  const trending = getTrendingProducts().slice(0, 4);
  const deals = getDealsOfDay().slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const heroGlowScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <Seo
        title="Online Shopping for Electronics, Fashion, Beauty, Home and More"
        description="Explore NamshyCart for electronics, fashion, beauty products, home essentials, toys, furniture, and daily deals with secure checkout and a premium shopping experience."
        keywords="NamshyCart home, online shopping India, electronics deals, fashion store, beauty products, home essentials, furniture shopping"
        canonical={siteUrl}
        jsonLd={organizationJsonLd}
      />
      <section
        ref={heroRef}
        className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(217,70,239,0.18),_transparent_20%),linear-gradient(180deg,_#07111f_0%,_#050816_50%,_#071422_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

        <MotionDiv
          style={{ scale: heroGlowScale }}
          className={`absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-r ${currentHero.accent} opacity-20 blur-[120px] transition-all duration-700`}
        />

        <MotionDiv
          key={currentHero.id}
          style={{ y: heroY }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${currentHero.accent} opacity-20`} />
          <img
            src={currentHero.image}
            alt={currentHero.title}
            className="absolute right-[-10%] top-[12%] hidden h-[68%] w-[46%] rounded-[2.5rem] object-cover object-center shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/15 lg:block"
          />
        </MotionDiv>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <MotionDiv
              key={`${currentHero.id}-content`}
              style={{ y: heroContentY }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <span>{currentHero.eyebrow}</span>
              </div>

              <h1 className="max-w-4xl font-['Space_Grotesk'] text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
                {currentHero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
                {currentHero.subtitle}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                {siteName} helps shoppers discover trending electronics, fashion, beauty, home essentials, and curated daily deals in one polished online store.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-1"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products?sort=trending"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/6 px-7 py-4 font-semibold text-white backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <Play className="h-4 w-4" />
                  View Trending
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                  >
                    <div className="font-['Space_Grotesk'] text-3xl font-bold text-white">
                      {item.value}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden h-[38rem] lg:block"
            >
              <div className="immersive-card absolute left-10 top-14 w-[18rem] rotate-[-9deg] p-4">
                <div className="relative h-60 w-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.88),_rgba(2,6,23,0.98))] p-4">
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Bestseller
                  </div>
                  <div className="mt-2 flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Storefront</p>
                      <h4 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-white">
                        Premium Drop
                      </h4>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      'https://rukmini1.flixcart.com/image/312/312/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=70',
                      'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/n/v/e/-original-imahf4j8svz6xg2n.jpeg?q=70',
                      'https://rukminim2.flixcart.com/image/312/312/xif0q/shoe/q/k/y/8-rpd206-red-tape-white-navy-original-imah4yhkg2gzzhvm.jpeg?q=70',
                    ].map((image) => (
                      <div key={image} className="rounded-[1rem] border border-white/10 bg-white/5 p-2">
                        <img src={image} alt="Featured product" className="h-20 w-full rounded-[0.8rem] object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                    240+ products trending today
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Featured drop</p>
                    <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                      Premium Edit
                    </h3>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">
                    Live
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-8 h-[28rem] w-[22rem] rounded-[2rem] border border-white/12 bg-slate-950/80 p-5 shadow-[0_32px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Scene</p>
                    <h3 className="font-['Space_Grotesk'] text-2xl font-semibold text-white">
                      Shopping Interface
                    </h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    3D mode
                  </div>
                </div>

                <div className="relative h-[16rem] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_40%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.98))] p-4">
                  <div className="absolute inset-x-5 top-5 flex h-16 items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/8 px-4 backdrop-blur-lg">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Dashboard</p>
                      <p className="mt-1 text-sm font-medium text-white">Orders and conversions</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="absolute left-6 top-24 w-[8.5rem] rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-cyan-300/30 to-blue-500/15 p-4 shadow-[0_20px_45px_rgba(56,189,248,0.18)]">
                    <div className="flex items-center justify-between">
                      <ShoppingBag className="h-5 w-5 text-white" />
                      <span className="text-xs text-cyan-100">+18%</span>
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.22em] text-slate-200">Today sales</p>
                    <p className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-white">Rs 2.4L</p>
                  </div>
                  <div className="absolute right-6 top-24 w-[8.5rem] rounded-[1.6rem] border border-white/10 bg-white/6 p-4 backdrop-blur-lg">
                    <img
                      src="https://rukmini1.flixcart.com/image/312/312/xif0q/mobile/r/8/8/-original-imahggevcrkzezzv.jpeg?q=70"
                      alt="Top-selling product"
                      className="h-24 w-full rounded-[1rem] object-cover"
                    />
                    <p className="mt-3 text-sm font-medium text-white">Top selling</p>
                    <p className="text-xs text-slate-400">iPhone collection</p>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-[1.2rem] border border-white/10 bg-white/8 p-4 backdrop-blur-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
                          <PackageCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Orders packed</p>
                          <p className="text-xs text-slate-400">128 shipments ready to dispatch</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/6 p-2 text-cyan-300">
                        <CreditCard className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {['Depth', 'Motion', 'Glow'].map((label, index) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/6 p-3 text-center"
                    >
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        0{index + 1}
                      </div>
                      <div className="mt-2 font-medium text-white">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {floatingCards.map((card, index) => (
                <MotionDiv
                  key={card.title}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute ${card.position} rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl`}
                >
                  <div className="text-sm font-semibold text-white">{card.title}</div>
                  <div className="mt-1 text-xs text-slate-300">{card.detail}</div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>

          <div className="mt-12 flex items-center gap-3 self-start rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
            Scroll to explore the new visual storytelling
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              {...revealUp}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="immersive-card flex items-start gap-4 p-5"
            >
              <div className="rounded-2xl bg-white/10 p-3 text-cyan-300 shadow-[0_12px_30px_rgba(34,211,238,0.18)]">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{feature.desc}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionDiv {...revealUp} className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Category worlds</p>
            <h2 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
              Designed like immersive panels, not basic tiles.
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 font-medium text-white backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 md:inline-flex"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionDiv>

        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((category, index) => (
            <MotionDiv
              key={category.name}
              {...revealUp}
              transition={{ duration: 0.8, delay: index * 0.08 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="category-panel group block overflow-hidden rounded-[2rem] border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <div className="max-w-md rounded-[1.7rem] border border-white/12 bg-slate-950/45 p-5 shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-200">
                      <Boxes className="h-3.5 w-3.5" />
                      Signature collection
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300">{category.blurb}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
                      Enter collection
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <MotionDiv
          {...revealUp}
          className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,29,0.92),rgba(18,42,66,0.85),rgba(9,15,32,0.96))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Immersive strip</p>
              <h2 className="mt-3 max-w-2xl font-['Space_Grotesk'] text-4xl font-bold text-white">
                This homepage now feels closer to a product launch microsite.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Stronger visual hierarchy, glassmorphism, floating depth, and scroll reveals help key sections feel premium while keeping navigation obvious.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['3D depth', 'Scroll animation', 'Premium gradients', 'Responsive layout'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Interactive focus', value: '92%', note: 'Higher visual emphasis on hero CTAs' },
                { title: 'Motion timing', value: '0.8s', note: 'Smooth reveal pacing for sections' },
                { title: 'UI depth', value: '12 layers', note: 'Glows, cards, image stacks, and overlays' },
                { title: 'Shop feel', value: 'Studio', note: 'Designed to feel curated and premium' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="immersive-card rounded-[1.7rem] p-5"
                >
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <div className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
                    {item.value}
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <MotionDiv
          {...revealUp}
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Why {siteName}</p>
          <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white">
            SEO-rich brand content that still feels useful for real shoppers.
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <p className="text-sm leading-7 text-slate-300">
              {siteName} is built for customers searching for online shopping in India across electronics, fashion, beauty, home decor, toys, and appliances, with clear product discovery and clean navigation.
            </p>
            <p className="text-sm leading-7 text-slate-300">
              The home page highlights trending products, curated collections, secure checkout messaging, and daily deals so visitors and search engines both understand the value of the store.
            </p>
            <p className="text-sm leading-7 text-slate-300">
              Better typography, stronger section hierarchy, and more polished interface details make the website feel premium while supporting longer, keyword-relevant brand storytelling.
            </p>
          </div>
        </MotionDiv>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionDiv {...revealUp} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-orange-300">Today only</p>
            <h2 className="mt-3 flex items-center gap-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
              <Zap className="h-8 w-8 text-orange-400" />
              Deals of the Day
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-medium text-slate-200 transition-colors hover:text-white md:inline-flex"
          >
            View all deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionDiv>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product, index) => (
            <MotionDiv
              key={product.id}
              {...revealUp}
              transition={{ duration: 0.7, delay: index * 0.06 }}
            >
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <MotionDiv
          {...revealUp}
          className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,19,38,0.96),rgba(18,24,52,0.88),rgba(6,13,28,0.96))] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.45)] lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.14),transparent_22%),radial-gradient(circle_at_80%_25%,rgba(244,114,182,0.14),transparent_20%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-fuchsia-300">Momentum</p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
                Trending products continue the premium visual rhythm.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                The last section keeps the page alive with product motion, contrast, and a clear path into the catalog.
              </p>
              <div className="mt-8 flex items-center gap-4 text-slate-300">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white"
                    >
                      <Star className="h-4 w-4 text-yellow-300" />
                    </div>
                  ))}
                </div>
                <span>Popular right now across electronics and fashion.</span>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-medium text-white">Trending pulse</div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
                  Updated live
                </div>
              </div>
              <div className="space-y-3">
                {['Gaming-ready laptops', 'Statement watches', 'Creator cameras', 'Smart audio accessories'].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3"
                  >
                    <span className="text-slate-200">{item}</span>
                    <span className="text-sm text-cyan-300">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionDiv>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <MotionDiv {...revealUp} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Hot picks</p>
            <h2 className="mt-3 flex items-center gap-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
              <TrendingUp className="h-8 w-8 text-emerald-300" />
              Trending Now
            </h2>
          </div>
          <Link
            to="/products?sort=trending"
            className="hidden items-center gap-2 text-sm font-medium text-slate-200 transition-colors hover:text-white md:inline-flex"
          >
            See what is rising
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionDiv>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product, index) => (
            <MotionDiv
              key={product.id}
              {...revealUp}
              transition={{ duration: 0.7, delay: index * 0.06 }}
            >
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
