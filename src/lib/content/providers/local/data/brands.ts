import type { Brand } from '@/lib/content/types';

/**
 * EMPTY. We do not know which brands WaveFighter actually carries, and listing a brand you do
 * not stock is a claim that will be tested by the first customer who asks for it.
 *
 * The brand filter hides itself when this is empty, so the catalogue is complete without it.
 *
 * TO FILL IN:
 *   { id: 'brand-example', slug: 'example-brand', name: 'Example Brand' },
 */
export const brands: Brand[] = [];
