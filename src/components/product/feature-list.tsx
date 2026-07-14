export const FeatureList = ({ features }: { features: string[] }) => {
  if (features.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex gap-3 text-[0.9375rem] leading-relaxed text-secondary"
        >
          {/* Decorative, hidden from screen readers — the list semantics already convey that
              these are separate items, and announcing a tick before each one is noise. */}
          <svg
            viewBox="0 0 20 20"
            className="mt-1 size-4 shrink-0 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            aria-hidden="true"
          >
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};
