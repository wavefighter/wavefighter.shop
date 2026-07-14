/**
 * Content validation. Runs before every build (`npm run build`).
 *
 * WHAT THIS NO LONGER DOES: it does not block a deployment because a value looks like a
 * placeholder. That gate is gone — there is no placeholder data left in the repository for it to
 * catch, and contact details now come from environment variables rather than from code.
 *
 * WHAT IT STILL DOES, and why it must: a local data layer has none of the guarantees a CMS gives
 * you for free. A typo in a category ID type-checks perfectly and 404s in production. A deleted
 * product leaves a related-products link pointing at nothing. An image path with a typo renders a
 * broken box on the most important element of a product page.
 *
 * These checks are not bureaucracy — they are the safety net that lets you add products yourself,
 * without a developer, and know the build will stop you before a customer sees the mistake.
 *
 *   1. Every record satisfies its schema
 *   2. IDs and slugs are unique within their type
 *   3. No product slug collides with a category slug (they would fight for the same route)
 *   4. Every categoryId / brandId / relatedProductId resolves to something real
 *   5. Every referenced image and document exists in /public
 *
 * An EMPTY catalogue is valid. This script passes with zero products, which is exactly what makes
 * a same-day launch possible.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { brands } from '../src/lib/content/providers/local/data/brands';
import { categories } from '../src/lib/content/providers/local/data/categories';
import { media } from '../src/lib/content/providers/local/data/media';
import { products } from '../src/lib/content/providers/local/data/products';
import {
  brandSchema,
  categorySchema,
  mediaItemSchema,
  productSchema,
} from '../src/lib/content/schemas';

const PUBLIC_DIR = join(process.cwd(), 'public');
const errors: string[] = [];

const fail = (message: string) => errors.push(message);

/* 1. Schemas -------------------------------------------------------------- */
type Validatable = {
  safeParse: (value: unknown) => {
    success: boolean;
    error?: { issues: { path: PropertyKey[]; message: string }[] };
  };
};

const validate = (items: unknown[], schema: Validatable, label: string): void => {
  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      for (const issue of result.error?.issues ?? []) {
        fail(`${label}[${index}] → ${issue.path.join('.')}: ${issue.message}`);
      }
    }
  });
};

validate(categories, categorySchema, 'category');
validate(brands, brandSchema, 'brand');
validate(products, productSchema, 'product');
validate(media, mediaItemSchema, 'media');

/* 2. Uniqueness ----------------------------------------------------------- */
const assertUnique = (values: string[], label: string): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) fail(`Duplicate ${label}: "${value}"`);
    seen.add(value);
  }
};

assertUnique(products.map((p) => p.id), 'product id');
assertUnique(products.map((p) => p.slug), 'product slug');
assertUnique(categories.map((c) => c.id), 'category id');
assertUnique(categories.map((c) => c.slug), 'category slug');
assertUnique(brands.map((b) => b.id), 'brand id');
assertUnique(brands.map((b) => b.slug), 'brand slug');

/* 3. Cross-namespace slug collisions -------------------------------------- */
const categorySlugs = new Set(categories.map((c) => c.slug));
for (const product of products) {
  if (categorySlugs.has(product.slug)) {
    fail(`Product slug "${product.slug}" collides with a category slug — routing would be ambiguous.`);
  }
}

/* 4. Referential integrity ------------------------------------------------ */
const categoryIds = new Set(categories.map((c) => c.id));
const brandIds = new Set(brands.map((b) => b.id));
const productIds = new Set(products.map((p) => p.id));

for (const product of products) {
  if (!categoryIds.has(product.categoryId)) {
    fail(`Product "${product.slug}" references unknown category "${product.categoryId}"`);
  }
  if (product.brandId && !brandIds.has(product.brandId)) {
    fail(`Product "${product.slug}" references unknown brand "${product.brandId}"`);
  }
  for (const relatedId of product.relatedProductIds) {
    if (!productIds.has(relatedId)) {
      fail(`Product "${product.slug}" relates to unknown product "${relatedId}"`);
    }
    if (relatedId === product.id) {
      fail(`Product "${product.slug}" is related to itself`);
    }
  }
}

for (const category of categories) {
  if (category.parentId && !categoryIds.has(category.parentId)) {
    fail(`Category "${category.slug}" references unknown parent "${category.parentId}"`);
  }
}

/* 5. Assets exist on disk -------------------------------------------------- */
const assets: { path: string; owner: string }[] = [
  ...categories.flatMap((c) => (c.image ? [{ path: c.image.src, owner: `category "${c.slug}"` }] : [])),
  ...products.flatMap((p) => [
    ...p.images.map((i) => ({ path: i.src, owner: `product "${p.slug}"` })),
    ...p.documents.map((d) => ({ path: d.file, owner: `product "${p.slug}"` })),
  ]),
  ...media.flatMap((m) => (m.kind === 'photo' ? [{ path: m.image.src, owner: `media "${m.id}"` }] : [])),
];

for (const asset of assets) {
  if (!existsSync(join(PUBLIC_DIR, asset.path))) {
    fail(`Missing asset for ${asset.owner}: public${asset.path}`);
  }
}

/* Report ------------------------------------------------------------------- */
if (errors.length > 0) {
  console.error(`\n  ${errors.length} content error(s):\n`);
  for (const error of errors) console.error(`  error    ${error}`);
  console.error('');
  process.exit(1);
}

console.log(
  `  Content OK — ${products.length} products, ${categories.length} categories, ` +
    `${brands.length} brands, ${media.length} media items`,
);
