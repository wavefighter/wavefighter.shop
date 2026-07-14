import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { contact, hasPhone } from '@/config/site';
import { telLink } from '@/lib/utils/contact-links';

/**
 * ONE primary action: request a quote. Everything else is visibly secondary.
 *
 * Three equally-weighted buttons is not three times the conversion — it is a decision the
 * customer has to make before they can act, and some of them leave instead.
 *
 * The quote link carries ?product= into the contact page, so the enquiry arrives already
 * knowing what it is about. It is a plain link: it works with JavaScript disabled, it can be
 * shared, and it can be measured as a conversion. A modal would have needed a focus trap, a
 * scroll lock, its own state and a second copy of the form — and on a phone it would be worse.
 *
 * WhatsApp is not here. It lives in the floating button that follows the customer down the
 * page, so the three channels never duplicate each other.
 */
export const ProductCta = ({ productSlug }: { productSlug: string }) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
      <Link href={`/contact?product=${encodeURIComponent(productSlug)}`}>Request a quote</Link>
    </Button>

    {hasPhone && (
      <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
        <a href={telLink()}>{contact.phone}</a>
      </Button>
    )}
  </div>
);
