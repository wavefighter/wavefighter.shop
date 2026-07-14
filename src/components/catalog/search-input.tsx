import { Button } from '@/components/primitives/button';
import type { ProductQuery } from '@/lib/content';

/**
 * Catalogue search — a plain HTML <form method="GET">.
 *
 * No client component, no useState, no router.push, no debounce. The browser turns this into
 * `/products?q=kayak` on submit, entirely on its own: it works with JavaScript disabled, it
 * produces a real URL a salesperson can paste into a WhatsApp thread, and it costs zero
 * kilobytes. An "instant search" firing on every keystroke would ship a client bundle, a
 * debounce and a race condition — to save one keypress.
 *
 * The hidden inputs preserve the active facets, so searching inside a filtered view does not
 * silently discard the filters. That is the bug this component exists to avoid.
 */
export const SearchInput = ({ action, query }: { action: string; query: ProductQuery }) => (
  <form action={action} method="get" role="search" className="flex gap-3">
    <label htmlFor="catalogue-search" className="sr-only">
      Search products
    </label>

    <div className="relative flex-1">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="M13.5 13.5L17 17" strokeLinecap="round" />
      </svg>

      <input
        id="catalogue-search"
        type="search"
        name="q"
        defaultValue={query.q ?? ''}
        placeholder="Search by name, brand or model"
        className="h-12 w-full rounded-md border border-strong bg-surface pl-11 pr-4 text-base text-primary transition-colors duration-[var(--duration-fast)] placeholder:text-muted hover:border-accent focus:border-accent"
      />
    </div>

    {/* Preserve the current facets across a search submit. */}
    {(query.categorySlugs ?? []).map((slug) => (
      <input key={`c-${slug}`} type="hidden" name="category" value={slug} />
    ))}
    {(query.brandSlugs ?? []).map((slug) => (
      <input key={`b-${slug}`} type="hidden" name="brand" value={slug} />
    ))}
    {query.sort && query.sort !== 'featured' && (
      <input type="hidden" name="sort" value={query.sort} />
    )}

    <Button type="submit" variant="brand" size="md" className="shrink-0">
      Search
    </Button>
  </form>
);
