import NextImage from 'next/image';
import Link from 'next/link';

/**
 * THE LOGO. The one thing on this site nobody may touch.
 *
 * The artwork is used exactly as supplied — no redraw, no recolour, no simplification, no
 * change of proportion or angle. The only preparation applied was cutting it out of its
 * white JPEG background so it can sit on a surface; the ink is untouched.
 *
 * THE BRAND RULE THIS COMPONENT ENFORCES:
 *
 *   The mark is navy-on-blue. It CANNOT go on a dark surface — it disappears.
 *
 * That is not a preference, it is a fact of the artwork, and it is the reason the entire
 * site is light-led with navy instrument bands rather than the dark treatment most marine
 * sites reach for. The header and footer are light SO THAT the logo can live in them. A
 * knockout white version would have solved it, but that would mean recolouring the mark,
 * which the brief forbids and which would have been the wrong answer anyway: this logo's
 * navy IS the brand.
 *
 * Clear space is baked into the asset (4% of its width on every side), so a caller can
 * place it flush against a layout edge without crowding it.
 *
 * `priority` because the header logo is above the fold on every single page — it is
 * frequently the LCP element, and lazy-loading it would be a measurable regression.
 */
export const Logo = ({
  className = 'h-11 w-auto',
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) => (
  <NextImage
    src="/brand/wavefighter-logo.png"
    alt="WaveFighter"
    width={1248}
    height={1106}
    priority={priority}
    /* The rendered box is ~50–160px wide, so the browser is told to fetch a small variant.
       Serving the 1248px original into a 50px slot would waste ~450KB on every page load —
       the single most common performance mistake made with a logo. */
    sizes="(min-width: 768px) 160px, 120px"
    className={className}
  />
);

/**
 * The clickable lockup used in the header and footer. Split from `Logo` so the mark can
 * also be placed in non-navigational contexts (an OG image, a document header) without
 * dragging a link into it.
 */
export const LogoLink = ({
  className = 'h-11 w-auto',
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) => (
  <Link
    href="/"
    aria-label="WaveFighter — home"
    className="inline-flex shrink-0 items-center rounded-sm transition-opacity duration-[var(--duration-fast)] hover:opacity-85"
  >
    <Logo className={className} priority={priority} />
  </Link>
);
