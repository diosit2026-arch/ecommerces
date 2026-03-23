import { useEffect } from 'react';

const setMetaByName = (name, content) => {
  let tag = document.head.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setMetaByProperty = (property, content) => {
  let tag = document.head.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setLink = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

const Seo = ({
  title,
  description,
  keywords,
  canonical = 'https://www.infinitycart.com/',
  image = 'https://www.infinitycart.com/og-image.jpg',
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    const siteTitle = title ? `${title} | Infinity Cart` : 'Infinity Cart | Mobiles, Electronics, Beauty, Appliances and Fashion';

    document.title = siteTitle;
    setMetaByName('description', description);
    setMetaByName('keywords', keywords);
    setMetaByName('robots', 'index, follow, max-image-preview:large');
    setMetaByName('author', 'Infinity Cart');
    setMetaByProperty('og:title', siteTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:type', type);
    setMetaByProperty('og:url', canonical);
    setMetaByProperty('og:image', image);
    setMetaByProperty('og:site_name', 'Infinity Cart');
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', siteTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', image);
    setLink('canonical', canonical);

    let scriptTag = document.head.querySelector('script[data-seo-jsonld="true"]');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonical, image, type, jsonLd]);

  return null;
};

export default Seo;
