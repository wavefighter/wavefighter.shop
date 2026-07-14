/**
 * Renders the product description.
 *
 * There is no markdown library here, and that is a decision rather than an omission. The
 * descriptions we author are paragraphs of plain prose; `react-markdown` would add tens of
 * kilobytes to a page whose whole promise is speed on a mobile connection, to support
 * formatting nobody is using.
 *
 * If a real editorial need for lists, links or emphasis appears, THIS is the one component
 * that changes — and it changes once. That is the point of it being a component rather than a
 * `.map()` inlined in the page.
 */
export const ProductDescription = ({ description }: { description: string }) => (
  <div className="flex flex-col gap-5">
    {description
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-secondary">
          {paragraph}
        </p>
      ))}
  </div>
);
