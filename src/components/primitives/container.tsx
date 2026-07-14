import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Every page's horizontal rhythm comes from here.
 *
 * The gutters are generous — 20px on a phone, 40px from the tablet up. That whitespace is not
 * wasted: it is the difference between a catalogue that reads as premium and one that reads as
 * a parts list. Cramped gutters are the fastest way to make a well-designed page look cheap,
 * and they are what almost every template gets wrong.
 */
export const Container = ({
  as: Component = 'div' as ElementType,
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) => (
  <Component
    className={cn('mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-10', className)}
  >
    {children}
  </Component>
);
