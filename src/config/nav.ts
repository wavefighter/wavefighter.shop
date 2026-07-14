export type NavItem = { href: string; label: string };

/**
 * Five items. It stays five.
 *
 * Every navigation that ends up with eleven items started with five and a series of
 * individually reasonable requests. The catalogue is where products are found; the nav
 * is only how people orient themselves.
 *
 * Shared by the header and the footer, so the two can never disagree about what this
 * site contains.
 */
export const mainNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/media', label: 'Media' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
