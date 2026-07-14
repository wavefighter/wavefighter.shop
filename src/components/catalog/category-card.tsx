import NextImage from 'next/image';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/primitives/image-placeholder';
import type { Category } from '@/lib/content';

/**
 * Deliberately the same grammar as ProductCard — image, then text, one link wrapping the
 * whole thing. A visitor scanning the home page should not have to learn two card languages
 * on one screen.
 *
 * The index number ("01", "02") is the difference between a card and a catalogue entry. It
 * costs nothing, it is honest, and it makes eight categories read as a considered range
 * rather than a grid of links.
 *
 * The count is shown when there are products. When the catalogue is still being built we
 * say "Coming soon" rather than printing "0 products", which reads like a bug.
 */
export const CategoryCard = ({
  category,
  productCount,
  index,
  priority = false,
}: {
  category: Category;
  productCount: number;
  index: number;
  priority?: boolean;
}) => (
  <article className="group h-full">
    <Link
      href={`/categories/${category.slug}`}
      className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-default bg-surface"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-surface-sunken">
        {category.image ? (
          <NextImage
            src={category.image.src}
            alt={category.image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder label={category.name} />
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <span className="tabular text-xs font-semibold text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-primary">
            {category.name}
          </h3>
          <p className="tabular text-sm text-muted">
            {productCount > 0
              ? `${productCount} ${productCount === 1 ? 'product' : 'products'}`
              : 'Coming soon'}
          </p>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="mt-6 size-4 shrink-0 text-muted transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:text-accent"
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  </article>
);
