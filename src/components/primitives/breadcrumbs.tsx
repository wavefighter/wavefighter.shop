import Link from 'next/link';

/**
 * Visual breadcrumbs. Their structured-data twin is emitted by `breadcrumbJsonLd` from the
 * same array, so what a customer sees and what Google reads cannot drift apart.
 *
 * This is what carries the category hierarchy that our deliberately flat product URLs do not
 * encode. Products live at /products/[slug] rather than /products/[category]/[slug] so that
 * recategorising a product never breaks a link a customer already holds.
 */
export const Breadcrumbs = ({ items }: { items: { name: string; path: string }[] }) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li key={item.path} className="flex items-center gap-2.5">
            {isLast ? (
              <span aria-current="page" className="text-secondary">
                {item.name}
              </span>
            ) : (
              <>
                <Link
                  href={item.path}
                  className="transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  {item.name}
                </Link>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 8 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-2.5 text-muted"
                >
                  <path d="M2 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
