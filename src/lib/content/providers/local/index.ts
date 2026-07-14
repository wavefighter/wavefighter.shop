import { brands } from '@/lib/content/providers/local/data/brands';
import { categories } from '@/lib/content/providers/local/data/categories';
import { media } from '@/lib/content/providers/local/data/media';
import { products } from '@/lib/content/providers/local/data/products';
import { buildFacets, filterProducts, sortProducts } from '@/lib/content/query';
import type { ContentRepository } from '@/lib/content/repository';
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
 * Local provider — the launch implementation.
 *
 * Everything below the ContentRepository interface is disposable. Deleting this folder
 * and dropping in `providers/sanity` must be the entire migration. If it ever is not,
 * something has leaked, and we fix the leak rather than the page.
 */
export class LocalContentRepository implements ContentRepository {
  private readonly categoriesById = new Map(categories.map((category) => [category.id, category]));
  private readonly brandsById = new Map(brands.map((brand) => [brand.id, brand]));

  private get published(): Product[] {
    return products.filter((product) => product.status === 'published');
  }

  async getProducts(query: ProductQuery = {}): Promise<ProductListResult> {
    const filtered = filterProducts(products, query, this.categoriesById, this.brandsById);
    const sorted = sortProducts(filtered, query.sort ?? 'featured');

    return {
      items: sorted,
      total: sorted.length,
      facets: buildFacets(products, query, categories, brands, this.categoriesById, this.brandsById),
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.published.find((product) => product.slug === slug) ?? null;
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return sortProducts(
      this.published.filter((product) => product.featured),
      'featured',
    ).slice(0, limit);
  }

  /**
   * Curated relations first, then a same-category fallback.
   *
   * The fallback matters: an editor who forgets to fill in `relatedProductIds` should
   * produce a slightly less relevant module, not an empty one. Empty modules are how
   * catalogue pages turn into dead ends.
   */
  async getRelatedProducts(productId: string, limit = 3): Promise<Product[]> {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) return [];

    const curated = product.relatedProductIds
      .map((id) => this.published.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is Product => Boolean(candidate));

    if (curated.length >= limit) return curated.slice(0, limit);

    const sameCategory = this.published.filter(
      (candidate) =>
        candidate.categoryId === product.categoryId &&
        candidate.id !== product.id &&
        !curated.some((existing) => existing.id === candidate.id),
    );

    return [...curated, ...sortProducts(sameCategory, 'featured')].slice(0, limit);
  }

  async getAllProductSlugs(): Promise<string[]> {
    return this.published.map((product) => product.slug);
  }

  async getCategories(): Promise<Category[]> {
    return [...categories].sort((a, b) => a.order - b.order);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categories.find((category) => category.slug === slug) ?? null;
  }

  async getBrands(): Promise<Brand[]> {
    return [...brands].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMedia(): Promise<MediaItem[]> {
    return [...media].sort((a, b) => a.order - b.order);
  }

  async getFacets(query: ProductQuery = {}): Promise<Facet[]> {
    return buildFacets(products, query, categories, brands, this.categoriesById, this.brandsById);
  }
}
