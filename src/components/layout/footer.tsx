import Link from 'next/link';
import { LogoLink } from '@/components/brand/logo';
import { Container } from '@/components/primitives/container';
import { mainNav } from '@/config/nav';
import {
  contact,
  hasAddress,
  hasAnyDirectChannel,
  hasEmail,
  hasHours,
  hasPhone,
  site,
} from '@/config/site';
import { telLink } from '@/lib/utils/contact-links';

/**
 * THE FOOTER — two bands.
 *
 * The upper band is LIGHT, because the logo lives there and the mark cannot survive on a
 * dark surface. The lower band is the navy plinth: the legal line, set on the hull colour.
 * The whole page therefore closes the way it opened — brand at full strength on white,
 * with the navy underneath holding it up.
 *
 * The nav is shared with the header via `mainNav`, so the two can never disagree about
 * what this site contains. Duplicating the list is how a page ends up in one nav and not
 * the other and nobody notices for six weeks.
 *
 * Every contact row is conditional. With nothing configured the column collapses to a
 * single link to the contact page — honest, and still somewhere to go. A footer listing a
 * phone number nobody answers is worse than a footer without one.
 */
export const Footer = () => (
  <footer className="mt-28">
    {/* --- Upper band: light, brand-led ------------------------------------- */}
    <div className="waterline border-t border-default bg-surface-sunken">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <LogoLink className="h-14 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-secondary">{site.description}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <h2 className="eyebrow mb-5">Navigate</h2>
          <ul className="flex flex-col gap-3.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-secondary transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="eyebrow mb-5">Get in touch</h2>
          <ul className="flex flex-col gap-3.5 text-sm text-secondary">
            {hasPhone && (
              <li>
                <a href={telLink()} className="tabular transition-colors hover:text-accent">
                  {contact.phone}
                </a>
              </li>
            )}
            {hasEmail && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {contact.email}
                </a>
              </li>
            )}
            {hasAddress && (
              <li className="leading-relaxed">
                {contact.address.street}
                <br />
                {contact.address.city}, United Arab Emirates
              </li>
            )}
            {hasHours && <li>{contact.hours}</li>}
            {!hasAnyDirectChannel && (
              <li>
                <Link href="/contact" className="transition-colors hover:text-accent">
                  Contact us
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Container>
    </div>

    {/* --- Lower band: the navy plinth --------------------------------------- */}
    <div className="bg-surface-inverse">
      <Container className="flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-inverse-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="text-xs text-inverse-muted">
          Marine equipment &amp; outdoor adventure products &middot; United Arab Emirates
        </p>
      </Container>
    </div>
  </footer>
);
