import type { Metadata } from 'next';
import { site } from '@/config/site';
import type { Image } from '@/lib/content';

/**
 * The single metadata builder. Every page calls this; no page hand-rolls an Open Graph
 * tag.
 *
 * This exists so that the day we add a Twitter property, a new OG field, or a robots
 * directive, we add it HERE — and every page in the site, including the forty product
 * pages that do not exist yet, inherits it. Metadata written page-by-page drifts within
 * a quarter. Metadata built from one function cannot.
 */
type BuildMetadataInput = {
  title: string;
  /** <= 160 characters. This is what a customer reads in the search result and decides
   *  whether to click. It is sales copy, not a summary. */
  description: string;
  /** Root-relative, e.g. '/products/example-product'. Drives the canonical URL. */
  path: string;
  /** Defaults to the site image. For a product this is its hero photograph — a real
   *  photo of the product outperforms any generated branded card in a WhatsApp preview,
   *  and costs no code. */
  image?: Image;
  /** Filtered and searched listing URLs. Keeps facet permutations out of the index
   *  without spending crawl budget discovering they are duplicates. */
  noindex?: boolean;
};

/**
 * There is no default Open Graph image, because there is no real one yet — and a generated
 * placeholder card shared into a WhatsApp thread looks worse than no card at all.
 *
 * When the logo and brand imagery arrive, drop a 1200x630 file at /public/images/og-default.jpg
 * and set DEFAULT_OG_IMAGE below. Every page inherits it immediately.
 */
const DEFAULT_OG_IMAGE: Image | null = null;

const absolute = (path: string): string => new URL(path, site.url).toString();

export const buildMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE ?? undefined,
  noindex = false,
}: BuildMetadataInput): Metadata => {
  const url = absolute(path);
  const images = image
    ? [{ url: absolute(image.src), width: image.width, height: image.height, alt: image.alt }]
    : [];

  return {
    title,
    description,
    alternates: { canonical: url },

    /* `noindex, follow` — never `nofollow`. We do not want the filtered URL in the
       index, but we very much want the crawler to follow the product links on it. */
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },

    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      url,
      ...(images.length > 0 ? { images } : {}),
    },

    twitter: {
      /* Without an image, `summary_large_image` renders an empty banner. `summary` is the correct
         card for a text-only share, and it upgrades itself the moment a real image exists. */
      card: images.length > 0 ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(images.length > 0 ? { images } : {}),
    },
  };
};
