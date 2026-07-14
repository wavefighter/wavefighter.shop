# WaveFighter — Brand System

Everything in this document was **derived from the logo**. Nothing was chosen because it looked
nice next to it.

---

## 1. The mark

The logo is used **exactly as supplied**. No redraw, no recolour, no simplification, no change of
proportion or angle. The only preparation applied was cutting it out of its white JPEG background
(`public/brand/wavefighter-logo.png`) so it can sit on a surface. The ink is untouched.

### The rule the mark imposes on the whole site

> **The mark is navy-on-blue. It cannot go on a dark surface — it disappears.**

This is not a preference. It is a fact of the artwork, and it decided the architecture of the
entire site:

- The **header is light**, so the logo can live in it at full strength.
- The **footer's upper band is light**, for the same reason.
- The **navy is rationed** — hero, coming-soon panels, footer plinth. Nowhere else.

Most marine sites go dark. This one cannot, and it is better for it: a light-led site with deep
navy instrument bands reads as a chartplotter, not as a boat advert.

A white knockout version of the logo would have solved the constraint — and would have been the
wrong answer. This logo's navy **is** the brand.

---

## 2. Colour — sampled, not chosen

Two colours make up 69% of the artwork:

| | Hex | Share of the mark | Where it lives |
|---|---|---|---|
| **Abyss** | `#031E3E` | 51% | Hull, "WAVE" wordmark, dark spray |
| **Azure** | `#015AB6` | 18% | "FIGHTER" wordmark, blue spray, speed-lines |

Both sit at **hue 210–213 at very high saturation**. That is the whole brand: **one hue, two
depths.**

The ramps in `src/styles/tokens.css` are anchored so that `--wf-abyss-900` *is* the logo's navy and
`--wf-azure-600` *is* the logo's blue. Even the neutrals (`--wf-steel-*`) carry hue 210 at low
saturation, so the greys belong to the mark rather than sitting beside it.

**There is no orange, and there is no second hue.** The discipline is the identity: a marine
instrument brand does not need a warm accent to look expensive, it needs conviction.

### Azure is rationed

With the orange gone, azure carries the CTA. If links, active states *and* buttons were all azure,
nothing would be emphatic. So azure appears on: the primary action, the active nav state, links,
the eyebrow, and the waterline. **Nowhere else.** Scarcity is what makes an accent an accent.

### Every pair is measured

| Pair | Ratio | Gate |
|---|---|---|
| Body text on white | 16.5:1 | ✅ |
| Secondary on white | 6.3:1 | ✅ |
| Muted on white | 4.7:1 | ✅ (this is why muted is darker than it "wants" to be) |
| Link (azure-700) on white | 8.9:1 | ✅ |
| White on the CTA (azure-600) | 6.7:1 | ✅ |
| Azure-300 on the navy band | 7.8:1 | ✅ |

Nothing under 4.5:1 for body text ships.

### The one permitted exception

**WhatsApp green is never restyled.** Its recognisability is the trust signal; repainting it azure
would be a designer's win and a customer's loss. It is the only non-brand hue on the site, and it
is permitted because it is not ours to change.

---

## 3. Typography — two faces, each with a job

**Archivo** (display). A wide grotesque. The logo's wordmark is a heavy, wide italic — the
headlines must share its *breadth* or the page will feel like it belongs to a different company
than the mark at the top of it. Archivo carries that width without imitating the italic, which
would have been mimicry rather than identity.

**IBM Plex Sans** (text and UI). Engineered, quiet, and with the best tabular figures on Google
Fonts. This is an equipment catalogue: horsepower, lengths, weights and capacities **are** the
content, and a spec column set in a face with proportional digits cannot be scanned down.
*Choosing a text face for its numerals rather than its letters is what separates a brand from a
template.*

Both are variable, subset to latin, self-hosted by `next/font`. No layout shift, no third-party
request.

---

## 4. The waterline — the one signature element

The logo has short blue speed-lines running out from beneath the wordmark. That gesture,
abstracted, is the **waterline**: a hairline rule that begins as a solid azure segment and fades
into the border colour. It opens the header, every major section, every fieldset, every spec group.

It also appears as the three staggered, skewed azure lines inside every image placeholder.

**One idea, used consistently, is what an identity is.** Six ideas used once each is what a
template is.

---

## 5. Motion

Premium motion is **fast** and **small**. Anything you can consciously watch is too slow; anything
you can see travel across the screen is too much.

| Interaction | Movement |
|---|---|
| Card hover | 2px lift + shadow + border warms to azure, 200ms |
| Nav link | Underline grows from the left, 200ms |
| Button press | 1px down. You feel it; you never see it |
| Hero, on load | 12px rise, 360ms, staggered, **once** |
| Arrows | 2px slide on hover |

**Nothing animates on scroll.** Scroll-triggered reveals cost JavaScript, delay the LCP, and make
a catalogue feel like a landing page instead of a tool. Everything above is CSS-only and is
disabled outright under `prefers-reduced-motion`.

---

## 6. Rebranding is one file

Components never touch the raw ramps — a developer *cannot* write `bg-abyss-900`, because that
class does not exist. They speak only in meaning: `bg-surface`, `text-muted`, `bg-accent`.

Change `src/styles/tokens.css` and the entire site repaints. Consistency by construction beats
consistency by code review.
