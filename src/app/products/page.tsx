import type { Metadata } from 'next';
import Link from 'next/link';
import { ActiveFilters } from '@/components/catalog/active-filters';
import { FilterPanel } from '@/components/catalog/filter-panel';
import { ProductGrid } from '@/components/catalog/product-grid';
import { SearchInput } from '@/components/catalog/search-input';
import { SortSelect } from '@/components/catalog/sort-select';
import { Button } from '@/components/primitives/button';
import { ComingSoon } from '@/components/primitives/coming-soon';
import { Container } from '@/components/primitives/container';
import { EmptyState } from '@/components/primitives/empty-state';
import { JsonLd } from '@/components/seo/json-ld';
import { getBrands, getProducts } from '@/lib/content';
import { buildMetadata, itemListJsonLd } from '@/lib/seo';
import {
  clearFiltersHref,
  hasActiveFilters,
  parseProductQuery,
  type RawSearchParams,
} from '@/lib/utils/search-params';

const BASE_PATH = '/products';

/** Next 16: searchParams is a Promise. Synchronous access was removed in this major. */
type PageProps = { searchParams: Promise<RawSearchParams> };

/**
 * The unfiltered /products is indexed. ANY filtered permutation is `noindex, follow` and
 * canonicalises to the clean URL.
 *
 * This is the decision that stops a catalogue site burying itself. With two facets and a
 * search box the number of reachable URLs is combinatorial; letting Google index all of them
 * spends the site's crawl budget on near-duplicates and leaves the pages that matter
 * under-crawled. If a specific combination ever proves commercially valuable, we PROMOTE it to
 * a real page with its own copy — deliberately, not by accident.
 */
export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const query = parseProductQuery(await searchParams);

  return buildMetadata({
    title: 'Catalogue',
    description:
      'Outboard motors, inflatable boats, kayaks, fishing equipment, marine accessories, safety equipment, boat parts and water sports equipment. Filter by category and brand, or search by model.',
    path: BASE_PATH,
    noindex: hasActiveFilters(query),
  });
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const query = parseProductQuery(await searchParams);

  const [{ items, total, facets }, brands, unfiltered] = await Promise.all([
    getProducts(query),
    getBrands(),
    getProducts(),
  ]);

  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const catalogueIsEmpty = unfiltered.total === 0;

  return (
    <Container className="py-14 sm:py-20">
      {/* ItemList structured data on the unfiltered view only. Marking up a filtered subset as
          "the product list" would be telling a search engine something untrue. */}
      {!hasActiveFilters(query) && items.length > 0 && <JsonLd data={itemListJsonLd(items)} />}

      <header className="flex max-w-3xl flex-col gap-5">
        <p className="eyebrow">Catalogue</p>
        <h1 className="text-[length:var(--text-h1)]">Products</h1>
        <p className="text-lg leading-relaxed text-secondary">
          Everything we supply, in one place.
        </p>
      </header>

      {/* MOBILE-FIRST: filters go BELOW the results, not above them.
          A filter panel stacked above a grid on a phone means the customer scrolls past four
          screens of controls to reach the thing they came for. Search and sort stay at the top
          because they are one line each; the facet list moves to a sidebar on large screens. */}
      <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="order-2 lg:order-1 lg:w-64 lg:shrink-0">
          <h2 className="mb-6 font-display text-lg font-semibold tracking-tight lg:sr-only">
            Filter
          </h2>
          <FilterPanel facets={facets} query={query} basePath={BASE_PATH} />
        </div>

        <div className="order-1 flex flex-1 flex-col gap-6 lg:order-2">
          <SearchInput action={BASE_PATH} query={query} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="tabular text-sm text-muted" aria-live="polite">
              {total} {total === 1 ? 'product' : 'products'}
            </p>
            <SortSelect query={query} basePath={BASE_PATH} />
          </div>

          <ActiveFilters query={query} facets={facets} basePath={BASE_PATH} />

          {items.length > 0 ? (
            <ProductGrid products={items} brandsById={brandsById} priorityCount={3} />
          ) : catalogueIsEmpty ? (
            /* No products at all — a different situation from a filter matching nothing, and
               it deserves different words. Telling someone to "clear your filters" when they
               have not set any is the kind of small dishonesty that makes a site feel broken. */
            <ComingSoon
              title="Our catalogue is being added to the site"
              description="We are photographing and specifying the range now. Tell us what you are looking for and we will let you know what we can supply."
              action={
                <Button asChild variant="accent" size="lg">
                  <Link href="/contact">Request a quote</Link>
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="Nothing matches those filters"
              description="Try removing a filter, or search for the model you have in mind."
              action={
                <Button asChild variant="accent" size="md">
                  <Link href={clearFiltersHref(BASE_PATH, query)}>Clear all filters</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}
