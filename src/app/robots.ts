import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

/**
 * Note what is NOT here: a `Disallow: /*?*` rule for filtered URLs.
 *
 * Disallowing them would stop the crawler READING those pages — including the product links
 * on them. We want the opposite: crawl the filtered page, follow every link, index none of the
 * permutations. That is a `noindex, follow` job, and it is handled in the page's metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', site.url).toString(),
    host: site.url,
  };
}
