import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { Container } from '@/components/primitives/container';

/**
 * THE HERO — the navy instrument band.
 *
 * There is no photograph, and that is a decision rather than a gap. The only image
 * available today would be stock — someone else's boat at someone else's sunset — and
 * placeholder imagery on the first screen is a small lie told at maximum volume.
 *
 * So the hero is built from the brand itself: the hull gradient (a water column, deepening
 * downward), the waterline, the eyebrow, and type at full display weight. It reads as an
 * instrument panel, which is exactly the register a marine equipment company should open
 * in. When real photography arrives it slots in behind this content as a priority <Image>
 * and becomes the LCP element — and not one line of this file changes.
 *
 * ONE primary CTA. "View catalogue" is secondary and visibly so, because a customer who
 * does not yet know what they want is not ready to start a conversation — they want to look
 * first. Two buttons of equal weight is not twice the conversion; it is a decision the
 * visitor has to make before they can act, and some of them leave instead.
 *
 * The content rises on load — 12px, 360ms, once, CSS-only, disabled under
 * prefers-reduced-motion. Nothing on this site animates on scroll: it costs JavaScript,
 * delays the LCP, and makes a catalogue feel like a landing page instead of a tool.
 */
export const Hero = () => (
  <section className="on-dark hull relative overflow-hidden">
    {/* The waterline, at the very top of the band. */}
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,var(--accent-on-dark)_0,var(--accent-on-dark)_120px,var(--border-inverse)_120px,var(--border-inverse)_100%)]"
    />

    {/* A single wide, very low-opacity azure sweep across the lower band — the wake. It is
        barely visible, and that is the point: you should not be able to name it, only feel
        that the surface is not flat. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(80%_100%_at_50%_100%,rgb(29_138_252/0.14)_0%,transparent_70%)]"
    />

    <Container className="relative flex flex-col gap-10 py-24 sm:py-32 lg:py-40">
      <div className="flex max-w-4xl flex-col gap-7">
        <p className="eyebrow eyebrow-inverse rise">Marine equipment &middot; United Arab Emirates</p>

        <h1 className="rise rise-1 text-[length:var(--text-display)] text-inverse">
          Built for the water.
          <br />
          <span className="text-accent-on-dark">Supplied for the long run.</span>
        </h1>

        <p className="rise rise-2 max-w-2xl text-lg leading-relaxed text-inverse-muted sm:text-xl">
          Outboard motors, inflatable boats, kayaks, fishing equipment, marine accessories,
          safety equipment, boat parts and water sports equipment &mdash; for boat owners,
          fishermen, divers, water sports enthusiasts and marine businesses across the UAE.
        </p>
      </div>

      <div className="rise rise-3 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
          <Link href="/contact">Request a quote</Link>
        </Button>
        <Button asChild variant="inverse-outline" size="lg" className="w-full sm:w-auto">
          <Link href="/products">View catalogue</Link>
        </Button>
      </div>
    </Container>
  </section>
);
