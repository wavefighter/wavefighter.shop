import { LocalContentRepository } from '@/lib/content/providers/local';
import type { ContentRepository } from '@/lib/content/repository';

/**
 * The public API of the content layer.
 *
 * Pages and components import from HERE and nowhere deeper. That rule is enforced by
 * `no-restricted-imports` in eslint.config.mjs, because a boundary maintained by good
 * intentions is not a boundary.
 *
 * Migrating to a CMS is this, and only this:
 *
 *   const repository: ContentRepository =
 *     process.env.CONTENT_PROVIDER === 'sanity'
 *       ? new SanityContentRepository()
 *       : new LocalContentRepository();
 *
 * Not one page changes. Not one component changes. That is what the content layer is
 * for, and it is why every method is async today even though the data is local.
 */
const repository: ContentRepository = new LocalContentRepository();

export const getProducts = repository.getProducts.bind(repository);
export const getProductBySlug = repository.getProductBySlug.bind(repository);
export const getFeaturedProducts = repository.getFeaturedProducts.bind(repository);
export const getRelatedProducts = repository.getRelatedProducts.bind(repository);
export const getAllProductSlugs = repository.getAllProductSlugs.bind(repository);
export const getCategories = repository.getCategories.bind(repository);
export const getCategoryBySlug = repository.getCategoryBySlug.bind(repository);
export const getBrands = repository.getBrands.bind(repository);
export const getMedia = repository.getMedia.bind(repository);
export const getFacets = repository.getFacets.bind(repository);

export { isSort } from '@/lib/content/query';
export { SORT_LABELS, SORT_OPTIONS } from '@/lib/content/types';
export type {
  Attribute,
  Brand,
  Category,
  Facet,
  FacetOption,
  Image,
  MediaItem,
  Product,
  ProductDocument,
  ProductListResult,
  ProductQuery,
  Sort,
  SpecGroup,
  Video,
} from '@/lib/content/types';
