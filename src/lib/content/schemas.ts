import { z } from 'zod';

/**
 * A local data layer must be as trustworthy as a CMS.
 *
 * A CMS gives you required fields, validation and referential integrity for free. Plain
 * TypeScript files give you none of that at runtime: a typo in a category ID compiles
 * perfectly and 404s in production. These schemas, plus `scripts/validate-content.ts`,
 * buy those guarantees back — bad content becomes a failed build, which is the cheapest
 * place in the world to find it.
 */

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case');

const imageSchema = z.object({
  src: z.string().startsWith('/', 'Image src must be a root-relative path under /public'),
  alt: z.string().min(1, 'Alt text is required on every image'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const videoSchema = z.object({
  provider: z.literal('youtube'),
  id: z.string().min(1).regex(/^[\w-]+$/, 'Use the video ID, not a full URL'),
  title: z.string().min(1),
});

const documentSchema = z.object({
  label: z.string().min(1),
  file: z.string().startsWith('/'),
  type: z.enum(['pdf', 'doc']),
  sizeBytes: z.number().int().positive(),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
  /* No minimum length. A minimum would force copy to be written, and copy written to satisfy a
     validator is filler — which is precisely what we are removing. Empty is honest; the page
     renders without it. */
  description: z.string(),
  image: imageSchema.nullable(),
  parentId: z.string().nullable(),
  order: z.number().int(),
});

export const brandSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
});

export const productSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
  summary: z.string().max(160, 'Summary is also the meta description — keep it under 160'),
  description: z.string(),
  categoryId: z.string().min(1),
  brandId: z.string().nullable(),
  sku: z.string().nullable(),
  specifications: z.array(
    z.object({
      title: z.string().min(1),
      rows: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).min(1),
    }),
  ),
  attributes: z.array(
    z.object({
      key: z.string().min(1),
      label: z.string().min(1),
      value: z.union([z.string(), z.number(), z.boolean()]),
      unit: z.string().optional(),
    }),
  ),
  features: z.array(z.string().min(1)),
  /* No `.min(1)`. A product with no photograph yet should not block a deployment — it lists
     with a neutral tile. The image is still the most important element on the page, and the
     launch checklist says so; the build does not need to enforce it. */
  images: z.array(imageSchema),
  video: videoSchema.nullable(),
  documents: z.array(documentSchema),
  relatedProductIds: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(['published', 'draft']),
  order: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const mediaItemSchema = z.discriminatedUnion('kind', [
  z.object({
    id: z.string().min(1),
    kind: z.literal('photo'),
    image: imageSchema,
    caption: z.string().min(1),
    order: z.number().int(),
  }),
  z.object({
    id: z.string().min(1),
    kind: z.literal('video'),
    video: videoSchema,
    caption: z.string().min(1),
    order: z.number().int(),
  }),
]);
