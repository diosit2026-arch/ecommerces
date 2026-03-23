const createCategoryArt = (palette, iconMarkup) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
      <defs>
        <linearGradient id="bg" x1="20" y1="20" x2="300" y2="220" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette[0]}"/>
          <stop offset="0.55" stop-color="${palette[1]}"/>
          <stop offset="1" stop-color="${palette[2]}"/>
        </linearGradient>
      </defs>
      <rect width="320" height="240" rx="36" fill="url(#bg)"/>
      <circle cx="262" cy="54" r="44" fill="white" fill-opacity="0.18"/>
      <circle cx="70" cy="185" r="56" fill="white" fill-opacity="0.16"/>
      <rect x="42" y="34" width="236" height="172" rx="28" fill="white" fill-opacity="0.16"/>
      ${iconMarkup}
    </svg>
  `)}`;

export const siteName = 'Infinity Cart';
export const siteUrl = 'https://www.infinitycart.com';
export const siteDescription =
  'Infinity Cart is a modern shopping destination for mobiles, electronics, beauty, appliances, fashion, and everyday tech deals.';

export const storefrontCategories = [
  {
    name: 'Mobiles',
    slug: 'mobiles',
    blurb: 'Smartphones, accessories, and mobile-first upgrades.',
    accent: 'from-[#ff7a51] via-[#ff9c66] to-[#ffd166]',
    image: createCategoryArt(
      ['#ff7a51', '#ffb067', '#ffe089'],
      `
        <rect x="112" y="44" width="96" height="156" rx="22" fill="#14303A"/>
        <rect x="120" y="56" width="80" height="128" rx="16" fill="#F7FAFC"/>
        <circle cx="160" cy="172" r="7" fill="#86A6B3"/>
        <rect x="145" y="48" width="30" height="5" rx="2.5" fill="#86A6B3"/>
      `
    ),
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    blurb: 'Laptops, audio, cameras, and performance gear.',
    accent: 'from-[#63f5d2] via-[#3cc9ff] to-[#4f7cff]',
    image: createCategoryArt(
      ['#63f5d2', '#3cc9ff', '#4f7cff'],
      `
        <rect x="76" y="62" width="168" height="96" rx="16" fill="#0F2430"/>
        <rect x="88" y="74" width="144" height="72" rx="10" fill="#E9F7FF"/>
        <rect x="132" y="165" width="56" height="10" rx="5" fill="#0F2430"/>
        <rect x="114" y="176" width="92" height="12" rx="6" fill="#0F2430" fill-opacity="0.72"/>
      `
    ),
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    blurb: 'Wellness, grooming, and self-care bestsellers.',
    accent: 'from-[#f86ca7] via-[#ff8a72] to-[#ffd166]',
    image: createCategoryArt(
      ['#f86ca7', '#ff8a72', '#ffd166'],
      `
        <rect x="110" y="64" width="40" height="98" rx="10" fill="#FFF7FB"/>
        <rect x="118" y="44" width="24" height="26" rx="8" fill="#14303A"/>
        <rect x="162" y="88" width="50" height="74" rx="18" fill="#FFF7FB"/>
        <path d="M187 56 C198 72 206 82 206 96 C206 110 198 120 187 120 C176 120 168 110 168 96 C168 82 176 72 187 56Z" fill="#14303A"/>
      `
    ),
  },
  {
    name: 'Appliances',
    slug: 'appliances',
    blurb: 'Home helpers built for faster daily routines.',
    accent: 'from-[#9ef01a] via-[#c7ff6b] to-[#63f5d2]',
    image: createCategoryArt(
      ['#9ef01a', '#c7ff6b', '#63f5d2'],
      `
        <rect x="106" y="42" width="108" height="156" rx="18" fill="#F4FFF1"/>
        <circle cx="160" cy="104" r="30" fill="#14303A" fill-opacity="0.12"/>
        <circle cx="160" cy="104" r="20" stroke="#14303A" stroke-width="10"/>
        <rect x="132" y="164" width="56" height="10" rx="5" fill="#14303A" fill-opacity="0.48"/>
      `
    ),
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    blurb: 'Style-led picks, wardrobe refreshes, and standout daily wear.',
    accent: 'from-[#f86ca7] via-[#ff8a72] to-[#ffd166]',
    image: createCategoryArt(
      ['#7c72ff', '#5a8dff', '#58d4ff'],
      `
        <path d="M117 64 L139 44 H181 L203 64 L225 92 L204 110 L186 92 V198 H134 V92 L116 110 L95 92 Z" fill="#F8FBFF"/>
        <path d="M143 44 H177 L170 64 H150 Z" fill="#14303A" fill-opacity="0.14"/>
      `
    ),
  },
];

export const storefrontCategoryNames = storefrontCategories.map((category) => category.name);

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  sameAs: [
    'https://www.facebook.com/infinitycart',
    'https://www.instagram.com/infinitycart',
    'https://www.youtube.com/@infinitycart',
  ],
  areaServed: 'IN',
  availableLanguage: ['en', 'hi'],
};
