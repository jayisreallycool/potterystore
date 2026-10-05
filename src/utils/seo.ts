import { PotteryProduct } from '../types';

/**
 * Updates document meta tags dynamically for SEO as user interacts with pottery items
 */
export function updateSEOForProduct(product?: PotteryProduct | null) {
  if (!product) {
    document.title = 'KILN & CLAY — Artisanal Handcrafted Pottery Studio';
    updateMeta('description', 'Handcrafted ceramic vessels, wheel-thrown stoneware, and tactile home pottery made with natural glazes and wood-fired kiln finishes.');
    updateMeta('og:title', 'KILN & CLAY — Artisanal Pottery Studio');
    updateMeta('og:description', 'Discover wheel-thrown stoneware, reduction wood-fired vessels, and bespoke studio ceramics.');
    updateMeta('og:image', '/uploads/IMG_2640.webp');
    updateMeta('twitter:title', 'KILN & CLAY — Artisanal Pottery Studio');
    updateMeta('twitter:description', 'Discover wheel-thrown stoneware, reduction wood-fired vessels, and bespoke studio ceramics.');
    updateMeta('twitter:image', '/uploads/IMG_2640.webp');
    return;
  }

  const title = `${product.name} (${product.japaneseName}) — KILN & CLAY Studio`;
  const description = `${product.subtitle}. Thrown with ${product.clay}, fired in ${product.firing}, glazed in ${product.glaze}. $${product.price} USD.`;
  const imageUrl = product.images[0]?.webpUrl || product.images[0]?.url || '/uploads/IMG_2640.webp';

  document.title = title;
  updateMeta('description', description);
  updateMeta('og:title', title);
  updateMeta('og:description', description);
  updateMeta('og:image', imageUrl);
  updateMeta('twitter:title', title);
  updateMeta('twitter:description', description);
  updateMeta('twitter:image', imageUrl);

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
      'name': 'KILN & CLAY Atelier'
    },
    'material': product.clay,
    'category': product.category,
    'offers': {
      '@type': 'Offer',
      'url': window.location.href,
      'priceCurrency': 'USD',
      'price': product.price,
      'priceValidUntil': '2027-12-31',
      'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition',
      'seller': {
        '@type': 'Organization',
        'name': 'KILN & CLAY Pottery Studio'
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
