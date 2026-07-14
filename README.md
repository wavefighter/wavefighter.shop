# WaveFighter

Marine equipment & outdoor adventure products, UAE.

**Not an e-commerce site.** No cart, no checkout, no payments, no accounts. Every page exists
to turn a visitor into a qualified enquiry — WhatsApp, phone, or the contact form.

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · React 19.

---

## Run it

Requires **Node.js 20.9+** (a hard requirement of Next.js 16).

```bash
npm install
npm run dev
```

```bash
npm run build   # validates content, then builds. Passes with an empty catalogue.
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Content validation, then production build |
| `npm run verify` | Typecheck + lint + content validation |

---

## No fake data. Anywhere.

There is **no placeholder content in this repository**. Not a sample phone number, not a stock
photo, not an invented product spec, not a "trusted by 500 customers" statistic.

That is structural, not a promise:

- **Contact details come from environment variables**, defaulting to empty. There is no fake
  number in the code to accidentally ship.
- **Every channel is conditional.** No WhatsApp number → no WhatsApp button. No phone → no
  `tel:` link. A button with nothing behind it is a dead end that looks like a working one,
  which is worse than an absent button.
- **The contact form only renders when email delivery is configured.** A form that silently
  swallows enquiries is the most damaging thing this site could do: the customer believes they
  have reached you, and waits.
- **Structured data omits what it does not know.** No `"telephone": ""` asserted to Google, and
  no `LocalBusiness` schema until there is a real address.
- **No stock photography.** Missing images render a quiet "photo coming soon" tile that reserves
  the correct aspect ratio. Stock imagery of somebody else's boat is a small lie told on the most
  visible part of the page.

**The site deploys and works with none of it set.** It shows the eight real product categories,
marked "coming soon", and asks the visitor to get in touch. That is honest and complete — not
broken.

---

## Deploying to Vercel

1. Push to a Git repository and import it in Vercel. Framework preset: **Next.js**. No build
   settings to change.
2. Add the environment variables you have (**Settings → Environment Variables**). See
   `.env.example` — all optional.
3. Deploy. It will succeed with zero variables set.

Set `NEXT_PUBLIC_SITE_URL` to your production domain once it is live, or canonical URLs and the
sitemap will point at the default.

---

## The launch checklist

See the end of the handover message, or `.env.example`. In short: contact details make the site
contactable; a real address makes it eligible for local search; products make it a catalogue.

---

## Adding a product

Append an object to `src/lib/content/providers/local/data/products.ts` — the file has a
worked template in its header comment.

That is the entire procedure. The home page, catalogue, category pages, related products,
sitemap and static routes all derive from that array. `npm run validate:content` refuses the
build if a category or brand ID does not resolve, a slug is duplicated, or an image is
referenced but missing from `public/`.

**The build validator no longer blocks on placeholders** — there are none. It still enforces
structural integrity, which is what lets you add products yourself and know a broken one cannot
reach a customer.

Categories and brands work the same way, in `categories.ts` / `brands.ts`.

---

## The one architectural rule

**Nothing imports from `src/lib/content/providers/`. Ever.**

Pages and components import from `@/lib/content` and never reach past it. ESLint enforces it, because
a boundary maintained by good intentions is not a boundary.

That rule is what makes the CMS migration a non-event: when the catalogue outgrows local files,
add `providers/sanity/`, satisfy the same `ContentRepository` interface, change one line in
`src/lib/content/index.ts`. No page changes. No component changes. It is also why every
repository method is `async` today even though the data is synchronous.

---

## Brand & design system

**See [BRAND.md](./BRAND.md)** — the palette is sampled from the logo, the type is chosen to sit
with it, and the constraints the mark imposes on the site are documented there.

`src/styles/tokens.css`, in two layers:

- **Primitives** (`--wf-*`) — the raw palette. Components never touch these.
- **Semantics** (`--surface`, `--accent`, `--border`…) — meaning. The only thing exposed to
  Tailwind.

A developer cannot write `bg-abyss-900` — that class does not exist. **Rebranding is a change to
one file.** The exception is WhatsApp green, never restyled: its recognisability is the trust
signal.

The logo lives at `public/brand/`. It is used exactly as supplied — the only preparation was
cutting it out of its white background. **It cannot be placed on a dark surface** (it is
navy-on-blue and disappears), which is why the header and footer are light. See BRAND.md.

---

## Notable decisions

**Products live at `/products/[slug]`, not `/products/[category]/[slug]`.** Recategorise a
product and its URL would change, breaking every link a customer has in a WhatsApp thread. Flat
URLs are permanent; `BreadcrumbList` structured data carries the hierarchy.

**The URL is the filter state.** No client store. Filtering runs on the server, every filter
combination is a real crawlable URL, the back button works for free, and the filter panel ships
zero JavaScript — every option is a link. Filtered URLs are `noindex, follow` so facet
permutations never bury the pages that matter.

**Videos are linked, not embedded.** A YouTube iframe pulls ~1MB of third-party JavaScript before
anyone presses play.

**`Product` structured data carries no `offers`.** No prices are published, and inventing them to
win a rich-result badge would mean marking up something untrue.

**Client components are the exception.** The whole site ships three: header (mobile menu),
product gallery, contact form.
