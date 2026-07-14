/**
 * Tailwind v4 runs as a PostCSS plugin. Without this file, globals.css imports
 * successfully and applies absolutely nothing — which looks like a broken
 * stylesheet rather than a missing config, and costs an hour to find.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
