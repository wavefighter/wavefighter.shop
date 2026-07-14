import type {
  Brand,
  Category,
  Facet,
  MediaItem,
  Product,
  ProductListResult,
  ProductQuery,
} from '@/lib/content/types';

/**
 * The contract every content source must satisfy.
 *
 * Every method is `async` even though the local provider is entirely synchronous.
 *
 * This is the most load-bearing decision in the codebase. If the local provider returned
 * synchronously, every call site would be written synchronously, and the day we move to
 * Sanity we would rewrite every page that touches content. Async today costs literally
 * nothing and makes that migration a no-op.
 */
export interface ContentRepository {
  getProducts(query?: ProductQuery): Promise<ProductListResult>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  /** For generateStaticParams and the sitemap. */
  getAllProductSlugs(): Promise<string[]>;

  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;

  getBrands(): Promise<Brand[]>;

  getMedia(): Promise<MediaItem[]>;

  getFacets(query?: ProductQuery): Promise<Facet[]>;
}
