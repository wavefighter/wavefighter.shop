import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * VERTICAL RHYTHM LIVES HERE, AND ONLY HERE.
 *
 * Every section on the site uses this component, so the spacing between sections is a
 * single number in a single file. The alternative — each page choosing its own py-16 or
 * py-20 — is how a design system quietly dies over eighteen months of individually
 * reasonable commits.
 *
 * The section header is a three-part instrument label: EYEBROW (uppercase, wide-tracked,
 * azure) → TITLE (display face) → DESCRIPTION. That structure is what makes a page read as
 * a document produced by a company rather than as a stack of divs. The eyebrow is the piece
 * most sites skip, and it is the piece doing the most work: it gives every section a
 * category before the visitor has read a word of it.
 *
 * `waterline` draws the signature azure hairline across the top — the logo's speed-lines,
 * abstracted into a rule.
 */
export const Section = ({
  eyebrow,
  title,
  description,
  action,
  waterline = false,
  inverse = false,
  className,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  waterline?: boolean;
  inverse?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={cn(
      'py-16 sm:py-24',
      waterline && 'waterline',
      waterline && inverse && 'waterline-inverse',
      className,
    )}
  >
    {(eyebrow || title || action) && (
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className={cn('eyebrow mb-4', inverse && 'eyebrow-inverse')}>{eyebrow}</p>
          )}
          {title && (
            <h2
              className={cn(
                'text-[length:var(--text-h2)]',
                inverse ? 'text-inverse' : 'text-primary',
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                'mt-4 text-base leading-relaxed sm:text-lg',
                inverse ? 'text-inverse-muted' : 'text-secondary',
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    )}
    {children}
  </section>
);
