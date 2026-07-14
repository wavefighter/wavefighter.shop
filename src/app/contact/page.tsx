import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';
import { Button } from '@/components/primitives/button';
import { ComingSoon } from '@/components/primitives/coming-soon';
import { Container } from '@/components/primitives/container';
import {
  contact,
  hasAddress,
  hasAnyDirectChannel,
  hasContactFormDelivery,
  hasEmail,
  hasHours,
  hasPhone,
  hasWhatsApp,
} from '@/config/site';
import { getProductBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { telLink, whatsappLink } from '@/lib/utils/contact-links';

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = buildMetadata({
  title: 'Contact us',
  description:
    'Request a quotation from WaveFighter — marine equipment and outdoor adventure products in the United Arab Emirates.',
  path: '/contact',
});

/**
 * CONTACT — and the quotation request, which is the same page.
 *
 * There is no separate /quote route and no modal. The product page links here with
 * `?product=<slug>` and the form arrives prefilled. A modal would need a focus trap, a scroll
 * lock, its own state and a second copy of the form — and on a phone it would be worse.
 *
 * The `?product=` value is LOOKED UP, not trusted. It is user-controlled input echoed back onto
 * the page; if it does not resolve to a real product we ignore it, which is why a crafted link
 * cannot make this page display arbitrary text.
 *
 * WHAT RENDERS, AND WHY:
 *   - The two-column layout ALWAYS renders, so the page never looks half-built.
 *   - The form renders only when email delivery is configured. A form that cannot deliver is
 *     the most damaging thing on this site: the customer believes they have reached you, and
 *     waits.
 *   - Each direct channel renders only when it has a real value behind it. A WhatsApp button
 *     that opens wa.me/ with no number lands the customer on an error page.
 *   - With nothing configured, both columns show designed states. The page still looks like a
 *     company's contact page — it simply does not lie about being reachable.
 */
export default async function ContactPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const slug = typeof raw['product'] === 'string' ? raw['product'] : undefined;
  const product = slug ? await getProductBySlug(slug) : null;

  return (
    <>
      <Container className="py-14 sm:py-20">
        <header className="flex max-w-3xl flex-col gap-5">
          <p className="eyebrow">{product ? 'Quotation request' : 'Contact'}</p>
          <h1 className="text-[length:var(--text-h1)]">
            {product ? 'Request a quotation' : 'Talk to us'}
          </h1>
          <p className="text-lg leading-relaxed text-secondary">
            Tell us what you are looking for and we will come back to you.
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {hasContactFormDelivery ? (
              <ContactForm productSlug={product?.slug} productName={product?.name} />
            ) : (
              <ComingSoon
                title="Enquiry form coming soon"
                description={
                  hasAnyDirectChannel
                    ? 'Our online enquiry form is being set up. The fastest way to reach us in the meantime is alongside.'
                    : 'Our online enquiry form is being set up. Please check back shortly.'
                }
                {...(hasWhatsApp
                  ? {
                      action: (
                        <Button asChild variant="whatsapp" size="lg">
                          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                            Message us on WhatsApp
                          </a>
                        </Button>
                      ),
                    }
                  : {})}
              />
            )}
          </div>

          <aside className="flex flex-col gap-7 lg:col-span-5 lg:border-l lg:border-default lg:ps-16">
            <div className="waterline pt-6">
              <p className="eyebrow mb-5">Direct contact</p>

              {hasAnyDirectChannel ? (
                <div className="flex flex-col gap-3">
                  {hasWhatsApp && (
                    <Button asChild variant="whatsapp" size="lg">
                      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                        WhatsApp us
                      </a>
                    </Button>
                  )}
                  {hasPhone && (
                    <Button asChild variant="outline" size="lg">
                      <a href={telLink()} className="tabular">
                        {contact.phone}
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                /* The column keeps its place in the layout — removing it would collapse the grid
                   and make the page look half-designed — and says plainly that details are on
                   the way, rather than showing a number that does not exist. */
                <p className="rounded-lg border border-default bg-surface-sunken p-6 text-sm leading-relaxed text-secondary">
                  Our phone, WhatsApp and email details are being finalised and will be published
                  here shortly.
                </p>
              )}
            </div>

            {(hasEmail || hasAddress || hasHours) && (
              <dl className="flex flex-col gap-6 border-t border-default pt-7 text-sm">
                {hasEmail && (
                  <div>
                    <dt className="eyebrow mb-2">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-secondary transition-colors hover:text-accent"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                )}
                {hasAddress && (
                  <div>
                    <dt className="eyebrow mb-2">Address</dt>
                    <dd className="leading-relaxed text-secondary">
                      {contact.address.street}
                      <br />
                      {contact.address.city}, United Arab Emirates
                    </dd>
                  </div>
                )}
                {hasHours && (
                  <div>
                    <dt className="eyebrow mb-2">Hours</dt>
                    <dd className="text-secondary">{contact.hours}</dd>
                  </div>
                )}
              </dl>
            )}
          </aside>
        </div>
      </Container>

      <FloatingWhatsApp
        {...(product ? { productName: product.name, productPath: `/products/${product.slug}` } : {})}
      />
    </>
  );
}
