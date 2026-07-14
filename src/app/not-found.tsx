import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { Container } from '@/components/primitives/container';

/**
 * A 404 is a moment for direction, not an apology.
 *
 * The customer arrived here because a link was wrong — probably ours. The only useful thing
 * this page can do is put them back into the catalogue in one tap, so that is the only thing
 * it does.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-[length:var(--text-h1)]">This page isn&rsquo;t here</h1>
      <p className="max-w-md text-base leading-relaxed text-secondary">
        The page you were looking for has moved, or never existed. The catalogue is the best
        place to pick things up again.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="accent" size="lg">
          <Link href="/products">View catalogue</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </Container>
  );
}
