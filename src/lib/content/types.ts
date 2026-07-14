/**
 * Domain types.
 *
 * These belong to WaveFighter — not to Sanity, not to Payload, not to the local files
 * that happen to hold the data today. A CMS's shape gets mapped INTO these types at the
 * provider boundary and never leaks through it. That inversion is what makes the
 * storage layer replaceable.
 */

export type Image = {
  src: string;
  /** Required, not optional-with-a-fallback. Accessibility you are allowed to skip is
   *  accessibility you will skip. The content validator fails the build without it. */
  alt: string;
  width: number;
  height: number;
};

export type Video = {
  provider: 'youtube';
  /** Video ID only, never a full URL — we control what gets linked and framed. */
  id: string;
  title: string;
};

export type ProductDocument = {
  label: string;
  /** Path under /public, e.g. /documents/product-specification.pdf */
  file: string;
  type: 'pdf' | 'doc';
  sizeBytes: number;
};

/** Human-readable. Rendered as a table. Never filtered on. */
export type SpecGroup = {
  title: string;
  rows: { label: string; value: string }[];
};

/**
 * Machine-readable. Normalised, filterable, comparable.
 *
 * Kept separate from SpecGroup on purpose: outboard motors have horsepower, kayaks have
 * seat count, lifejackets have buoyancy ratings. One flat spec schema cannot filter
 * across those, and a hardcoded per-category filter UI is exactly what stops you adding
 * a category later without a refactor.
 *
 * Unused by the launch filters (search + category + brand). The shape exists so that
 * adding "horsepower" is a data change, not an architecture change.
 */
export type Attribute = {
  key: string;
  label: string;
  value: string | number | boolean;
  unit?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  /** Category pages carry catalogue search traffic, so this copy is worth writing properly —
   *  but it may be empty, and the page renders correctly without it. We do not invent it. */
  description: string;
  /** Nullable. Until a real photograph exists, the card renders a neutral tile rather than a
   *  stock image. Placeholder imagery reads as "we could not be bothered", which is the
   *  opposite of what a trust-led catalogue must say. */
  image: Image | null;
  /** Subcategories are supported by the model and unused at launch. */
  parentId: string | null;
  order: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  /** Permanent for the life of the product. Never regenerated from the name — a rename
   *  must not break a link sitting in a customer's WhatsApp thread. */
  slug: string;
  name: string;
  /** <= 160 chars. Does triple duty: product card, meta description, and the prefilled
   *  WhatsApp message. Write it once, write it well. */
  summary: string;
  /** Plain prose. Paragraphs separated by a blank line. */
  description: string;

  categoryId: string;
  brandId: string | null;
  sku: string | null;

  specifications: SpecGroup[];
  attributes: Attribute[];
  features: string[];

  /** images[0] is the card image and the Open Graph image. May be empty: a product without a
   *  photograph yet still lists, with a neutral tile, rather than being blocked from publishing. */
  images: Image[];
  video: Video | null;
  documents: ProductDocument[];
  relatedProductIds: string[];

  featured: boolean;
  status: 'published' | 'draft';
  order: number;
  /** ISO. `updatedAt` drives sitemap lastmod. */
  createdAt: string;
  updatedAt: string;
};

/** One media page — photos and videos in a single collection, not two pages. */
export type MediaItem =
  | { id: string; kind: 'photo'; image: Image; caption: string; order: number }
  | { id: string; kind: 'video'; video: Video; caption: string; order: number };

/* -------------------------------------------------------------------------- */
/* Query contract                                                              */
/* -------------------------------------------------------------------------- */

export const SORT_OPTIONS = ['featured', 'name-asc', 'name-desc', 'newest'] as const;
export type Sort = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<Sort, string> = {
  featured: 'Featured',
  'name-asc': 'Name (A–Z)',
  'name-desc': 'Name (Z–A)',
  newest: 'Newest first',
};

export type ProductQuery = {
  q?: string;
  categorySlugs?: string[];
  brandSlugs?: string[];
  sort?: Sort;
};

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

/**
 * The filter panel renders Facet[] generically — it does not know that "category" and
 * "brand" are the only two facets today. That is why adding a third one later touches
 * the data layer and nothing else.
 */
export type Facet = {
  key: 'category' | 'brand';
  label: string;
  options: FacetOption[];
};

export type ProductListResult = {
  items: Product[];
  total: number;
  facets: Facet[];
};
