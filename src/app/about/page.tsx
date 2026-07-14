import type { Metadata } from 'next';
import { ContactCta } from '@/components/marketing/contact-cta';
import { ValueProps } from '@/components/marketing/value-props';
import { WhoWeSupply } from '@/components/marketing/who-we-supply';
import { Container } from '@/components/primitives/container';
import { Section } from '@/components/primitives/section';
import { valueProps } from '@/config/value-props';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About us',
  description:
    'WaveFighter supplies marine equipment and outdoor adventure products to boat owners, fishermen, divers and marine businesses in the UAE.',
  path: '/about',
});

/**
 * ABOUT.
 *
 * The copy below contains nothing that was not stated by the business: what it sells, who it
 * sells to, where it operates. No founding story, no years-in-business figure, no team size,
 * no "passionate about the sea" — because none of that has been told to us, and About is
 * precisely the page a customer opens when they are checking whether you are real before they
 * spend money. Invented history is the single worst thing to put here.
 *
 * The layout does the work instead: an editorial two-column lead, then the range, then who we
 * supply. It reads as a company statement rather than as a page with content missing.
 *
 * TO FILL IN: replace the lead paragraphs with the company's real story.
 */
export default function AboutPage() {
  return (
    <>
      <Container className="pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <header className="flex flex-col gap-5 lg:col-span-5">
            <p className="eyebrow">About us</p>
            <h1 className="text-[length:var(--text-h1)]">
              Marine equipment,
              <br />
              supplied properly.
            </h1>
          </header>

          <div className="flex flex-col gap-5 text-base leading-relaxed text-secondary lg:col-span-7 lg:pt-2 lg:text-lg">
            <p>
              WaveFighter supplies marine equipment and outdoor adventure products across the
              United Arab Emirates.
            </p>
            <p>
              Our range covers outboard motors, inflatable boats, kayaks, fishing equipment,
              marine accessories, safety equipment, boat parts and water sports equipment.
            </p>
            <p>
              We work with boat owners, fishermen, divers, water sports enthusiasts and marine
              businesses. If you are looking for something specific, get in touch and we will
              tell you what we can supply.
            </p>
          </div>
        </div>
      </Container>

      <Container>
        {valueProps.length > 0 ? (
          <Section eyebrow="Why WaveFighter" title="What you can expect" waterline>
            <ValueProps />
          </Section>
        ) : (
          <Section eyebrow="Who we supply" title="The customers we work with" waterline>
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
