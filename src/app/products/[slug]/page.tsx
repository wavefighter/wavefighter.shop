import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/catalog/product-grid';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';
import { DocumentList } from '@/components/product/document-list';
import { FeatureList } from '@/components/product/feature-list';
import { ProductCta } from '@/components/product/product-cta';
import { ProductDescription } from '@/components/product/product-description';
import { ProductGallery } from '@/components/product/product-gallery';
import { SpecTable } from '@/components/product/spec-table';
import { Breadcrumbs } from '@/components/primitives/breadcrumbs';
import { Container } from '@/components/primitives/container';
import { Section } from '@/components/primitives/section';
import { JsonLd } from '@/components/seo/json-ld';
import {
  getAllProductSlugs,
  getBrands,
  getCategories,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/content';
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from '@/lib/seo';

/** Next 16: params is a Promise. Synchronous access was removed in this major. */
type PageProps = { params: Promise<{ slug: string }> };

/** Every product is statically generated. A catalogue page that hits a data source at request
 *  time is paying for flexibility it does not use. */
export const generateStaticParams = async () => {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
};

/**
 * Metadata comes from the shared builder — this page does not know what an Open Graph tag is,
 * and it never has to. Add a product; get a canonical URL, an OG card and a Twitter card free.
 */
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const image = product.images[0];

  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
    ...(image ? { image } : {}),
  });
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, brands, related] = await Promise.all([
    getCategories(),
    getBrands(),
    getRelatedProducts(product.id),
  ]);

  const category = categories.find((candidate) => candidate.id === product.categoryId);
  const brand = brands.find((candidate) => candidate.id === product.brandId);
  const brandsById = new Map(brands.map((candidate) => [candidate.id, candidate]));

  // Content validation guarantees this reference resolves, so a missing category means the data
  // layer is broken — not that this product is unusual.
  if (!category) notFound();

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: category.name, path: `/categories/${category.slug}` },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[productJsonLd(product, category, brand ?? null), breadcrumbJsonLd(crumbs)]} />

      <Container className="pt-8">
        <Breadcrumbs items={crumbs} />
      </Container>

      {/* MOBILE-FIRST: image, then identity, then the action. The customer sees the product,
          learns what it is, and is given exactly ONE thing to do — before any scroll is
          required. Specifications come afterwards, because they confirm a decision rather than
          prompt one. */}
      <Container className="grid gap-12 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-7 lg:pt-2">
          <div className="flex flex-col gap-4">
            {brand && <p className="eyebrow">{brand.name}</p>}
            <h1 className="text-[length:var(--text-h1)]">{product.name}</h1>
            <p className="text-lg leading-relaxed text-secondary">{product.summary}</p>
          </div>

          <ProductCta productSlug={product.slug} />

          {product.sku && (
            <p className="text-sm text-muted">
              Model <span className="tabular font-semibold text-secondary">{product.sku}</span>
            </p>
          )}

          {product.features.length > 0 && (
            <div className="waterline pt-6">
              <h2 className="eyebrow mb-5">Key features</h2>
              <FeatureList features={product.features} />
            </div>
          )}
        </div>
      </Container>

      <Container>
        {product.description && (
          <Section eyebrow="Overview" title="About this product" waterline>
            <div className="max-w-3xl">
              <ProductDescription description={product.description} />
            </div>
          </Section>
        )}

        {product.specifications.length > 0 && (
          <Section eyebrow="Technical" title="Specifications" waterline>
            <div className="max-w-3xl">
              <SpecTable groups={product.specifications} />
            </div>
          </Section>
        )}

        {product.documents.length > 0 && (
          <Section eyebrow="Downloads" title="Documents" waterline>
            <div className="max-w-3xl">
              <DocumentList documents={product.documents} />
            </div>
          </Section>
        )}

        {related.length > 0 && (
          <Section
            eyebrow="Also consider"
            title="Related products"
            waterline
          >
            <ProductGrid products={related} brandsById={brandsById} />
          </Section>
        )}
      </Container>

      <FloatingWhatsApp productName={product.name} productPath={`/products/${product.slug}`} />
    </>
  );
}
