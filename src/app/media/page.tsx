import type { Metadata } from 'next';
import Link from 'next/link';
import { MediaGrid } from '@/components/media/media-grid';
import { Button } from '@/components/primitives/button';
import { ComingSoon } from '@/components/primitives/coming-soon';
import { Container } from '@/components/primitives/container';
import { getMedia } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Videos' },
] as const;

type FilterValue = (typeof FILTERS)[number]['value'];

const isFilter = (value: unknown): value is FilterValue =>
  typeof value === 'string' && FILTERS.some((filter) => filter.value === value);

export const metadata: Metadata = buildMetadata({
  title: 'Media',
  description:
    'Photos and videos of the marine equipment and outdoor adventure products supplied by WaveFighter.',
  path: '/media',
});

/**
 * ONE media page — photos and videos together, not a Gallery page and a separate Videos page.
 *
 * The type filter is a set of links, not a tab widget: no client component, no state, and
 * /media?type=video is a real, shareable, crawlable URL.
 *
 * The filter hides itself when there is nothing to filter. That is not cosmetic — three tabs
 * that all lead to the same empty page is what makes a site feel broken.
 */
export default async function MediaPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const active: FilterValue = isFilter(raw['type']) ? raw['type'] : 'all';

  const media = await getMedia();
  const items = active === 'all' ? media : media.filter((item) => item.kind === active);

  const counts = {
    all: media.length,
    photo: media.filter((item) => item.kind === 'photo').length,
    video: media.filter((item) => item.kind === 'video').length,
  } satisfies Record<FilterValue, number>;

  return (
    <Container className="py-14 sm:py-20">
      <header className="flex max-w-3xl flex-col gap-5">
        <p className="eyebrow">Media</p>
        <h1 className="text-[length:var(--text-h1)]">On the water</h1>
        <p className="text-lg leading-relaxed text-secondary">
          Photos and videos of the equipment we supply.
        </p>
      </header>

      {media.length > 0 && (
        <nav aria-label="Filter media" className="mt-10">
          <ul className="flex gap-0.5 rounded-md border border-default bg-surface p-1 sm:w-fit">
            {FILTERS.map((filter) => (
              <li key={filter.value} className="flex-1 sm:flex-none">
                <Link
                  href={filter.value === 'all' ? '/media' : `/media?type=${filter.value}`}
                  aria-current={filter.value === active ? 'true' : undefined}
                  className={cn(
                    'flex min-h-10 items-center justify-center gap-2 rounded-sm px-5 text-sm transition-colors duration-[var(--duration-fast)]',
                    filter.value === active
                      ? 'bg-brand font-semibold text-on-brand'
                      : 'text-secondary hover:bg-surface-sunken hover:text-primary',
                  )}
                >
                  {filter.label}
                  <span className="tabular text-xs opacity-70">{counts[filter.value]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-12">
        {items.length > 0 ? (
          <MediaGrid items={items} />
        ) : (
          <ComingSoon
            title="Photography and video on the way"
            description="We are putting together images and video of the equipment we supply, in use and on the water."
            action={
              <Button asChild variant="accent" size="lg">
                <Link href="/contact">Request a quote</Link>
              </Button>
            }
          />
        )}
      </div>
    </Container>
  );
}
