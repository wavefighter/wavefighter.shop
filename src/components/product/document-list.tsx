import type { ProductDocument } from '@/lib/content';

const formatSize = (bytes: number): string => `${(bytes / 1_000_000).toFixed(1)} MB`;

/**
 * Datasheets and manuals.
 *
 * The file type and size are stated up front, and the link announces that it opens in a new
 * tab. Someone on a phone, on a boat, with two bars of signal deserves to know they are about
 * to pull down a 3MB PDF before they tap it.
 */
export const DocumentList = ({ documents }: { documents: ProductDocument[] }) => {
  if (documents.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {documents.map((document) => (
        <li key={document.file}>
          <a
            href={document.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-16 items-center justify-between gap-4 rounded-lg border border-default bg-surface px-5 transition-colors duration-[var(--duration-fast)] hover:border-accent hover:bg-surface-sunken"
          >
            <span className="flex items-center gap-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent"
              >
                <path d="M11 2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-5-5Z" />
                <path d="M11 2v5h5" />
              </svg>
              <span className="text-[0.9375rem] font-medium text-primary">{document.label}</span>
            </span>

            <span className="tabular shrink-0 text-xs uppercase tracking-wide text-muted">
              {document.type} &middot; {formatSize(document.sizeBytes)}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};
