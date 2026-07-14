import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { contact, hasPhone } from '@/config/site';
import { telLink } from '@/lib/utils/contact-links';

/**
 * THE CLOSING CTA — a navy panel, because it is the last thing on the page and it should
 * land with weight.
 *
 * The copy asks a question and offers a channel. It promises no response time, no price and
 * no advice, because none of those have been confirmed to us — and a promise made here is
 * the first thing the customer measures you against.
 *
 * The phone button renders only when a real number is configured. A `tel:` link with
 * nothing behind it is a dead end that looks like a working one.
 */
export const ContactCta = () => (
  <div className="on-dark hull relative overflow-hidden rounded-xl px-8 py-16 sm:px-14 sm:py-20">
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,var(--accent-on-dark)_0,var(--accent-on-dark)_120px,var(--border-inverse)_120px,var(--border-inverse)_100%)]"
    />

    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-2xl flex-col gap-4">
        <p className="eyebrow eyebrow-inverse">Get in touch</p>
        <h2 className="text-[length:var(--text-h2)] text-inverse">
          Tell us what you need on the water.
        </h2>
        <p className="text-base leading-relaxed text-inverse-muted sm:text-lg">
          Send us the requirement and we will come back to you with what we can supply.
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
          <Link href="/contact">Request a quote</Link>
        </Button>
        {hasPhone && (
          <Button asChild variant="inverse-outline" size="lg" className="w-full sm:w-auto">
            <a href={telLink()}>{contact.phone}</a>
          </Button>
        )}
      </div>
    </div>
  </div>
);
