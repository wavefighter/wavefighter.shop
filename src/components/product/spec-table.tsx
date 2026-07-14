import type { SpecGroup } from '@/lib/content';

/**
 * THE SPEC TABLE — and on an equipment site, this is not a detail. It is the moment a
 * customer decides whether you are a real supplier or a reseller with a website.
 *
 * So it is treated as engineering documentation: an instrument-label heading, hairline rules,
 * tabular figures, generous row height. Numbers align down the column because they are set in
 * a face with proper tabular digits — a spec column set in proportional numerals is
 * genuinely unreadable, and nobody can articulate why.
 *
 * A real <table>, because this IS tabular data and a screen-reader user needs the row header
 * read alongside the value. A grid of divs looks identical and tells them nothing.
 */

/** Group titles are human copy ("Fuel and electrical") and cannot be DOM ids directly:
 *  spaces and ampersands make the aria-labelledby reference invalid, and the section
 *  silently loses its accessible name. */
const toId = (value: string): string =>
  `spec-${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

export const SpecTable = ({ groups }: { groups: SpecGroup[] }) => {
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={toId(group.title)} className="waterline pt-5">
          <h3 id={toId(group.title)} className="eyebrow">
            {group.title}
          </h3>

          <table className="spec mt-5 w-full border-collapse text-left">
            <tbody>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-b border-default last:border-0">
                  <th
                    scope="row"
                    className="py-4 pr-8 align-top text-[0.9375rem] font-normal text-secondary"
                  >
                    {row.label}
                  </th>
                  <td className="py-4 text-right text-[0.9375rem] font-semibold text-primary sm:text-left">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
};
