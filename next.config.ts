import type { NextConfig } from 'next';

/**
 * Content-Security-Policy.
 *
 * This site has no auth, no payments and no customer accounts — but it does have a
 * public contact form, which is exactly why the headers are strict rather than
 * decorative. There is no `frame-src` for video: the media page links out to
 * YouTube rather than embedding it, so no third-party frame is ever loaded and no
 * third-party script ever runs on this origin.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.youtube.com",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Sized to our actual breakpoints rather than Next's defaults: fewer variants
    // generated, fewer bytes shipped to a phone on a weak connection.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384],
    remotePatterns: [
      // YouTube thumbnails on the media page. Facade images only — no embeds.
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
    ],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
