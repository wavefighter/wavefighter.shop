import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { getCategories, getProducts } from '@/lib/content';

/**
 * Generated from the repository, not maintained by hand.
 *
 * Add a product to the data file and it is in the sitemap. Nobody has to remember anything,
 * which is the only sitemap strategy that survives contact with a real team over five years.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items: products }, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = ['/', '/products', '/media', '/about', '/contact'].map(
    (path) => ({
      url: new URL(path, site.url).toString(),
      changeFrequency: 'monthly',
      priority: path === '/' ? 1 : 0.7,
    }),
  );

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: new URL(`/categories/${category.slug}`, site.url).toString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: new URL(`/products/${product.slug}`, site.url).toString(),
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
