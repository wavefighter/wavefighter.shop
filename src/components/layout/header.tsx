'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoLink } from '@/components/brand/logo';
import { Button } from '@/components/primitives/button';
import { Container } from '@/components/primitives/container';
import { mainNav } from '@/config/nav';
import { contact, hasPhone } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { telLink } from '@/lib/utils/contact-links';

/**
 * THE HEADER.
 *
 * It is light, and that is not a default — it is the logo's requirement. The mark is
 * navy-on-blue and would vanish on a dark bar, so the bar is white and the LOGO becomes
 * the darkest, heaviest object on the page. The first thing a visitor's eye lands on is
 * the brand, at full strength, exactly as drawn.
 *
 * The hairline underneath is not a border — it is the WATERLINE: an azure segment running
 * out of the left edge into the rule, echoing the speed-lines beneath the wordmark in the
 * logo. It appears at the top of every major section on the site. One gesture, used
 * consistently, is what an identity is made of.
 *
 * WHY THIS IS A CLIENT COMPONENT (it needs a justification on this project): the mobile
 * menu needs open/closed state, close-on-navigation, and Escape-to-close. It could be
 * split into a client island inside a server Header — and if the header grows a search box
 * or a locale switcher, it should be. Today, splitting it would add a file and a props
 * boundary to save about a kilobyte.
 *
 * It is deliberately NOT a modal. The panel opens below the bar rather than over the page,
 * which makes it a disclosure. Disclosures do not need a focus trap; modals do. Choosing
 * the simpler pattern removes an entire class of accessibility bug rather than solving it.
 */
export const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* The App Router keeps the layout mounted across route changes, so without this the menu
     stays open behind the page the customer just navigated to. It never shows up in
     development on a desktop; it is found by a real person on a real phone. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-default bg-surface/90 backdrop-blur-md">
      {/* The waterline. 1px, azure for the first 56px, then the border colour. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-[linear-gradient(to_right,var(--accent)_0,var(--accent)_56px,transparent_56px)]"
      />

      <Container className="flex h-[var(--header-height)] items-center justify-between gap-8">
        <LogoLink className="h-10 w-auto sm:h-12" priority />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  /* aria-current is the accessible half of "you are here". The underline
                     conveys it to sighted users and to nobody else. */
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'nav-underline py-2 font-display text-[0.9375rem] font-medium tracking-tight transition-colors duration-[var(--duration-fast)]',
                    isActive(item.href) ? 'text-primary' : 'text-secondary hover:text-primary',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* The phone number is CONTENT, not chrome, on a site whose entire purpose is
              producing an enquiry. It renders only when a real number exists. */}
          {hasPhone && (
            <a
              href={telLink()}
              className="hidden font-sans text-sm font-medium tabular text-secondary transition-colors hover:text-accent xl:block"
            >
              {contact.phone}
            </a>
          )}

          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Request a quote</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-11 items-center justify-center rounded-md text-primary transition-colors hover:bg-surface-sunken lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Rendered only when open, rather than hidden with CSS. A `display:none` panel still
          puts five links into the tab order of every mobile page. */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-default bg-surface lg:hidden"
        >
          <Container className="py-2">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-14 items-center border-b border-default font-display text-base font-medium tracking-tight',
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-primary hover:text-accent',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 py-5">
              <Button asChild variant="accent" size="lg">
                <Link href="/contact">Request a quote</Link>
              </Button>
              {hasPhone && (
                <Button asChild variant="outline" size="lg">
                  <a href={telLink()}>{contact.phone}</a>
                </Button>
              )}
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
};
