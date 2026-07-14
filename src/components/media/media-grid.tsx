import NextImage from 'next/image';
import Link from 'next/link';
import type { MediaItem } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

/**
 * Photos and videos, one collection. The customer does not think in file formats — they think
 * "show me what you have done", and they do not care whether the answer moves.
 *
 * Videos are LINKED, not embedded. An embedded YouTube iframe downloads roughly a megabyte of
 * third-party JavaScript before anyone has decided to press play, sets cookies we would then
 * have to disclose, and forces `frame-src` into our CSP. A thumbnail that opens YouTube on
 * click costs none of that, and on a slow connection the difference IS the page.
 *
 * The play badge is not decoration: without it a video thumbnail and a photo are visually
 * identical, and the customer cannot tell which one will take them off-site.
 */
export const MediaGrid = ({ items }: { items: MediaItem[] }) => (
  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
    {items.map((item, index) => {
      const isVideo = item.kind === 'video';

      const image =
        item.kind === 'photo'
          ? { src: item.image.src, alt: item.image.alt }
          : {
              src: `https://img.youtube.com/vi/${item.video.id}/maxresdefault.jpg`,
              alt: `Video thumbnail: ${item.video.title}`,
            };

      const content = (
        <>
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-default bg-surface-sunken">
            <NextImage
              src={image.src}
              alt={image.alt}
              fill
              priority={index < 3}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className={cn(
                'object-cover',
                isVideo &&
                  'transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]',
              )}
            />

            {isVideo && (
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-surface-inverse/35 transition-colors duration-[var(--duration-base)] group-hover:bg-surface-inverse/25"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-surface/95 shadow-md transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="ms-1 size-6 text-accent" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            )}
          </div>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-secondary">{item.caption}</p>
        </>
      );

      return (
        <li key={item.id}>
          {item.kind === 'video' ? (
            <Link
              href={`https://www.youtube.com/watch?v=${item.video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              {content}
              <span className="sr-only">Opens on YouTube in a new tab</span>
            </Link>
          ) : (
            <figure className="group">{content}</figure>
          )}
        </li>
      );
    })}
  </ul>
);
