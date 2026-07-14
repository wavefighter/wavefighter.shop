import { valueProps } from '@/config/value-props';

/**
 * "Why choose us" — renders nothing while `config/value-props.ts` is empty, which it is,
 * deliberately, until the business supplies claims that are actually true.
 *
 * A claim we cannot stand behind is worse than an absent section: the customer recognises
 * the same generic reassurance every competitor uses and discounts the whole page. An
 * absent section costs nothing. A false one costs trust, and trust is the entire product.
 *
 * Same visual grammar as WhoWeSupply — numbered, waterlined — so that when this section
 * appears, it takes over the slot without the page changing shape.
 */
export const ValueProps = () => {
  if (valueProps.length === 0) return null;

  return (
    <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
      {valueProps.map((prop, index) => (
        <li key={prop.title} className="waterline flex flex-col gap-2 pt-6">
          <span className="tabular text-xs font-semibold text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-primary">{prop.title}</h3>
          <p className="text-[0.9375rem] leading-relaxed text-secondary">{prop.body}</p>
        </li>
      ))}
    </ul>
  );
};
