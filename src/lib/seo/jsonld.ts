import { contact, hasAddress, hasEmail, hasPhone, site } from '@/config/site';
import type { Attribute, Brand, Category, Product } from '@/lib/content';

/**
 * Structured data builders.
 *
 * Pages compose these; they never write raw JSON-LD. Schema.org changes, Google's
 * requirements change, and when they do we want exactly one place to change — not a
 * <script> tag copy-pasted into six templates.
 *
 * A deliberate omission: Product carries NO `offers`. We do not publish prices or
 * availability, and inventing them to win a rich-result badge would mean marking up
 * something untrue. Google may show a plainer result. For a business whose entire
 * proposition is straight answers, that is the correct trade.
 */
type JsonLd = Record<string, unknown>;

const url = (path = '/'): string => new URL(path, site.url).toString();

/**
 * Attribute values are string | number | boolean, and a raw boolean serialises to the
 * string "true" — which is then what a search engine would show a customer:
 * "Fuel injection: true". Found by a smoke test, not by looking at the page.
 */
const formatAttributeValue = (value: Attribute['value'], unit?: string): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return unit ? `${value} ${unit}` : String(value);
};

/**
 * Every field below is conditional. Emitting `"telephone": ""` is not a harmless empty string — it
 * is a structured assertion to a search engine that this business has a phone number which is the
 * empty string, and Google will happily surface the nonsense that results.
 */
export const organizationJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': url('/#organization'),
  name: site.name,
  url: url('/'),
  description: site.description,
  ...(hasPhone ? { telephone: contact.phone } : {}),
  ...(hasEmail ? { email: contact.email } : {}),
  ...(hasAddress
    ? {
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressCountry: contact.address.country,
        },
      }
    : {}),
});

/**
 * Store (a LocalBusiness subtype) as well as Organization, because a UAE customer
 * searching "outboard motor Dubai" is performing a local-intent search — and local
 * intent is where this business actually competes.
 */
/**
 * Returns null until there is a real address.
 *
 * A `Store` (LocalBusiness) without an address is not merely incomplete — it is the one schema type
 * whose entire purpose is telling Google WHERE you are. Emitting it empty invites a Google Business
 * Profile mismatch, which is a genuinely expensive problem to unpick later.
 *
 * The moment a real address is configured, this appears automatically and the site becomes eligible
 * for local results. That is the single highest-value item on the launch checklist.
 */
export const localBusinessJsonLd = (): JsonLd | null => {
  if (!hasAddress) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': url('/#localbusiness'),
    name: site.name,
    url: url('/'),
    ...(hasPhone ? { telephone: contact.phone } : {}),
    ...(hasEmail ? { email: contact.email } : {}),
    ...(contact.hours ? { openingHours: contact.hours } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressCountry: contact.address.country,
    },
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
  };
};

export const websiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': url('/#website'),
  name: site.name,
  url: url('/'),
  publisher: { '@id': url('/#organization') },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: url('/products?q={search_term_string}') },
    'query-input': 'required name=search_term_string',
  },
});

/**
 * The visual breadcrumbs and this are built from the same array, so what the customer
 * sees and what Google reads cannot drift apart. This is also what carries the category
 * hierarchy that our deliberately flat product URLs do not encode.
 */
export const breadcrumbJsonLd = (items: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: url(item.path),
  })),
});

export const productJsonLd = (
  product: Product,
  category: Category,
  brand: Brand | null,
): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': url(`/products/${product.slug}#product`),
  name: product.name,
  description: product.summary,
  image: product.images.map((image) => url(image.src)),
  category: category.name,
  ...(brand ? { brand: { '@type': 'Brand', name: brand.name } } : {}),
  ...(product.sku ? { sku: product.sku } : {}),
  additionalProperty: product.attributes.map((attribute) => ({
    '@type': 'PropertyValue',
    name: attribute.label,
    value: formatAttributeValue(attribute.value, attribute.unit),
  })),
  seller: { '@id': url('/#organization') },
});

export const itemListJsonLd = (products: Product[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: url(`/products/${product.slug}`),
    name: product.name,
  })),
});
