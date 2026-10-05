import { PotteryProduct } from '../types';

/**
 * Updates document meta tags dynamically for SEO as user interacts with pottery items
 */
const SITE_NAME = 'Cliff Cooks';
const DEFAULT_TITLE = 'Cliff Cooks: Pottery in the Kiln — Handmade Ceramics';
const DEFAULT_DESCRIPTION = 'Cliff Cooks is small-batch handmade pottery by Clifford: bowls, plates, vases and mugs, wheel-thrown and kiln-fired.';
const DEFAULT_IMAGE = '/uploads/IMG_2640.webp';

function applyMeta(title: string, description: string, image: string) {
  document.title = title;
  updateMeta('description', description);
  updateMeta('og:title', title);
  updateMeta('og:description', description);
  updateMeta('og:image', image);
  updateMeta('og:url', window.location.href);
  updateMeta('twitter:title', title);
  updateMeta('twitter:description', description);
  updateMeta('twitter:image', image);
  updateCanonical();
}

function updateCanonical() {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = window.location.origin + window.location.pathname;
}

/** Title and description for a non-product page such as About or Custom orders */
export function updateSEOForPage(pageTitle: string, description: string) {
  applyMeta(`${pageTitle} — ${SITE_NAME}`, description, DEFAULT_IMAGE);
  document.getElementById('product-jsonld')?.remove();
}

/**
 * Updates document meta tags for the piece being viewed (or the home page when there is none)
 */
export function updateSEOForProduct(product?: PotteryProduct | null) {
  if (!product) {
    applyMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE);
    document.getElementById('product-jsonld')?.remove();
    return;
  }

  const title = `${product.name} — ${SITE_NAME}`;
  const description = `${product.subtitle}. ${product.clay}, ${product.glaze}. $${product.price} USD.`;
  const imageUrl = product.images[0]?.webpUrl || product.images[0]?.url || DEFAULT_IMAGE;

  applyMeta(title, description, imageUrl);

  // Inject or update Schema.org Product Structured Data
  updateProductStructuredData(product);
}

function updateMeta(nameOrProperty: string, content: string) {
  let element = document.querySelector(`meta[name="${nameOrProperty}"]`) || 
                document.querySelector(`meta[property="${nameOrProperty}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    if (nameOrProperty.startsWith('og:')) {
      element.setAttribute('property', nameOrProperty);
    } else {
      element.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateProductStructuredData(product: PotteryProduct) {
  const scriptId = 'product-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'alternateName': product.japaneseName,
    'description': product.description,
    'image': product.images.map(img => img.url),
    'sku': product.id,
    'mpn': product.edition.batchCode,
    'brand': {
      '@type': 'Brand',
      'name': 'Cliff Cooks'
    },
    'material': product.clay,
    'category': product.category,
    'offers': {
      '@type': 'Offer',
      'url': window.location.href,
      'priceCurrency': 'USD',
      'price': product.price,
      'priceValidUntil': '2027-12-31',
      'availability': product.inStock && product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      'itemCondition': 'https://schema.org/NewCondition',
      'seller': {
        '@type': 'Organization',
        'name': 'Cliff Cooks'
      }
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Firing Technique',
        'value': product.firing
      },
      {
        '@type': 'PropertyValue',
        'name': 'Glaze Formulation',
        'value': product.glaze
      },
      {
        '@type': 'PropertyValue',
        'name': 'Height',
        'value': `${product.dimensions.heightCm} cm`
      },
      {
        '@type': 'PropertyValue',
        'name': 'Diameter',
        'value': `${product.dimensions.diameterCm} cm`
      },
      {
        '@type': 'PropertyValue',
        'name': 'Weight',
        'value': `${product.dimensions.weightGrams} g`
      }
    ]
  };

  script.textContent = JSON.stringify(structuredData, null, 2);
}
