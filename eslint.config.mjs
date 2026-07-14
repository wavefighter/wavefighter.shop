import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * `next lint` was removed in Next.js 16 — ESLint is run directly (`npm run lint`).
 *
 * The boundary rule below is the most load-bearing line in this config.
 *
 * `lib/content` is the seam that lets us move from local TypeScript files to Sanity
 * or Payload without touching a single page or component. That seam only holds if
 * nothing reaches past it. Discipline erodes over five years; lint does not.
 */
export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/content/providers/*', '**/content/providers/*'],
              message:
                'Import from "@/lib/content" only. The content provider is an implementation detail — reaching into it breaks the CMS migration path.',
            },
          ],
        },
      ],
    },
  },
  {
    // The content layer is allowed to know about its own providers.
    files: ['src/lib/content/**', 'scripts/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
];
