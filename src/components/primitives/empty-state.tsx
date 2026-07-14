import type { ReactNode } from 'react';

/**
 * What a customer sees when their FILTERS match nothing.
 *
 * Deliberately distinct from ComingSoon, and light rather than navy: this is a recoverable
 * dead end inside a working catalogue, not a section awaiting content. Dressing it in the
 * full instrument-panel treatment would give it a gravity it has not earned, and would
 * imply the catalogue is empty when it is not.
 *
 * `action` is REQUIRED, not optional. This component cannot be rendered without giving the
 * person a way out. "No results found." full stop is how you lose someone who was three
 * clicks from an enquiry.
 */
export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-4 rounded-xl border border-default bg-surface-sunken px-6 py-16 text-center">
    <h2 className="text-xl font-semibold text-primary sm:text-2xl">{title}</h2>
    <p className="max-w-md text-base leading-relaxed text-secondary">{description}</p>
    <div className="mt-2">{action}</div>
  </div>
);
