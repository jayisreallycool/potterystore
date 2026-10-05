import { PotteryProduct } from '../types';

/**
 * Enhanced SEO Configuration with structured data
 */

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: { '@type': string; name: string };
  manufacturer: { '@type': string; name: string };
  material?: string;
  artForm?: string;
  color?: string;
  size?: string;
  weight?: string;
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: { '@type': string; name: string };
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
  review?: Array<{
    '@type': string;
    author: { '@type': string; name: string };
    datePublished: string;
    description: string;
    reviewRating: { '@type': string; ratingValue: string };
  }>;
  craftProcess?: string;
}

/**
 * Generate comprehensive product schema for SEO and social sharing
 */
export const generateProductSchema = (product: PotteryProduct, baseUrl: string = 'https://cliffcooks.studio'): ProductSchema => {
  const productUrl = `${baseUrl}/piece/${product.id}`;
  const imageUrls = product.images.map((img) => img.url);

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrls,
    brand: {
      '@type': 'Brand',
      name: 'CliffCooks Ceramics'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'CliffCooks Ceramics'
    },
    material: product.clay,
    artForm: 'Ceramics / Pottery',
    color: product.accentColor || '#1B3B6F',
    size: product.dimensions ? `H: ${product.dimensions.heightCm}cm, W: ${product.dimensions.diameterCm}cm` : undefined,
    weight: product.dimensions?.weightGrams ? `${product.dimensions.weightGrams}g` : undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.price.toString(),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'CliffCooks'
      }
    },
    craftProcess: product.artisanNotes || product.description
  };
};

/**
 * Generate SEO metadata for product pages
 */
export const generateProductMetaTags = (product: PotteryProduct, baseUrl: string = 'https://cliffcooks.studio') => {
  const productUrl = `${baseUrl}/piece/${product.id}`;
  const ogImage = product.images[0]?.url || `${baseUrl}/og-image.png`;

  return {
    title: `${product.name} — Handmade Ceramic by Clifford`,
    description: product.subtitle,
    keywords: [
      'handmade ceramics',
      'pottery',
      product.category,
      product.clay,
      product.glaze,
      'artisan ceramics',
      'one-of-a-kind pottery'
    ].join(', '),
    canonical: productUrl,
    og: {
      title: `${product.name} — CliffCooks`,
      description: product.subtitle,
      image: ogImage,
      url: productUrl,
      type: 'product'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — CliffCooks`,
      description: product.subtitle,
      image: ogImage
    }
  };
};

/**
 * Generate organization schema for homepage
 */
export const generateOrganizationSchema = (baseUrl: string = 'https://cliffcooks.studio') => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'CliffCooks',
    legalName: 'CliffCooks Ceramics',
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    sameAs: [
      'https://instagram.com/cliffcooks',
      'https://www.instagram.com/cliffcooks'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXXXXXX',
      contactType: 'Customer Service',
      email: 'hello@cliffcooks.studio',
      availableLanguage: 'en'
    },
    description: 'Small-batch handmade ceramics by Clifford. One-of-a-kind ceramic pieces including vessels, tableware, and planters.',
    founder: {
      '@type': 'Person',
      name: 'Clifford'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    }
  };
};

/**
 * Generate breadcrumb schema for navigation
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Inject schema.org JSON-LD into document head
 */
export const injectSchema = (schema: unknown, id: string = 'schema-ld') => {
  // Remove existing script if present
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  // Create and inject new script
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Update SEO metadata dynamically
 */
export const updateSEOMetadata = (
  title: string,
  description: string,
  ogImage?: string,
  canonical?: string
) => {
  // Title
  document.title = title;
  updateOrCreateMetaTag('og:title', title);
  updateOrCreateMetaTag('twitter:title', title);

  // Description
  updateOrCreateMetaTag('description', description);
  updateOrCreateMetaTag('og:description', description);
  updateOrCreateMetaTag('twitter:description', description);

  // Image
  if (ogImage) {
    updateOrCreateMetaTag('og:image', ogImage);
    updateOrCreateMetaTag('twitter:image', ogImage);
  }

  // Canonical
  if (canonical) {
    updateOrCreateLink('canonical', canonical);
    updateOrCreateMetaTag('og:url', canonical);
  }
};

/**
 * Helper: Update or create meta tag
 */
const updateOrCreateMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/**
 * Helper: Update or create link tag
 */
const updateOrCreateLink = (rel: string, href: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

/**
 * SEO checklist recommendations
 */
export const getSEOChecklist = () => {
  return [
    '✓ Add individual product pages with SEO URLs (/piece/product-id)',
    '✓ Implement product filtering with working filter states in URL',
    '✓ Add detailed product descriptions (150+ words)',
    '✓ Create category pages with unique content',
    '✓ Build customer reviews/testimonials section',
    '✓ Add artist biography and process page',
    '✓ Set up blog with ceramic care guides',
    '✓ Create FAQ section for common questions',
    '✓ Add structured data (schema.org markup)',
    '✓ Optimize images with alt text and WebP format',
    '✓ Ensure mobile-responsive design',
    '✓ Set up Google Search Console',
    '✓ Implement internal linking strategy',
    '✓ Create XML sitemap',
    '✓ Set up robots.txt for crawlers'
  ];
};
