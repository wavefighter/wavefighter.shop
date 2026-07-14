import type { ProductQuery, Sort } from '@/lib/content';
import { isSort } from '@/lib/content';

/**
 * The URL is the filter state. There is no client-side store, no context, no Zustand.
 *
 * This is not minimalism for its own sake:
 *   - SEO: a server-rendered /products?category=kayaks is a real, crawlable page.
 *          A client-side filter is invisible to a search engine.
 *   - Sharing: a salesperson can paste a filtered URL into a WhatsApp message.
 *   - Back button: it works, for free, because the state IS the history entry.
 *   - Performance: we never ship the catalogue to the browser to filter it there.
 *
 * The functions below are the only place URL <-> query translation happens. Pure, so
 * they can be unit-tested without a browser.
 */

/** Next 16 hands searchParams to a page as this shape. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const toArray = (value: string | string[] | undefined): string[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

/** Parse a URL into the domain query. Anything unrecognised is ignored, not trusted. */
export const parseProductQuery = (params: RawSearchParams): ProductQuery => {
  const q = typeof params['q'] === 'string' ? params['q'].trim() : '';
  const sortParam = params['sort'];

  const query: ProductQuery = {
    categorySlugs: toArray(params['category']),
    brandSlugs: toArray(params['brand']),
  };

  if (q) query.q = q;
  if (isSort(sortParam)) query.sort = sortParam;

  return query;
};

/** Serialise a domain query back into a URLSearchParams. Empty values are omitted, so
 *  the canonical `/products` never gains a trail of `?q=&sort=featured`. */
export const buildSearchParams = (query: ProductQuery): URLSearchParams => {
  const params = new URLSearchParams();

  if (query.q) params.set('q', query.q);
  for (const slug of query.categorySlugs ?? []) params.append('category', slug);
  for (const slug of query.brandSlugs ?? []) params.append('brand', slug);
  if (query.sort && query.sort !== 'featured') params.set('sort', query.sort);

  return params;
};

const withQuery = (basePath: string, query: ProductQuery): string => {
  const params = buildSearchParams(query);
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
};

/**
 * Toggle one facet value on or off, preserving everything else.
 *
 * This is what makes the entire filter UI a set of plain links — no JavaScript, no
 * client component, works with JS disabled, and every filter combination is a real URL a
 * crawler can follow. The alternative (checkboxes + an onChange handler) ships a client
 * bundle to achieve exactly the same result, less accessibly.
 */
export const toggleFacetHref = (
  basePath: string,
  query: ProductQuery,
  key: 'category' | 'brand',
  value: string,
): string => {
  const field = key === 'category' ? 'categorySlugs' : 'brandSlugs';
  const current = query[field] ?? [];
  const next = current.includes(value)
    ? current.filter((existing) => existing !== value)
    : [...current, value];

  return withQuery(basePath, { ...query, [field]: next });
};

export const setSortHref = (basePath: string, query: ProductQuery, sort: Sort): string =>
  withQuery(basePath, { ...query, sort });

export const clearFiltersHref = (basePath: string, query: ProductQuery): string =>
  withQuery(basePath, { ...(query.sort ? { sort: query.sort } : {}) });

/** True when anything is filtering the result set — used to decide whether to show the
 *  "clear all" control and whether the page should be noindexed. */
export const hasActiveFilters = (query: ProductQuery): boolean =>
  Boolean(query.q) ||
  (query.categorySlugs?.length ?? 0) > 0 ||
  (query.brandSlugs?.length ?? 0) > 0;
