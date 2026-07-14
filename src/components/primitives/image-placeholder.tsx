/**
 * WHAT SITS WHERE A PHOTOGRAPH WILL GO.
 *
 * This is currently the most-seen component on the site — there is no photography yet — so it
 * has to carry the brand rather than apologise for its absence. Get it wrong and every page
 * reads as unfinished no matter how good the header is.
 *
 * IT IS LIGHT, NOT NAVY, AND THAT IS THE WHOLE POINT.
 *
 * The first version of this was a deep navy panel. It looked strong in isolation and was wrong
 * in situ: eight category cards became a wall of black boxes, and — worse — it stole the hero's
 * authority. If navy is everywhere, navy means nothing. The deep surfaces (hero, coming-soon,
 * footer plinth) earn their weight by being RARE. So the placeholder is a pale steel panel and
 * the navy is rationed.
 *
 * THE MOTIF: three azure speed-lines, staggered, at low opacity — lifted directly from the
 * lines running out from under the wordmark in the logo. It is the one ornament in the system,
 * it comes from the mark, and it turns an empty slot into a branded one.
 *
 * The alternative — stock photography of somebody else's boat — is a small lie told on the most
 * visible part of the page.
 */
export const ImagePlaceholder = ({ label }: { label: string }) => (
  <div
    className="relative flex size-full items-center justify-center overflow-hidden bg-surface-sunken"
    role="img"
    aria-label={`${label} — photography coming soon`}
  >
    {/* The speed-lines. Skewed, staggered, and barely there. Purely decorative. */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute left-[-10%] top-[38%] h-px w-[70%] -skew-y-6 bg-accent opacity-[0.28]" />
      <span className="absolute left-[6%] top-[50%] h-px w-[52%] -skew-y-6 bg-accent opacity-[0.18]" />
      <span className="absolute left-[-4%] top-[62%] h-px w-[38%] -skew-y-6 bg-accent opacity-[0.12]" />
    </span>

    {/* A faint azure wash from the lower-left, so the panel is not a flat fill. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_80%,var(--accent-subtle)_0%,transparent_70%)]"
    />

    <span className="eyebrow relative z-10 text-center text-muted opacity-90">
      Photography
      <br />
      coming soon
    </span>
  </div>
);
