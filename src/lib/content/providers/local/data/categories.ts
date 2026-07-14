import type { Category } from '@/lib/content/types';

/**
 * The eight categories WaveFighter sells. These are REAL — they are the business's own product
 * range, not invented by us.
 *
 * `description` is empty and `image` is null on every one of them, and that is deliberate.
 * Marketing copy and photography have to come from the business; anything we wrote here would
 * be a guess presented as fact. The category card renders a neutral tile without an image, and
 * the category page renders correctly without a description.
 *
 * TO FILL IN: add a `description` (2–4 sentences of real copy — this is what makes the page
 * rank) and an `image` for each. See README → "Launch checklist".
 */
export const categories: Category[] = [
  {
    id: 'cat-outboard-motors',
    slug: 'outboard-motors',
    name: 'Outboard Motors',
    description: '',
    image: null,
    parentId: null,
    order: 1,
  },
  {
    id: 'cat-inflatable-boats',
    slug: 'inflatable-boats',
    name: 'Inflatable Boats',
    description: '',
    image: null,
    parentId: null,
    order: 2,
  },
  {
    id: 'cat-kayaks',
    slug: 'kayaks',
    name: 'Kayaks',
    description: '',
    image: null,
    parentId: null,
    order: 3,
  },
  {
    id: 'cat-fishing-equipment',
    slug: 'fishing-equipment',
    name: 'Fishing Equipment',
    description: '',
    image: null,
    parentId: null,
    order: 4,
  },
  {
    id: 'cat-marine-accessories',
    slug: 'marine-accessories',
    name: 'Marine Accessories',
    description: '',
    image: null,
    parentId: null,
    order: 5,
  },
  {
    id: 'cat-safety-equipment',
    slug: 'safety-equipment',
    name: 'Safety Equipment',
    description: '',
    image: null,
    parentId: null,
    order: 6,
  },
  {
    id: 'cat-boat-parts',
    slug: 'boat-parts',
    name: 'Boat Parts',
    description: '',
    image: null,
    parentId: null,
    order: 7,
  },
  {
    id: 'cat-water-sports-equipment',
    slug: 'water-sports-equipment',
    name: 'Water Sports Equipment',
    description: '',
    image: null,
    parentId: null,
    order: 8,
  },
];
