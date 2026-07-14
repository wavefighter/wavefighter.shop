import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { JsonLd } from '@/components/seo/json-ld';
import { site } from '@/config/site';
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import './globals.css';

/**
 * TWO FACES, EACH WITH A JOB.
 *
 * Archivo (display). A wide grotesque. The logo's wordmark is a heavy, wide italic — the
 * body face must not compete with it, but the HEADLINES should share its breadth or the
 * page will feel like it belongs to a different company than the mark at the top of it.
 * Archivo carries that width without imitating the italic, which would have been mimicry
 * rather than identity.
 *
 * IBM Plex Sans (text and UI). Engineered, quiet, and with the best tabular figures on
 * Google Fonts. This is an equipment catalogue: horsepower, lengths, weights and
 * capacities ARE the content, and a spec column set in a face with proportional digits
 * cannot be scanned down. Choosing a text face for its numerals rather than its letters is
 * the sort of decision that separates a brand from a template.
 *
 * Both are variable, subset to latin, and self-hosted by next/font — one file each, no
 * layout shift, no render-blocking request to a third party.
 */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: '/brand/wavefighter-logo-header.png',
    apple: '/brand/wavefighter-logo-header.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${archivo.variable} ${plex.variable}`}>
      <body className="flex min-h-dvh flex-col bg-surface text-primary antialiased">
        {/* Site-wide structured data, declared once. `localBusinessJsonLd()` returns null
            until a real address is configured and is filtered out — we never assert
            something about this business that we have not been told. */}
        <JsonLd
          data={[organizationJsonLd(), localBusinessJsonLd(), websiteJsonLd()].filter(
            (entry): entry is Record<string, unknown> => entry !== null,
          )}
        />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
