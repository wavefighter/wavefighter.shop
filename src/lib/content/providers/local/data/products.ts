import type { Product } from '@/lib/content/types';

/**
 * EMPTY. Every product previously in this file was invented — the specifications, the model
 * numbers, the prose. Plausible-looking specifications are the most dangerous kind of fake
 * content on a site like this: a customer makes a purchasing decision on a horsepower figure
 * nobody checked.
 *
 * The catalogue, the home page and the media page all render correctly with zero products —
 * they show an honest "catalogue coming soon" state rather than an error.
 *
 * ADDING A PRODUCT: append an object here. Nothing else needs to change — the catalogue,
 * category pages, related products, sitemap and static routes all derive from this array.
 * `npm run validate:content` will refuse the build if a category or brand ID does not resolve,
 * a slug is duplicated, or an image is referenced but not present in /public.
 *
 * Minimum viable product entry (everything else is optional):
 *
 *   {
 *     id: 'prod-example',
 *     slug: 'example-product',
 *     name: 'Example Product',
 *     summary: 'One line, under 160 characters. Used on the card and as the meta description.',
 *     description: 'Paragraphs. Separate them with a blank line.',
 *     categoryId: 'cat-outboard-motors',   // must match a category in categories.ts
 *     brandId: null,                        // or a brand id from brands.ts
 *     sku: null,
 *     specifications: [],
 *     attributes: [],
 *     features: [],
 *     images: [],                           // add real photos here
 *     video: null,
 *     documents: [],
 *     relatedProductIds: [],
 *     featured: false,
 *     status: 'published',                  // 'draft' hides it everywhere
 *     order: 1,
 *     createdAt: '2026-07-13T00:00:00.000Z',
 *     updatedAt: '2026-07-13T00:00:00.000Z',
 *   }
 */
export const products: Product[] = [];
