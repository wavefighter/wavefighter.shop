import Link from 'next/link';
import { SORT_LABELS, SORT_OPTIONS, type ProductQuery } from '@/lib/content';
import { cn } from '@/lib/utils/cn';
import { setSortHref } from '@/lib/utils/search-params';

/**
 * Sort — a segmented control of links.
 *
 * A native <select> cannot navigate on change without an onChange handler, which would mean
 * a client component for four options. So: four links. Same result, no bundle, and every
 * sort order becomes a real URL. On mobile it scrolls horizontally rather than wrapping,
 * keeping it to a single line.
 */
export const SortSelect = ({ query, basePath }: { query: ProductQuery; basePath: string }) => {
  const active = query.sort ?? 'featured';

  return (
    <div className="flex items-center gap-3">
      <span id="sort-label" className="shrink-0 text-sm text-muted">
        Sort
      </span>

      <ul
        aria-labelledby="sort-label"
        className="flex gap-0.5 overflow-x-auto rounded-md border border-default bg-surface p-1"
      >
        {SORT_OPTIONS.map((option) => (
          <li key={option}>
            <Link
              href={setSortHref(basePath, query, option)}
              aria-current={option === active ? 'true' : undefined}
              scroll={false}
              className={cn(
                'flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-sm px-3 text-sm transition-colors duration-[var(--duration-fast)]',
                option === active
                  ? 'bg-brand font-semibold text-on-brand'
                  : 'text-secondary hover:bg-surface-sunken hover:text-primary',
              )}
            >
              {SORT_LABELS[option]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
