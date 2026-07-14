import type { ReactNode } from 'react';

/**
 * THE STATE THAT DECIDES WHETHER THIS SITE LOOKS SERIOUS.
 *
 * There is no product data yet, so this component is going to be seen more than almost any
 * other. That makes it the single highest-stakes piece of design on the site: get it wrong
 * and a visitor concludes the company is not ready, no matter how good the header is.
 *
 * Every alternative is worse:
 *   - Deleting the section: the page loses its structure and reads as thin.
 *   - Inventing content to fill it: the customer eventually finds out, and then everything
 *     else on the page becomes suspect.
 *   - "No data" / an error box: reads as broken software, not as a company opening.
 *
 * So this is a DESIGNED state, built from the same parts as everything else — a navy
 * instrument panel with the hull gradient, the waterline, the eyebrow. It says "we are
 * opening", not "this is missing". A visitor should read it as restraint.
 */
export const ComingSoon = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="on-dark hull relative flex flex-col items-center gap-5 overflow-hidden rounded-xl px-6 py-20 text-center sm:py-24">
    {/* Waterline across the top — the same rule that opens every section on the site. */}
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,var(--accent-on-dark)_20%,var(--accent-on-dark)_80%,transparent)]"
    />

    <p className="eyebrow eyebrow-inverse">Coming soon</p>

    <h3 className="max-w-xl text-[length:var(--text-h2)] text-inverse">{title}</h3>

    <p className="max-w-md text-base leading-relaxed text-inverse-muted">{description}</p>

    {action && <div className="mt-3">{action}</div>}
  </div>
);
