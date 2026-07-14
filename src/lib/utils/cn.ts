import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class name composition. Two jobs, and the second is the one that matters:
 *
 *   clsx     — conditional classes. cn('base', isActive && 'text-accent')
 *   twMerge  — CONFLICT resolution. cn('px-6', 'px-4') yields 'px-4', not both.
 *
 * Without twMerge, a caller passing className="w-full" to a component whose base is
 * w-auto ships both classes, and the winner is decided by their order in the generated
 * stylesheet — which is to say, at random, and differently in production than in dev.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
