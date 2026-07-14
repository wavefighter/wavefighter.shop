import Link from 'next/link';
import { CategoryCard } from '@/components/catalog/category-card';
import { ProductGrid } from '@/components/catalog/product-grid';
import { ContactCta } from '@/components/marketing/contact-cta';
import { Hero } from '@/components/marketing/hero';
import { ValueProps } from '@/components/marketing/value-props';
import { WhoWeSupply } from '@/components/marketing/who-we-supply';
import { Button } from '@/components/primitives/button';
import { ComingSoon } from '@/components/primitives/coming-soon';
import { Container } from '@/components/primitives/container';
import { Section } from '@/components/primitives/section';
import { valueProps } from '@/config/value-props';
import { getBrands, getCategories, getFacets, getFeaturedProducts } from '@/lib/content';

/**
 * HOME.
 *
 * EVERY section renders, always. The page has the same structure on launch day as it will
 * have with a hundred products in it — the sections without data show a designed coming-soon
 * state rather than disappearing.
 *
 * That distinction matters more than it looks. A page that drops sections when data is
 * missing is a page whose layout changes as content lands, and it reads as thin TODAY. A page
 * that holds its structure reads as a company that is opening.
 *
 * Nothing here needs editing as content arrives: add products and the featured section fills
 * itself; add value props and that section takes over from "Who we supply".
 *
 * A server component. Zero client JavaScript on the most-visited page on the site.
 */
export default async function HomePage() {
  const [categories, featured, brands, facets] = await Promise.all([
    getCategories(),
    getFeaturedProducts(6),
    getBrands(),
    getFacets(),
  ]);

  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));

  /* Counts come from the facet builder — the same source the catalogue filters use — so the
     number printed on a card and the number of results behind it are computed once and cannot
     disagree. Counting separately here is exactly how those two numbers drift apart six
     months from now, and nobody can work out which one is lying. */
  const categoryCounts = new Map(
    (facets.find((facet) => facet.key === 'category')?.options ?? []).map((option) => [
      option.value,
      option.count,
    ]),
  );

  return (
    <>
      <Hero />

      <Container>
        <Section
          eyebrow="The range"
          title="What we supply"
          description="Eight categories, covering everything from the engine on the transom to the lifejacket in the locker."
          waterline
          action={
            <Button asChild variant="outline" size="md">
              <Link href="/products">View catalogue</Link>
            </Button>
          }
        >
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {categories.map((category, index) => (
              <li key={category.id}>
                <CategoryCard
                  category={category}
                  productCount={categoryCounts.get(category.slug) ?? 0}
                  index={index}
                  priority={index < 3}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="Selected equipment" title="Featured" waterline>
          {featured.length > 0 ? (
            <ProductGrid products={featured} brandsById={brandsById} priorityCount={3} />
          ) : (
            <ComingSoon
              title="Our catalogue is being added to the site"
              description="We are photographing and specifying the range now. Tell us what you are looking for in the meantime and we will let you know what we can supply."
              action={
                <Button asChild variant="accent" size="lg">
                  <Link href="/contact">Request a quote</Link>
                </Button>
              }
            />
          )}
        </Section>

        {/* Real value propositions when they exist; the factual alternative until then. See
            who-we-supply.tsx for why this slot is never a coming-soon panel. */}
        {valueProps.length > 0 ? (
          <Section eyebrow="Why WaveFighter" title="What you can expect" waterline>
            <ValueProps />
          </Section>
        ) : (
          <Section
            eyebrow="Who we supply"
            title="From individual owners to commercial marine operations"
            waterline
          >
            <WhoWeSupply />
          </Section>
        )}

        <Section>
          <ContactCta />
        </Section>
      </Container>
    </>
  );
}
