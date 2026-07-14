import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActiveFilters } from '@/components/catalog/active-filters';
import { FilterPanel } from '@/components/catalog/filter-panel';
import { ProductGrid } from '@/components/catalog/product-grid';
import { SearchInput } from '@/components/catalog/search-input';
import { SortSelect } from '@/components/catalog/sort-select';
import { Breadcrumbs } from '@/components/primitives/breadcrumbs';
import { Button } from '@/components/primitives/button';
import { ComingSoon } from '@/components/primitives/coming-soon';
import { Container } from '@/components/primitives/container';
import { EmptyState } from '@/components/primitives/empty-state';
import { JsonLd } from '@/components/seo/json-ld';
import { getBrands, getCategories, getCategoryBySlug, getProducts } from '@/lib/content';
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from '@/lib/seo';
import {
  clearFiltersHref,
  hasActiveFilters,
  parseProductQuery,
  type RawSearchParams,
} from '@/lib/utils/search-params';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export const generateStaticParams = async () => {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
};

/**
 * CATEGORY PAGES ARE THE SEO MONEY PAGES.
 *
 * A customer searching "outboard motors Dubai" lands here, not on /products. That is why the
 * category description is worth writing properly — and why, until it exists, the meta
 * description falls back to a factual sentence rather than rendering blank. A missing meta
 * description lets Google invent a snippet from whatever text it finds on the page.
 */
export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const [{ slug }, raw] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const query = parseProductQuery(raw);

  return buildMetadata({
    title: category.name,
    description: category.description
      ? category.description.slice(0, 155).trimEnd()
      : `${category.name} from WaveFighter — marine equipment and outdoor adventure products in the UAE.`,
    path: `/categories/${category.slug}`,
    noindex: hasActiveFilters(query),
    ...(category.image ? { image: category.image } : {}),
  });
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, raw] = await Promise.all([params, searchParams]);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const basePath = `/categories/${category.slug}`;

  /* The category is baked into the query rather than read from the URL: the route already says
     which category this is, so a ?category= param here would be redundant at best and
     contradictory at worst. It also means the returned facets contain only the brands present
     WITHIN this category — offering "Yamaha (0)" on the kayak page is a dead end. */
  const query = { ...parseProductQuery(raw), categorySlugs: [category.slug] };

  const [{ items, total, facets }, brands] = await Promise.all([getProducts(query), getBrands()]);
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));

  // The category facet is hidden here — we are already inside a category, and offering a way to
  // filter to a DIFFERENT one from inside this page is simply confusing.
  const brandFacets = facets.filter((facet) => facet.key === 'brand');
  const filtersApplied = hasActiveFilters({ ...query, categorySlugs: [] });

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: category.name, path: basePath },
  ];

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={
          items.length > 0
            ? [breadcrumbJsonLd(crumbs), itemListJsonLd(items)]
            : [breadcrumbJsonLd(crumbs)]
        }
      />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 flex max-w-3xl flex-col gap-5">
        <p className="eyebrow">Category</p>
        <h1 className="text-[length:var(--text-h1)]">{category.name}</h1>
        {/* Renders nothing rather than an empty paragraph, which would leave a gap in the
            layout that reads as a bug. */}
        {category.description && (
          <p className="text-lg leading-relaxed text-secondary">{category.description}</p>
        )}
      </header>

      <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="order-2 lg:order-1 lg:w-64 lg:shrink-0">
          {brandFacets.some((facet) => facet.options.length > 1) && (
            <>
              <h2 className="mb-6 font-display text-lg font-semibold tracking-tight lg:sr-only">
                Filter
              </h2>
              <FilterPanel facets={brandFacets} query={query} basePath={basePath} />
            </>
          )}
        </div>

        <div className="order-1 flex flex-1 flex-col gap-6 lg:order-2">
          <SearchInput action={basePath} query={query} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="tabular text-sm text-muted" aria-live="polite">
              {total} {total === 1 ? 'product' : 'products'}
            </p>
            <SortSelect query={query} basePath={basePath} />
          </div>

          <ActiveFilters
            query={{ ...query, categorySlugs: [] }}
            facets={brandFacets}
            basePath={basePath}
          />

          {items.length > 0 ? (
            <ProductGrid products={items} brandsById={brandsById} priorityCount={3} />
          ) : filtersApplied ? (
            <EmptyState
              title="Nothing here matches"
              description="Try clearing the filters, or browse the full catalogue."
              action={
                <Button asChild variant="accent" size="md">
                  <Link href={clearFiltersHref(basePath, query)}>Clear filters</Link>
                </Button>
              }
            />
          ) : (
            <ComingSoon
              title={`${category.name} coming soon`}
              description="We are adding this range to the site. Tell us what you are looking for and we will let you know what we can supply."
              action={
                <Button asChild variant="accent" size="lg">
                  <Link href="/contact">Request a quote</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}
