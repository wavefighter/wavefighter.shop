import Link from 'next/link';
import type { Facet, ProductQuery } from '@/lib/content';
import { clearFiltersHref, toggleFacetHref } from '@/lib/utils/search-params';

/**
 * The chips showing what is currently narrowing the results, each one removable.
 *
 * This exists because of a specific, common failure: a customer applies three filters,
 * scrolls, sees four results, and cannot remember why. Without this row they must scroll
 * back up and read the panel to find out. With it, the state of the page is legible from
 * wherever they happen to be standing.
 */
export const ActiveFilters = ({
  query,
  facets,
  basePath,
}: {
  query: ProductQuery;
  facets: Facet[];
  basePath: string;
}) => {
  const labelFor = (key: 'category' | 'brand', value: string): string =>
    facets
      .find((facet) => facet.key === key)
      ?.options.find((option) => option.value === value)?.label ?? value;

  const chips: { key: 'category' | 'brand'; value: string; label: string }[] = [
    ...(query.categorySlugs ?? []).map((value) => ({
      key: 'category' as const,
      value,
      label: labelFor('category', value),
    })),
    ...(query.brandSlugs ?? []).map((value) => ({
      key: 'brand' as const,
      value,
      label: labelFor('brand', value),
    })),
  ];

  const hasSearch = Boolean(query.q);
  if (chips.length === 0 && !hasSearch) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasSearch && (
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-default bg-surface-sunken px-3 text-sm text-secondary">
          Search:&nbsp;<span className="font-semibold text-primary">{query.q}</span>
        </span>
      )}

      {chips.map((chip) => (
        <Link
          key={`${chip.key}-${chip.value}`}
          href={toggleFacetHref(basePath, query, chip.key, chip.value)}
          scroll={false}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex min-h-9 items-center gap-2 rounded-md bg-accent-subtle px-3 text-sm font-semibold text-accent transition-colors duration-[var(--duration-fast)] hover:bg-surface-sunken"
        >
          {chip.label}
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="size-3"
          >
            <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
          </svg>
        </Link>
      ))}

      <Link
        href={clearFiltersHref(basePath, query)}
        scroll={false}
        className="inline-flex min-h-9 items-center px-2 text-sm text-muted underline underline-offset-4 transition-colors hover:text-primary"
      >
        Clear all
      </Link>
    </div>
  );
};
