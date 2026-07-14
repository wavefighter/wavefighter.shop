import type {
  Brand,
  Category,
  Facet,
  FacetOption,
  Product,
  ProductQuery,
  Sort,
} from '@/lib/content/types';
import { SORT_OPTIONS } from '@/lib/content/types';

/**
 * Pure, provider-agnostic filtering, searching and sorting.
 *
 * When the catalogue moves to a CMS this logic moves into GROQ (or SQL) and these
 * functions remain as the local implementation. Either way the contract — ProductQuery
 * in, Product[] out — never changes, so no page ever notices.
 */

const normalise = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const searchCorpus = (
  product: Product,
  categoryName: string | undefined,
  brandName: string | undefined,
): string =>
  normalise(
    [
      product.name,
      product.summary,
      product.sku ?? '',
      categoryName ?? '',
      brandName ?? '',
      ...product.features,
    ].join(' '),
  );

/**
 * Substring matching over every term — not fuzzy search.
 *
 * At 30–100 products this is instantaneous and, more importantly, predictable. A search
 * index (Typesense, Algolia) is the right answer at ~1,000+ products, or when typo
 * tolerance genuinely matters — at which point it slots in behind this same function.
 * Adding it today would be infrastructure in search of a problem.
 */
export const matchesSearch = (
  product: Product,
  q: string,
  categoryName: string | undefined,
  brandName: string | undefined,
): boolean => {
  const terms = normalise(q).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const corpus = searchCorpus(product, categoryName, brandName);
  return terms.every((term) => corpus.includes(term));
};

export const isSort = (value: unknown): value is Sort =>
  typeof value === 'string' && (SORT_OPTIONS as readonly string[]).includes(value);

export const sortProducts = (products: Product[], sort: Sort): Product[] => {
  const sorted = [...products];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
  }
};

export const filterProducts = (
  products: Product[],
  query: ProductQuery,
  categoriesById: Map<string, Category>,
  brandsById: Map<string, Brand>,
): Product[] => {
  const { q, categorySlugs = [], brandSlugs = [] } = query;

  return products.filter((product) => {
    if (product.status !== 'published') return false;

    const category = categoriesById.get(product.categoryId);
    const brand = product.brandId ? brandsById.get(product.brandId) : undefined;

    if (categorySlugs.length > 0 && (!category || !categorySlugs.includes(category.slug))) {
      return false;
    }
    if (brandSlugs.length > 0 && (!brand || !brandSlugs.includes(brand.slug))) {
      return false;
    }
    if (q && !matchesSearch(product, q, category?.name, brand?.name)) {
      return false;
    }
    return true;
  });
};

/**
 * Facet counts are computed against the products that survive every OTHER filter — not
 * against the current result set.
 *
 * The difference matters and is easy to get wrong. If brand counts were computed from
 * already-brand-filtered results, every unselected brand would read "0" and the customer
 * could never switch brands without clearing the filter first. That is the single most
 * common filtering bug on catalogue sites, and it is the only reason this function looks
 * more complicated than it seems it needs to be.
 */
export const buildFacets = (
  allProducts: Product[],
  query: ProductQuery,
  categories: Category[],
  brands: Brand[],
  categoriesById: Map<string, Category>,
  brandsById: Map<string, Brand>,
): Facet[] => {
  const countBy = (excluding: 'category' | 'brand'): Map<string, number> => {
    const scopedQuery: ProductQuery = {
      ...query,
      ...(excluding === 'category' ? { categorySlugs: [] } : { brandSlugs: [] }),
    };
    const scoped = filterProducts(allProducts, scopedQuery, categoriesById, brandsById);

    const counts = new Map<string, number>();
    for (const product of scoped) {
      const slug =
        excluding === 'category'
          ? categoriesById.get(product.categoryId)?.slug
          : product.brandId
            ? brandsById.get(product.brandId)?.slug
            : undefined;
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return counts;
  };

  const categoryCounts = countBy('category');
  const brandCounts = countBy('brand');

  const toOptions = (
    entries: { slug: string; name: string }[],
    counts: Map<string, number>,
  ): FacetOption[] =>
    entries
      .map(({ slug, name }) => ({ value: slug, label: name, count: counts.get(slug) ?? 0 }))
      // A facet option with zero results is a dead end. Hide it rather than offer it.
      .filter((option) => option.count > 0);

  return [
    { key: 'category', label: 'Category', options: toOptions(categories, categoryCounts) },
    { key: 'brand', label: 'Brand', options: toOptions(brands, brandCounts) },
  ];
};
