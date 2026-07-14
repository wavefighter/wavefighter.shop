import Link from 'next/link';
import type { Facet, ProductQuery } from '@/lib/content';
import { cn } from '@/lib/utils/cn';
import { toggleFacetHref } from '@/lib/utils/search-params';

/**
 * THE FILTER PANEL. Every option is a LINK, not a checkbox.
 *
 * This is the most consequential engineering decision on the catalogue, so it is worth
 * being explicit about what it buys:
 *
 *   - Zero JavaScript. No client component, no state, no onChange handler.
 *   - Every filter combination is a real, crawlable, shareable URL.
 *   - The back button works, for free, because the filter state IS the history entry.
 *   - It works with JavaScript disabled.
 *
 * `aria-pressed` gives a screen-reader user the toggle semantics a checkbox would have
 * provided. The link is doing a checkbox's job, so it must announce like one.
 *
 * The panel renders Facet[] GENERICALLY — it does not know that category and brand are the
 * only two facets today. Adding "horsepower" later is a change in the data layer and
 * nothing here.
 */
export const FilterPanel = ({
  facets,
  query,
  basePath,
}: {
  facets: Facet[];
  query: ProductQuery;
  basePath: string;
}) => {
  const selectedFor = (facet: Facet): string[] =>
    (facet.key === 'category' ? query.categorySlugs : query.brandSlugs) ?? [];

  const visible = facets.filter((facet) => facet.options.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-10">
      {visible.map((facet) => {
        const selected = selectedFor(facet);

        return (
          <fieldset key={facet.key} className="waterline border-0 p-0 pt-5">
            <legend className="eyebrow mb-4">{facet.label}</legend>

            <ul className="flex flex-col gap-0.5">
              {facet.options.map((option) => {
                const isSelected = selected.includes(option.value);

                return (
                  <li key={option.value}>
                    <Link
                      href={toggleFacetHref(basePath, query, facet.key, option.value)}
                      aria-pressed={isSelected}
                      /* Applying a filter must not throw the customer back to the top of the
                         page. They are looking at the filters — leave them where they are. */
                      scroll={false}
                      className={cn(
                        'flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-[0.9375rem] transition-colors duration-[var(--duration-fast)]',
                        isSelected
                          ? 'bg-accent-subtle font-semibold text-accent'
                          : 'text-secondary hover:bg-surface-sunken hover:text-primary',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        {/* A drawn checkbox. Purely decorative — aria-pressed on the link
                            carries the real state to assistive technology. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'flex size-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors duration-[var(--duration-fast)]',
                            isSelected
                              ? 'border-accent bg-accent'
                              : 'border-strong bg-surface',
                          )}
                        >
                          {isSelected && (
                            <svg
                              viewBox="0 0 12 12"
                              className="size-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.25"
                            >
                              <path
                                d="M2.5 6.5l2.5 2.5 4.5-5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {option.label}
                      </span>

                      <span className="tabular text-xs text-muted">{option.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
};
