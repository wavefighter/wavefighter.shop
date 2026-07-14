import NextImage from 'next/image';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/primitives/image-placeholder';
import type { Brand, Product } from '@/lib/content';

/**
 * THE ONE PRODUCT CARD. Home, catalogue, category, related products — all of them render
 * this. There is no "featured card" variant, because a second card is a second thing to
 * keep in sync, and it always loses.
 *
 * The whole card is ONE link. Nesting links inside it (image → product, title → product)
 * creates duplicate tab stops and confuses screen readers for no gain.
 *
 * The interaction: a 2px lift, a shadow, a border that warms to azure, and the arrow slides
 * 2px. All 200ms, all decelerating. You should feel the card acknowledge you, not watch it
 * perform. Under `prefers-reduced-motion` every one of those becomes instant.
 *
 * The brand name sits ABOVE the product name as an instrument label — small, uppercase,
 * wide-tracked. That ordering is how equipment catalogues have always read, and it is worth
 * more than any amount of decoration for making this look like a company that knows its
 * category.
 */
export const ProductCard = ({
  product,
  brand,
  priority = false,
}: {
  product: Product;
  brand?: Brand | undefined;
  priority?: boolean;
}) => {
  const image = product.images[0];

  return (
    <article className="group h-full">
      <Link
        href={`/products/${product.slug}`}
        className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-default bg-surface"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-surface-sunken">
          {image ? (
            <NextImage
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              /* Honest `sizes`, so a phone downloads a ~700px image rather than the 1600px
                 original. On a weak connection this single attribute is worth more than most
                 of the rest of our performance work combined. */
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
          ) : (
            <ImagePlaceholder label={product.name} />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-6">
          {brand && <p className="eyebrow">{brand.name}</p>}

          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-primary">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-secondary">
            {product.summary}
          </p>

          <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-accent">
            View details
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="size-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
};
