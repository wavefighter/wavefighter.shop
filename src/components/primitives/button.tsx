import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * THE ONE BUTTON. Every button on the site is this component.
 *
 * Variants are named for what they MEAN, never for what they look like. `accent` is "the
 * primary action on this page" — not "the blue one". When the palette moves, no variant
 * name becomes a lie and no page has to change.
 *
 * With the orange gone, azure now carries the CTA. That places a real constraint on the
 * rest of the system: if links, active states AND buttons are all azure, nothing is
 * emphatic. So azure is rationed — it appears on the primary action, on the active nav
 * state, on links, and on the waterline. Nowhere else. Scarcity is what makes an accent
 * an accent.
 *
 * Height is 44px minimum at EVERY size, including `sm`. The audience is standing on a boat
 * holding a phone with wet hands. A 32px button is a design decision that costs enquiries.
 */
type Variant = 'accent' | 'brand' | 'outline' | 'ghost' | 'inverse' | 'inverse-outline' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-md ' +
  'font-display font-semibold tracking-tight whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow,transform] ' +
  'duration-[var(--duration-fast)] ease-[var(--ease-out)] ' +
  'active:translate-y-px ' +   /* 1px press. You feel it; you never see it. */
  'disabled:pointer-events-none disabled:opacity-45 ' +
  'min-h-11';

const variants: Record<Variant, string> = {
  /* The CTA. The logo's own blue. */
  accent: 'bg-accent text-on-accent hover:bg-accent-hover hover:shadow-md',
  /* The authoritative fill — the hull navy. Used where an action is important but is not
     THE action, and on dark-on-light contrast-heavy surfaces. */
  brand: 'bg-brand text-on-brand hover:bg-brand-hover hover:shadow-md',
  outline: 'border border-strong bg-surface text-primary hover:border-accent hover:text-accent',
  ghost: 'text-secondary hover:bg-surface-sunken hover:text-primary',
  /* For the navy instrument bands. */
  inverse: 'bg-surface text-primary hover:bg-surface-sunken',
  'inverse-outline':
    'border border-inverse-line bg-transparent text-inverse hover:border-accent-on-dark hover:text-accent-on-dark',
  /* WhatsApp green is never restyled to fit the palette. Its recognisability IS the trust
     signal — repainting it azure would be a designer's win and a customer's loss. It is the
     one permitted exception to the single-hue rule, permitted because it is not ours. */
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-hover hover:shadow-md',
};

const sizes: Record<Size, string> = {
  sm: 'h-11 px-4 text-[0.875rem]',
  md: 'h-12 px-6 text-[0.9375rem]',
  lg: 'h-14 px-8 text-base',
};

/** Exported so an element that cannot be a Button can still borrow its appearance without
 *  someone copying the class string into a one-off — which is how a design system forks. */
export const buttonStyles = ({
  variant = 'accent',
  size = 'md',
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string => cn(base, variants[variant], sizes[size], className);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /**
   * Render the child element with the button's styling instead of emitting a <button>.
   * This is how a Next <Link> becomes a button. Wrapping one in the other would nest an
   * <a> inside a <button> — invalid HTML that breaks keyboard and screen-reader users.
   */
  asChild?: boolean;
};

export const Button = ({
  className,
  variant = 'accent',
  size = 'md',
  asChild = false,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  const classes = buttonStyles({ variant, size, className });

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};
