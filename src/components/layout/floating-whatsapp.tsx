import { hasWhatsApp } from '@/config/site';
import { whatsappLink } from '@/lib/utils/contact-links';

/**
 * The floating WhatsApp button.
 *
 * A server component — it renders a link, and a link needs no JavaScript. The obvious
 * instinct is to make this a client component with a hide-on-scroll behaviour; that trades
 * a real cost (a bundle, a scroll listener, jank) for an imagined benefit.
 *
 * It REPLACES the sticky mobile contact bar rather than sitting alongside it. Two pieces
 * of persistent chrome fighting over the same corner look fine in a mockup and feel
 * cluttered in the hand.
 *
 * 56px — above the 44px minimum, because it will be pressed by someone with wet hands —
 * and inside the safe-area inset so it clears the iOS home indicator.
 */
export const FloatingWhatsApp = ({
  productName,
  productPath,
}: {
  productName?: string;
  productPath?: string;
}) => {
  // No number configured, no button. A floating WhatsApp button that opens wa.me/ with an empty
  // number lands the customer on an error page — a worse outcome than never offering it.
  if (!hasWhatsApp) return null;

  return (
  <a
    href={whatsappLink({
      ...(productName ? { productName } : {}),
      ...(productPath ? { productPath } : {}),
    })}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={
      productName ? `Ask about the ${productName} on WhatsApp` : 'Contact WaveFighter on WhatsApp'
    }
    className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-[background-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:bg-whatsapp-hover hover:scale-105 active:scale-95"
  >
    {/* aria-hidden: the accessible name is on the link. Announcing the icon as well would
        make a screen reader say the same thing twice. */}
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.13.06-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.94-4.37-.15-.2-1.19-1.58-1.19-3.02s.75-2.14 1.02-2.44c.27-.3.59-.37.78-.37h.56c.18 0 .42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.75 1.24 1.62 2.01 1.11 1 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
    </svg>
  </a>
  );
};
