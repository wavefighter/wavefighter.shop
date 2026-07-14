/**
 * WHO WAVEFIGHTER SUPPLIES.
 *
 * Every line is a fact the business stated about itself — its customer segments. Nothing
 * here is a claim about service, price, quality, speed or expertise, so there is nothing
 * that can later turn out to be untrue.
 *
 * This occupies the slot where "Why choose us" will eventually live, and that was a
 * deliberate call: a "Why choose us" heading above a "coming soon" panel would be the one
 * thing on the page that looked unfinished rather than intentional. The alternative —
 * filling it with "Quality Products / Best Prices / Fast Delivery" — is precisely the fake
 * content that got stripped out of this project.
 *
 * The numbering is not decoration. Numbered items read as a specification list rather than
 * a feature grid, which is the register this brand speaks in.
 */
const audiences = [
  { title: 'Boat owners', body: 'Motors, parts, accessories and safety equipment.' },
  { title: 'Fishermen', body: 'Fishing equipment, kayaks and the gear that goes with them.' },
  { title: 'Divers', body: 'Equipment for dive operations and personal diving.' },
  { title: 'Water sports', body: 'Water sports equipment and inflatables.' },
  { title: 'Marine businesses', body: 'Supply for dive centres, charter and rental operations.' },
  { title: 'Outdoor adventure', body: 'Kayaks and outdoor equipment for the water.' },
];

export const WhoWeSupply = () => (
  <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
    {audiences.map((audience, index) => (
      <li key={audience.title} className="waterline flex flex-col gap-2 pt-6">
        <span className="tabular text-xs font-semibold text-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-primary">{audience.title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-secondary">{audience.body}</p>
      </li>
    ))}
  </ul>
);
