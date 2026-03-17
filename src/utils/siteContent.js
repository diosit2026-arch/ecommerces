export const siteName = 'NamshyCart';
export const siteUrl = 'https://www.namshycart.com';
export const siteDescription =
  'NamshyCart is a modern online shopping destination for electronics, fashion, beauty, home essentials, toys, and trending daily deals.';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  sameAs: [
    'https://www.facebook.com/namshycart',
    'https://www.instagram.com/namshycart',
    'https://www.youtube.com/@namshycart',
  ],
  areaServed: 'IN',
  availableLanguage: ['en', 'hi'],
};
