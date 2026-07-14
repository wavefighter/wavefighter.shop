/**
 * "Why choose us" — the reasons a customer should buy from WaveFighter.
 *
 * Deliberately EMPTY.
 *
 * Anything written here is a claim, and a claim we cannot stand behind is worse than an absent
 * section: a customer reads "fast delivery, best prices, expert support", recognises it as the
 * same copy every other supplier uses, and quietly concludes the rest of the page is padding
 * too. Generic reassurance does not reassure.
 *
 * The section on the home page and the About page renders ONLY when this array has entries, so
 * the site is complete and honest with it empty.
 *
 * To fill it in: add 3–4 things that are true, specific, and that a competitor could not copy
 * onto their own site without lying. "We hold parts locally" is one of those, IF you do.
 *
 * Example shape:
 *   { title: 'Parts held in Dubai', body: 'Servicing and spares without an overseas order.' }
 */
export type ValueProp = {
  title: string;
  body: string;
};

export const valueProps: ValueProp[] = [];
