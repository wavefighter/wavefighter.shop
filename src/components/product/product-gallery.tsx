'use client';

import NextImage from 'next/image';
import { useState } from 'react';
import { ImagePlaceholder } from '@/components/primitives/image-placeholder';
import type { Image } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

/**
 * On this site the photograph IS the product page — the customer decides with their eyes and
 * confirms with the spec table.
 *
 * Performance, in order of how much each matters:
 *   - The first image is `priority`. It is the LCP element on every product page, and
 *     everything else about this page's speed is downstream of that one line.
 *   - `sizes` is stated honestly (full width on mobile, half on desktop) so a phone fetches a
 *     ~700px image rather than a 1600px one.
 *   - Thumbnails are small and lazy. They are navigation, not content.
 *
 * Accessibility: real <button>s in a real list, so Tab and Enter work with no keyboard code
 * of our own. A div with an onClick would need role, tabindex and key handlers to arrive at
 * exactly the same place.
 */
export const ProductGallery = ({
  images,
  productName,
}: {
  images: Image[];
  productName: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  // A product may be published before its photography exists. The page still works; it says so
  // honestly rather than rendering a broken image or collapsing the layout.
  if (!active) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-default">
        <ImagePlaceholder label={productName} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-default bg-surface-sunken">
        <NextImage
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label={`${productName} images`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                aria-current={index === activeIndex}
                className={cn(
                  'relative block aspect-4/3 w-full overflow-hidden rounded-md border-2 transition-colors duration-[var(--duration-fast)]',
                  index === activeIndex
                    ? 'border-accent'
                    : 'border-default hover:border-strong',
                )}
              >
                {/* alt="" — the button already carries an accessible name that includes this
                    image's description. Announcing it twice is noise. */}
                <NextImage
                  src={image.src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="140px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
